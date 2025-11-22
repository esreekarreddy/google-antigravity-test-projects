import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ChartCard({ title, subtitle, children, className, delay = 0 }: ChartCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass-card rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group", 
        className
      )}
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader className="pb-3 sm:pb-4 border-b border-white/5 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{title}</CardTitle>
            {subtitle && <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{subtitle}</CardDescription>}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/10 p-2 rounded-full flex-shrink-0">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 md:pt-8 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 overflow-x-auto">
        {children}
      </CardContent>
    </motion.div>
  );
}
