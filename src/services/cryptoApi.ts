import { useQuery } from "@tanstack/react-query";
import { useMarketStore } from "@/stores/marketStore";

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

const fetchMarketData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }
  
  return response.json();
};

const fetchHistoricalData = async (id: string, currency: string = 'inr', days: number = 7): Promise<HistoricalData> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch historical data");
  }

  return response.json();
};

const fetchMarketNews = async (): Promise<NewsItem[]> => {
  // Use CryptoCompare News API as a more reliable alternative
  const response = await fetch(
    "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular"
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  
  const data = await response.json();
  
  // Transform the response to match our NewsItem interface
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
};

export const useMarketData = () => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["marketData", currency],
    queryFn: () => fetchMarketData(currency),
    refetchInterval: 30000,
  });
};

export const useHistoricalData = (id: string, days: number = 7) => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["historicalData", id, currency, days],
    queryFn: () => fetchHistoricalData(id, currency, days),
    enabled: !!id,
  });
};

export const fetchCryptoDetail = async (id: string): Promise<CryptoData> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch crypto details");
  }
  
  return response.json();
};

export const useNewsData = () => {
  return useQuery({
    queryKey: ["newsData"],
    queryFn: fetchMarketNews,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// Fetch stock data (simulated for now as we need a different API for real stock data)
export const useStockData = () => {
  return useQuery({
    queryKey: ["stockData"],
    queryFn: async () => {
      // This would be replaced with actual stock API call
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
