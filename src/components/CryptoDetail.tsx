
import { ArrowLeft } from "lucide-react";
import { useHistoricalData } from "@/services/cryptoApi";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface CryptoDetailProps {
  symbol: string;
  name: string;
  onBack: () => void;
}

export function CryptoDetail({ symbol, name, onBack }: CryptoDetailProps) {
  const [timeframe, setTimeframe] = useState(7);
  const { data, isLoading, error } = useHistoricalData(symbol, timeframe);
  const { toast } = useToast();

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

      <div className="neo-brutal-card p-6">
        <h2 className="text-2xl font-bold mb-6">{name} Price Chart</h2>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading...
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
