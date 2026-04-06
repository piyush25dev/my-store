// lib/hooks/useProfile.js - FIXED VERSION
import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/utils/getAccessToken";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);

      // Get access token
      const token = await getAccessToken();

      // Fetch profile
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Handle 401 - not authenticated
      if (response.status === 401) {
        console.warn("User not authenticated");
        setProfile(null);
        setError(null); // Don't show error for unauthenticated state
        setLoading(false);
        return;
      }

      // Handle other errors
      if (!response.ok) {
        throw new Error(data.error || "Failed to load profile");
      }

      // Success
      setProfile(data.profile);
    } catch (err) {
      console.error("Profile loading error:", err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function update(updates) {
    try {
      setError(null);
      const token = await getAccessToken();

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfile(data.profile);
      return data.profile;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  return {
    profile,
    loading,
    error,
    update,
    reload: loadProfile,
  };
}