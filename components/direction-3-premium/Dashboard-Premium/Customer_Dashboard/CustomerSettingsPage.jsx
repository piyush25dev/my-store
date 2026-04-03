"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  Shield,
  Smartphone,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [userId, setUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    bio: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    wishlistAlerts: true,
    priceDrops: true,
    emailNewsletter: false,
    smsNotifications: true,
    promotions: true,
  });

  // ── Fetch profile on mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) return;

        setUserId(user.id);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "display_name, avatar_url, user_role, phone_number, country, bio",
          )
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError.message);
          return;
        }

        setProfileData({
          fullName: profile.display_name || "",
          email: user.email || "",
          phone: profile.phone_number || "",
          country: profile.country || "",
          bio: profile.bio || "",
        });

        // Set avatar
        if (profile.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setSaveError("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Handle Avatar File Selection ──────────────────────────────────────────
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSaveError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    setSaveError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ── Upload Avatar ────────────────────────────────────────────────────────
  const handleUploadAvatar = async () => {
    if (!avatarFile || !userId) {
      setSaveError("Please select an image");
      return;
    }

    try {
      setUploadingAvatar(true);
      setSaveError("");

      // Delete old avatar if exists
      if (avatarUrl) {
        const oldFileName = avatarUrl.split("/").pop();
        await supabase.storage
          .from("avatars")
          .remove([`${userId}/${oldFileName}`]);
      }

      // Upload new avatar
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        setSaveError("Failed to upload image: " + uploadError.message);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        setSaveError("Failed to save avatar: " + updateError.message);
        return;
      }

      setAvatarUrl(publicUrl);
      setAvatarFile(null);
      setAvatarPreview("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setSaveError("You are not logged in");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profileData.fullName,
          phone_number: profileData.phone,
          country: profileData.country,
          bio: profileData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        setSaveError(error.message);
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ──────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordError("");

    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        setPasswordError(error.message);
        return;
      }

      setPasswordSuccess(true);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Global Success */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">
              Changes saved successfully
            </p>
            <p className="text-sm text-green-700 mt-0.5">
              Your settings have been updated.
            </p>
          </div>
        </div>
      )}

      {/* Global Error */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{saveError}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Profile Picture
                </h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  {/* Avatar Display */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar Preview"
                          width={128}
                          height={128}
                          className="rounded-full object-cover border-4 border-blue-200 h-auto w-auto"
                          unoptimized // ✅ important for base64 preview
                        />
                      ) : avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="Avatar"
                          width={128}
                          height={128}
                          className="rounded-full object-cover border-4 border-blue-200 h-auto w-auto"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-blue-200">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Upload a profile picture. Maximum size: 5MB. Supported
                        formats: JPG, PNG, GIF
                      </p>

                      <div className="flex flex-col gap-3">
                        <label className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="hidden"
                            disabled={uploadingAvatar}
                          />
                          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <Upload className="w-5 h-5" />
                            <span>Choose an image</span>
                          </div>
                        </label>

                        {avatarFile && (
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">
                              {avatarFile.name}
                            </p>
                            <button
                              onClick={() => {
                                setAvatarFile(null);
                                setAvatarPreview("");
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}

                        {avatarFile && (
                          <button
                            onClick={handleUploadAvatar}
                            disabled={uploadingAvatar}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingAvatar ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload Avatar
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", name: "fullName", type: "text" },
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      disabled: true,
                    },
                    { label: "Phone Number", name: "phone", type: "tel" },
                    { label: "Country", name: "country", type: "text" },
                  ].map(({ label, name, type, disabled }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                        {disabled && (
                          <span className="ml-2 text-xs text-gray-400">
                            (cannot be changed)
                          </span>
                        )}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={profileData[name]}
                        onChange={handleProfileChange}
                        disabled={disabled}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}

                  {/* Bio — full width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={3}
                      placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ── Password Tab ── */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                Change Password
              </h3>

              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-900">
                    Password updated successfully
                  </p>
                </div>
              )}

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">{passwordError}</p>
                </div>
              )}

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {saving ? "Updating..." : "Change Password"}
              </button>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    key: "orderUpdates",
                    label: "Order Updates",
                    description: "Get notifications about your orders",
                  },
                  {
                    key: "wishlistAlerts",
                    label: "Wishlist Alerts",
                    description: "Notify when wishlist items are back in stock",
                  },
                  {
                    key: "priceDrops",
                    label: "Price Drops",
                    description:
                      "Alert when prices drop on your wishlist items",
                  },
                  {
                    key: "emailNewsletter",
                    label: "Email Newsletter",
                    description: "Receive our weekly newsletter",
                  },
                  {
                    key: "smsNotifications",
                    label: "SMS Notifications",
                    description: "Get important updates via SMS",
                  },
                  {
                    key: "promotions",
                    label: "Promotions",
                    description: "Receive promotional offers and deals",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key]}
                        onChange={() => handleNotificationChange(item.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          )}

          {/* ── Privacy Tab ── */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex gap-4">
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Add an extra layer of security to your account
                      </p>
                      <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                  <div className="flex gap-4">
                    <Smartphone className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-purple-900">
                        Connected Devices
                      </p>
                      <p className="text-sm text-purple-700 mt-1">
                        Manage devices and sessions connected to your account
                      </p>
                      <button className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-700">
                        View Devices
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-700 mt-1">
                        Permanently delete your account and all associated data
                      </p>
                      <button className="mt-3 text-sm font-medium text-red-600 hover:text-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
