'use client';

import { motion } from 'framer-motion';
import { Tag, Star, Clock, Bookmark, X } from 'lucide-react';
import { getTagColor, getTagsWithCounts, Bookmark as BookmarkType } from '@/lib/storage';

interface TagSidebarProps {
  bookmarks: BookmarkType[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagSidebar({ bookmarks, selectedTag, onSelectTag }: TagSidebarProps) {
  const tagsWithCounts = getTagsWithCounts(bookmarks);

  const specialFilters = [
    { id: null, label: 'All Bookmarks', icon: Bookmark },
    { id: '__favorites__', label: 'Favorites', icon: Star },
    { id: '__recent__', label: 'This Week', icon: Clock },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-4 p-4 bg-[var(--bg-sidebar)] rounded-2xl">
        {/* Special filters */}
        <div className="space-y-1 mb-6">
          {specialFilters.map((filter) => (
            <button
              key={filter.id || 'all'}
              onClick={() => onSelectTag(filter.id)}
              className={`sidebar-item w-full ${
                selectedTag === filter.id ? 'sidebar-item-active' : ''
              }`}
            >
              <filter.icon className="w-4 h-4" />
              <span className="flex-1 text-left">{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Tags section */}
        <div className="border-t border-[var(--border)] pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Tags
            </h3>
            {selectedTag && !['__favorites__', '__recent__'].includes(selectedTag) && selectedTag !== null && (
              <button
                onClick={() => onSelectTag(null)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title="Clear tag filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {tagsWithCounts.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] italic py-2">
              No tags yet
            </p>
          ) : (
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {tagsWithCounts.map((item, index) => {
                const colors = getTagColor(item.tag);
                const isSelected = selectedTag === item.tag;
                return (
                  <motion.button
                    key={item.tag}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onSelectTag(isSelected ? null : item.tag)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      isSelected 
                        ? 'ring-2 ring-[var(--primary)]' 
                        : 'hover:bg-white'
                    }`}
                    style={isSelected ? { backgroundColor: colors.bg } : undefined}
                  >
                    <span
                      className="flex items-center gap-2"
                      style={{ color: isSelected ? colors.text : 'var(--text-secondary)' }}
                    >
                      <Tag className="w-3 h-3" />
                      <span className="truncate">{item.tag}</span>
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: isSelected ? 'white' : colors.bg, 
                        color: colors.text 
                      }}
                    >
                      {item.count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
