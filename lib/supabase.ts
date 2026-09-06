import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient !== undefined) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  browserClient = url && publishableKey ? createClient(url, publishableKey, {
    // Keep login in memory only: refreshing or opening another tab starts signed out.
    auth: { persistSession: false },
  }) : null;
  return browserClient;
}
