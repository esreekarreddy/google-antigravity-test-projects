import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";
import { StorageData } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { subDays, format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { AnimatedPageWrapper } from "@/components/ui/AnimatedPageWrapper";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Weekly() {
  const [weekPreset, setWeekPreset] = useState<string>("this-week");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [historyData, setHistoryData] = useState<StorageData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await storage.getData();
      setHistoryData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-screen">Loading...</div></DashboardLayout>;

  // Calculate date range based on preset or custom selection
  let startDate: Date;
  let endDate: Date;
  
  if (weekPreset === "this-week") {
    startDate = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
    endDate = endOfWeek(new Date(), { weekStartsOn: 0 });
  } else if (weekPreset === "last-week") {
    const lastWeekDate = subDays(new Date(), 7);
    startDate = startOfWeek(lastWeekDate, { weekStartsOn: 0 });
    endDate = endOfWeek(lastWeekDate, { weekStartsOn: 0 });
  } else {
    // Custom range
    startDate = customStartDate || startOfWeek(new Date(), { weekStartsOn: 0 });
    endDate = addDays(startDate, 6);
  }

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startDate, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = historyData[dateKey] || {};
    
    const totalTime = Object.values(dayData).reduce((acc, curr) => acc + curr.activeTime, 0);
    
    return {
      date: format(date, 'EEE'),
      fullDate: dateKey,
      hours: Number((totalTime / 3600).toFixed(1))
    };
  });

  return (
    <DashboardLayout>
      <AnimatedPageWrapper>
        <div className="mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
                Weekly Trends
              </h1>
              <div className="flex flex-wrap gap-2">
                <Select value={weekPreset} onValueChange={setWeekPreset}>
                  <SelectTrigger className="w-[160px] rounded-xl">
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {weekPreset === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal rounded-xl", !customStartDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, 'PPP') : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-white/20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-2xl animate-in fade-in-0 zoom-in-95" align="end">
                      <Calendar 
                        mode="single" 
                        selected={customStartDate} 
                        onSelect={setCustomStartDate} 
                        initialFocus 
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </p>
          </motion.div>
        </div>

        <ChartCard title="Daily Screen Time" subtitle="Hours spent per day" delay={0.2}>
          <div className="h-64 sm:h-96 md:h-[450px] lg:h-[550px] w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} tick={{fontSize: 12, fontWeight: 500}} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} tick={{fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.8)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </AnimatedPageWrapper>
    </DashboardLayout>
  );
}
