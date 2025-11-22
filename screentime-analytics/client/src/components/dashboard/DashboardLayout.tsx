import { ReactNode, useState } from "react";
import { Navbar } from "../layout/Navbar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background font-sans selection:bg-primary/20 text-foreground overflow-hidden">
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-2xl glass-card hover:shadow-lg transition-all duration-300 active:scale-90"
        data-testid="button-toggle-sidebar"
      >
        {sidebarOpen ? <X className="size-5 sm:size-6" /> : <Menu className="size-5 sm:size-6" />}
      </motion.button>

      {/* Sidebar - Fixed on Desktop, Slide-over on Mobile */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-[280px] sm:w-72 md:w-64 h-screen transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:translate-x-0 overflow-y-auto overflow-x-hidden ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Navbar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 md:hidden bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            data-testid="overlay-sidebar"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen overflow-y-auto overflow-x-hidden relative">
        {/* Ambient Background Orbs - Responsive */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-72 sm:w-96 md:w-[400px] lg:w-[500px] h-72 sm:h-96 md:h-[400px] lg:h-[500px] bg-primary/8 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-15%] left-[5%] sm:left-[15%] md:left-[20%] w-60 sm:w-80 md:w-[300px] lg:w-[400px] h-60 sm:h-80 md:h-[300px] lg:h-[400px] bg-accent/8 rounded-full blur-[60px] sm:blur-[80px] opacity-70" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
