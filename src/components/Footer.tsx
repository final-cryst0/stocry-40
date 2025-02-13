
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-sm text-muted-foreground">
              We provide real-time cryptocurrency and stock market data, helping you make informed investment decisions.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Markets</Link>
              </li>
              <li>
                <Link to="/favorites" className="text-sm text-muted-foreground hover:text-foreground">Favorites</Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-muted-foreground hover:text-foreground">News</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">API Documentation</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Market Data</a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: support@cryptomarket.com<br />
              Available 24/7
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CryptoMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
