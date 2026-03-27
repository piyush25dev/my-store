import { Button } from "@/components/ui/button";

export function FooterCTA() {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8 lg:p-12 text-center">
      <h4 className="mb-3 sm:mb-4 text-xl sm:text-2xl lg:text-3xl font-bold text-white">
        Join 5,000+ Creators
      </h4>
      <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-300 px-2 sm:px-0">
        Get early access to new products and exclusive discounts
      </p>
      <div className="flex flex-col sm:flex-row max-w-md gap-3 sm:gap-4 mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 rounded-full border-0 bg-white/10 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
        />
        <Button 
          size="lg" 
          className="rounded-full bg-gray-100 text-gray-900 hover:bg-white hover:text-black px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium whitespace-nowrap"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
}