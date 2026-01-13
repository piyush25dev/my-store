import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function ProductMarketplace() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Instagram Hooks Pack</h1>
          <p className="text-muted-foreground">
            High-performing hooks for Reels & Shorts
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="h-56 bg-muted rounded" />

          <div className="flex items-center gap-2">
            <span className="line-through text-muted-foreground">
              ₹599
            </span>
            <span className="text-lg font-bold">₹399</span>
            <Badge>33% OFF</Badge>
          </div>

          <Separator />

          {/* Variants */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Format</p>
            <Button variant="outline" size="sm">
              PDF
            </Button>
            <Button variant="outline" size="sm">
              Notion
            </Button>
          </div>

          <Button className="w-full">Buy Now</Button>

          {/* Out of Stock Example */}
          <Alert>
            <AlertDescription>
              This product may go out of stock soon.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
