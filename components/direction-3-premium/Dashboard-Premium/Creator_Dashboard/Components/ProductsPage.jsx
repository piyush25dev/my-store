import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, Star, Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import { creatorProducts } from "@/app/data/Dashboard";
import Image from "next/image";

const statusStyle = {
  Active:   "bg-emerald-100 text-emerald-700",
  "Sold Out":"bg-amber-100 text-amber-700",
  Draft:    "bg-slate-100 text-slate-500",
};

export default function ProductsPage() {
  const totalRevenue = creatorProducts.reduce((s, p) => s + p.revenue, 0);
  const active = creatorProducts.filter(p => p.status === "Active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">{active} active · {creatorProducts.length} total</p>
        </div>
        <Button className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 text-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Product
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: `₹${(totalRevenue/100000).toFixed(1)}L`, icon: TrendingUp, color: "blue" },
          { label: "Total Sales",   value: creatorProducts.reduce((s,p)=>s+p.sales,0).toLocaleString(), icon: Package, color: "purple" },
          { label: "Avg Rating",    value: "4.75",  icon: Star,    color: "amber"   },
          { label: "Total Views",   value: "11.8k", icon: Eye,     color: "emerald" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product table */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900">All Products</h3>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop table header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            {["Product","Price","Sales","Revenue","Status",""].map(h => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {creatorProducts.map((product) => (
              <div key={product.id} className="group hover:bg-slate-50/60 transition-colors">
                {/* Mobile layout */}
                <div className="sm:hidden p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
                      <Image src={product.image} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                      <p className="text-[10px] text-slate-400">{product.type}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[product.status]}`}>{product.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 ml-13 text-center">
                    <div><p className="text-[10px] text-slate-400">Price</p><p className="text-sm font-semibold text-slate-900">₹{product.price.toLocaleString()}</p></div>
                    <div><p className="text-[10px] text-slate-400">Sales</p><p className="text-sm font-semibold text-slate-900">{product.sales}</p></div>
                    <div><p className="text-[10px] text-slate-400">Revenue</p><p className="text-sm font-semibold text-slate-900">₹{(product.revenue/1000).toFixed(0)}k</p></div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
                      <Image src={product.image} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                      <p className="text-[10px] text-slate-400">{product.type} · {product.created}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">₹{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="text-[10px] text-slate-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{product.sales}</p>
                    <p className="text-[10px] text-slate-400">{product.conversion} conv.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">₹{(product.revenue/1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-slate-400">{product.views.toLocaleString()} views</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium w-fit ${statusStyle[product.status]}`}>
                    {product.status}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}