import { useQuery } from "@tanstack/react-query";
import { useMarketStore } from "@/stores/marketStore";

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  circulating_supply: number;
  total_volume: number;
  market_cap_rank: number;
}

// Top Indian stocks with NSE symbols
const INDIAN_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', bseCode: '500325' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', bseCode: '532540' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', bseCode: '500180' },
  { symbol: 'INFY', name: 'Infosys', bseCode: '500209' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', bseCode: '500696' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', bseCode: '532174' },
  { symbol: 'SBIN', name: 'State Bank of India', bseCode: '500112' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', bseCode: '532454' },
  { symbol: 'ITC', name: 'ITC', bseCode: '500875' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', bseCode: '500247' }
];

const CRYPTO_PAIRS = [
  { symbol: 'BTCUSDT', displaySymbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', displaySymbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BNBUSDT', displaySymbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'XRPUSDT', displaySymbol: 'XRP', name: 'Ripple' },
  { symbol: 'SOLUSDT', displaySymbol: 'SOL', name: 'Solana' },
  { symbol: 'ADAUSDT', displaySymbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOTUSDT', displaySymbol: 'DOT', name: 'Polkadot' },
  { symbol: 'MATICUSDT', displaySymbol: 'MATIC', name: 'Polygon' },
  { symbol: 'DOGEUSDT', displaySymbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'SHIBUSDT', displaySymbol: 'SHIB', name: 'Shiba Inu' }
];

// Function to fetch USD to INR conversion rate
const fetchUSDINRRate = async () => {
  try {
    // Using Binance USDT/BUSD pair as a stable reference
    const response = await fetch(`${BINANCE_API_BASE}/ticker/price?symbol=USDTBUSD`);
    const data = await response.json();
    // Approximate INR rate based on current market conditions
    // Using a fixed multiplier as this is for demonstration
    return parseFloat(data.price) * 82.5; // Approximate USD/INR rate
  } catch (error) {
    console.error('Error fetching USD/INR rate:', error);
    return 82.5; // Fallback fixed rate if API fails
  }
};

// Function to fetch cryptocurrency price from Binance
const fetchCryptoPrice = async (symbol: string) => {
  try {
    console.log(`Fetching price for ${symbol}`);
    const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      current_price: parseFloat(data.lastPrice),
      price_change_percentage_24h: parseFloat(data.priceChangePercent),
      total_volume: parseFloat(data.volume),
      market_cap: parseFloat(data.lastPrice) * parseFloat(data.volume), // Approximate market cap
      high_24h: parseFloat(data.highPrice),
      low_24h: parseFloat(data.lowPrice)
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
};

// Main function to fetch market data
const fetchMarketData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  try {
    const usdInrRate = await fetchUSDINRRate();
    console.log('Current USD/INR rate:', usdInrRate);

    const cryptoPromises = CRYPTO_PAIRS.map(async (pair) => {
      const priceData = await fetchCryptoPrice(pair.symbol);
      
      if (!priceData) {
        console.error(`Failed to fetch data for ${pair.symbol}`);
        return null;
      }

      const priceInLocalCurrency = currency.toLowerCase() === 'usd' 
        ? priceData.current_price 
        : priceData.current_price * usdInrRate;

      return {
        id: pair.displaySymbol.toLowerCase(),
        symbol: pair.displaySymbol,
        name: pair.name,
        current_price: priceInLocalCurrency,
        price_change_percentage_24h: priceData.price_change_percentage_24h,
        market_cap: priceData.market_cap * (currency.toLowerCase() === 'usd' ? 1 : usdInrRate),
        circulating_supply: 0, // Would need additional API call to get this
        total_volume: priceData.total_volume,
        market_cap_rank: 0 // Would need additional API call to get this
      };
    });

    const results = await Promise.all(cryptoPromises);
    return results.filter((result): result is MarketData => result !== null);
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

// Mock function for stock data (since we need authenticated access for real data)
const fetchStockData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  return INDIAN_STOCKS.map((stock, index) => ({
    id: stock.symbol.toLowerCase(),
    symbol: stock.bseCode,
    name: stock.name,
    current_price: Math.random() * 1000 * (currency.toLowerCase() === 'usd' ? 1 : 82.5),
    price_change_percentage_24h: (Math.random() - 0.5) * 5,
    market_cap: Math.random() * 1000000 * (currency.toLowerCase() === 'usd' ? 1 : 82.5),
    circulating_supply: Math.random() * 1000000,
    total_volume: Math.random() * 100000,
    market_cap_rank: index + 1
  }));
};

// React Query hooks
export const useMarketData = () => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["marketData", currency],
    queryFn: () => fetchMarketData(currency),
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
    retry: 1,
  });
};

export const useStockData = () => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["stockData", currency],
    queryFn: () => fetchStockData(currency),
    refetchInterval: 10000,
    staleTime: 5000,
    retry: 1,
  });
};

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      inr: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      inr: number;
    };
  };
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  categories: string[];
  thumbnail?: string;
}

interface HistoricalData {
  prices: [number, number][];  // [timestamp, price]
}

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const FINNHUB_API_KEY = 'sandbox_chj7pc1r01qj53s8k50gchj7pc1r01qj53s8k510'; // Free sandbox key
const MOCK_MODE = true; // Set to true to use mock data

const generateMockHistoricalData = (days: number, currency: string): HistoricalData => {
  const now = Date.now();
  const interval = (days * 24 * 60 * 60 * 1000) / 100;
  const basePrice = currency.toLowerCase() === 'usd' ? 45000 : 3700000; // Approximate USD to INR conversion
  
  const prices: [number, number][] = Array.from({ length: 100 }).map((_, i) => {
    const timestamp = now - (days * 24 * 60 * 60 * 1000) + (i * interval);
    const randomChange = (Math.random() - 0.5) * (currency.toLowerCase() === 'usd' ? 1000 : 82000);
    const price = basePrice + randomChange;
    return [timestamp, price];
  });
  
  return { prices };
};

const generateMockMarketData = (currency: string): MarketData[] => {
  const multiplier = currency.toLowerCase() === 'usd' ? 1 : 82; // Approximate USD to INR conversion rate
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', basePrice: 45000 },
    { symbol: 'ETH', name: 'Ethereum', basePrice: 2500 },
    { symbol: 'USDT', name: 'Tether', basePrice: 1 },
    { symbol: 'BNB', name: 'Binance Coin', basePrice: 300 },
    { symbol: 'SOL', name: 'Solana', basePrice: 100 },
    { symbol: 'ADA', name: 'Cardano', basePrice: 0.5 },
    { symbol: 'XRP', name: 'Ripple', basePrice: 0.6 },
    { symbol: 'DOT', name: 'Polkadot', basePrice: 7 },
    { symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.08 },
    { symbol: 'AVAX', name: 'Avalanche', basePrice: 35 },
    { symbol: 'LINK', name: 'Chainlink', basePrice: 15 },
    { symbol: 'MATIC', name: 'Polygon', basePrice: 0.8 },
    { symbol: 'UNI', name: 'Uniswap', basePrice: 7 },
    { symbol: 'ATOM', name: 'Cosmos', basePrice: 10 },
    { symbol: 'LTC', name: 'Litecoin', basePrice: 65 },
    { symbol: 'FTM', name: 'Fantom', basePrice: 0.5 },
    { symbol: 'ALGO', name: 'Algorand', basePrice: 0.2 },
    { symbol: 'XLM', name: 'Stellar', basePrice: 0.1 },
    { symbol: 'NEAR', name: 'NEAR Protocol', basePrice: 2 },
    { symbol: 'GRT', name: 'The Graph', basePrice: 0.15 }
  ];
  
  return cryptos.map((crypto, index) => ({
    id: crypto.symbol.toLowerCase(),
    symbol: crypto.symbol,
    name: crypto.name,
    current_price: crypto.basePrice * multiplier,
    price_change_percentage_24h: (Math.random() - 0.5) * 10,
    market_cap: crypto.basePrice * multiplier * 1000000,
    circulating_supply: Math.random() * 1000000000,
    total_volume: crypto.basePrice * multiplier * 100000,
    market_cap_rank: index + 1
  }));
};

const fetchHistoricalData = async (id: string, currency: string = 'inr', days: number = 7): Promise<HistoricalData> => {
  if (MOCK_MODE) {
    return generateMockHistoricalData(days, currency);
  }

  const url = `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return generateMockHistoricalData(days, currency);
  }
};

const fetchMarketNews = async (): Promise<NewsItem[]> => {
  try {
    // Fetch crypto news
    const cryptoResponse = await fetch(
      "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular&limit=8"
    );
    
    if (!cryptoResponse.ok) {
      throw new Error("Failed to fetch crypto news");
    }
    
    const cryptoData = await cryptoResponse.json();
    
    // Transform crypto news
    const cryptoNews = cryptoData.Data.map((item: any) => ({
      id: `crypto-${item.id}`,
      title: item.title,
      description: item.body,
      url: item.url,
      source: item.source,
      published_at: new Date(item.published_on * 1000).toISOString(),
      categories: ["Cryptocurrency", ...item.categories.split('|')],
      thumbnail: item.imageurl,
    }));

    // Generate mock stock news since we don't have a free stock news API
    const stockNews = generateMockStockNews(4);

    // Combine and sort all news by published date
    return [...cryptoNews, ...stockNews].sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

// Helper function to generate mock stock news
const generateMockStockNews = (count: number): NewsItem[] => {
  const stockCompanies = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' }
  ];

  return stockCompanies.map((company, index) => ({
    id: `stock-${company.symbol}-${Date.now()}`,
    title: `${company.name} Stock Update: Market Analysis and Future Prospects`,
    description: `Latest market analysis shows promising trends for ${company.name}. Analysts predict strong performance in the coming quarter based on recent developments and market indicators.`,
    url: 'https://example.com/stock-news',
    source: 'Market Watch',
    published_at: new Date(Date.now() - index * 3600000).toISOString(), // Stagger the times
    categories: ['Stocks', company.symbol, 'Market Analysis'],
    thumbnail: `https://logo.clearbit.com/${company.name.toLowerCase()}.com`
  }));
};

// Modify the useNewsData hook to refresh more frequently
export const useNewsData = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: fetchMarketNews,
    refetchInterval: 60000, // Refresh every minute for more real-time updates
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 2,
  });
};
