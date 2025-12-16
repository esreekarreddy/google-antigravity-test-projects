'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  wpm: number;
  label: string;
  isOpponent?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  wpm,
  label,
  isOpponent = false,
  className = '',
}: ProgressBarProps) {
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${isOpponent ? 'text-amber-400' : 'text-green-400'}`}>
          {label}
        </span>
        <span className={`text-sm font-mono ${isOpponent ? 'text-amber-400' : 'text-green-400'}`}>
          {wpm} WPM
        </span>
      </div>
      <div className="progress-bar h-3">
        <motion.div
          className={`progress-fill ${isOpponent ? 'progress-fill-opponent' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
