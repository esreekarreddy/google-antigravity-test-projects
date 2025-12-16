'use client';

import { useMemo } from 'react';

interface ContributorChartProps {
  data: { name: string; count: number; percentage: number }[];
  className?: string;
}

// Colors for contributors
const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316', // Orange
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#84cc16', // Lime
];

export function ContributorChart({ data, className = '' }: ContributorChartProps) {
  const chartData = useMemo(() => {
    return data.slice(0, 5).map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center h-20 text-slate-400 text-sm`}>
        No contributors
      </div>
    );
  }

  return (
    <div className={className}>
      <h4 className="text-xs font-medium text-slate-700 mb-3">Top Contributors</h4>

      <div className="space-y-2">
        {chartData.map((contributor) => (
          <div key={contributor.name} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: contributor.color }}
                />
                <span className="text-xs text-slate-700 truncate max-w-[120px] sm:max-w-[150px]" title={contributor.name}>
                  {contributor.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">
                  {contributor.count}
                </span>
                <span className="text-xs font-medium text-slate-600 w-8 text-right">
                  {contributor.percentage}%
                </span>
              </div>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                style={{
                  width: `${contributor.percentage}%`,
                  backgroundColor: contributor.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {data.length > 5 && (
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          +{data.length - 5} more contributors
        </p>
      )}
    </div>
  );
}
