import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function StorePremium() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Store Header */}
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-semibold tracking-tight">
              Creator Studio
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A premium collection of thoughtfully crafted systems for creators.
            </p>
          </CardContent>
        </Card>

        {/* Featured Product */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Featured Product
            </h2>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="h-64 bg-muted rounded-xl" />

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">
                Signature Creator System
              </h3>
              <p className="text-muted-foreground">
                A complete workflow used by top creators worldwide.
              </p>
              <p className="text-2xl font-bold">₹2,499</p>
              <Button size="lg">View Product</Button>
            </div>
          </CardContent>
        </Card>

        {/* Product Collection */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Product Collection
            </h2>
          </CardHeader>

          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border">
              <CardContent className="p-4 space-y-3">
                <div className="h-40 bg-muted rounded-lg" />
                <h4 className="font-medium">Notion Planning Kit</h4>
                <p className="font-semibold">₹799</p>
                <Button variant="outline" className="w-full">
                  View
                </Button>
              </CardContent>
            </Card>

            <Card className="border opacity-60">
              <CardContent className="p-4 space-y-3">
                <div className="h-40 bg-muted rounded-lg" />
                <h4 className="font-medium">Studio Hoodie</h4>
                <p className="font-semibold">Sold Out</p>
                <Button disabled className="w-full">
                  Unavailable
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
