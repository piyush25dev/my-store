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
      <TabsList className="w-full flex flex-wrap md:grid md:grid-cols-5 h-auto gap-1 p-1 bg-[#12110f] border border-stone-800 rounded-xl">
        {TAB_LIST.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="font-sans text-xs capitalize text-stone-400 data-[state=active]:bg-white-800 data-[state=active]:text-amber-400 rounded-lg transition-all"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="description" className="pt-5">
        <DescriptionTab product={product} />
      </TabsContent>
      <TabsContent value="highlights" className="pt-5">
        <HighlightsTab product={product} />
      </TabsContent>
      <TabsContent value="details" className="pt-5">
        <DetailsTab product={product} />
      </TabsContent>
      <TabsContent value="reviews" className="pt-5">
        <ReviewsTab reviews={REVIEWS} />
      </TabsContent>
      <TabsContent value="faq" className="pt-5">
        <FaqTab product={product} />
      </TabsContent>
    </Tabs>
  );
}

// ── Tab Panels ────────────────────────────────────────────────────────────────

function DescriptionTab({ product }) {
  return (
    <Card className="bg-[#12110f] border-stone-800 pt-4">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-display text-lg text-stone-100 mb-3">About This Product</h3>
          <p className="font-sans text-sm text-stone-400 leading-relaxed">{product.description}</p>
        </div>
        <Separator className="bg-stone-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-200 text-sm">Includes:</h4>
            <ul className="space-y-2">
              {product.highlights.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 font-sans text-sm text-stone-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-200 text-sm">Perfect For:</h4>
            <div className="flex flex-wrap gap-2">
              {product.forWho.map((role, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="font-sans text-xs border-stone-700 text-stone-400"
                >
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
    <Card className="bg-[#12110f] border-stone-800 pt-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl border border-stone-800 bg-stone-900/40 hover:border-amber-500/40 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-sans font-medium text-stone-200 text-sm">Feature {idx + 1}</h4>
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
    <Card className="bg-[#12110f] border-stone-800 pt-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <h4 className="font-sans font-semibold text-stone-200 text-sm mb-4">Specifications</h4>
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2.5 border-b border-stone-800 last:border-0">
                <span className="font-sans text-xs text-stone-500 capitalize">{key}</span>
                <span className="font-sans text-xs text-stone-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-200 text-sm mb-4">Purchase Details</h4>
            {purchaseDetails.map(({ icon, text }, idx) => (
              <div key={idx} className="flex items-center gap-3 font-sans text-sm text-stone-400">
                <span className="text-amber-500/70">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewsTab({ reviews }) {
  return (
    <Card className="bg-[#12110f] border-stone-800 pt-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-stone-100 text-lg">Customer Reviews</h3>
            <p className="font-sans text-xs text-stone-500 mt-0.5">142 reviews · 4.8 / 5 rating</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
        <Separator className="bg-stone-800 mb-5" />
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
    <Card className="bg-[#12110f] border-stone-800 pt-4">
      <CardContent className="p-6 space-y-5">
        <h3 className="font-display text-stone-100 text-lg">Frequently Asked Questions</h3>
        {product.faqs.map((faq, idx) => (
          <div key={idx} className="rounded-xl border border-stone-800 bg-stone-900/40 p-4">
            <h4 className="font-sans font-semibold text-stone-200 text-sm mb-2">{faq.q}</h4>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function ReviewItem({ review }) {
  return (
    <div className="space-y-2 border-b border-stone-800 pb-5 last:border-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-500 border border-stone-700 flex items-center justify-center text-xs font-sans font-semibold text-stone-900">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-sans font-medium text-stone-200 text-sm">{review.name}</p>
            <div className="flex gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-stone-700 text-stone-700"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="font-sans text-xs text-stone-600">{review.date}</span>
      </div>
      <p className="font-sans text-sm text-stone-400 leading-relaxed">{review.comment}</p>
    </div>
  );
}