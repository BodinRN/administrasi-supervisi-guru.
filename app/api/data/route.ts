import { NextResponse } from 'next/server';
import {
  verifyFirebaseToken,
  getFirebaseUserData,
  saveFirebaseUserData,
  getFirebaseInfo,
  createBlankDatabase,
} from '@/lib/firebaseDb';

function extractBearerToken(request: Request): string {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return '';
}

export async function GET(request: Request) {
  try {
    const info = getFirebaseInfo();
    if (!info.configured) {
      return NextResponse.json(
        { success: false, provider: 'unconfigured', error: 'Variabel NEXT_PUBLIC_FIREBASE_PROJECT_ID belum dikonfigurasi.' },
        { status: 503 }
      );
    }

    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Sesi guru tidak ditemukan. Silakan masuk terlebih dahulu.' },
        { status: 401 }
      );
    }

    const user = await verifyFirebaseToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak valid atau telah berakhir. Silakan masuk ulang.' },
        { status: 401 }
      );
    }

    const result = await getFirebaseUserData(user.uid);
    if (!result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Gagal memuat data pribadi dari Firestore.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: 'firebase',
      host: info.host,
      tableName: info.collectionName,
      userId: user.uid,
      email: user.email,
      data: result.data,
      message: 'Data pribadi guru berhasil dimuat dari Firebase Cloud.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const info = getFirebaseInfo();
    if (!info.configured) {
      return NextResponse.json(
        { success: false, error: 'Firebase belum dikonfigurasi.' },
        { status: 503 }
      );
    }

    const token = extractBearerToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Autentikasi diperlukan untuk menyimpan data.' },
        { status: 401 }
      );
    }

    const user = await verifyFirebaseToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Sesi login tidak valid atau kedaluwarsa.' },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Request body tidak valid (bukan JSON).' }, { status: 400 });
    }

    const { action, payload } = body;

    if (action === 'reset') {
      const blank = createBlankDatabase();
      const res = await saveFirebaseUserData(user.uid, blank);
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal mereset data.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'firebase',
        message: 'Seluruh dokumen berhasil dikosongkan ke template awal.',
        data: res.data,
      });
    }

    if (action === 'update_profile') {
      if (!payload || typeof payload !== 'object') {
        return NextResponse.json({ success: false, error: 'Parameter payload profil wajib diisi.' }, { status: 400 });
      }
      const res = await saveFirebaseUserData(user.uid, { profile: payload });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal menyimpan profil.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'firebase',
        message: 'Profil sekolah & guru berhasil disimpan ke Firebase.',
        data: res.data,
      });
    }

    if (action === 'update_document') {
      const { docKey, data } = payload || {};
      if (!docKey || typeof docKey !== 'string') {
        return NextResponse.json({ success: false, error: 'Parameter docKey wajib diisi.' }, { status: 400 });
      }

      const currentRes = await getFirebaseUserData(user.uid);
      if (!currentRes.data) {
        return NextResponse.json({ success: false, error: currentRes.error || 'Gagal mengambil data saat ini.' }, { status: 500 });
      }

      const updatedDocs = { ...currentRes.data.documents, [docKey]: data };
      const res = await saveFirebaseUserData(user.uid, { documents: updatedDocs });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal menyimpan dokumen.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'firebase',
        message: `Dokumen ${docKey} berhasil disimpan ke Firebase.`,
        data: res.data,
      });
    }

    if (action === 'update_supervision') {
      if (!payload || typeof payload !== 'object') {
        return NextResponse.json({ success: false, error: 'Parameter payload supervisi wajib diisi.' }, { status: 400 });
      }
      const res = await saveFirebaseUserData(user.uid, { supervision: payload });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal menyimpan supervisi.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'firebase',
        message: 'Hasil evaluasi supervisi berhasil disimpan ke Firebase.',
        data: res.data,
      });
    }

    if (action === 'import_all') {
      if (!payload || typeof payload !== 'object') {
        return NextResponse.json({ success: false, error: 'Parameter payload import wajib diisi.' }, { status: 400 });
      }
      const res = await saveFirebaseUserData(user.uid, {
        profile: payload.profile,
        documents: payload.documents,
        supervision: payload.supervision,
      });
      if (!res.data) {
        return NextResponse.json({ success: false, error: res.error || 'Gagal memulihkan cadangan.' }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        provider: 'firebase',
        message: 'Seluruh dokumen berhasil dipulihkan dan disinkronkan ke Firebase.',
        data: res.data,
      });
    }

    return NextResponse.json(
      { success: false, error: `Aksi tidak dikenal: ${action || '(kosong)'}` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
