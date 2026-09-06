import type { SupabaseClient } from '@supabase/supabase-js';

// Use the authenticated client and existing row policies, just like Save.
export async function resetContent(client: SupabaseClient, id: 'hero_headline' | 'profile_photo', baseline: string) {
  const { data, error } = await client.from('site_content')
    .update({ content: baseline }).eq('id', id).select('content').maybeSingle();
  if (error || !data) throw new Error('Reset could not be saved. Please try again.');
  return data.content as string;
}
