# 📚 SIPEN-GURU (Sistem Informasi Perangkat & Evaluasi Supervisi Guru)
> **Aplikasi Fullstack Pembantu Guru dalam Menyusun & Mengelola 15 Poin Administrasi Supervisi Akademik (Standar Kurikulum Merdeka) Lengkap dengan Simulasi Penilaian, Format Cetak Baku A4, dan Integrasi Database Cloud PostgreSQL.**

---

## 📌 Deskripsi Proyek
**SIPEN-GURU** adalah platform manajemen administrasi guru yang dirancang untuk meringankan beban kerja tenaga pendidik dalam mempersiapkan dokumen perangkat pembelajaran menjelang kegiatan **Supervisi Akademik** oleh Kepala Sekolah maupun Pengawas Pembina.

Aplikasi ini mengintegrasikan seluruh instrumen administrasi pembelajaran ke dalam satu sistem terpadu:
- **Satu Kali Pengisian Profil**: Nama Sekolah, Kepala Sekolah, Guru, NIP, Mata Pelajaran, dan Titimangsa Tanggal otomatis terisi di seluruh kop surat dan lembar pengesahan.
- **15 Komponen Dokumen Standar**: Seluruh dokumen telah dilengkapi contoh riil Kurikulum Merdeka yang siap diedit kapan saja.
- **Standar Format Cetak Resmi A4**: Dilengkapi tombol cetak cepat yang otomatis menghilangkan menu antarmuka web (`no-print`), mengatur margin kertas standar dinas, dan menampilkan garis kop ganda serta tanda tangan sah.
- **Evaluasi Skor Mandiri (Self-Assessment)**: Guru dapat memeriksa kesiapan dokumen dan melihat estimasi nilai ketercapaian (skor 1–4, persentase kelayakan, dan predikat A/B/C/D) sebelum supervisi resmi.
- **Penyimpanan Ganda (Cloud + Local)**: Mendukung database cloud PostgreSQL (Vercel Postgres/Neon) dan sinkronisasi otomatis ke `localStorage` peramban.

---

## 📋 Deskripsi Rinci 15 Poin Administrasi Supervisi Guru

| No | Komponen Dokumen | Deskripsi & Fungsi Dokumen | Kriteria Mutu Supervisi (Skor 4) |
|:---:|:---|:---|:---|
| **1** | **Analisis Alokasi Waktu & Pekan Efektif** | Pemetaan kalender pendidikan dinas menjadi rincian minggu efektif KBM, minggu non-efektif (MPLS, STS, SAS, libur), serta perhitungan total Jam Pelajaran (JP) efektif selama satu semester. | Perhitungan minggu dan jam efektif akurat, sinkron dengan kalender pendidikan provinsi, dan memuat alokasi cadangan materi. |
| **2** | **Program Tahunan (PROTA)** | Dokumen perencanaan umum alokasi waktu pembelajaran selama satu tahun ajaran untuk mencapai Capaian Pembelajaran (CP) tiap elemen. | Distribusi materi dan beban JP antarfase/semester proporsional dan realistis. |
| **3** | **Program Semester (PROMES)** | Penjabaran rinci Prota ke dalam matriks mingguan per bulan (Juli–Desember untuk Ganjil, Januari–Juni untuk Genap). | Matriks mingguan terisi runtut, sesuai alur waktu di lapangan, dan mencakup jadwal asesmen. |
| **4** | **Alur Tujuan Pembelajaran (ATP)** | Rangkaian Tujuan Pembelajaran (TP) yang disusun secara logis dari konkret ke abstrak, memuat Profil Pelajar Pancasila (P3), indikator ketercapaian, dan glosarium istilah. | Alur TP hierarkis, mengintegrasikan 6 dimensi Profil Pelajar Pancasila, dan memiliki indikator yang terukur. |
| **5** | **Modul Ajar Kurikulum Merdeka** | Panduan komprehensif pembelajaran: Identitas, Pemahaman Bermakna, Pertanyaan Pemantik, Sintaks PBL/PjBL (Pendahuluan, Inti, Penutup), Asesmen, dan Refleksi Guru & Siswa. | Sintaks model pembelajaran kontekstual tampak jelas, memuat diferensiasi konten/proses/produk, dan instrumen asesmen lengkap. |
| **6** | **Jadwal Tatap Muka / Mengajar** | Jadwal resmi pelaksanaan KBM mingguan guru berdasarkan surat keputusan pembagian tugas mengajar dari Kepala Sekolah. | Memuat rincian hari, jam pelajaran, waktu, kelas binaan, dan ruang kelas/lab yang sah. |
| **7** | **Agenda Harian / Jurnal Mengajar** | Catatan rekam jejak tatap muka harian guru: materi yang terlaksana, kehadiran siswa di kelas, catatan kejadian, dan refleksi kendala kelas. | Diisi rutin setiap selesai tatap muka, memuat catatan reflektif jujur, dan diverifikasi paraf. |
| **8** | **Kriteria Ketuntasan (KKTP)** | Tolok ukur ketercapaian tujuan pembelajaran menggunakan pendekatan interval nilai (0–68%, 69–79%, 80–89%, 90–100%) beserta rencana tindak lanjut kualitatif. | Kriteria interval jelas bagi siswa dan orang tua, serta memiliki arahan intervensi yang konkret. |
| **9** | **Daftar Hadir / Presensi Siswa** | Rekapitulasi absensi siswa harian, mingguan, dan bulanan (Hadir, Sakit, Izin, Alpa) lengkap dengan penghitungan persentase kehadiran. | Presensi tertib, persentase kehadiran dihitung otomatis, dan tindak lanjut siswa bermasalah tercatat. |
| **10** | **Buku Daftar Nilai Asesmen** | Rekapitulasi nilai hasil belajar: Asesmen Formatif proses, Sumatif Lingkup Materi, Sumatif Akhir Semester (SAS), dan deskripsi capaian rapor. | Terdokumentasi berkala, memuat variasi teknik penilaian, dan deskripsi capaian menggambarkan perkembangan siswa. |
| **11** | **Kisi-kisi & Butir Soal Penilaian** | Matriks instrumen asesmen lengkap dengan capaian materi, indikator soal, level kognitif (C1–C6), kartu butir soal, kunci jawaban, dan rubrik skor. | Memenuhi kaidah penulisan soal, proporsional antara LOTS dan HOTS (Level C3–C4), serta penskoran objektif. |
| **12** | **Analisis Hasil Evaluasi Belajar** | Pengolahan data nilai untuk mengetahui ketuntasan belajar perorangan dan klasikal, daya serap materi (%), dan identifikasi soal yang sulit dipahami siswa. | Memuat data statistik ketuntasan klasikal yang jelas dan kesimpulan yang menjadi dasar tindakan perbaikan. |
| **13** | **Program & Pelaksanaan Remedial** | Layanan bimbingan khusus bagi peserta didik yang belum mencapai KKTP, mencakup identifikasi TP yang belum tuntas, bentuk intervensi/tutor sebaya, dan nilai akhir remedial. | Bukti pelaksanaan remedial nyata (jadwal, materi ulangan, kartu hasil perbaikan nilai). |
| **14** | **Program & Pelaksanaan Pengayaan** | Kegiatan pembelajaran khusus bagi peserta didik yang telah melampaui kriteria ketuntasan melalui proyek eksploratif, tantangan studi kasus, atau literasi tingkat lanjut. | Memberikan pendalaman materi yang bermakna dan memicu bakat penalaran siswa. |
| **15** | **Lembar Kerja Peserta Didik (LKPD)** | Bahan ajar cetak mandiri/kelompok berisi stimulus permasalahan kontekstual, petunjuk pengerjaan, langkah kerja investigasi, pertanyaan diskusi, dan rubrik penilaian. | Menstimulasi kerja sama kelompok, relevan dengan kehidupan sehari-hari, dan dilengkapi rubrik penilaian kerja. |
| ⭐ | **Instrumen Lembar Supervisi Resmi** | Format evaluasi supervisor (skor 1–4 tiap poin) dengan kalkulasi otomatis ($\frac{\Sigma \text{ Skor}}{60} \times 100\%$), penetapan predikat kelayakan (A/B/C/D), dan rekomendasi tindak lanjut. | Lembar evaluasi komprehensif siap ditandatangani oleh Pengawas/Kepala Sekolah dan Guru yang disupervisi. |

---

## 🛠️ Arsitektur Teknologi (Fullstack)
- **Frontend Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling & Layout**: [Tailwind CSS v3](https://tailwindcss.com/) dengan modul cetak khusus `@media print`
- **Ikon Antarmuka**: [Lucide React](https://lucide.dev/)
- **Database Backend**:
  - **Cloud**: PostgreSQL via modul `pg` (Siap terhubung ke Vercel Postgres, Neon, Supabase, dll.)
  - **Lokal**: In-memory / file `data/database.json` + auto-sync `localStorage`
- **Deploy Target**: Vercel Cloud Platform (Zero-Config)

---

## 🚀 Panduan Menjalankan di Komputer Lokal

1. **Jalankan melalui Shortcut (Windows)**:
   Cukup klik ganda file:
   👉 `start-aplikasi.bat`
2. **Jalankan melalui Terminal**:
   ```bash
   npm.cmd run dev
   ```
   Buka peramban di: `http://localhost:3000`

---

## 🌐 Panduan Deploy ke Vercel & GitHub

1. **Buat Repository GitHub**:
   - Buka `https://github.com/new`
   - Beri nama: `administrasi-supervisi-guru`
   - Klik **Create repository**
2. **Upload Kode**:
   ```bash
   git remote add origin https://github.com/USERNAME/administrasi-supervisi-guru.git
   git push -u origin main
   ```
3. **Deploy di Vercel**:
   - Masuk ke `https://vercel.com`
   - Klik **Add New...** > **Project** > Pilih `administrasi-supervisi-guru` > Klik **Deploy**.
4. **Hubungkan Database Cloud**:
   - Buka tab **Storage** di Vercel > Pilih **Postgres** (Neon) > Klik **Create & Connect**.
   - Klik **Redeploy** pada project Anda.
