import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { WeatherData, WeatherState } from '@/types';

const initialState: WeatherState = {
  data: {},
  loading: false,
  error: null,
};


const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'New York': { lat: 40.7128, lon: -74.0060 },
  'London': { lat: 51.5074, lon: -0.1278 },
  'Tokyo': { lat: 35.6762, lon: 139.6503 },
  'Paris': { lat: 48.8566, lon: 2.3522 },
  'Dubai': { lat: 25.2048, lon: 55.2708 },
  'Singapore': { lat: 1.3521, lon: 103.8198 },
  'Sydney': { lat: -33.8688, lon: 151.2093 },
  'Hong Kong': { lat: 22.3193, lon: 114.1694 },
  'Berlin': { lat: 52.5200, lon: 13.4050 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Los Angeles': { lat: 34.0522, lon: -118.2437 },
  'San Francisco': { lat: 37.7749, lon: -122.4194 },
  'Chicago': { lat: 41.8781, lon: -87.6298 },
  'Miami': { lat: 25.7617, lon: -80.1918 },
  'San Diego': { lat: 32.7157, lon: -117.1611 },
  'San Jose': { lat: 37.3382, lon: -121.8863 },
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city: string): Promise<WeatherData> => {
    const coordinates = CITY_COORDINATES[city];
    if (!coordinates) {
      throw new Error(`Coordinates not found for city: ${city}`);
    }

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    );

    const weatherCode = response.data.current.weather_code;
    const weatherInfo = getWeatherInfo(weatherCode);

    return {
      city,
      temperature: response.data.current.temperature_2m,
      description: weatherInfo.description,
      humidity: response.data.current.relative_humidity_2m,
      windSpeed: response.data.current.wind_speed_10m,
      icon: weatherInfo.icon,
    };
  }
);

function getWeatherInfo(code: number): { description: string; icon: string } {
  const weatherCodes: Record<number, { description: string; icon: string }> = {
    0: { description: 'clear sky', icon: '01d' },
    1: { description: 'mainly clear', icon: '02d' },
    2: { description: 'partly cloudy', icon: '03d' },
    3: { description: 'overcast', icon: '04d' },
    45: { description: 'foggy', icon: '50d' },
    48: { description: 'depositing rime fog', icon: '50d' },
    51: { description: 'light drizzle', icon: '09d' },
    53: { description: 'moderate drizzle', icon: '09d' },
    55: { description: 'dense drizzle', icon: '09d' },
    61: { description: 'slight rain', icon: '10d' },
    63: { description: 'moderate rain', icon: '10d' },
    65: { description: 'heavy rain', icon: '10d' },
    71: { description: 'slight snow', icon: '13d' },
    73: { description: 'moderate snow', icon: '13d' },
    75: { description: 'heavy snow', icon: '13d' },
    77: { description: 'snow grains', icon: '13d' },
    80: { description: 'slight rain showers', icon: '09d' },
    81: { description: 'moderate rain showers', icon: '09d' },
    82: { description: 'violent rain showers', icon: '09d' },
    85: { description: 'slight snow showers', icon: '13d' },
    86: { description: 'heavy snow showers', icon: '13d' },
    95: { description: 'thunderstorm', icon: '11d' },
    96: { description: 'thunderstorm with slight hail', icon: '11d' },
    99: { description: 'thunderstorm with heavy hail', icon: '11d' },
  };

  return weatherCodes[code] || { description: 'unknown', icon: '01d' };
}

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.city] = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export const { clearError } = weatherSlice.actions;
export default weatherSlice.reducer; 