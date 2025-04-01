'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import WeatherCard from '@/components/weather/WeatherCard';
import { WeatherState } from '@/types';

export default function WeatherPage() {
  const dispatch = useDispatch<AppDispatch>();
  const weatherState = useSelector((state: RootState) => state.weather) as WeatherState;

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchWeatherData('New York'));
    dispatch(fetchWeatherData('London'));
    dispatch(fetchWeatherData('Tokyo'));

    // Set up polling for weather data
    const weatherInterval = setInterval(() => {
      dispatch(fetchWeatherData('New York'));
      dispatch(fetchWeatherData('London'));
      dispatch(fetchWeatherData('Tokyo'));
    }, 60000);

    return () => {
      clearInterval(weatherInterval);
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Weather Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['New York', 'London', 'Tokyo'].map((city) => (
          <WeatherCard
            key={city}
            city={city}
            data={weatherState.data[city]}
            loading={weatherState.loading}
          />
        ))}
      </div>
    </div>
  );
} 