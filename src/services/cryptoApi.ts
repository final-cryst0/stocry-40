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

const createHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 429) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Resource not found");
    }
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
};

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

const fetchMarketData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=20&page=1&sparkline=false`;
  
  try {
    return await fetchWithRetry(url, {
      method: 'GET',
      headers: createHeaders(),
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `mock-${i}`,
      symbol: ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'][i],
      name: ['Bitcoin', 'Ethereum', 'Tether', 'Binance Coin', 'Solana'][i],
      current_price: Math.random() * 50000,
      price_change_percentage_24h: (Math.random() - 0.5) * 10,
      market_cap: Math.random() * 1000000000000,
      circulating_supply: Math.random() * 1000000000,
      total_volume: Math.random() * 10000000000,
    }));
  }
};

const fetchHistoricalData = async (id: string, currency: string = 'inr', days: number = 7): Promise<HistoricalData> => {
  const url = `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`;
  
  try {
    return await fetchWithRetry(url, {
      method: 'GET',
      headers: createHeaders(),
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    const mockPrices: [number, number][] = Array.from({ length: days * 24 }).map((_, i) => [
      Date.now() - (days * 24 * 60 * 60 * 1000) + (i * 60 * 60 * 1000),
      Math.random() * 50000
    ]);
    return { prices: mockPrices };
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
    staleTime: 10000,
    retry: 3,
  });
};

export const useHistoricalData = (id: string, days: number = 7) => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["historicalData", id, currency, days],
    queryFn: () => fetchHistoricalData(id, currency, days),
    enabled: !!id,
    staleTime: 300000, // 5 minutes
    retry: 3,
  });
};

export const fetchCryptoDetail = async (id: string): Promise<CryptoData> => {
  const url = `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`;
  
  try {
    return await fetchWithRetry(url, {
      method: 'GET',
      headers: createHeaders(),
    });
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
};

export const useNewsData = () => {
  return useQuery({
    queryKey: ["newsData"],
    queryFn: fetchMarketNews,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000, // Consider data fresh for 1 minute
    retry: 3,
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
