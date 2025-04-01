import { Providers } from '@/store/provider';
import Layout from '@/components/layout/Layout';
import './globals.css';

export const metadata = {
  title: 'CryptoWeather Nexus',
  description: 'Real-time cryptocurrency prices and weather data dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
