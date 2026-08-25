import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Crown, TrendingUp } from "lucide-react";

const SELLER = {
  name: "Artisan Collective",
  initials: "AC",
  level: "Verified Seller",
  rating: 4.9,
  sales: 2894,
  positivePercent: 98,
};

const STATS = [
  { label: "Total Sales", value: "1,247" },
  { label: "Downloads", value: "2,891" },
  { label: "Rating", value: "4.8", star: true },
  { label: "Last Updated", value: "2 days ago" },
];

// ── Seller Card ───────────────────────────────────────────────────────────────

export function V2SellerCard({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5 sm:p-6">
      <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-4">About the Seller</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex gap-4 items-center">
          {/* Avatar */}
          <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold font-sans text-sm shadow-md">
            {SELLER.initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-display text-stone-900 text-base">{product.business_name}</h3>
              <Badge
                variant="outline"
                className="border-rose-200 bg-rose-50/50 text-rose-700 font-sans text-[10px] gap-1"
              >
                <Crown className="w-3 h-3" />
                {SELLER.level}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-stone-700 font-semibold">{SELLER.rating}</span>
                <span className="text-stone-400">({SELLER.sales} sales)</span>
              </div>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                {SELLER.positivePercent}% positive
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {["View Store", "Follow", "Contact"].map((label) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 text-xs font-sans border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900 hover:bg-transparent transition-colors"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 pl-16 sm:pl-0">
          <span className="font-display text-2xl text-emerald-600">{SELLER.positivePercent}%</span>
          <span className="font-sans text-xs text-stone-400">Seller Rating</span>
        </div>
      </div>
    </div>
  );
}

// ── Stats Panel ───────────────────────────────────────────────────────────────

export function V2StatsPanel() {
  return (
    <Card className="bg-white border-stone-200/60 shadow-sm">
      <CardHeader className="pb-2 pt-4 px-5">
        <h3 className="font-display text-stone-900 text-base">Product Stats</h3>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-1">
        {STATS.map(({ label, value, star }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0"
          >
            <span className="font-sans text-xs text-stone-500">{label}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-semibold text-stone-800 text-sm">{value}</span>
              {star && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}