"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Store, Bell, CreditCard, CheckCircle2, Save } from "lucide-react";
import { creatorSettings } from "@/app/data/Dashboard";

export default function SettingsPage() {
  const [profile, setProfile] = useState(creatorSettings.profile);
  const [store, setStore]     = useState(creatorSettings.store);
  const [notifs, setNotifs]   = useState(creatorSettings.notifications);
  const [saved, setSaved]     = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your account and store preferences</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 p-0 text-xs sm:px-4 sm:py-2 sm:text-sm"
        >
          {saved ? <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Profile */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" /> Profile
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
              {profile.avatar}
            </div>
            <div>
              <Button variant="outline" size="sm" className="text-xs rounded-full border-slate-200">Change Photo</Button>
              <p className="text-[10px] text-slate-400 mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Full Name</Label>
              <Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="text-sm border-slate-200 focus:border-slate-400" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Handle</Label>
              <Input value={profile.handle} onChange={e => setProfile(p => ({ ...p, handle: e.target.value }))} className="text-sm border-slate-200 font-mono" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-500">Email Address</Label>
              <Input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="text-sm border-slate-200" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-500">Bio</Label>
              <textarea
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none text-slate-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-slate-400" /> Store Settings
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Store Name</Label>
              <Input value={store.storeName} onChange={e => setStore(s => ({ ...s, storeName: e.target.value }))} className="text-sm border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Currency</Label>
              <Input value={store.currency} readOnly className="text-sm border-slate-200 bg-slate-50 text-slate-400" />
            </div>
          </div>
          <div className="space-y-3 pt-1">
            {[
              { key: "taxEnabled",      label: "Include GST in prices",        desc: "18% GST auto-applied at checkout" },
              { key: "instantDelivery", label: "Instant digital delivery",      desc: "Files delivered immediately after payment" },
              { key: "allowReviews",    label: "Allow customer reviews",        desc: "Buyers can leave ratings and reviews" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
                <button
                  onClick={() => setStore(s => ({ ...s, [key]: !s[key] }))}
                  className={`w-10 h-6 rounded-full transition-colors ${store[key] ? "bg-slate-900" : "bg-slate-200"} relative`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${store[key] ? "left-5" : "left-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" /> Notifications
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-3">
          {[
            { key: "orderAlerts",      label: "New order alerts",      desc: "Get notified when a purchase is made" },
            { key: "reviewAlerts",     label: "Review notifications",  desc: "When a customer leaves a review"      },
            { key: "disputeAlerts",    label: "Dispute alerts",        desc: "When a refund or dispute is raised"   },
            { key: "weeklyReport",     label: "Weekly summary report", desc: "Emailed every Monday morning"         },
            { key: "marketingEmails",  label: "Marketing tips",        desc: "Product growth advice from Premium"  },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                className={`w-10 h-6 rounded-full transition-colors ${notifs[key] ? "bg-slate-900" : "bg-slate-200"} relative shrink-0`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[key] ? "left-5" : "left-1"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payout */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" /> Payout Details
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Pending Payout",  value: `₹${creatorSettings.payout.pending.toLocaleString()}`,     badge: "Next: Jan 20" },
              { label: "Total Paid Out",  value: `₹${creatorSettings.payout.totalPaid.toLocaleString()}`,   badge: null },
              { label: "Payment Method",  value: creatorSettings.payout.method,                              badge: null },
            ].map(({ label, value, badge }) => (
              <div key={label} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-base font-bold text-slate-900">{value}</p>
                {badge && <Badge className="mt-1 bg-emerald-100 text-emerald-700 border-0 text-[10px]">{badge}</Badge>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Account Number</Label>
              <Input value={creatorSettings.payout.account} readOnly className="text-sm border-slate-200 bg-slate-50 font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">IFSC Code</Label>
              <Input value={creatorSettings.payout.ifsc} readOnly className="text-sm border-slate-200 bg-slate-50 font-mono" />
            </div>
          </div>
          <Button variant="outline" className="text-xs rounded-full border-slate-200 text-slate-600">Update Bank Details</Button>
        </CardContent>
      </Card>
    </div>
  );
}