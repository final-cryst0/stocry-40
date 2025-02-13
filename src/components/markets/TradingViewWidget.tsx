
import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  isStock?: boolean;
}

export function TradingViewWidget({ symbol, isStock = false }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView && container.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: isStock ? `NSE:${symbol}` : `BINANCE:${symbol}`,
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "in",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [symbol, isStock]);

  return (
    <div 
      id={`tradingview_${symbol}`}
      ref={container}
      className="h-[400px] w-full rounded-xl border-2 border-border overflow-hidden"
    />
  );
}
