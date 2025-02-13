
import { DollarSign, BarChart2, Briefcase } from "lucide-react";
import { MarketOverviewCard } from "./MarketOverviewCard";
import { AIAnalysisCard } from "./AIAnalysisCard";

interface MarketOverviewProps {
  onAIAnalysis: (type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock', symbol: string) => void;
}

export function MarketOverview({ onAIAnalysis }: MarketOverviewProps) {
  return (
    <div className="grid gap-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-[6px_6px_0_rgb(0_0_0/0.3)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">$2.4T</p>
          <p className="text-sm text-green-500">+12.5% from last month</p>
        </div>
        
        <div className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-[6px_6px_0_rgb(0_0_0/0.3)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">24h Volume</h3>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">$84.2B</p>
          <p className="text-sm text-green-500">+5.2% from yesterday</p>
        </div>
        
        <div className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-[6px_6px_0_rgb(0_0_0/0.3)]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active Pairs</h3>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">2,846</p>
          <p className="text-sm text-green-500">+123 new pairs</p>
        </div>
      </div>

      <div className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-[6px_6px_0_rgb(0_0_0/0.3)]">
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-lg">✨</span> Future Analysis using AI
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Our advanced AI system analyzes market trends, technical indicators, and sentiment data to provide insights and predictions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Technical Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Advanced pattern recognition and indicator analysis for better trading decisions.
            </p>
            <button 
              onClick={() => onAIAnalysis('technical', 'global')}
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Analyze Patterns
            </button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Real-time analysis of market sentiment from social media and news sources.
            </p>
            <button 
              onClick={() => onAIAnalysis('sentiment', 'global')}
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Check Sentiment
            </button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Price Predictions</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered price predictions based on historical data and market conditions.
            </p>
            <button 
              onClick={() => onAIAnalysis('prediction', 'global')}
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View Predictions
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-[6px_6px_0_rgb(0_0_0/0.3)]">
            <h3 className="font-semibold mb-2">Bitcoin Surges Past Previous Highs</h3>
            <p className="text-sm text-muted-foreground mb-4">Bitcoin reaches new heights as institutional adoption increases.</p>
            <button className="text-primary hover:underline">Read more</button>
          </div>
          
          <div className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-[6px_6px_0_rgb(0_0_0/0.3)]">
            <h3 className="font-semibold mb-2">Ethereum 2.0 Development Progress</h3>
            <p className="text-sm text-muted-foreground mb-4">Latest updates on Ethereum's transition to proof-of-stake.</p>
            <button className="text-primary hover:underline">Read more</button>
          </div>
          
          <div className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm shadow-[6px_6px_0_rgb(0_0_0/0.3)]">
            <h3 className="font-semibold mb-2">Cryptocurrency Market Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">Weekly overview of major cryptocurrency movements and trends.</p>
            <button className="text-primary hover:underline">Read more</button>
          </div>
        </div>
      </div>
    </div>
  );
}
