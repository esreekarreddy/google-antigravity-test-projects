'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '@/context/TimerContext';
import { cn } from '@/utils/cn';

interface TimerRingProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function TimerRing({ size = 320, strokeWidth = 10, className }: TimerRingProps) {
  const { state, progress } = useTimer();
  const { status, mode, timeLeft } = state;

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Mode-specific colors
  const modeColors = {
    focus: {
      primary: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.6)',
      bg: 'from-purple-500 to-violet-600'
    },
    shortBreak: {
      primary: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.6)',
      bg: 'from-cyan-400 to-blue-500'
    },
    longBreak: {
      primary: '#f97316',
      glow: 'rgba(249, 115, 22, 0.6)',
      bg: 'from-orange-400 to-pink-500'
    }
  };

  const currentColor = modeColors[mode];

  // Hexagon path - centered properly
  const cx = size / 2;
  const cy = size / 2;
  const hexRadius = size * 0.42; // Increased slightly for better spacing
  
  // Calculate exact perimeter for smooth animation
  // Side length of hexagon = radius
  const perimeter = 6 * hexRadius;
  
  const hexPath = `
    M ${cx},${cy - hexRadius}
    L ${cx + hexRadius * 0.866},${cy - hexRadius * 0.5}
    L ${cx + hexRadius * 0.866},${cy + hexRadius * 0.5}
    L ${cx},${cy + hexRadius}
    L ${cx - hexRadius * 0.866},${cy + hexRadius * 0.5}
    L ${cx - hexRadius * 0.866},${cy - hexRadius * 0.5}
    Z
  `;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Outer Glow */}
      <motion.div
        animate={{
          opacity: status === 'running' ? [0.3, 0.6, 0.3] : 0.2,
          scale: status === 'running' ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 blur-[80px] rounded-full"
        style={{ background: currentColor.glow }}
      />

      <div className="relative z-10">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-2xl"
        >
          {/* Background Hexagon */}
          <path
            d={hexPath}
            fill="rgba(0, 0, 0, 0.4)"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="2"
          />

          {/* Progress Hexagon */}
          <defs>
            <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: currentColor.primary, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: currentColor.primary, stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>
          
          <motion.path
            d={hexPath}
            fill="none"
            stroke={`url(#gradient-${mode})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter * (1 - progress)}
            style={{
              filter: `drop-shadow(0 0 15px ${currentColor.glow})`
            }}
          />

          {/* Inner decoration lines */}
          <motion.g
            animate={{ rotate: status === 'running' ? 360 : 0 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1={cx}
                y1={cy}
                x2={cx + Math.cos((angle * Math.PI) / 180) * (hexRadius * 0.6)}
                y2={cy + Math.sin((angle * Math.PI) / 180) * (hexRadius * 0.6)}
                stroke={currentColor.primary}
                strokeWidth="1"
                opacity="0.15"
              />
            ))}
          </motion.g>
        </svg>

        {/* Time Display - Glassy Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            style={{ color: currentColor.primary }}
          >
            {mode === 'focus' ? 'FOCUS' : mode === 'shortBreak' ? 'SHORT BREAK' : 'LONG BREAK'}
          </motion.div>
          
          {/* Glassy timer container */}
          <motion.div
            className="relative px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
            animate={{ 
              scale: status === 'running' ? [1, 1.015, 1] : 1,
              boxShadow: status === 'running' 
                ? [
                    `0 0 20px ${currentColor.glow}`,
                    `0 0 40px ${currentColor.glow}`,
                    `0 0 20px ${currentColor.glow}`
                  ]
                : `0 0 10px ${currentColor.glow}`
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent rounded-2xl" />
            
            <div className="relative text-5xl font-bold tabular-nums tracking-tight text-white">
              {timeString}
            </div>
          </motion.div>
          
          {/* Decorative dots */}
          <div className="flex items-center gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: currentColor.primary }}
                animate={{
                  opacity: status === 'running' ? [0.3, 1, 0.3] : 0.3,
                  scale: status === 'running' ? [0.8, 1.2, 0.8] : 0.8
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
