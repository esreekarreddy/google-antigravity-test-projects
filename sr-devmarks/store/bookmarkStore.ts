import { create } from 'zustand';
import { 
  Bookmark, 
  Collection,
  loadBookmarks, 
  saveBookmarks,
  loadCollections,
  saveCollections,
  generateId, 
  getFaviconUrl,
  calculateStats,
  normalizeUrl,
} from '@/lib/storage';

interface BookmarkState {
  // State
  bookmarks: Bookmark[];
  collections: Collection[];
  searchQuery: string;
  selectedTag: string | null;
  selectedCollection: string | null;
  isLoading: boolean;
  
  // Actions
  init: () => void;
  
  // Bookmark CRUD
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'visitCount' | 'favicon' | 'isRead' | 'sortOrder' | 'linkStatus'>) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleRead: (id: string) => void;
  incrementVisit: (id: string) => void;
  reorderBookmarks: (startIndex: number, endIndex: number) => void;
  updateLinkStatus: (id: string, status: 'ok' | 'broken') => void;
  
  // Duplicate detection
  checkDuplicate: (url: string) => Bookmark | null;
  
  // Collections
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt'>) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  moveToCollection: (bookmarkId: string, collectionId: string | null) => void;
  
  // Filters
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedCollection: (collectionId: string | null) => void;
  
  // Import/Export
  importBookmarks: (newBookmarks: Bookmark[], newCollections?: Collection[], merge?: boolean) => void;
  clearAll: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  // Initial state
  bookmarks: [],
  collections: [],
  searchQuery: '',
  selectedTag: null,
  selectedCollection: null,
  isLoading: true,
  
  // Actions
  init: () => {
    const bookmarks = loadBookmarks();
    const collections = loadCollections();
    set({ bookmarks, collections, isLoading: false });
  },
  
  checkDuplicate: (url: string) => {
    const normalized = normalizeUrl(url);
    return get().bookmarks.find(b => normalizeUrl(b.url) === normalized) || null;
  },
  
  addBookmark: (bookmarkData) => {
    const { bookmarks } = get();
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: generateId(),
      favicon: getFaviconUrl(bookmarkData.url),
      createdAt: Date.now(),
      visitCount: 0,
      isRead: false,
      sortOrder: 0,
      linkStatus: 'unknown',
    };
    
    // Shift existing sortOrders
    const updated = bookmarks.map(b => ({ ...b, sortOrder: b.sortOrder + 1 }));
    const newBookmarks = [newBookmark, ...updated];
    
    saveBookmarks(newBookmarks);
    set({ bookmarks: newBookmarks });
  },
  
  updateBookmark: (id, updates) => {
    const bookmarks = get().bookmarks.map(b =>
      b.id === id ? { ...b, ...updates } : b
    );
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  deleteBookmark: (id) => {
    const bookmarks = get().bookmarks.filter(b => b.id !== id);
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  toggleFavorite: (id) => {
    const bookmarks = get().bookmarks.map(b =>
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    );
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  toggleRead: (id) => {
    const bookmarks = get().bookmarks.map(b =>
      b.id === id ? { ...b, isRead: !b.isRead } : b
    );
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  incrementVisit: (id) => {
    const bookmarks = get().bookmarks.map(b =>
      b.id === id ? { ...b, visitCount: b.visitCount + 1, isRead: true } : b
    );
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  reorderBookmarks: (startIndex, endIndex) => {
    const state = get();
    const filtered = getFilteredBookmarks(state);
    const moving = filtered[startIndex];
    const target = filtered[endIndex];
    
    if (!moving || !target || moving.id === target.id) return;
    
    // Simple approach: assign new sortOrders based on desired positions
    // Create a copy of filtered array and reorder it
    const reordered = [...filtered];
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    
    // Assign new sortOrders based on position
    const newSortOrders = new Map<string, number>();
    reordered.forEach((b, idx) => {
      newSortOrders.set(b.id, idx);
    });
    
    // Update all bookmarks with new sort orders
    const bookmarks = state.bookmarks.map(b => {
      const newOrder = newSortOrders.get(b.id);
      if (newOrder !== undefined) {
        return { ...b, sortOrder: newOrder };
      }
      return b;
    });
    
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  updateLinkStatus: (id, status) => {
    const bookmarks = get().bookmarks.map(b =>
      b.id === id ? { ...b, linkStatus: status } : b
    );
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  // Collections
  addCollection: (collectionData) => {
    const newCollection: Collection = {
      ...collectionData,
      id: generateId(),
      createdAt: Date.now(),
    };
    const collections = [...get().collections, newCollection];
    saveCollections(collections);
    set({ collections });
    return newCollection;
  },
  
  updateCollection: (id, updates) => {
    const collections = get().collections.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    saveCollections(collections);
    set({ collections });
  },
  
  deleteCollection: (id) => {
    const collections = get().collections.filter(c => c.id !== id);
    const bookmarks = get().bookmarks.map(b =>
      b.collectionId === id ? { ...b, collectionId: null } : b
    );
    saveCollections(collections);
    saveBookmarks(bookmarks);
    set({ collections, bookmarks });
  },
  
  moveToCollection: (bookmarkId, collectionId) => {
    const bookmarks = get().bookmarks.map(b =>
      b.id === bookmarkId ? { ...b, collectionId } : b
    );
    saveBookmarks(bookmarks);
    set({ bookmarks });
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedTag: (tag) => set({ selectedTag: tag, selectedCollection: null }),
  
  setSelectedCollection: (collectionId) => set({ selectedCollection: collectionId, selectedTag: null }),
  
  importBookmarks: (newBookmarks, newCollections = [], merge = true) => {
    let bookmarks: Bookmark[];
    let collections: Collection[];
    
    if (merge) {
      const existingUrls = new Set(get().bookmarks.map(b => normalizeUrl(b.url)));
      const uniqueNew = newBookmarks.filter(b => !existingUrls.has(normalizeUrl(b.url)));
      bookmarks = [...get().bookmarks, ...uniqueNew];
      
      const existingNames = new Set(get().collections.map(c => c.name.toLowerCase()));
      const uniqueCollections = newCollections.filter(c => !existingNames.has(c.name.toLowerCase()));
      collections = [...get().collections, ...uniqueCollections];
    } else {
      bookmarks = newBookmarks;
      collections = newCollections;
    }
    
    saveBookmarks(bookmarks);
    saveCollections(collections);
    set({ bookmarks, collections });
  },
  
  clearAll: () => {
    saveBookmarks([]);
    saveCollections([]);
    set({ bookmarks: [], collections: [], selectedTag: null, selectedCollection: null, searchQuery: '' });
  },
}));

// Selector functions - computed outside the store for proper reactivity
export function getFilteredBookmarks(state: BookmarkState): Bookmark[] {
  const { bookmarks, searchQuery, selectedTag, selectedCollection } = state;
  
  let filtered = [...bookmarks];
  
  // Filter by collection
  if (selectedCollection) {
    filtered = filtered.filter(b => b.collectionId === selectedCollection);
  }
  
  // Filter by tag/special filter
  if (selectedTag) {
    if (selectedTag === '__favorites__') {
      filtered = filtered.filter(b => b.isFavorite);
    } else if (selectedTag === '__recent__') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(b => b.createdAt > weekAgo);
    } else if (selectedTag === '__unread__') {
      filtered = filtered.filter(b => !b.isRead);
    } else if (selectedTag === '__broken__') {
      filtered = filtered.filter(b => b.linkStatus === 'broken');
    } else if (selectedTag === '__with_tags__') {
      filtered = filtered.filter(b => b.tags.length > 0);
    } else {
      filtered = filtered.filter(b => b.tags.includes(selectedTag));
    }
  }
  
  // Filter by search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.url.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query) ||
      b.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  
  // Sort by sortOrder
  return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getStats(state: BookmarkState) {
  return calculateStats(state.bookmarks, state.collections);
}

export function getAllTags(state: BookmarkState): string[] {
  const tags = new Set<string>();
  state.bookmarks.forEach(b => b.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}
