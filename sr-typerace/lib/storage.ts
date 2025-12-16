// Stats storage using localStorage

export interface RaceResult {
  id: string;
  date: number; // timestamp
  wpm: number;
  accuracy: number;
  category: string;
  mode: 'practice' | 'challenge' | 'vs-computer' | 'vs-friend';
  duration: number; // seconds
  won?: boolean; // for vs modes
}

export interface UserStats {
  totalRaces: number;
  totalWordsTyped: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  currentStreak: number; // consecutive days
  lastRaceDate: number | null;
  history: RaceResult[];
}

const STORAGE_KEY = 'typerace-stats';
const MAX_HISTORY = 100;

function getDefaultStats(): UserStats {
  return {
    totalRaces: 0,
    totalWordsTyped: 0,
    bestWpm: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    currentStreak: 0,
    lastRaceDate: null,
    history: [],
  };
}

export function getStats(): UserStats {
  if (typeof window === 'undefined') return getDefaultStats();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultStats();
    return JSON.parse(stored) as UserStats;
  } catch {
    return getDefaultStats();
  }
}

export function saveRaceResult(result: Omit<RaceResult, 'id' | 'date'>): void {
  if (typeof window === 'undefined') return;

  try {
    const stats = getStats();
    const newResult: RaceResult = {
      ...result,
      id: `race-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      date: Date.now(),
    };

    // Update history (keep last MAX_HISTORY)
    stats.history = [newResult, ...stats.history].slice(0, MAX_HISTORY);

    // Update totals
    stats.totalRaces++;
    stats.totalWordsTyped += Math.round((result.wpm * result.duration) / 60 / 5); // Approximate

    // Update best WPM
    if (result.wpm > stats.bestWpm) {
      stats.bestWpm = result.wpm;
    }

    // Update averages
    const totalWpm = stats.history.reduce((sum, r) => sum + r.wpm, 0);
    const totalAccuracy = stats.history.reduce((sum, r) => sum + r.accuracy, 0);
    stats.averageWpm = Math.round(totalWpm / stats.history.length);
    stats.averageAccuracy = Math.round(totalAccuracy / stats.history.length);

    // Update streak
    const today = new Date().setHours(0, 0, 0, 0);
    const lastRaceDay = stats.lastRaceDate 
      ? new Date(stats.lastRaceDate).setHours(0, 0, 0, 0)
      : null;

    if (lastRaceDay === null || lastRaceDay < today) {
      if (lastRaceDay === today - 86400000) {
        // Consecutive day
        stats.currentStreak++;
      } else if (lastRaceDay !== today) {
        // Streak broken
        stats.currentStreak = 1;
      }
    }
    stats.lastRaceDate = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
}

export function getRecentHistory(count: number = 10): RaceResult[] {
  const stats = getStats();
  return stats.history.slice(0, count);
}

export function getWpmHistory(count: number = 20): number[] {
  const stats = getStats();
  return stats.history.slice(0, count).map(r => r.wpm).reverse();
}

export function clearStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
