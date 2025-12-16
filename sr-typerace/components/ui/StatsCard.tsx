'use client';

import { Zap, Target, Trophy, Flame, Trash2 } from 'lucide-react';
import { getStats, clearStats } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { ConfirmModal } from './ConfirmModal';

interface StatsCardProps {
  className?: string;
}

export function StatsCard({ className = '' }: StatsCardProps) {
  const [stats, setStats] = useState({
    bestWpm: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    totalRaces: 0,
    currentStreak: 0,
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadStats = () => {
    const s = getStats();
    setStats({
      bestWpm: s.bestWpm,
      averageWpm: s.averageWpm,
      averageAccuracy: s.averageAccuracy,
      totalRaces: s.totalRaces,
      currentStreak: s.currentStreak,
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearStats = () => {
    clearStats();
    loadStats();
    setShowClearConfirm(false);
  };

  return (
    <>
      <div className={`terminal-panel p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-green-400 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Your Stats
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
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 terminal-glow">
              {stats.bestWpm}
            </div>
            <div className="text-xs text-gray-500">Best WPM</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              {stats.averageWpm}
            </div>
            <div className="text-xs text-gray-500">Avg WPM</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {stats.averageAccuracy}%
            </div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
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
