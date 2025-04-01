import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CryptoData, CryptoState, NewsArticle } from '@/types';

const initialState: CryptoState = {
  data: {},
  loading: false,
  error: null,
  news: [],
};

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (ids: string[]): Promise<CryptoData[]> => {
    const response = await axios.get(
      `${COINGECKO_API}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
    );
    
    return Object.entries(response.data).map(([id, data]: [string, any]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      symbol: id.toUpperCase(),
      price: data.usd,
      priceChange24h: data.usd_24h_change,
      marketCap: data.usd_market_cap,
      volume24h: data.usd_24h_vol,
    }));
  }
);

export const fetchCryptoNews = createAsyncThunk(
  'crypto/fetchCryptoNews',
  async (): Promise<NewsArticle[]> => {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=cryptocurrency&language=en&category=business&size=5`
    );
    
    return response.data.results.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.link,
      publishedAt: article.pubDate,
    }));
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCryptoPrice: (state, action) => {
      const { id, price } = action.payload;
      if (state.data[id]) {
        state.data[id].price = price;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((crypto) => {
          state.data[crypto.id] = crypto;
        });
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      })
      .addCase(fetchCryptoNews.fulfilled, (state, action) => {
        state.news = action.payload;
      });
  },
});

export const { updateCryptoPrice, clearError } = cryptoSlice.actions;
export default cryptoSlice.reducer; 