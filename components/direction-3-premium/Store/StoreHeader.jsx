import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StoreHeader() {
  return (
    <div className=" mb-20 text-center">
      
      <div className="relative">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-100/80 to-amber-100/80 px-4 py-1.5 text-sm font-medium text-rose-900 backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          <span>Featured Collection</span>
        </div>

        {/* Avatar with enhanced animations */}
        <div className="relative mx-auto mb-8 inline-flex group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-300 via-purple-300 to-amber-300 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
          <Avatar className="relative h-32 w-32 border-4 border-white shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-rose-100 to-amber-100 text-rose-900">
              CS
            </AvatarFallback>
          </Avatar>
          
          {/* Decorative ring */}
          <div className="absolute -inset-3 rounded-full border-2 border-dashed border-rose-200/50 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin-slow"></div>
        </div>

        {/* Title with gradient and animation */}
        <h1 className="mb-4 bg-gradient-to-r from-rose-900 via-gray-900 to-amber-900 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl animate-gradient">
          Creator Studio
        </h1>
        
        {/* Subtitle */}
        <p className="mx-auto max-w-2xl px-4 text-base text-gray-600 sm:text-lg md:text-xl">
          A premium collection of thoughtfully crafted tools
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent font-medium">
            and products for modern creators.
          </span>
        </p>

        {/* CTA Buttons - responsive layout */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <Button className="group bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base rounded-full">
            Explore Collection
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" className="border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-300 px-8 py-6 text-base rounded-full">
            Learn More
          </Button>
        </div>

        {/* Stats - hidden on mobile, shown on larger screens */}
        <div className="mt-12 hidden grid-cols-3 gap-8 md:grid max-w-md mx-auto">
          <div className="border-r border-gray-200 pr-8">
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
          <div className="border-r border-gray-200 pr-8">
            <div className="text-2xl font-bold text-gray-900">10K</div>
            <div className="text-sm text-gray-500">Creators</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">4.9★</div>
            <div className="text-sm text-gray-500">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}