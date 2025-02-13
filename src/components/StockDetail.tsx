
import { ArrowLeft } from "lucide-react";
import { TradingViewWidget } from "./markets/TradingViewWidget";

interface StockDetailProps {
  symbol: string;
  name: string;
  onBack: () => void;
}

export function StockDetail({ symbol, name, onBack }: StockDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="neo-brutal-button px-4 py-2 rounded-lg flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TradingViewWidget symbol={symbol} isStock={true} />
      </div>
    </div>
  );
}
