"use client";

// ─── utils.js ─────────────────────────────────────────────────────────────────

import { supabase } from "@/lib/supabase";
import { Globe, EyeOff, Clock, XCircle } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

export const STATUS_STYLE = {
  published: "bg-emerald-100 text-emerald-700",
  draft:     "bg-slate-100 text-slate-500",
  pending:   "bg-amber-100 text-amber-700",
  rejected:  "bg-red-100 text-red-600",
};

// Statuses only the admin can set — creator sees a static badge, not a dropdown
export const ADMIN_CONTROLLED_STATUSES = ["pending", "published", "rejected"];

export const STATUS_OPTIONS = [
  {
    value: "published",
    label: "Published",
    icon: Globe,
    cls: "text-emerald-600",
    description: "Approved & live",
  },
  {
    value: "pending",
    label: "Pending Review",
    icon: Clock,
    cls: "text-amber-600",
    description: "Awaiting admin approval",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    cls: "text-red-600",
    description: "Rejected by admin",
  },
  {
    value: "draft",
    label: "Draft",
    icon: EyeOff,
    cls: "text-slate-500",
    description: "Saved, not submitted",
  },
];

export const PRODUCT_TYPES = [
  { value: "digital",  label: "Digital Product" },
  { value: "physical", label: "Physical Product" },
  { value: "service",  label: "Service" },
];

export const INITIAL_FORM = {
  name: "",
  slug: "",
  description: "",
  short_description: "",
  type: "digital",
  price: "",
  original_price: "",
  currency: "INR",
  featured: false,
  digital_delivery_url: "",
  digital_license_type: "personal",
  lifetime_updates: false,
  stock_quantity: "",
  delivery_days: "",
  weight_grams: "",
  dimensions: { length: "", width: "", height: "" },
};

export const inputCls =
  "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ base64: reader.result.split(",")[1], mimeType: file.type });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session?.access_token) throw new Error("Not authenticated");
  return session.access_token;
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

export function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}