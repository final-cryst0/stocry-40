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

// Top Indian stocks with BSE symbols
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

// Fetch latest USD to INR exchange rate from Binance
const fetchUSDINRRate = async () => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTBIDR');
    const data = await response.json();
    // Using USDT-BIDR as a proxy, then dividing by 14500 (approximate IDR/INR rate)
    return parseFloat(data.price) / 14500;
  } catch (error) {
    console.error('Error fetching USD/INR rate:', error);
    return 83; // Fallback rate
  }
};

const fetchBinancePrice = async (symbol: string) => {
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
      high_24h: parseFloat(data.highPrice),
      low_24h: parseFloat(data.lowPrice)
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
};

const fetchMarketData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  try {
    const usdInrRate = await fetchUSDINRRate();
    console.log('Current USD/INR rate:', usdInrRate);

    const cryptoPromises = CRYPTO_PAIRS.map(async (pair) => {
      const priceData = await fetchBinancePrice(pair.symbol);
      
      if (!priceData) {
        console.error(`Failed to fetch data for ${pair.symbol}`);
        return null;
      }

      const priceInINR = priceData.current_price * usdInrRate;

      return {
        id: pair.displaySymbol.toLowerCase(),
        symbol: pair.displaySymbol,
        name: pair.name,
        current_price: priceInINR,
        price_change_percentage_24h: priceData.price_change_percentage_24h,
        market_cap: priceData.total_volume * priceInINR,
        circulating_supply: 0,
        total_volume: priceData.total_volume,
        market_cap_rank: 0
      };
    });

    const results = await Promise.all(cryptoPromises);
    return results.filter((result): result is MarketData => result !== null);
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

const fetchStockData = async (currency: string = 'inr'): Promise<MarketData[]> => {
  return INDIAN_STOCKS.map((stock, index) => ({
    id: stock.symbol.toLowerCase(),
    symbol: stock.bseCode, // Use BSE code for TradingView widget
    name: stock.name,
    current_price: 0,
    price_change_percentage_24h: 0,
    market_cap: 0,
    circulating_supply: 0,
    total_volume: 0,
    market_cap_rank: index + 1
  }));
};

export const useMarketData = () => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["marketData", currency],
    queryFn: () => fetchMarketData(currency),
    refetchInterval: 5000, // Refresh every 5 seconds for more frequent updates
    staleTime: 2000,
    retry: 1,
  });
};

export const useStockData = () => {
  const { currency } = useMarketStore();
  return useQuery({
    queryKey: ["stockData", currency],
    queryFn: () => fetchStockData(currency),
    refetchInterval: 5000,
    staleTime: 2000,
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

export const useNewsData = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: fetchMarketNews,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 240000,
    retry: 1,
  });
};
