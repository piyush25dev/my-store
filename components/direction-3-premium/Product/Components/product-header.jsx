// ProductHeader.jsx
"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Star, Loader2, Copy, Check, Twitter, Linkedin, Mail } from "lucide-react";
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

export function ProductHeader({ product }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const { wishlist, add, remove, isInWishlist } = useWishlist();
  const [saving, setSaving] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const saved = isInWishlist(product.id);
  const wishlistEntry = wishlist.find(
    (item) => String(item.product_id) === String(product.id)
  );

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="border-rose-200/50 bg-rose-50/50 text-rose-700 backdrop-blur-sm"
            >
              {product.type}
            </Badge>
            {product.in_stock ? (
              <Badge
                variant="outline"
                className="border-emerald-200/50 bg-emerald-50/50 text-emerald-700 backdrop-blur-sm"
              >
                In Stock
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-amber-200/50 bg-amber-50/50 text-amber-700 backdrop-blur-sm"
              >
                Low Stock
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
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
                  <Heart className={`h-4 w-4 ${saved ? "fill-rose-500" : ""}`} />
                )}
              </Button>
            )}
            <ShareDropdown product={product} shouldHideWishlist={shouldHideWishlist} />
          </div>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
          {product.name}
        </h1>
        <p className="text-lg lg:text-xl text-gray-600">{product.tagline}</p>

        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 lg:h-5 lg:w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm text-gray-600">(48 reviews)</span>
        </div>
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

function ShareDropdown({ product, shouldHideWishlist }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const productUrl = typeof window !== "undefined"
    ? window.location.href
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
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full text-stone-400 hover:text-blue-500 hover:bg-blue-50"
        >
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
          <Mail className="mr-2 h-4 w-4 text-stone-600" />
          <span>Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}