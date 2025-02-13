
import { Heart, Sparkles } from "lucide-react";
import { useMarketStore } from "@/stores/marketStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StocksListProps {
  stockData: any[];
  stockLoading: boolean;
  onSelectStock: (id: string, name: string) => void;
  formatNumber: (num: number) => string;
  onAIAnalysis: (type: 'stock', symbol: string) => void;
}

export function StocksList({ 
  stockData, 
  stockLoading, 
  onSelectStock,
  formatNumber,
  onAIAnalysis 
}: StocksListProps) {
  const { favorites, addFavorite, removeFavorite } = useMarketStore();
  const { toast } = useToast();

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

  return (
    <div className="rounded-xl border bg-card shadow-lg">
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
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectStock(stock.id, stock.name)}
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAIAnalysis('stock', stock.symbol);
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
  );
}
