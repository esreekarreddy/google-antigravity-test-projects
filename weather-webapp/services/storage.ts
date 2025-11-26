import { FavoriteCity } from '../types';

const KEYS = {
  FAVORITES: 'aether_weather_favorites',
  LAST_LOC: 'aether_weather_last_loc',
  UNITS: 'aether_weather_units',
};

export const storageService = {
  getFavorites: (): FavoriteCity[] => {
    try {
      const stored = localStorage.getItem(KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
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
