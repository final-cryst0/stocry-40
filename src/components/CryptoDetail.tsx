
import { ArrowLeft } from "lucide-react";

interface CryptoDetailProps {
  symbol: string;
  onBack: () => void;
}

export function CryptoDetail({ symbol, onBack }: CryptoDetailProps) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="neo-brutal-button px-4 py-2 rounded-lg flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>
      <div className="neo-brutal-card p-4">
        <h2 className="text-2xl font-bold mb-4">{symbol} Price Chart</h2>
        <div className="chart-container" id={`tradingview_${symbol}`}>
          <div
            id="technical-analysis"
            className="w-full h-full"
          />
        </div>
      </div>
      <button className="neo-brutal-button px-4 py-2 rounded-lg w-full">
        Generate AI Analysis
      </button>
    </div>
  );
}
