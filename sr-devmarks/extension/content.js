// DevMarks Content Script v2 - Syncs extension storage with webapp localStorage
// This runs on the DevMarks webapp and keeps localStorage in sync with chrome.storage

const STORAGE_KEY = 'devmarks-bookmarks';
const COLLECTIONS_KEY = 'devmarks-collections';

console.log('[DevMarks Content] Script loaded on:', window.location.href);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[DevMarks Content] Received message:', message.type);
  
  if (message.type === 'SYNC_BOOKMARK') {
    const success = syncBookmarkToLocalStorage(message.bookmark);
    sendResponse({ success });
  }
  
  if (message.type === 'SYNC_COLLECTION') {
    const success = syncCollectionToLocalStorage(message.collection);
    sendResponse({ success });
  }
  
  if (message.type === 'SYNC_ALL_COLLECTIONS') {
    syncAllCollectionsToLocalStorage(message.collections);
    sendResponse({ success: true });
  }
  
  if (message.type === 'GET_BOOKMARKS') {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    sendResponse({ bookmarks });
  }
  
  if (message.type === 'GET_COLLECTIONS') {
    const collections = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
    sendResponse({ collections });
  }
  
  if (message.type === 'GET_ALL_DATA') {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const collections = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
    sendResponse({ bookmarks, collections });
  }
  
  return true; // Keep channel open for async response
});

// Sync a single collection to localStorage
function syncCollectionToLocalStorage(collection) {
  try {
    const existing = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
    
    // Check for duplicate
    const isDuplicate = existing.some(c => c.id === collection.id || c.name.toLowerCase() === collection.name.toLowerCase());
    
    if (!isDuplicate) {
      existing.push(collection);
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(existing));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: COLLECTIONS_KEY,
        newValue: JSON.stringify(existing),
      }));
      
      console.log('[DevMarks Content] Collection synced:', collection.name);
      return true;
    }
    return false;
  } catch (error) {
    console.error('[DevMarks Content] Collection sync error:', error);
    return false;
  }
}

// Sync all collections (replace)
function syncAllCollectionsToLocalStorage(collections) {
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    window.dispatchEvent(new StorageEvent('storage', {
      key: COLLECTIONS_KEY,
      newValue: JSON.stringify(collections),
    }));
    console.log('[DevMarks Content] All collections synced:', collections.length);
  } catch (error) {
    console.error('[DevMarks Content] Sync all collections error:', error);
  }
}

// Sync a new bookmark to localStorage
function syncBookmarkToLocalStorage(bookmark) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Check for duplicate by normalized URL
    const normalizedUrl = bookmark.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase();
    const isDuplicate = existing.some(b => {
      const bNormalized = b.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase();
      return bNormalized === normalizedUrl;
    });
    
    if (!isDuplicate) {
      // Shift sort orders and add new bookmark at top
      const updated = existing.map(b => ({ ...b, sortOrder: (b.sortOrder || 0) + 1 }));
      updated.unshift(bookmark);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Dispatch storage event to notify React app
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(updated),
      }));
      
      // Also dispatch a custom event for Zustand stores
      window.dispatchEvent(new CustomEvent('devmarks-updated', { 
        detail: { bookmarks: updated } 
      }));
      
      console.log('[DevMarks Content] Bookmark synced:', bookmark.title);
      return true;
    } else {
      console.log('[DevMarks Content] Duplicate skipped:', bookmark.url);
      return false;
    }
  } catch (error) {
    console.error('[DevMarks Content] Sync error:', error);
    return false;
  }
}

// On page load, sync any pending bookmarks from chrome.storage
async function syncPendingBookmarks() {
  try {
    const result = await chrome.storage.local.get(['pendingBookmarks']);
    const pending = result.pendingBookmarks || [];
    
    if (pending.length > 0) {
      console.log('[DevMarks Content] Syncing', pending.length, 'pending bookmarks');
      
      let syncedCount = 0;
      pending.forEach(bookmark => {
        if (syncBookmarkToLocalStorage(bookmark)) {
          syncedCount++;
        }
      });
      
      // Clear pending after sync
      await chrome.storage.local.set({ pendingBookmarks: [] });
      console.log('[DevMarks Content] Synced', syncedCount, 'bookmarks, cleared pending queue');
    }
  } catch (error) {
    console.error('[DevMarks Content] Pending sync error:', error);
  }
}

// Also sync data from webapp localStorage back to extension storage
async function syncLocalStorageToExtension() {
  try {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const collections = JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
    
    // Save to extension storage so popup can access it
    await chrome.storage.local.set({ 
      [STORAGE_KEY]: bookmarks,
      [COLLECTIONS_KEY]: collections 
    });
    
    console.log('[DevMarks Content] Synced localStorage to extension storage');
  } catch (error) {
    console.error('[DevMarks Content] Reverse sync error:', error);
  }
}

// Run initial sync when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    syncPendingBookmarks();
    syncLocalStorageToExtension();
  });
} else {
  syncPendingBookmarks();
  syncLocalStorageToExtension();
}

// Also sync when storage changes in webapp
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY || e.key === COLLECTIONS_KEY) {
    console.log('[DevMarks Content] Storage changed, syncing to extension');
    syncLocalStorageToExtension();
  }
});
