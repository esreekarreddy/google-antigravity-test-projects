import { subDays, format } from 'date-fns';

export interface SiteData {
  visits: number;
  activeTime: number;
  lastVisit?: number;
}

export interface DailyData {
  [domain: string]: SiteData;
}

export interface StorageData {
  [date: string]: DailyData;
}
