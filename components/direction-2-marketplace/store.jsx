import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function StoreMarketplace() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Store Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Creator Marketplace</h1>
        <p className="text-muted-foreground">
          Tools, templates & resources by creators
        </p>
      </div>

      {/* Category Filters */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Featured */}
      <Card className="border-2">
        <CardHeader>
          <h2 className="font-semibold">Featured Product</h2>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="h-40 bg-muted rounded" />
          <div className="space-y-2">
            <h3 className="font-medium">Ultimate Creator Bundle</h3>
            <p className="text-sm text-muted-foreground">
              12 templates + 3 guides
            </p>
            <p className="text-lg font-bold">₹1,999</p>
            <Button>Buy</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Product List */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex gap-4">
              <div className="h-24 w-24 bg-muted rounded" />
              <div className="flex-1 space-y-1">
                <h3 className="font-medium">Instagram Hooks Pack</h3>
                <p className="text-sm text-muted-foreground">
                  300 high-converting hooks
                </p>
                <div className="flex gap-2 items-center">
                  <span className="font-bold">₹399</span>
                  <Badge>Digital</Badge>
                  <Badge variant="secondary">In Stock</Badge>
                </div>
              </div>
              <Button className="self-center">Buy</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
