import { NextResponse } from 'next/server';
import { format } from 'date-fns';

const NEWSDATA_API = 'https://newsdata.io/api/1/news';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

let cache = {
  data: null,
  timestamp: 0,
};

export async function GET() {
  try {
    const now = Date.now();
    
    if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    const response = await fetch(
      `${NEWSDATA_API}?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_API_KEY}&q=cryptocurrency&language=en&category=business&size=5`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        if (cache.data) {
          return NextResponse.json(cache.data);
        }
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`NewsData API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Format the news data
    const formattedData = {
      ...data,
      results: data.results.map((article: any) => ({
        ...article,
        publishedAt: article.pubDate ? format(new Date(article.pubDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : new Date().toISOString(),
      })),
    };
    
    // Update cache
    cache = {
      data: formattedData,
      timestamp: now,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching news:', error);
    // If there's an error but we have cached data, return it
    if (cache.data) {
      return NextResponse.json(cache.data);
    }
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 