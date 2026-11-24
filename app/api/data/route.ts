import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase, resetDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({ success: true, data: db });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === 'reset') {
      const reset = resetDatabase();
      return NextResponse.json({ success: true, message: 'Data berhasil direset ke setelan awal', data: reset });
    }

    if (action === 'update_profile') {
      const updated = saveDatabase({ profile: payload });
      return NextResponse.json({ success: true, message: 'Profil sekolah & guru berhasil diperbarui', data: updated });
    }

    if (action === 'update_document') {
      const { docKey, data } = payload;
      const current = getDatabase();
      const updatedDocs = {
        ...current.documents,
        [docKey]: data
      };
      const updated = saveDatabase({ documents: updatedDocs });
      return NextResponse.json({ success: true, message: `Dokumen ${docKey} berhasil disimpan`, data: updated });
    }

    if (action === 'update_supervision') {
      const updated = saveDatabase({ supervision: payload });
      return NextResponse.json({ success: true, message: 'Data supervisi berhasil disimpan', data: updated });
    }

    if (action === 'import_all') {
      const updated = saveDatabase(payload);
      return NextResponse.json({ success: true, message: 'Data berhasil diimpor', data: updated });
    }

    // Default save
    const updated = saveDatabase(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
