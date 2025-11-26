import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { storage } from "@/lib/storage";
import { getTodayKey } from "@/lib/extension-utils";
import { useEffect, useState } from "react";
import { DailyData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { format } from "date-fns";
import { AnimatedPageWrapper } from "@/components/ui/AnimatedPageWrapper";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/dashboard/DatePicker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Daily() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyData, setDailyData] = useState<DailyData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await storage.getData();
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      setDailyData(data[dateKey] || {});
      setLoading(false);
    };
    loadData();
  }, [selectedDate]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-screen">Loading...</div></DashboardLayout>;

  const chartData = Object.entries(dailyData)
    .map(([domain, stats]) => ({
      domain: domain.length > 12 ? domain.substring(0, 10) + '..' : domain,
      fullDomain: domain,
      minutes: Math.round(stats.activeTime / 60),
      visits: stats.visits
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10);

  return (
    <DashboardLayout>
      <AnimatedPageWrapper>
        <div className="mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block mb-2">
                  Daily View
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground font-medium">
                  {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
              
              <div className="w-full md:w-auto">
                <DatePicker date={selectedDate} setDate={setSelectedDate} className="w-full md:w-[240px]" />
              </div>
            </div>
          </motion.div>
        </div>

        <ChartCard title="Time Spent per Website" subtitle="Top 10 sites today (minutes)" delay={0.2}>
          {chartData.length > 0 ? (
            <div className="h-64 sm:h-96 md:h-[450px] lg:h-[550px] w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="domain" 
                    tick={{fontSize: 11, fontWeight: 500}} 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.03)', radius: 8}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.8)' }}
                    formatter={(value, name, props) => [value, name === 'minutes' ? 'Time (min)' : name]}
                  />
                  <Bar dataKey="minutes" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 sm:h-96 md:h-[450px] lg:h-[550px] flex items-center justify-center text-muted-foreground text-sm">
              No data yet. Start browsing!
            </div>
          )}
        </ChartCard>
      </AnimatedPageWrapper>
    </DashboardLayout>
  );
}
