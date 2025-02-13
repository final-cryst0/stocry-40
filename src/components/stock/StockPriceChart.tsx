
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, BarChart3, Activity } from "lucide-react";

interface StockPriceChartProps {
  chartData: Array<{ date: number; price: number }>;
  formatDate: (timestamp: number) => string;
  formatCurrency: (value: number) => string;
  isPriceUp: boolean;
  percentage: number;
  currentPrice: number;
  name: string;
}

export function StockPriceChart({
  chartData,
  formatDate,
  formatCurrency,
  isPriceUp,
  percentage,
  currentPrice,
  name
}: StockPriceChartProps) {
  // Calculate market statistics
  const marketCap = currentPrice * 1000000; // Example multiplier
  const volume = currentPrice * 50000; // Example multiplier
  const activePairs = Math.floor(Math.random() * 1000) + 2000; // Random number for demo

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold">{formatCurrency(marketCap)}</p>
                <p className={`text-sm ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                  +12.5% from last month
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(volume)}</p>
                <p className="text-sm text-green-500">
                  +5.2% from yesterday
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Pairs</p>
                <p className="text-2xl font-bold">{activePairs}</p>
                <p className="text-sm text-green-500">
                  +123 new pairs
                </p>
              </div>
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="neo-brutal-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{name} Price Chart</h2>
          <div className="text-right">
            <p className="text-lg font-semibold">
              {formatCurrency(currentPrice)}
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
    </div>
  );
}
