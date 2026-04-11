"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus, CheckCircle2, XCircle, Clock, Users,
  MoreHorizontal, AlertCircle, Trash2, Loader, ChevronDown,
  ShoppingBag, IndianRupee, ChevronLeft, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { getAccessToken } from "@/lib/utils/getAccessToken";

// ─── Config ───────────────────────────────────────────────────────────────────

const CREATOR_STATUS_OPTIONS = [
  { value: "Active",    label: "Active",    icon: CheckCircle2, cls: "text-emerald-600" },
  { value: "Pending",   label: "Pending",   icon: Clock,        cls: "text-amber-600"  },
  { value: "Suspended", label: "Suspended", icon: XCircle,      cls: "text-rose-600"   },
];

const USER_STATUS_OPTIONS = [
  { value: "Active",    label: "Active",    icon: CheckCircle2, cls: "text-emerald-600" },
  { value: "Suspended", label: "Suspended", icon: XCircle,      cls: "text-rose-600"   },
];

const STATUS_STYLE = {
  Active:    "bg-emerald-100 text-emerald-700",
  Suspended: "bg-rose-100    text-rose-700",
  Pending:   "bg-amber-100   text-amber-700",
};

const AVATAR_COLORS = [
  "from-blue-500 to-purple-600",   "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",   "from-violet-500 to-purple-700",
  "from-pink-500 to-rose-600",     "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",     "from-red-500 to-rose-700",
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

async function apiCall(endpoint, method, id, body) {
  const token = await getAccessToken();
  const res = await fetch(`/api/admin/${endpoint}?id=${id}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function fetchEndpoint(endpoint) {
  const token = await getAccessToken();
  const res = await fetch(`/api/admin/${endpoint}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Fetch failed");
  return data;
}

// ─── usePaginatedTable hook ───────────────────────────────────────────────────

function usePaginatedTable(items, filter) {
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 whenever filter or pageSize changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); }, [filter, pageSize]);

  const filtered   = filter === "All" ? items : items.filter(i => i.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const visible    = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const fromRow    = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const toRow      = Math.min(safePage * pageSize, filtered.length);

  return { visible, filtered, page: safePage, setPage, pageSize, setPageSize, totalPages, fromRow, toRow };
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = new Set(
    [1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages)
  );
  const sorted = [...pages].sort((a, b) => a - b);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {sorted.map((p, i) => (
        <>
          {i > 0 && sorted[i] - sorted[i - 1] > 1 && (
            <span key={`ellipsis-${p}`} className="text-xs text-slate-400 px-1">…</span>
          )}
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              p === page
                ? "bg-slate-900 text-white border border-slate-900"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        </>
      ))}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── PaginationBar ────────────────────────────────────────────────────────────

function PaginationBar({ page, totalPages, pageSize, setPageSize, setPage, fromRow, toRow, total }) {
  if (total === 0) return null;
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-slate-200 bg-slate-50">
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-xs text-slate-500">
          Showing {fromRow}–{toRow} of {total}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Rows</label>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
          >
            {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ item, index, size = "w-9 h-9" }) {
  const [imgError, setImgError] = useState(false);
  if (item.avatar_url && !imgError) {
    return (
      <div className={`${size} rounded-xl overflow-hidden shrink-0 border border-slate-200/60`}>
        <Image src={item.avatar_url} alt={item.name} width={40} height={40}
          className="w-full h-full object-cover" onError={() => setImgError(true)} />
      </div>
    );
  }
  return (
    <div className={`${size} rounded-xl bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {item.avatar}
    </div>
  );
}

// ─── Generic Status Dropdown ──────────────────────────────────────────────────

function StatusDropdown({ item, options, onStatusChange }) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const select = async (newStatus) => {
    if (newStatus === item.status) { setOpen(false); return; }
    setLoading(true); setOpen(false);
    try { await onStatusChange(item.id, newStatus); }
    catch (err) { alert(`Failed: ${err.message}`); }
    finally { setLoading(false); }
  };

  const current = options.find(o => o.value === item.status) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)} disabled={loading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all w-fit
          ${STATUS_STYLE[item.status] ?? "bg-slate-100 text-slate-500"}
          ${loading ? "opacity-50" : "hover:opacity-80 cursor-pointer"}`}
      >
        {loading ? <Loader className="w-3 h-3 animate-spin" /> : <current.icon className="w-3 h-3" />}
        {current.label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[140px]">
          {options.map(opt => (
            <button key={opt.value} onClick={() => select(opt.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 transition-colors
                ${opt.value === item.status ? "font-semibold" : ""} ${opt.cls}`}>
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
              {opt.value === item.status && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Generic Actions Menu (⋯) ─────────────────────────────────────────────────

function ActionsMenu({ item, statusOptions, onDelete, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const quickStatus = statusOptions.filter(o => o.value !== item.status);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
        <MoreHorizontal className="w-4 h-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[170px]">
          <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Change Status
          </p>
          {quickStatus.map(opt => (
            <button key={opt.value}
              onClick={() => { setOpen(false); onStatusChange(item.id, opt.value); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 transition-colors ${opt.cls}`}>
              <opt.icon className="w-3.5 h-3.5" /> Set {opt.label}
            </button>
          ))}
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button onClick={() => { setOpen(false); onDelete(item); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

import { createPortal } from "react-dom";

function DeleteModal({ item, entityLabel, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const modal = (
    <div
      className="fixed inset-0 backdrop-blur-sm z-[9999] flex items-center justify-center"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Card className="w-full max-w-md border-slate-200/60 shadow-2xl mx-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3 pt-4">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Delete {entityLabel}?</h3>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-medium text-slate-700">{item.name}</span>
                {" "}({item.email}) will be permanently removed including their login access.
              </p>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={async () => {
                setLoading(true); setError(null);
                try { await onDeleted(item.id); onClose(); }
                catch (err) { setError(err.message); }
                finally { setLoading(false); }
              }}
              className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(modal, document.body);
}

// ─── Creators Table ───────────────────────────────────────────────────────────

function CreatorsTable({ creators, loading, onStatusChange, onDelete }) {
  const [filter, setFilter] = useState("All");
  const pg = usePaginatedTable(creators, filter);

  const active      = creators.filter(c => c.status === "Active").length;
  const pending     = creators.filter(c => c.status === "Pending").length;
  const suspended   = creators.filter(c => c.status === "Suspended").length;
  const totalPayout = creators.reduce((s, c) => s + (c.payoutPending || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Creators</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading ? "Loading…" : `${creators.length} total · ${active} active · ${pending} pending review`}
          </p>
        </div>
        {/* <Button className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 text-sm self-start sm:self-auto">
          <UserPlus className="w-4 h-4" /> Invite Creator
        </Button> */}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total",        value: creators.length,                           color: "text-slate-900"   },
          { label: "Active",       value: active,                                    color: "text-emerald-600" },
          { label: "Pending",      value: pending,                                   color: "text-amber-600"   },
          { label: "Suspended",    value: suspended,                                 color: "text-rose-600"    },
          { label: "Payout Queue", value: `₹${((totalPayout/100)/1000).toFixed(0)}k`, color: "text-blue-600"  },
        ].map(({ label, value, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
              {loading ? <Skeleton className="h-6 w-12 mt-1" />
                       : <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-slate-900">All Creators</h3>
            <div className="flex gap-1.5 flex-wrap">
              {["All", "Active", "Pending", "Suspended"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>{f}</button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50/50 border-b border-slate-100">
            {["Creator", "Contact", "Products", "Revenue", "Orders", "Status", ""].map(h => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {loading && (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                  <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-3 w-1/4" /><Skeleton className="h-2 w-1/3" /></div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && pg.visible.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-10">
              {filter === "All" ? "No creators yet." : `No ${filter.toLowerCase()} creators.`}
            </p>
          )}

          {!loading && (
            <div className="divide-y divide-slate-100">
              {pg.visible.map((c, i) => {
                // preserve original index for avatar color consistency
                const globalIndex = creators.indexOf(c);
                return (
                  <div key={c.id} className="group hover:bg-slate-50/60 transition-colors">
                    {/* Mobile */}
                    <div className="lg:hidden py-4 px-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar item={c} index={globalIndex} size="w-10 h-10" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                            <StatusDropdown item={c} options={CREATOR_STATUS_OPTIONS} onStatusChange={onStatusChange} />
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{c.handle} · {c.email}</p>
                        </div>
                        <button onClick={() => onDelete(c)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><p className="text-[10px] text-slate-400">Revenue</p><p className="text-sm font-bold text-slate-900">₹{((c.revenue/100)/1000).toFixed(1)}k</p></div>
                        <div><p className="text-[10px] text-slate-400">Orders</p><p className="text-sm font-bold text-slate-900">{c.orders}</p></div>
                        <div><p className="text-[10px] text-slate-400">Products</p><p className="text-sm font-bold text-slate-900">{c.products}</p></div>
                      </div>
                    </div>
                    {/* Desktop */}
                    <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar item={c} index={globalIndex} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{c.handle} · {c.joined}</p>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 truncate">{c.email}</p>
                        <p className="text-[10px] text-slate-400">{c.country}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-700">{c.products}</p>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">₹{((c.revenue/100)/1000).toFixed(1)}k</p>
                        {c.payoutPending > 0 && <p className="text-[10px] text-amber-600">₹{((c.payoutPending/100)/1000).toFixed(1)}k pending</p>}
                      </div>
                      <p className="text-sm text-slate-700">{c.orders}</p>
                      <StatusDropdown item={c} options={CREATOR_STATUS_OPTIONS} onStatusChange={onStatusChange} />
                      <ActionsMenu item={c} statusOptions={CREATOR_STATUS_OPTIONS} onDelete={onDelete} onStatusChange={onStatusChange} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && (
            <PaginationBar
              page={pg.page}
              totalPages={pg.totalPages}
              pageSize={pg.pageSize}
              setPageSize={pg.setPageSize}
              setPage={pg.setPage}
              fromRow={pg.fromRow}
              toRow={pg.toRow}
              total={pg.filtered.length}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Users Table ──────────────────────────────────────────────────────────────

function UsersTable({ users, loading, onStatusChange, onDelete }) {
  const [filter, setFilter] = useState("All");
  const pg = usePaginatedTable(users, filter);

  const active      = users.filter(u => u.status === "Active").length;
  const suspended   = users.filter(u => u.status === "Suspended").length;
  const totalSpend  = users.reduce((s, u) => s + (u.spend  || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" /> Users
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading ? "Loading…" : `${users.length} total · ${active} active · ${suspended} suspended`}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: users.length,                              icon: Users,        color: "text-slate-900"   },
          { label: "Active",      value: active,                                    icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Suspended",   value: suspended,                                 icon: XCircle,      color: "text-rose-600"    },
          { label: "Total Spend", value: `₹${((totalSpend/100)/1000).toFixed(1)}k`, icon: IndianRupee,  color: "text-blue-600"    },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-slate-200/60 bg-white/90 shadow-sm">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl shrink-0">
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
                {loading ? <Skeleton className="h-6 w-12 mt-1" />
                         : <p className={`text-lg font-bold ${color}`}>{value}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-slate-900">All Customers</h3>
            <div className="flex gap-1.5 flex-wrap">
              {["All", "Active", "Suspended"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>{f}</button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop header */}
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50/50 border-b border-slate-100">
            {["Customer", "Contact", "Orders", "Total Spend", "Status", ""].map(h => (
              <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {loading && (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                  <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2"><Skeleton className="h-3 w-1/4" /><Skeleton className="h-2 w-1/3" /></div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && pg.visible.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-10">
              {filter === "All" ? "No users yet." : `No ${filter.toLowerCase()} users.`}
            </p>
          )}

          {!loading && (
            <div className="divide-y divide-slate-100">
              {pg.visible.map((u, i) => {
                const globalIndex = users.indexOf(u);
                return (
                  <div key={u.id} className="group hover:bg-slate-50/60 transition-colors">
                    {/* Mobile */}
                    <div className="lg:hidden py-4 px-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar item={u} index={globalIndex} size="w-10 h-10" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-semibold text-slate-900 text-sm truncate">{u.name}</p>
                            <StatusDropdown item={u} options={USER_STATUS_OPTIONS} onStatusChange={onStatusChange} />
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{u.email} · {u.country}</p>
                        </div>
                        <button onClick={() => onDelete(u)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div><p className="text-[10px] text-slate-400">Orders</p><p className="text-sm font-bold text-slate-900">{u.orders}</p></div>
                        <div><p className="text-[10px] text-slate-400">Total Spend</p><p className="text-sm font-bold text-slate-900">₹{((u.spend/100)/1000).toFixed(1)}k</p></div>
                      </div>
                    </div>
                    {/* Desktop */}
                    <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar item={u} index={globalIndex} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400">Joined {u.joined}</p>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 truncate">{u.email}</p>
                        <p className="text-[10px] text-slate-400">{u.country}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-300" />
                        <p className="text-sm font-medium text-slate-700">{u.orders}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-3 h-3 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-900">
                          {(u.spend / 100).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <StatusDropdown item={u} options={USER_STATUS_OPTIONS} onStatusChange={onStatusChange} />
                      <ActionsMenu item={u} statusOptions={USER_STATUS_OPTIONS} onDelete={onDelete} onStatusChange={onStatusChange} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && (
            <PaginationBar
              page={pg.page}
              totalPages={pg.totalPages}
              pageSize={pg.pageSize}
              setPageSize={pg.setPageSize}
              setPage={pg.setPage}
              fromRow={pg.fromRow}
              toRow={pg.toRow}
              total={pg.filtered.length}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminCreatorsPage() {
  const [creators,     setCreators]     = useState([]);
  const [users,        setUsers]        = useState([]);
  const [loadingC,     setLoadingC]     = useState(true);
  const [loadingU,     setLoadingU]     = useState(true);
  const [errorC,       setErrorC]       = useState(null);
  const [errorU,       setErrorU]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadCreators(); loadUsers(); }, []);

  async function loadCreators() {
    try { setLoadingC(true); setErrorC(null); const data = await fetchEndpoint("creators"); setCreators(data.creators || []); }
    catch (err) { setErrorC(err.message); }
    finally { setLoadingC(false); }
  }

  async function loadUsers() {
    try { setLoadingU(true); setErrorU(null); const data = await fetchEndpoint("users"); setUsers(data.users || []); }
    catch (err) { setErrorU(err.message); }
    finally { setLoadingU(false); }
  }

  const handleCreatorStatusChange = async (id, newStatus) => {
    setCreators(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    try { await apiCall("creators", "PATCH", id, { status: newStatus }); }
    catch (err) { alert(`Failed: ${err.message}`); loadCreators(); }
  };

  const handleCreatorDeleted = async (id) => {
    await apiCall("creators", "DELETE", id);
    setCreators(prev => prev.filter(c => c.id !== id));
  };

  const handleUserStatusChange = async (id, newStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    try { await apiCall("users", "PATCH", id, { status: newStatus }); }
    catch (err) { alert(`Failed: ${err.message}`); loadUsers(); }
  };

  const handleUserDeleted = async (id) => {
    await apiCall("users", "DELETE", id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const isCreatorDelete = deleteTarget?.type === "creator";

  return (
    <div className="space-y-10">
      {errorC && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">Creators: {errorC}</p>
        </div>
      )}
      {errorU && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">Users: {errorU}</p>
        </div>
      )}

      <CreatorsTable creators={creators} loading={loadingC} onStatusChange={handleCreatorStatusChange}
        onDelete={(item) => setDeleteTarget({ item, type: "creator" })} />

      <div className="border-t border-slate-200" />

      <UsersTable users={users} loading={loadingU} onStatusChange={handleUserStatusChange}
        onDelete={(item) => setDeleteTarget({ item, type: "user" })} />

      {deleteTarget && (
        <DeleteModal item={deleteTarget.item} entityLabel={isCreatorDelete ? "creator" : "user"}
          onClose={() => setDeleteTarget(null)}
          onDeleted={isCreatorDelete ? handleCreatorDeleted : handleUserDeleted} />
      )}
    </div>
  );
}