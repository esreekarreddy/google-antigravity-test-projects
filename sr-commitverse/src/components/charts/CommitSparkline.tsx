'use client';

import { useMemo } from 'react';

interface CommitSparklineProps {
  data: { week: string; count: number }[];
  className?: string;
}

export function CommitSparkline({ data, className = '' }: CommitSparklineProps) {
  const { normalizedData, avgValue } = useMemo(() => {
    if (data.length === 0) return { normalizedData: [], avgValue: 0 };
    
    const counts = data.map(d => d.count);
    const max = Math.max(...counts, 1);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    
    return {
      normalizedData: counts.map(c => c / max),
      avgValue: avg,
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center h-16 text-slate-400 text-sm`}>
        No data
      </div>
    );
  }

  const barWidth = Math.max(4, Math.min(12, 160 / data.length));
  const height = 40;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-slate-700">Commits per Week</h4>
        <span className="text-[10px] text-slate-400">
          Avg: {avgValue.toFixed(1)}/week
        </span>
      </div>

      <div className="flex items-end gap-[2px] h-[40px] w-full">
        {normalizedData.map((value, index) => (
          <div
            key={index}
            className="flex-1 group relative"
            style={{ maxWidth: `${barWidth}px` }}
          >
            <div
              className="bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t-sm transition-all hover:from-indigo-600 hover:to-violet-500"
              style={{
                height: `${Math.max(2, value * height)}px`,
                minHeight: '2px',
              }}
            />
            
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                {data[index].count} commits
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-slate-400">
          {data[0]?.week.split('-').slice(1).join('/')}
        </span>
        <span className="text-[9px] text-slate-400">
          {data[data.length - 1]?.week.split('-').slice(1).join('/')}
        </span>
      </div>
    </div>
  );
}
