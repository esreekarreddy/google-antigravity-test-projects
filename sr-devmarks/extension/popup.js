// DevMarks Chrome Extension - Popup Script v2
// Comprehensive rewrite for proper tag handling and localStorage sync

const STORAGE_KEY = 'devmarks-bookmarks';
const COLLECTIONS_KEY = 'devmarks-collections';
const WEBAPP_URLS = ['http://localhost:3000', 'https://devmarks.sreekarreddy.com'];

// Elements
const formView = document.getElementById('form-view');
const successView = document.getElementById('success-view');
const urlInput = document.getElementById('url');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const tagSelect = document.getElementById('tag-select');
const addTagBtn = document.getElementById('add-tag-btn');
const selectedTagsContainer = document.getElementById('selected-tags');
const collectionSelect = document.getElementById('collection-select');
const addCollectionBtn = document.getElementById('add-collection-btn');
const favoriteToggle = document.getElementById('favorite-toggle');
const saveBtn = document.getElementById('save-btn');

let selectedTags = [];
let isFavorite = false;
let collections = [];
let allTags = [];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[DevMarks] Popup initializing...');
  
  try {
    // Load data
    await loadCollections();
    await loadAllTags();
    
    // Get current tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('[DevMarks] Current tab:', tab?.url);
    
    if (tab && tab.url) {
      urlInput.value = tab.url;
      titleInput.value = tab.title || '';
      
      // Auto-suggest tags based on URL
      suggestTagsFromUrl(tab.url);
    }
  } catch (error) {
    console.error('[DevMarks] Init error:', error);
  }
});

// ========== LOAD DATA ==========
async function loadCollections() {
  // First, try to get from webapp localStorage
  let webappCollections = [];
  for (const webappUrl of WEBAPP_URLS) {
    try {
      const tabs = await chrome.tabs.query({ url: webappUrl + '/*' });
      if (tabs.length > 0) {
        const response = await chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_COLLECTIONS' });
        if (response && response.collections) {
          webappCollections = response.collections;
          console.log('[DevMarks] Got collections from webapp:', webappCollections.length);
          // Save to extension storage for future
          await chrome.storage.local.set({ [COLLECTIONS_KEY]: webappCollections });
          break;
        }
      }
    } catch (e) {
      console.log('[DevMarks] Could not get collections from webapp:', e);
    }
  }
  
  // If no webapp data, use extension storage
  if (webappCollections.length === 0) {
    const result = await chrome.storage.local.get([COLLECTIONS_KEY]);
    collections = result[COLLECTIONS_KEY] || [];
  } else {
    collections = webappCollections;
  }
  
  renderCollectionsDropdown();
}

async function loadAllTags() {
  // First, try to get bookmarks from webapp localStorage
  let bookmarks = [];
  for (const webappUrl of WEBAPP_URLS) {
    try {
      const tabs = await chrome.tabs.query({ url: webappUrl + '/*' });
      if (tabs.length > 0) {
        const response = await chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_BOOKMARKS' });
        if (response && response.bookmarks) {
          bookmarks = response.bookmarks;
          console.log('[DevMarks] Got bookmarks from webapp:', bookmarks.length);
          // Save to extension storage
          await chrome.storage.local.set({ [STORAGE_KEY]: bookmarks });
          break;
        }
      }
    } catch (e) {
      console.log('[DevMarks] Could not get bookmarks from webapp:', e);
    }
  }
  
  // If no webapp data, use extension storage
  if (bookmarks.length === 0) {
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    bookmarks = result[STORAGE_KEY] || [];
  }
  
  // Extract unique tags
  const tagSet = new Set();
  bookmarks.forEach(bm => {
    if (bm.tags && Array.isArray(bm.tags)) {
      bm.tags.forEach(t => tagSet.add(t.toLowerCase()));
    }
  });
  
  allTags = Array.from(tagSet).sort();
  renderTagsDropdown();
}

// ========== RENDER DROPDOWNS ==========
function renderCollectionsDropdown() {
  collectionSelect.innerHTML = '<option value="">No collection</option>';
  collections.forEach(col => {
    const opt = document.createElement('option');
    opt.value = col.id;
    opt.textContent = col.name;
    collectionSelect.appendChild(opt);
  });
}

function renderTagsDropdown() {
  tagSelect.innerHTML = '<option value="">Select existing tag...</option>';
  allTags.forEach(tag => {
    if (!selectedTags.includes(tag)) {
      const opt = document.createElement('option');
      opt.value = tag;
      opt.textContent = tag;
      tagSelect.appendChild(opt);
    }
  });
}

function renderSelectedTags() {
  selectedTagsContainer.innerHTML = '';
  selectedTags.forEach(tag => {
    const chip = document.createElement('span');
    chip.style.cssText = 'display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; background: #e8f5e9; color: #2e7d32; border-radius: 4px; font-size: 11px;';
    
    // SECURITY: Use textContent instead of innerHTML to prevent XSS
    const tagText = document.createTextNode(escapeHtml(tag) + ' ');
    chip.appendChild(tagText);
    
    const removeBtn = document.createElement('span');
    removeBtn.style.cssText = 'cursor: pointer; opacity: 0.7;';
    removeBtn.textContent = '×';
    removeBtn.dataset.tag = tag;
    chip.appendChild(removeBtn);
    
    selectedTagsContainer.appendChild(chip);
  });
  
  // Update dropdown to hide selected tags
  renderTagsDropdown();
}

// SECURITY: Escape HTML to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c] || c);
}

// ========== EVENT HANDLERS ==========

// Tag selection from dropdown
tagSelect.addEventListener('change', () => {
  const tag = tagSelect.value;
  if (tag && !selectedTags.includes(tag)) {
    selectedTags.push(tag);
    renderSelectedTags();
    tagSelect.value = '';
  }
});

// Remove tag on click
selectedTagsContainer.addEventListener('click', (e) => {
  if (e.target.dataset.tag) {
    selectedTags = selectedTags.filter(t => t !== e.target.dataset.tag);
    renderSelectedTags();
  }
});

// Add new tag
addTagBtn.addEventListener('click', () => {
  const name = prompt('Enter new tag name:');
  if (name && name.trim()) {
    const tag = name.trim().toLowerCase();
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
      if (!allTags.includes(tag)) {
        allTags.push(tag);
        allTags.sort();
      }
      renderSelectedTags();
    }
  }
});

// Collection selection
addCollectionBtn.addEventListener('click', async () => {
  const name = prompt('Enter collection name:');
  if (name && name.trim()) {
    const newCollection = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      color: getRandomColor()
    };
    collections.push(newCollection);
    await chrome.storage.local.set({ [COLLECTIONS_KEY]: collections });
    
    // Try to sync collection to webapp
    try {
      await syncCollectionToWebapp(newCollection);
    } catch (e) {
      console.log('[DevMarks] Collection webapp sync failed:', e);
    }
    
    renderCollectionsDropdown();
    collectionSelect.value = newCollection.id;
  }
});

// Favorite toggle
favoriteToggle.addEventListener('click', () => {
  isFavorite = !isFavorite;
  favoriteToggle.classList.toggle('active', isFavorite);
});

// ========== SAVE BOOKMARK ==========
saveBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  const title = titleInput.value.trim() || url;
  const description = descriptionInput.value.trim();
  
  if (!url) {
    alert('URL is required');
    return;
  }
  
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';
  
  const bookmark = {
    id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    url,
    title,
    description,
    tags: [...selectedTags],
    favicon: getFaviconUrl(url),
    isFavorite: isFavorite,
    createdAt: Date.now(),
    visitCount: 0,
    isRead: false,
    collectionId: collectionSelect.value || null,
    sortOrder: 0,
    linkStatus: 'unknown',
  };
  
  console.log('[DevMarks] Saving bookmark:', bookmark);
  
  // Save to extension storage
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  const bookmarks = result[STORAGE_KEY] || [];
  bookmarks.unshift(bookmark);
  await chrome.storage.local.set({ [STORAGE_KEY]: bookmarks });
  console.log('[DevMarks] Saved to extension storage');
  
  // Try to sync to webapp localStorage
  let synced = false;
  try {
    synced = await syncToWebapp(bookmark);
  } catch (e) {
    console.log('[DevMarks] Webapp sync failed:', e);
  }
  
  if (!synced) {
    // Add to pending queue
    const pendingResult = await chrome.storage.local.get(['pendingBookmarks']);
    const pending = pendingResult.pendingBookmarks || [];
    pending.push(bookmark);
    await chrome.storage.local.set({ pendingBookmarks: pending });
    console.log('[DevMarks] Added to pending queue');
  }
  
  // Show success
  formView.classList.add('hidden');
  successView.classList.remove('hidden');
  
  const successSub = document.querySelector('.success-sub');
  if (synced) {
    successSub.textContent = 'Synced to DevMarks ✓';
  } else {
    successSub.textContent = 'Saved! Open DevMarks to sync.';
  }
});

// ========== HELPERS ==========
function suggestTagsFromUrl(url) {
  const lowerUrl = url.toLowerCase();
  
  const suggestions = [];
  if (lowerUrl.includes('github.com')) suggestions.push('github');
  if (lowerUrl.includes('stackoverflow.com')) suggestions.push('stackoverflow');
  if (lowerUrl.includes('dev.to')) suggestions.push('dev.to');
  if (lowerUrl.includes('medium.com')) suggestions.push('article');
  if (lowerUrl.includes('youtube.com')) suggestions.push('video');
  if (lowerUrl.includes('docs.')) suggestions.push('docs');
  if (lowerUrl.includes('npmjs.com')) suggestions.push('npm');
  if (lowerUrl.includes('react')) suggestions.push('react');
  if (lowerUrl.includes('typescript')) suggestions.push('typescript');
  if (lowerUrl.includes('nextjs') || lowerUrl.includes('next.js')) suggestions.push('nextjs');
  
  suggestions.forEach(tag => {
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  });
  
  renderSelectedTags();
}

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

function getRandomColor() {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function syncToWebapp(bookmark) {
  for (const webappUrl of WEBAPP_URLS) {
    try {
      const tabs = await chrome.tabs.query({ url: webappUrl + '/*' });
      if (tabs.length > 0) {
        await chrome.tabs.sendMessage(tabs[0].id, {
          type: 'SYNC_BOOKMARK',
          bookmark
        });
        console.log('[DevMarks] Synced to webapp tab');
        return true;
      }
    } catch (error) {
      console.log('[DevMarks] Sync to tab failed:', error);
    }
  }
  return false;
}

async function syncCollectionToWebapp(collection) {
  for (const webappUrl of WEBAPP_URLS) {
    try {
      const tabs = await chrome.tabs.query({ url: webappUrl + '/*' });
      if (tabs.length > 0) {
        await chrome.tabs.sendMessage(tabs[0].id, {
          type: 'SYNC_COLLECTION',
          collection
        });
        console.log('[DevMarks] Collection synced to webapp');
        return true;
      }
    } catch (error) {
      console.log('[DevMarks] Collection sync failed:', error);
    }
  }
  return false;
}
