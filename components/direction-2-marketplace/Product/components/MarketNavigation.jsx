"use client";

import {
  ChevronLeft,
  Heart,
  Share2,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function MarketNavigation() {
  return (
    <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/mockups/direction-2-marketplace/store"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                Back to Marketplace
              </span>
            </Link>

            <Separator
              orientation="vertical"
              className="hidden sm:block h-6"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Save */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:size-auto sm:gap-2"
            >
              <Heart className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>

            {/* Share */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:size-auto sm:gap-2"
            >
              <Share2 className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:size-auto sm:gap-2"
                >
                  <Filter className="w-5 h-5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  <ChevronDown className="hidden sm:inline w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Sort by Price
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Sort by Rating
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Sort by Popularity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
