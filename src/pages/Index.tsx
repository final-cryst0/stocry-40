
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CryptoCard } from "@/components/CryptoCard";
import { CryptoDetail } from "@/components/CryptoDetail";
import { useMarketData } from "@/services/cryptoApi";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const { data: cryptoData, isLoading, error } = useMarketData();
  const { toast } = useToast();

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch crypto data. Please try again later.",
    });
  }

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
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <CryptoCard
                  key={index}
                  symbol=""
                  name=""
                  price={0}
                  change={0}
                  marketCap={0}
                  onClick={() => {}}
                  isLoading={true}
                />
              ))
            ) : (
              cryptoData?.map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  symbol={crypto.symbol}
                  name={crypto.name}
                  price={crypto.current_price}
                  change={crypto.price_change_percentage_24h}
                  marketCap={crypto.market_cap}
                  onClick={() => setSelectedCrypto(crypto.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
