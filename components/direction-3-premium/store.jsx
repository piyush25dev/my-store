import Image from "next/image";
import Link from "next/link";
import { products } from "@/app/data/product";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Star } from "lucide-react";

export default function StorePremium() {
  const featured = products.find((p) => p.featured);
  const collection = products.filter((p) => !p.featured);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-rose-50/40 to-amber-50/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-50/40 to-cyan-50/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ================= Store Header ================= */}
        <div className="mb-20 text-center">
          <div className="relative mx-auto mb-8 inline-flex">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-100 to-amber-100 blur"></div>
            <Avatar className="relative h-32 w-32 border-4 border-white shadow-lg">
              <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-rose-100 to-amber-100 text-rose-900">
                CS
              </AvatarFallback>
            </Avatar>
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            Creator Studio
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            A premium collection of thoughtfully crafted tools
            and products for modern creators.
          </p>
        </div>

        {/* ================= Featured Product ================= */}
        {featured && (
          <div className="mb-24">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-rose-400 to-amber-400"></div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Featured Product
                </h2>
              </div>
              <Badge className="gap-1.5 bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-1.5">
                <Star className="h-3 w-3" />
                Premium Pick
              </Badge>
            </div>

            <Card className="overflow-hidden border-0 bg-gradient-to-r from-white to-gray-50/50 shadow-xl shadow-gray-100/50">
              <CardContent className="p-0">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Image with gradient overlay */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-rose-50/50 to-amber-50/50 p-8">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                      <Image
                        src={featured.image}
                        alt={featured.name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="mb-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
                          {featured.type}
                        </Badge>
                        {featured.inStock ? (
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                            Sold Out
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-3xl font-bold text-gray-900">
                        {featured.name}
                      </h3>
                      <p className="text-lg text-gray-600">
                        {featured.tagline}
                      </p>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-gray-900">
                          ₹{featured.price}
                        </span>
                        {featured.originalPrice && (
                          <>
                            <span className="text-xl text-gray-400 line-through">
                              ₹{featured.originalPrice}
                            </span>
                            <Badge className="bg-gradient-to-r from-rose-500 to-amber-500">
                              Save ₹{featured.originalPrice - featured.price}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link href={`/mockups/direction-3-premium/product/${featured.id}`} className="flex-1">
                        <Button 
                          size="lg" 
                          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          View Product Details
                        </Button>
                      </Link>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <Heart className="mr-2 h-5 w-5" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= Product Collection ================= */}
        <section className="mb-20">
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400"></div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Product Collection
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{collection.length} products</span>
              </div>
            </div>
            <p className="mt-2 text-gray-500">
              Explore our curated selection of premium creator tools
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collection.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Top badges */}
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <Badge className="w-fit border-0 bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                        {product.type}
                      </Badge>
                      {!product.inStock && (
                        <Badge variant="destructive" className="w-fit">
                          Sold Out
                        </Badge>
                      )}
                    </div>

                    {/* Quick action on hover */}
                    <div className="absolute right-4 top-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-6">
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-100 p-6">
                  <div className="flex w-full items-center justify-between">
                    {product.inStock ? (
                      <>
                        <Link href={`/mockups/direction-3-premium/product/${product.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="ml-2 h-10 w-10"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        disabled 
                        className="w-full bg-gray-100 text-gray-500 hover:bg-gray-100"
                      >
                        Currently Unavailable
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= Footer CTA ================= */}
        <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-12 text-center">
          <h4 className="mb-4 text-3xl font-bold text-white">
            Join 5,000+ Creators
          </h4>
          <p className="mb-8 text-gray-300">
            Get early access to new products and exclusive discounts
          </p>
          <div className="flex max-w-md gap-4 mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border-0 bg-white/10 px-6 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Button 
              size="lg" 
              className="rounded-full bg-white text-gray-900 hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}