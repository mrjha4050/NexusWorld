'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCryptoData, fetchCryptoNews } from '@/store/slices/cryptoSlice';
import CryptoCard from '@/components/crypto/CryptoCard';
import NewsCard from '@/components/crypto/NewsCard';
import { CryptoState } from '@/types';

export default function CryptoPage() {
  const dispatch = useDispatch<AppDispatch>();
  const cryptoState = useSelector((state: RootState) => state.crypto) as CryptoState;

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchCryptoData(['bitcoin', 'ethereum', 'solana']));
    dispatch(fetchCryptoNews());

    // Set up polling for crypto news
    const newsInterval = setInterval(() => {
      dispatch(fetchCryptoNews());
    }, 60000);

    return () => {
      clearInterval(newsInterval);
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Cryptocurrency Dashboard</h1>
      
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cryptocurrencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['bitcoin', 'ethereum', 'solana'].map((id) => (
            <CryptoCard
              key={id}
              data={cryptoState.data[id]}
              loading={cryptoState.loading}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Crypto News</h2>
        <div className="space-y-4">
          {cryptoState.news.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
} 