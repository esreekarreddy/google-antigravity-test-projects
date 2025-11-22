import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";
import { StorageData } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { subDays, format } from "date-fns";
import { AnimatedPageWrapper } from "@/components/ui/AnimatedPageWrapper";
import { motion } from "framer-motion";

export default function Weekly() {
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

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
              Weekly Trends
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              Activity over the last 7 days.
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
