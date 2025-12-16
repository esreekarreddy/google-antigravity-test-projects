'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Smaller repos that won't hit rate limits quickly
const SAMPLE_REPOS = [
  {
    name: 'esreekarreddy/AI-Engineering',
    description: 'AI Engineering projects and experiments',
    stars: '1',
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'esreekarreddy/google-antigravity-test-projects',
    description: 'Google Antigravity test projects',
    stars: '1',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'pmndrs/zustand',
    description: 'Bear necessities for state management',
    stars: '48k',
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'tailwindlabs/heroicons',
    description: 'Beautiful hand-crafted SVG icons',
    stars: '22k',
    color: 'from-cyan-500 to-teal-600',
  },
];

interface SampleReposProps {
  onSelect?: (repo: string) => void;
}

export function SampleRepos({ onSelect }: SampleReposProps) {
  const router = useRouter();

  const handleRepoClick = (repoName: string) => {
    const repoUrl = `github.com/${repoName}`;
    if (onSelect) {
      onSelect(repoUrl);
    }
    const encodedUrl = encodeURIComponent(repoUrl);
    router.push(`/visualize?repo=${encodedUrl}`);
  };

  return (
    <motion.div
      className="mt-10 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="text-slate-500 text-sm font-medium mb-4 text-center">
        Or try these repositories
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SAMPLE_REPOS.map((repo, index) => (
          <motion.button
            key={repo.name}
            onClick={() => handleRepoClick(repo.name)}
            className="bg-white p-4 rounded-xl text-left group border border-slate-200 hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${repo.color} mb-3`} />
            
            <div className="flex items-start justify-between mb-2">
              <span className="text-indigo-600 font-mono text-sm font-medium truncate max-w-[80%]">
                {repo.name.split('/')[1]}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
            </div>
            
            <p className="text-slate-600 text-xs line-clamp-2 mb-2">
              {repo.description}
            </p>
            
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Star className="w-3 h-3 text-amber-500" />
              {repo.stars}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
