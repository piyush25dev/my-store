"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Zap, 
  CreditCard, 
  Download, 
  RotateCcw, 
  Shield,
  Star 
} from "lucide-react";

export default function ProductTabs({ product }) {
  const reviews = [
    {
      name: "John Doe",
      rating: 5,
      date: "2 days ago",
      comment: "This product completely transformed my workflow. Highly recommend!",
    },
    {
      name: "Jane Smith",
      rating: 4,
      date: "1 week ago",
      comment: "Great value for money. Easy to use templates.",
    },
  ];

  return (
    <Tabs defaultValue="description" className="w-full">
  {/* Tabs Navigation */}
  <TabsList
    className="
      w-full
      flex
      flex-wrap
      md:grid
      md:grid-cols-5
      h-auto
      gap-2
      p-4
      md:px-0
    "
    style={{
      scrollPaddingLeft: "1rem",
      scrollPaddingRight: "1rem",
    }}
  >
    <TabsTrigger
      value="description"
      className="flex-shrink-0 md:w-full"
    >
      Description
    </TabsTrigger>

    <TabsTrigger
      value="highlights"
      className="flex-shrink-0 md:w-full"
    >
      Highlights
    </TabsTrigger>

    <TabsTrigger
      value="details"
      className="flex-shrink-0 md:w-full"
    >
      Details
    </TabsTrigger>

    <TabsTrigger
      value="reviews"
      className="flex-shrink-0 md:w-full"
    >
      Reviews
    </TabsTrigger>

    <TabsTrigger
      value="faq"
      className="flex-shrink-0 md:w-full"
    >
      FAQ
    </TabsTrigger>
  </TabsList>

  {/* Tab Contents */}
  <TabsContent value="description" className="pt-6">
    <DescriptionTab product={product} />
  </TabsContent>

  <TabsContent value="highlights" className="pt-6">
    <HighlightsTab product={product} />
  </TabsContent>

  <TabsContent value="details" className="pt-6">
    <DetailsTab product={product} />
  </TabsContent>

  <TabsContent value="reviews" className="pt-6">
    <ReviewsTab reviews={reviews} />
  </TabsContent>

  <TabsContent value="faq" className="pt-6">
    <FaqTab product={product} />
  </TabsContent>
</Tabs>

  );
}

// Tab Components
function DescriptionTab({ product }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">About This Product</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold">Includes:</h4>
            <ul className="space-y-2">
              {product.highlights.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Perfect For:</h4>
            <div className="flex flex-wrap gap-2">
              {product.forWho.map((role, idx) => (
                <Badge key={idx} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HighlightsTab({ product }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 border rounded-lg">
              <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Feature {idx + 1}</h4>
                <p className="text-sm text-gray-600 mt-1">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailsTab({ product }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold">Product Specifications</h4>
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Purchase Details</h4>
            <div className="space-y-3">
              <DetailItem icon={<CreditCard className="w-4 h-4" />} text="Secure payment processing" />
              <DetailItem icon={<Download className="w-4 h-4" />} text="Instant download after purchase" />
              <DetailItem icon={<RotateCcw className="w-4 h-4" />} text="30-day money-back guarantee" />
              <DetailItem icon={<Shield className="w-4 h-4" />} text="Customer support included" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewsTab({ reviews }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <p className="text-gray-600">142 reviews • 4.8/5 rating</p>
            </div>
          </div>
          <Separator />
          {reviews.map((review, index) => (
            <ReviewItem key={index} review={review} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FaqTab({ product }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {product.faqs.map((faq, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper Components
function DetailItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function ReviewItem({ review }) {
  return (
    <div className="space-y-3 border-b pb-6 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <p className="font-medium">{review.name}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">{review.date}</span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
}