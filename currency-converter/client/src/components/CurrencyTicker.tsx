import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function CurrencyTicker() {
  const { data: currencies = [] } = useQuery({
    queryKey: ["ticker-currencies"],
    queryFn: async () => {
      const res = await fetch("/api/currencies");
      return res.json();
    },
  });

  const popularPairs = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "INR" },
    { from: "EUR", to: "GBP" },
    { from: "GBP", to: "INR" },
    { from: "USD", to: "JPY" },
    { from: "AUD", to: "USD" },
    { from: "USD", to: "CAD" },
  ];

  return (
    <div className="w-full overflow-hidden bg-card/30 backdrop-blur-sm border-y border-white/5 py-3">
      <motion.div 
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          repeat: Infinity, 
          duration: 40, 
          ease: "linear" 
        }}
      >
        {[...popularPairs, ...popularPairs, ...popularPairs].map((pair, idx) => {
          const isUp = idx % 2 === 0;
          
          return (
            <div key={idx} className="flex items-center gap-2 text-sm font-medium">
              <span className="text-muted-foreground">
                {pair.from}/{pair.to}
              </span>
              <span className="text-foreground">Live</span>
              <span className={isUp ? "text-primary" : "text-destructive"}>
                {isUp ? "▲" : "▼"} {Math.random().toFixed(2)}%
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
