'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { fetchCryptoData, fetchCryptoNews } from '@/store/slices/cryptoSlice';
import WeatherCard from '@/components/weather/WeatherCard';
import CryptoCard from '@/components/crypto/CryptoCard';
import NewsCard from '@/components/crypto/NewsCard';
import { WeatherState, CryptoState } from '@/types';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const weatherState = useSelector((state: RootState) => state.weather) as WeatherState;
  const cryptoState = useSelector((state: RootState) => state.crypto) as CryptoState;

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchWeatherData('New York'));
    dispatch(fetchWeatherData('London'));
    dispatch(fetchWeatherData('Tokyo'));
    dispatch(fetchCryptoData(['bitcoin', 'ethereum', 'solana']));
    dispatch(fetchCryptoNews());

    // Set up polling for weather data
    const weatherInterval = setInterval(() => {
      dispatch(fetchWeatherData('New York'));
      dispatch(fetchWeatherData('London'));
      dispatch(fetchWeatherData('Tokyo'));
    }, 60000);

    // Set up polling for crypto news
    const newsInterval = setInterval(() => {
      dispatch(fetchCryptoNews());
    }, 60000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(newsInterval);
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Weather Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weather</h2>
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
      </section>

      {/* Crypto Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cryptocurrencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['bitcoin', 'ethereum', 'solana'].map((id) => (
            <CryptoCard
              key={id}
              data={cryptoState.data[id]}
              loading={cryptoState.loading}
            />
          ))}
        </div>
      </section>

      {/* News Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Crypto News</h2>
        <div className="space-y-4">
          {cryptoState.news.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
