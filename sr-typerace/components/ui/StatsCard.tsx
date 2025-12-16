'use client';

import { Zap, Target, Trophy, Flame, Trash2, Info } from 'lucide-react';
import { getStats, clearStats } from '@/lib/storage';
import { useState, useCallback } from 'react';
import { ConfirmModal } from './ConfirmModal';

interface StatsCardProps {
  className?: string;
}

// Tooltip component
function StatTooltip({ 
  children, 
  tooltip 
}: { 
  children: React.ReactNode; 
  tooltip: string;
}) {
  return (
    <div className="relative group cursor-help">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg">
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-700" />
      </div>
    </div>
  );
}

export function StatsCard({ className = '' }: StatsCardProps) {
  // Use lazy initializer to load stats once on mount (no useEffect needed)
  const [stats, setStats] = useState(() => {
    if (typeof window !== 'undefined') {
      const s = getStats();
      return {
        bestWpm: s.bestWpm,
        averageWpm: s.averageWpm,
        averageAccuracy: s.averageAccuracy,
        totalRaces: s.totalRaces,
        currentStreak: s.currentStreak,
      };
    }
    return {
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      totalRaces: 0,
      currentStreak: 0,
    };
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearStats = useCallback(() => {
    clearStats();
    // Reload stats after clearing
    setStats({
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      totalRaces: 0,
      currentStreak: 0,
    });
    setShowClearConfirm(false);
  }, []);

  return (
    <>
      <div className={`terminal-panel p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-green-400 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Your Stats
            <span className="text-gray-600 text-xs font-normal flex items-center gap-1">
              <Info className="w-3 h-3" />
              Hover for details
            </span>
          </h3>
          {stats.totalRaces > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-gray-600 hover:text-red-400 flex items-center gap-1 transition-colors"
              title="Clear all stats"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatTooltip tooltip="Your highest WPM score ever recorded">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400 terminal-glow">
                {stats.bestWpm}
              </div>
              <div className="text-xs text-gray-500">Best WPM</div>
            </div>
          </StatTooltip>

          <StatTooltip tooltip="Average WPM across your last 100 races">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {stats.averageWpm}
              </div>
              <div className="text-xs text-gray-500">Avg WPM</div>
            </div>
          </StatTooltip>

          <StatTooltip tooltip="Average typing accuracy (% of correct characters)">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {stats.averageAccuracy}%
              </div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </StatTooltip>

          <StatTooltip tooltip="Consecutive days you've completed at least one race">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Flame className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-400">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
          </StatTooltip>
        </div>

        {stats.totalRaces > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <span className="text-xs text-gray-500">
              {stats.totalRaces} races completed
            </span>
          </div>
        )}
      </div>

      {/* Clear confirmation modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear All Stats?"
        message="This will permanently delete your WPM history, personal bests, and streak. This action cannot be undone."
        confirmText="Clear Stats"
        cancelText="Keep Stats"
        variant="danger"
        onConfirm={handleClearStats}
        onCancel={() => setShowClearConfirm(false)}
      />
    </>
  );
}
