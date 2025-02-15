
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
          symbol: isStock ? `BSE:${symbol}` : `BINANCE:${symbol}USDT`,
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          studies: [
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies"
          ],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          withdateranges: true,
          allow_symbol_change: true,
          details: true,
          hotlist: true,
          calendar: true,
          width: "100%",
          height: "600"
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [symbol, isStock]);

  return (
    <div 
      id={`tradingview_${symbol}`}
      ref={container}
      className="h-[600px] w-full rounded-xl border-2 border-border overflow-hidden bg-background"
    />
  );
}
