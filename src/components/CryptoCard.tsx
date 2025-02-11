
import { ArrowDown, ArrowUp } from "lucide-react";

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  onClick: () => void;
  isLoading?: boolean;
}

export function CryptoCard({
  symbol,
  name,
  price,
  change,
  marketCap,
  onClick,
  isLoading = false,
}: CryptoCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="neo-brutal-card p-4 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-6 w-16 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded mt-2" />
          </div>
          <div className="h-6 w-16 bg-muted rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="neo-brutal-card p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{symbol.toUpperCase()}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className={`flex items-center ${change >= 0 ? "text-accent" : "text-destructive"}`}>
          {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="ml-1">{Math.abs(change).toFixed(2)}%</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold">{formatNumber(price)}</p>
        <p className="text-sm text-muted-foreground">
          Market Cap: {formatNumber(marketCap)}
        </p>
      </div>
    </div>
  );
}
