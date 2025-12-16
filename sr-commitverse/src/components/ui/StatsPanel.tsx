'use client';

import { motion } from 'framer-motion';
import { GitCommit, GitBranch, Users, Star, ExternalLink, TrendingUp, TrendingDown, Minus, GitMerge, Clock } from 'lucide-react';
import { RepoInfo, Branch, Contributor, Commit } from '@/store/repoStore';
import { formatNumber } from '@/lib/utils';
import { calculateAnalytics } from '@/lib/storage';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { CommitSparkline } from '@/components/charts/CommitSparkline';
import { ContributorChart } from '@/components/charts/ContributorChart';

interface StatsPanelProps {
  repoInfo: RepoInfo;
  commitCount: number;
  branches: Branch[];
  contributors: Contributor[];
  commits: Commit[];
}

export function StatsPanel({ repoInfo, commitCount, branches, contributors, commits }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'team'>('overview');

  const analytics = useMemo(() => {
    return calculateAnalytics(commits);
  }, [commits]);

  const VelocityIcon = analytics.velocity === 'increasing' ? TrendingUp :
                       analytics.velocity === 'decreasing' ? TrendingDown : Minus;

  const velocityColor = analytics.velocity === 'increasing' ? 'text-emerald-500' :
                       analytics.velocity === 'decreasing' ? 'text-red-500' : 'text-slate-400';

  return (
    <motion.div
      className="bg-white w-full sm:w-80 rounded-xl shadow-xl border border-slate-200 overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Repo header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          {repoInfo.owner.avatar_url && (
            <Image
              src={repoInfo.owner.avatar_url}
              alt={repoInfo.owner.login}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <a
            href={repoInfo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-medium text-sm truncate flex items-center gap-1"
          >
            {repoInfo.full_name}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {repoInfo.description && (
          <p className="text-slate-500 text-xs line-clamp-2">
            {repoInfo.description}
          </p>
        )}
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg p-2.5 text-center">
          <div className="text-indigo-600 text-lg font-bold">
            {formatNumber(commitCount)}
          </div>
          <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1">
            <GitCommit className="w-3 h-3" />
            Commits
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-2.5 text-center">
          <div className="text-pink-500 text-lg font-bold">
            {formatNumber(branches.length)}
          </div>
          <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1">
            <GitBranch className="w-3 h-3" />
            Branches
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-2.5 text-center">
          <div className="text-amber-500 text-lg font-bold">
            {formatNumber(repoInfo.stargazers_count)}
          </div>
          <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1">
            <Star className="w-3 h-3" />
            Stars
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-2.5 text-center">
          <div className="text-emerald-500 text-lg font-bold">
            {formatNumber(contributors.length)}
          </div>
          <div className="text-slate-500 text-[10px] flex items-center justify-center gap-1">
            <Users className="w-3 h-3" />
            Contributors
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {(['overview', 'activity', 'team'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 max-h-[280px] overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Language */}
            {repoInfo.language && (
              <div>
                <div className="text-slate-500 text-xs mb-1">Primary Language</div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-slate-700 text-sm">{repoInfo.language}</span>
                </div>
              </div>
            )}

            {/* Insights */}
            <div>
              <div className="text-slate-500 text-xs mb-2">Project Insights</div>
              <div className="space-y-2.5">
                {/* Velocity - commit rate trend */}
                <div 
                  className="flex items-center justify-between text-sm group cursor-help"
                  title="Compares recent commit frequency to older periods"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <VelocityIcon className={`w-3 h-3 ${velocityColor}`} />
                    <span>Velocity</span>
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      (recent vs older)
                    </span>
                  </span>
                  <span className={`font-medium ${velocityColor}`}>
                    {analytics.velocity}
                  </span>
                </div>
                
                {/* Merge Ratio - % of merge commits */}
                <div 
                  className="flex items-center justify-between text-sm group cursor-help"
                  title="Percentage of commits that are merge commits (PRs/branches)"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <GitMerge className="w-3 h-3 text-violet-500" />
                    <span>Merges</span>
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      (% from PRs)
                    </span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {Math.round(analytics.mergeRatio * 100)}%
                  </span>
                </div>
                
                {/* Peak Activity - most active time */}
                <div 
                  className="flex items-center justify-between text-sm group cursor-help"
                  title="Day and hour when most commits typically happen"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3 h-3 text-cyan-500" />
                    <span>Most Active</span>
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      (typical time)
                    </span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {analytics.peakDay} {analytics.peakHour}:00
                  </span>
                </div>

                {/* Avg per Day */}
                <div 
                  className="flex items-center justify-between text-sm group cursor-help"
                  title="Average number of commits per day over repo lifetime"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <GitCommit className="w-3 h-3 text-indigo-500" />
                    <span>Avg/Day</span>
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      (over lifetime)
                    </span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {analytics.avgCommitsPerDay.toFixed(1)} commits
                  </span>
                </div>
              </div>
            </div>

            {/* Commit sparkline */}
            <CommitSparkline data={analytics.commitsPerWeek} />
          </div>
        )}

        {activeTab === 'activity' && (
          <ActivityHeatmap data={analytics.activityHeatmap} />
        )}

        {activeTab === 'team' && (
          <div className="space-y-4">
            <ContributorChart data={analytics.contributorStats} />
            
            {/* Contributor avatars */}
            {contributors.length > 0 && (
              <div>
                <div className="text-slate-500 text-xs mb-2">GitHub Profiles</div>
                <div className="flex flex-wrap gap-1">
                  {contributors.slice(0, 8).map((contrib) => (
                    <a
                      key={contrib.login}
                      href={contrib.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      title={`${contrib.login} (${contrib.contributions} commits)`}
                    >
                      <Image
                        src={contrib.avatar_url}
                        alt={contrib.login}
                        width={28}
                        height={28}
                        className="rounded-full border-2 border-transparent group-hover:border-indigo-500 transition-colors"
                      />
                    </a>
                  ))}
                  {contributors.length > 8 && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px]">
                      +{contributors.length - 8}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
