import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { toggleCity } from '@/store/slices/favoritesSlice';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const FAMOUS_CITIES = [
  { name: 'New York', country: 'USA' },
  { name: 'London', country: 'UK' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Paris', country: 'France' },
  { name: 'Dubai', country: 'UAE' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Hong Kong', country: 'China' },
  { name: 'Berlin', country: 'Germany' },
  { name: 'Mumbai', country: 'India' },
];

const CitySelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoritesState = useSelector((state: RootState) => state.favorites);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Cities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {FAMOUS_CITIES.map((city) => {
          const isFavorite = favoritesState.cities.includes(city.name);
          return (
            <button
              key={city.name}
              onClick={() => dispatch(toggleCity(city.name))}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">{city.name}</div>
                <div className="text-sm text-gray-500">{city.country}</div>
              </div>
              {isFavorite ? (
                <StarIconSolid className="h-5 w-5 text-yellow-400" />
              ) : (
                <StarIconOutline className="h-5 w-5 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CitySelector; 