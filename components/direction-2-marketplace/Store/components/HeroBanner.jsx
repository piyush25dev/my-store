import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATS = [
  ["2,400+", "Products"],
  ["98%", "Satisfaction"],
  ["Direct", "From Weavers"],
];

export default function HeroBanner() {
  return (
    <div className="relative bg-[#2d2520] overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1558171813-4882febb3f94?w=1400&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <Badge variant="secondary" className="font-sans mb-3 text-[10px] tracking-widest uppercase">
            Summer Collection 2025
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight max-w-sm">
            Crafted in<br /><em>Pure Cotton</em>
          </h1>
          <p className="font-sans text-stone-300 text-sm mt-3 max-w-xs leading-relaxed">
            Handloom weaves, block prints, and artisan fabrics — sourced directly from weavers.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Button className="bg-amber-600 hover:bg-amber-500 text-white border-0">
              Explore Collection
            </Button>
            <Button variant="outline" className="border-stone-500 text-stone-200 hover:bg-white/10">
              View Lookbook
            </Button>
          </div>
        </div>

        <div className="flex gap-6 sm:flex-col sm:items-end">
          {STATS.map(([val, label]) => (
            <div key={label} className="text-center sm:text-right">
              <p className="font-display text-2xl text-amber-400">{val}</p>
              <p className="font-sans text-[11px] text-stone-400 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}