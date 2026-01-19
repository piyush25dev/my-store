import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Crown } from "lucide-react";

export default function SellerCard() {
  const seller = {
    name: "Creator Studio",
    level: "Pro Seller",
    rating: 4.9,
    sales: 2894,
    ratingPercentage: 98,
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Section */}
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              CS
            </div>

            {/* Seller Info */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold truncate">
                  {seller.name}
                </h3>
                <Badge variant="outline" className="gap-1">
                  <Crown className="w-3 h-3" />
                  {seller.level}
                </Badge>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">
                    {seller.rating}
                  </span>
                  <span className="text-gray-500">
                    ({seller.sales} sales)
                  </span>
                </div>

                <span className="hidden sm:inline text-gray-400">
                  •
                </span>

                <span className="text-green-600 font-medium">
                  {seller.ratingPercentage}% Positive Reviews
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm">
                  View Store
                </Button>
                <Button variant="outline" size="sm">
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  Contact
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section (Rating Summary) */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2">
            <div className="text-2xl font-bold text-green-600">
              {seller.ratingPercentage}%
            </div>
            <div className="text-sm text-gray-500">
              Seller Rating
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
