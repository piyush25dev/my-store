"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User, Store, Bell, CreditCard, CheckCircle2, Save,
  Loader2, Upload, X, Lock, Eye, EyeOff, AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { creatorSettings } from "@/app/data/Dashboard";

export default function SettingsPage() {
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [saved,           setSaved]           = useState(false);
  const [saveError,       setSaveError]       = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userId,          setUserId]          = useState(null);

  // Profile
  const [name,          setName]          = useState("");
  const [handle,        setHandle]        = useState("");
  const [email,         setEmail]         = useState("");
  const [phone,         setPhone]         = useState("");   // ← added
  const [bio,           setBio]           = useState("");
  const [avatarUrl,     setAvatarUrl]     = useState("");
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Password
  const [showNewPassword,     setShowNewPassword]     = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData,        setPasswordData]        = useState({ newPassword: "", confirmPassword: "" });
  const [passwordError,       setPasswordError]       = useState("");
  const [passwordSuccess,     setPasswordSuccess]     = useState(false);
  const [savingPassword,      setSavingPassword]      = useState(false);

  // Store / notifs
  const [store,  setStore]  = useState(creatorSettings.store);
  const [notifs, setNotifs] = useState(creatorSettings.notifications);

  // ── Fetch profile ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        setUserId(user.id);
        setEmail(user.email || "");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("display_name, avatar_url, phone_number, country, bio")
          .eq("id", user.id)
          .single();

        if (profileError) { console.error(profileError.message); return; }

        setName(profile.display_name   || "");
        setBio(profile.bio             || "");
        setPhone(profile.phone_number  || "");   // ← added
        setAvatarUrl(profile.avatar_url || "");
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError("");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) { setSaveError("You are not logged in"); return; }
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: name,
          phone_number: phone,          // ← added
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) { setSaveError(error.message); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ──────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordError("");
    if (!passwordData.newPassword)                                        { setPasswordError("New password is required"); return; }
    if (passwordData.newPassword.length < 6)                              { setPasswordError("Password must be at least 6 characters"); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword)        { setPasswordError("Passwords do not match"); return; }
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

  const avatarInitials = name
    ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "··";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
          disabled={saving}
          className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-full gap-2 text-xs sm:px-4 sm:py-2 sm:text-sm"
        >
          {saving ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            : saved ? <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
            : <Save className="h-3 w-3 sm:h-4 sm:w-4" />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {saveError && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {saveError}
        </div>
      )}

      {/* ── Profile Card ── */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" /> Profile
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

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="text-sm border-slate-200 focus:border-slate-400" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Handle</Label>
              <Input value={handle} onChange={e => setHandle(e.target.value)} className="text-sm border-slate-200 font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Email Address</Label>
              <Input type="email" value={email} readOnly className="text-sm border-slate-200 bg-slate-50 text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Phone Number</Label>
              <Input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 00000 00000"
                className="text-sm border-slate-200 focus:border-slate-400"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-500">Bio</Label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none text-slate-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Password Card ── */}
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

      {/* ── Store Card ── */}
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
              { key: "taxEnabled",      label: "Include GST in prices",    desc: "18% GST auto-applied at checkout"          },
              { key: "instantDelivery", label: "Instant digital delivery", desc: "Files delivered immediately after payment" },
              { key: "allowReviews",    label: "Allow customer reviews",   desc: "Buyers can leave ratings and reviews"      },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
                <button onClick={() => setStore(s => ({ ...s, [key]: !s[key] }))}
                  className={`w-10 h-6 rounded-full transition-colors ${store[key] ? "bg-slate-900" : "bg-slate-200"} relative`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${store[key] ? "left-5" : "left-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Notifications Card ── */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" /> Notifications
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-3">
          {[
            { key: "orderAlerts",     label: "New order alerts",      desc: "Get notified when a purchase is made" },
            { key: "reviewAlerts",    label: "Review notifications",  desc: "When a customer leaves a review"      },
            { key: "disputeAlerts",   label: "Dispute alerts",        desc: "When a refund or dispute is raised"   },
            { key: "weeklyReport",    label: "Weekly summary report", desc: "Emailed every Monday morning"         },
            { key: "marketingEmails", label: "Marketing tips",        desc: "Product growth advice from Premium"   },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
              <button onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                className={`w-10 h-6 rounded-full transition-colors ${notifs[key] ? "bg-slate-900" : "bg-slate-200"} relative shrink-0`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[key] ? "left-5" : "left-1"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Payout Card ── */}
      <Card className="border-slate-200/60 shadow-sm bg-white/90">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" /> Payout Details
          </h3>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Pending Payout", value: `₹${creatorSettings.payout.pending.toLocaleString()}`,   badge: "Next: Jan 20" },
              { label: "Total Paid Out", value: `₹${creatorSettings.payout.totalPaid.toLocaleString()}`, badge: null },
              { label: "Payment Method", value: creatorSettings.payout.method,                            badge: null },
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
          <Button variant="outline" className="text-xs rounded-full border-slate-200 text-slate-600">
            Update Bank Details
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}