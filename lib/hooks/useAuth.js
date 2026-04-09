// lib/hooks/useAuth.js - UPDATED for your profiles table structure
// Works with your actual columns: no email column initially

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user || null);
      } catch (err) {
        console.error("Session error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const signUp = async (email, password, fullName) => {
    try {
      setError(null);

      // 1. Create auth user
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        return { error: signUpError.message };
      }

      if (!newUser) {
        return { error: "Failed to create user" };
      }

      // 2. Create profile record automatically
      // NOTE: Your profiles table doesn't have email column, so we don't insert it
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: newUser.id,
          display_name: fullName,
          user_role: "creator", // Default role for new users
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Don't fail signup if profile creation fails, but log it
        return { error: null };
      }

      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  // ── Sign In ──────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    try {
      setError(null);

      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (!user) {
        return { error: "Failed to sign in" };
      }

      // Ensure profile exists (in case it wasn't created during signup)
      const { data: profile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("id, user_role")
        .eq("id", user.id)
        .single();

      if (profileCheckError) {
        // Profile doesn't exist, create it
        console.log("Profile not found for user:", user.id, "Creating...");
        const { error: createError } = await supabase.from("profiles").insert({
          id: user.id,
          display_name: email.split("@")[0], // Use email prefix as default name
          user_role: "creator",
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (createError) {
          console.error("Failed to create profile:", createError);
          // Continue anyway - profile might exist but query failed
        }
      }

      setUser(user);
      return { error: null, user };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  // ── Sign Out ─────────────────────────────────────────────────────────────
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      setUser(null);
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  // ── OAuth Sign In ────────────────────────────────────────────────────────
  const signInWithOAuth = async (provider) => {
    try {
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
  };
}