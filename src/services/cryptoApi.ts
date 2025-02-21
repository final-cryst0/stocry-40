
import { CryptoData, StockData } from "@/types/market";

export const useMarketData = () => {
  const mockCryptoData: CryptoData[] = [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      current_price: 65000,
      price_change_percentage_24h: 2.5,
      market_cap: 1200000000000,
      total_volume: 30000000000,
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      current_price: 3500,
      price_change_percentage_24h: 1.8,
      market_cap: 420000000000,
      total_volume: 15000000000,
    },
  ];

  return { data: mockCryptoData, isLoading: false };
};

export const useStockData = () => {
  const mockStockData: StockData[] = [
    {
      id: "RELIANCE",
      symbol: "RELIANCE",
      name: "Reliance Industries",
      current_price: 2500,
      price_change_percentage_24h: 1.2,
      market_cap: 17000000000000,
      total_volume: 500000000,
    },
    {
      id: "TCS",
      symbol: "TCS",
      name: "Tata Consultancy Services",
      current_price: 3800,
      price_change_percentage_24h: -0.5,
      market_cap: 14000000000000,
      total_volume: 300000000,
    },
  ];

  return { data: mockStockData, isLoading: false };
};
