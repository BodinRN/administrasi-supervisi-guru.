-- Skema Database SIPEN-GURU (Supabase PostgreSQL Free Tier)
-- Mendukung isolasi data pribadi per guru menggunakan Supabase Auth & Row Level Security (RLS).

CREATE TABLE IF NOT EXISTS public.supervisi_records (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile JSONB NOT NULL,
  documents JSONB NOT NULL,
  supervision JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS supervisi_records_user_id_uidx
  ON public.supervisi_records (user_id);

ALTER TABLE public.supervisi_records ENABLE ROW LEVEL SECURITY;

-- Hapus policy publik lama agar data guru tidak saling terbuka/tertimpa
DROP POLICY IF EXISTS "Allow public read supervisi_records" ON public.supervisi_records;
DROP POLICY IF EXISTS "Allow public insert supervisi_records" ON public.supervisi_records;
DROP POLICY IF EXISTS "Allow public update supervisi_records" ON public.supervisi_records;

-- Kebijakan akses pribadi: setiap guru hanya bisa membaca & mengubah datanya sendiri
CREATE POLICY "Users can read own supervisi_records"
  ON public.supervisi_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own supervisi_records"
  ON public.supervisi_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own supervisi_records"
  ON public.supervisi_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own supervisi_records"
  ON public.supervisi_records
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
