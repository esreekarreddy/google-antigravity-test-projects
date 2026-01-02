// localStorage utilities for CommitVerse
// All data stays on user's device - privacy first

const STORAGE_KEYS = {
  RECENT_REPOS: "cv_recent_repos",
  PREFERENCES: "cv_preferences",
} as const;

const MAX_RECENT_REPOS = 5;

export interface RecentRepo {
  owner: string;
  name: string;
  fullName: string;
  url: string;
  visitedAt: number;
  stars?: number;
  language?: string;
}

export interface UserPreferences {
  theme: "light" | "dark";
  autoPlay: boolean;
}

// Safe localStorage access (handles SSR and disabled storage)
function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

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

// Validate RecentRepo structure
function isValidRecentRepo(item: unknown): item is RecentRepo {
  if (!item || typeof item !== 'object') return false;
  const r = item as Record<string, unknown>;
  return (
    typeof r.owner === 'string' && r.owner.length > 0 &&
    typeof r.name === 'string' && r.name.length > 0 &&
    typeof r.fullName === 'string' &&
    typeof r.url === 'string' &&
    typeof r.visitedAt === 'number'
  );
}

// Escape HTML for XSS prevention
function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c] || c);
}

// ============ STORAGE FUNCTIONS ============

// Recent Repos
export function getRecentRepos(): RecentRepo[] {
  const data = safeGetItem(STORAGE_KEYS.RECENT_REPOS);
  if (!data) return [];

  try {
    // SECURITY: Use safe JSON parse with prototype pollution protection
    const parsed = safeJsonParse<unknown[]>(data);
    if (!parsed || !Array.isArray(parsed)) {
      console.error('[Security] Invalid recent repos data structure');
      return [];
    }
    
    // SECURITY: Validate and sanitize each repo
    const repos = parsed
      .filter(isValidRecentRepo)
      .map(r => ({
        ...r,
        owner: escapeHtml(r.owner),
        name: escapeHtml(r.name),
        fullName: escapeHtml(r.fullName),
      }));
    
    // Sort by most recent first
    return repos.sort((a, b) => b.visitedAt - a.visitedAt);
  } catch {
    return [];
  }
}

export function addRecentRepo(repo: Omit<RecentRepo, "visitedAt">): void {
  const repos = getRecentRepos();

  // Remove if already exists
  const filtered = repos.filter((r) => r.fullName !== repo.fullName);

  // Add to front with timestamp
  const updated: RecentRepo[] = [
    { ...repo, visitedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_RECENT_REPOS);

  safeSetItem(STORAGE_KEYS.RECENT_REPOS, JSON.stringify(updated));
}

export function clearRecentRepos(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_REPOS);
  } catch {
    // Ignore
  }
}

// User Preferences
export function getPreferences(): UserPreferences {
  const data = safeGetItem(STORAGE_KEYS.PREFERENCES);
  if (!data) {
    return { theme: "light", autoPlay: false };
  }

  try {
    return JSON.parse(data) as UserPreferences;
  } catch {
    return { theme: "light", autoPlay: false };
  }
}

export function setPreferences(prefs: Partial<UserPreferences>): void {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  safeSetItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
}

// Analytics helpers - calculate insights from commits
export interface CommitAnalytics {
  commitsPerWeek: { week: string; count: number }[];
  activityHeatmap: number[][]; // 7 days x 24 hours
  contributorStats: { name: string; count: number; percentage: number }[];
  mergeRatio: number; // 0-1
  avgCommitsPerDay: number;
  velocity: "increasing" | "stable" | "decreasing";
  peakDay: string;
  peakHour: number;
}

export function calculateAnalytics(
  commits: Array<{
    sha: string;
    message: string;
    author: { name: string; date: string };
    parents: { sha: string }[];
  }>
): CommitAnalytics {
  if (commits.length === 0) {
    return {
      commitsPerWeek: [],
      activityHeatmap: Array(7)
        .fill(null)
        .map(() => Array(24).fill(0)),
      contributorStats: [],
      mergeRatio: 0,
      avgCommitsPerDay: 0,
      velocity: "stable",
      peakDay: "N/A",
      peakHour: 0,
    };
  }

  // Activity heatmap: [day][hour]
  const heatmap: number[][] = Array(7)
    .fill(null)
    .map(() => Array(24).fill(0));
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Contributor counts
  const authorCounts = new Map<string, number>();

  // Weekly buckets
  const weeklyBuckets = new Map<string, number>();

  // Merge count
  let mergeCount = 0;

  // Process each commit
  commits.forEach((commit) => {
    const date = new Date(commit.author.date);
    const day = date.getDay();
    const hour = date.getHours();

    // Heatmap
    heatmap[day][hour]++;

    // Author stats
    const currentCount = authorCounts.get(commit.author.name) || 0;
    authorCounts.set(commit.author.name, currentCount + 1);

    // Weekly stats
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split("T")[0];
    const weekCount = weeklyBuckets.get(weekKey) || 0;
    weeklyBuckets.set(weekKey, weekCount + 1);

    // Merge commits have > 1 parent
    if (commit.parents.length > 1) {
      mergeCount++;
    }
  });

  // Calculate contributor percentages
  const sortedAuthors = Array.from(authorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / commits.length) * 100),
    }));

  // Calculate weekly data (last 12 weeks)
  const commitsPerWeek = Array.from(weeklyBuckets.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([week, count]) => ({ week, count }));

  // Calculate velocity (comparing recent vs older)
  const midpoint = Math.floor(commitsPerWeek.length / 2);
  const olderAvg =
    commitsPerWeek.slice(0, midpoint).reduce((a, b) => a + b.count, 0) /
    (midpoint || 1);
  const recentAvg =
    commitsPerWeek.slice(midpoint).reduce((a, b) => a + b.count, 0) /
    (commitsPerWeek.length - midpoint || 1);

  let velocity: "increasing" | "stable" | "decreasing" = "stable";
  if (recentAvg > olderAvg * 1.2) velocity = "increasing";
  else if (recentAvg < olderAvg * 0.8) velocity = "decreasing";

  // Find peak day and hour
  let maxDayCount = 0;
  let peakDayIndex = 0;
  let maxHourCount = 0;
  let peakHour = 0;

  heatmap.forEach((hours, dayIndex) => {
    const dayTotal = hours.reduce((a, b) => a + b, 0);
    if (dayTotal > maxDayCount) {
      maxDayCount = dayTotal;
      peakDayIndex = dayIndex;
    }

    hours.forEach((count, hourIndex) => {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = hourIndex;
      }
    });
  });

  // Date range for avg calculation
  const dates = commits.map((c) => new Date(c.author.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const dayRange = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));

  return {
    commitsPerWeek,
    activityHeatmap: heatmap,
    contributorStats: sortedAuthors,
    mergeRatio: commits.length > 0 ? mergeCount / commits.length : 0,
    avgCommitsPerDay: commits.length / dayRange,
    velocity,
    peakDay: dayNames[peakDayIndex],
    peakHour,
  };
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
