# CryptoWeather Nexus

A real-time dashboard that combines cryptocurrency prices and weather data for major cities.

## Features

- Real-time weather data for New York, London, and Tokyo
- Live cryptocurrency prices for Bitcoin, Ethereum, and Solana
- Top 5 cryptocurrency news headlines
- WebSocket integration for real-time price updates
- Responsive design with Tailwind CSS
- Redux state management
- Favorites system for cities and cryptocurrencies
- Toast notifications for price and weather alerts

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- API keys for:
  - OpenWeatherMap (https://openweathermap.org/api)
  - NewsData.io (https://newsdata.io/)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cryptoweather-nexus.git
   cd cryptoweather-nexus
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── weather/          # Weather-related components
│   ├── crypto/           # Crypto-related components
│   └── common/           # Shared components
├── store/                # Redux store
│   ├── slices/          # Redux slices
│   └── middleware/      # Redux middleware
├── services/            # API and WebSocket services
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Technologies Used

- Next.js 13+ (App Router)
- React
- Redux Toolkit
- TypeScript
- Tailwind CSS
- Axios
- Socket.io-client
- React Hot Toast
- Heroicons
- Recharts
- date-fns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
