
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Info, TrendingUp, Sparkles } from "lucide-react";
import { useMarketStore } from "@/stores/marketStore";

interface StockStatsProps {
  timeframe: number;
  currentPrice: string;
  priceChange: string;
  percentage: number;
  lowestPrice: string;
  highestPrice: string;
  isPriceUp: boolean;
  onAIAnalysis: () => void;
}

export function StockStats({
  timeframe,
  currentPrice,
  priceChange,
  percentage,
  lowestPrice,
  highestPrice,
  isPriceUp,
  onAIAnalysis
}: StockStatsProps) {
  const { currency } = useMarketStore();
  
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(currency === 'USD' ? numericValue / 83.12 : numericValue);
  };

  return (
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
              <p className="text-lg font-bold">{formatCurrency(currentPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price Change</p>
              <p className={`text-lg font-bold ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(priceChange)} ({percentage.toFixed(2)}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lowest Price</p>
              <p className="text-lg font-bold">{formatCurrency(lowestPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Highest Price</p>
              <p className="text-lg font-bold">{formatCurrency(highestPrice)}</p>
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
              <span className="font-medium">{formatCurrency("48637.21")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">24h High</span>
              <span className="font-medium">{formatCurrency("52142.95")}</span>
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

      <Button className="w-full" onClick={onAIAnalysis}>
        <Sparkles className="w-4 h-4 mr-2" />
        Generate AI Analysis
      </Button>
    </div>
  );
}
