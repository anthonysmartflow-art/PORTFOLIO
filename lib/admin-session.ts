import type { SupabaseClient } from '@supabase/supabase-js';

export function isRecoveryLink(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return params.get('type') === 'recovery' && Boolean(params.get('access_token')) && Boolean(params.get('refresh_token'));
}

export async function beginAdminVisit(auth: SupabaseClient['auth'], recoveryLink: boolean) {
  const { data, error } = await auth.getSession();
  if (error) throw error;
  // A complete recovery link must also have produced a valid Supabase session.
  if (recoveryLink && data.session) return true;
  if (data.session) {
    const { error: signOutError } = await auth.signOut({ scope: 'local' });
    if (signOutError) throw signOutError;
  }
  return false;
}
