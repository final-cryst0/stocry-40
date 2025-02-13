
import { Brain, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIFeature {
  title: string;
  description: string;
  type: 'technical' | 'sentiment' | 'prediction';
}

interface AIAnalysisCardProps {
  onAnalysis: (type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock', symbol: string) => void;
}

export function AIAnalysisCard({ onAnalysis }: AIAnalysisCardProps) {
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

  return (
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
      <CardContent className="grid md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.type} className="flex flex-col gap-2">
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => onAnalysis(feature.type, 'global')}
            >
              {feature.title === "Technical Analysis" ? "Analyze Patterns" :
               feature.title === "Sentiment Analysis" ? "Check Sentiment" :
               "View Predictions"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
