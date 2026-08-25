// V2ProductHeader.jsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Star,
  Eye,
  TrendingUp,
  Package,
  Download,
  Clock,
  Loader2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
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

const MOCK_STATS = {
  rating: 4.8,
  reviews: 142,
  sales: 1247,
  downloads: 2891,
  views: "1.2k",
};

export function V2ProductHeader({ product }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const { wishlist, add, remove, isInWishlist } = useWishlist();
  const [saving, setSaving] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const saved = isInWishlist(product.id);
  const wishlistEntry = wishlist.find(
    (item) => String(item.product_id) === String(product.id),
  );

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoadingRole(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setUserRole(null);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user role:", profileError);
          setUserRole(null);
          return;
        }

        setUserRole(profileData?.user_role || null);
      } catch (err) {
        console.error("Error in fetchUserRole:", err);
        setUserRole(null);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  // Hide wishlist if user is creator or admin
  const shouldHideWishlist = userRole === "creator" || userRole === "admin";

  async function handleWishlistToggle() {
    // Check if user is logged in
    try {
      await getAccessToken();
    } catch (err) {
      // User is not authenticated
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

  function handleLoginRedirect() {
    router.push("/auth/login");
    setShowLoginDialog(false);
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-7">
            {/* Image + thumbnails */}
            <div className="md:w-[42%] shrink-0">
              <div className="group relative aspect-square rounded-xl overflow-hidden bg-stone-50 border border-stone-200/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.12)]">
                <Image
                  src={product?.product_images?.[0]?.image_url || null}
                  alt={product?.product_images?.[0]?.alt_text || product?.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {discount > 0 && (
                  <Badge className="absolute top-3 left-3 bg-rose-500 text-white border-0 font-sans text-[10px] px-2 transition-all duration-300 group-hover:bg-black group-hover:scale-105">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Thumbnails in a single horizontal line */}
              {product?.product_images?.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
                  {product.product_images.slice(1).map((image, index) => (
                    <div
                      key={image.id || index}
                      className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg bg-stone-100 border border-stone-200/60 cursor-pointer hover:border-rose-300 transition-colors overflow-hidden"
                    >
                      <Image
                        src={image.image_url}
                        alt={
                          image.alt_text ||
                          `${product?.name} thumbnail ${index + 1}`
                        }
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5">
              {/* Type badge + actions */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-2.5 border-rose-200 bg-rose-50/50 text-rose-700 font-sans text-[10px] tracking-widest uppercase"
                  >
                    {product.type}
                  </Badge>
                  <h1 className="font-display text-2xl sm:text-3xl text-stone-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="font-sans text-sm text-stone-500 mt-1.5 leading-relaxed">
                    {product.tagline}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {/* Wishlist button - only show if NOT creator/admin */}
                  {!shouldHideWishlist && !loadingRole && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleWishlistToggle}
                      disabled={saving}
                      className={`h-8 w-8 rounded-full transition-all ${
                        saved
                          ? "text-rose-500 bg-rose-50"
                          : "text-stone-400 hover:text-rose-500 hover:bg-rose-50"
                      }`}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 ${saved ? "fill-rose-500" : ""}`}
                        />
                      )}
                    </Button>
                  )}
                  <ShareDropdown
                    product={product}
                    shouldHideWishlist={shouldHideWishlist}
                  />
                </div>
              </div>

              {/* Rating + stat row */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(MOCK_STATS.rating) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-stone-800">
                    {MOCK_STATS.rating}
                  </span>
                  <span className="text-stone-400">({MOCK_STATS.reviews})</span>
                </div>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1 text-stone-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{MOCK_STATS.views} views</span>
                </div>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{MOCK_STATS.sales} sales</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-display text-4xl text-stone-900">
                    ₹{(product.price / 100).toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="font-sans text-lg text-stone-400 line-through">
                      ₹{(product.originalPrice / 100).toLocaleString()}
                    </span>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-rose-50 text-rose-600 border border-rose-200 font-sans text-xs">
                      Save ₹
                      {(product.originalPrice - product.price).toLocaleString()}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-stone-500 font-sans">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    {product.details?.format}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    {MOCK_STATS.downloads} downloads
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Updated 2 days ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign In Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to add items to your wishlist. It only takes a
              moment!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ShareDropdown({ product, shouldHideWishlist }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const productUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText = `Check out ${product.name} - ${product.tagline}`;

  // Handle native share API (mobile)
  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share error:", err);
        }
      }
    }
  }

  // Copy link to clipboard
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  }

  // Social media share functions
  function handleTwitterShare() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(productUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  }

  function handleLinkedInShare() {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      productUrl,
    )}`;
    window.open(linkedinUrl, "_blank", "width=550,height=420");
  }

  function handleEmailShare() {
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      product.name,
    )}&body=${encodeURIComponent(shareText + "\n\n" + productUrl)}`;
    window.location.href = emailUrl;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full text-stone-400 hover:text-blue-500 hover:bg-blue-50"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-stone-500">
          Share Product
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Native Share (shown only on devices that support it) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Copy Link */}
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

        {/* Social Media Options */}
        <DropdownMenuLabel className="text-xs font-semibold text-stone-500">
          Share On
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          <span>Twitter</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLinkedInShare}>
          <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="mr-2 h-4 w-4 text-stone-600" />
          <span>Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
