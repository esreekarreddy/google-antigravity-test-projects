'use client';

import { motion } from 'framer-motion';
import { Clock, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRecentRepos, clearRecentRepos, RecentRepo } from '@/lib/storage';

export function RecentRepos() {
  const router = useRouter();
  const [repos, setRepos] = useState<RecentRepo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRepos(getRecentRepos());
  }, []);

  const handleRepoClick = (repo: RecentRepo) => {
    const encodedUrl = encodeURIComponent(repo.url);
    router.push(`/visualize?repo=${encodedUrl}`);
  };

  const handleClear = () => {
    clearRecentRepos();
    setRepos([]);
  };

  // Don't render on server or if no repos
  if (!mounted || repos.length === 0) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>Recently Viewed</span>
        </div>
        <button
          onClick={handleClear}
          className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {repos.map((repo, index) => (
          <motion.button
            key={repo.fullName}
            onClick={() => handleRepoClick(repo)}
            className="group flex items-center gap-2 bg-white/80 hover:bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all text-sm hover:shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-indigo-600 font-mono font-medium">
              {repo.name}
            </span>
            {repo.language && (
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {repo.language}
              </span>
            )}
            <span className="text-[10px] text-slate-400">
              {formatTime(repo.visitedAt)}
            </span>
            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
