import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartIcon, SearchIcon, StoreIcon } from "./Icons";

export default function Navbar({ cartCount, onCartOpen, search, onSearchChange }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white">
            <StoreIcon />
          </div>
          <div>
            <span className="font-display text-lg text-stone-900 leading-none">Marketplace</span>
            <p className="text-[10px] text-stone-400 font-sans leading-none tracking-widest uppercase mt-0.5">
              Fine Textiles
            </p>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="relative flex-1 max-w-sm hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <SearchIcon />
          </span>
          <Input
            placeholder="Search fabrics, kurtas, sarees…"
            className="pl-9 font-sans"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Cart */}
        <Button variant="ghost" size="icon" className="relative" onClick={onCartOpen}>
          <CartIcon />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-900 text-white text-[10px] rounded-full flex items-center justify-center font-sans font-bold">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}