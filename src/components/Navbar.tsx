
import { BarChart2, Heart, Newspaper, Search, DollarSign, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMarketStore } from "@/stores/marketStore";

interface NavbarProps {
  onCurrencyChange?: (currency: 'INR' | 'USD') => void;
}

export function Navbar({ onCurrencyChange }: NavbarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const { currency } = useMarketStore();

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-6">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary">
              <BarChart2 className="h-5 w-5" />
              <span>Market</span>
            </Link>
            <Link to="/favorites" className="flex items-center gap-2 text-foreground hover:text-primary">
              <Heart className="h-5 w-5" />
              <span>Favorites</span>
            </Link>
            <Link to="/news" className="flex items-center gap-2 text-foreground hover:text-primary">
              <Newspaper className="h-5 w-5" />
              <span>News</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search markets..."
                  className="w-[200px] sm:w-[300px]"
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCurrencyChange?.(currency === "INR" ? "USD" : "INR")}
              className="flex items-center gap-2"
            >
              {currency === "INR" ? (
                <IndianRupee className="h-4 w-4" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              <span>{currency}</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
