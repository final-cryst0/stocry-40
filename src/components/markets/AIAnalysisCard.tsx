
import { useState } from "react";
import { ArrowRight, ArrowLeft, Brain, Sparkles, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIAnalysisResult } from "./AIAnalysisResult";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import jsPDF from 'jspdf';

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
    if (!result.outputs || !result.outputs["out-0"]) {
      throw new Error("Invalid API response format");
    }
    return result;
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
        setAnalysisResult(response.outputs["out-0"]);
        onAnalysis('technical', symbol.toUpperCase());
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch analysis. Please try again.",
          variant: "destructive",
        });
        setAnalysisResult("No analysis available");
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

  const formatAnalysisText = (text: string) => {
    return text.split('*').map((part, index) => 
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const disclaimer = "Disclaimer: This analysis is generated by AI and may contain errors or inaccuracies. Please use this information as one of many data points in your research process.";
    
    // Set title
    pdf.setFontSize(16);
    pdf.text(`Analysis Report for ${activeAnalysis.symbol}`, 20, 20);
    
    // Add timestamp
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    
    // Add analysis content
    pdf.setFontSize(12);
    const formattedText = analysisResult.replace(/\*/g, ''); // Remove asterisks
    const splitText = pdf.splitTextToSize(formattedText, 170); // Wrap text
    pdf.text(splitText, 20, 50);
    
    // Add disclaimer at the bottom
    pdf.setFontSize(10);
    const disclaimerText = pdf.splitTextToSize(disclaimer, 170);
    pdf.text(disclaimerText, 20, pdf.internal.pageSize.height - 30);
    
    // Save the PDF
    pdf.save(`${activeAnalysis.symbol}_analysis.pdf`);

    toast({
      title: "Success",
      description: "Analysis report downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full hover:shadow-lg transition-shadow">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Brain className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold group">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 hover:to-primary transition-colors duration-300">
                Analysis with AI
              </span>
            </CardTitle>
          </div>
          <CardDescription className="mt-2 max-w-2xl mx-auto group">
            <span className="transition-opacity duration-300 group-hover:opacity-90">
              Unlock deep market insights with our AI that analyzes patterns, trends, and market sentiment.
              <br className="my-2" />
              Get real-time predictions and comprehensive analysis for both crypto and stocks.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {showSymbolInput ? (
            <form onSubmit={handleSymbolSubmit} className="space-y-4 w-full max-w-2xl">
              <div className="flex flex-col space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Enter Crypto or Stock to Analyze"
                    className="flex-1"
                  />
                  <Button type="submit" className="gap-2 bg-background text-foreground hover:bg-accent border">
                    <Sparkles className="w-4 h-4" />
                    Generate AI Analysis
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4 w-full max-w-2xl">
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
                  <>
                    <div className="whitespace-pre-wrap break-words mb-4">
                      {formatAnalysisText(analysisResult)}
                    </div>
                    <Alert className="mb-4">
                      <AlertDescription>
                        Disclaimer: This analysis is generated by AI and may contain errors or inaccuracies. 
                        Please use this information as one of many data points in your research process.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      onClick={downloadPDF}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                      Download Analysis as PDF
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
