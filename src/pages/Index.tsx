import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CryptoDetail } from "@/components/CryptoDetail";
import { StockDetail } from "@/components/StockDetail";
import { useMarketData, useStockData } from "@/services/cryptoApi";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Heart, Sparkles, TrendingUp, DollarSign, BarChart3, Briefcase, ArrowRight } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedCryptoName, setSelectedCryptoName] = useState<string>("");
  const [selectedStockName, setSelectedStockName] = useState<string>("");
  const { data: cryptoData, isLoading: cryptoLoading, error: cryptoError } = useMarketData();
  const { data: stockData, isLoading: stockLoading, error: stockError } = useStockData();
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
    // Here you would typically make an API call to your AI service
  };

  const renderMarketOverview = () => (
    <div className="grid gap-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">
              Market Cap
            </CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">$2.4T</div>
            <p className="text-sm text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">
              24h Volume
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">$84.2B</div>
            <p className="text-sm text-muted-foreground mt-1">+5.2% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">
              Active Pairs
            </CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2,846</div>
            <p className="text-sm text-muted-foreground mt-1">+123 new pairs</p>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Technical Analysis</h3>
            <p className="text-sm text-muted-foreground">Advanced pattern recognition and indicator analysis for better trading decisions.</p>
            <Button variant="outline" className="mt-2" onClick={() => handleAIAnalysis('technical', 'global')}>
              Analyze Patterns <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">Real-time analysis of market sentiment from social media and news sources.</p>
            <Button variant="outline" className="mt-2" onClick={() => handleAIAnalysis('sentiment', 'global')}>
              Check Sentiment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Price Predictions</h3>
            <p className="text-sm text-muted-foreground">AI-powered price predictions based on historical data and market conditions.</p>
            <Button variant="outline" className="mt-2" onClick={() => handleAIAnalysis('prediction', 'global')}>
              View Predictions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Explore the Markets</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track real-time prices of top cryptocurrencies and stocks, powered by advanced AI analysis
          </p>
        </header>

        {renderMarketOverview()}

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
