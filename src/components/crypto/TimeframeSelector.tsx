
import { Button } from "@/components/ui/button";

interface TimeframeSelectorProps {
  timeframe: number;
  setTimeframe: (timeframe: number) => void;
}

export function TimeframeSelector({ timeframe, setTimeframe }: TimeframeSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={timeframe === 1 ? "default" : "outline"}
        onClick={() => setTimeframe(1)}
      >
        1D
      </Button>
      <Button
        variant={timeframe === 7 ? "default" : "outline"}
        onClick={() => setTimeframe(7)}
      >
        7D
      </Button>
      <Button
        variant={timeframe === 30 ? "default" : "outline"}
        onClick={() => setTimeframe(30)}
      >
        1M
      </Button>
      <Button
        variant={timeframe === 365 ? "default" : "outline"}
        onClick={() => setTimeframe(365)}
      >
        1Y
      </Button>
    </div>
  );
}
