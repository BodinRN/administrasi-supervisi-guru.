import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase, resetDatabase } from '@/lib/db';
import { getDbPool, getCloudData, saveCloudData } from '@/lib/cloudDb';

export async function GET() {
  try {
    const isCloudDb = !!getDbPool();
    if (isCloudDb) {
      const cloudData = await getCloudData('default');
      if (cloudData) {
        return NextResponse.json({ success: true, isCloudDb: true, data: cloudData });
      }
    }

    const db = getDatabase();
    return NextResponse.json({ success: true, isCloudDb: false, data: db });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    const isCloudDb = !!getDbPool();

    if (action === 'reset') {
      const reset = resetDatabase();
      if (isCloudDb) {
        await saveCloudData('default', reset);
      }
      return NextResponse.json({ success: true, message: 'Data berhasil direset ke setelan awal', data: reset });
    }

    if (action === 'update_profile') {
      let updated;
      if (isCloudDb) {
        updated = await saveCloudData('default', { profile: payload });
      }
      if (!updated) {
        updated = saveDatabase({ profile: payload });
      }
      return NextResponse.json({ success: true, message: 'Profil sekolah & guru berhasil diperbarui', data: updated });
    }

    if (action === 'update_document') {
      const { docKey, data } = payload;
      let current;
      if (isCloudDb) {
        current = await getCloudData('default');
      }
      if (!current) {
        current = getDatabase();
      }

      const updatedDocs = {
        ...current.documents,
        [docKey]: data
      };

      let updated;
      if (isCloudDb) {
        updated = await saveCloudData('default', { documents: updatedDocs });
      }
      if (!updated) {
        updated = saveDatabase({ documents: updatedDocs });
      }

      return NextResponse.json({ success: true, message: `Dokumen ${docKey} berhasil disimpan`, data: updated });
    }

    if (action === 'update_supervision') {
      let updated;
      if (isCloudDb) {
        updated = await saveCloudData('default', { supervision: payload });
      }
      if (!updated) {
        updated = saveDatabase({ supervision: payload });
      }
      return NextResponse.json({ success: true, message: 'Data supervisi berhasil disimpan', data: updated });
    }

    if (action === 'import_all') {
      let updated;
      if (isCloudDb) {
        updated = await saveCloudData('default', payload);
      }
      if (!updated) {
        updated = saveDatabase(payload);
      }
      return NextResponse.json({ success: true, message: 'Data berhasil diimpor', data: updated });
    }

    // Default save
    let updated;
    if (isCloudDb) {
      updated = await saveCloudData('default', body);
    }
    if (!updated) {
      updated = saveDatabase(body);
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
