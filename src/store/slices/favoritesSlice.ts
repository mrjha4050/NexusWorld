import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoritesState } from '@/types';

const initialState: FavoritesState = {
  cities: [],
  cryptocurrencies: [],
};

const loadFavorites = (): FavoritesState => {
  if (typeof window === 'undefined') return initialState;
  
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    return JSON.parse(savedFavorites);
  }
  return initialState;
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: loadFavorites(),
  reducers: {
    toggleCity: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      if (state.cities.includes(city)) {
        state.cities = state.cities.filter((c) => c !== city);
      } else {
        state.cities.push(city);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state));
      }
    },
    toggleCryptocurrency: (state, action: PayloadAction<string>) => {
      const crypto = action.payload;
      if (state.cryptocurrencies.includes(crypto)) {
        state.cryptocurrencies = state.cryptocurrencies.filter((c) => c !== crypto);
      } else {
        state.cryptocurrencies.push(crypto);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state));
      }
    },
    clearFavorites: (state) => {
      state.cities = [];
      state.cryptocurrencies = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('favorites');
      }
    },
  },
});

export const { toggleCity, toggleCryptocurrency, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 