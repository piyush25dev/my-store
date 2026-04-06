"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Plus,
  Star,
  Eye,
  TrendingUp,
  X,
  AlertCircle,
  Loader,
  Upload,
  Trash2,
  Pencil,
  Globe,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-500",
};

const STATUS_OPTIONS = [
  {
    value: "published",
    label: "Published",
    icon: Globe,
    cls: "text-emerald-600",
  },
  { value: "draft", label: "Draft", icon: EyeOff, cls: "text-slate-500" },
];

const PRODUCT_TYPES = [
  { value: "digital", label: "Digital Product" },
  { value: "physical", label: "Physical Product" },
  { value: "service", label: "Service" },
];

const INITIAL_FORM = {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ base64: reader.result.split(",")[1], mimeType: file.type });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session?.access_token) throw new Error("Not authenticated");
  return session.access_token;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Field({ label, required, hint, children }) {
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

const inputCls =
  "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white";

// ─── Image Upload Panel ───────────────────────────────────────────────────────
// Handles both new File uploads and existing image_url previews

function ImageUploadPanel({ images, onChange }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const addFiles = (files) => {
    const fresh = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        is_primary: false,
      }));
    if (!fresh.length) return;
    onChange((prev) => {
      const all = [...prev, ...fresh];
      if (!all.some((i) => i.is_primary)) all[0].is_primary = true;
      return all;
    });
  };

  const remove = (idx) =>
    onChange((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (prev[idx].is_primary && next.length) next[0].is_primary = true;
      return next;
    });

  const setPrimary = (idx) =>
    onChange((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === idx })),
    );

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors
          ${drag ? "border-slate-400 bg-slate-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"}`}
      >
        <Upload className="w-5 h-5 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">
          Drop images or <span className="underline">browse</span>
        </p>
        <p className="text-xs text-slate-400">PNG, JPG, WEBP · max 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setPrimary(idx)}
              className={`relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-colors
                ${img.is_primary ? "border-slate-700" : "border-slate-200 hover:border-slate-300"}`}
            >
              <Image
                src={img.preview || img.image_url}
                alt=""
                width={300}
                height={300}
                className="w-full aspect-square object-cover"
              />
              {img.is_primary && (
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-semibold text-center py-0.5">
                  PRIMARY
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(idx);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <p className="text-xs text-slate-400">
          Click an image to set it as primary.
        </p>
      )}
    </div>
  );
}

// ─── Type-specific field sections ─────────────────────────────────────────────

function DigitalFields({ formData, onChange }) {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Digital Options
      </p>
      <Field label="Delivery URL" hint="Direct download or external link">
        <input
          type="url"
          name="digital_delivery_url"
          value={formData.digital_delivery_url}
          onChange={onChange}
          placeholder="https://…"
          className={inputCls}
        />
      </Field>
      <Field label="License Type">
        <select
          name="digital_license_type"
          value={formData.digital_license_type}
          onChange={onChange}
          className={inputCls}
        >
          <option value="personal">Personal</option>
          <option value="commercial">Commercial</option>
          <option value="extended">Extended</option>
        </select>
      </Field>
      <div className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          name="lifetime_updates"
          id="lifetime_updates"
          checked={formData.lifetime_updates}
          onChange={onChange}
          className="w-4 h-4 rounded border-slate-300 accent-slate-800 cursor-pointer"
        />
        <label
          htmlFor="lifetime_updates"
          className="text-sm font-medium text-slate-700 cursor-pointer"
        >
          Lifetime updates included
        </label>
      </div>
    </div>
  );
}

function PhysicalFields({ formData, onChange, onDim }) {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Physical Options
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Stock Quantity">
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={onChange}
            min="0"
            placeholder="100"
            className={inputCls}
          />
        </Field>
        <Field label="Delivery Days">
          <input
            type="number"
            name="delivery_days"
            value={formData.delivery_days}
            onChange={onChange}
            min="1"
            placeholder="5"
            className={inputCls}
          />
        </Field>
        <Field label="Weight (grams)">
          <input
            type="number"
            name="weight_grams"
            value={formData.weight_grams}
            onChange={onChange}
            min="0"
            placeholder="500"
            className={inputCls}
          />
        </Field>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1.5">
          Dimensions (cm)
        </p>
        <div className="grid grid-cols-3 gap-2">
          {["length", "width", "height"].map((dim) => (
            <div key={dim}>
              <p className="text-[10px] text-slate-400 capitalize mb-1">
                {dim}
              </p>
              <input
                type="number"
                min="0"
                value={formData.dimensions[dim]}
                onChange={(e) => onDim(dim, e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceFields({ formData, onChange }) {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Service Options
      </p>
      <Field label="Turnaround Days" hint="How long to complete this service">
        <input
          type="number"
          name="delivery_days"
          value={formData.delivery_days}
          onChange={onChange}
          min="1"
          placeholder="3"
          className={inputCls}
        />
      </Field>
    </div>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({ productId, currentStatus, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = async (newStatus) => {
    if (newStatus === currentStatus) {
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(false);
    try {
      const token = await getToken();
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      onStatusChange(productId, newStatus);
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const current =
    STATUS_OPTIONS.find((o) => o.value === currentStatus) ?? STATUS_OPTIONS[1];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all
          ${STATUS_STYLE[currentStatus] ?? "bg-slate-100 text-slate-500"}
          ${loading ? "opacity-50" : "hover:opacity-80 cursor-pointer"}`}
      >
        {loading ? (
          <Loader className="w-3 h-3 animate-spin" />
        ) : (
          <current.icon className="w-3 h-3" />
        )}
        {current.label}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[120px]">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors
                ${opt.value === currentStatus ? "font-semibold" : ""} ${opt.cls}`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
              {opt.value === currentStatus && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({ product, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const confirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`/api/products?id=${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      onDeleted(product.id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200/60 shadow-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Delete product?</h3>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-medium text-slate-700">
                  &quot;{product.name}&quot;
                </span>{" "}
                will be removed. This action cannot be undone.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Product Modal (Create + Edit + Details) ─────────────────────────────────
//
// Tab 1 "Basic"   — name, price, type-specific fields, images  (always shown)
// Tab 2 "Details" — FAQs, Highlights, Spec Details, Variants   (edit-only)

// ── Details tab helpers ───────────────────────────────────────────────────────

function ListEditor({
  items,
  onChange,
  renderRow,
  emptyLabel,
  addLabel,
  newItem,
}) {
  const add = () => onChange([...items, { ...newItem, _key: Date.now() }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    onChange(
      items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)),
    );

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
          {emptyLabel}
        </p>
      )}
      {items.map((item, i) => (
        <div
          key={item._key ?? item.id ?? i}
          className="p-3 border border-slate-200 rounded-lg bg-slate-50/60 space-y-2"
        >
          {renderRow(item, i, update, remove)}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}

function FaqsEditor({ items, onChange }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      emptyLabel="No FAQs yet — add one below"
      addLabel="Add FAQ"
      newItem={{ question: "", answer: "" }}
      renderRow={(item, i, update, remove) => (
        <>
          <div className="flex items-start gap-2">
            <input
              value={item.question}
              onChange={(e) => update(i, "question", e.target.value)}
              placeholder="Question"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={item.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            placeholder="Answer"
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </>
      )}
    />
  );
}

function HighlightsEditor({ items, onChange }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      emptyLabel="No highlights yet — add one below"
      addLabel="Add Highlight"
      newItem={{ highlight_text: "", icon_name: "" }}
      renderRow={(item, i, update, remove) => (
        <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
          <input
            value={item.icon_name || ""}
            onChange={(e) => update(i, "icon_name", e.target.value)}
            placeholder="Icon"
            className={`${inputCls} w-16`}
          />
          <input
            value={item.highlight_text || ""}
            onChange={(e) => update(i, "highlight_text", e.target.value)}
            placeholder="Highlight text"
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    />
  );
}

function DetailsEditor({ items, onChange }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      emptyLabel="No spec details yet — add one below"
      addLabel="Add Detail"
      newItem={{ detail_key: "", detail_value: "", detail_category: "" }}
      renderRow={(item, i, update, remove) => (
        <>
          <div className="flex items-center gap-2">
            <input
              value={item.detail_key || ""}
              onChange={(e) => update(i, "detail_key", e.target.value)}
              placeholder="Key (e.g. File size)"
              className={`${inputCls} flex-1`}
            />
            <input
              value={item.detail_value || ""}
              onChange={(e) => update(i, "detail_value", e.target.value)}
              placeholder="Value (e.g. 240 MB)"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            value={item.detail_category || ""}
            onChange={(e) => update(i, "detail_category", e.target.value)}
            placeholder="Category (e.g. Contents) — optional"
            className={`${inputCls} text-slate-500`}
          />
        </>
      )}
    />
  );
}

function VariantsEditor({ items, onChange }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      emptyLabel="No variants yet — add one below"
      addLabel="Add Variant"
      newItem={{
        label: "",
        variant_type: "",
        sku: "",
        price_modifier: "",
        stock_quantity: "",
      }}
      renderRow={(item, i, update, remove) => (
        <>
          {/* Row 1: Label + Type (enum dropdown) + Delete */}
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <input
              value={item.label || ""}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Label (e.g. Large)"
              className={inputCls}
            />
            <select
              value={item.variant_type || ""}
              onChange={(e) =>
                update(i, "variant_type", e.target.value || null)
              }
              className={inputCls}
            >
              <option value="">Type (optional)</option>
              <option value="size">Size</option>
              <option value="color">Color</option>
              <option value="material">Material</option>
              <option value="edition">Edition</option>
              <option value="license">License</option>
              <option value="bundle">Bundle</option>
              <option value="format">Format</option>
              <option value="tier">Tier</option>
            </select>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Row 2: SKU + Price modifier + Stock */}
          <div className="grid grid-cols-3 gap-2">
            <input
              value={item.sku || ""}
              onChange={(e) => update(i, "sku", e.target.value)}
              placeholder="SKU"
              className={inputCls}
            />
            <input
              type="number"
              value={item.price_modifier || ""}
              onChange={(e) => update(i, "price_modifier", e.target.value)}
              placeholder="Price ±(₹)"
              step="0.01"
              className={inputCls}
            />
            <input
              type="number"
              value={item.stock_quantity || ""}
              onChange={(e) => update(i, "stock_quantity", e.target.value)}
              placeholder="Stock"
              min="0"
              className={inputCls}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            Availability is auto-set from stock quantity by the database.
          </p>
        </>
      )}
    />
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

function ProductModal({ isOpen, onClose, onSuccess, editProduct = null }) {
  const isEdit = !!editProduct;

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploading] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);

  // Details tab state
  const [faqs, setFaqs] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [details, setDetails] = useState([]);
  const [variants, setVariants] = useState([]);

  // Reset / populate on open
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setDetailsError(null);
    setActiveTab("basic");

    if (isEdit && editProduct) {
      const p = editProduct;
      setFormData({
        name: p.name || "",
        slug: p.slug || "",
        description: p.description || "",
        short_description: p.short_description || "",
        type: p.type || "digital",
        // p.price is in paise from the API — divide by 100 to show rupees in the form
        price: p.price ? String(p.price / 100) : "",
        original_price: p.original_price ? String(p.original_price / 100) : "",
        currency: p.currency || "INR",
        featured: p.featured || false,
        digital_delivery_url: p.digital_delivery_url || "",
        digital_license_type: p.digital_license_type || "personal",
        lifetime_updates: p.lifetime_updates || false,
        stock_quantity:
          p.stock_quantity != null ? String(p.stock_quantity) : "",
        delivery_days: p.delivery_days != null ? String(p.delivery_days) : "",
        weight_grams: p.weight_grams != null ? String(p.weight_grams) : "",
        dimensions: {
          length:
            p.dimensions?.length != null ? String(p.dimensions.length) : "",
          width: p.dimensions?.width != null ? String(p.dimensions.width) : "",
          height:
            p.dimensions?.height != null ? String(p.dimensions.height) : "",
        },
      });
      setImages(
        (p.product_images || []).map((img) => ({
          image_url: img.image_url,
          is_primary: img.is_primary,
          alt_text: img.alt_text,
          preview: img.image_url,
        })),
      );
      // Pre-populate details
      setFaqs((p.product_faqs || []).map((r) => ({ ...r, _key: r.id })));
      setHighlights(
        (p.product_highlights || []).map((r) => ({ ...r, _key: r.id })),
      );
      setDetails((p.product_details || []).map((r) => ({ ...r, _key: r.id })));
      setVariants(
        (p.product_variants || []).map((r) => ({
          ...r,
          // Convert paise → rupees for display
          price_modifier:
            r.price_modifier != null ? String(r.price_modifier / 100) : "",
          _key: r.id,
        })),
      );
    } else {
      setFormData(INITIAL_FORM);
      setImages([]);
      setFaqs([]);
      setHighlights([]);
      setDetails([]);
      setVariants([]);
    }
  }, [isOpen, editProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      ...(isEdit ? {} : { slug: generateSlug(name) }),
    }));
  };

  const handleDim = (dim, value) =>
    setFormData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dim]: value },
    }));

  // ── Save basic product (Tab 1) ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (
        !formData.name ||
        !formData.slug ||
        !formData.description ||
        !formData.short_description
      ) {
        throw new Error("Please fill in all required fields");
      }
      const priceNum = parseFloat(formData.price);
      if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
        throw new Error("Please enter a valid price");
      }

      const token = await getToken();

      const newImages = images.filter((img) => img.file);
      const existingImages = images.filter((img) => img.image_url && !img.file);

      let base64Images = [];
      if (newImages.length) {
        setUploading(true);
        base64Images = await Promise.all(
          newImages.map(async (img) => ({
            ...(await fileToBase64(img.file)),
            is_primary: img.is_primary,
            alt_text: formData.name,
          })),
        );
      }

      const payload = {
        ...formData,
        price: Math.round(priceNum * 100),
        original_price: formData.original_price
          ? Math.round(parseFloat(formData.original_price) * 100)
          : null,
        dimensions: {
          length: formData.dimensions.length
            ? parseFloat(formData.dimensions.length)
            : null,
          width: formData.dimensions.width
            ? parseFloat(formData.dimensions.width)
            : null,
          height: formData.dimensions.height
            ? parseFloat(formData.dimensions.height)
            : null,
        },
        images: [
          ...existingImages.map((img) => ({
            image_url: img.image_url,
            alt_text: img.alt_text,
            is_primary: img.is_primary,
          })),
          ...base64Images,
        ],
      };

      ["stock_quantity", "delivery_days", "weight_grams"].forEach((k) => {
        if (payload[k] === "") payload[k] = null;
      });
      if (!payload.digital_delivery_url) payload.digital_delivery_url = null;

      const url = isEdit
        ? `/api/products?id=${editProduct.id}`
        : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || `Failed to ${isEdit ? "update" : "create"} product`,
        );

      onSuccess(data.product);

      // If creating, close immediately. If editing stay open so user can fill Details tab.
      if (!isEdit) {
        onClose();
      } else {
        setActiveTab("details");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // ── Save details (Tab 2) ──────────────────────────────────────────────────
  const handleSaveDetails = async () => {
    if (!editProduct?.id) return;
    setDetailsError(null);
    setSavingDetails(true);

    const token = await getToken().catch((e) => {
      setDetailsError(e.message);
      return null;
    });
    if (!token) {
      setSavingDetails(false);
      return;
    }

    const saves = [
      { resource: "faqs", items: faqs },
      { resource: "highlights", items: highlights },
      { resource: "details", items: details },
      { resource: "variants", items: variants },
    ];

    try {
      await Promise.all(
        saves.map(({ resource, items }) =>
          fetch(`/api/products?id=${editProduct.id}&resource=${resource}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items }),
          }).then(async (res) => {
            if (!res.ok) {
              const d = await res.json();
              throw new Error(`${resource}: ${d.error || "save failed"}`);
            }
          }),
        ),
      );
      // Refresh product in parent
      onSuccess({
        ...editProduct,
        product_faqs: faqs,
        product_highlights: highlights,
        product_details: details,
        product_variants: variants,
      });
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setSavingDetails(false);
    }
  };

  if (!isOpen) return null;
  const isLoading = loading || uploadingImages;

  const TABS = [
    { id: "basic", label: "Basic Info" },
    ...(isEdit ? [{ id: "details", label: "Details" }] : []),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center sm:p-4 overflow-y-auto">
      <Card className="relative w-full sm:max-w-2xl border-0 sm:border sm:border-slate-200/60 shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[90vh] sm:rounded-xl rounded-none my-0 sm:my-auto">
        {/* Close button — fixed top-right at all sizes */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Header */}
        <CardHeader className="border-b border-slate-100 pb-0 shrink-0 pt-4 px-6 pr-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            {isEdit ? `Edit: ${editProduct.name}` : "Create New Product"}
          </h2>
          {/* Tabs */}
          <div className="flex gap-0 border-b border-slate-100 -mx-6 px-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
                  ${
                    activeTab === tab.id
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto flex-1">
          {/* ── Tab 1: Basic Info ─────────────────────────────────────────── */}
          {activeTab === "basic" && (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Product Name" required>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g., 3D Asset Pack"
                    className={inputCls}
                    required
                  />
                </Field>

                <Field
                  label="URL Slug"
                  hint="Auto-generated from name, editable"
                >
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="auto-generated-from-name"
                    className={`${inputCls} text-slate-500`}
                  />
                </Field>

                <Field
                  label="Short Description"
                  required
                  hint="One-line summary for listings"
                >
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    placeholder="Quick summary"
                    className={inputCls}
                    required
                  />
                </Field>

                <Field label="Full Description" required>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description…"
                    rows={4}
                    className={`${inputCls} resize-none`}
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Product Type" required>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      {PRODUCT_TYPES.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Price (₹)" required>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="999"
                      min="0"
                      step="0.01"
                      className={inputCls}
                      required
                    />
                  </Field>
                  <Field
                    label="Original Price (₹)"
                    hint="Leave blank if no discount"
                  >
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleChange}
                      placeholder="1499"
                      min="0"
                      step="0.01"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {formData.type === "digital" && (
                  <DigitalFields formData={formData} onChange={handleChange} />
                )}
                {formData.type === "physical" && (
                  <PhysicalFields
                    formData={formData}
                    onChange={handleChange}
                    onDim={handleDim}
                  />
                )}
                {formData.type === "service" && (
                  <ServiceFields formData={formData} onChange={handleChange} />
                )}

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    id="featured"
                    className="w-4 h-4 rounded border-slate-300 accent-slate-800 cursor-pointer"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Feature this product on homepage
                  </label>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Product Images
                    <span className="ml-1.5 text-xs font-normal text-slate-400">
                      (optional)
                    </span>
                  </p>
                  <ImageUploadPanel images={images} onChange={setImages} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg text-sm font-medium hover:from-slate-800 hover:to-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                    {uploadingImages
                      ? "Uploading…"
                      : loading
                        ? isEdit
                          ? "Saving…"
                          : "Creating…"
                        : isEdit
                          ? "Save Basic Info"
                          : "Create Product"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Tab 2: Details (edit only) ────────────────────────────────── */}
          {activeTab === "details" && (
            <div className="space-y-8">
              {detailsError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{detailsError}</p>
                </div>
              )}

              {/* FAQs */}
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-100 rounded text-[10px] font-bold flex items-center justify-center text-slate-500">
                    Q
                  </span>
                  FAQs
                </h3>
                <FaqsEditor items={faqs} onChange={setFaqs} />
              </section>

              {/* Highlights */}
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-100 rounded text-[10px] font-bold flex items-center justify-center text-amber-600">
                    ★
                  </span>
                  Highlights
                </h3>
                <HighlightsEditor items={highlights} onChange={setHighlights} />
              </section>

              {/* Spec Details */}
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 rounded text-[10px] font-bold flex items-center justify-center text-blue-600">
                    ≡
                  </span>
                  Spec Details
                </h3>
                <DetailsEditor items={details} onChange={setDetails} />
              </section>

              {/* Variants */}
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-100 rounded text-[10px] font-bold flex items-center justify-center text-purple-600">
                    V
                  </span>
                  Variants
                </h3>
                <VariantsEditor items={variants} onChange={setVariants} />
              </section>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={savingDetails}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg text-sm font-medium hover:from-slate-800 hover:to-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingDetails && <Loader className="w-4 h-4 animate-spin" />}
                  {savingDetails ? "Saving…" : "Save Details"}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = create
  const [deleteTarget, setDeleteTarget] = useState(null); // product to confirm-delete

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const {
        data: { user: u },
        error: uErr,
      } = await supabase.auth.getUser();
      if (uErr || !u) {
        setAuthError("Please log in to view your products");
        return;
      }
      setUser(u);
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
      const res = await fetch("/api/products?creator_only=true&page=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Called after create or edit — upsert into local state
  const handleSaved = (savedProduct) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === savedProduct.id);
      if (exists)
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      return [savedProduct, ...prev];
    });
  };

  const handleDeleted = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleStatusChange = (id, newStatus) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    );

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Fetch full product detail (including sub-resources) before opening edit modal
  const openEdit = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.slug}`);
      const data = await res.json();
      setEditingProduct(data.product || product);
    } catch {
      // Fallback to list-level data if slug route fails
      setEditingProduct(product);
    }
    setModalOpen(true);
  };

  // Stats
  const totalRevenue = products.reduce((s, p) => s + (p.total_revenue || 0), 0);
  const publishedCount = products.filter(
    (p) => p.status === "published",
  ).length;
  const totalSales = products.reduce((s, p) => s + (p.total_sales || 0), 0);
  const avgRating = products.length
    ? (
        products.reduce((s, p) => s + (p.average_rating || 0), 0) /
        products.length
      ).toFixed(2)
    : "0";

  if (authError && !loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Your Products
        </h2>
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
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Your Products
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {publishedCount} published · {products.length} total
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 text-sm self-start sm:self-auto hover:from-slate-800 hover:to-slate-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Product
        </Button>
      </div>

      {/* Error */}
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
            {
              label: "Total Revenue",
              value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
              icon: TrendingUp,
            },
            {
              label: "Total Sales",
              value: totalSales.toLocaleString(),
              icon: Package,
            },
            { label: "Avg Rating", value: avgRating, icon: Star },
            {
              label: "Total Products",
              value: products.length.toString(),
              icon: Eye,
            },
          ].map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="border-slate-200/60 bg-white/90 shadow-sm"
            >
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {value}
                </p>
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
              <h3 className="text-lg font-semibold text-slate-900">
                No products yet
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Create your first product to start selling
              </p>
            </div>
            <Button
              onClick={openCreate}
              className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              Create Product
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
              {[
                "Product",
                "Price",
                "Sales",
                "Revenue",
                "Status",
                "Actions",
              ].map((h) => (
                <p
                  key={h}
                  className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </p>
              ))}
            </div>

            <div className="divide-y divide-slate-100">
              {products.map((product) => {
                const primaryImg =
                  product.product_images?.find((i) => i.is_primary) ??
                  product.product_images?.[0];

                return (
                  <div
                    key={product.id}
                    className="group hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Mobile */}
                    <div className="sm:hidden p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
                          {primaryImg?.image_url ? (
                            <Image
                              src={primaryImg.image_url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {product.type}
                          </p>
                        </div>
                        <StatusDropdown
                          productId={product.id}
                          currentStatus={product.status}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[10px] text-slate-400">Price</p>
                          <p className="text-sm font-semibold text-slate-900">
                            ₹{Math.round(product.price / 100).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Sales</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {product.total_sales || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Revenue</p>
                          <p className="text-sm font-semibold text-slate-900">
                            ₹{((product.total_revenue || 0) / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>
                      {/* Mobile action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0">
                          {primaryImg?.image_url ? (
                            <Image
                              src={primaryImg.image_url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {product.type} ·{" "}
                            {new Date(product.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          ₹{Math.round(product.price / 100).toLocaleString()}
                        </p>
                        {product.original_price && (
                          <p className="text-[10px] text-slate-400 line-through">
                            ₹
                            {Math.round(
                              product.original_price / 100,
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {product.total_sales || 0}
                        </p>
                        <p className="text-[10px] text-slate-400">0% conv.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          ₹{((product.total_revenue || 0) / 1000).toFixed(0)}k
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {product.views || 0} views
                        </p>
                      </div>

                      {/* Clickable status dropdown */}
                      <StatusDropdown
                        productId={product.id}
                        currentStatus={product.status}
                        onStatusChange={handleStatusChange}
                      />

                      {/* Edit + Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
                          title="Edit product"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create / Edit modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={handleSaved}
        editProduct={editingProduct}
      />

      {/* Delete confirm modal */}
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
