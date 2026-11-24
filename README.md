# SIPEN-GURU (Sistem Informasi Perangkat & Evaluasi Supervisi Guru)
### Aplikasi Fullstack Pembantu Guru Membuat Administrasi 15 Poin Supervisi Akademik (Kurikulum Merdeka)

Aplikasi berbasis web Fullstack lokal yang dirancang khusus untuk mempermudah guru dan pihak sekolah dalam menyusun, mengelola, menyimulasikan, dan mencetak dokumen administrasi perangkat pembelajaran lengkap sesuai standar supervisi akademik pengawas/kepala sekolah.

---

## 📋 15 Poin Instrumen Supervisi yang Didukung:
1. **Analisis Alokasi Waktu & Rincian Pekan Efektif** (Kalkulasi otomatis JP efektif & non-efektif per semester)
2. **Program Tahunan (PROTA)** (Distribusi Capaian Pembelajaran & JP tahunan)
3. **Program Semester (PROMES)** (Matriks mingguan Juli-Desember / Januari-Juni)
4. **Alur Tujuan Pembelajaran (ATP)** (Hierarki TP, Capaian Pembelajaran, Profil Pelajar Pancasila & Glosarium)
5. **Modul Ajar Kurikulum Merdeka** (Identitas, Pemahaman Bermakna, Pertanyaan Pemantik, Sintaks PBL, Asesmen & Refleksi)
6. **Jadwal Tatap Muka / Mengajar** (Jadwal mingguan per jam & kelas)
7. **Jurnal Mengajar Harian / Agenda Guru** (Pencatatan harian KBM, kehadiran, dan catatan refleksi kelas)
8. **Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)** (Pendekatan interval nilai 0-68, 69-79, 80-89, 90-100 & tindak lanjut)
9. **Daftar Hadir / Presensi Siswa** (Rekapitulasi H/S/I/A dan persentase kehadiran)
10. **Buku Daftar Nilai Siswa** (Asesmen Formatif, Sumatif Lingkup Materi, SAS, Nilai Akhir & Deskripsi Raport)
11. **Kisi-kisi & Butir Soal Penilaian** (Indikator soal, Level Kognitif C1-C6, Kartu Butir Soal & Kunci Jawaban)
12. **Analisis Hasil Evaluasi Pembelajaran** (Taraf serap, ketuntasan klasikal & rencana tindak lanjut)
13. **Program & Laporan Pelaksanaan Remedial** (Daftar siswa, bimbingan, nilai awal vs akhir)
14. **Program & Laporan Pelaksanaan Pengayaan** (Daftar siswa berprestasi, aktivitas eksploratif & hasil)
15. **Lembar Kerja Peserta Didik (LKPD)** (Stimulus kasus kontekstual, langkah kerja, pertanyaan & rubrik penskoran)

⭐ **Bonus Instrumen Evaluasi Resmi Supervisi:**
Lembar penilaian checklist 1-4 untuk Kepala Sekolah / Pengawas dengan kalkulasi skor otomatis ($\Sigma$ Skor / 60 $\times$ 100%), penetapan predikat kelayakan (A/B/C/D), catatan supervisor, dan lembar tanda tangan.

---

## 🚀 Cara Menjalankan Aplikasi:

### Cara 1: Menggunakan File Pintasan (Paling Mudah)
Cukup klik ganda (double click) pada file:
👉 `start-aplikasi.bat`
Aplikasi akan otomatis menyalakan server lokal dan membuka browser di `http://localhost:3000`.

### Cara 2: Melalui Terminal / Command Prompt
1. Buka folder ini di PowerShell atau Command Prompt.
2. Jalankan perintah:
   ```bash
   npm.cmd run dev
   ```
3. Buka peramban (browser) di alamat: `http://localhost:3000`

---

## 🛠️ Fitur Utama Aplikasi:
- **Profil Sekolah & Guru Terpadu**: Cukup isi sekali (Nama Sekolah, NPSN, Kepala Sekolah, Guru, NIP, Mapel, dll.), seluruh kop surat dan tanda tangan pada 15 dokumen otomatis terisi.
- **Form Interaktif & Auto-Save**: Guru dapat mengedit tabel atau butir dokumen langsung di layar, lalu menyimpannya ke database lokal.
- **Standar Cetak Baku A4**: Dilengkapi tombol **Cetak Dokumen** yang otomatis menghilangkan navigasi web dan menghasilkan layout dokumen resmi A4 siap cetak atau simpan ke PDF.
- **Fleksibilitas Regulasi**: Jika dinas setempat menambahkan poin ke-16 atau mengubah indikator, guru dapat menambah atau mengubah poin supervisi melalui tombol **Regulasi**.
- **Cadangan & Pemulihan (Backup/Restore)**: Data dapat diunduh ke file `.json` kapan saja sebagai arsip atau dipindahkan ke komputer lain tanpa kehilangan data.
