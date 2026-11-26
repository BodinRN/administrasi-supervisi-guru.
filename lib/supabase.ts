import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { AppDatabase } from './db';
import { initialProfile, initialDocuments, initialSupervisiRecord } from './initialData';

let browserSupabaseInstance: SupabaseClient | null = null;

function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  return { url, key };
}

/**
 * Browser client with persisted session for teacher personal authentication.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (!browserSupabaseInstance) {
    browserSupabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserSupabaseInstance;
}

/**
 * Per-request server client scoped to the caller's JWT access token so RLS auth.uid() applies.
 */
export function getSupabaseServerClient(accessToken?: string): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
  });
}

export function getSupabaseInfo() {
  const { url, key } = getSupabaseCredentials();
  let host = '';
  try {
    if (url) {
      host = new URL(url).hostname;
    }
  } catch {
    host = url;
  }

  return {
    configured: !!(url && key),
    url,
    host,
    tableName: 'supervisi_records',
  };
}

export async function getAuthenticatedUser(accessToken: string): Promise<User | null> {
  const supabase = getSupabaseServerClient(accessToken);
  if (!supabase || !accessToken) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return null;
  }
  return data.user;
}

export function createBlankDatabase(): AppDatabase {
  return {
    profile: initialProfile,
    documents: initialDocuments,
    supervision: initialSupervisiRecord,
    updatedAt: new Date().toISOString(),
  };
}

export async function getSupabaseUserData(
  accessToken: string,
  userId: string
): Promise<{ data: AppDatabase | null; error?: string }> {
  const supabase = getSupabaseServerClient(accessToken);
  if (!supabase) {
    return { data: null, error: 'Supabase belum dikonfigurasi pada environment.' };
  }

  try {
    const { data, error } = await supabase
      .from('supervisi_records')
      .select('profile, documents, supervision, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      return { data: null, error: error.message };
    }

    if (data && data.profile && data.documents && data.supervision) {
      return {
        data: {
          profile: data.profile,
          documents: data.documents,
          supervision: data.supervision,
          updatedAt: data.updated_at
            ? new Date(data.updated_at).toISOString()
            : new Date().toISOString(),
        },
      };
    }

    // Pengguna baru: buat record kosong pribadi milik user ini sendiri (tidak pre-filled)
    const blankDb = createBlankDatabase();
    const { error: insertError } = await supabase.from('supervisi_records').insert({
      id: userId,
      user_id: userId,
      profile: blankDb.profile,
      documents: blankDb.documents,
      supervision: blankDb.supervision,
      updated_at: blankDb.updatedAt,
    });

    if (insertError) {
      console.error('Gagal inisialisasi record pribadi di Supabase:', insertError);
      return { data: null, error: insertError.message };
    }

    return { data: blankDb };
  } catch (err: any) {
    console.error('Supabase exception:', err);
    return { data: null, error: err?.message || 'Terjadi kesalahan saat membaca Supabase.' };
  }
}

export async function saveSupabaseUserData(
  accessToken: string,
  userId: string,
  payload: Partial<AppDatabase>
): Promise<{ data: AppDatabase | null; error?: string }> {
  const supabase = getSupabaseServerClient(accessToken);
  if (!supabase) {
    return { data: null, error: 'Supabase belum dikonfigurasi.' };
  }

  try {
    const { data: currentData, error: fetchErr } = await supabase
      .from('supervisi_records')
      .select('profile, documents, supervision')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) {
      return { data: null, error: fetchErr.message };
    }

    const existing: AppDatabase =
      currentData && currentData.profile && currentData.documents && currentData.supervision
        ? {
            profile: currentData.profile,
            documents: currentData.documents,
            supervision: currentData.supervision,
            updatedAt: new Date().toISOString(),
          }
        : createBlankDatabase();

    const updated: AppDatabase = {
      profile: payload.profile ? { ...existing.profile, ...payload.profile } : existing.profile,
      documents: payload.documents ? { ...existing.documents, ...payload.documents } : existing.documents,
      supervision: payload.supervision ? { ...existing.supervision, ...payload.supervision } : existing.supervision,
      updatedAt: new Date().toISOString(),
    };

    const { error: upsertErr } = await supabase.from('supervisi_records').upsert(
      {
        id: userId,
        user_id: userId,
        profile: updated.profile,
        documents: updated.documents,
        supervision: updated.supervision,
        updated_at: updated.updatedAt,
      },
      { onConflict: 'user_id' }
    );

    if (upsertErr) {
      console.error('Supabase upsert error:', upsertErr);
      return { data: null, error: upsertErr.message };
    }

    return { data: updated };
  } catch (err: any) {
    console.error('Supabase save exception:', err);
    return { data: null, error: err?.message || 'Gagal menyimpan ke Supabase.' };
  }
}
