
import { useState } from "react";
import { Brain, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIAnalysisResult } from "./AIAnalysisResult";
import { useToast } from "@/components/ui/use-toast";

interface AIFeature {
  title: string;
  description: string;
  type: 'technical' | 'sentiment' | 'prediction';
}

interface AIAnalysisCardProps {
  onAnalysis: (type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock', symbol: string) => void;
}

export function AIAnalysisCard({ onAnalysis }: AIAnalysisCardProps) {
  const [activeAnalysis, setActiveAnalysis] = useState<{
    type: 'technical' | 'sentiment' | 'prediction' | null;
    symbol: string;
  }>({ type: null, symbol: '' });
  const [showCryptoInput, setShowCryptoInput] = useState(false);
  const [cryptoSymbol, setCryptoSymbol] = useState('');
  const { toast } = useToast();

  const features: AIFeature[] = [
    {
      title: "Technical Analysis",
      description: "Advanced pattern recognition and indicator analysis for better trading decisions.",
      type: "technical"
    },
    {
      title: "Sentiment Analysis",
      description: "Real-time analysis of market sentiment from social media and news sources.",
      type: "sentiment"
    },
    {
      title: "Price Predictions",
      description: "AI-powered price predictions based on historical data and market conditions.",
      type: "prediction"
    }
  ];

  const handleAnalysisClick = (type: 'technical' | 'sentiment' | 'prediction') => {
    if (type === 'technical') {
      setShowCryptoInput(true);
    } else {
      setActiveAnalysis({ type, symbol: 'BTC' });
      onAnalysis(type, 'BTC');
    }
  };

  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cryptoSymbol) {
      setShowCryptoInput(false);
      setActiveAnalysis({ type: 'technical', symbol: cryptoSymbol.toUpperCase() });
      onAnalysis('technical', cryptoSymbol.toUpperCase());
    }
  };

  const handleBack = () => {
    setActiveAnalysis({ type: null, symbol: '' });
    setShowCryptoInput(false);
    setCryptoSymbol('');
  };

  return (
    <div className="space-y-6">
      <Card className="w-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Future Analysis using AI
          </CardTitle>
          <CardDescription>
            Our advanced AI system analyzes market trends, technical indicators, and sentiment data to provide insights and predictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showCryptoInput ? (
            <form onSubmit={handleCryptoSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="cryptoSymbol" className="text-sm font-medium">
                  Enter Cryptocurrency Symbol (e.g., BTC, ETH)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="cryptoSymbol"
                    value={cryptoSymbol}
                    onChange={(e) => setCryptoSymbol(e.target.value)}
                    placeholder="Enter symbol..."
                    className="flex-1"
                  />
                  <Button type="submit">Analyze</Button>
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                </div>
              </div>
            </form>
          ) : activeAnalysis.type ? (
            <AIAnalysisResult 
              type={activeAnalysis.type} 
              symbol={activeAnalysis.symbol}
              onBack={handleBack}
            />
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature.type} className="flex flex-col gap-2">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <Button 
                    variant="outline" 
                    className="mt-2" 
                    onClick={() => handleAnalysisClick(feature.type)}
                  >
                    {feature.title === "Technical Analysis" ? "Analyze Patterns" :
                    feature.title === "Sentiment Analysis" ? "Check Sentiment" :
                    "View Predictions"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
