"use client";

import { ChevronLeft, Heart, Share2, Filter, ChevronDown } from "lucide-react";
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
    <div className="sticky top-0 z-40 bg-[#1a1714]/95 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Left */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/mockups/direction-2-marketplace/store"
              className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-amber-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-sans">Back to Store</span>
            </Link>
            <Separator orientation="vertical" className="hidden sm:block h-5 bg-stone-700" />
            <span className="hidden sm:inline text-xs text-stone-500 font-sans tracking-widest uppercase">
              Product Detail
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-400 hover:text-amber-400 hover:bg-stone-800 gap-2 font-sans"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Save</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-stone-400 hover:text-amber-400 hover:bg-stone-800 gap-2 font-sans"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Share</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-amber-400 hover:bg-stone-800 gap-1.5 font-sans"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Filter</span>
                  <ChevronDown className="hidden sm:inline w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#211e1b] border-stone-700 text-stone-300 font-sans text-sm"
              >
                <DropdownMenuItem className="hover:bg-stone-800 hover:text-amber-400 cursor-pointer">Sort by Price</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-stone-800 hover:text-amber-400 cursor-pointer">Sort by Rating</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-stone-800 hover:text-amber-400 cursor-pointer">Sort by Popularity</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}