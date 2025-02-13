
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useMarketStore } from "@/stores/marketStore";
import { StockPriceChart } from "./stock/StockPriceChart";
import { StockStatistics } from "./stock/StockStatistics";
import { TechnicalIndicators } from "./stock/TechnicalIndicators";

interface StockDetailProps {
  symbol: string;
  name: string;
  onBack: () => void;
}

export function StockDetail({ symbol, name, onBack }: StockDetailProps) {
  const [timeframe, setTimeframe] = useState(7);
  const { toast } = useToast();
  const { currency } = useMarketStore();

  const handleAIAnalysis = () => {
    toast({
      title: "AI Analysis",
      description: `Analyzing ${name} (${symbol}) stock data...`,
    });
  };

  const generateMockData = () => {
    const multiplier = currency === 'USD' ? 1 : 82;
    const basePrice = 100 * multiplier;
    const now = Date.now();
    const interval = (timeframe * 24 * 60 * 60 * 1000) / 100;
    
    return Array.from({ length: 100 }, (_, i) => ({
      date: now - (timeframe * 24 * 60 * 60 * 1000) + (i * interval),
      price: basePrice + (Math.random() - 0.5) * 20 * multiplier,
    }));
  };

  const chartData = generateMockData();

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

  const calculatePriceChange = () => {
    if (chartData.length < 2) return { change: 0, percentage: 0 };
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    return { change, percentage };
  };

  const { change, percentage } = calculatePriceChange();
  const isPriceUp = percentage >= 0;
  const currentPrice = chartData[chartData.length - 1]?.price || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="neo-brutal-button px-4 py-2 rounded-lg flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="flex gap-2">
          <Button
            variant={timeframe === 1 ? "default" : "outline"}
            onClick={() => setTimeframe(1)}
          >
            1D
          </Button>
          <Button
            variant={timeframe === 7 ? "default" : "outline"}
            onClick={() => setTimeframe(7)}
          >
            7D
          </Button>
          <Button
            variant={timeframe === 30 ? "default" : "outline"}
            onClick={() => setTimeframe(30)}
          >
            1M
          </Button>
          <Button
            variant={timeframe === 365 ? "default" : "outline"}
            onClick={() => setTimeframe(365)}
          >
            1Y
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockPriceChart
          chartData={chartData}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          isPriceUp={isPriceUp}
          percentage={percentage}
          currentPrice={currentPrice}
          name={name}
        />

        <div className="space-y-4">
          <StockStatistics
            timeframe={timeframe}
            currentPrice={formatCurrency(currentPrice)}
            priceChange={formatCurrency(Math.abs(change))}
            percentage={percentage}
            lowestPrice={formatCurrency(Math.min(...chartData.map(d => d.price)))}
            highestPrice={formatCurrency(Math.max(...chartData.map(d => d.price)))}
            isPriceUp={isPriceUp}
          />

          <TechnicalIndicators
            rsi={65.42}
            macd="Bullish"
            movingAverage={formatCurrency(95)}
          />

          <Button className="w-full" onClick={handleAIAnalysis}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
