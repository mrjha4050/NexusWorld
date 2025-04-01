'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { fetchCryptoData, fetchCryptoNews } from '@/store/slices/cryptoSlice';
import WeatherCard from '@/components/weather/WeatherCard';
import CryptoCard from '@/components/crypto/CryptoCard';
import NewsCard from '@/components/crypto/NewsCard';
import { WeatherState, CryptoState, FavoritesState } from '@/types';
import toast from 'react-hot-toast';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const weatherState = useSelector((state: RootState) => state.weather) as WeatherState;
  const cryptoState = useSelector((state: RootState) => state.crypto) as CryptoState;
  const favoritesState = useSelector((state: RootState) => state.favorites) as FavoritesState;
  const [mounted, setMounted] = useState(false);
  const previousPrices = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    favoritesState.cryptocurrencies.forEach(id => {
      if (cryptoState.data[id]?.price) {
        previousPrices.current[id] = cryptoState.data[id].price;
      }
    });

    favoritesState.cities.forEach(city => {
      dispatch(fetchWeatherData(city));
    });

    if (favoritesState.cryptocurrencies.length > 0) {
      dispatch(fetchCryptoData(favoritesState.cryptocurrencies));
    }

    dispatch(fetchCryptoNews());
  }, [dispatch, favoritesState.cities, favoritesState.cryptocurrencies, mounted]);

  // Check for price changes after data is fetched
  useEffect(() => {
    if (!mounted) return;

    favoritesState.cryptocurrencies.forEach(id => {
      const currentPrice = cryptoState.data[id]?.price;
      const previousPrice = previousPrices.current[id];
      
      if (currentPrice && previousPrice) {
        const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
        if (Math.abs(priceChange) >= 0.1) { // Show toast for changes >= 0.1%
          const changeColor = priceChange >= 0 ? 'text-green-500' : 'text-red-500';
          const changeIcon = priceChange >= 0 ? '📈' : '📉';
          toast.success(
            <div className="flex items-center gap-2">
              <span>{cryptoState.data[id]?.name}</span>
              <span className={changeColor}>
                {changeIcon} {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>,
            {
              duration: 3000,
              position: 'top-right',
            }
          );
        }
      }
    });
  }, [cryptoState.data, favoritesState.cryptocurrencies, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Weather Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weather</h2>
        {favoritesState.cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {favoritesState.cities.map((city) => (
              <WeatherCard
                key={city}
                city={city}
                data={weatherState.data[city]}
                loading={weatherState.loading}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No favorite cities added yet. Visit the{' '}
            <a href="/favorites" className="text-indigo-600 hover:text-indigo-800">
              Favorites page
            </a>{' '}
            to add cities to your dashboard.
          </p>
        )}
      </section>

      {/* Crypto Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cryptocurrencies</h2>
        {favoritesState.cryptocurrencies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {favoritesState.cryptocurrencies.map((id) => (
              <CryptoCard
                key={id}
                data={cryptoState.data[id]}
                loading={cryptoState.loading}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No favorite cryptocurrencies added yet. Visit the{' '}
            <a href="/favorites" className="text-indigo-600 hover:text-indigo-800">
              Favorites page
            </a>{' '}
            to add cryptocurrencies to your dashboard.
          </p>
        )}
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
