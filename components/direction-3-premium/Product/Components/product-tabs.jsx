import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star } from "lucide-react";

export function ProductTabs({ product }) {
  const highlights =
    product.product_highlights?.map((h) => h.highlight_text) ?? [];
  const details = product.product_details ?? [];
  const faqs = product.product_faqs ?? [];
  const reviews = product.product_reviews ?? [];

  return (
    <Tabs defaultValue="description" className="space-y-6">
      <TabsList className="bg-transparent border-b border-gray-200/50 w-full justify-start gap-4 lg:gap-8 p-0 h-auto overflow-x-auto">
        <TabsTrigger
          value="description"
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="highlights"
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          Highlights
        </TabsTrigger>
        <TabsTrigger
          value="details"
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          Details
        </TabsTrigger>
        <TabsTrigger
          value="review"
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          Review
        </TabsTrigger>
        <TabsTrigger
          value="faq"
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          FAQ
        </TabsTrigger>
      </TabsList>

      {/* ── Description ── */}
      <TabsContent value="description" className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <h3 className="font-display text-xl text-stone-900 mb-3">
            About This Product
          </h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {highlights.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-stone-800 text-sm">
              Includes
            </h4>
            <ul className="space-y-2">
              {highlights.slice(0, 3).map((item, i) => (
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
        )}
      </TabsContent>

      {/* ── Highlights ── */}
      <TabsContent value="highlights" className="space-y-1">
        {highlights.length > 0 ? (
          highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-2 rounded-xl bg-gradient-to-r from-gray-50/30 to-white/30 border border-gray-200/30 backdrop-blur-sm"
            >
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 mt-2 shrink-0" />
              <p className="text-gray-700">{highlight}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No highlights available.</p>
        )}
      </TabsContent>

      {/* ── Details ── */}
      {/* ── Details ── */}
      <TabsContent value="details" className="space-y-6">
        {details.length > 0 ? (
          (() => {
            const grouped = details.reduce((acc, item) => {
              const category = item.detail_category || "General";
              if (!acc[category]) acc[category] = [];
              acc[category].push(item);
              return acc;
            }, {});

            return Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="bg-stone-50 rounded-xl border border-stone-100 p-4">
                <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2">
                  {category}
                </p>
                <div>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2.5 border-b border-gray-100/50 last:border-0"
                    >
                      <span className="font-medium text-gray-700 text-sm">
                        {item.detail_key}
                      </span>
                      <span className="text-gray-600 text-sm text-right max-w-[60%]">
                        {item.detail_value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()
        ) : (
          <p className="text-sm text-gray-400">No details available.</p>
        )}
      </TabsContent>

      {/* ── Reviews ── */}
      <TabsContent value="review" className="space-y-4">
        <div className="space-y-5">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div
                key={r.id}
                className="space-y-2 border-b bg-stone-50 rounded-xl border border-stone-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200/60 flex items-center justify-center text-xs font-display font-semibold text-rose-700">
                      {r.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-stone-800 text-sm">
                        {r.title}
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
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-sans text-xs text-stone-400">
                      {new Date(r.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {r.is_verified_purchase && (
                      <span className="text-xs text-emerald-600 font-medium">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-sans text-sm text-stone-600 leading-relaxed">
                  {r.review_text}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-stone-400">Helpful?</span>
                  <span className="text-xs text-stone-500">
                    👍 {r.helpful_count}
                  </span>
                  <span className="text-xs text-stone-500">
                    👎 {r.unhelpful_count}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No reviews available.</p>
          )}
        </div>
      </TabsContent>

      {/* ── FAQ ── */}
      <TabsContent value="faq" className="space-y-4">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="space-y-3 p-6 rounded-xl bg-gradient-to-r from-gray-50/30 to-white/30 border border-gray-200/30 backdrop-blur-sm"
            >
              <h4 className="font-semibold text-gray-900">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No FAQs available.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
