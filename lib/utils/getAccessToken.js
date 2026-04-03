import { supabase } from "@/lib/supabase";

export const getAccessToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Not authenticated");
  }

  return session.access_token;
};