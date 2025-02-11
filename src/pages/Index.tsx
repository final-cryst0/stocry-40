
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CryptoCard } from "@/components/CryptoCard";
import { CryptoDetail } from "@/components/CryptoDetail";

// Temporary data for demonstration
const cryptoData = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 4582947.23,
    change: -2.5,
    marketCap: 8923456789.12,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 234567.89,
    change: 1.8,
    marketCap: 4567890123.45,
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    price: 34567.89,
    change: -0.5,
    marketCap: 2345678901.23,
  },
  // Add more cryptocurrencies as needed
];

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Crypto Assets</h1>
          <ThemeToggle />
        </header>

        {selectedCrypto ? (
          <CryptoDetail
            symbol={selectedCrypto}
            onBack={() => setSelectedCrypto(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptoData.map((crypto) => (
              <CryptoCard
                key={crypto.symbol}
                {...crypto}
                onClick={() => setSelectedCrypto(crypto.symbol)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
