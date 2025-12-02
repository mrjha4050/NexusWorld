import React from 'react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { HomeIcon, CloudIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Weather', href: '/weather', icon: CloudIcon },
    { name: 'Crypto', href: '/crypto', icon: CurrencyDollarIcon },
    { name: 'Favorites', href: '/favorites', icon: StarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-white drop-shadow-md">CryptoWeather Nexus</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-indigo-700 transition-all duration-200 hover:shadow-md"
                  >
                    <item.icon className="h-5 w-5 mr-1.5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default Layout; 