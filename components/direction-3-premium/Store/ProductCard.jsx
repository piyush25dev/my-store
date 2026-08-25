// components/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Loader2, Copy, Check, Twitter, Linkedin, Mail, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { getAccessToken } from "@/lib/utils/getAccessToken";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ProductCard({ product, getProductLink }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_role")
          .eq("id", user.id)
          .single();
        
        setUserRole(profile?.user_role || null);
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };
    fetchUserRole();
  }, []);

  const shouldHideWishlist = userRole === 'creator' || userRole === 'admin';

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100/50 hover:border-gray-200/80">
      <ProductCardImage 
        product={product} 
        shouldHideWishlist={shouldHideWishlist} 
      />
      
      <div className="p-5">
        <ProductCardInfo product={product} />
        <ProductCardPrice product={product} />
        <ProductCardActions 
          product={product} 
          getProductLink={getProductLink} 
          shouldHideWishlist={shouldHideWishlist} 
        />
      </div>
    </div>
  );
}

function ProductCardImage({ product, shouldHideWishlist }) {
  const router = useRouter();
  const { wishlist, add, remove, isInWishlist } = useWishlist();
  const [saving, setSaving] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const saved = isInWishlist(product.id);
  const wishlistEntry = wishlist.find(
    (item) => String(item.product_id) === String(product.id)
  );

  async function handleWishlistToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      await getAccessToken();
    } catch (err) {
      setShowLoginDialog(true);
      return;
    }

    setSaving(true);
    try {
      if (saved && wishlistEntry) {
        await remove(wishlistEntry.id);
      } else {
        await add(product.id);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category Badge */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-full">
            <Sparkles className="h-3 w-3" />
            {product.type}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute right-4 top-4">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
            product.in_stock 
              ? "bg-emerald-500/90 text-white" 
              : "bg-gray-500/90 text-white"
          }`}>
            {product.in_stock ? "In Stock" : "Sold Out"}
          </span>
        </div>

        {/* Wishlist Button */}
        {!shouldHideWishlist && (
          <button
            onClick={handleWishlistToggle}
            disabled={saving}
            className={`absolute right-4 bottom-4 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
              saved 
                ? "bg-rose-500 text-white scale-110" 
                : "bg-white/90 text-gray-600 hover:bg-white hover:scale-110"
            }`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
            )}
          </button>
        )}
      </div>

      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign In Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to add items to your wishlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/auth/login")}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProductCardInfo({ product }) {
  return (
    <div className="mb-3">
      <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
        {product.tagline}
      </p>
    </div>
  );
}

function ProductCardPrice({ product }) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
        )}
      </div>
      {discount > 0 && (
        <Badge className="bg-rose-500 hover:bg-rose-600 border-0 text-white">
          -{discount}%
        </Badge>
      )}
    </div>
  );
}

function ProductCardActions({ product, getProductLink, shouldHideWishlist }) {
  if (!product.in_stock) {
    return (
      <Button disabled className="w-full bg-gray-100 text-gray-400 hover:bg-gray-100 rounded-lg cursor-not-allowed">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={getProductLink(product.id)} className="flex-1">
        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-300">
          View Details
        </Button>
      </Link>
      {!shouldHideWishlist && <ShareButton product={product} getProductLink={getProductLink} />}
    </div>
  );
}

function ShareButton({ product, getProductLink }) {
  const [copied, setCopied] = useState(false);
  const productUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${getProductLink(product.id)}` 
    : "";

  const shareText = `Check out ${product.name} - ${product.tagline}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + "\n\n" + productUrl)}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-lg border-gray-200 hover:border-gray-300 hover:bg-gray-50 h-10 w-10">
          <Share2 className="h-4 w-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500">
          Share Product
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500">
          Share On
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={() => window.open(shareLinks.twitter, "_blank", "width=550,height=420")}>
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          <span>Twitter</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => window.open(shareLinks.linkedin, "_blank", "width=550,height=420")}>
          <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => window.location.href = shareLinks.email}>
          <Mail className="mr-2 h-4 w-4 text-gray-600" />
          <span>Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}