import { createClient } from "@supabase/supabase-js";

// Shared Supabase client for the whole frontend.
// Used now for avatar uploads (Storage); the auth rewrite (Phase 3)
// will reuse this same instance for sessions and OAuth.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in dev instead of producing confusing network errors later
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Set them in frontend/.env locally and in Vercel's environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads an avatar image to the public `avatars` bucket and returns its public URL.
 * @param {File} file - image file from an <input type="file">
 * @param {string} assigneeId - used to build a stable, unique path
 * @returns {Promise<string>} public URL of the uploaded image
 */
export async function uploadAvatar(file, assigneeId) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${assigneeId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
