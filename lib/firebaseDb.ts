// lib/firebaseDb.ts — Server-side Firestore (via firebase-admin) — replaces lib/supabase.ts
import { cert, getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { AppDatabase } from './db';
import { initialProfile, initialDocuments, initialSupervisiRecord } from './initialData';

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      return initializeApp({ credential: cert(serviceAccount), projectId });
    } catch {
      // fall through to projectId-only init
    }
  }

  // Fallback: Application Default Credentials (works in GCP/Firebase hosting)
  return initializeApp({ projectId });
}

function getDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getFirebaseInfo() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  return {
    configured: !!projectId,
    projectId,
    host: 'firestore.googleapis.com',
    collectionName: 'supervisi_records',
  };
}

export function createBlankDatabase(): AppDatabase {
  return {
    profile: initialProfile,
    documents: initialDocuments,
    supervision: initialSupervisiRecord,
    updatedAt: new Date().toISOString(),
  };
}

/** Verify Firebase ID Token and return uid, or null if invalid. */
export async function verifyFirebaseToken(idToken: string): Promise<{ uid: string; email?: string } | null> {
  try {
    const decoded = await getAdminAuth(getAdminApp()).verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

/** Load user data from Firestore (creates blank record for new users). */
export async function getFirebaseUserData(
  userId: string
): Promise<{ data: AppDatabase | null; error?: string }> {
  try {
    const db = getDb();
    const ref = db.collection('supervisi_records').doc(userId);
    const snap = await ref.get();

    if (snap.exists) {
      const d = snap.data()!;
      if (d.profile && d.documents && d.supervision) {
        return {
          data: {
            profile: d.profile,
            documents: d.documents,
            supervision: d.supervision,
            updatedAt: d.updatedAt || new Date().toISOString(),
          },
        };
      }
    }

    // New user: create blank personal record
    const blank = createBlankDatabase();
    await ref.set(blank);
    return { data: blank };
  } catch (err: any) {
    console.error('Firestore read error:', err);
    return { data: null, error: err?.message || 'Gagal membaca data dari Firestore.' };
  }
}

/** Save (merge) user data to Firestore. */
export async function saveFirebaseUserData(
  userId: string,
  payload: Partial<AppDatabase>
): Promise<{ data: AppDatabase | null; error?: string }> {
  try {
    const db = getDb();
    const ref = db.collection('supervisi_records').doc(userId);
    const snap = await ref.get();

    const existing: AppDatabase =
      snap.exists && snap.data()?.profile && snap.data()?.documents && snap.data()?.supervision
        ? (snap.data() as AppDatabase)
        : createBlankDatabase();

    const updated: AppDatabase = {
      profile: payload.profile ? { ...existing.profile, ...payload.profile } : existing.profile,
      documents: payload.documents
        ? { ...existing.documents, ...payload.documents }
        : existing.documents,
      supervision: payload.supervision
        ? { ...existing.supervision, ...payload.supervision }
        : existing.supervision,
      updatedAt: new Date().toISOString(),
    };

    await ref.set(updated, { merge: true });
    return { data: updated };
  } catch (err: any) {
    console.error('Firestore write error:', err);
    return { data: null, error: err?.message || 'Gagal menyimpan ke Firestore.' };
  }
}
