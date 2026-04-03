import ProductIndex from "@/components/direction-3-premium/Product/ProductIndex";
import { ProductNotFound } from "@/components/ui/not-found";
import React from "react";

async function getProduct(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://my-store-tan-nine.vercel.app/";
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error("Product fetch failed:", response.status);
      return null;
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(excludeId) {  // ← receives product.id now
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products?limit=20`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.products.filter((p) => p.id !== excludeId).slice(0, 4); // ← correct comparison
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: product?.product_images?.[0]?.image_url
        ? [{ url: product.product_images[0].image_url }]
        : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  if (!slug) return <ProductNotFound backUrl="/store" />;

  // Fetch product first to get its id
  const product = await getProduct(slug);

  if (!product) {
    console.log("Product not found for slug:", slug);
    return <ProductNotFound backUrl="/store" />;
  }

  // Now fetch related products using the real product.id for exclusion
  const relatedProducts = await getRelatedProducts(product.id);

  return (
    <div>
      <ProductIndex product={product} related={relatedProducts} />
    </div>
  );
} 