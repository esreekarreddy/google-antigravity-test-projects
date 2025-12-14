import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, BarChart3, MousePointerClick, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { getTodayKey } from "@/lib/extension-utils";
import { calculateProductivityScore } from "@/lib/productivity";
import { SidebarItem } from "../ui/SidebarItem";
import { motion } from "framer-motion";

interface NavbarProps {
  onClose?: () => void;
}

export function Navbar({ onClose }: NavbarProps) {
  const [location] = useLocation();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadScore = async () => {
      const data = await storage.getData();
      const today = getTodayKey();
      const todayData = data[today] || {};
      setScore(calculateProductivityScore(todayData));
    };
    
    loadScore();
    const interval = setInterval(loadScore, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/daily", label: "Daily", icon: Calendar },
    { href: "/weekly", label: "Weekly", icon: BarChart3 },
    { href: "/visits", label: "Visits", icon: MousePointerClick },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.nav 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full flex flex-col bg-gradient-to-b from-white/40 via-white/25 to-transparent backdrop-blur-xl md:border-r border-white/20 md:border-white/15"
    >
      {/* Logo Section */}
      <div className="p-4 sm:p-5 md:p-6 flex items-center gap-3 mb-2 flex-shrink-0 border-b border-white/10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="size-10 sm:size-11 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 flex-shrink-0 p-0.5 cursor-pointer transition-all duration-300"
          data-testid="logo-screentime"
        >
          <div className="bg-background rounded-[14px] w-full h-full overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="ScreenTime Logo" className="w-full h-full object-cover" />
          </div>
        </motion.div>
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-lg sm:text-xl md:text-base tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            ScreenTime
          </h1>
          <p className="text-xs text-muted-foreground font-medium truncate hidden sm:block">Dashboard</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-2 sm:px-3 md:px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="px-3 sm:px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-70">Menu</p>
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={location === item.href}
            onClick={onClose}
          />
        ))}
      </div>

      {/* Productivity Score */}
      <div className="p-3 sm:p-4 md:p-5 mt-auto flex-shrink-0 border-t border-white/10 space-y-4">
        {/* Privacy Shield */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/20 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1 rounded-full bg-primary/20 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">Privacy First</span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
            Your data is stored <span className="text-primary font-bold">100% locally</span>. Zero cloud uploads.
          </p>
        </div>

        {/* Productivity Score */}
        <div className="bg-gradient-to-br from-white/35 to-white/15 rounded-2xl sm:rounded-3xl md:rounded-2xl p-4 sm:p-5 md:p-4 border border-white/20 md:border-white/15 shadow-lg backdrop-blur-md relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 -mt-3 -mr-3 w-16 sm:w-20 h-16 sm:h-20 bg-accent/15 rounded-full blur-2xl group-hover:bg-accent/25 transition-colors duration-500" />
          
          <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Score</p>
          <div className="flex items-end gap-2 mb-3 relative z-10">
            <span className="text-2xl sm:text-3xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tabular-nums" data-testid="text-productivity-score">{score}</span>
            <span className="text-xs font-medium text-muted-foreground mb-0.5">/100</span>
          </div>
          
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative shadow-lg"
            >
              <div className="absolute inset-0 bg-white/40 animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
