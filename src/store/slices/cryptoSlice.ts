import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CryptoState } from '@/types';

const initialState: CryptoState = {
  data: {},
  news: [],
  loading: false,
  error: null,
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (ids: string[]) => {
    const response = await axios.get(`/api/crypto?ids=${ids.join(',')}`);
    return response.data;
  }
);

export const fetchCryptoNews = createAsyncThunk(
  'crypto/fetchCryptoNews',
  async () => {
    const response = await axios.get('/api/news');
    return response.data.results;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchCryptoData
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      })
      // Handle fetchCryptoNews
      .addCase(fetchCryptoNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchCryptoNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto news';
      });
  },
});

export default cryptoSlice.reducer; 