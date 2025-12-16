'use client';

import { motion } from 'framer-motion';
import { X, ExternalLink, GitCommit, User, Calendar, FileText, Hash, GitBranch } from 'lucide-react';
import { Commit } from '@/store/repoStore';
import { formatRelativeDate, truncate } from '@/lib/utils';

interface CommitDetailsProps {
  commit: Commit;
  onClose: () => void;
}

export function CommitDetails({ commit, onClose }: CommitDetailsProps) {
  const messageLines = commit.message.split('\n');
  const title = messageLines[0];
  const body = messageLines.slice(1).join('\n').trim();

  return (
    <motion.div
      className="bg-white p-5 w-80 max-h-[85vh] overflow-y-auto rounded-xl shadow-xl border border-slate-200"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <GitCommit className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-mono text-sm text-indigo-600 font-semibold">
            {commit.sha.slice(0, 7)}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Commit message */}
      <div className="mb-4">
        <h3 className="text-slate-800 font-semibold text-sm mb-1 leading-tight">
          {truncate(title, 120)}
        </h3>
        {body && (
          <p className="text-slate-600 text-xs whitespace-pre-wrap mt-2 leading-relaxed">
            {truncate(body, 400)}
          </p>
        )}
      </div>

      {/* Commit details */}
      <div className="space-y-3 mb-4 bg-slate-50 rounded-lg p-3">
        {/* Full SHA */}
        <div className="flex items-start gap-2">
          <Hash className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-slate-500 text-xs">Full SHA</p>
            <p className="text-slate-700 font-mono text-xs break-all">{commit.sha}</p>
          </div>
        </div>
        
        {/* Author */}
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-slate-500 text-xs">Author</p>
            <p className="text-slate-700 text-sm">{commit.author.name}</p>
            <p className="text-slate-500 text-xs">{commit.author.email}</p>
          </div>
        </div>
        
        {/* Date */}
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-slate-500 text-xs">Committed</p>
            <p className="text-slate-700 text-sm">
              {formatRelativeDate(commit.author.date)}
            </p>
            <p className="text-slate-500 text-xs">
              {new Date(commit.author.date).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Parents */}
        {commit.parents.length > 0 && (
          <div className="flex items-start gap-2">
            <GitBranch className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-500 text-xs">
                {commit.parents.length > 1 ? 'Merge commit' : 'Parent'}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {commit.parents.map((parent, i) => (
                  <span key={i} className="font-mono text-xs bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    {parent.sha.slice(0, 7)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Note about files */}
      <div className="flex items-start gap-2 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <FileText className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-amber-800 text-xs font-medium">Files Changed</p>
          <p className="text-amber-700 text-xs mt-0.5">
            View on GitHub to see full diff, files changed, and line-by-line changes.
          </p>
        </div>
      </div>

      {/* View on GitHub */}
      <a
        href={commit.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
      >
        <ExternalLink className="w-4 h-4" />
        View Full Details on GitHub
      </a>
    </motion.div>
  );
}
