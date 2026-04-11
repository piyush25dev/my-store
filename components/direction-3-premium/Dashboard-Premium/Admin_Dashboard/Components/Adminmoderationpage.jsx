// pages/dashboard/admin/moderation.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check, X, ChevronDown, Clock, AlertCircle, Search, Filter,
  CheckCircle2, XCircle, Eye, Package, Loader2, User, Calendar,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  return session.access_token;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PENDING_PAGE_SIZE     = 5;
const ALL_PRODUCTS_PAGE_SIZE = 10;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700",
    icon: Clock, label: "Pending Review",
  },
  published: {
    bg: "bg-green-50", border: "border-green-200", text: "text-green-700",
    icon: CheckCircle2, label: "Published",
  },
  rejected: {
    bg: "bg-red-50", border: "border-red-200", text: "text-red-700",
    icon: XCircle, label: "Rejected",
  },
  draft: {
    bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600",
    icon: Eye, label: "Draft",
  },
};

const formatPrice = (price) => `₹${(price / 100).toLocaleString("en-IN")}`;
const formatDate  = (d) => new Date(d).toLocaleDateString("en-IN", {
  year: "numeric", month: "short", day: "numeric",
});

// ─── Pagination helper ────────────────────────────────────────────────────────

/**
 * Returns an array of page items to render.
 * Always shows first, last, current, and up to 1 neighbour on each side.
 * Gaps are represented as "ellipsis".
 */
function buildPageItems(current, total) {
  if (total <= 1) return [];
  const delta = 1;
  const range = [];
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  const items = [];
  items.push(1);
  if (range[0] > 2) items.push("ellipsis-start");
  items.push(...range);
  if (range[range.length - 1] < total - 1) items.push("ellipsis-end");
  if (total > 1) items.push(total);
  return items;
}

// ─── TablePagination wrapper ──────────────────────────────────────────────────

function TablePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const items = buildPageItems(currentPage, totalPages);

  return (
    <div className="border-t border-slate-100 px-5 py-3 bg-white">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
            />
          </PaginationItem>

          {items.map((item, idx) =>
            item === "ellipsis-start" || item === "ellipsis-end" ? (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={`page-${item}`}>
                <PaginationLink
                  isActive={item === currentPage}
                  onClick={() => onPageChange(item)}
                  className="cursor-pointer"
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// =============================================================================
// Main Page
// =============================================================================

export default function ModerationPage() {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false, productId: null, action: null, productName: "",
  });

  // All-products table state
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [expandedId, setExpandedId]       = useState(null);
  const [allPage, setAllPage]             = useState(1);

  // Pending table state
  const [expandedPendingId, setExpandedPendingId] = useState(null);
  const [pendingPage, setPendingPage]             = useState(1);

  useEffect(() => { fetchProducts(); }, []);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setAllPage(1);
    setExpandedId(null);
  }, [searchTerm, filterStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res   = await fetch("/api/admin/moderation", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, newStatus) => {
    try {
      setActionLoading(productId);
      const token = await getToken();
      const res   = await fetch(`/api/admin/moderation?id=${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
      );
      setExpandedPendingId(null);
      setConfirmDialog({ open: false, productId: null, action: null, productName: "" });
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openConfirm = (product, action) =>
    setConfirmDialog({ open: true, productId: product.id, action, productName: product.name });

  // ── Derived data ──────────────────────────────────────────────────────────

  const pendingProducts = useMemo(
    () => products.filter((p) => p.status === "pending"),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filterStatus]);

  // Pending pagination
  const pendingTotalPages = Math.max(1, Math.ceil(pendingProducts.length / PENDING_PAGE_SIZE));
  const pendingSlice = useMemo(() => {
    const start = (pendingPage - 1) * PENDING_PAGE_SIZE;
    return pendingProducts.slice(start, start + PENDING_PAGE_SIZE);
  }, [pendingProducts, pendingPage]);

  // All-products pagination
  const allTotalPages = Math.max(1, Math.ceil(filteredProducts.length / ALL_PRODUCTS_PAGE_SIZE));
  const allSlice = useMemo(() => {
    const start = (allPage - 1) * ALL_PRODUCTS_PAGE_SIZE;
    return filteredProducts.slice(start, start + ALL_PRODUCTS_PAGE_SIZE);
  }, [filteredProducts, allPage]);

  // When a product moves out of pending, clamp page if needed
  useEffect(() => {
    if (pendingPage > pendingTotalPages) setPendingPage(Math.max(1, pendingTotalPages));
  }, [pendingTotalPages, pendingPage]);

  const stats = useMemo(() => ({
    pending:   pendingProducts.length,
    published: products.filter((p) => p.status === "published").length,
    rejected:  products.filter((p) => p.status === "rejected").length,
    total:     products.length,
  }), [products, pendingProducts]);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-3" />
          <p className="text-slate-600">Loading moderation queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8 space-y-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Product Moderation</h1>
        <p className="text-slate-500 text-sm">Review and approve products before they go live</p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Failed to load products</p>
            <p className="text-sm text-red-700 mt-0.5">{error}</p>
            <button onClick={fetchProducts}
              className="text-sm font-medium text-red-700 underline mt-1">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Clock className="w-5 h-5" />}        label="Pending Review" value={stats.pending}   color="amber" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Published"      value={stats.published} color="green" />
        <StatCard icon={<XCircle className="w-5 h-5" />}      label="Rejected"       value={stats.rejected}  color="red"   />
        <StatCard icon={<Package className="w-5 h-5" />}      label="Total Products" value={stats.total}     color="slate" />
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── PENDING REVIEW TABLE ── */}
      {/* ════════════════════════════════════════════════════════════════════ */}

      {pendingProducts.length > 0 && (
        <section>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                {pendingProducts.length}
              </span>
              <h2 className="text-base font-semibold text-slate-900">Pending Review</h2>
            </div>
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              Requires action
            </span>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-amber-100 bg-amber-50/60">
              {["Product", "Creator", "Price", "Submitted", "Actions"].map((h) => (
                <p key={h} className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">{h}</p>
              ))}
            </div>

            <div className="divide-y divide-amber-100/70">
              {pendingSlice.map((product) => (
                <PendingRow
                  key={product.id}
                  product={product}
                  isExpanded={expandedPendingId === product.id}
                  onToggle={() =>
                    setExpandedPendingId(expandedPendingId === product.id ? null : product.id)
                  }
                  onApprove={() => openConfirm(product, "approve")}
                  onReject={()  => openConfirm(product, "reject")}
                  isLoading={actionLoading === product.id}
                />
              ))}
            </div>

            {/* Pagination footer */}
            <TablePagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={(p) => { setPendingPage(p); setExpandedPendingId(null); }}
            />
          </div>

          {/* Page info */}
          {pendingTotalPages > 1 && (
            <p className="text-xs text-slate-400 mt-2 text-right">
              Showing {(pendingPage - 1) * PENDING_PAGE_SIZE + 1}–
              {Math.min(pendingPage * PENDING_PAGE_SIZE, pendingProducts.length)} of{" "}
              {pendingProducts.length} pending
            </p>
          )}
        </section>
      )}

      {/* Empty pending state */}
      {pendingProducts.length === 0 && !loading && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm font-medium text-green-800">
            All caught up — no products pending review.
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ── ALL PRODUCTS TABLE ── */}
      {/* ════════════════════════════════════════════════════════════════════ */}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900">All Products</h2>
          <p className="text-xs text-slate-500">
            {filteredProducts.length} of {products.length} shown
          </p>
        </div>

        {/* Search + filter */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            {["Product", "Creator", "Price", "Submitted", "Status"].map((h) => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-sm">No products match your filters</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {allSlice.map((product) => (
                  <AllProductsRow
                    key={product.id}
                    product={product}
                    isExpanded={expandedId === product.id}
                    onToggle={() =>
                      setExpandedId(expandedId === product.id ? null : product.id)
                    }
                    onApprove={() => openConfirm(product, "approve")}
                    onReject={()  => openConfirm(product, "reject")}
                    isLoading={actionLoading === product.id}
                  />
                ))}
              </div>

              {/* Pagination footer */}
              <TablePagination
                currentPage={allPage}
                totalPages={allTotalPages}
                onPageChange={(p) => { setAllPage(p); setExpandedId(null); }}
              />
            </>
          )}
        </div>

        {/* Page info */}
        {allTotalPages > 1 && filteredProducts.length > 0 && (
          <p className="text-xs text-slate-400 mt-2 text-right">
            Showing {(allPage - 1) * ALL_PRODUCTS_PAGE_SIZE + 1}–
            {Math.min(allPage * ALL_PRODUCTS_PAGE_SIZE, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
        )}
      </section>

      {/* ── Confirm dialog ── */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "approve" ? "Approve Product?" : "Reject Product?"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "approve"
                ? `"${confirmDialog.productName}" will be published and visible to customers.`
                : `"${confirmDialog.productName}" will be rejected. The creator can revise and resubmit.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, productId: null, action: null, productName: "" })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const newStatus = confirmDialog.action === "approve" ? "published" : "rejected";
                updateProductStatus(confirmDialog.productId, newStatus);
              }}
              className={
                confirmDialog.action === "approve"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {confirmDialog.action === "approve" ? "Approve & Publish" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// =============================================================================
// PendingRow
// =============================================================================

function PendingRow({ product, isExpanded, onToggle, onApprove, onReject, isLoading }) {
  const thumb = product.product_images?.[0]?.image_url;

  return (
    <>
      {/* ── Row header ── */}
      <div className="group">
        {/* Mobile layout */}
        <div className="md:hidden p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-amber-50 border border-amber-100 shrink-0">
              {thumb
                ? <Image src={thumb} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                : <Package className="w-full h-full p-2 text-amber-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
              <p className="text-[11px] text-slate-500">
                {product.profiles?.display_name || "Unknown"} · {formatDate(product.created_at)}
              </p>
            </div>
            <button onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 transition-colors">
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div className="flex gap-2">
            <Button onClick={onApprove} disabled={isLoading} size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white h-8 text-xs">
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3.5 h-3.5 mr-1" /> Approve</>}
            </Button>
            <Button onClick={onReject} disabled={isLoading} size="sm" variant="destructive"
              className="flex-1 h-8 text-xs">
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><X className="w-3.5 h-3.5 mr-1" /> Reject</>}
            </Button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 hover:bg-amber-50/40 transition-colors">
          {/* Product */}
          <button onClick={onToggle} className="flex items-center gap-3 min-w-0 text-left">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-amber-50 border border-amber-100 shrink-0">
              {thumb
                ? <Image src={thumb} alt={product.name} width={36} height={36} className="w-full h-full object-cover" />
                : <Package className="w-full h-full p-2 text-amber-400" />}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
              <p className="text-[10px] text-slate-400">{product.type}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          {/* Creator */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <User className="w-3 h-3 text-slate-500" />
            </div>
            <p className="text-sm text-slate-600 truncate">
              {product.profiles?.display_name || "Unknown"}
            </p>
          </div>

          {/* Price */}
          <p className="text-sm font-semibold text-slate-900">{formatPrice(product.price)}</p>

          {/* Date */}
          <p className="text-sm text-slate-500">{formatDate(product.created_at)}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={onApprove} disabled={isLoading} size="sm"
              className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs">
              {isLoading
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <><Check className="w-3 h-3 mr-1" /> Approve</>}
            </Button>
            <Button onClick={onReject} disabled={isLoading} size="sm"
              variant="destructive" className="h-7 px-3 text-xs">
              {isLoading
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <><X className="w-3 h-3 mr-1" /> Reject</>}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {isExpanded && (
        <div className="border-t border-amber-100 bg-amber-50/30 px-5 py-4 space-y-4 animate-in slide-in-from-top-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            {product.product_images?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Images ({product.product_images.length})
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {product.product_images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg bg-slate-200 overflow-hidden">
                      <Image src={img.image_url} alt={img.alt_text || `Image ${idx + 1}`}
                        width={100} height={100} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="space-y-3">
              <DetailItem label="Price"       value={formatPrice(product.price)} />
              {product.original_price && (
                <DetailItem label="Original Price" value={formatPrice(product.original_price)} />
              )}
              <DetailItem label="Type"        value={
                product.type === "digital" ? "Digital Product"
                : product.type === "physical" ? "Physical Product" : "Service"
              } />
              <DetailItem label="Creator"     value={product.profiles?.display_name || "Unknown"} />
              <DetailItem label="Submitted"   value={new Date(product.created_at).toLocaleString("en-IN")} />
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Description
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// =============================================================================
// AllProductsRow
// =============================================================================

function AllProductsRow({ product, isExpanded, onToggle, onApprove, onReject, isLoading }) {
  const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.draft;
  const StatusIcon = statusCfg.icon;
  const thumb = product.product_images?.[0]?.image_url;

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden p-4 space-y-2 hover:bg-slate-50/60 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {thumb
              ? <Image src={thumb} alt={product.name} width={36} height={36} className="w-full h-full object-cover" />
              : <Package className="w-full h-full p-2 text-slate-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
            <p className="text-[11px] text-slate-400">
              {product.profiles?.display_name || "Unknown"}
            </p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium
            ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </div>
          <button onClick={onToggle} className="p-1 text-slate-400">
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer"
        onClick={onToggle}>
        {/* Product */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {thumb
              ? <Image src={thumb} alt={product.name} width={36} height={36} className="w-full h-full object-cover" />
              : <Package className="w-full h-full p-2 text-slate-400" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
            <p className="text-[10px] text-slate-400">
              {product.type} · {formatDate(product.created_at)}
            </p>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>

        {/* Creator */}
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <p className="text-sm text-slate-600 truncate">
            {product.profiles?.display_name || "Unknown"}
          </p>
        </div>

        {/* Price */}
        <p className="text-sm font-semibold text-slate-900">{formatPrice(product.price)}</p>

        {/* Date */}
        <p className="text-sm text-slate-500">{formatDate(product.created_at)}</p>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap
          ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
          <StatusIcon className="w-3 h-3" />
          {statusCfg.label}
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-4 space-y-4 animate-in slide-in-from-top-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.product_images?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Images ({product.product_images.length})
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {product.product_images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-200">
                      <Image src={img.image_url} alt={img.alt_text || `Image ${idx + 1}`}
                        width={100} height={100} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3">
              <DetailItem label="Price"   value={formatPrice(product.price)} />
              {product.original_price && (
                <DetailItem label="Original Price" value={formatPrice(product.original_price)} />
              )}
              <DetailItem label="Type"    value={
                product.type === "digital" ? "Digital Product"
                : product.type === "physical" ? "Physical Product" : "Service"
              } />
              <DetailItem label="Creator" value={product.profiles?.display_name || "Unknown"} />
              <DetailItem label="Status"  value={statusCfg.label} />
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Allow approve/reject from all-products table too if still pending */}
          {product.status === "pending" && (
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button onClick={onApprove} disabled={isLoading} size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs">
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3 mr-1" /> Approve</>}
              </Button>
              <Button onClick={onReject} disabled={isLoading} size="sm"
                variant="destructive" className="h-7 px-3 text-xs">
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><X className="w-3 h-3 mr-1" /> Reject</>}
              </Button>
            </div>
          )}

          {product.status === "published" && (
            <p className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              ✓ Approved and live
            </p>
          )}
          {product.status === "rejected" && (
            <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              ✗ Rejected — creator can revise and resubmit
            </p>
          )}
          {product.status === "draft" && (
            <p className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              ℹ Draft — creator hasn&apos;t submitted for review yet
            </p>
          )}
        </div>
      )}
    </>
  );
}

// =============================================================================
// Shared small components
// =============================================================================

function StatCard({ icon, label, value, color }) {
  const cls = {
    amber: "bg-amber-50 border-amber-200 text-amber-600",
    green: "bg-green-50 border-green-200 text-green-600",
    red:   "bg-red-50 border-red-200 text-red-600",
    slate: "bg-slate-50 border-slate-200 text-slate-600",
  };
  return (
    <div className={`p-4 rounded-xl border ${cls[color] ?? cls.slate}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium opacity-75 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="opacity-20">{icon}</div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-slate-800 font-medium mt-0.5">{value}</p>
    </div>
  );
}