import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RateChartProps {
  fromCurrency: string;
  toCurrency: string;
  currentRate: number;
}

export default function RateChart({ fromCurrency, toCurrency, currentRate }: RateChartProps) {
  // Generate mock historical data since we don't have time-series data from API
  const data = useMemo(() => {
    const baseRate = currentRate;
    const chart = [];
    for (let i = 0; i < 24; i++) {
      const variance = (Math.random() - 0.5) * 0.02 * baseRate;
      chart.push({
        time: `${i}:00`,
        rate: baseRate + variance,
      });
    }
    return chart;
  }, [currentRate]);

  const domain = [
    Math.min(...data.map((d) => d.rate)) * 0.99,
    Math.max(...data.map((d) => d.rate)) * 1.01,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="h-full"
    >
      <Card className="glass-card h-full p-6 border-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 mb-4">
          <h3 className="text-lg font-medium text-muted-foreground">Exchange Rate Trend</h3>
          <p className="text-sm text-muted-foreground/60">24-Hour View</p>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={domain} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card/90 backdrop-blur border border-border p-2 rounded shadow-lg">
                        <p className="text-sm font-bold text-primary">
                          {Number(payload[0].value).toFixed(4)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
