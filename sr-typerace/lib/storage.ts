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

// ============ SECURITY UTILITIES ============

// Prototype pollution protection
function hasPrototypePollution(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object') return false;
  
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  const checkObject = (o: Record<string, unknown>): boolean => {
    for (const key of Object.keys(o)) {
      if (dangerousKeys.includes(key)) return true;
      if (typeof o[key] === 'object' && o[key] !== null) {
        if (checkObject(o[key] as Record<string, unknown>)) return true;
      }
    }
    return false;
  };
  
  return checkObject(obj as Record<string, unknown>);
}

// Safe JSON parse
function safeJsonParse<T>(json: string): T | null {
  try {
    const parsed = JSON.parse(json);
    if (hasPrototypePollution(parsed)) {
      console.error('[Security] Blocked prototype pollution attempt');
      return null;
    }
    return parsed as T;
  } catch {
    return null;
  }
}

// Validate RaceResult structure
function isValidRaceResult(item: unknown): item is RaceResult {
  if (!item || typeof item !== 'object') return false;
  const r = item as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.date === 'number' &&
    typeof r.wpm === 'number' && r.wpm >= 0 && r.wpm <= 500 && // Reasonable WPM cap
    typeof r.accuracy === 'number' && r.accuracy >= 0 && r.accuracy <= 100 &&
    typeof r.category === 'string' &&
    typeof r.mode === 'string' &&
    typeof r.duration === 'number' && r.duration >= 0
  );
}

// Validate UserStats structure
function isValidUserStats(item: unknown): item is UserStats {
  if (!item || typeof item !== 'object') return false;
  const s = item as Record<string, unknown>;
  return (
    typeof s.totalRaces === 'number' && s.totalRaces >= 0 &&
    typeof s.totalWordsTyped === 'number' &&
    typeof s.bestWpm === 'number' && s.bestWpm >= 0 &&
    typeof s.averageWpm === 'number' &&
    typeof s.averageAccuracy === 'number' &&
    typeof s.currentStreak === 'number' &&
    Array.isArray(s.history)
  );
}

// ============ STORAGE FUNCTIONS ============

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
    
    // SECURITY: Use safe JSON parse with prototype pollution protection
    const parsed = safeJsonParse<unknown>(stored);
    if (!parsed || !isValidUserStats(parsed)) {
      console.error('[Security] Invalid stats data structure');
      return getDefaultStats();
    }
    
    // SECURITY: Validate and filter history entries, cap at MAX_HISTORY
    const validHistory = parsed.history
      .filter(isValidRaceResult)
      .slice(0, MAX_HISTORY);
    
    return {
      ...parsed,
      history: validHistory,
      // Sanitize numeric values
      totalRaces: Math.max(0, Math.floor(parsed.totalRaces)),
      totalWordsTyped: Math.max(0, Math.floor(parsed.totalWordsTyped)),
      bestWpm: Math.max(0, Math.min(500, parsed.bestWpm)),
      averageWpm: Math.max(0, Math.min(500, parsed.averageWpm)),
      averageAccuracy: Math.max(0, Math.min(100, parsed.averageAccuracy)),
      currentStreak: Math.max(0, Math.floor(parsed.currentStreak)),
    };
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
