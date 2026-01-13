import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProductPremium() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="grid md:grid-cols-2 gap-10 p-8">
            {/* Product Image */}
            <div className="h-[420px] bg-muted rounded-xl" />

            {/* Product Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Signature Creator System
                </h1>
                <p className="text-muted-foreground">
                  A premium workflow designed for serious creators.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="line-through text-muted-foreground">
                  ₹2,999
                </span>
                <span className="text-3xl font-bold">₹2,499</span>
                <Badge>Limited Release</Badge>
              </div>

              <Separator />

              {/* Variants */}
              <div className="space-y-2">
                <p className="text-sm font-medium">License</p>
                <div className="flex gap-3">
                  <Button variant="outline">Personal</Button>
                  <Button variant="outline">Team</Button>
                </div>
              </div>

              <Button size="lg" className="w-full">
                Buy Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
