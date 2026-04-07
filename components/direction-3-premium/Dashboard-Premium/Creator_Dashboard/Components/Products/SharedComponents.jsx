"use client";

// ─── SharedComponents.jsx ─────────────────────────────────────────────────────
// Exports:
//   ImageUploadPanel  – drag-drop image upload with preview grid
//   StatusDropdown    – inline published/draft toggle (fires PATCH immediately)
//   DeleteModal       – confirm-before-delete dialog

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle, ChevronDown, Loader, Trash2, Upload, X,
} from "lucide-react";
import { STATUS_OPTIONS, STATUS_STYLE } from "./utils";
import { getToken } from "./utils";

// ─── ImageUploadPanel ─────────────────────────────────────────────────────────
// Props:
//   images   – array of image objects ({ file?, preview?, image_url?, is_primary })
//   onChange – setState updater

export function ImageUploadPanel({ images, onChange }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const addFiles = (files) => {
    const fresh = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, preview: URL.createObjectURL(file), is_primary: false }));
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
    onChange((prev) => prev.map((img, i) => ({ ...img, is_primary: i === idx })));

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors
          ${drag ? "border-slate-400 bg-slate-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"}`}
      >
        <Upload className="w-5 h-5 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">
          Drop images or <span className="underline">browse</span>
        </p>
        <p className="text-xs text-slate-400">PNG, JPG, WEBP · max 10 MB</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => addFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div key={idx} onClick={() => setPrimary(idx)}
              className={`relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-colors
                ${img.is_primary ? "border-slate-700" : "border-slate-200 hover:border-slate-300"}`}
            >
              <Image src={img.preview || img.image_url} alt="" width={300} height={300}
                className="w-full aspect-square object-cover" />
              {img.is_primary && (
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-semibold text-center py-0.5">
                  PRIMARY
                </span>
              )}
              <button type="button" onClick={(e) => { e.stopPropagation(); remove(idx); }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <p className="text-xs text-slate-400">Click an image to set it as primary.</p>
      )}
    </div>
  );
}

// ─── StatusDropdown ───────────────────────────────────────────────────────────
// Props:
//   productId      – product UUID
//   currentStatus  – "published" | "draft"
//   onStatusChange – (productId, newStatus) => void

export function StatusDropdown({ productId, currentStatus, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = async (newStatus) => {
    if (newStatus === currentStatus) { setOpen(false); return; }
    setLoading(true);
    setOpen(false);
    try {
      const token = await getToken();
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      onStatusChange(productId, newStatus);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const current = STATUS_OPTIONS.find((o) => o.value === currentStatus) ?? STATUS_OPTIONS[1];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} disabled={loading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all
          ${STATUS_STYLE[currentStatus] ?? "bg-slate-100 text-slate-500"}
          ${loading ? "opacity-50" : "hover:opacity-80 cursor-pointer"}`}
      >
        {loading ? <Loader className="w-3 h-3 animate-spin" /> : <current.icon className="w-3 h-3" />}
        {current.label}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[120px]">
          {STATUS_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => select(opt.value)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors
                ${opt.value === currentStatus ? "font-semibold" : ""} ${opt.cls}`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
              {opt.value === currentStatus && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DeleteModal ──────────────────────────────────────────────────────────────
// Props:
//   product   – product object ({ id, name })
//   onClose   – () => void
//   onDeleted – (id) => void

export function DeleteModal({ product, onClose, onDeleted }) {
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
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200/60 shadow-2xl pt-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Delete product?</h3>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-medium text-slate-700">&quot;{product.name}&quot;</span>{" "}
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
            <button onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={confirm} disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}