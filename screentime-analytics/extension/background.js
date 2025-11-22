import { getTodayKey, getDomainFromUrl } from './utils.js';

// State variables
let activeTabId = null;
let activeTabStartTime = null;
let activeDomain = null;

// Initialize
chrome.runtime.onInstalled.addListener(() => {
  console.log("ScreenTime Analytics Extension Installed");
});

// Helper to get dashboard URL
function getDashboardUrl() {
  // Check if running locally or on Replit
  if (chrome.runtime.getURL('').includes('chrome-extension')) {
    // This is a local extension, need to connect to the dashboard somehow
    // For now, we'll rely on content script or other methods
    return null;
  }
  return null;
}

// Helper to sync data to localStorage via content script
async function syncToLocalStorage(dailyData) {
  try {
    // Get all tabs to find one that can access localStorage
    const tabs = await chrome.tabs.query({});
    
    for (const tab of tabs) {
      // Try to find a tab with the dashboard
      if (tab.url && (tab.url.includes('localhost') || tab.url.includes('replit.dev') || tab.url.includes('127.0.0.1'))) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'syncData',
            data: dailyData,
            date: getTodayKey()
          });
          console.log("Data synced to dashboard via content script");
          return;
        } catch (e) {
          // Content script not loaded on this tab
        }
      }
    }
    
    // If no dashboard tab found, we'll sync via other means if needed
  } catch (e) {
    console.error("Error syncing to localStorage:", e);
  }
}

// Helper to save data
async function updateTime(tabId) {
  if (!activeDomain || !activeTabStartTime) return;

  const now = Date.now();
  const duration = (now - activeTabStartTime) / 1000; // seconds
  activeTabStartTime = now;

  if (duration < 1) return; // Ignore tiny intervals

  const today = getTodayKey();
  const data = await chrome.storage.local.get(today);
  
  let dailyData = data[today] || {};
  if (!dailyData[activeDomain]) {
    dailyData[activeDomain] = { visits: 0, activeTime: 0 };
  }

  dailyData[activeDomain].activeTime += duration;

  await chrome.storage.local.set({ [today]: dailyData });
  await syncToLocalStorage(dailyData);
}

// Handle Tab Activation (Switching tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Save time for previous tab
  if (activeTabId) {
    await updateTime(activeTabId);
  }

  // Set new active tab
  activeTabId = activeInfo.tabId;
  activeTabStartTime = Date.now();

  try {
    const tab = await chrome.tabs.get(activeTabId);
    if (tab.url) {
      activeDomain = getDomainFromUrl(tab.url);
      // Increment visit count
      const today = getTodayKey();
      const data = await chrome.storage.local.get(today);
      let dailyData = data[today] || {};
      
      if (!dailyData[activeDomain]) {
        dailyData[activeDomain] = { visits: 0, activeTime: 0 };
      }
      dailyData[activeDomain].visits += 1;
      await chrome.storage.local.set({ [today]: dailyData });
      await syncToLocalStorage(dailyData);
    }
  } catch (e) {
    console.error("Error accessing tab:", e);
  }
});

// Handle URL Updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    await updateTime(tabId);
    activeDomain = getDomainFromUrl(changeInfo.url);
    activeTabStartTime = Date.now();
  }
});

// Handle Window Focus Changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    await updateTime(activeTabId);
    activeTabId = null;
    activeDomain = null;
  } else {
    // Window gained focus
    const tabs = await chrome.tabs.query({active: true, windowId: windowId});
    if (tabs.length > 0) {
      activeTabId = tabs[0].id;
      activeDomain = getDomainFromUrl(tabs[0].url);
      activeTabStartTime = Date.now();
    }
  }
});

// Alarm to save periodically (every 1 min)
chrome.alarms.create("saveTime", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "saveTime" && activeTabId) {
    updateTime(activeTabId);
  }
});
