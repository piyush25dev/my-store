"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, LayoutDashboard, ChevronDown, User } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/hooks/useCart";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { itemCount } = useCart();

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, user_role, avatar_url")
      .eq("id", userId)
      .single();
    if (data) setProfile(data);
  };
  // ── Fetch session + profile ──────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setDropdownOpen(false);
    router.push("/");
  };

  // ── Dashboard URL ────────────────────────────────────────────────────────
  const dashboardUrl = `/dashboard/${profile?.user_role || "customer"}/overview`;

  // ── Avatar initials ──────────────────────────────────────────────────────
  const name = profile?.display_name || "";

  const initials = name
    ? name
        .split(" ")
        .map((n) => n?.[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "?");

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-stone-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-semibold text-stone-900 text-lg tracking-tight">
              Store
            </span>
          </Link>

          {/* ── Nav Links ── */}
          {/* <div className="hidden md:flex items-center gap-6">
            <Link
              href="/store"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium"
            >
              Browse
            </Link>
            <Link
              href="/store?type=digital"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium"
            >
              Digital
            </Link>
            <Link
              href="/store?type=physical"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium"
            >
              Physical
            </Link>
          </div> */}

          {/* ── Auth Section ── */}
          <div className="flex items-center gap-3">
            {loading ? (
              // skeleton
              <div className="w-9 h-9 rounded-full bg-stone-100 animate-pulse" />
            ) : user ? (
              // ── Logged in ──
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-stone-100 transition-colors group"
                  >
                    {/* Avatar */}
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-rose-200">
                        {initials}
                      </div>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* ── Dropdown ── */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-stone-200/60 shadow-xl shadow-stone-200/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info */}
                      <div className="px-4 py-3.5 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          {profile?.avatar_url ? (
                            <Image
                              src={profile.avatar_url}
                              alt="avatar"
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-rose-200">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            {profile?.display_name && (
                              <p className="text-sm font-semibold text-stone-900 truncate">
                                {profile.display_name}
                              </p>
                            )}
                            {/* <p className="text-xs text-stone-500 truncate">
                            {user.email}
                          </p> */}
                            {profile?.user_role && (
                              <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 capitalize">
                                {profile.user_role}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        <Link
                          href={dashboardUrl}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-stone-400" />
                          Dashboard
                          <span className="ml-auto text-xs text-stone-400 capitalize">
                            {profile?.user_role || "customer"}
                          </span>
                        </Link>

                        {/* <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        Profile
                      </Link> */}

                        <div className="my-1 border-t border-stone-100" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/cart"
                  className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              // ── Logged out ──
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 px-4 py-2 rounded-full shadow-md shadow-rose-200 transition-all hover:shadow-rose-300 hover:scale-105"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
