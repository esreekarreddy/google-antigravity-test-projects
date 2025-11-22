import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
  delay?: number;
}

export function GradientCard({ 
  children, 
  className, 
  gradient = "from-primary/20 to-accent/20", 
  delay = 0 
}: GradientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-1 shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradient)} />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 dark:bg-black/10" />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
