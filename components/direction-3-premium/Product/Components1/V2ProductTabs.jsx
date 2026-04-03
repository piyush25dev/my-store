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

export function V2ProductTabs({ product }) {
  const highlights = product.product_highlights?.map((h) => h.highlight_text) ?? [];
  const details = product.product_details ?? [];
  const faqs = product.product_faqs ?? [];
  const reviews = product.product_reviews ?? [];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
      <Tabs defaultValue="description">
        <TabsList className="w-full flex flex-wrap md:grid md:grid-cols-5 h-auto gap-2 p-4 md:px-2">
          {["description", "highlights", "details", "reviews", "faq"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="flex-shrink-0 md:w-full">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="p-6 sm:p-8">
          <TabsContent value="description">
            <DescriptionTab product={product} highlights={highlights} />
          </TabsContent>
          <TabsContent value="highlights">
            <HighlightsTab highlights={highlights} />
          </TabsContent>
          <TabsContent value="details">
            <DetailsTab details={details} />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsTab reviews={reviews} product={product} />
          </TabsContent>
          <TabsContent value="faq">
            <FaqTab faqs={faqs} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function DescriptionTab({ product, highlights }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl text-stone-900 mb-3">About This Product</h3>
        <p className="font-sans text-sm text-stone-600 leading-relaxed">{product.description}</p>
      </div>
      <Separator className="bg-stone-100" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {highlights.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-800 text-sm">Includes</h4>
            <ul className="space-y-2">
              {highlights.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-sans text-sm text-stone-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {product.product_categories?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-800 text-sm">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {product.product_categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant="secondary"
                  className="font-sans text-xs bg-rose-50 text-rose-700 border border-rose-200/60"
                >
                  {cat.category_name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HighlightsTab({ highlights }) {
  if (highlights.length === 0) {
    return <p className="text-sm text-stone-400">No highlights available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {highlights.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:border-rose-200 hover:bg-rose-50/20 transition-colors"
        >
          <Zap className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-sans font-medium text-stone-800 text-sm">Feature {i + 1}</p>
            <p className="font-sans text-xs text-stone-500 mt-0.5 leading-relaxed">{item}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailsTab({ details }) {

  // Group details by detail_category
  const grouped = details.reduce((acc, item) => {
    const category = item.detail_category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
   <div className="flex flex-wrap gap-8">
  <div className="w-full sm:w-[100%]">
    <h4 className="font-sans font-semibold text-stone-800 text-sm mb-4">
      Specifications
    </h4>

    {details.length > 0 ? (
      <div className="flex flex-wrap gap-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="min-w-[200px] flex-1 bg-stone-50 rounded-xl border border-stone-100 p-4">
            {/* Category heading */}
            <p className="font-sans text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2">
              {category}
            </p>

            <div className="space-y-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2.5 border-b border-stone-100 last:border-0"
                >
                  <span className="font-sans text-xs text-stone-500">
                    {item.detail_key}
                  </span>

                  <span className="font-sans text-xs text-stone-800 font-medium text-right max-w-[55%]">
                    {item.detail_value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-stone-400">
        No specifications available.
      </p>
    )}
  </div>
</div>
  );
}

function ReviewsTab({ reviews, product }) {
  const avgRating = product.average_rating ?? 0;
  const totalReviews = reviews.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-xl text-stone-900">Reviews</h3>
          <p className="font-sans text-xs text-stone-400 mt-0.5">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"} · {avgRating} / 5
          </p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`}
            />
          ))}
        </div>
      </div>
      <Separator className="bg-stone-100 mb-5" />
      {reviews.length > 0 ? (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="space-y-2 p-4 bg-stone-50 rounded-xl border border-b border-stone-100 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/60 flex items-center justify-center text-xs font-display font-semibold text-rose-700">
                    {r.title.charAt(0)}
                  </div>
                  <div>
                    <p className="font-sans font-medium text-stone-800 text-sm">{r.title}</p>
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
                <div className="flex flex-col items-end gap-1">
                  <span className="font-sans text-xs text-stone-400">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {r.is_verified_purchase && (
                    <span className="text-xs text-emerald-600 font-medium">✓ Verified</span>
                  )}
                </div>
              </div>
              <p className="font-sans text-sm text-stone-600 leading-relaxed">{r.review_text}</p>
              <div className="flex items-center gap-3 pt-1 pb-2">
                <span className="text-xs text-stone-400">Helpful?</span>
                <span className="text-xs text-stone-500">👍 {r.helpful_count}</span>
                <span className="text-xs text-stone-500">👎 {r.unhelpful_count}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-400">No reviews yet.</p>
      )}
    </div>
  );
}

function FaqTab({ faqs }) {
  if (faqs.length === 0) {
    return <p className="text-sm text-stone-400">No FAQs available.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl text-stone-900 mb-2">FAQ</h3>
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="p-5 rounded-xl border border-stone-100 bg-stone-50/50 hover:border-rose-200/60 transition-colors"
        >
          <h4 className="font-sans font-semibold text-stone-800 text-sm mb-2">{faq.question}</h4>
          <p className="font-sans text-xs text-stone-500 leading-relaxed">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}