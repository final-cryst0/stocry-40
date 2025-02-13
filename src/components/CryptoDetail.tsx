
import { ArrowLeft } from "lucide-react";
import { useHistoricalData } from "@/services/cryptoApi";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useMarketStore } from "@/stores/marketStore";
import { TimeframeSelector } from "./crypto/TimeframeSelector";
import { CryptoPriceChart } from "./crypto/CryptoPriceChart";
import { CryptoStats } from "./crypto/CryptoStats";

interface CryptoDetailProps {
  symbol: string;
  name: string;
  onBack: () => void;
}

export function CryptoDetail({ symbol, name, onBack }: CryptoDetailProps) {
  const [timeframe, setTimeframe] = useState(7);
  const { data, isLoading, error } = useHistoricalData(symbol, timeframe);
  const { toast } = useToast();
  const { currency } = useMarketStore();

  const handleAIAnalysis = () => {
    toast({
      title: "AI Analysis",
      description: `Analyzing ${name} (${symbol}) data...`,
    });
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load chart data",
    });
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe === 1) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = data?.prices.map(([timestamp, price]) => ({
    date: timestamp,
    price: price,
  }));

  const calculatePriceChange = () => {
    if (!chartData || chartData.length < 2) return { change: 0, percentage: 0 };
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    return { change, percentage };
  };

  const { change, percentage } = calculatePriceChange();
  const isPriceUp = percentage >= 0;
  const currentPrice = chartData && chartData[chartData.length - 1]?.price || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="neo-brutal-button px-4 py-2 rounded-lg flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CryptoPriceChart
          chartData={chartData}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          isPriceUp={isPriceUp}
          percentage={percentage}
          name={name}
          isLoading={isLoading}
        />

        <CryptoStats
          timeframe={timeframe}
          currentPrice={formatCurrency(currentPrice)}
          priceChange={formatCurrency(Math.abs(change))}
          percentage={percentage}
          lowestPrice={formatCurrency(Math.min(...(chartData?.map(d => d.price) || [])))}
          highestPrice={formatCurrency(Math.max(...(chartData?.map(d => d.price) || [])))}
          isPriceUp={isPriceUp}
          onAIAnalysis={handleAIAnalysis}
        />
      </div>
    </div>
  );
}
