import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CryptoDetail } from "@/components/CryptoDetail";
import { StockDetail } from "@/components/StockDetail";
import { useMarketData, useStockData } from "@/services/cryptoApi";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketStore } from "@/stores/marketStore";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/markets/Header";
import { MarketOverview } from "@/components/markets/MarketOverview";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedCryptoName, setSelectedCryptoName] = useState<string>("");
  const [selectedStockName, setSelectedStockName] = useState<string>("");
  const { data: cryptoData, isLoading: cryptoLoading } = useMarketData();
  const { data: stockData, isLoading: stockLoading } = useStockData();
  const { toast } = useToast();
  
  const { 
    favorites, 
    addFavorite, 
    removeFavorite,
    currency,
    setCurrency 
  } = useMarketStore();

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      removeFavorite(id);
      toast({ description: "Removed from favorites" });
    } else {
      addFavorite(id);
      toast({ description: "Added to favorites" });
    }
  };

  const handleAIAnalysis = (type: 'technical' | 'sentiment' | 'prediction' | 'crypto' | 'stock', symbol: string) => {
    toast({
      title: "AI Analysis Initiated",
      description: `Analyzing ${type === 'crypto' ? 'cryptocurrency' : type === 'stock' ? 'stock' : 'market'} ${symbol === 'global' ? 'trends' : symbol}...`,
      duration: 3000,
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCurrencyChange={setCurrency} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Header />
        <MarketOverview onAIAnalysis={handleAIAnalysis} />

        {selectedCrypto ? (
          <CryptoDetail
            symbol={selectedCrypto}
            name={selectedCryptoName}
            onBack={() => setSelectedCrypto(null)}
          />
        ) : selectedStock ? (
          <StockDetail
            symbol={selectedStock}
            name={selectedStockName}
            onBack={() => setSelectedStock(null)}
          />
        ) : (
          <Tabs defaultValue="crypto" className="space-y-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
            </TabsList>

            <TabsContent value="crypto">
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>Favorite</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                      <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cryptoLoading
                      ? Array.from({ length: 20 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                            </TableCell>
                          </TableRow>
                        ))
                      : cryptoData?.map((crypto) => (
                          <TableRow
                            key={crypto.id}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedCrypto(crypto.id);
                              setSelectedCryptoName(crypto.name);
                            }}
                          >
                            <TableCell className="font-medium">
                              #{crypto.market_cap_rank}
                            </TableCell>
                            <TableCell>
                              <Heart 
                                className={`h-4 w-4 hover:text-red-500 transition-colors ${
                                  favorites.includes(crypto.id) ? "fill-current text-red-500" : ""
                                }`}
                                onClick={(e) => handleFavoriteClick(e, crypto.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
                              {crypto.name} ({crypto.symbol.toUpperCase()})
                            </TableCell>
                            <TableCell className="text-foreground">{formatNumber(crypto.current_price)}</TableCell>
                            <TableCell
                              className={crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}
                            >
                              {crypto.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-foreground">
                              {formatNumber(crypto.market_cap)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-foreground">
                              {formatNumber(crypto.total_volume)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAIAnalysis('crypto', crypto.symbol);
                                }}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                AI Analysis
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="stocks">
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>Favorite</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                      <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockLoading
                      ? Array.from({ length: 20 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                            </TableCell>
                          </TableRow>
                        ))
                      : stockData?.map((stock) => (
                          <TableRow
                            key={stock.id}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedStock(stock.id);
                              setSelectedStockName(stock.name);
                            }}
                          >
                            <TableCell className="font-medium">
                              #{stock.market_cap_rank}
                            </TableCell>
                            <TableCell>
                              <Heart 
                                className={`h-4 w-4 hover:text-red-500 transition-colors ${
                                  favorites.includes(stock.id) ? "fill-current text-red-500" : ""
                                }`}
                                onClick={(e) => handleFavoriteClick(e, stock.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
                              {stock.name} ({stock.symbol})
                            </TableCell>
                            <TableCell className="text-foreground">{formatNumber(stock.current_price)}</TableCell>
                            <TableCell
                              className={stock.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}
                            >
                              {stock.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-foreground">
                              {formatNumber(stock.market_cap)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-foreground">
                              {formatNumber(stock.total_volume)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAIAnalysis('stock', stock.symbol);
                                }}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                AI Analysis
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
