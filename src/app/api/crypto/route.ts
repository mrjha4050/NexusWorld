import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 30 * 1000; // 30 seconds in milliseconds

interface CoinGeckoPriceData {
  usd: number;
  usd_24h_change: number;
  usd_market_cap: number;
  usd_24h_vol: number;
}

interface CoinGeckoResponse {
  [key: string]: CoinGeckoPriceData;
}

interface FormattedCryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
}

interface CacheData {
  data: Record<string, FormattedCryptoData> | null;
  timestamp: number;
  ids: string;
}

let cache: CacheData = {
  data: null,
  timestamp: 0,
  ids: '',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids') || '';
    const vs_currencies = searchParams.get('vs_currencies') || 'usd';
    const include_24hr_change = searchParams.get('include_24hr_change') || 'true';
    const include_market_cap = searchParams.get('include_market_cap') || 'true';
    const include_24hr_vol = searchParams.get('include_24hr_vol') || 'true';

    const now = Date.now();
    
    // Return cached data if it's still valid and for the same IDs
    if (cache.data && (now - cache.timestamp) < CACHE_DURATION && cache.ids === ids) {
      return NextResponse.json(cache.data);
    }

    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=${vs_currencies}&include_24hr_change=${include_24hr_change}&include_market_cap=${include_market_cap}&include_24hr_vol=${include_24hr_vol}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        // If rate limited, try to return cached data even if expired
        if (cache.data && cache.ids === ids) {
          return NextResponse.json(cache.data);
        }
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const rawData = await response.json() as CoinGeckoResponse;
    
    // Format the data for the frontend
    const formattedData = Object.entries(rawData).reduce((acc, [id, data]) => {
      acc[id] = {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        symbol: id.toUpperCase(),
        price: data.usd || 0,
        priceChange24h: data.usd_24h_change || 0,
        marketCap: data.usd_market_cap || 0,
        volume24h: data.usd_24h_vol || 0,
      };
      return acc;
    }, {} as Record<string, FormattedCryptoData>);
    
    // Update cache
    cache = {
      data: formattedData,
      timestamp: now,
      ids,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    // If there's an error but we have cached data, return it
    if (cache.data) {
      return NextResponse.json(cache.data);
    }
    return NextResponse.json(
      { error: 'Failed to fetch crypto data' },
      { status: 500 }
    );
  }
} 