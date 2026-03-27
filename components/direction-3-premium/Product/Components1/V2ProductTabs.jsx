"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Zap,
  CreditCard,
  Download,
  RotateCcw,
  Shield,
  Star,
} from "lucide-react";

const REVIEWS = [
  {
    name: "Priya Mehta",
    rating: 5,
    date: "3 days ago",
    comment:
      "Absolutely stunning fabric. The texture is exactly as described — soft yet structured.",
  },
  {
    name: "Arjun Kapoor",
    rating: 4,
    date: "1 week ago",
    comment: "Great quality and fast delivery. The colour is richer in person.",
  },
];

export function V2ProductTabs({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
      <Tabs defaultValue="description">
        <TabsList
          className="w-full flex flex-wrap md:grid md:grid-cols-5 h-auto gap-2 p-4 md:px-2"
          style={{
            scrollPaddingLeft: "1rem",
            scrollPaddingRight: "1rem",
          }}
        >
          {["description", "highlights", "details", "reviews", "faq"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex-shrink-0 md:w-full"
              >
                {tab}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <div className="p-6 sm:p-8">
          <TabsContent value="description">
            <DescriptionTab product={product} />
          </TabsContent>
          <TabsContent value="highlights">
            <HighlightsTab product={product} />
          </TabsContent>
          <TabsContent value="details">
            <DetailsTab product={product} />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsTab reviews={REVIEWS} />
          </TabsContent>
          <TabsContent value="faq">
            <FaqTab product={product} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function DescriptionTab({ product }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl text-stone-900 mb-3">
          About This Product
        </h3>
        <p className="font-sans text-sm text-stone-600 leading-relaxed">
          {product.description}
        </p>
      </div>
      <Separator className="bg-stone-100" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-sans font-semibold text-stone-800 text-sm">
            Includes
          </h4>
          <ul className="space-y-2">
            {product.highlights?.slice(0, 3).map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 font-sans text-sm text-stone-600"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-sans font-semibold text-stone-800 text-sm">
            Perfect For
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.forWho?.map((role, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="font-sans text-xs bg-rose-50 text-rose-700 border border-rose-200/60"
              >
                {role} 
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HighlightsTab({ product }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {product.highlights?.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:border-rose-200 hover:bg-rose-50/20 transition-colors"
        >
          <Zap className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-sans font-medium text-stone-800 text-sm">
              Feature {i + 1}
            </p>
            <p className="font-sans text-xs text-stone-500 mt-0.5 leading-relaxed">
              {item}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailsTab({ product }) {
  const purchaseItems = [
    { icon: CreditCard, text: "Secure payment processing" },
    { icon: Download, text: "Instant download after purchase" },
    { icon: RotateCcw, text: "30-day money-back guarantee" },
    { icon: Shield, text: "Customer support included" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div>
        <h4 className="font-sans font-semibold text-stone-800 text-sm mb-4">
          Specifications
        </h4>
        <div className="space-y-0">
          {product.details &&
            Object.entries(product.details).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between py-3 border-b border-stone-100 last:border-0"
              >
                <span className="font-sans text-xs text-stone-500 capitalize">
                  {key}
                </span>
                <span className="font-sans text-xs text-stone-800 font-medium">
                  {value}
                </span>
              </div>
            ))}
        </div>
      </div>
      <div>
        <h4 className="font-sans font-semibold text-stone-800 text-sm mb-4">
          Purchase Details
        </h4>
        <div className="space-y-3">
          {purchaseItems.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 font-sans text-sm text-stone-600"
            >
              <Icon className="w-4 h-4 text-rose-400 shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-xl text-stone-900">Reviews</h3>
          <p className="font-sans text-xs text-stone-400 mt-0.5">
            142 reviews · 4.8 / 5
          </p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
      <Separator className="bg-stone-100 mb-5" />
      <div className="space-y-5">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="space-y-2 border-b border-stone-100 pb-5 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/60 flex items-center justify-center text-xs font-display font-semibold text-rose-700">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-sans font-medium text-stone-800 text-sm">
                    {r.name}
                  </p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3 h-3 ${j < r.rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="font-sans text-xs text-stone-400">{r.date}</span>
            </div>
            <p className="font-sans text-sm text-stone-600 leading-relaxed">
              {r.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqTab({ product }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl text-stone-900 mb-2">FAQ</h3>
      {product.faqs?.map((faq, i) => (
        <div
          key={i}
          className="p-5 rounded-xl border border-stone-100 bg-stone-50/50 hover:border-rose-200/60 transition-colors"
        >
          <h4 className="font-sans font-semibold text-stone-800 text-sm mb-2">
            {faq.q}
          </h4>
          <p className="font-sans text-xs text-stone-500 leading-relaxed">
            {faq.a}
          </p>
        </div>
      ))}
    </div>
  );
}
