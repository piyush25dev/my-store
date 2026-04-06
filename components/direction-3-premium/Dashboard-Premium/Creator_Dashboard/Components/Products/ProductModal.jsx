"use client";

// ─── ProductModal.jsx ─────────────────────────────────────────────────────────
// Full create / edit modal. Contains all form field groups and detail editors
// as local sub-components since they're only used here.
//
// Props:
//   isOpen      – boolean
//   onClose     – () => void
//   onSuccess   – (savedProduct) => void
//   editProduct – product object | null (null = create mode)

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Loader, Plus, X } from "lucide-react";
import { INITIAL_FORM, PRODUCT_TYPES, Field, fileToBase64, generateSlug, getToken, inputCls } from "./utils";
import { ImageUploadPanel } from "./SharedComponents";

// ─── Type-specific field groups ───────────────────────────────────────────────

function DigitalFields({ formData, onChange }) {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Digital Options</p>
      <Field label="Delivery URL" hint="Direct download or external link">
        <input type="url" name="digital_delivery_url" value={formData.digital_delivery_url}
          onChange={onChange} placeholder="https://…" className={inputCls} />
      </Field>
      <Field label="License Type">
        <select name="digital_license_type" value={formData.digital_license_type}
          onChange={onChange} className={inputCls}>
          <option value="personal">Personal</option>
          <option value="commercial">Commercial</option>
          <option value="extended">Extended</option>
        </select>
      </Field>
      <div className="flex items-center gap-3 py-1">
        <input type="checkbox" name="lifetime_updates" id="lifetime_updates"
          checked={formData.lifetime_updates} onChange={onChange}
          className="w-4 h-4 rounded border-slate-300 accent-slate-800 cursor-pointer" />
        <label htmlFor="lifetime_updates" className="text-sm font-medium text-slate-700 cursor-pointer">
          Lifetime updates included
        </label>
      </div>
    </div>
  );
}

function PhysicalFields({ formData, onChange, onDim }) {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Physical Options</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Stock Quantity">
          <input type="number" name="stock_quantity" value={formData.stock_quantity}
            onChange={onChange} min="0" placeholder="100" className={inputCls} />
        </Field>
        <Field label="Delivery Days">
          <input type="number" name="delivery_days" value={formData.delivery_days}
            onChange={onChange} min="1" placeholder="5" className={inputCls} />
        </Field>
        <Field label="Weight (grams)">
          <input type="number" name="weight_grams" value={formData.weight_grams}
            onChange={onChange} min="0" placeholder="500" className={inputCls} />
        </Field>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1.5">Dimensions (cm)</p>
        <div className="grid grid-cols-3 gap-2">
          {["length", "width", "height"].map((dim) => (
            <div key={dim}>
              <p className="text-[10px] text-slate-400 capitalize mb-1">{dim}</p>
              <input type="number" min="0" value={formData.dimensions[dim]}
                onChange={(e) => onDim(dim, e.target.value)} placeholder="0" className={inputCls} />
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
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Options</p>
      <Field label="Turnaround Days" hint="How long to complete this service">
        <input type="number" name="delivery_days" value={formData.delivery_days}
          onChange={onChange} min="1" placeholder="3" className={inputCls} />
      </Field>
    </div>
  );
}

// ─── Detail tab editors ───────────────────────────────────────────────────────

function ListEditor({ items, onChange, renderRow, emptyLabel, addLabel, newItem }) {
  const add    = () => onChange([...items, { ...newItem, _key: Date.now() }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
          {emptyLabel}
        </p>
      )}
      {items.map((item, i) => (
        <div key={item._key ?? item.id ?? i}
          className="p-3 border border-slate-200 rounded-lg bg-slate-50/60 space-y-2">
          {renderRow(item, i, update, remove)}
        </div>
      ))}
      <button type="button" onClick={add}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors">
        <Plus className="w-4 h-4" />{addLabel}
      </button>
    </div>
  );
}

function FaqsEditor({ items, onChange }) {
  return (
    <ListEditor items={items} onChange={onChange} emptyLabel="No FAQs yet — add one below"
      addLabel="Add FAQ" newItem={{ question: "", answer: "" }}
      renderRow={(item, i, update, remove) => (
        <>
          <div className="flex items-start gap-2">
            <input value={item.question} onChange={(e) => update(i, "question", e.target.value)}
              placeholder="Question" className={`${inputCls} flex-1`} />
            <button type="button" onClick={() => remove(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea value={item.answer} onChange={(e) => update(i, "answer", e.target.value)}
            placeholder="Answer" rows={2} className={`${inputCls} resize-none`} />
        </>
      )}
    />
  );
}

function HighlightsEditor({ items, onChange }) {
  return (
    <ListEditor items={items} onChange={onChange} emptyLabel="No highlights yet — add one below"
      addLabel="Add Highlight" newItem={{ highlight_text: "", icon_name: "" }}
      renderRow={(item, i, update, remove) => (
        <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
          <input value={item.icon_name || ""} onChange={(e) => update(i, "icon_name", e.target.value)}
            placeholder="Icon" className={`${inputCls} w-16`} />
          <input value={item.highlight_text || ""} onChange={(e) => update(i, "highlight_text", e.target.value)}
            placeholder="Highlight text" className={inputCls} />
          <button type="button" onClick={() => remove(i)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    />
  );
}

function DetailsEditor({ items, onChange }) {
  return (
    <ListEditor items={items} onChange={onChange} emptyLabel="No spec details yet — add one below"
      addLabel="Add Detail" newItem={{ detail_key: "", detail_value: "", detail_category: "" }}
      renderRow={(item, i, update, remove) => (
        <>
          <div className="flex items-center gap-2">
            <input value={item.detail_key || ""} onChange={(e) => update(i, "detail_key", e.target.value)}
              placeholder="Key (e.g. File size)" className={`${inputCls} flex-1`} />
            <input value={item.detail_value || ""} onChange={(e) => update(i, "detail_value", e.target.value)}
              placeholder="Value (e.g. 240 MB)" className={`${inputCls} flex-1`} />
            <button type="button" onClick={() => remove(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input value={item.detail_category || ""} onChange={(e) => update(i, "detail_category", e.target.value)}
            placeholder="Category (e.g. Contents) — optional" className={`${inputCls} text-slate-500`} />
        </>
      )}
    />
  );
}

function VariantsEditor({ items, onChange }) {
  return (
    <ListEditor items={items} onChange={onChange} emptyLabel="No variants yet — add one below"
      addLabel="Add Variant"
      newItem={{ label: "", variant_type: "", sku: "", price_modifier: "", stock_quantity: "" }}
      renderRow={(item, i, update, remove) => (
        <>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <input value={item.label || ""} onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Label (e.g. Large)" className={inputCls} />
            <select value={item.variant_type || ""} onChange={(e) => update(i, "variant_type", e.target.value || null)}
              className={inputCls}>
              <option value="">Type (optional)</option>
              {["size","color","material","edition","license","bundle","format","tier"].map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <button type="button" onClick={() => remove(i)}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input value={item.sku || ""} onChange={(e) => update(i, "sku", e.target.value)}
              placeholder="SKU" className={inputCls} />
            <input type="number" value={item.price_modifier || ""} onChange={(e) => update(i, "price_modifier", e.target.value)}
              placeholder="Price ±(₹)" step="0.01" className={inputCls} />
            <input type="number" value={item.stock_quantity || ""} onChange={(e) => update(i, "stock_quantity", e.target.value)}
              placeholder="Stock" min="0" className={inputCls} />
          </div>
          <p className="text-[10px] text-slate-400">Availability is auto-set from stock quantity by the database.</p>
        </>
      )}
    />
  );
}

// ─── ProductModal ─────────────────────────────────────────────────────────────

export default function ProductModal({ isOpen, onClose, onSuccess, editProduct = null }) {
  const isEdit = !!editProduct;

  const [activeTab, setActiveTab]         = useState("basic");
  const [loading, setLoading]             = useState(false);
  const [uploadingImages, setUploading]   = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [error, setError]                 = useState(null);
  const [detailsError, setDetailsError]   = useState(null);
  const [formData, setFormData]           = useState(INITIAL_FORM);
  const [images, setImages]               = useState([]);
  const [faqs, setFaqs]                   = useState([]);
  const [highlights, setHighlights]       = useState([]);
  const [details, setDetails]             = useState([]);
  const [variants, setVariants]           = useState([]);

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
        price: p.price ? String(p.price / 100) : "",
        original_price: p.original_price ? String(p.original_price / 100) : "",
        currency: p.currency || "INR",
        featured: p.featured || false,
        digital_delivery_url: p.digital_delivery_url || "",
        digital_license_type: p.digital_license_type || "personal",
        lifetime_updates: p.lifetime_updates || false,
        stock_quantity: p.stock_quantity != null ? String(p.stock_quantity) : "",
        delivery_days: p.delivery_days != null ? String(p.delivery_days) : "",
        weight_grams: p.weight_grams != null ? String(p.weight_grams) : "",
        dimensions: {
          length: p.dimensions?.length != null ? String(p.dimensions.length) : "",
          width:  p.dimensions?.width  != null ? String(p.dimensions.width)  : "",
          height: p.dimensions?.height != null ? String(p.dimensions.height) : "",
        },
      });
      setImages((p.product_images || []).map((img) => ({
        image_url: img.image_url, is_primary: img.is_primary,
        alt_text: img.alt_text, preview: img.image_url,
      })));
      setFaqs(      (p.product_faqs       || []).map((r) => ({ ...r, _key: r.id })));
      setHighlights((p.product_highlights || []).map((r) => ({ ...r, _key: r.id })));
      setDetails(   (p.product_details    || []).map((r) => ({ ...r, _key: r.id })));
      setVariants(  (p.product_variants   || []).map((r) => ({
        ...r,
        price_modifier: r.price_modifier != null ? String(r.price_modifier / 100) : "",
        _key: r.id,
      })));
    } else {
      setFormData(INITIAL_FORM);
      setImages([]); setFaqs([]); setHighlights([]); setDetails([]); setVariants([]);
    }
  }, [isOpen, editProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, name, ...(isEdit ? {} : { slug: generateSlug(name) }) }));
  };

  const handleDim = (dim, value) =>
    setFormData((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [dim]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!formData.name || !formData.slug || !formData.description || !formData.short_description)
        throw new Error("Please fill in all required fields");
      const priceNum = parseFloat(formData.price);
      if (!formData.price || isNaN(priceNum) || priceNum <= 0)
        throw new Error("Please enter a valid price");

      const token        = await getToken();
      const newImages    = images.filter((img) => img.file);
      const existingImgs = images.filter((img) => img.image_url && !img.file);

      let base64Images = [];
      if (newImages.length) {
        setUploading(true);
        base64Images = await Promise.all(
          newImages.map(async (img) => ({
            ...(await fileToBase64(img.file)), is_primary: img.is_primary, alt_text: formData.name,
          })),
        );
      }

      const payload = {
        ...formData,
        price: Math.round(priceNum * 100),
        original_price: formData.original_price ? Math.round(parseFloat(formData.original_price) * 100) : null,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : null,
          width:  formData.dimensions.width  ? parseFloat(formData.dimensions.width)  : null,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : null,
        },
        images: [
          ...existingImgs.map((img) => ({ image_url: img.image_url, alt_text: img.alt_text, is_primary: img.is_primary })),
          ...base64Images,
        ],
      };
      ["stock_quantity", "delivery_days", "weight_grams"].forEach((k) => { if (payload[k] === "") payload[k] = null; });
      if (!payload.digital_delivery_url) payload.digital_delivery_url = null;

      const res  = await fetch(isEdit ? `/api/products?id=${editProduct.id}` : "/api/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isEdit ? "update" : "create"} product`);

      onSuccess(data.product);
      if (!isEdit) { onClose(); } else { setActiveTab("details"); }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!editProduct?.id) return;
    setDetailsError(null);
    setSavingDetails(true);
    const token = await getToken().catch((e) => { setDetailsError(e.message); return null; });
    if (!token) { setSavingDetails(false); return; }
    try {
      await Promise.all(
        [
          { resource: "faqs",       items: faqs },
          { resource: "highlights", items: highlights },
          { resource: "details",    items: details },
          { resource: "variants",   items: variants },
        ].map(({ resource, items }) =>
          fetch(`/api/products?id=${editProduct.id}&resource=${resource}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ items }),
          }).then(async (res) => {
            if (!res.ok) { const d = await res.json(); throw new Error(`${resource}: ${d.error || "save failed"}`); }
          }),
        ),
      );
      onSuccess({ ...editProduct, product_faqs: faqs, product_highlights: highlights, product_details: details, product_variants: variants });
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setSavingDetails(false);
    }
  };

  if (!isOpen) return null;
  const isLoading = loading || uploadingImages;
  const TABS = [{ id: "basic", label: "Basic Info" }, ...(isEdit ? [{ id: "details", label: "Details" }] : [])];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center sm:p-4 overflow-y-auto">
      <Card className="relative w-full sm:max-w-2xl border-0 sm:border sm:border-slate-200/60 shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[90vh] sm:rounded-xl rounded-none my-0 sm:my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <CardHeader className="border-b border-slate-100 pb-0 shrink-0 pt-4 px-6 pr-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            {isEdit ? `Edit: ${editProduct.name}` : "Create New Product"}
          </h2>
          <div className="flex gap-0 border-b border-slate-100 -mx-6 px-6">
            {TABS.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
                  ${activeTab === tab.id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto flex-1">

          {/* ── Tab 1: Basic Info ── */}
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
                  <input type="text" name="name" value={formData.name} onChange={handleNameChange}
                    placeholder="e.g., 3D Asset Pack" className={inputCls} required />
                </Field>
                <Field label="URL Slug" hint="Auto-generated from name, editable">
                  <input type="text" name="slug" value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="auto-generated-from-name" className={`${inputCls} text-slate-500`} />
                </Field>
                <Field label="Short Description" required hint="One-line summary for listings">
                  <input type="text" name="short_description" value={formData.short_description}
                    onChange={handleChange} placeholder="Quick summary" className={inputCls} required />
                </Field>
                <Field label="Full Description" required>
                  <textarea name="description" value={formData.description} onChange={handleChange}
                    placeholder="Detailed description…" rows={4} className={`${inputCls} resize-none`} required />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Product Type" required>
                    <select name="type" value={formData.type} onChange={handleChange} className={inputCls}>
                      {PRODUCT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Price (₹)" required>
                    <input type="number" name="price" value={formData.price} onChange={handleChange}
                      placeholder="999" min="0" step="0.01" className={inputCls} required />
                  </Field>
                  <Field label="Original Price (₹)" hint="Leave blank if no discount">
                    <input type="number" name="original_price" value={formData.original_price}
                      onChange={handleChange} placeholder="1499" min="0" step="0.01" className={inputCls} />
                  </Field>
                </div>

                {formData.type === "digital"  && <DigitalFields  formData={formData} onChange={handleChange} />}
                {formData.type === "physical" && <PhysicalFields formData={formData} onChange={handleChange} onDim={handleDim} />}
                {formData.type === "service"  && <ServiceFields  formData={formData} onChange={handleChange} />}

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <input type="checkbox" name="featured" checked={formData.featured}
                    onChange={handleChange} id="featured"
                    className="w-4 h-4 rounded border-slate-300 accent-slate-800 cursor-pointer" />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Feature this product on homepage
                  </label>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Product Images <span className="ml-1.5 text-xs font-normal text-slate-400">(optional)</span>
                  </p>
                  <ImageUploadPanel images={images} onChange={setImages} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg text-sm font-medium hover:from-slate-800 hover:to-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                    {uploadingImages ? "Uploading…" : loading ? (isEdit ? "Saving…" : "Creating…") : (isEdit ? "Save Basic Info" : "Create Product")}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Tab 2: Details (edit only) ── */}
          {activeTab === "details" && (
            <div className="space-y-8">
              {detailsError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{detailsError}</p>
                </div>
              )}
              {[
                { label: "FAQs",         badge: "Q", badgeCls: "bg-slate-100 text-slate-500",   Editor: FaqsEditor,       state: faqs,       setState: setFaqs },
                { label: "Highlights",   badge: "★", badgeCls: "bg-amber-100 text-amber-600",   Editor: HighlightsEditor, state: highlights, setState: setHighlights },
                { label: "Spec Details", badge: "≡", badgeCls: "bg-blue-100 text-blue-600",     Editor: DetailsEditor,    state: details,    setState: setDetails },
                { label: "Variants",     badge: "V", badgeCls: "bg-purple-100 text-purple-600", Editor: VariantsEditor,   state: variants,   setState: setVariants },
              ].map(({ label, badge, badgeCls, Editor, state, setState }) => (
                <section key={label}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className={`w-5 h-5 ${badgeCls} rounded text-[10px] font-bold flex items-center justify-center`}>{badge}</span>
                    {label}
                  </h3>
                  <Editor items={state} onChange={setState} />
                </section>
              ))}
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                  Close
                </button>
                <button type="button" onClick={handleSaveDetails} disabled={savingDetails}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg text-sm font-medium hover:from-slate-800 hover:to-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
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