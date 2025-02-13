
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketOverviewCardProps {
  title: string;
  value: string;
  change: string;
  Icon: LucideIcon;
}

export function MarketOverviewCard({ title, value, change, Icon }: MarketOverviewCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{change}</p>
      </CardContent>
    </Card>
  );
}
