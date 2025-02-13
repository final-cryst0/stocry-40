
import { ArrowLeft, Sparkles, TrendingUp, DollarSign, BarChart3, Globe, Info } from "lucide-react";
import { useHistoricalData } from "@/services/cryptoApi";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CryptoDetailProps {
  symbol: string;
  name: string;
  onBack: () => void;
}

export function CryptoDetail({ symbol, name, onBack }: CryptoDetailProps) {
  const [timeframe, setTimeframe] = useState(7);
  const { data, isLoading, error } = useHistoricalData(symbol, timeframe);
  const { toast } = useToast();

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

  const chartData = data?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: price,
  }));

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
          <h2 className="text-2xl font-bold mb-6">{name} Price Chart</h2>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-bold">$952.4B</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume (24h)</p>
                  <p className="text-lg font-bold">$28.4B</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Circulating Supply</p>
                  <p className="text-lg font-bold">19.6M</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Supply</p>
                  <p className="text-lg font-bold">21.0M</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Price Statistics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">24h Low</span>
                  <span className="font-medium">$48,637.21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">24h High</span>
                  <span className="font-medium">$52,142.95</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">7d Change</span>
                  <span className="font-medium text-green-500">+5.23%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Market Indicators</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fear & Greed Index</span>
                  <span className="font-medium">75 (Greed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volatility</span>
                  <span className="font-medium">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dominance</span>
                  <span className="font-medium">42.3%</span>
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
