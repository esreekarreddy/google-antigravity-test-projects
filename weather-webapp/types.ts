export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    weatherCode: number;
    high: number;
    low: number;
    feelsLike: number;
    isDay: boolean;
    windSpeed: number;
    windDir: number;
    humidity: number;
    pressure: number;
    uvIndex: number;
    visibility: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: {
    name: string;
    lat: number;
    lon: number;
    timezone: string;
  };
}

export interface HourlyForecast {
  time: string; // ISO string
  temp: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  rainProb: number;
}

export interface FavoriteCity {
  name: string;
  lat: number;
  lon: number;
  lastUsed: number;
}

export enum WeatherState {
  Sunny = 'Sunny',
  ClearNight = 'ClearNight',
  Cloudy = 'Cloudy',
  Rain = 'Rain',
  Storm = 'Storm',
  Snow = 'Snow',
}
