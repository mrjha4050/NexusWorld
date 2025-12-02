import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'; // Removed CurrencyDollarIcon
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

  // Using the variables instead of duplicating the logic
  const priceChangeColor = data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
  const PriceChangeIcon = data.priceChange24h >= 0 ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Link href={`/crypto/${data.id}`} className="block">
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-lg font-semibold text-gray-900">{data.name}</div>
            <div className="text-sm text-gray-500">{data.symbol.toUpperCase()}</div>
          </div>
          <div className="flex items-center">
            <PriceChangeIcon className={`h-5 w-5 ${priceChangeColor} mr-1`} />
            <span className={`px-2 py-1 rounded text-sm ${priceChangeColor}`}>
              {Math.abs(data.priceChange24h).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            ${data.price.toLocaleString()}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div style={{color: '#999'}}>Market Cap</div>
              <div className="font-medium">${(data.marketCap / 1e9).toFixed(2)}B</div>
            </div>
            <div>
              <div style={{color: '#999'}}>24h Volume</div>
              <div className="font-medium">${(data.volume24h / 1e9).toFixed(2)}B</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}