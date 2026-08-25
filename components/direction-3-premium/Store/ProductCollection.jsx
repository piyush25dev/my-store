// components/ProductCollection.jsx
"use client";

import { ProductCard } from "./ProductCard";
import { useState, useRef } from "react";
import { 
  Sparkles
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ProductCollection({ products, getProductLink }) {
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);
  const itemsPerPage = 6;
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to the section component
    if (sectionRef.current) {
      const offset = 80;
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section ref={sectionRef} className="mb-20 scroll-mt-20">
      <CollectionHeader 
        count={products.length}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {currentProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard 
                  product={product} 
                  getProductLink={getProductLink}
                />
              </div>
            ))}
          </div>

          {/* Shadcn Pagination */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(page);
                            }}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {startIndex + 1}–{Math.min(endIndex, products.length)} of {products.length} products
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function CollectionHeader({ count, currentPage, totalPages }) {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500"></div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Product Collection
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Explore our curated selection of premium creator tools
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Product Count */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100/50">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              {count} Products
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}