export interface WeatherData {
  id: string;
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface WeatherState {
  data: Record<string, WeatherData>;
  loading: boolean;
  error: string | null;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export interface CryptoState {
  data: Record<string, CryptoData>;
  loading: boolean;
  error: string | null;
  news: NewsArticle[];
}

export interface FavoritesState {
  cities: string[];
  cryptocurrencies: string[];
} 