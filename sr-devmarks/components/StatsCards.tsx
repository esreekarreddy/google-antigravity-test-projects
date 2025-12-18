'use client';

import { motion } from 'framer-motion';
import { Bookmark, Star, Clock, Tag, BookOpen } from 'lucide-react';
import { BookmarkStats } from '@/lib/storage';

interface StatsCardsProps {
  stats: BookmarkStats;
  onSelectFilter: (filter: string | null) => void;
  selectedFilter: string | null;
}

export function StatsCards({ stats, onSelectFilter, selectedFilter }: StatsCardsProps) {
  const cards = [
    {
      id: null,
      label: 'Total',
      value: stats.total,
      icon: Bookmark,
      color: 'var(--primary)',
      bgColor: 'var(--primary-bg)',
    },
    {
      id: '__favorites__',
      label: 'Favorites',
      value: stats.favorites,
      icon: Star,
      color: 'var(--accent)',
      bgColor: 'var(--accent-bg)',
    },
    {
      id: '__unread__',
      label: 'Unread',
      value: stats.unreadCount,
      icon: BookOpen,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      id: '__recent__',
      label: 'This Week',
      value: stats.recentCount,
      icon: Clock,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      id: '__with_tags__',
      label: 'Tags',
      value: stats.tags,
      icon: Tag,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, index) => (
        <motion.button
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          onClick={() => onSelectFilter(card.id)}
          className={`stat-card text-left cursor-pointer ${selectedFilter === card.id ? 'active' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: card.bgColor }}
            >
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
            </div>
            {selectedFilter === card.id && (
              <span className="text-[10px] font-medium text-[var(--primary)] bg-[var(--primary-bg)] px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</div>
          <div className="text-xs text-[var(--text-muted)]">{card.label}</div>
        </motion.button>
      ))}
    </div>
  );
}
