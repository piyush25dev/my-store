"use client";

// ─── ProductsPage.jsx ─────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Eye,
  Loader,
  Package,
  Pencil,
  Plus,
  Star,
  TrendingUp,
  Trash2,
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

import { getToken } from "./utils";
import { StatusDropdown, DeleteModal } from "./SharedComponents";
import ProductModal from "./ProductModal";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [authError, setAuthError]           = useState(null);
  const [modalOpen, setModalOpen]           = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [currentPage, setCurrentPage]       = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const { data: { user }, error: uErr } = await supabase.auth.getUser();
      if (uErr || !user) { setAuthError("Please log in to view your products"); return; }
      await fetchProducts();
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setError(null);
      const token = await getToken();
      const res   = await fetch("/api/products?creator_only=true&page=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch products");
      setProducts(data.products || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaved = (saved) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      return exists
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev];
    });
    setCurrentPage(1);
  };

  const handleDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const newTotalPages = Math.ceil((products.length - 1) / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleStatusChange = (id, newStatus) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

  const openCreate = () => { setEditingProduct(null); setModalOpen(true); };
  const openEdit   = async (product) => {
    try {
      const res  = await fetch(`/api/products/${product.slug}`);
      const data = await res.json();
      setEditingProduct(data.product || product);
    } catch {
      setEditingProduct(product);
    }
    setModalOpen(true);
  };

  // Pagination
  const totalPages        = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIdx          = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx            = startIdx + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIdx, endIdx);

  // Derived stats
  const totalRevenue   = products.reduce((s, p) => s + (p.total_revenue || 0), 0);
  const publishedCount = products.filter((p) => p.status === "published").length;
  const pendingCount   = products.filter((p) => p.status === "pending").length;
  const totalSales     = products.reduce((s, p) => s + (p.total_sales || 0), 0);
  const avgRating      = products.length
    ? (products.reduce((s, p) => s + (p.average_rating || 0), 0) / products.length).toFixed(2)
    : "0";

  const getPaginationItems = () => {
    const items      = [];
    const maxVisible = 5;
    const halfWindow = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage   = Math.min(totalPages, currentPage + halfWindow);

    if (currentPage <= halfWindow)                endPage   = Math.min(totalPages, maxVisible);
    if (currentPage > totalPages - halfWindow)    startPage = Math.max(1, totalPages - maxVisible + 1);

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2)
        items.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        items.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (authError && !loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Your Products</h2>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">{authError}</p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="text-sm font-medium text-red-700 hover:text-red-900 mt-2 underline"
              >
                Go to login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Your Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {publishedCount} published · {pendingCount} pending review · {products.length} total
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 text-sm self-start sm:self-auto hover:from-slate-800 hover:to-slate-600 transition-all"
        >
          <Plus className="w-4 h-4" /> New Product
        </Button>
      </div>

      {/* Fetch error */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="font-medium text-red-900">Failed to load products</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchProducts}
              className="text-sm font-medium text-red-700 hover:text-red-900 mt-2 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <Card className="border-slate-200/60 bg-white/90 shadow-sm">
          <CardContent className="p-8 flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-slate-400 animate-spin" />
            <p className="text-slate-500">Loading your products…</p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Revenue",  value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: TrendingUp },
            { label: "Total Sales",    value: totalSales.toLocaleString(),               icon: Package },
            { label: "Avg Rating",     value: avgRating,                                 icon: Star },
            { label: "Total Products", value: products.length.toString(),                icon: Eye },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && !error && (
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardContent className="p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">No products yet</h3>
              <p className="text-sm text-slate-500 mt-1">Create your first product to start selling</p>
            </div>
            <Button
              onClick={openCreate}
              className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 mt-2"
            >
              <Plus className="w-4 h-4" /> Create Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Products table */}
      {!loading && products.length > 0 && (
        <Card className="border-slate-200/60 shadow-sm bg-white/90">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">All Products</h3>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
              {["Product", "Price", "Sales", "Revenue", "Status", "Actions"].map((h) => (
                <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
              ))}
            </div>

            <div className="divide-y divide-slate-100">
              {paginatedProducts.map((product) => {
                const primaryImg = product.product_images?.find((i) => i.is_primary) ?? product.product_images?.[0];
                const thumb = primaryImg?.image_url
                  ? <Image src={primaryImg.image_url} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                  : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><Package className="w-5 h-5 text-slate-400" /></div>;

                return (
                  <div key={product.id} className="group hover:bg-slate-50/60 transition-colors">

                    {/* Mobile row */}
                    <div className="sm:hidden p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">{thumb}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                          <p className="text-[10px] text-slate-400">{product.type}</p>
                        </div>
                        <StatusDropdown
                          productId={product.id}
                          currentStatus={product.status}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          { label: "Price",   value: `₹${Math.round(product.price / 100).toLocaleString()}` },
                          { label: "Sales",   value: product.total_sales || 0 },
                          { label: "Revenue", value: `₹${((product.total_revenue || 0) / 1000).toFixed(0)}k` },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] text-slate-400">{label}</p>
                            <p className="text-sm font-semibold text-slate-900">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>

                    {/* Desktop row */}
                    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">{thumb}</div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {product.type} · {new Date(product.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          ₹{Math.round(product.price / 100).toLocaleString()}
                        </p>
                        {product.original_price && (
                          <p className="text-[10px] text-slate-400 line-through">
                            ₹{Math.round(product.original_price / 100).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{product.total_sales || 0}</p>
                        <p className="text-[10px] text-slate-400">0% conv.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          ₹{((product.total_revenue || 0) / 1000).toFixed(0)}k
                        </p>
                        <p className="text-[10px] text-slate-400">{product.views || 0} views</p>
                      </div>
                      <StatusDropdown
                        productId={product.id}
                        currentStatus={product.status}
                        onStatusChange={handleStatusChange}
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          title="Edit product"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          title="Delete product"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {products.length > ITEMS_PER_PAGE && (
              <div className="border-t border-slate-100 px-5 py-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold">{startIdx + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(endIdx, products.length)}</span> of{" "}
                  <span className="font-semibold">{products.length}</span> products
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {getPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        onSuccess={handleSaved}
        editProduct={editingProduct}
      />

      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}