export const protectedRoutes: string[] = []; // No protected routes - everything is public

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-anon-key",
    configured: isSupabaseConfigured(),
  };
}

export function isProtectedPath(_pathname: string) {
  return false; // Nothing is protected
}
