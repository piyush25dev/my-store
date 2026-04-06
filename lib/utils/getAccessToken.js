// lib/utils/getAccessToken.js - FIXED VERSION
import { supabase } from "@/lib/supabase";

export const getAccessToken = async () => {
  try {
    // Try to get session from Supabase auth
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      throw new Error("Failed to get session");
    }

    if (!session) {
      throw new Error("No active session - user not authenticated");
    }

    if (!session.access_token) {
      throw new Error("No access token in session");
    }

    return session.access_token;
  } catch (err) {
    console.error("getAccessToken error:", err);
    throw err;
  }
};