
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useMarketData, useStockData } from "@/services/cryptoApi";
import { useMarketStore } from "@/stores/marketStore";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favorites } = useMarketStore();
  const { data: cryptoData, isLoading: cryptoLoading } = useMarketData();
  const { data: stockData, isLoading: stockLoading } = useStockData();
  const { toast } = useToast();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  const favoriteItems = [
    ...(cryptoData?.filter((crypto) => favorites.includes(crypto.id)) || []),
    ...(stockData?.filter((stock) => favorites.includes(stock.id)) || []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Your Favorites</h1>
          <p className="text-muted-foreground mt-2">
            Track your favorite cryptocurrencies and stocks
          </p>
        </header>

        {favoriteItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground">
              Add some cryptocurrencies or stocks to your favorites to see them here
            </p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                  <TableHead className="hidden md:table-cell">Volume (24h)</TableHead>
                  <TableHead className="text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {favoriteItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name} ({item.symbol.toUpperCase()})
                    </TableCell>
                    <TableCell>{formatNumber(item.current_price)}</TableCell>
                    <TableCell
                      className={item.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}
                    >
                      {item.price_change_percentage_24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatNumber(item.market_cap)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatNumber(item.total_volume)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Heart
                        className="ml-auto h-4 w-4 fill-current text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                        onClick={() => {
                          useMarketStore.getState().removeFavorite(item.id);
                          toast({
                            description: `${item.name} removed from favorites`,
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
