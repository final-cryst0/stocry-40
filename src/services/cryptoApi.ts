import { useQuery } from "@tanstack/react-query";
import { useMarketStore } from "@/stores/marketStore";
import { useToast } from "@/hooks/use-toast";

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
const MOCK_MODE = false; // Set to false to use real API

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

const fetchMarketData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  if (MOCK_MODE) {
    return generateMockMarketData(currency);
  }

  const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=20&page=1&sparkline=false`;
  
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

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      current_price: item.current_price,
      price_change_percentage_24h: item.price_change_percentage_24h,
      market_cap: item.market_cap,
      circulating_supply: item.circulating_supply,
      total_volume: item.total_volume,
      market_cap_rank: item.market_cap_rank
    }));
  } catch (error) {
    console.error('Error fetching market data:', error);
    return generateMockMarketData(currency);
  }
};

const fetchMarketNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular"
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    
    const data = await response.json();
    
    return data.Data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.body,
      url: item.url,
      source: item.source,
      published_at: new Date(item.published_on * 1000).toISOString(),
      categories: [item.categories],
      thumbnail: item.imageurl,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

const fetchStockData = async (currency: string = 'usd') => {
  const multiplier = currency.toLowerCase() === 'usd' ? 1 : 82;
  const stocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 
    'META', 'TSLA', 'BRK-B', 'UNH', 'JNJ',
    'JPM', 'V', 'PG', 'MA', 'HD',
    'CVX', 'MRK', 'PEP', 'BAC', 'KO'
  ];
  
  try {
    const symbols = stocks.join(',');
    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const data = await response.json();
    return data.quoteResponse.result.map((stock: any, index: number) => ({
      id: `stock-${stock.symbol}`,
      symbol: stock.symbol,
      name: stock.longName || stock.shortName,
      current_price: stock.regularMarketPrice * multiplier,
      price_change_percentage_24h: stock.regularMarketChangePercent,
      market_cap: stock.marketCap * multiplier,
      circulating_supply: stock.sharesOutstanding || 0,
      total_volume: stock.regularMarketVolume * stock.regularMarketPrice * multiplier,
      market_cap_rank: index + 1
    }));
  } catch (error) {
    console.error('Error fetching stock data:', error);
    // Return mock data if API fails
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `stock-${i}`,
      symbol: stocks[i],
      name: ['Apple Inc', 'Microsoft Corp', 'Alphabet Inc', 'Amazon.com Inc', 'NVIDIA Corp',
            'Meta Platforms Inc', 'Tesla Inc', 'Berkshire Hathaway Inc', 'UnitedHealth Group Inc', 'Johnson & Johnson',
            'JPMorgan Chase & Co', 'Visa Inc', 'Procter & Gamble Co', 'Mastercard Inc', 'Home Depot Inc',
            'Chevron Corp', 'Merck & Co Inc', 'PepsiCo Inc', 'Bank of America Corp', 'Coca-Cola Co'][i],
      current_price: (Math.random() * 1000) * multiplier,
      price_change_percentage_24h: (Math.random() - 0.5) * 10,
      market_cap: Math.random() * 1000000000000 * multiplier,
      circulating_supply: Math.random() * 1000000000,
      total_volume: Math.random() * 10000000000 * multiplier,
      market_cap_rank: i + 1
    }));
  }
};

export const useMarketData = () => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["marketData", currency],
    queryFn: () => fetchMarketData(currency),
    refetchInterval: 30000,
    staleTime: 30000,
    retry: 1,
  });
};

export const useHistoricalData = (id: string, days: number = 7) => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["historicalData", id, currency, days],
    queryFn: () => fetchHistoricalData(id, currency, days),
    enabled: !!id,
    staleTime: 300000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNewsData = () => {
  return useQuery({
    queryKey: ["newsData"],
    queryFn: fetchMarketNews,
    staleTime: 300000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useStockData = () => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["stockData", currency],
    queryFn: () => fetchStockData(currency),
    refetchInterval: 30000,
    staleTime: 30000,
    retry: 1,
  });
};
