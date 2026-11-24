import fs from 'fs';
import path from 'path';
import { SchoolProfile, AdministrasiDocuments, SupervisiRecord } from './types';
import { initialProfile, initialDocuments, initialSupervisiRecord } from './initialData';

export interface AppDatabase {
  profile: SchoolProfile;
  documents: AdministrasiDocuments;
  supervision: SupervisiRecord;
  updatedAt: string;
}

const IS_SERVERLESS = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
const DATA_DIR = IS_SERVERLESS ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export function getDatabase(): AppDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb: AppDatabase = {
        profile: initialProfile,
        documents: initialDocuments,
        supervision: initialSupervisiRecord,
        updatedAt: new Date().toISOString()
      };
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      } catch (err) {
        // Fallback for strict read-only environments
      }
      return initialDb;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed: AppDatabase = JSON.parse(fileContent);
    return parsed;
  } catch (error) {
    return {
      profile: initialProfile,
      documents: initialDocuments,
      supervision: initialSupervisiRecord,
      updatedAt: new Date().toISOString()
    };
  }
}

export function saveDatabase(data: Partial<AppDatabase>): AppDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const current = getDatabase();
    const updated: AppDatabase = {
      profile: data.profile || current.profile,
      documents: data.documents || current.documents,
      supervision: data.supervision || current.supervision,
      updatedAt: new Date().toISOString()
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Filesystem write prevented in serverless lambda:', err);
    }
    return updated;
  } catch (error) {
    return {
      profile: data.profile || initialProfile,
      documents: data.documents || initialDocuments,
      supervision: data.supervision || initialSupervisiRecord,
      updatedAt: new Date().toISOString()
    };
  }
}

export function resetDatabase(): AppDatabase {
  const initialDb: AppDatabase = {
    profile: initialProfile,
    documents: initialDocuments,
    supervision: initialSupervisiRecord,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}
