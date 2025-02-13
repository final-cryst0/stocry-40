
import { DollarSign, BarChart3, Briefcase } from "lucide-react";
import { MarketOverviewCard } from "./MarketOverviewCard";
import { AIAnalysisCard } from "./AIAnalysisCard";

interface MarketOverviewProps {
  onAIAnalysis: (type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock', symbol: string) => void;
}

export function MarketOverview({ onAIAnalysis }: MarketOverviewProps) {
  return (
    <div className="grid gap-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MarketOverviewCard
          title="Market Cap"
          value="$2.4T"
          change="+12.5% from last month"
          Icon={DollarSign}
        />
        <MarketOverviewCard
          title="24h Volume"
          value="$84.2B"
          change="+5.2% from yesterday"
          Icon={BarChart3}
        />
        <MarketOverviewCard
          title="Active Pairs"
          value="2,846"
          change="+123 new pairs"
          Icon={Briefcase}
        />
      </div>
      <AIAnalysisCard onAnalysis={onAIAnalysis} />
    </div>
  );
}
