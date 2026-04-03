"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import ProductIndex from "@/components/direction-3-premium/Product/ProductIndex";
import { ProductNotFound } from "@/components/ui/not-found";

async function getProduct(slug) {
  const response = await fetch(`/api/products/${slug}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.product;
}

async function getRelatedProducts(excludeId) {
  const response = await fetch(`/api/products?limit=20`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.products.filter((p) => p.id !== excludeId).slice(0, 4);
}

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); return; }

    async function load() {
      try {
        const p = await getProduct(slug);
        if (!p) { setNotFound(true); return; }
        
        const rel = await getRelatedProducts(p.id);
        setProduct(p);
        setRelated(rel);
      } catch (err) {
        console.error("Error loading product:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (notFound) return <ProductNotFound backUrl="/store" />;

  return (
    <div>
      <ProductIndex product={product} related={related} />
    </div>
  );
}