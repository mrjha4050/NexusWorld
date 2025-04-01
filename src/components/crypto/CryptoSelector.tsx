import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { toggleCryptocurrency } from '@/store/slices/favoritesSlice';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const POPULAR_CRYPTOS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP' },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
];

const CryptoSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoritesState = useSelector((state: RootState) => state.favorites);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Cryptocurrencies</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {POPULAR_CRYPTOS.map((crypto) => {
          const isFavorite = favoritesState.cryptocurrencies.includes(crypto.id);
          return (
            <button
              key={crypto.id}
              onClick={() => dispatch(toggleCryptocurrency(crypto.id))}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-gray-900">{crypto.name}</div>
                <div className="text-sm text-gray-500">{crypto.symbol}</div>
              </div>
              {isFavorite ? (
                <StarIconSolid className="h-5 w-5 text-yellow-400" />
              ) : (
                <StarIconOutline className="h-5 w-5 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoSelector; 