import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { queryOptions } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

export const getStudies = createServerFn({ method: 'GET' }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  const client = createClient<Database>(process.env['SUPABASE_URL']!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey', key); return fetch(input, { ...init, headers }); } },
  });
  const { data, error } = await client.from('studies').select('*').order('osdr_accession', { ascending: false });
  if (error) throw new Error('Study records are temporarily unavailable. Please try again.');
  return data;
});
export const studiesQuery = queryOptions({ queryKey: ['studies'], queryFn: () => getStudies(), staleTime: 60000 });