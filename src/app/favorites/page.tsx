'use client';

import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { fetchCryptoData } from '@/store/slices/cryptoSlice';
import WeatherCard from '@/components/weather/WeatherCard';
import CryptoCard from '@/components/crypto/CryptoCard';
import CitySelector from '@/components/weather/CitySelector';
import CryptoSelector from '@/components/crypto/CryptoSelector';
import { WeatherState, CryptoState, FavoritesState } from '@/types';

export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const weatherState = useSelector((state: RootState) => state.weather) as WeatherState;
  const cryptoState = useSelector((state: RootState) => state.crypto) as CryptoState;
  const favoritesState = useSelector((state: RootState) => state.favorites) as FavoritesState;
  const [mounted, setMounted] = useState(false);

  const fetchWeatherDataForCities = useCallback(() => {
    favoritesState.cities.forEach(city => {
      dispatch(fetchWeatherData(city));
    });
  }, [dispatch, favoritesState.cities]);

  const fetchCryptoDataForFavorites = useCallback(() => {
    if (favoritesState.cryptocurrencies.length > 0) {
      dispatch(fetchCryptoData(favoritesState.cryptocurrencies));
    }
  }, [dispatch, favoritesState.cryptocurrencies]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Fetch initial data
    fetchWeatherDataForCities();
    fetchCryptoDataForFavorites();

    // Set up polling
    const weatherInterval = setInterval(fetchWeatherDataForCities, 60000);
    const cryptoInterval = setInterval(fetchCryptoDataForFavorites, 60000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(cryptoInterval);
    };
  }, [dispatch, fetchWeatherDataForCities, fetchCryptoDataForFavorites, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Favorites Dashboard</h1>

      {/* City Selection Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Cities to Favorites</h2>
        <CitySelector />
      </section>

      {/* Crypto Selection Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Cryptocurrencies to Favorites</h2>
        <CryptoSelector />
      </section>

      {/* Favorite Cities Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Favorite Cities</h2>
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
          <p className="text-gray-500">No favorite cities added yet. Select cities from above to add them to your favorites.</p>
        )}
      </section>

      {/* Favorite Cryptocurrencies Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Favorite Cryptocurrencies</h2>
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
          <p className="text-gray-500">No favorite cryptocurrencies added yet. Select cryptocurrencies from above to add them to your favorites.</p>
        )}
      </section>
    </div>
  );
} 