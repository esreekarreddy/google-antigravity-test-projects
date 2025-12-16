'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Calendar } from 'lucide-react';

interface TimeSliderProps {
  commits: Array<{ sha: string; author: { date: string } }>;
  onRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  className?: string;
}

export function TimeSlider({ commits, onRangeChange, className = '' }: TimeSliderProps) {
  const [range, setRange] = useState<[number, number]>([0, 100]);
  const [isPlaying, setIsPlaying] = useState(false);

  const { minDate, maxDate, dateRange } = useMemo(() => {
    if (commits.length === 0) {
      const now = new Date();
      return { minDate: now, maxDate: now, dateRange: 1 };
    }

    const dates = commits.map(c => new Date(c.author.date).getTime());
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    
    return {
      minDate: new Date(min),
      maxDate: new Date(max),
      dateRange: max - min || 1,
    };
  }, [commits]);

  const getDateFromPercent = useCallback((percent: number): Date => {
    const timestamp = minDate.getTime() + (percent / 100) * dateRange;
    return new Date(timestamp);
  }, [minDate, dateRange]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  };

  const handleRangeChange = useCallback((index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...range] as [number, number];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > range[1]) newRange[0] = range[1];
    if (index === 1 && value < range[0]) newRange[1] = range[0];
    
    setRange(newRange);
    
    const startDate = getDateFromPercent(newRange[0]);
    const endDate = getDateFromPercent(newRange[1]);
    onRangeChange(startDate, endDate);
  }, [range, getDateFromPercent, onRangeChange]);

  const handleReset = () => {
    setRange([0, 100]);
    onRangeChange(null, null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Animate the end range from start to 100
      setRange([0, 0]);
      animateRange();
    }
  };

  const animateRange = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsPlaying(false);
      }
      setRange([0, current]);
      const endDate = getDateFromPercent(current);
      onRangeChange(minDate, endDate);
    }, 100);
  };

  const startDate = getDateFromPercent(range[0]);
  const endDate = getDateFromPercent(range[1]);
  const selectedCount = commits.filter(c => {
    const d = new Date(c.author.date).getTime();
    return d >= startDate.getTime() && d <= endDate.getTime();
  }).length;

  return (
    <motion.div
      className={`bg-white rounded-xl border border-slate-200 p-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-slate-700">Time Range</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
            title={isPlaying ? 'Pause' : 'Play animation'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Date labels */}
      <div className="flex justify-between text-[10px] text-slate-500 mb-2">
        <span>{formatDate(minDate)}</span>
        <span className="font-medium text-indigo-600">
          {selectedCount} / {commits.length} commits
        </span>
        <span>{formatDate(maxDate)}</span>
      </div>

      {/* Slider track */}
      <div className="relative h-2 bg-slate-100 rounded-full">
        {/* Selected range */}
        <div
          className="absolute h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full"
          style={{
            left: `${range[0]}%`,
            width: `${range[1] - range[0]}%`,
          }}
        />
        
        {/* Start handle */}
        <input
          type="range"
          min="0"
          max="100"
          value={range[0]}
          onChange={(e) => handleRangeChange(0, parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* End handle */}
        <input
          type="range"
          min="0"
          max="100"
          value={range[1]}
          onChange={(e) => handleRangeChange(1, parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        />

        {/* Handle indicators */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-sm"
          style={{ left: `calc(${range[0]}% - 6px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-violet-500 rounded-full shadow-sm"
          style={{ left: `calc(${range[1]}% - 6px)` }}
        />
      </div>

      {/* Selected range display */}
      <div className="flex justify-center mt-3">
        <div className="text-xs bg-slate-50 px-3 py-1 rounded-full text-slate-600">
          {formatDate(startDate)} → {formatDate(endDate)}
        </div>
      </div>
    </motion.div>
  );
}
