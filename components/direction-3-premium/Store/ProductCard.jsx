// components/ProductCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Loader2, Copy, Check, Twitter, Linkedin, Mail } from "lucide-react";
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
  const [loadingRole, setLoadingRole] = useState(true);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoadingRole(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
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
  const shouldHideWishlist = userRole === 'creator' || userRole === 'admin';

  return (
    <Card className="group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <CardHeader className="p-0">
        <ProductCardImage product={product} shouldHideWishlist={shouldHideWishlist} loadingRole={loadingRole} />
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <ProductCardInfo product={product} />
        <ProductCardPrice product={product} />
      </CardContent>

      <CardFooter className="p-6">
        <ProductCardActions product={product} getProductLink={getProductLink} shouldHideWishlist={shouldHideWishlist} />
      </CardFooter>
    </Card>
  );
}

function ProductCardImage({ product, shouldHideWishlist, loadingRole }) {
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
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Top badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <Badge className="w-fit border-0 bg-white/90 !text-black group-hover:!text-white group-hover:!bg-black transition-colors duration-300 shadow-sm">
            {product.type}
          </Badge>
          {!product.in_stock && (
            <Badge variant="destructive" className="w-fit">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Heart button — only visible if user is NOT creator/admin, and visible on hover or when saved */}
        {!shouldHideWishlist && !loadingRole && (
          <div
            className={`absolute right-4 top-4 transition-all duration-300 ${
              saved ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={handleWishlistToggle}
              disabled={saving}
              className={`h-8 w-8 rounded-full transition-all ${
                saved
                  ? "text-rose-500 bg-rose-50"
                  : "text-stone-400 bg-white hover:text-rose-500 hover:bg-rose-50"
              }`}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${saved ? "fill-rose-500" : ""}`} />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign In Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to add items to your wishlist. It only takes a moment!
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

function ProductCardInfo({ product }) {
  return (
    <div>
      <h4 className="mb-1 text-lg font-semibold text-gray-900">{product.name}</h4>
      <p className="text-sm text-gray-600">{product.tagline}</p>
    </div>
  );
}

function ProductCardPrice({ product }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
        {product.originalPrice && (
          <span className="ml-2 text-sm text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
        )}
      </div>
    </div>
  );
}

function ProductCardActions({ product, getProductLink, shouldHideWishlist }) {
  if (product.in_stock) {
    return (
      <div className={`flex w-full items-center ${shouldHideWishlist ? 'justify-center' : 'justify-between'}`}>
        <Link href={getProductLink(product.id)} className={shouldHideWishlist ? 'w-full' : 'flex-1'}>
          <Button
            variant="outline"
            className={`${shouldHideWishlist ? 'w-full' : 'w-full'} border-gray-300 hover:bg-gray-50 hover:border-gray-400`}
          >
            View Details
          </Button>
        </Link>
        {!shouldHideWishlist && (
          <ShareButton product={product} getProductLink={getProductLink} />
        )}
      </div>
    );
  }

  return (
    <Button disabled className="w-full bg-gray-100 text-gray-500 hover:bg-gray-100">
      Currently Unavailable
    </Button>
  );
}

function ShareButton({ product, getProductLink }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const productUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${getProductLink(product.id)}` 
    : "";

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
      shareText
    )}&url=${encodeURIComponent(productUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  }

  function handleLinkedInShare() {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      productUrl
    )}`;
    window.open(linkedinUrl, "_blank", "width=550,height=420");
  }

  function handleEmailShare() {
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      product.name
    )}&body=${encodeURIComponent(shareText + "\n\n" + productUrl)}`;
    window.location.href = emailUrl;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="ml-2 h-10 w-10">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500">
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
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500">
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
          <Mail className="mr-2 h-4 w-4 text-gray-600" />
          <span>Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}