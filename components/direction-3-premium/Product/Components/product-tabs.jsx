import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star } from "lucide-react";
const reviews = [
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

export function ProductTabs({ product }) {
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

      <TabsContent value="description" className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <h3 className="font-display text-xl text-stone-900 mb-3">
            About This Product
          </h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
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

        {product.forWho && product.forWho.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Perfect For</h3>
            <div className="flex flex-wrap gap-2">
              {product.forWho.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="highlights" className="space-y-1">
        {product.highlights &&
          product.highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-2 rounded-xl bg-gradient-to-r from-gray-50/30 to-white/30 border border-gray-200/30 backdrop-blur-sm"
            >
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 mt-2" />
              <p className="text-gray-700">{highlight}</p>
            </div>
          ))}
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        {product.details &&
          Object.entries(product.details).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center py-1 border-b border-gray-100/50 last:border-0"
            >
              <span className="font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
      </TabsContent>

      <TabsContent value="review" className="space-y-4">
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
      </TabsContent>
      <TabsContent value="faq" className="space-y-4">
        {product.faqs &&
          product.faqs.map((faq, index) => (
            <div
              key={index}
              className="space-y-3 p-6 rounded-xl bg-gradient-to-r from-gray-50/30 to-white/30 border border-gray-200/30 backdrop-blur-sm"
            >
              <h4 className="font-semibold text-gray-900">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
      </TabsContent>
    </Tabs>
  );
}
