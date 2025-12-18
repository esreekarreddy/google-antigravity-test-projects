'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Bookmark, Tag, Search, Download, Upload, Star, FolderOpen, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const features = [
    {
      icon: Bookmark,
      title: 'Save Bookmarks',
      description: 'Add any URL with a title, description, and tags. Favicons are fetched automatically.',
    },
    {
      icon: Tag,
      title: 'Tag Filtering',
      description: 'Organize with tags, then click any tag to filter. Use the Tags row to quickly filter.',
    },
    {
      icon: FolderOpen,
      title: 'Collections',
      description: 'Group bookmarks into collections. Share collections with a link.',
    },
    {
      icon: Search,
      title: 'Instant Search',
      description: 'Search across titles, URLs, descriptions, and tags in real-time.',
    },
    {
      icon: Star,
      title: 'Favorites',
      description: 'Star important bookmarks to quickly find them later.',
    },
    {
      icon: BookOpen,
      title: 'Reading List',
      description: 'Mark bookmarks as read/unread to track what you\'ve visited.',
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download all your bookmarks as a JSON file for backup.',
    },
    {
      icon: Upload,
      title: 'Import Data',
      description: 'Import bookmarks from a JSON file. Duplicates are automatically skipped.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content p-6 max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--primary-bg)]">
                  <HelpCircle className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    How to Use DevMarks
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Your personal developer bookmark manager
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Features list */}
            <div className="space-y-4 mb-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-sidebar)] transition-colors"
                >
                  <div className="p-2 rounded-lg bg-[var(--primary-bg)] flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Privacy note */}
            <div className="p-4 rounded-xl bg-[var(--primary-bg)] border border-[var(--primary)]/20">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--primary)]">100% Private:</span>{' '}
                All data stays in your browser. No accounts, no servers, no tracking.
              </p>
            </div>

            {/* Close button */}
            <div className="mt-6 flex justify-end">
              <button onClick={onClose} className="btn-primary">
                Got it!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
