import { ProductCard } from "./ProductCard";

export function ProductCollection({ products, getProductLink }) {
  return (
    <section className="mb-20">
      <CollectionHeader count={products.length} />
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            getProductLink={getProductLink}
          />
        ))}
      </div>
    </section>
  );
}

function CollectionHeader({ count }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400"></div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Product Collection
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{count} products</span>
        </div>
      </div>
      <p className="mt-2 text-gray-500">
        Explore our curated selection of premium creator tools
      </p>
    </div>
  );
}