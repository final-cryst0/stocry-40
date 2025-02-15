
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewWidgetProps {
  symbol: string;
  isStock?: boolean;
}

export function TradingViewWidget({ symbol, isStock = false }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbol) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView && container.current) {
        const config = {
          width: "100%",
          height: "600",
          autosize: false,
          symbol: isStock ? `BSE:${symbol}` : `BINANCE:${symbol}USDT`,
          interval: "1",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          container_id: container.current.id,
          withdateranges: true,
          details: true,
          calendar: true,
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
        };

        new window.TradingView.widget(config);
      }
    };

    // Add script to document
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [symbol, isStock]);

  if (!symbol) return null;

  return (
    <div 
      id={`tradingview_${symbol}`}
      ref={container}
      className="h-[600px] w-full rounded-xl border-2 border-border overflow-hidden bg-background"
    />
  );
}
