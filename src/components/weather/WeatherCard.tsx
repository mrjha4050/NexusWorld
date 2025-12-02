import React from 'react';
import { CloudIcon } from '@heroicons/react/24/outline';
import { WeatherData } from '@/types';

interface WeatherCardProps {
  city: string;
  data?: WeatherData;
  loading: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">{city}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-900">{city}</div>
        <CloudIcon className="h-6 w-6 text-gray-500" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {Math.round(data.temperature)}°C
      </div>
      <p className="text-gray-600 capitalize mb-4">{data.description}</p>
      <div className="grid grid-cols-2 gap-4 text-sm" style={{color: '#888'}}>
        <div>
          <span className="font-medium">Humidity:</span> {data.humidity}%
        </div>
        <div>
          <span className="font-medium">Wind:</span> {data.windSpeed} m/s
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;