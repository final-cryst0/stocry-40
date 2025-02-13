
import { Header } from "@/components/markets/Header";
import { MarketOverview } from "@/components/markets/MarketOverview";
import { MarketTabs } from "@/components/markets/MarketTabs";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Market() {
  const { toast } = useToast();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleAIAnalysis = (type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock', symbol: string) => {
    toast({
      title: "AI Analysis Started",
      description: `Running ${type} analysis for ${symbol}...`,
    });
  };

  return (
    <div className="container py-10 max-w-7xl">
      <Header />
      <MarketOverview onAIAnalysis={handleAIAnalysis} />
      <MarketTabs defaultValue="crypto">
        <TabsContent value="crypto">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Cryptocurrency Market</h2>
            {/* Crypto market content will go here */}
          </div>
        </TabsContent>
        <TabsContent value="stocks">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Stock Market</h2>
            {/* Stock market content will go here */}
          </div>
        </TabsContent>
      </MarketTabs>
    </div>
  );
}
