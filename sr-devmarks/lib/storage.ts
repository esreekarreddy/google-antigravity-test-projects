// Bookmark types and localStorage operations

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  favicon: string;
  isFavorite: boolean;
  createdAt: number;
  visitCount: number;
  // New fields
  isRead: boolean;
  collectionId: string | null;
  sortOrder: number;
  linkStatus: 'unknown' | 'ok' | 'broken';
}

export interface Collection {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: number;
}

export interface BookmarkStats {
  total: number;
  favorites: number;
  tags: number;
  recentCount: number;
  unreadCount: number;
  collectionsCount: number;
}

const STORAGE_KEY = 'devmarks-bookmarks';
const COLLECTIONS_KEY = 'devmarks-collections';

// Generate unique ID
export function generateId(): string {
  return `bm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Get favicon URL from a website
export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

// Suggest tags based on URL
export function suggestTags(url: string): string[] {
  const tags: string[] = [];
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('github.com')) tags.push('github');
  if (lowerUrl.includes('stackoverflow.com')) tags.push('stackoverflow');
  if (lowerUrl.includes('medium.com')) tags.push('article');
  if (lowerUrl.includes('dev.to')) tags.push('dev.to', 'article');
  if (lowerUrl.includes('youtube.com')) tags.push('youtube', 'video');
  if (lowerUrl.includes('docs.')) tags.push('docs');
  if (lowerUrl.includes('npmjs.com')) tags.push('npm', 'package');
  if (lowerUrl.includes('mdn')) tags.push('mdn', 'docs');
  if (lowerUrl.includes('react')) tags.push('react');
  if (lowerUrl.includes('next')) tags.push('nextjs');
  if (lowerUrl.includes('typescript')) tags.push('typescript');
  if (lowerUrl.includes('python')) tags.push('python');
  if (lowerUrl.includes('rust')) tags.push('rust');
  if (lowerUrl.includes('docker')) tags.push('docker');
  if (lowerUrl.includes('kubernetes') || lowerUrl.includes('k8s')) tags.push('kubernetes');
  if (lowerUrl.includes('aws')) tags.push('aws');
  if (lowerUrl.includes('tailwind')) tags.push('tailwind');
  
  return [...new Set(tags)];
}

// Normalize URL for duplicate checking
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove trailing slash, www prefix, and query params for comparison
    let normalized = parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '');
    return normalized.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

// Load bookmarks from localStorage
export function loadBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const bookmarks = JSON.parse(stored) as Bookmark[];
    // Migrate old bookmarks to new format
    return bookmarks.map((b, index) => ({
      ...b,
      isRead: b.isRead ?? false,
      collectionId: b.collectionId ?? null,
      sortOrder: b.sortOrder ?? index,
      linkStatus: b.linkStatus ?? 'unknown',
    }));
  } catch {
    return [];
  }
}

// Save bookmarks to localStorage
export function saveBookmarks(bookmarks: Bookmark[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
}

// Load collections
export function loadCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(COLLECTIONS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Collection[];
  } catch {
    return [];
  }
}

// Save collections
export function saveCollections(collections: Collection[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  } catch (error) {
    console.error('Failed to save collections:', error);
  }
}

// Clear all data
export function clearAllBookmarks(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(COLLECTIONS_KEY);
}

// Export bookmarks to JSON file
export function exportToJson(bookmarks: Bookmark[], collections?: Collection[]): void {
  const data = JSON.stringify({ bookmarks, collections: collections || [] }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `devmarks-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import bookmarks from JSON file
export function importFromJson(file: File): Promise<{ bookmarks: Bookmark[]; collections: Collection[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Handle both old format (array) and new format (object with bookmarks/collections)
        let bookmarks: Bookmark[];
        let collections: Collection[] = [];
        
        if (Array.isArray(data)) {
          bookmarks = data;
        } else {
          bookmarks = data.bookmarks || [];
          collections = data.collections || [];
        }
        
        // Validate and normalize bookmarks
        const validBookmarks = bookmarks.filter((item): item is Bookmark => 
          typeof item === 'object' &&
          typeof item.url === 'string' &&
          typeof item.title === 'string'
        ).map((item, index) => ({
          ...item,
          id: item.id || generateId(),
          tags: item.tags || [],
          favicon: item.favicon || getFaviconUrl(item.url),
          isFavorite: item.isFavorite || false,
          createdAt: item.createdAt || Date.now(),
          visitCount: item.visitCount || 0,
          description: item.description || '',
          isRead: item.isRead ?? false,
          collectionId: item.collectionId ?? null,
          sortOrder: item.sortOrder ?? index,
          linkStatus: item.linkStatus ?? 'unknown',
        }));
        
        resolve({ bookmarks: validBookmarks, collections });
      } catch {
        reject(new Error('Failed to parse JSON'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Calculate stats
export function calculateStats(bookmarks: Bookmark[], collections: Collection[]): BookmarkStats {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  const allTags = new Set<string>();
  bookmarks.forEach(b => b.tags.forEach(t => allTags.add(t)));
  
  return {
    total: bookmarks.length,
    favorites: bookmarks.filter(b => b.isFavorite).length,
    tags: allTags.size,
    recentCount: bookmarks.filter(b => b.createdAt > weekAgo).length,
    unreadCount: bookmarks.filter(b => !b.isRead).length,
    collectionsCount: collections.length,
  };
}

// Get all unique tags with counts
export function getTagsWithCounts(bookmarks: Bookmark[]): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>();
  
  bookmarks.forEach(bookmark => {
    bookmark.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

// Get tag color
export function getTagColor(tag: string): { bg: string; text: string } {
  const tagColors: Record<string, { bg: string; text: string }> = {
    'react': { bg: '#e0f7fa', text: '#00838f' },
    'typescript': { bg: '#e3f2fd', text: '#1565c0' },
    'javascript': { bg: '#fffde7', text: '#f57f17' },
    'python': { bg: '#e8eaf6', text: '#3949ab' },
    'github': { bg: '#fce4ec', text: '#c62828' },
    'docs': { bg: '#e8f5e9', text: '#2e7d32' },
    'tutorial': { bg: '#f3e5f5', text: '#7b1fa2' },
    'article': { bg: '#fff3e0', text: '#e65100' },
    'video': { bg: '#ffebee', text: '#c62828' },
    'tool': { bg: '#fce4ec', text: '#ad1457' },
    'npm': { bg: '#ffebee', text: '#c62828' },
    'nextjs': { bg: '#f5f5f5', text: '#212121' },
    'tailwind': { bg: '#e0f2f1', text: '#00695c' },
    'aws': { bg: '#fff8e1', text: '#ff6f00' },
    'docker': { bg: '#e3f2fd', text: '#1565c0' },
  };
  
  if (tagColors[tag.toLowerCase()]) {
    return tagColors[tag.toLowerCase()];
  }
  
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return {
    bg: `hsl(${hue}, 60%, 95%)`,
    text: `hsl(${hue}, 70%, 35%)`,
  };
}

// Collection colors
export const COLLECTION_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

// Generate shareable link for a collection
export function generateShareLink(collection: Collection, bookmarks: Bookmark[]): string {
  const collectionBookmarks = bookmarks.filter(b => b.collectionId === collection.id);
  const shareData = {
    collection: { name: collection.name, color: collection.color },
    bookmarks: collectionBookmarks.map(b => ({
      url: b.url,
      title: b.title,
      description: b.description,
      tags: b.tags,
    })),
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
  return `${window.location.origin}/share?data=${encoded}`;
}

// Parse shareable link data
export function parseShareLink(data: string): { collection: { name: string; color: string }; bookmarks: Partial<Bookmark>[] } | null {
  try {
    const decoded = decodeURIComponent(atob(data));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
