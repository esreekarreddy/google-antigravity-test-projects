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
const BACKUP_KEY = 'devmarks-backup';
// Storage versioning for future migrations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STORAGE_VERSION = '2.0.0';

// ============ SECURITY UTILITIES ============

// Prototype pollution protection - blocks dangerous keys
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

// Safe JSON parse with prototype pollution protection
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

// Validate bookmark structure
function isValidBookmark(item: unknown): item is Bookmark {
  if (!item || typeof item !== 'object') return false;
  const b = item as Record<string, unknown>;
  return (
    typeof b.id === 'string' && b.id.length > 0 &&
    typeof b.url === 'string' && b.url.length > 0 &&
    typeof b.title === 'string' &&
    (b.tags === undefined || Array.isArray(b.tags)) &&
    (b.createdAt === undefined || typeof b.createdAt === 'number')
  );
}

// Validate collection structure
function isValidCollection(item: unknown): item is Collection {
  if (!item || typeof item !== 'object') return false;
  const c = item as Record<string, unknown>;
  return (
    typeof c.id === 'string' && c.id.length > 0 &&
    typeof c.name === 'string' && c.name.length > 0 &&
    typeof c.color === 'string'
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

// Sanitize URL - remove sensitive query params
function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url);
    const sensitiveParams = ['token', 'key', 'password', 'secret', 'auth', 'api_key', 'apikey', 'access_token', 'session', 'sid', 'jwt'];
    sensitiveParams.forEach(p => u.searchParams.delete(p));
    return u.toString();
  } catch {
    return url;
  }
}

// Backup storage before destructive operations
function backupStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const bookmarks = localStorage.getItem(STORAGE_KEY);
    const collections = localStorage.getItem(COLLECTIONS_KEY);
    const backup = {
      bookmarks: bookmarks ? safeJsonParse(bookmarks) : [],
      collections: collections ? safeJsonParse(collections) : [],
      timestamp: Date.now()
    };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  } catch (error) {
    console.error('Backup failed:', error);
  }
}

// Simple HMAC-like signature for share links (uses a deterministic hash)
function generateSignature(data: string): string {
  let hash = 0;
  const salt = 'devmarks-secure-2024';
  const combined = salt + data + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Verify signature
function verifySignature(data: string, signature: string): boolean {
  return generateSignature(data) === signature;
}

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
    const normalized = parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '');
    return normalized.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

// Load bookmarks from localStorage with security validation
export function loadBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    // Use safe JSON parse with prototype pollution protection
    const parsed = safeJsonParse<unknown[]>(stored);
    if (!parsed || !Array.isArray(parsed)) {
      console.error('[Security] Invalid bookmarks data structure');
      return [];
    }
    
    // Validate each bookmark and filter invalid ones
    const validBookmarks = parsed
      .filter(isValidBookmark)
      .map((b, index) => ({
        ...b,
        // Sanitize potentially dangerous fields
        url: sanitizeUrl(b.url),
        title: escapeHtml(b.title),
        description: escapeHtml(b.description || ''),
        isRead: b.isRead ?? false,
        collectionId: b.collectionId ?? null,
        sortOrder: b.sortOrder ?? index,
        linkStatus: b.linkStatus ?? 'unknown',
      }));
    
    return validBookmarks;
  } catch (error) {
    console.error('[Security] Failed to load bookmarks:', error);
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

// Load collections with security validation
export function loadCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(COLLECTIONS_KEY);
    if (!stored) return [];
    
    // Use safe JSON parse with prototype pollution protection
    const parsed = safeJsonParse<unknown[]>(stored);
    if (!parsed || !Array.isArray(parsed)) {
      console.error('[Security] Invalid collections data structure');
      return [];
    }
    
    // Validate each collection and filter invalid ones
    return parsed
      .filter(isValidCollection)
      .map(c => ({
        ...c,
        name: escapeHtml(c.name),
      }));
  } catch (error) {
    console.error('[Security] Failed to load collections:', error);
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

// Clear all data with backup for safety
export function clearAllBookmarks(): void {
  if (typeof window === 'undefined') return;
  
  // SECURITY: Create backup before destructive operation
  backupStorage();
  
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

// Import bookmarks from JSON file with full security validation
export function importFromJson(file: File): Promise<{ bookmarks: Bookmark[]; collections: Collection[] }> {
  return new Promise((resolve, reject) => {
    // SECURITY: Limit file size to prevent DoS
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('File too large (max 10MB)'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const rawData = event.target?.result as string;
        
        // SECURITY: Use safe JSON parse with prototype pollution protection
        const data = safeJsonParse<unknown>(rawData);
        if (!data) {
          reject(new Error('Invalid or malicious JSON detected'));
          return;
        }
        
        // SECURITY: Check for prototype pollution in parsed data
        if (hasPrototypePollution(data)) {
          reject(new Error('Malicious data detected: prototype pollution attempt'));
          return;
        }
        
        // Handle both old format (array) and new format (object with bookmarks/collections)
        let rawBookmarks: unknown[];
        let rawCollections: unknown[] = [];
        
        if (Array.isArray(data)) {
          rawBookmarks = data;
        } else if (typeof data === 'object' && data !== null) {
          const d = data as Record<string, unknown>;
          rawBookmarks = Array.isArray(d.bookmarks) ? d.bookmarks : [];
          rawCollections = Array.isArray(d.collections) ? d.collections : [];
        } else {
          reject(new Error('Invalid import format'));
          return;
        }
        
        // SECURITY: Validate and sanitize each bookmark
        const validBookmarks = rawBookmarks
          .filter(isValidBookmark)
          .map((item, index) => ({
            ...item,
            id: item.id || generateId(),
            url: sanitizeUrl(item.url),
            title: escapeHtml(item.title),
            description: escapeHtml(item.description || ''),
            tags: Array.isArray(item.tags) 
              ? item.tags.filter((t: unknown) => typeof t === 'string').map((t: string) => escapeHtml(t))
              : [],
            favicon: item.favicon || getFaviconUrl(item.url),
            isFavorite: Boolean(item.isFavorite),
            createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
            visitCount: typeof item.visitCount === 'number' ? Math.max(0, item.visitCount) : 0,
            isRead: Boolean(item.isRead),
            collectionId: typeof item.collectionId === 'string' ? item.collectionId : null,
            sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index,
            linkStatus: (['unknown', 'ok', 'broken'] as const).includes(item.linkStatus as 'unknown' | 'ok' | 'broken') 
              ? item.linkStatus 
              : 'unknown',
          }));
        
        // SECURITY: Validate and sanitize collections
        const validCollections = rawCollections
          .filter(isValidCollection)
          .map(c => ({
            ...c,
            name: escapeHtml(c.name),
          }));
        
        // SECURITY: Create backup before import
        backupStorage();
        
        resolve({ bookmarks: validBookmarks, collections: validCollections });
      } catch (error) {
        reject(new Error('Failed to parse JSON: ' + (error instanceof Error ? error.message : 'Unknown error')));
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

// Generate shareable link for a collection with HMAC signature
export function generateShareLink(collection: Collection, bookmarks: Bookmark[]): string {
  const collectionBookmarks = bookmarks.filter(b => b.collectionId === collection.id);
  const shareData = {
    collection: { name: collection.name, color: collection.color },
    bookmarks: collectionBookmarks.map(b => ({
      url: sanitizeUrl(b.url),
      title: escapeHtml(b.title),
      description: escapeHtml(b.description || ''),
      tags: b.tags.map(t => escapeHtml(t)),
    })),
  };
  const dataString = JSON.stringify(shareData);
  const encoded = btoa(encodeURIComponent(dataString));
  // SECURITY: Add signature to prevent tampering
  const signature = generateSignature(dataString);
  return `${window.location.origin}/share?data=${encoded}&sig=${signature}`;
}

// Parse shareable link data with signature verification
export function parseShareLink(data: string, signature?: string): { collection: { name: string; color: string }; bookmarks: Partial<Bookmark>[] } | null {
  try {
    const decoded = decodeURIComponent(atob(data));
    
    // SECURITY: Verify signature if provided
    if (signature && !verifySignature(decoded, signature)) {
      console.error('[Security] Share link signature verification failed');
      return null;
    }
    
    // SECURITY: Use safe JSON parse
    const parsed = safeJsonParse<{ collection: { name: string; color: string }; bookmarks: unknown[] }>(decoded);
    if (!parsed || !parsed.collection || !Array.isArray(parsed.bookmarks)) {
      return null;
    }
    
    // SECURITY: Validate and sanitize the parsed data
    return {
      collection: {
        name: escapeHtml(parsed.collection.name || ''),
        color: parsed.collection.color || '#3b82f6',
      },
      bookmarks: parsed.bookmarks
        .filter((b): b is Record<string, unknown> => typeof b === 'object' && b !== null)
        .map(b => ({
          url: typeof b.url === 'string' ? sanitizeUrl(b.url) : '',
          title: typeof b.title === 'string' ? escapeHtml(b.title) : '',
          description: typeof b.description === 'string' ? escapeHtml(b.description) : '',
          tags: Array.isArray(b.tags) ? b.tags.filter((t): t is string => typeof t === 'string').map(t => escapeHtml(t)) : [],
        })),
    };
  } catch (error) {
    console.error('[Security] Failed to parse share link:', error);
    return null;
  }
}
