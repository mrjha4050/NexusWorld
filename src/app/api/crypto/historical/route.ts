import { NextResponse } from 'next/server';

// Define the expected response structure from CoinGecko
interface MarketChartData {
  prices: [number, number][]; // [timestamp, price] pairs
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Cache for storing API responses
const cache = new Map<string, { data: MarketChartData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const days = searchParams.get('days');

    if (!id || !days) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${id}-${days}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData.data);
    }

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch(
      `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        // If rate limited, try with a longer delay
        await new Promise(resolve => setTimeout(resolve, 5000));
        const retryResponse = await fetch(
          `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!retryResponse.ok) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        }

        const data: MarketChartData = await retryResponse.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return NextResponse.json(data);
      }
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data: MarketChartData = await response.json();
    
    // Validate the response data
    if (!data.prices || !Array.isArray(data.prices)) {
      throw new Error('Invalid data format received from CoinGecko');
    }

    // Cache the successful response
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('Invalid data format')) {
        return NextResponse.json(
          { error: 'Invalid data received from CoinGecko' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch historical data. Please try again later.' },
      { status: 500 }
    );
  }
}