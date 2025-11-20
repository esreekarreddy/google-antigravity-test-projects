'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-15%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Glass Container */}
      <main className={cn(
        "relative z-10 w-full max-w-6xl mx-auto",
        "bg-glass-bg border border-glass-border backdrop-blur-2xl",
        "rounded-3xl shadow-2xl shadow-black/30",
        "flex flex-col md:flex-row overflow-hidden",
        "h-auto md:max-h-[85vh]",
        className
      )}>
        {children}
      </main>
    </div>
  );
}
