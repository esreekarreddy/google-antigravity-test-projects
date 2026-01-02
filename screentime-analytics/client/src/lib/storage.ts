import { StorageData } from './mockData';

const STORAGE_KEY = 'screentime-analytics-data';
const VERSION_KEY = 'screentime-analytics-version';
const BACKUP_KEY = 'screentime-analytics-backup';
const CURRENT_VERSION = '2.0.0';

// ============ SECURITY UTILITIES ============

// Prototype pollution protection
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

// Safe JSON parse
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

// Backup current data
function backupStorage(): void {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      localStorage.setItem(BACKUP_KEY, current);
    }
  } catch (e) {
    console.error('Backup failed:', e);
  }
}

// ============ STORAGE SERVICE ============

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
      // SECURITY: Use safe JSON parse
      const parsed = safeJsonParse<StorageData>(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
    return {};
  },

  async setData(data: StorageData): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  },

  async importData(jsonString: string): Promise<boolean> {
    try {
      // SECURITY: Limit import size
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (jsonString.length > MAX_SIZE) {
        console.error('[Security] Import data too large');
        return false;
      }
      
      // SECURITY: Use safe JSON parse with prototype pollution protection
      const data = safeJsonParse<unknown>(jsonString);
      if (!data || typeof data !== 'object') {
        console.error('[Security] Invalid import data');
        return false;
      }
      
      // SECURITY: Backup before import
      backupStorage();
      
      await this.setData(data as StorageData);
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
