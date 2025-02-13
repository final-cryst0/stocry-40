
import { ArrowLeft } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { Button } from "./ui/button";

interface StockDetailProps {
  symbol: string;
  name: string;
  onBack: () => void;
}

export function StockDetail({ symbol, name, onBack }: StockDetailProps) {
  const [timeframe, setTimeframe] = useState(7);

  // Mock data for demonstration
  const mockData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    price: Math.random() * 1000 + 500,
  }));

  const chartData = mockData.slice(-timeframe);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="neo-brutal-button px-4 py-2 rounded-lg flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="flex gap-2">
          <Button
            variant={timeframe === 7 ? "default" : "outline"}
            onClick={() => setTimeframe(7)}
          >
            7D
          </Button>
          <Button
            variant={timeframe === 14 ? "default" : "outline"}
            onClick={() => setTimeframe(14)}
          >
            14D
          </Button>
          <Button
            variant={timeframe === 30 ? "default" : "outline"}
            onClick={() => setTimeframe(30)}
          >
            30D
          </Button>
        </div>
      </div>

      <div className="neo-brutal-card p-6">
        <h2 className="text-2xl font-bold mb-6">{name} Price Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
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
      </div>
    </div>
  );
}
