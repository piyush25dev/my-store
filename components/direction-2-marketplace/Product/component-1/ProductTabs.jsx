"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, Zap, CreditCard, Download,
  RotateCcw, Shield, Star,
} from "lucide-react";

const REVIEWS = [
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

const TAB_LIST = ["description", "highlights", "details", "reviews", "faq"];

export default function ProductTabs({ product }) {
  return (
    <Tabs defaultValue="description" className="w-full">
      {/* Tab bar: underline style on white bg */}
      <TabsList  className="
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
    }}>
        {TAB_LIST.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
             className="flex-shrink-0 md:w-full" 
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="description" className="pt-4">
        <DescriptionTab product={product} />
      </TabsContent>
      <TabsContent value="highlights" className="pt-4">
        <HighlightsTab product={product} />
      </TabsContent>
      <TabsContent value="details" className="pt-4">
        <DetailsTab product={product} />
      </TabsContent>
      <TabsContent value="reviews" className="pt-4">
        <ReviewsTab reviews={REVIEWS} />
      </TabsContent>
      <TabsContent value="faq" className="pt-4">
        <FaqTab product={product} />
      </TabsContent>
    </Tabs>
  );
}

// ── Tab Panels ────────────────────────────────────────────────────────────────

function DescriptionTab({ product }) {
  return (
    <Card className="bg-white border-stone-200/60 shadow-sm pt-2">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-display text-lg text-stone-900 mb-3">About This Product</h3>
          <p className="font-sans text-sm text-stone-600 leading-relaxed">{product.description}</p>
        </div>
        <Separator className="bg-stone-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-800 text-sm">Includes:</h4>
            <ul className="space-y-2">
              {product.highlights.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 font-sans text-sm text-stone-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-800 text-sm">Perfect For:</h4>
            <div className="flex flex-wrap gap-2">
              {product.forWho.map((role, idx) => (
                <Badge key={idx} variant="outline" className="font-sans text-xs border-rose-200 bg-rose-50/50 text-rose-700">
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
    <Card className="bg-white border-stone-200/60 shadow-sm pt-2">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:border-rose-200 hover:bg-rose-50/20 transition-colors"
            >
              <Zap className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-sans font-medium text-stone-800 text-sm">Feature {idx + 1}</h4>
                <p className="font-sans text-xs text-stone-500 mt-1 leading-relaxed">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailsTab({ product }) {
  const purchaseDetails = [
    { icon: <CreditCard className="w-4 h-4" />, text: "Secure payment processing" },
    { icon: <Download className="w-4 h-4" />, text: "Instant download after purchase" },
    { icon: <RotateCcw className="w-4 h-4" />, text: "30-day money-back guarantee" },
    { icon: <Shield className="w-4 h-4" />, text: "Customer support included" },
  ];

  return (
    <Card className="bg-white border-stone-200/60 shadow-sm pt-2">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-sans font-semibold text-stone-800 text-sm mb-4">Specifications</h4>
            <div className="space-y-0">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2.5 border-b border-stone-100 last:border-0">
                  <span className="font-sans text-xs text-stone-500 capitalize">{key}</span>
                  <span className="font-sans text-xs text-stone-800 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-sans font-semibold text-stone-800 text-sm mb-4">Purchase Details</h4>
            <div className="space-y-3">
              {purchaseDetails.map(({ icon, text }, idx) => (
                <div key={idx} className="flex items-center gap-3 font-sans text-sm text-stone-600">
                  <span className="text-rose-400">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewsTab({ reviews }) {
  return (
    <Card className="bg-white border-stone-200/60 shadow-sm pt-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-stone-900 text-lg">Customer Reviews</h3>
            <p className="font-sans text-xs text-stone-400 mt-0.5">142 reviews · 4.8 / 5 rating</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
        <Separator className="bg-stone-100 mb-5" />
        <div className="space-y-5">
          {reviews.map((review, idx) => (
            <ReviewItem key={idx} review={review} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FaqTab({ product }) {
  return (
    <Card className="bg-white border-stone-200/60 shadow-sm pt-2">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-display text-stone-900 text-lg">Frequently Asked Questions</h3>
        {product.faqs.map((faq, idx) => (
          <div key={idx} className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 hover:border-rose-200/60 transition-colors">
            <h4 className="font-sans font-semibold text-stone-800 text-sm mb-2">{faq.q}</h4>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReviewItem({ review }) {
  return (
    <div className="space-y-2 border-b border-stone-100 pb-5 last:border-0 last:pb-0 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/60 flex items-center justify-center text-xs font-display font-semibold text-rose-700">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-sans font-medium text-stone-800 text-sm">{review.name}</p>
            <div className="flex gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="font-sans text-xs text-stone-400">{review.date}</span>
      </div>
      <p className="font-sans text-sm text-stone-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}