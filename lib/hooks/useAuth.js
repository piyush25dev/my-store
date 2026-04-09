// lib/hooks/useAuth.js

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // ── Sign Up ───────────────────────────────────────────────────────────────
  // Passes role in auth metadata → the DB trigger handle_new_user() reads it
  // and creates the profile row automatically. No manual insert needed.
  const signUp = async (email, password, fullName, userRole = "customer") => {
    try {
      setError(null);

      // Whitelist roles so nothing unexpected gets stored
      const safeRole = ["customer", "creator"].includes(userRole)
        ? userRole
        : "customer";

      const { data: { user: newUser }, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_role: safeRole, // trigger reads raw_user_meta_data->>'user_role'
            },
          },
        });

      if (signUpError) return { error: signUpError.message };
      if (!newUser)   return { error: "Failed to create user" };

      // ✅ Do NOT manually insert into profiles here.
      //    The trigger on_auth_user_created fires automatically and creates
      //    the profile with the correct role from raw_user_meta_data.
      //    A manual insert races with the trigger and can cause conflicts
      //    or silently overwrite the role with a wrong value.

      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  // ── Sign In ───────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    try {
      setError(null);

      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      if (!user)  return { error: "Failed to sign in" };

      // Safety net: if profile was somehow never created by the trigger,
      // create it now using the role stored in auth metadata.
      const { error: profileCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileCheckError) {
        const safeRole = ["customer", "creator"].includes(
          user.user_metadata?.user_role
        )
          ? user.user_metadata.user_role
          : "customer";

        await supabase.from("profiles").insert({
          id:           user.id,
          display_name: user.user_metadata?.full_name || email.split("@")[0],
          user_role:    safeRole,
          is_verified:  false,
          created_at:   new Date().toISOString(),
          updated_at:   new Date().toISOString(),
        });
      }

      setUser(user);
      return { error: null, user };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) return { error: error.message };
      setUser(null);
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  // ── OAuth Sign In ─────────────────────────────────────────────────────────
  const signInWithOAuth = async (provider) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  return { user, loading, error, signUp, signIn, signOut, signInWithOAuth };
}