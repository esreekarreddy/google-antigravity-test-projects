import { FavoriteCity } from '../types';

const KEYS = {
  FAVORITES: 'aether_weather_favorites',
  LAST_LOC: 'aether_weather_last_loc',
  UNITS: 'aether_weather_units',
};

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

// Validate FavoriteCity structure
function isValidFavoriteCity(item: unknown): item is FavoriteCity {
  if (!item || typeof item !== 'object') return false;
  const c = item as Record<string, unknown>;
  return (
    typeof c.name === 'string' &&
    typeof c.lat === 'number' && c.lat >= -90 && c.lat <= 90 &&
    typeof c.lon === 'number' && c.lon >= -180 && c.lon <= 180
  );
}

// Escape HTML for XSS prevention
function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c] || c);
}

// ============ STORAGE SERVICE ============

export const storageService = {
  getFavorites: (): FavoriteCity[] => {
    try {
      const stored = localStorage.getItem(KEYS.FAVORITES);
      if (!stored) return [];
      
      // SECURITY: Use safe JSON parse
      const parsed = safeJsonParse<unknown[]>(stored);
      if (!parsed || !Array.isArray(parsed)) {
        return [];
      }
      
      // SECURITY: Validate each city
      return parsed
        .filter(isValidFavoriteCity)
        .map(c => ({
          ...c,
          name: escapeHtml(c.name),
        }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  addFavorite: (city: FavoriteCity) => {
    try {
      const favs = storageService.getFavorites();
      if (!favs.find((f) => f.lat === city.lat && f.lon === city.lon)) {
        favs.push(city);
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
      }
    } catch (e) {
      console.error(e);
    }
  },

  removeFavorite: (lat: number, lon: number) => {
    try {
      let favs = storageService.getFavorites();
      favs = favs.filter((f) => f.lat !== lat || f.lon !== lon);
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
    } catch (e) {
      console.error(e);
    }
  },

  getLastLocation: (): { name: string; lat: number; lon: number } | null => {
    try {
      const stored = localStorage.getItem(KEYS.LAST_LOC);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setLastLocation: (loc: { name: string; lat: number; lon: number }) => {
    try {
      localStorage.setItem(KEYS.LAST_LOC, JSON.stringify(loc));
    } catch (e) {
      console.error(e);
    }
  },
};
