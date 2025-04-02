'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCryptoData } from '@/store/slices/cryptoSlice';
// Make sure this import path is correct and the type is exported
import { CryptoData } from '@/types'; // Verify this path
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { use } from 'react';

interface HistoricalDataPoint {
  date: string;
  price: number;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function CryptoDetailsContent({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const cryptoState = useSelector((state: RootState) => state.crypto);
  const cryptoData = cryptoState.data[id] as CryptoData | undefined;

  const fetchHistoricalData = useCallback(async () => {
    try {
      const days = timeRange === '24h' ? '1' : timeRange === '7d' ? '7' : '30';
      const response = await fetch(`/api/crypto/historical?id=${id}&days=${days}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch historical data');
      }
      
      if (!data.prices || !Array.isArray(data.prices)) {
        throw new Error('Invalid data format received');
      }
  
      const transformedData = data.prices
        .map(([timestamp, price]: [number, number]) => ({
          date: format(new Date(timestamp), 'MMM d, HH:mm'),
          price,
        }))
        .filter((item: HistoricalDataPoint, index: number) => index % 2 === 0);
      
      setHistoricalData(transformedData);
      setError(null);
    } catch (error) {
      throw error;
    }
  }, [id, timeRange]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      try {
        await dispatch(fetchCryptoData([id]));
        await fetchHistoricalData();
        setRetryCount(0);
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error fetching crypto data:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('Rate limit') && retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setRetryCount(prev => prev + 1);
            return;
          }
          setError(error.message);
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, id, timeRange, retryCount, fetchHistoricalData]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cryptoData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cryptocurrency Not Found</h2>
        <p className="text-gray-600">The requested cryptocurrency could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cryptoData.name}</h1>
          <p className="text-lg text-gray-500">{cryptoData.symbol.toUpperCase()}</p>
        </div>
        <div className="flex space-x-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Price</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${cryptoData.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">24h Change</h3>
          <p className={`text-3xl font-bold ${
            cryptoData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {cryptoData.priceChange24h >= 0 ? '+' : ''}
            {cryptoData.priceChange24h.toFixed(2)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Cap</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${(cryptoData.marketCap / 1e9).toFixed(2)}B
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price History</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function CryptoDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <CryptoDetailsContent id={resolvedParams.id} />;
}