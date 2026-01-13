import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function StoreMinimal() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      {/* Store Header */}
      <div className="text-center space-y-2">
        <Avatar className="h-20 w-20 mx-auto">
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold">Creator Store</h1>
        <p className="text-sm text-muted-foreground">
          Minimal tools for modern creators
        </p>
      </div>

      {/* Category Filter */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Featured Products */}
      <section className="space-y-4">
        <h2 className="font-semibold">Featured</h2>
        <Card className="border-2">
          <CardContent className="p-4 space-y-3">
            <div className="h-48 bg-muted rounded-lg" />
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Notion Creator Kit</h3>
              <Badge>Digital</Badge>
            </div>
            <p className="text-lg font-bold">₹799</p>
            <Button className="w-full">Buy</Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* In stock */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <h3 className="font-medium">Instagram Hooks Pack</h3>
            <Badge variant="secondary">Digital</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-32 bg-muted rounded-lg" />
            <p className="font-bold">₹399</p>
            <Button className="w-full">Buy</Button>
          </CardContent>
        </Card>

        {/* Out of stock */}
        <Card className="opacity-60">
          <CardHeader className="flex-row justify-between">
            <h3 className="font-medium">Creator Hoodie</h3>
            <Badge variant="outline">Sold Out</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-32 bg-muted rounded-lg" />
            <p className="font-bold">₹1,499</p>
            <Button disabled className="w-full">
              Out of Stock
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
