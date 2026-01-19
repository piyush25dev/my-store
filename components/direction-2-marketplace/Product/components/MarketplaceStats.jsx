import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function MarketplaceStats() {
  const stats = [
    { label: "Sales", value: "1247" },
    { label: "Downloads", value: "2891" },
    { label: "Rating", value: "4.8", icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> },
    { label: "Last Updated", value: "2 days ago" },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Marketplace Stats</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-gray-600">{stat.label}</span>
            <div className="flex items-center gap-1">
              <span className="font-bold">{stat.value}</span>
              {stat.icon && stat.icon}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}