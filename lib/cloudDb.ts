import { Pool } from 'pg';
import { AppDatabase } from './db';
import { initialProfile, initialDocuments, initialSupervisiRecord } from './initialData';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export async function initCloudDb(): Promise<void> {
  const p = getDbPool();
  if (!p) return;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS supervisi_records (
      id VARCHAR(100) PRIMARY KEY,
      profile JSONB NOT NULL,
      documents JSONB NOT NULL,
      supervision JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await p.query(createTableQuery);
  } catch (error) {
    console.error('Error initializing cloud PostgreSQL table:', error);
  }
}

export async function getCloudData(recordId: string = 'default'): Promise<AppDatabase | null> {
  const p = getDbPool();
  if (!p) return null;

  try {
    await initCloudDb();
    const res = await p.query('SELECT profile, documents, supervision, updated_at FROM supervisi_records WHERE id = $1', [recordId]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        profile: row.profile,
        documents: row.documents,
        supervision: row.supervision,
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
      };
    }

    // If record doesn't exist yet, insert initial seed
    const initialDb: AppDatabase = {
      profile: initialProfile,
      documents: initialDocuments,
      supervision: initialSupervisiRecord,
      updatedAt: new Date().toISOString()
    };

    await p.query(
      `INSERT INTO supervisi_records (id, profile, documents, supervision, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (id) DO NOTHING`,
      [recordId, JSON.stringify(initialDb.profile), JSON.stringify(initialDb.documents), JSON.stringify(initialDb.supervision)]
    );

    return initialDb;
  } catch (error) {
    console.error('Error fetching data from PostgreSQL:', error);
    return null;
  }
}

export async function saveCloudData(recordId: string = 'default', data: Partial<AppDatabase>): Promise<AppDatabase | null> {
  const p = getDbPool();
  if (!p) return null;

  try {
    await initCloudDb();
    const existing = await getCloudData(recordId) || {
      profile: initialProfile,
      documents: initialDocuments,
      supervision: initialSupervisiRecord,
      updatedAt: new Date().toISOString()
    };

    const updated: AppDatabase = {
      profile: data.profile || existing.profile,
      documents: data.documents || existing.documents,
      supervision: data.supervision || existing.supervision,
      updatedAt: new Date().toISOString()
    };

    await p.query(
      `INSERT INTO supervisi_records (id, profile, documents, supervision, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (id) DO UPDATE SET
         profile = EXCLUDED.profile,
         documents = EXCLUDED.documents,
         supervision = EXCLUDED.supervision,
         updated_at = NOW()`,
      [recordId, JSON.stringify(updated.profile), JSON.stringify(updated.documents), JSON.stringify(updated.supervision)]
    );

    return updated;
  } catch (error) {
    console.error('Error saving data to PostgreSQL:', error);
    return null;
  }
}
