"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Settings, Percent, Zap, Shield, Save, User,
  CheckCircle2, AlertTriangle, Loader2, AlertCircle,
  Upload, X, Lock, Eye, EyeOff,
} from "lucide-react";
import { platformSettings } from "@/app/data/Admindata";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${checked ? "bg-slate-900" : "bg-slate-200"}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-5" : "left-1"}`} />
  </button>
);

export default function AdminSettingsPage() {
  // ── Platform state (static) ──────────────────────────────────────────────
  const [general,  setGeneral]  = useState(platformSettings.general);
  const [fees,     setFees]     = useState(platformSettings.fees);
  const [features, setFeatures] = useState(platformSettings.features);
  const [security, setSecurity] = useState(platformSettings.security);
  const [saved,    setSaved]    = useState(false);

  // ── Profile state ────────────────────────────────────────────────────────
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [profileSaved,    setProfileSaved]    = useState(false);
  const [saveError,       setSaveError]       = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userId,          setUserId]          = useState(null);

  const [adminName,     setAdminName]     = useState("");
  const [adminEmail,    setAdminEmail]    = useState("");
  const [adminPhone,    setAdminPhone]    = useState("");
  const [adminBio,      setAdminBio]      = useState("");
  const [avatarUrl,     setAvatarUrl]     = useState("");
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // ── Password state ───────────────────────────────────────────────────────
  const [showNewPassword,     setShowNewPassword]     = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData,        setPasswordData]        = useState({ newPassword: "", confirmPassword: "" });
  const [passwordError,       setPasswordError]       = useState("");
  const [passwordSuccess,     setPasswordSuccess]     = useState(false);
  const [savingPassword,      setSavingPassword]      = useState(false);

  // ── Fetch profile on mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        setUserId(user.id);
        setAdminEmail(user.email || "");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("display_name, avatar_url, phone_number, bio")
          .eq("id", user.id)
          .single();

        if (profileError) { console.error(profileError.message); return; }

        setAdminName(profile.display_name  || "");
        setAdminPhone(profile.phone_number || "");
        setAdminBio(profile.bio            || "");
        setAvatarUrl(profile.avatar_url    || "");
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Avatar file select ───────────────────────────────────────────────────
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setSaveError("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024)    { setSaveError("Image size must be less than 5MB"); return; }
    setAvatarFile(file);
    setSaveError("");
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Upload avatar ────────────────────────────────────────────────────────
  const handleUploadAvatar = async () => {
    if (!avatarFile || !userId) { setSaveError("Please select an image"); return; }
    try {
      setUploadingAvatar(true);
      setSaveError("");
      if (avatarUrl) {
        const oldFileName = avatarUrl.split("/").pop();
        await supabase.storage.from("avatars").remove([`${userId}/${oldFileName}`]);
      }
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, avatarFile);
      if (uploadError) { setSaveError("Upload failed: " + uploadError.message); return; }
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (updateError) { setSaveError("Failed to save avatar: " + updateError.message); return; }
      setAvatarUrl(publicUrl);
      setAvatarFile(null);
      setAvatarPreview("");
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setSaveError(err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSaveError("");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) { setSaveError("You are not logged in"); return; }
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: adminName,
          phone_number: adminPhone,
          bio:          adminBio,
          updated_at:   new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) { setSaveError(error.message); return; }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setSaveError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ──────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordError("");
    if (!passwordData.newPassword)                                 { setPasswordError("New password is required"); return; }
    if (passwordData.newPassword.length < 6)                      { setPasswordError("Password must be at least 6 characters"); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { setPasswordError("Passwords do not match"); return; }
    try {
      setSavingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if (error) { setPasswordError(error.message); return; }
      setPasswordSuccess(true);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const avatarInitials = adminName
    ? adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

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

      {saveError && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {saveError}
        </div>
      )}

      {/* ── Admin Profile ── */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" /> Admin Profile
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-6">

          {/* Avatar upload */}
          <div className="border-b border-slate-100 pb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Profile Picture</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="shrink-0">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Preview" width={80} height={80} unoptimized
                    className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-blue-200" />
                ) : avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" width={80} height={80}
                    className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {avatarInitials}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-xs text-slate-400">JPG, PNG or GIF · Max 5MB</p>
                <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-400 transition-colors w-fit">
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" disabled={uploadingAvatar} />
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Choose image</span>
                </label>
                {avatarFile && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg w-fit">
                    <p className="text-xs font-medium text-blue-800 max-w-[180px] truncate">{avatarFile.name}</p>
                    <button onClick={() => { setAvatarFile(null); setAvatarPreview(""); }} className="text-blue-400 hover:text-blue-600 shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {avatarFile && (
                  <button onClick={handleUploadAvatar} disabled={uploadingAvatar}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploadingAvatar
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                      : <><Upload className="w-3.5 h-3.5" /> Upload Photo</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Full Name</Label>
              <Input value={adminName} onChange={e => setAdminName(e.target.value)} className="text-sm border-slate-200 focus:border-slate-400" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Phone Number</Label>
              <Input type="tel" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} placeholder="+91 00000 00000" className="text-sm border-slate-200 focus:border-slate-400" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-500">Email Address</Label>
              <Input type="email" value={adminEmail} readOnly className="text-sm border-slate-200 bg-slate-50 text-slate-400" />
              <p className="text-[10px] text-slate-400">Email changes require re-authentication.</p>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-500">Bio</Label>
              <textarea value={adminBio} onChange={e => setAdminBio(e.target.value)} rows={3}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none text-slate-700" />
            </div>
          </div>

          <button onClick={handleSaveProfile} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : profileSaved
              ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
              : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </CardContent>
      </Card>

      {/* ── Change Password ── */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" /> Change Password
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          {passwordSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-900">Password updated successfully</p>
            </div>
          )}
          {passwordError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="text-sm text-rose-800">{passwordError}</p>
            </div>
          )}
          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={e => { setPasswordData(p => ({ ...p, newPassword: e.target.value })); setPasswordError(""); }}
                  className="text-sm border-slate-200 pr-10"
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShowNewPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={e => { setPasswordData(p => ({ ...p, confirmPassword: e.target.value })); setPasswordError(""); }}
                  className="text-sm border-slate-200 pr-10"
                  placeholder="Repeat new password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleChangePassword} disabled={savingPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {savingPassword
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              : <><Lock className="w-4 h-4" /> Change Password</>}
          </button>
        </CardContent>
      </Card>

      {/* ── General ── */}
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
              <Input value={general.platformName} onChange={e => setGeneral(g => ({ ...g, platformName: e.target.value }))} className="text-sm border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Domain</Label>
              <Input value={general.domain} onChange={e => setGeneral(g => ({ ...g, domain: e.target.value }))} className="text-sm border-slate-200 font-mono" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-500">Support Email</Label>
              <Input type="email" value={general.supportEmail} onChange={e => setGeneral(g => ({ ...g, supportEmail: e.target.value }))} className="text-sm border-slate-200" />
            </div>
          </div>
          <div className="space-y-2 pt-1">
            {[
              { key: "maintenanceMode", label: "Maintenance Mode",         desc: "Takes platform offline for all users", danger: true  },
              { key: "signupsOpen",     label: "Open Creator Signups",     desc: "Allow new creators to register",       danger: false },
              { key: "requireKYC",      label: "Require KYC Verification", desc: "Mandate KYC before first payout",      danger: false },
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
                <Toggle checked={general[key]} onChange={() => setGeneral(g => ({ ...g, [key]: !g[key] }))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Fees ── */}
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
                <Input type="number" value={fees.commissionPct}
                  onChange={e => setFees(f => ({ ...f, commissionPct: e.target.value }))}
                  className="text-sm border-slate-200 pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Payment Processing (%)</Label>
              <div className="relative">
                <Input type="number" value={fees.paymentProcessingFee}
                  onChange={e => setFees(f => ({ ...f, paymentProcessingFee: e.target.value }))}
                  className="text-sm border-slate-200 pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Min Payout Amount (₹)</Label>
              <Input type="number" value={fees.minPayoutAmount}
                onChange={e => setFees(f => ({ ...f, minPayoutAmount: e.target.value }))}
                className="text-sm border-slate-200" />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500">
              Current effective rate:{" "}
              <span className="font-semibold text-slate-800">
                {Number(fees.commissionPct) + Number(fees.paymentProcessingFee)}%
              </span>{" "}
              per transaction
              {fees.gstIncluded && <span className="ml-2 text-slate-400">(18% GST included in creator price)</span>}
            </p>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">GST Inclusive Pricing</p>
              <p className="text-[10px] text-slate-400">Product prices include 18% GST</p>
            </div>
            <Toggle checked={fees.gstIncluded} onChange={() => setFees(f => ({ ...f, gstIncluded: !f.gstIncluded }))} />
          </div>
        </CardContent>
      </Card>

      {/* ── Feature Flags ── */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-400" /> Feature Flags
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-2">
          {[
            { key: "reviews",              label: "Customer Reviews",      desc: "Allow buyers to leave product reviews"      },
            { key: "wishlists",            label: "Wishlists",             desc: "Buyers can save products to a wishlist"     },
            { key: "coupons",              label: "Discount Coupons",      desc: "Creators can create coupon codes"           },
            { key: "affiliates",           label: "Affiliate Program",     desc: "Enable referral commissions for affiliates" },
            { key: "referralProgram",      label: "Referral Program",      desc: "Buyer referral bonuses and tracking"        },
            { key: "subscriptionProducts", label: "Subscription Products", desc: "Allow recurring subscription products"      },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
              <Toggle checked={features[key]} onChange={() => setFeatures(f => ({ ...f, [key]: !f[key] }))} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Security ── */}
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
              <Input type="number" value={security.sessionTimeoutMins}
                onChange={e => setSecurity(s => ({ ...s, sessionTimeoutMins: e.target.value }))}
                className="text-sm border-slate-200" />
            </div>
          </div>
          <div className="space-y-2">
            {[
              { key: "twoFactorRequired", label: "Require 2FA for Admins", desc: "All admin accounts must use two-factor auth" },
              { key: "ipWhitelist",       label: "IP Whitelist",           desc: "Restrict admin access to approved IPs only"  },
              { key: "auditLogs",         label: "Audit Logging",          desc: "Log all admin actions for compliance"        },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
                <Toggle checked={security[key]} onChange={() => setSecurity(s => ({ ...s, [key]: !s[key] }))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}