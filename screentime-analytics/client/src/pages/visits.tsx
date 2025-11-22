import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { storage } from "@/lib/storage";
import { getTodayKey } from "@/lib/extension-utils";
import { useEffect, useState } from "react";
import { DailyData } from "@/lib/mockData";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AnimatedPageWrapper } from "@/components/ui/AnimatedPageWrapper";
import { motion } from "framer-motion";

export default function Visits() {
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

  const chartData = Object.entries(todayData).map(([domain, stats]) => ({
    domain,
    visits: stats.visits,
    minutes: Math.round(stats.activeTime / 60),
    z: 1
  }));

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
              Visit Analytics
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              Correlation between visit frequency and duration.
            </p>
          </motion.div>
        </div>

        <ChartCard title="Visits vs. Duration" subtitle="Are you deep working or quick checking?" delay={0.2}>
          {chartData.length > 0 ? (
            <div className="h-72 sm:h-96 md:h-[550px] lg:h-[600px] w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis type="number" dataKey="visits" name="Visits" unit=" times" tick={{fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="minutes" name="Duration" unit=" min" tick={{fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} />
                  <ZAxis type="number" dataKey="z" range={[100, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glassmorphic p-4 rounded-2xl shadow-xl text-sm border border-white/20 bg-white/90 backdrop-blur-md">
                          <p className="font-bold mb-2 text-primary text-base">{data.domain}</p>
                          <div className="space-y-1 text-muted-foreground">
                            <p>Visits: <span className="font-mono font-bold text-foreground">{data.visits}</span></p>
                            <p>Time: <span className="font-mono font-bold text-foreground">{data.minutes}</span> min</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Scatter name="Sites" data={chartData} fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 sm:h-96 md:h-[550px] lg:h-[600px] flex items-center justify-center text-muted-foreground text-sm">
              No data yet. Start browsing!
            </div>
          )}
        </ChartCard>
      </AnimatedPageWrapper>
    </DashboardLayout>
  );
}
