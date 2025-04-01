'use client';

import { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { use } from 'react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
  }>;
  daily: Array<{
    time: string;
    maxTemp: number;
    minTemp: number;
    precipitationProb: number;
  }>;
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
}

function WeatherDetailsContent({ id }: { id: string }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchWeatherData = useCallback(async () => {
    try {
      const response = await fetch(`/api/weather/forecast?id=${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      
      setWeatherData(data);
      setError(null);
    } catch (error) {
      throw error;
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      try {
        await fetchWeatherData();
        setRetryCount(0);
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error fetching weather data:', error);
        
        if (error instanceof Error) {
          if (retryCount < MAX_RETRIES) {
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
  }, [id, retryCount, fetchWeatherData]);

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

  if (!weatherData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Location Not Found</h2>
        <p className="text-gray-600">The requested location could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{weatherData.location.name}</h1>
          <p className="text-lg text-gray-500">{weatherData.location.country}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Temperature</h3>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(weatherData.current.temperature)}°C
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Humidity</h3>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(weatherData.current.humidity)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Wind Speed</h3>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(weatherData.current.windSpeed)} km/h
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Forecast</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData.hourly.slice(0, 24)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}°C`}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}°C`, 'Temperature']}
                  labelFormatter={(label) => format(new Date(label), 'MMM d, HH:mm')}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Forecast</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherData.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  yAxisId="left"
                  tickFormatter={(value) => `${value}°C`}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const unit = name === 'precipitationProb' ? '%' : '°C';
                    return [`${value}${unit}`, name];
                  }}
                  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                />
                <Bar
                  yAxisId="left"
                  dataKey="maxTemp"
                  fill="#4F46E5"
                  name="Max Temperature"
                />
                <Bar
                  yAxisId="left"
                  dataKey="minTemp"
                  fill="#10B981"
                  name="Min Temperature"
                />
                <Bar
                  yAxisId="right"
                  dataKey="precipitationProb"
                  fill="#F59E0B"
                  name="Precipitation Probability"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Pressure</p>
            <p className="text-xl font-semibold">{Math.round(weatherData.current.pressure)} hPa</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Coordinates</p>
            <p className="text-xl font-semibold">
              {weatherData.location.latitude.toFixed(4)}°, {weatherData.location.longitude.toFixed(4)}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeatherDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <WeatherDetailsContent id={resolvedParams.id} />;
} 