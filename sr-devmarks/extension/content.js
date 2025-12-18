// DevMarks Content Script - Syncs extension storage with webapp localStorage
// This runs on the DevMarks webapp and keeps localStorage in sync with chrome.storage

const STORAGE_KEY = 'devmarks-bookmarks';
const COLLECTIONS_KEY = 'devmarks-collections';

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SYNC_BOOKMARK') {
    syncBookmarkToLocalStorage(message.bookmark);
    sendResponse({ success: true });
  }
  if (message.type === 'GET_BOOKMARKS') {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    sendResponse({ bookmarks });
  }
  return true; // Keep channel open for async response
});

// Sync a new bookmark to localStorage
function syncBookmarkToLocalStorage(bookmark) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Check for duplicate
    const normalizedUrl = bookmark.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase();
    const isDuplicate = existing.some(b => {
      const bNormalized = b.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase();
      return bNormalized === normalizedUrl;
    });
    
    if (!isDuplicate) {
      // Shift sort orders and add new bookmark
      const updated = existing.map(b => ({ ...b, sortOrder: (b.sortOrder || 0) + 1 }));
      updated.unshift(bookmark);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Dispatch storage event to notify React app
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(updated),
      }));
      
      console.log('[DevMarks] Bookmark synced:', bookmark.title);
    }
  } catch (error) {
    console.error('[DevMarks] Sync error:', error);
  }
}

// On page load, sync any pending bookmarks from chrome.storage
async function syncPendingBookmarks() {
  try {
    const result = await chrome.storage.local.get(['pendingBookmarks']);
    const pending = result.pendingBookmarks || [];
    
    if (pending.length > 0) {
      pending.forEach(bookmark => syncBookmarkToLocalStorage(bookmark));
      // Clear pending after sync
      await chrome.storage.local.set({ pendingBookmarks: [] });
      console.log('[DevMarks] Synced', pending.length, 'pending bookmarks');
    }
  } catch (error) {
    console.error('[DevMarks] Pending sync error:', error);
  }
}

// Run initial sync when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncPendingBookmarks);
} else {
  syncPendingBookmarks();
}
