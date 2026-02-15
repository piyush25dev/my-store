import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Crown, TrendingUp } from "lucide-react";

const SELLER = {
  name: "Creator Studio",
  initials: "CS",
  level: "Pro Seller",
  rating: 4.9,
  sales: 2894,
  ratingPercentage: 98,
};

export default function SellerCard() {
  return (
    <Card className="bg-white border-stone-200/60 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-4">
          About the Seller
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          {/* Left: Avatar + Info */}
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold font-sans text-sm shadow-md">
              {SELLER.initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display text-stone-900 text-base">{SELLER.name}</h3>
                <Badge
                  variant="outline"
                  className="border-rose-200 bg-rose-50/50 text-rose-700 font-sans text-[10px] gap-1 tracking-wide"
                >
                  <Crown className="w-3 h-3" />
                  {SELLER.level}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-stone-700 font-medium">{SELLER.rating}</span>
                  <span className="text-stone-400">({SELLER.sales} sales)</span>
                </div>
                <span className="text-stone-300">•</span>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  {SELLER.ratingPercentage}% Positive
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

          {/* Right: Rating % */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 pl-16 sm:pl-0">
            <span className="font-display text-2xl text-emerald-600">{SELLER.ratingPercentage}%</span>
            <span className="font-sans text-xs text-stone-400">Seller Rating</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}