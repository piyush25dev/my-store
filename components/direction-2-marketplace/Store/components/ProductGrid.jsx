"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FilterIcon, SearchIcon } from "./Icons";
import ProductCard from "./ProductCard";
import { CATEGORIES, SORT_OPTIONS } from "./products";
import { cn } from "@/lib/utils";

export default function ProductGrid({
  products,
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  onAddToCart,
  onWishlist,
  wishlist,
}) {
  return (
    <section>
      {/* Mobile Search */}
      <div className="sm:hidden mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
          <SearchIcon />
        </span>
        <Input
          placeholder="Search products…"
          className="pl-9 font-sans"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-xs font-sans font-semibold transition-all",
                activeCategory === cat
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-stone-400 font-sans hidden sm:inline">
            {products.length} products
          </span>
          <Select
            value={sort}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            className="font-sans text-xs"
          />
        </div>
      </div>

      {/* Grid or Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-stone-400">
          <FilterIcon />
          <p className="font-sans text-sm">No products match your search.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { onSearchChange(""); onCategoryChange("All"); }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}