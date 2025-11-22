import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedPageWrapper({ children, className }: AnimatedPageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
