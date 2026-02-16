"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Percent, Zap, Shield, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { platformSettings } from "@/app/data/Admindata";

// Move Toggle component outside of AdminSettingsPage
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${checked ? "bg-slate-900" : "bg-slate-200"}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-5" : "left-1"}`} />
  </button>
);

export default function AdminSettingsPage() {
  const [general, setGeneral] = useState(platformSettings.general);
  const [fees, setFees] = useState(platformSettings.fees);
  const [features, setFeatures] = useState(platformSettings.features);
  const [security, setSecurity] = useState(platformSettings.security);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Platform Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure Premium platform behaviour</p>
        </div>
        <Button onClick={handleSave} className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 text-sm">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* General */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" /> General
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Platform Name</Label>
              <Input value={general.platformName} onChange={e => setGeneral(g => ({...g, platformName: e.target.value}))} className="text-sm border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Domain</Label>
              <Input value={general.domain} onChange={e => setGeneral(g => ({...g, domain: e.target.value}))} className="text-sm border-slate-200 font-mono" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-500">Support Email</Label>
              <Input type="email" value={general.supportEmail} onChange={e => setGeneral(g => ({...g, supportEmail: e.target.value}))} className="text-sm border-slate-200" />
            </div>
          </div>
          <div className="space-y-2 pt-1">
            {[
              { key: "maintenanceMode", label: "Maintenance Mode",       desc: "Takes platform offline for all users", danger: true  },
              { key: "signupsOpen",     label: "Open Creator Signups",   desc: "Allow new creators to register",       danger: false },
              { key: "requireKYC",      label: "Require KYC Verification",desc: "Mandate KYC before first payout",     danger: false },
            ].map(({ key, label, desc, danger }) => (
              <div key={key} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                danger && general[key] ? "border-rose-200 bg-rose-50/30" : "border-slate-100 hover:border-slate-200"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    {danger && general[key] && (
                      <Badge className="bg-rose-100 text-rose-700 border-0 text-[10px] gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" /> Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
                <Toggle checked={general[key]} onChange={() => setGeneral(g => ({...g, [key]: !g[key]}))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fees */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Percent className="w-4 h-4 text-slate-400" /> Commission & Fees
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Platform Commission (%)</Label>
              <div className="relative">
                <Input
                  type="number" value={fees.commissionPct}
                  onChange={e => setFees(f => ({...f, commissionPct: e.target.value}))}
                  className="text-sm border-slate-200 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Payment Processing (%)</Label>
              <div className="relative">
                <Input
                  type="number" value={fees.paymentProcessingFee}
                  onChange={e => setFees(f => ({...f, paymentProcessingFee: e.target.value}))}
                  className="text-sm border-slate-200 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Min Payout Amount (₹)</Label>
              <Input
                type="number" value={fees.minPayoutAmount}
                onChange={e => setFees(f => ({...f, minPayoutAmount: e.target.value}))}
                className="text-sm border-slate-200"
              />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500">
              Current effective rate: <span className="font-semibold text-slate-800">{Number(fees.commissionPct) + Number(fees.paymentProcessingFee)}%</span> per transaction
              {fees.gstIncluded && <span className="ml-2 text-slate-400">(18% GST included in creator price)</span>}
            </p>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">GST Inclusive Pricing</p>
              <p className="text-[10px] text-slate-400">Product prices include 18% GST</p>
            </div>
            <Toggle checked={fees.gstIncluded} onChange={() => setFees(f => ({...f, gstIncluded: !f.gstIncluded}))} />
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-400" /> Feature Flags
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-2">
          {[
            { key: "reviews",              label: "Customer Reviews",       desc: "Allow buyers to leave product reviews"     },
            { key: "wishlists",            label: "Wishlists",              desc: "Buyers can save products to a wishlist"    },
            { key: "coupons",              label: "Discount Coupons",       desc: "Creators can create coupon codes"          },
            { key: "affiliates",           label: "Affiliate Program",      desc: "Enable referral commissions for affiliates"},
            { key: "referralProgram",      label: "Referral Program",       desc: "Buyer referral bonuses and tracking"       },
            { key: "subscriptionProducts", label: "Subscription Products",  desc: "Allow recurring subscription products"     },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
              <Toggle checked={features[key]} onChange={() => setFeatures(f => ({...f, [key]: !f[key]}))} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" /> Security
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Session Timeout (minutes)</Label>
              <Input
                type="number" value={security.sessionTimeoutMins}
                onChange={e => setSecurity(s => ({...s, sessionTimeoutMins: e.target.value}))}
                className="text-sm border-slate-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            {[
              { key: "twoFactorRequired", label: "Require 2FA for Admins",  desc: "All admin accounts must use two-factor auth" },
              { key: "ipWhitelist",       label: "IP Whitelist",            desc: "Restrict admin access to approved IPs only"  },
              { key: "auditLogs",         label: "Audit Logging",           desc: "Log all admin actions for compliance"        },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
                <Toggle checked={security[key]} onChange={() => setSecurity(s => ({...s, [key]: !s[key]}))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}