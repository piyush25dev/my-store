// ─── utils.js ─────────────────────────────────────────────────────────────────

import { supabase } from "@/lib/supabase";
import { Globe, EyeOff } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

export const STATUS_STYLE = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-500",
};

export const STATUS_OPTIONS = [
  { value: "published", label: "Published", icon: Globe, cls: "text-emerald-600" },
  { value: "draft", label: "Draft", icon: EyeOff, cls: "text-slate-500" },
];

export const PRODUCT_TYPES = [
  { value: "digital", label: "Digital Product" },
  { value: "physical", label: "Physical Product" },
  { value: "service", label: "Service" },
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
  const { data: { session }, error } = await supabase.auth.getSession();
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