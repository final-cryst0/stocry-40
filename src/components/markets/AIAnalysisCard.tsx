
import { useState } from "react";
import { Brain, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIAnalysisResult } from "./AIAnalysisResult";
import { useToast } from "@/components/ui/use-toast";

interface AIAnalysisCardProps {
  onAnalysis: (type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock', symbol: string) => void;
}

export function AIAnalysisCard({ onAnalysis }: AIAnalysisCardProps) {
  const [activeAnalysis, setActiveAnalysis] = useState<{
    type: 'technical' | 'sentiment' | 'prediction' | null;
    symbol: string;
  }>({ type: null, symbol: '' });
  const [showSymbolInput, setShowSymbolInput] = useState(false);
  const [symbol, setSymbol] = useState('');
  const { toast } = useToast();

  const handleAnalysisClick = () => {
    setShowSymbolInput(true);
  };

  const handleSymbolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol) {
      setShowSymbolInput(false);
      setActiveAnalysis({ type: 'technical', symbol: symbol.toUpperCase() });
      onAnalysis('technical', symbol.toUpperCase());
    }
  };

  const handleBack = () => {
    setActiveAnalysis({ type: null, symbol: '' });
    setShowSymbolInput(false);
    setSymbol('');
  };

  return (
    <div className="space-y-6">
      <Card className="w-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Analysis with AI
          </CardTitle>
          <CardDescription>
            Get comprehensive market analysis powered by our advanced AI system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSymbolInput ? (
            <form onSubmit={handleSymbolSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="symbol" className="text-sm font-medium">
                  Enter Symbol (e.g., BTC, RELIANCE)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
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
            <div className="flex justify-center">
              <Button 
                size="lg"
                className="w-full md:w-auto"
                onClick={handleAnalysisClick}
              >
                Analysis with AI <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
