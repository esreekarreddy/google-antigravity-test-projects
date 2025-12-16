'use client';

import { motion } from 'framer-motion';
import { GitBranch, HelpCircle } from 'lucide-react';
import { RepoInput } from '@/components/ui/RepoInput';
import { SampleRepos } from '@/components/ui/SampleRepos';
import { RecentRepos } from '@/components/ui/RecentRepos';
import Link from 'next/link';
import Image from 'next/image';
import { HelpModal } from '@/components/ui/HelpModal';
import { useRepoStore } from '@/store/repoStore';

export default function HomePage() {
  const { setHelpOpen } = useRepoStore();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/50" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0h1v60H0zm59 0h1v60h-1zM0 0h60v1H0zm0 59h60v1H0z' fill='%23000'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <Image 
              src="/icon.svg" 
              alt="CommitVerse" 
              width={36} 
              height={36}
              className="rounded-lg"
            />
            <span className="font-bold text-xl text-slate-800">
              <span className="text-gradient">CommitVerse</span>
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => setHelpOpen(true)}
              className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </motion.div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Animated icon */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 shadow-lg">
              <GitBranch className="w-10 h-10 text-indigo-600" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 leading-tight text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore Git History
            <br />
            <span className="text-gradient">in 3D Space</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-slate-600 text-lg sm:text-xl text-center max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Transform any GitHub repository into an interactive visualization of commits, branches, and contributors
          </motion.p>

          {/* Repo Input */}
          <RepoInput />

          {/* Recent Repos */}
          <RecentRepos />

          {/* Sample Repos */}
          <SampleRepos />
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 flex items-center justify-center gap-6 text-slate-500 text-sm">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">
            Terms
          </Link>
        </footer>
      </div>

      {/* Help Modal */}
      <HelpModal />
    </main>
  );
}
