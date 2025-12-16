'use client';

import { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, HelpCircle, Loader2, AlertTriangle, Network } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRepoStore } from '@/store/repoStore';
import { loadRepository } from '@/lib/github';
import { addRecentRepo } from '@/lib/storage';
import { StatsPanel } from '@/components/ui/StatsPanel';
import { CommitDetails } from '@/components/ui/CommitDetails';
import { HelpModal } from '@/components/ui/HelpModal';
import { TimeSlider } from '@/components/ui/TimeSlider';

// Dynamically import 3D components
const CommitGalaxy = dynamic(
  () => import('@/components/scene/CommitGalaxy').then((mod) => mod.CommitGalaxy),
  { ssr: false }
);

function LoadingOverlay({ progress, message }: { progress: number; message: string }) {
  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-50">
      <motion.div
        className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Network className="w-12 h-12 text-indigo-600" />
      </motion.div>
      
      <div className="w-64 mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      <p className="text-slate-600 text-sm">{message}</p>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-50">
      <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Failed to Load</h2>
      <p className="text-slate-600 text-center max-w-md mb-6">{error}</p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-2 text-slate-600 border border-slate-300 rounded-lg hover:border-indigo-500 transition-colors"
        >
          Go Back
        </Link>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

function VisualizationContent() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get('repo') || '';
  const [timeFilteredNodes, setTimeFilteredNodes] = useState<string[] | null>(null);
  
  const {
    isLoading,
    error,
    loadingProgress,
    loadingMessage,
    repoInfo,
    commits,
    branches,
    contributors,
    commitNodes,
    selectedCommit,
    setSelectedCommit,
    setHelpOpen,
    reset,
  } = useRepoStore();

  // Filter nodes based on time range
  const filteredNodes = useMemo(() => {
    if (!timeFilteredNodes) return commitNodes;
    return commitNodes.filter(node => timeFilteredNodes.includes(node.commit.sha));
  }, [commitNodes, timeFilteredNodes]);

  useEffect(() => {
    if (repoUrl) {
      const decodedUrl = decodeURIComponent(repoUrl);
      loadRepository(decodedUrl);
    }
    
    return () => {
      reset();
    };
  }, [repoUrl, reset]);

  // Save to recent repos when data loads
  useEffect(() => {
    if (repoInfo && commits.length > 0) {
      addRecentRepo({
        owner: repoInfo.owner.login,
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        url: `github.com/${repoInfo.full_name}`,
        stars: repoInfo.stargazers_count,
        language: repoInfo.language,
      });
    }
  }, [repoInfo, commits.length]);

  const handleRetry = () => {
    if (repoUrl) {
      reset();
      loadRepository(decodeURIComponent(repoUrl));
    }
  };

  const handleTimeRangeChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) {
      setTimeFilteredNodes(null);
      return;
    }

    const filtered = commits
      .filter(c => {
        const d = new Date(c.author.date).getTime();
        return d >= startDate.getTime() && d <= endDate.getTime();
      })
      .map(c => c.sha);

    setTimeFilteredNodes(filtered);
  }, [commits]);

  // Loading state
  if (isLoading) {
    return <LoadingOverlay progress={loadingProgress} message={loadingMessage} />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // No data yet
  if (!repoInfo) {
    return <LoadingOverlay progress={0} message="Initializing..." />;
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
      {/* 3D Canvas */}
      <CommitGalaxy className="absolute inset-0" filteredNodes={filteredNodes} />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg shadow-md border border-slate-200 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="bg-white px-3 sm:px-4 py-2 rounded-lg shadow-md border border-slate-200 text-indigo-600 font-mono text-sm font-semibold">
              {filteredNodes.length.toLocaleString()} commits
            </span>
            <button
              onClick={() => setHelpOpen(true)}
              className="bg-white p-2 rounded-lg shadow-md border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats panel (left) - hidden on small screens */}
        <div className="hidden lg:block absolute left-4 top-16 pointer-events-auto max-h-[calc(100vh-80px)] overflow-y-auto">
          <StatsPanel
            repoInfo={repoInfo}
            commitCount={commits.length}
            branches={branches}
            contributors={contributors}
            commits={commits}
          />
          
          {/* Time slider below stats */}
          <div className="mt-3">
            <TimeSlider
              commits={commits}
              onRangeChange={handleTimeRangeChange}
            />
          </div>
        </div>

        {/* Commit details (right) */}
        <AnimatePresence>
          {selectedCommit && (
            <div className="absolute right-4 top-16 pointer-events-auto max-h-[calc(100vh-120px)] overflow-y-auto">
              <CommitDetails
                commit={selectedCommit}
                onClose={() => setSelectedCommit(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Instructions hint - center bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-slate-200 text-slate-500 text-xs">
            Click a commit to view details • Drag to rotate • Scroll to zoom
          </div>
        </div>

        {/* Mobile stats toggle */}
        <div className="lg:hidden absolute left-4 bottom-3 pointer-events-auto">
          <button
            className="bg-white px-3 py-2 rounded-lg shadow-md border border-slate-200 text-slate-600 text-xs font-medium"
            onClick={() => {
              // Could open a mobile drawer here
              setHelpOpen(true);
            }}
          >
            View Stats
          </button>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal />
    </div>
  );
}

export default function VisualizePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <VisualizationContent />
    </Suspense>
  );
}
