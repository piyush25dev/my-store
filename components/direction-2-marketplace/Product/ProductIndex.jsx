// import { products } from "@/app/data/product";
// import { ProductNotFound } from "@/components/ui/not-found";
// import MarketNavigation from "./components/MarketNavigation";
// import ProductHeader from "./components/ProductHeader";
// import SellerCard from "./components/SellerCard";
// import ProductTabs from "./components/ProductTabs";
// import PurchaseCard from "./components/PurchaseCard";
// import MarketplaceStats from "./components/MarketplaceStats";
// import RelatedProducts from "./components/RelatedProducts";

// export default async function ProductMarketplace({ params }) {
//   const { id } = await params;
//   const product = products.find((p) => p.id === id);

//   if (!product) return <ProductNotFound backUrl="/mockups/direction-2-marketplace/store" />;

//   const relatedProducts = products.filter(p => p.id !== id).slice(0, 4);
//   const recommendedProducts = products.filter(p => p.type === product.type && p.id !== id).slice(0, 3);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <MarketNavigation />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-8">
//             <ProductHeader product={product} />
//             <SellerCard />
//             <ProductTabs product={product} />
//             <RelatedProducts 
//               products={relatedProducts} 
//               title="Similar Products" 
//             />
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             <PurchaseCard product={product} />
//             <MarketplaceStats />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { PRODUCTS } from "../Store/components/products";
import { ProductNotFound } from "@/components/ui/not-found";
import MarketNavigation from "./component-1/MarketNavigation";
import ProductHeader from "./component-1/ProductHeader";
import SellerCard from "./component-1/SellerCard";
import ProductTabs from "./component-1/ProductTabs";
import PurchaseCard from "./component-1/PurchaseCard";
import { MarketplaceStats, RelatedProducts } from "./component-1/MarketplaceStats";

export default async function ProductMarketplace({ params }) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) return <ProductNotFound backUrl="/mockups/direction-2-marketplace/store" />;

  const relatedProducts = PRODUCTS.filter((p) => p.id !== id).slice(0, 4);

  return (
     <div className="min-h-screen bg-[#1a1714]">
      <MarketNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProductHeader product={product} />
            <SellerCard />
            <ProductTabs product={product} />
            <RelatedProducts products={relatedProducts} title="Similar Products" />
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <PurchaseCard product={product} />
            <MarketplaceStats />
          </div>
        </div>
      </div>
    </div>
  );
}