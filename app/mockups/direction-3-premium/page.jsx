import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function DirectionOverview() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Direction 3 — Premium</h1>

      {[
        "store",
        "product",
        "checkout",
        "dashboard/creator",
        "dashboard/admin",
      ].map((route) => (
        <Card key={route}>
          <CardContent className="p-4">
            <Link href={`/mockups/direction-3-premium/${route}`}>
              {route.replace("-", " ")}
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
