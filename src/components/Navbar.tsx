
import { BarChart2, Heart, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
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
            <div className="text-sm text-muted-foreground">
              ETH Gas: <span className="text-foreground">0.87558316 Gwei</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
