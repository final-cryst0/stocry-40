
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
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
  const [showSymbolInput, setShowSymbolInput] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const queryStackAI = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.stack-ai.com/inference/v0/run/29b2f1c6-2e20-4afb-83c8-afa5afe73a1c/67b85058e1500b3f2d600b8a",
        {
          headers: {
            'Authorization': 'Bearer 59f6ba42-bde8-4bc2-8812-d764fd3eb299',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analysis. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSymbolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol) {
      setShowSymbolInput(false);
      setActiveAnalysis({ type: 'technical', symbol: symbol.toUpperCase() });
      try {
        setLoading(true);
        const response = await queryStackAI({
          "user_id": "user_analysis",
          "in-0": `give analysis of ${symbol} stock`
        });
        setAnalysisResult(response["out-0"] || "Analysis not available");
        onAnalysis('technical', symbol.toUpperCase());
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveAnalysis({ type: null, symbol: '' });
    setShowSymbolInput(true);
    setSymbol('');
    setAnalysisResult('');
  };

  return (
    <div className="space-y-6">
      <Card className="w-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
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
                  Enter symbol...
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
          ) : (
            <div className="space-y-4">
              <Button variant="outline" onClick={handleBack} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-semibold mb-2">Analysis for {activeAnalysis.symbol}</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{analysisResult}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
