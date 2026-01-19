import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/app/data/product";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  TrendingUp, 
  Zap, 
  Package,
  Clock,
  Shield,
  ArrowRight
} from "lucide-react";

export default function StoreMarketplace() {
  const featured = products.find((p) => p.featured);
  const rest = products.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Modern Header with Stats */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Creator Marketplace
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Premium tools, templates & resources designed by creators for creators
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                4.9/5 Rating
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Package className="w-3 h-3 mr-1" />
                Instant Delivery
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="p-3 bg-white border rounded-xl">
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-xl font-bold">{products.length}</p>
            </div>
            <div className="p-3 bg-white border rounded-xl">
              <p className="text-sm text-muted-foreground">Digital</p>
              <p className="text-xl font-bold">
                {products.filter(p => p.type === "Digital").length}
              </p>
            </div>
            <div className="p-3 bg-white border rounded-xl">
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-xl font-bold">
                {products.filter(p => p.inStock).length}
              </p>
            </div>
            <div className="p-3 bg-white border rounded-xl">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-xl font-bold">4</p>
            </div>
          </div>
        </div>

        {/* Modern Category Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Browse by Category</h2>
            <Button variant="ghost" size="sm" className="text-sm">
              View all
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-4 h-12 bg-gray-100/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Templates
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Courses
              </TabsTrigger>
              <TabsTrigger value="physical" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Physical
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Product - Modern Design */}
        {featured && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Featured Product</h2>
            </div>
            
            <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Image Section */}
                <div className="md:col-span-3 relative h-64 md:h-auto">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/90 text-white px-3 py-1">
                      Featured
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:col-span-2 p-6 md:p-8 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{featured.name}</h3>
                    <p className="text-muted-foreground">{featured.tagline}</p>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="px-3 py-1">
                        {featured.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    {featured.highlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">₹{featured.price}</span>
                      {featured.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{featured.originalPrice}
                        </span>
                      )}
                    </div>

                    <Link href={`/mockups/direction-2-marketplace/product/${featured.id}`}>
                      <Button 
                        className="w-full py-6 text-lg bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black"
                        size="lg"
                      >
                        View Featured Product
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Product Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Products</h2>
            <div className="text-sm text-muted-foreground">
              Showing {rest.length} products
            </div>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rest.map((product) => (
              <Card 
                key={product.id} 
                className={`group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  !product.inStock ? "opacity-70" : ""
                }`}
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3">
                      <Badge 
                        className={`px-3 py-1 ${!product.inStock ? "bg-red-500" : "bg-black/90"}`}
                      >
                        {!product.inStock ? "Sold Out" : product.type}
                      </Badge>
                    </div>
                    
                    {/* Discount Badge */}
                    {product.originalPrice && product.inStock && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 px-3 py-1">
                          Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.tagline}
                      </p>
                    </div>

                    {/* Quick Specs */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{product.details.delivery.split(" ")[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>{product.details.license.split(" ")[0]}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xl font-bold">₹{product.price}</span>
                          {product.originalPrice && product.inStock && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        {product.inStock && (
                          <Badge variant="secondary" className="px-2 py-1">
                            In Stock
                          </Badge>
                        )}
                      </div>

                      <Link href={`/mockups/direction-2-marketplace/product/${product.id}`}>
                        <Button 
                          className="w-full"
                          variant={product.inStock ? "default" : "outline"}
                          disabled={!product.inStock}
                          size="lg"
                        >
                          {product.inStock ? "View Details" : "Out of Stock"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <Card className="border-0 bg-gradient-to-r from-gray-900 text-white">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to boost your creator journey?
              </h2>
              <p className="text-gray-300">
                Join thousands of creators who are building better with our tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Explore All Products
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Browse Categories
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}