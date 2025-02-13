
import { ArrowLeft, Sparkles, TrendingUp, DollarSign, BarChart3, Globe, Info } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useMarketStore } from "@/stores/marketStore";

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

  // Mock data generation with currency conversion
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

  // Calculate price change
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
        <div className="neo-brutal-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{name} Stock Price</h2>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {formatCurrency(chartData[chartData.length - 1]?.price || 0)}
              </p>
              <p className={`text-sm ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                {isPriceUp ? '+' : ''}{percentage.toFixed(2)}%
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip 
                labelFormatter={formatDate}
                formatter={(value: number) => [formatCurrency(value), 'Price']}
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  color: '#fff',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPriceUp ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: isPriceUp ? '#10B981' : '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {timeframe}D Statistics
              </CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(chartData[chartData.length - 1]?.price || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price Change</p>
                  <p className={`text-lg font-bold ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(Math.abs(change))} ({percentage.toFixed(2)}%)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lowest Price</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(Math.min(...chartData.map(d => d.price)))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Highest Price</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(Math.max(...chartData.map(d => d.price)))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-bold">{formatCurrency(1000000000)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume (24h)</p>
                  <p className="text-lg font-bold">{formatCurrency(50000000)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">P/E Ratio</p>
                  <p className="text-lg font-bold">24.5</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">52W Range</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(80)} - {formatCurrency(120)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Technical Indicators</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">RSI (14)</span>
                  <span className="font-medium">65.42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">MACD</span>
                  <span className="font-medium text-green-500">Bullish</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">20-Day MA</span>
                  <span className="font-medium">{formatCurrency(95)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={handleAIAnalysis}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
