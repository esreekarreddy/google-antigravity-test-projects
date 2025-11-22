import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TimeSummary } from "@/components/dashboard/TimeSummary";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { SiteTable } from "@/components/dashboard/SiteTable";
import { storage } from "@/lib/storage";
import { getTodayKey } from "@/lib/extension-utils";
import { useEffect, useState } from "react";
import { DailyData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { calculateProductivityScore } from "@/lib/productivity";
import { AnimatedPageWrapper } from "@/components/ui/AnimatedPageWrapper";
import { motion } from "framer-motion";

export default function Home() {
  const [todayData, setTodayData] = useState<DailyData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await storage.getData();
      const today = getTodayKey();
      setTodayData(data[today] || {});
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-screen">Loading...</div></DashboardLayout>;

  const totalTime = Object.values(todayData).reduce((acc, curr) => acc + curr.activeTime, 0);
  const totalVisits = Object.values(todayData).reduce((acc, curr) => acc + curr.visits, 0);
  
  const productivityScore = calculateProductivityScore(todayData);

  const sortedSites = Object.entries(todayData)
    .sort(([, a], [, b]) => b.activeTime - a.activeTime)
    .map(([domain, stats]) => ({ domain, stats }));
    
  const topSite = sortedSites.length > 0 ? sortedSites[0].domain : "";
  const maxTime = sortedSites.length > 0 ? sortedSites[0].stats.activeTime : 1;

  const chartData = sortedSites.slice(0, 5).map(item => ({
    name: item.domain.length > 15 ? item.domain.substring(0, 12) + '...' : item.domain,
    time: Math.round(item.stats.activeTime / 60)
  }));

  return (
    <DashboardLayout>
      <AnimatedPageWrapper>
        <div className="mb-8 sm:mb-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
              Dashboard
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl">
              Your digital activity overview for today.
            </p>
          </motion.div>
        </div>

        <TimeSummary 
          totalTime={totalTime} 
          topSite={topSite} 
          visitCount={totalVisits} 
          productivityScore={productivityScore}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
          <ChartCard title="Most Active Sites" subtitle="Top 5 websites by time spent (minutes)" className="sm:col-span-2" delay={0.2}>
            {chartData.length > 0 ? (
              <div className="h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={75} tick={{fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.8)' }}
                    />
                    <Bar dataKey="time" radius={[0, 12, 12, 0]} barSize={32}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] flex items-center justify-center text-muted-foreground text-sm">
                No data yet
              </div>
            )}
          </ChartCard>

          <ChartCard title="Quick Stats" subtitle="Your activity snapshot" delay={0.3}>
            <div className="space-y-3 sm:space-y-4 h-full flex flex-col justify-center">
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="size-12 sm:size-16 rounded-full bg-cyan-500 blur-2xl" />
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Active Time</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{Math.floor(totalTime / 60)}m</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="size-12 sm:size-16 rounded-full bg-purple-500 blur-2xl" />
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Sites Visited</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{sortedSites.length}</p>
              </motion.div>
            </div>
          </ChartCard>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight px-2">All Activity</h2>
          <SiteTable data={sortedSites} maxTime={maxTime} />
        </div>
      </AnimatedPageWrapper>
    </DashboardLayout>
  );
}
