'use client';

import { useEffect, useState, useRef } from 'react'; // Removed useCallback
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { fetchCryptoData, fetchCryptoNews } from '@/store/slices/cryptoSlice';
import { toast } from 'react-hot-toast';
import { WeatherState, CryptoState, FavoritesState, CryptoData } from '@/types';
import WeatherCard from '@/components/weather/WeatherCard';
import CryptoCard from '@/components/crypto/CryptoCard';
import NewsCard from '@/components/crypto/NewsCard';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const previousPrices = useRef<Record<string, CryptoData> | null>(null);

  const weatherState = useSelector((state: RootState) => state.weather) as WeatherState;
  const cryptoState = useSelector((state: RootState) => state.crypto) as CryptoState;
  const favoritesState = useSelector((state: RootState) => state.favorites) as FavoritesState;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load previous prices from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('previousPrices');
      if (stored) {
        previousPrices.current = JSON.parse(stored);
      }
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        // Store current prices before fetching new data
        if (favoritesState.cryptocurrencies.length > 0) {
          dispatch(fetchCryptoData(favoritesState.cryptocurrencies));
        }

        // Fetch new data
        await Promise.all([
          favoritesState.cities.forEach((city: string) => {
            dispatch(fetchWeatherData(city));
          }),
          favoritesState.cryptocurrencies.length > 0 && dispatch(fetchCryptoData(favoritesState.cryptocurrencies)),
          dispatch(fetchCryptoNews()),
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, [mounted, favoritesState.cities, favoritesState.cryptocurrencies, dispatch]);

  // Check for price changes and show notifications
  useEffect(() => {
    if (!mounted || !cryptoState.data || !previousPrices.current) return;

    Object.entries(cryptoState.data).forEach(([id, currentData]: [string, CryptoData]) => {
      const previousData = previousPrices.current?.[id];
      if (previousData && currentData.price !== previousData.price) {
        const priceChange = ((currentData.price - previousData.price) / previousData.price) * 100;
        if (Math.abs(priceChange) >= 0.1) {
          toast(
            `${currentData.name} (${currentData.symbol}) ${priceChange >= 0 ? '📈' : '📉'} ${Math.abs(priceChange).toFixed(2)}%`,
            {
              duration: 5000,
              style: {
                background: priceChange >= 0 ? '#10B981' : '#EF4444',
                color: 'white',
              },
            }
          );
        }
      }
    });

    // Update previous prices
    previousPrices.current = cryptoState.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem('previousPrices', JSON.stringify(cryptoState.data));
    }
  }, [mounted, cryptoState.data]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-3xl font-bold text-gray-800">Dashboard</div>
      
      {/* Weather Section */}
      <div>
        <div className="text-xl font-semibold text-gray-800 mb-4">Weather</div>
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
            <a href="/favorites" style={{color: '#4F46E5', textDecoration: 'underline'}}>
              Favorites page
            </a>{' '}
            to add cities to your dashboard.
          </p>
        )}
      </div>

      {/* Crypto Section */}
      <div>
        <div className="text-xl font-semibold text-gray-200 mb-4">Cryptocurrencies</div>
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
            <a href="/favorites" style={{color: '#4F46E5', textDecoration: 'underline'}}>
              Favorites page
            </a>{' '}
            to add cryptocurrencies to your dashboard.
          </p>
        )}
      </div>

      {/* News Section */}
      <div>
        <div className="text-xl font-semibold text-gray-200 mb-4">Latest Crypto News</div>
        <div className="space-y-4">
          {cryptoState.news.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
