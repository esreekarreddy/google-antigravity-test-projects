import { motion } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

export function SidebarItem({ href, icon: Icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <Link href={href}>
      <motion.div
        onClick={onClick}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer overflow-hidden group w-full",
          isActive
            ? "text-primary bg-primary/10 shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        )}
        data-testid={`link-${label.toLowerCase()}`}
      >
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent rounded-r-full"
          />
        )}
        
        <Icon className={cn(
          "size-4 sm:size-5 flex-shrink-0 transition-colors duration-300", 
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        
        <span className="truncate relative z-10">{label}</span>
        
        {isActive && (
          <motion.div
            layoutId="activeGlow"
            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/5 rounded-xl -z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    </Link>
  );
}
