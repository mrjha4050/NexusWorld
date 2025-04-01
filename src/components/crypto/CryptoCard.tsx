import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
}

interface CryptoCardProps {
  data?: CryptoData;
  loading: boolean;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ data, loading }) => {
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
        <h3 className="text-lg font-semibold text-gray-900">No data available</h3>
      </div>
    );
  }

  const priceChangeColor = data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
  const PriceChangeIcon = data.priceChange24h >= 0 ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
        <CurrencyDollarIcon className="h-6 w-6 text-gray-500" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">
        ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`flex items-center ${priceChangeColor} mb-4`}>
        <PriceChangeIcon className="h-5 w-5 mr-1" />
        <span>{Math.abs(data.priceChange24h).toFixed(2)}% (24h)</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
        <div>
          <span className="font-medium">Market Cap:</span> ${(data.marketCap / 1e9).toFixed(2)}B
        </div>
        <div>
          <span className="font-medium">Volume (24h):</span> ${(data.volume24h / 1e9).toFixed(2)}B
        </div>
      </div>
    </div>
  );
};

export default CryptoCard; 