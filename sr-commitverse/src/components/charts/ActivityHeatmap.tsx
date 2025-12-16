'use client';

import { useMemo } from 'react';

interface ActivityHeatmapProps {
  data: number[][]; // 7 days x 24 hours
  className?: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function ActivityHeatmap({ data, className = '' }: ActivityHeatmapProps) {
  const { normalizedData, maxValue } = useMemo(() => {
    const max = Math.max(...data.flatMap(row => row), 1);
    return {
      normalizedData: data.map(row => row.map(val => val / max)),
      maxValue: max,
    };
  }, [data]);

  const getColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-slate-100';
    if (intensity < 0.25) return 'bg-indigo-100';
    if (intensity < 0.5) return 'bg-indigo-200';
    if (intensity < 0.75) return 'bg-indigo-400';
    return 'bg-indigo-600';
  };

  return (
    <div className={`${className}`}>
      {/* Explanation */}
      <p className="text-[10px] text-slate-500 mb-3">
        Shows when contributors typically commit. Darker = more commits at that time.
      </p>
      
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-slate-700">Commits by Day & Hour</h4>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400">Less</span>
          <div className="flex gap-0.5">
            <div className="w-2 h-2 rounded-sm bg-slate-100" />
            <div className="w-2 h-2 rounded-sm bg-indigo-100" />
            <div className="w-2 h-2 rounded-sm bg-indigo-200" />
            <div className="w-2 h-2 rounded-sm bg-indigo-400" />
            <div className="w-2 h-2 rounded-sm bg-indigo-600" />
          </div>
          <span className="text-[10px] text-slate-400">More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[300px]">
          {/* Hours header */}
          <div className="flex gap-[1px] mb-[1px] ml-8">
            {HOURS.filter((_, i) => i % 3 === 0).map(hour => (
              <div
                key={hour}
                className="text-[8px] text-slate-400 w-[18px] text-center"
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-[1px] mb-[1px]">
              <span className="text-[9px] text-slate-500 w-7 flex-shrink-0">{day}</span>
              <div className="flex gap-[1px]">
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className={`w-[6px] h-[6px] sm:w-2 sm:h-2 rounded-[2px] ${getColor(normalizedData[dayIndex][hour])} transition-colors hover:ring-1 hover:ring-indigo-400`}
                    title={`${day} ${hour}:00 - ${data[dayIndex][hour]} commits`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {maxValue > 0 && (
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Peak: {maxValue} commits in a single hour
        </p>
      )}
    </div>
  );
}
