import Link from "next/link";
import { products } from "@/app/mockups/direction-1-minimal/data/product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function StoreMinimal() {
  const featured = products.find((p) => p.featured);
  const rest = products.filter((p) => !p.featured);

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
      <Tabs defaultValue="all">
        <TabsList className="mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Featured Product */}
      {featured && (
        <section className="space-y-4">
          <h2 className="font-semibold">Featured</h2>
          <Card className="border-2">
            <CardContent className="p-4 space-y-3">
              <Image
                src={featured.image}
                alt={featured.name}
                width={600}
                height={400}
                className="h-48 w-full object-cover rounded-lg"
              />
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{featured.name}</h3>
                <Badge>{featured.type}</Badge>
              </div>
              <p className="text-lg font-bold">₹{featured.price}</p>

              <Link
                href={`/mockups/direction-1-minimal/product/${featured.id}`}
              >
                <Button className="w-full">View Product</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      <Separator />

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {rest.map((product) => (
          <Card
            key={product.id}
            className={!product.inStock ? "opacity-60" : ""}
          >
            <CardHeader className="flex-row justify-between">
              <h3 className="font-medium">{product.name}</h3>
              <Badge variant={product.inStock ? "secondary" : "outline"}>
                {product.inStock ? product.type : "Sold Out"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="h-32 w-full object-cover rounded-lg"
              />

              <p className="font-bold">₹{product.price}</p>

              <Link href={`/mockups/direction-1-minimal/product/${product.id}`}>
                <Button className="w-full" disabled={!product.inStock}>
                  {product.inStock ? "View Product" : "Out of Stock"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
