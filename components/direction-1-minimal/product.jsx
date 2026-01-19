// app/mockups/direction-1-minimal/product/[id]/page.jsx

import { products } from "@/app/mockups/direction-1-minimal/data/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";

export default async function ProductPage({ params }) {
  // Await the params promise
  const { id } = await params;

  // Find the product by ID
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/mockups/direction-1-minimal/store">
              <Button>Back to Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/mockups/direction-1-minimal/store"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to store
          </Link>
        </div>

        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Product Image & Details */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-8">
            {/* Product Image */}
            <div className="md:hidden">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {product.tagline}
              </p>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-[4/3] lg:aspect-video">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 70vw"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Highlights */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">What you get</h2>
                <ul className="space-y-3">
                  {product.highlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <Separator />

              {/* Product Details */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Product details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Format</p>
                    <p className="text-sm text-muted-foreground">
                      {product.details.format}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      {product.details.delivery}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">License</p>
                    <p className="text-sm text-muted-foreground">
                      {product.details.license}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Updates</p>
                    <p className="text-sm text-muted-foreground">
                      {product.details.updates}
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* FAQ */}
              <section className="space-y-6">
                <h2 className="text-xl font-semibold">FAQs</h2>
                <div className="space-y-6">
                  {product.faqs.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <p className="font-medium">{faq.q}</p>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Right Column - Product Info & Purchase Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-6 lg:space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="hidden md:block">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {product.name}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    {product.tagline}
                  </p>
                </div>

                {/* Who it's for */}
                <section className="space-y-3">
                  <h2 className="text-lg font-medium">Who this is for</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.forWho.map((role, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>

              <Separator />

              {/* Price Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg line-through text-muted-foreground">
                        ₹{product.originalPrice}
                      </span>
                      <Badge variant="secondary" className="px-3 py-1">
                        {discount}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                {/* Variants */}
                {product.variants.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Choose license</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.variants.map((v) => (
                        <Button
                          key={v.id}
                          variant="outline"
                          className="h-auto py-3 flex-col items-center justify-center gap-1"
                        >
                          <span className="font-medium">{v.label}</span>
                          <span className="text-xs text-muted-foreground">
                            ₹{v.price}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buy Button */}
                <div className="pt-2">
                  {product.inStock ? (
                    <Link
                      href={`/mockups/direction-1-minimal/checkout?product=${product.id}`}
                    >
                      <Button size="lg" className="w-full h-14 text-base">
                        Buy now
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <Alert variant="destructive">
                        <AlertDescription>
                          This product is currently out of stock
                        </AlertDescription>
                      </Alert>
                      <Button
                        disabled
                        size="lg"
                        className="w-full h-14 text-base"
                      >
                        Out of stock
                      </Button>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium">
                      {product.details.format}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">
                      {product.details.delivery}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Support</span>
                    <span className="font-medium">6 months included</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">✓</div>
                    <p className="text-xs text-muted-foreground">
                      Secure Payment
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">↻</div>
                    <p className="text-xs text-muted-foreground">
                      30-Day Return
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">✓</div>
                    <p className="text-xs text-muted-foreground">
                      Instant Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
