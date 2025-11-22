import { StorageData } from './mockData';

const STORAGE_KEY = 'screentime-analytics-data';
const VERSION_KEY = 'screentime-analytics-version';
const CURRENT_VERSION = '2.0.0';

export const storage = {
  async clearOldData(): Promise<void> {
    // Clear old version data on first load
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  },

  async getData(): Promise<StorageData> {
    // Clear old mock data if exists
    await this.clearOldData();
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {};
  },

  async setData(data: StorageData): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  },

  async importData(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data !== 'object') return false;
      await this.setData(data);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  async clearAllData(): Promise<void> {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
    
    // Try to mess age extension to clear chrome.storage.local
    try {
      // Check if we can access chrome extension API
      if (window.chrome && (window.chrome as any).runtime) {
        // Send message to background script to clear storage
        (window.chrome as any).runtime.sendMessage({
          action: 'clearAllData'
        });
      }
    } catch (e) {
      console.log('Could not communicate with extension:', e);
    }
  }
};
