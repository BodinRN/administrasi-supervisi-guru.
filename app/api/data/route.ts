import { NextResponse } from 'next/server';
import {
  getAuthenticatedUser,
  getSupabaseUserData,
  saveSupabaseUserData,
  getSupabaseInfo,
  createBlankDatabase,
} from '@/lib/supabase';

function extractBearerToken(request: Request): string {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return '';
}

export async function GET(request: Request) {
  try {
    const supabaseInfo = getSupabaseInfo();
    if (!supabaseInfo.configured) {
      return NextResponse.json(
        {
          success: false,
          provider: 'unconfigured',
          error: 'Variabel NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY belum dikonfigurasi.',
        },
        { status: 503 }
      );
    }

    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sesi guru tidak ditemukan. Silakan masuk terlebih dahulu.',
        },
        { status: 401 }
      );
    }

    const user = await getAuthenticatedUser(token);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sesi login tidak valid atau telah berakhir. Silakan masuk ulang.',
        },
        { status: 401 }
      );
    }

    const result = await getSupabaseUserData(token, user.id);
    if (!result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Gagal memuat data pribadi dari Supabase.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: 'supabase',
      host: supabaseInfo.host,
      tableName: supabaseInfo.tableName,
      userId: user.id,
      email: user.email,
      data: result.data,
      message: 'Data pribadi guru berhasil dimuat dari Supabase Cloud.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseInfo = getSupabaseInfo();
    if (!supabaseInfo.configured) {
      return NextResponse.json(
        { success: false, error: 'Supabase belum dikonfigurasi.' },
        { status: 503 }
      );
    }

    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Autentikasi diperlukan untuk menyimpan data ke Supabase.' },
        { status: 401 }
      );
    }

    const user = await getAuthenticatedUser(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak valid atau kedaluwarsa.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, payload } = body;

    if (action === 'reset') {
      const blank = createBlankDatabase();
      const res = await saveSupabaseUserData(token, user.id, blank);
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal mereset data.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'supabase',
        message: 'Seluruh dokumen berhasil dikosongkan ke template awal.',
        data: res.data,
      });
    }

    if (action === 'update_profile') {
      const res = await saveSupabaseUserData(token, user.id, { profile: payload });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal menyimpan profil.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'supabase',
        message: 'Profil sekolah & guru berhasil disimpan ke Supabase.',
        data: res.data,
      });
    }

    if (action === 'update_document') {
      const { docKey, data } = payload || {};
      if (!docKey) {
        return NextResponse.json({ success: false, error: 'Parameter docKey wajib diisi.' }, { status: 400 });
      }

      const currentRes = await getSupabaseUserData(token, user.id);
      if (!currentRes.data) {
        return NextResponse.json({ success: false, error: currentRes.error || 'Gagal mengambil data saat ini.' }, { status: 500 });
      }

      const updatedDocs = {
        ...currentRes.data.documents,
        [docKey]: data,
      };

      const res = await saveSupabaseUserData(token, user.id, { documents: updatedDocs });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal menyimpan dokumen.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'supabase',
        message: `Dokumen ${docKey} berhasil disimpan ke Supabase.`,
        data: res.data,
      });
    }

    if (action === 'update_supervision') {
      const res = await saveSupabaseUserData(token, user.id, { supervision: payload });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal menyimpan supervisi.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'supabase',
        message: 'Hasil evaluasi supervisi berhasil disimpan ke Supabase.',
        data: res.data,
      });
    }

    if (action === 'import_all') {
      const res = await saveSupabaseUserData(token, user.id, {
        profile: payload.profile,
        documents: payload.documents,
        supervision: payload.supervision,
      });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal memulihkan cadangan.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'supabase',
        message: 'Seluruh dokumen berhasil dipulihkan dan disinkronkan ke Supabase.',
        data: res.data,
      });
    }

    const res = await saveSupabaseUserData(token, user.id, body);
    if (!res.data) {
      return NextResponse.json({ success: false, error: res.error || 'Gagal menyimpan perubahan.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      provider: 'supabase',
      message: 'Perubahan berhasil disimpan ke Supabase.',
      data: res.data,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
