
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
const MOCK_MODE = true; // Set to true to use mock data during development

const generateMockHistoricalData = (days: number): HistoricalData => {
  const now = Date.now();
  const interval = (days * 24 * 60 * 60 * 1000) / 100; // 100 data points
  const basePrice = 45000 + Math.random() * 5000;
  
  const prices: [number, number][] = Array.from({ length: 100 }).map((_, i) => {
    const timestamp = now - (days * 24 * 60 * 60 * 1000) + (i * interval);
    const randomChange = (Math.random() - 0.5) * 1000;
    const price = basePrice + randomChange;
    return [timestamp, price];
  });
  
  return { prices };
};

const generateMockMarketData = (): MarketData[] => {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'SOL', name: 'Solana' }
  ];
  
  return cryptos.map((crypto, i) => ({
    id: crypto.symbol.toLowerCase(),
    symbol: crypto.symbol,
    name: crypto.name,
    current_price: Math.random() * 50000,
    price_change_percentage_24h: (Math.random() - 0.5) * 10,
    market_cap: Math.random() * 1000000000000,
    circulating_supply: Math.random() * 1000000000,
    total_volume: Math.random() * 10000000000,
  }));
};

const fetchHistoricalData = async (id: string, currency: string = 'inr', days: number = 7): Promise<HistoricalData> => {
  if (MOCK_MODE) {
    return generateMockHistoricalData(days);
  }

  const url = `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return generateMockHistoricalData(days);
  }
};

const fetchMarketData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  if (MOCK_MODE) {
    return generateMockMarketData();
  }

  const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=20&page=1&sparkline=false`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    return generateMockMarketData();
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
    staleTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNewsData = () => {
  return useQuery({
    queryKey: ["newsData"],
    queryFn: fetchMarketNews,
    staleTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useStockData = () => {
  return useQuery({
    queryKey: ["stockData"],
    queryFn: async () => {
      return Array.from({ length: 20 }).map((_, i) => ({
        id: `stock-${i}`,
        symbol: ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"][i % 5],
        name: ["Apple", "Google", "Microsoft", "Amazon", "Tesla"][i % 5],
        current_price: Math.random() * 1000,
        price_change_percentage_24h: (Math.random() - 0.5) * 10,
        market_cap: Math.random() * 1000000000000,
        circulating_supply: Math.random() * 1000000000,
        total_volume: Math.random() * 10000000000,
      }));
    },
    refetchInterval: 30000,
  });
};
