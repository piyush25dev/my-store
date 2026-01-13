import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProductInteractionMinimal() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Product Card (Collapsed State) */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="font-medium">Notion Creator Kit</h2>
          <Badge>Digital</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-bold">₹799</p>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </CardContent>
      </Card>

      {/* Inline Expanded Section (Interaction State) */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Image */}
          <div className="h-48 bg-muted rounded-lg" />

          {/* Info */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold">Notion Creator Kit</h1>
            <p className="text-sm text-muted-foreground">
              Templates and workflows for content creators.
            </p>
          </div>

          {/* Price + Discount */}
          <div className="flex gap-2 items-center">
            <span className="line-through text-muted-foreground">
              ₹999
            </span>
            <span className="text-lg font-bold">₹799</span>
            <Badge variant="secondary">20% OFF</Badge>
          </div>

          <Separator />

          {/* Variant Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium">License Type</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Personal
              </Button>
              <Button variant="outline" size="sm">
                Commercial
              </Button>
            </div>
          </div>

          {/* In-stock CTA */}
          <Button className="w-full">Buy Now</Button>
        </CardContent>
      </Card>

      {/* Out-of-Stock State */}
      <Card className="opacity-60">
        <CardHeader className="flex justify-between items-center">
          <h2 className="font-medium">Creator Hoodie</h2>
          <Badge variant="outline">Sold Out</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-32 bg-muted rounded-lg" />
          <Alert>
            <AlertDescription>
              This product is currently out of stock.
            </AlertDescription>
          </Alert>
          <Button disabled className="w-full">
            Out of Stock
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
