# 📚 SIPEN-GURU (Sistem Informasi Perangkat & Evaluasi Supervisi Guru)
> **Aplikasi Fullstack Pribadi Guru untuk Menyusun & Mengelola 15 Poin Administrasi Supervisi Akademik (Standar Kurikulum Merdeka) Lengkap dengan Panduan Referensi, Format Cetak Baku A4, Autentikasi Pribadi, dan Database Cloud Gratis Supabase PostgreSQL.**

---

## 📌 Fitur Utama
- **Ruang Kerja Pribadi Per-Guru (Supabase Auth + RLS)**: Setiap guru login/daftar menggunakan email masing-masing dan memiliki data terisolasi di Supabase (`auth.uid() = user_id`), atau dapat menggunakan Mode Offline Lokal Browser.
- **Formulir Kosong Siap Isi**: Seluruh profil dan 15 dokumen dimulai kosong agar guru mengisi data asli kelas/mapelnya sendiri (bukan data contoh yang langsung jadi), lengkap dengan tombol opsional **Muat Contoh Referensi** bila diperlukan.
- **Referensi Kurikulum Merdeka & Integrasi Antar-Poin**:
  - Setiap poin dilengkapi panel panduan regulasi (Permendikbudristek No. 16/2022, No. 21/2022, No. 12/2024, Panduan Pembelajaran & Asesmen BSKAP), kriteria skor 4 supervisi, Taksonomi Bloom C1–C6, 6 Dimensi Profil Pelajar Pancasila, serta sintaks model pembelajaran.
  - Fitur **tarik data otomatis antar-dokumen**: PROTA ↔ ATP, PROTA → PROMES, ATP → Modul Ajar & KKTP, Presensi → Daftar Nilai, dan Daftar Nilai → Analisis Evaluasi / Remedial / Pengayaan.
- **Format Cetak Resmi A4**: Tombol cetak cepat (`no-print`) dengan kop surat ganda yang dapat dikustomisasi (Pemda/Dinas, Yayasan, maupun Kemenag) dan kolom pengesahan tanda tangan.

---

## 🗄️ Konfigurasi Database Gratis Supabase

Aplikasi menggunakan **Supabase Free Tier (PostgreSQL + Auth + RLS)**.
Skema lengkap tersedia di [supabase/schema.sql](supabase/schema.sql).

### Variabel Lingkungan (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://smxabqhghllbiatodzty.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 🚀 Menjalankan Secara Lokal

```bash
npm.cmd run dev
```
Buka peramban di: `http://localhost:3000`
