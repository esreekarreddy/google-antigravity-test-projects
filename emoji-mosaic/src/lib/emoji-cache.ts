/**
 * Emoji Color Cache System
 * Pre-computes and caches emoji colors for fast lookup during mosaic generation
 */

import { type OKLCHColor, getEmojiColor } from './color-utils';
import { EMOJI_SETS, type EmojiSetKey } from './emoji-data';

export interface EmojiColorData {
  char: string;
  oklch: OKLCHColor;
  rgb: [number, number, number]; // For debugging/display
}

/**
 * Cache key for localStorage
 */
const CACHE_KEY_PREFIX = 'emoji-color-cache-v1';
const CACHE_VERSION = 1;

/**
 * Emoji Color Cache
 * Manages pre-computed emoji colors with persistent storage
 */
export class EmojiColorCache {
  private cache: Map<string, EmojiColorData> = new Map();
  private cacheKey: string;
  private setKey: EmojiSetKey;

  constructor(setKey: EmojiSetKey) {
    this.setKey = setKey;
    this.cacheKey = `${CACHE_KEY_PREFIX}-${setKey}`;
  }

  /**
   * Initialize the cache - loads from localStorage or computes fresh
   */
  async initialize(): Promise<void> {
    // Try to load from localStorage first
    const loaded = this.loadFromStorage();
    
    if (loaded) {
      console.log(`Loaded ${this.cache.size} emoji colors from cache for ${this.setKey}`);
      return;
    }

    // If not cached, compute fresh
    console.log(`Computing emoji colors for ${this.setKey}...`);
    await this.computeColors();
    this.saveToStorage();
  }

  /**
   * Compute colors for all emojis in the set
   */
  private async computeColors(): Promise<void> {
    const emojis = EMOJI_SETS[this.setKey];
    
    for (const emoji of emojis) {
      const oklch = getEmojiColor(emoji, 32);
      
      // Approximate RGB for debugging (not accurate, just for reference)
      // In a real implementation, you'd do proper OKLCH -> RGB conversion
      const rgb: [number, number, number] = [
        Math.round(oklch[0] * 255),
        Math.round(oklch[1] * 255),
        Math.round(oklch[2] / 360 * 255)
      ];

      this.cache.set(emoji, {
        char: emoji,
        oklch,
        rgb
      });
    }
  }

  /**
   * Get color data for a specific emoji
   */
  get(emoji: string): EmojiColorData | undefined {
    return this.cache.get(emoji);
  }

  /**
   * Get all cached emoji color data
   */
  getAll(): EmojiColorData[] {
    return Array.from(this.cache.values());
  }

  /**
   * Load cache from localStorage with security validation
   */
  private loadFromStorage(): boolean {
    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (!stored) return false;

      // SECURITY: Safe JSON parse with basic validation
      let data;
      try {
        data = JSON.parse(stored);
      } catch {
        console.error('[Security] Invalid JSON in emoji cache');
        return false;
      }

      // SECURITY: Check for prototype pollution patterns
      if (data === null || typeof data !== 'object') return false;
      if ('__proto__' in data || 'constructor' in data || 'prototype' in data) {
        console.error('[Security] Blocked prototype pollution attempt in emoji cache');
        return false;
      }

      if (data.version !== CACHE_VERSION) {
        console.log('Cache version mismatch, will recompute');
        return false;
      }

      // SECURITY: Validate colors array
      if (!Array.isArray(data.colors)) return false;

      // Restore Map from stored array with validation
      for (const item of data.colors) {
        // Validate item structure
        if (!item || typeof item !== 'object') continue;
        if (typeof item.char !== 'string') continue;
        if (!Array.isArray(item.oklch) || item.oklch.length !== 3) continue;
        if (!item.oklch.every((n: unknown) => typeof n === 'number' && isFinite(n as number))) continue;
        
        this.cache.set(item.char, item);
      }

      return this.cache.size > 0;
    } catch (error) {
      console.error('Failed to load emoji color cache:', error);
      return false;
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        version: CACHE_VERSION,
        setKey: this.setKey,
        colors: Array.from(this.cache.values()),
        timestamp: Date.now()
      };

      localStorage.setItem(this.cacheKey, JSON.stringify(data));
      console.log(`Saved ${this.cache.size} emoji colors to cache`);
    } catch (error) {
      console.error('Failed to save emoji color cache:', error);
    }
  }

  /**
   * Clear the cache (both memory and storage)
   */
  clear(): void {
    this.cache.clear();
    try {
      localStorage.removeItem(this.cacheKey);
    } catch (error) {
      console.error('Failed to clear cache from storage:', error);
    }
  }
}

/**
 * Global cache manager for all emoji sets
 */
class EmojiCacheManager {
  private caches: Map<EmojiSetKey, EmojiColorCache> = new Map();

  /**
   * Get or create cache for a specific emoji set
   */
  async getCache(setKey: EmojiSetKey): Promise<EmojiColorCache> {
    let cache = this.caches.get(setKey);
    
    if (!cache) {
      cache = new EmojiColorCache(setKey);
      await cache.initialize();
      this.caches.set(setKey, cache);
    }

    return cache;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
    this.caches.clear();
  }
}

// Singleton instance
export const emojiCacheManager = new EmojiCacheManager();
