export type SessionUser = { id: string; email: string };

export function isAuthenticated(): boolean {
  // Offline mode stub. Replace with Supabase/auth provider when ready.
  return true;
}
