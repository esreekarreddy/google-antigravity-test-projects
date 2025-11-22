import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, hoverEffect = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" } : {}}
      className={cn(
        "backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
