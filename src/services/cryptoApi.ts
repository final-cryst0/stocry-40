
import { useQuery } from "@tanstack/react-query";

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
}

const fetchMarketData = async (): Promise<MarketData[]> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=1&sparkline=false"
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }
  
  return response.json();
};

export const useMarketData = () => {
  return useQuery({
    queryKey: ["marketData"],
    queryFn: fetchMarketData,
    refetchInterval: 30000, // Refetch every 30 seconds
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
