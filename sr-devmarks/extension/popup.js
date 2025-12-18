// DevMarks Chrome Extension - Popup Script with Auto-Sync

const STORAGE_KEY = 'devmarks-bookmarks';
const WEBAPP_URLS = ['http://localhost:3000', 'https://devmarks.sreekarreddy.com'];

// Elements
const formView = document.getElementById('form-view');
const successView = document.getElementById('success-view');
const urlInput = document.getElementById('url');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const tagsContainer = document.getElementById('tags-container');
const tagInput = document.getElementById('tag-input');
const saveBtn = document.getElementById('save-btn');

let tags = [];
let currentTabId = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab) {
    currentTabId = tab.id;
    urlInput.value = tab.url || '';
    titleInput.value = tab.title || '';
    
    // Auto-suggest tags based on URL
    suggestTags(tab.url);
  }
});

// Tag suggestions based on URL
function suggestTags(url) {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('github.com')) addTag('github');
  if (lowerUrl.includes('stackoverflow.com')) addTag('stackoverflow');
  if (lowerUrl.includes('dev.to')) addTag('dev.to');
  if (lowerUrl.includes('medium.com')) addTag('article');
  if (lowerUrl.includes('youtube.com')) addTag('video');
  if (lowerUrl.includes('docs.')) addTag('docs');
  if (lowerUrl.includes('npmjs.com')) addTag('npm');
  if (lowerUrl.includes('react')) addTag('react');
  if (lowerUrl.includes('typescript')) addTag('typescript');
  if (lowerUrl.includes('nextjs') || lowerUrl.includes('next.js')) addTag('nextjs');
  if (lowerUrl.includes('tailwind')) addTag('tailwind');
}

// Add tag
function addTag(tag) {
  const trimmed = tag.trim().toLowerCase();
  if (trimmed && !tags.includes(trimmed)) {
    tags.push(trimmed);
    renderTags();
  }
}

// Remove tag
function removeTag(tag) {
  tags = tags.filter(t => t !== tag);
  renderTags();
}

// Render tags
function renderTags() {
  const existingTags = tagsContainer.querySelectorAll('.tag');
  existingTags.forEach(el => el.remove());
  
  tags.forEach(tag => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.innerHTML = `${tag} <span class="tag-remove" data-tag="${tag}">×</span>`;
    tagsContainer.insertBefore(tagEl, tagInput);
  });
}

// Tag input handling
tagInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addTag(tagInput.value);
    tagInput.value = '';
  }
  if (e.key === 'Backspace' && !tagInput.value && tags.length > 0) {
    removeTag(tags[tags.length - 1]);
  }
});

// Tag removal
tagsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('tag-remove')) {
    removeTag(e.target.dataset.tag);
  }
});

// Generate unique ID
function generateId() {
  return `bm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Get favicon URL
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

// Try to sync directly to webapp via content script
async function syncToWebapp(bookmark) {
  // Check if any webapp tab is open
  for (const webappUrl of WEBAPP_URLS) {
    try {
      const tabs = await chrome.tabs.query({ url: webappUrl + '/*' });
      if (tabs.length > 0) {
        // Send message to content script
        await chrome.tabs.sendMessage(tabs[0].id, {
          type: 'SYNC_BOOKMARK',
          bookmark
        });
        return true;
      }
    } catch (error) {
      console.log('Tab sync failed:', error);
    }
  }
  return false;
}

// Save bookmark
saveBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  const title = titleInput.value.trim() || url;
  const description = descriptionInput.value.trim();
  
  if (!url) return;
  
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';
  
  // Create bookmark object (same format as webapp)
  const bookmark = {
    id: generateId(),
    url,
    title,
    description,
    tags: [...tags],
    favicon: getFaviconUrl(url),
    isFavorite: false,
    createdAt: Date.now(),
    visitCount: 0,
    isRead: false,
    collectionId: null,
    sortOrder: 0,
    linkStatus: 'unknown',
  };
  
  // Try direct sync to webapp first
  const synced = await syncToWebapp(bookmark);
  
  if (!synced) {
    // Store in pending queue for sync when webapp opens
    const result = await chrome.storage.local.get(['pendingBookmarks']);
    const pending = result.pendingBookmarks || [];
    pending.push(bookmark);
    await chrome.storage.local.set({ pendingBookmarks: pending });
  }
  
  // Also store in extension storage for backup
  const storageResult = await chrome.storage.local.get([STORAGE_KEY]);
  const bookmarks = storageResult[STORAGE_KEY] || [];
  bookmarks.unshift(bookmark);
  await chrome.storage.local.set({ [STORAGE_KEY]: bookmarks });
  
  // Show success
  formView.classList.add('hidden');
  successView.classList.remove('hidden');
  
  // Update success message
  const successSub = document.querySelector('.success-sub');
  if (synced) {
    successSub.textContent = 'Synced to DevMarks ✓';
  } else {
    successSub.textContent = 'Saved! Opens DevMarks to sync.';
  }
});
