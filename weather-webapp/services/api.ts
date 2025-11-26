import { WeatherData } from '../types';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchGeocoding = async (query: string) => {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
  if (!res.ok) throw new Error("Failed to fetch locations");
  const data = await res.json();
  return data.results || [];
};

export const fetchWeather = async (lat: number, lon: number, name: string): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure',
    hourly: 'temperature_2m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7'
  });

  const res = await fetch(`${WEATHER_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();

  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  return {
    location: {
      name,
      lat,
      lon,
      timezone: data.timezone,
    },
    current: {
      temp: current.temperature_2m,
      condition: 'Unknown', // mapped later via helpers
      weatherCode: current.weather_code,
      high: daily.temperature_2m_max[0],
      low: daily.temperature_2m_min[0],
      feelsLike: current.apparent_temperature,
      isDay: current.is_day === 1,
      windSpeed: current.wind_speed_10m,
      windDir: current.wind_direction_10m,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      uvIndex: daily.uv_index_max[0],
      visibility: 10000, // API doesn't always provide, stubbing for UI
    },
    hourly: hourly.time.slice(0, 24).map((t: string, i: number) => ({
      time: t,
      temp: hourly.temperature_2m[i],
      weatherCode: hourly.weather_code[i],
      isDay: hourly.is_day[i] === 1,
    })),
    daily: daily.time.map((t: string, i: number) => ({
      date: t,
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      weatherCode: daily.weather_code[i],
      rainProb: daily.precipitation_probability_max[i],
    })),
  };
};
