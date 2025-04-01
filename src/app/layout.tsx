import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/provider';
import Layout from '@/components/layout/Layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather & Crypto Dashboard',
  description: 'Track weather and cryptocurrency prices in real-time',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
