
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CryptoCard } from "@/components/CryptoCard";
import { CryptoDetail } from "@/components/CryptoDetail";
import { useMarketData, useStockData } from "@/services/cryptoApi";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const { data: cryptoData, isLoading: cryptoLoading, error: cryptoError } = useMarketData();
  const { data: stockData, isLoading: stockLoading, error: stockError } = useStockData();
  const { toast } = useToast();

  if (cryptoError || stockError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch market data. Please try again later.",
    });
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Explore the Markets</h1>
          <p className="text-muted-foreground mt-2">
            Track real-time prices of top cryptocurrencies and stocks
          </p>
        </header>

        {selectedCrypto ? (
          <CryptoDetail
            symbol={selectedCrypto}
            onBack={() => setSelectedCrypto(null)}
          />
        ) : (
          <Tabs defaultValue="crypto" className="space-y-4">
            <TabsList>
              <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
            </TabsList>

            <TabsContent value="crypto">
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                      <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                      <TableHead className="text-right">Favorite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cryptoLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
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
                              <div className="h-4 w-8 bg-muted rounded animate-pulse ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      : cryptoData?.map((crypto) => (
                          <TableRow
                            key={crypto.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedCrypto(crypto.id)}
                          >
                            <TableCell className="font-medium">
                              {crypto.name} ({crypto.symbol.toUpperCase()})
                            </TableCell>
                            <TableCell>{formatNumber(crypto.current_price)}</TableCell>
                            <TableCell
                              className={crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}
                            >
                              {crypto.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatNumber(crypto.market_cap)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatNumber(crypto.total_volume)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Heart className="ml-auto h-4 w-4 hover:fill-current hover:text-red-500 transition-colors" />
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
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                      <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                      <TableHead className="text-right">Favorite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
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
                              <div className="h-4 w-8 bg-muted rounded animate-pulse ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      : stockData?.map((stock) => (
                          <TableRow key={stock.id}>
                            <TableCell className="font-medium">
                              {stock.name} ({stock.symbol})
                            </TableCell>
                            <TableCell>{formatNumber(stock.current_price)}</TableCell>
                            <TableCell
                              className={stock.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}
                            >
                              {stock.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatNumber(stock.market_cap)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatNumber(stock.total_volume)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Heart className="ml-auto h-4 w-4 hover:fill-current hover:text-red-500 transition-colors" />
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
