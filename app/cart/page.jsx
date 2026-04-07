"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  PackageOpen,
  Shield,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cart, total, itemCount, loading, remove, updateQuantity, clear } =
    useCart();
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await remove(id);
    } finally {
      setRemovingId(null);
    }
  };

  const handleQuantity = async (id, qty) => {
    setUpdatingId(id);
    try {
      await updateQuantity(id, qty);
    } finally {
      setUpdatingId(null);
    }
  };

  const shipping = total > 499 ? 0 : 49;
  const grandTotal = (total / 100) + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
          <p className="font-sans text-sm text-stone-500">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-stone-900">Your Cart</h1>
            <p className="font-sans text-sm text-stone-400 mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans">Continue Shopping</span>
          </Link>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center mb-5">
              <PackageOpen className="w-9 h-9 text-stone-300" />
            </div>
            <h2 className="font-display text-2xl text-stone-800 mb-2">
              Your cart is empty
            </h2>
            <p className="font-sans text-sm text-stone-400 mb-6 max-w-xs">
              Looks like you haven&apos;t added anything yet. Browse the store
              to find something you&apos;ll love.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-sm font-sans font-semibold rounded-full hover:bg-stone-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Cart items ── */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => {
                const product = item.products;
                const variant = item.product_variants;
                const image =
                  product?.product_images?.find((img) => img.is_primary) ||
                  product?.product_images?.[0];
                const itemPrice =
                  ((product?.price || 0) + (variant?.price_modifier || 0)) /
                  100;
                const isRemoving = removingId === item.id;
                const isUpdating = updatingId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4 sm:p-5 flex gap-4 transition-all duration-300 ${isRemoving ? "opacity-40 scale-95" : ""}`}
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${product?.slug}`}
                      className="shrink-0"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60">
                        {image?.image_url ? (
                          <Image
                            src={image.image_url}
                            alt={image.alt_text || product?.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-stone-300" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/product/${product?.slug}`}>
                            <p className="font-sans font-semibold text-stone-800 text-sm leading-snug hover:text-rose-700 transition-colors line-clamp-2">
                              {product?.name}
                            </p>
                          </Link>
                          {variant && (
                            <p className="font-sans text-xs text-stone-400 mt-0.5">
                              {variant.label}
                            </p>
                          )}
                          <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mt-1">
                            {product?.type}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isRemoving}
                          className="shrink-0 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isRemoving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Quantity + price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-lg p-0.5">
                          <button
                            onClick={() =>
                              handleQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || isUpdating}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-stone-500 hover:text-stone-900 hover:bg-white transition-colors disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-sans text-sm font-semibold text-stone-800 w-7 text-center">
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantity(item.id, item.quantity + 1)
                            }
                            disabled={isUpdating}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-stone-500 hover:text-stone-900 hover:bg-white transition-colors disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-base text-stone-900">
                            ₹{(itemPrice * item.quantity).toLocaleString()}{" "}
                          </p>
                          {item.quantity > 1 && (
                            <p className="font-sans text-[10px] text-stone-400">
                              ₹{itemPrice.toLocaleString()} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear cart */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={clear}
                  className="font-sans text-xs text-stone-400 hover:text-red-500 transition-colors underline underline-offset-2"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden sticky top-24">
                <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-5 py-4">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                    Order Summary
                  </p>
                  <p className="font-display text-2xl text-white">
                    ₹{grandTotal.toLocaleString()}
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-stone-500">
                        Subtotal ({itemCount} items)
                      </span>
                      <span className="text-stone-800 font-medium">
                        ₹{(total / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-stone-500">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-medium">
                          Free
                        </span>
                      ) : (
                        <span className="text-stone-800 font-medium">
                          ₹{shipping.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {shipping > 0 && (
                      <p className="font-sans text-[10px] text-stone-400 bg-stone-50 rounded-lg px-3 py-2">
                        Add ₹{(499 - total).toLocaleString()} more for free
                        shipping
                      </p>
                    )}
                    <div className="border-t border-stone-100 pt-2.5 flex justify-between">
                      <span className="font-sans font-semibold text-stone-800">
                        Total
                      </span>
                      <span className="font-display text-xl text-stone-900">
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-sans font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
                    {[
                      { icon: Shield, label: "Secure" },
                      { icon: RotateCcw, label: "30-day returns" },
                      { icon: Zap, label: "Instant access" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl bg-stone-50"
                      >
                        <Icon className="w-3.5 h-3.5 text-stone-400" />
                        <p className="font-sans text-[9px] text-stone-400 text-center leading-tight">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
