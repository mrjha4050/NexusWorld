'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import WeatherCard from '@/components/weather/WeatherCard';
import WeatherDetails from '@/components/weather/WeatherDetails';
import { WeatherState } from '@/types';

export default function WeatherPage() {
  const dispatch = useDispatch<AppDispatch>();
  const weatherState = useSelector((state: RootState) => state.weather) as WeatherState;
  const [selectedCity, setSelectedCity] = useState<string>('New York');

  useEffect(() => {
    dispatch(fetchWeatherData('New York'));
    dispatch(fetchWeatherData('London'));
    dispatch(fetchWeatherData('Tokyo'));

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
<main role="main">
      
      <div className="flex space-x-4">
        {['New York', 'London', 'Tokyo'].map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-lg ${
              selectedCity === city
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

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

      {weatherState.data[selectedCity] && (
        <WeatherDetails data={weatherState.data[selectedCity]} />
      )}
    </div>
  );
} 