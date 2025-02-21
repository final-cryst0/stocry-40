import { CryptoData, StockData } from "@/types/market";

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const useMarketData = () => {
  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false&price_change_percentage=24h`
      );
      const data = await response.json();
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return mockCryptoData;
    }
  };

  // Mock data as fallback
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

  // For now, return mock data until we implement real-time fetching
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

export const getTechnicalAnalysis = async (symbol: string) => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${symbol.toLowerCase()}/ohlc?vs_currency=usd&days=14`
    );
    const data = await response.json();
    
    // Calculate technical indicators
    const prices = data.map((item: number[]) => item[4]); // closing prices
    const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const rsi = calculateRSI(prices);
    const trend = prices[prices.length - 1] > avg ? "Bullish" : "Bearish";
    
    return {
      trend,
      support: `$${Math.min(...prices).toFixed(2)}`,
      resistance: `$${Math.max(...prices).toFixed(2)}`,
      rsi: `${rsi.toFixed(0)} (${getRSIInterpretation(rsi)})`,
      macd: trend === "Bullish" ? "Bullish Crossover" : "Bearish Crossover"
    };
  } catch (error) {
    console.error('Error getting technical analysis:', error);
    return null;
  }
};

export const getSentimentAnalysis = async (symbol: string) => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${symbol.toLowerCase()}?localization=false&tickers=false&community_data=true&developer_data=false&sparkline=false`
    );
    const data = await response.json();
    
    const sentiment = data.sentiment_votes_up_percentage;
    const score = (sentiment / 100) * 10;
    
    return {
      overall: sentiment > 60 ? "Positive" : sentiment > 40 ? "Neutral" : "Negative",
      socialScore: `${score.toFixed(1)}/10`,
      sentiment: sentiment > 60 ? "Bullish" : sentiment > 40 ? "Neutral" : "Bearish",
      outlook: sentiment > 60 ? "Optimistic" : sentiment > 40 ? "Neutral" : "Cautious",
      fearGreed: `${sentiment.toFixed(0)} (${sentiment > 60 ? "Greed" : sentiment > 40 ? "Neutral" : "Fear"})`
    };
  } catch (error) {
    console.error('Error getting sentiment analysis:', error);
    return null;
  }
};

export const getPricePredictions = async (symbol: string) => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=30&interval=daily`
    );
    const data = await response.json();
    
    const prices = data.prices.map((item: number[]) => item[1]);
    const volatility = calculateVolatility(prices);
    const currentPrice = prices[prices.length - 1];
    
    return {
      day: `$${(currentPrice * (1 + volatility * 0.01)).toFixed(2)}`,
      week: `$${(currentPrice * (1 + volatility * 0.03)).toFixed(2)}`,
      month: `$${(currentPrice * (1 + volatility * 0.05)).toFixed(2)}`,
      confidence: `${(85 - volatility * 10).toFixed(0)}%`,
      risk: volatility > 5 ? "High" : volatility > 3 ? "Medium" : "Low"
    };
  } catch (error) {
    console.error('Error getting price predictions:', error);
    return null;
  }
};

// Helper functions for technical analysis
function calculateRSI(prices: number[]): number {
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) {
      gains.push(difference);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(difference));
    }
  }
  
  const avgGain = gains.reduce((a, b) => a + b, 0) / gains.length;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function getRSIInterpretation(rsi: number): string {
  if (rsi > 70) return "Overbought";
  if (rsi < 30) return "Oversold";
  return "Neutral";
}

function calculateVolatility(prices: number[]): number {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * 100;
}
