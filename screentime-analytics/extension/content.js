// Content script to bridge extension data to dashboard localStorage
// This runs on dashboard pages and receives data from the background script

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'syncData') {
    try {
      const storageKey = 'screentime-analytics-data';
      const versionKey = 'screentime-analytics-version';
      
      // Get existing data
      let allData = {};
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        allData = JSON.parse(stored);
      }
      
      // Merge new data for today
      allData[request.date] = request.data;
      
      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(allData));
      localStorage.setItem(versionKey, '2.0.0');
      
      console.log('Data synced to dashboard');
      sendResponse({ success: true });
    } catch (e) {
      console.error('Error syncing data:', e);
      sendResponse({ success: false, error: e.message });
    }
  }
});
