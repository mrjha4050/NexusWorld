import React from 'react';
import { CurrencyDollarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { CryptoData } from '@/types';
import Link from 'next/link';

interface CryptoCardProps {
  data: CryptoData;
  loading: boolean;
}

export default function CryptoCard({ data, loading }: CryptoCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const priceChangeColor = data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
  const PriceChangeIcon = data.priceChange24h >= 0 ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Link href={`/crypto/${data.id}`} className="block">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{data.name}</h3>
            <p className="text-sm text-gray-500">{data.symbol.toUpperCase()}</p>
          </div>
          <span className={`px-2 py-1 rounded text-sm ${
            data.priceChange24h >= 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {data.priceChange24h >= 0 ? '📈' : '📉'} {Math.abs(data.priceChange24h).toFixed(2)}%
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-900">
            ${data.price.toLocaleString()}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Market Cap</p>
              <p className="font-medium">${(data.marketCap / 1e9).toFixed(2)}B</p>
            </div>
            <div>
              <p className="text-gray-500">24h Volume</p>
              <p className="font-medium">${(data.volume24h / 1e9).toFixed(2)}B</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 