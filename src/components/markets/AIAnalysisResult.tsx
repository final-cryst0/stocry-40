
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, MessageCircle, LineChart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AIAnalysisResultProps {
  type: 'technical' | 'sentiment' | 'prediction';
  symbol: string;
  onBack: () => void;
}

export function AIAnalysisResult({ type, symbol, onBack }: AIAnalysisResultProps) {
  const { toast } = useToast();

  const getAnalysis = (type: string) => {
    switch (type) {
      case 'technical':
        return {
          title: "Technical Analysis",
          icon: <LineChart className="h-6 w-6" />,
          data: [
            { label: "Trend", value: "Bullish" },
            { label: "Support", value: "$45,000" },
            { label: "Resistance", value: "$48,000" },
            { label: "RSI", value: "65 (Neutral)" },
            { label: "MACD", value: "Bullish Crossover" }
          ]
        };
      case 'sentiment':
        return {
          title: "Sentiment Analysis",
          icon: <MessageCircle className="h-6 w-6" />,
          data: [
            { label: "Overall Sentiment", value: "Positive" },
            { label: "Social Media Score", value: "7.5/10" },
            { label: "News Sentiment", value: "Bullish" },
            { label: "Community Outlook", value: "Optimistic" },
            { label: "Market Fear & Greed", value: "65 (Greed)" }
          ]
        };
      case 'prediction':
        return {
          title: "Price Predictions",
          icon: <TrendingUp className="h-6 w-6" />,
          data: [
            { label: "24h Forecast", value: "$47,500" },
            { label: "7d Forecast", value: "$49,000" },
            { label: "30d Forecast", value: "$52,000" },
            { label: "Confidence Level", value: "85%" },
            { label: "Volatility Risk", value: "Medium" }
          ]
        };
      default:
        return {
          title: "Analysis",
          icon: <Brain className="h-6 w-6" />,
          data: []
        };
    }
  };

  const analysis = getAnalysis(type);

  return (
    <Card className="w-full bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <CardTitle className="flex items-center gap-2">
          {analysis.icon}
          {analysis.title} for {symbol}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {analysis.data.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-lg font-medium text-muted-foreground">{item.label}</span>
              <span className="text-lg font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
