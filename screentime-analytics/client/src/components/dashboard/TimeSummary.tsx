import { Clock, Globe, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface TimeSummaryProps {
  totalTime: number;
  topSite: string;
  visitCount: number;
  productivityScore: number;
}

export function TimeSummary({ totalTime, topSite, visitCount, productivityScore }: TimeSummaryProps) {
  const formatHours = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs === 0 && mins === 0 ? "0m" : `${hrs}h ${mins}m`;
  };

  const stats = [
    { 
      label: "Total Screen Time", 
      value: formatHours(totalTime), 
      icon: Clock, 
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Top Website", 
      value: topSite || "-", 
      icon: Globe, 
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-200",
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      label: "Total Visits", 
      value: visitCount.toString(), 
      icon: TrendingUp, 
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      border: "border-cyan-200",
      gradient: "from-cyan-500 to-cyan-600"
    },
    { 
      label: "Productivity", 
      value: `${productivityScore}%`, 
      icon: Zap, 
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-200",
      gradient: "from-orange-500 to-orange-600"
    },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8 lg:mb-10">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 cursor-default relative overflow-hidden group border border-white/40 hover:border-white/60 transition-all duration-300"
            data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className={`absolute top-0 right-0 p-2 sm:p-3 opacity-60 group-hover:opacity-100 transition-all duration-300`}>
               <div className={`p-2.5 sm:p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                 <Icon className="size-4 sm:size-5 lg:size-6" />
               </div>
            </div>
            
            <div className="mt-0.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 sm:mb-2">{stat.label}</p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                {stat.value}
              </h3>
            </div>
            
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-300`} />
          </motion.div>
        );
      })}
    </div>
  );
}
