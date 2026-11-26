import { SchoolProfile, AdministrasiDocuments, SupervisiRecord, SupervisiPoint } from './types';

export const initialProfile: SchoolProfile = {
  schoolName: '',
  npsn: '',
  schoolAddress: '',
  district: '',
  city: '',
  province: '',
  postalCode: '',
  schoolEmail: '',
  schoolWebsite: '',
  headerLine1: '',
  headerLine2: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  jenjang: '',
  logoLeft: '',
  logoRight: '',
  headmasterName: '',
  headmasterNip: '',
  supervisorName: '',
  supervisorNip: '',
  teacherName: '',
  teacherNip: '',
  subject: '',
  phase: '',
  grade: '',
  academicYear: '',
  semester: 'Ganjil',
  documentDate: ''
};

export const initialDocuments: AdministrasiDocuments = {
  // 1. Analisis Alokasi Waktu (Template kosong per bulan siap diisi guru)
  alokasiWaktu: {
    jamPelajaranPerMinggu: 0,
    alokasiCadanganJP: 0,
    semesterGanjil: [
      { bulan: 'Juli', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'Agustus', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'September', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'Oktober', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'November', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'Desember', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' }
    ],
    semesterGenap: [
      { bulan: 'Januari', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'Februari', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'Maret', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'April', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'Mei', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' },
      { bulan: 'Juni', jumlahMinggu: 0, mingguEfektif: 0, mingguTidakEfektif: 0, keterangan: '' }
    ],
    kegiatanNonEfektif: [],
    catatanDistribusi: ''
  },

  // 2. Program Tahunan (Prota)
  prota: [],

  // 3. Program Semester (Promes)
  promes: {
    semester: 'Ganjil',
    bulanList: [
      { nama: 'Juli', mingguCount: 4 },
      { nama: 'Agustus', mingguCount: 4 },
      { nama: 'September', mingguCount: 4 },
      { nama: 'Oktober', mingguCount: 4 },
      { nama: 'November', mingguCount: 4 },
      { nama: 'Desember', mingguCount: 4 }
    ],
    items: []
  },

  // 4. Alur Tujuan Pembelajaran (ATP)
  atp: [],

  // 5. Modul Ajar
  modulAjar: {
    id: 'MA-01',
    judulModul: '',
    fase: '',
    elemen: '',
    alokasiWaktu: '',
    kompetensiAwal: '',
    profilPelajarPancasila: [],
    saranaPrasarana: '',
    targetPesertaDidik: '',
    modelPembelajaran: '',
    metodePembelajaran: '',
    tujuanPembelajaran: [],
    pemahamanBermakna: '',
    pertanyaanPemantik: [],
    kegiatanPembelajaran: [],
    asesmenAwal: '',
    asesmenFormatif: '',
    asesmenSumatif: '',
    remedialDanPengayaan: '',
    refleksiGuru: [],
    refleksiSiswa: []
  },

  // 6. Jadwal Pelajaran
  jadwalPelajaran: [],

  // 7. Jurnal Mengajar Harian / Agenda Guru
  agendaHarian: [],

  // 8. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
  kktp: [],

  // 9. Daftar Hadir Siswa
  daftarHadir: [],

  // 10. Buku Daftar Nilai
  daftarNilai: [],

  // 11. Kisi-kisi & Butir Soal Penilaian
  kisiKisiSoal: [],

  // 12. Analisis Hasil Evaluasi
  analisisEvaluasi: {
    tujuanPembelajaran: '',
    jumlahPeserta: 0,
    jumlahTuntas: 0,
    jumlahBelumTuntas: 0,
    dayaSerapPersen: 0,
    kesimpulan: '',
    tindakLanjutKlasikal: '',
    analisisButirSoal: []
  },

  // 13. Program & Kartu Pelaksanaan Remedial
  programRemedial: [],

  // 14. Program & Kartu Pelaksanaan Pengayaan
  programPengayaan: [],

  // 15. Lembar Kerja Peserta Didik (LKPD)
  lkpd: {
    judul: '',
    mataPelajaran: '',
    faseKelas: '',
    alokasiWaktu: '',
    tujuanAktivitas: [],
    petunjukBelajar: [],
    stimulusMateri: '',
    langkahKegiatan: [],
    pertanyaanTugas: [],
    rubrikPenilaian: []
  }
};

export const initialSupervisiPoints: SupervisiPoint[] = [
  {
    id: 1,
    namaKomponen: 'Kalender Pendidikan & Analisis Alokasi Waktu (Minggu Efektif)',
    deskripsi: 'Memuat pemetaan minggu kalender akademik dinas, rincian minggu efektif, jam pelajaran, dan minggu non-efektif.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 2,
    namaKomponen: 'Program Tahunan (Prota)',
    deskripsi: 'Memuat distribusi Capaian Pembelajaran (CP) dan alokasi JP selama satu tahun ajaran.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 3,
    namaKomponen: 'Program Semester (Promes)',
    deskripsi: 'Penjabaran detail alokasi waktu tiap minggu per bulan selama satu semester berjalan.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 4,
    namaKomponen: 'Alur Tujuan Pembelajaran (ATP)',
    deskripsi: 'Urutan Tujuan Pembelajaran logis, memuat Profil Pelajar Pancasila, indikator ketercapaian, dan glosarium.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 5,
    namaKomponen: 'Modul Ajar / RPP Kurikulum Merdeka',
    deskripsi: 'Memuat identitas, kompetensi awal, profil pelajar pancasila, tujuan, pemantik, langkah pembelajaran, diferensiasi, dan asesmen.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 6,
    namaKomponen: 'Jadwal Pelajaran / Tatap Muka Mingguan',
    deskripsi: 'Jadwal resmi mengajar di kelas sesuai beban kerja guru.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 7,
    namaKomponen: 'Agenda Harian / Jurnal Mengajar Guru',
    deskripsi: 'Catatan harian tatap muka, kehadiran siswa, ketercapaian materi, dan refleksi kendala di kelas.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 8,
    namaKomponen: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)',
    deskripsi: 'Penetapan kriteria ketercapaian berupa interval nilai, deskripsi kriteria, atau rubrik.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 9,
    namaKomponen: 'Daftar Hadir / Presensi Siswa',
    deskripsi: 'Rekapitulasi kehadiran siswa (Hadir, Sakit, Izin, Alpa) dan persentase kehadiran.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 10,
    namaKomponen: 'Buku Daftar Nilai (Formatif & Sumatif)',
    deskripsi: 'Memuat nilai asesmen awal, formatif proses, sumatif materi, sumatif akhir, dan deskripsi capaian.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 11,
    namaKomponen: 'Kisi-kisi & Butir Soal Penilaian / Asesmen',
    deskripsi: 'Memuat indikator soal, level kognitif (C1-C6), bentuk soal, kartu butir soal, dan kunci jawaban.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 12,
    namaKomponen: 'Analisis Hasil Evaluasi / Asesmen Pembelajaran',
    deskripsi: 'Analisis daya serap, ketuntasan belajar klasikal, dan identifikasi butir soal sulit.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 13,
    namaKomponen: 'Program & Pelaksanaan Remedial',
    deskripsi: 'Memuat daftar siswa belum tuntas, materi yang diulang, bentuk bimbingan, dan nilai hasil remedial.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 14,
    namaKomponen: 'Program & Pelaksanaan Pengayaan',
    deskripsi: 'Program untuk siswa yang telah tuntas melampaui kriteria, berupa proyek eksploratif/soal tantangan.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  },
  {
    id: 15,
    namaKomponen: 'Lembar Kerja Peserta Didik (LKPD)',
    deskripsi: 'Memuat petunjuk belajar, tujuan, stimulus masalah kontekstual, langkah kerja, dan rubrik penilaian.',
    kondisi: 'Tidak Ada',
    skor: 0,
    catatanSupervisor: '',
    rekomendasi: ''
  }
];

export const initialSupervisiRecord: SupervisiRecord = {
  id: 'SUP-01',
  tanggalSupervisi: '',
  supervisorName: '',
  supervisorNip: '',
  teacherName: '',
  subject: '',
  grade: '',
  points: initialSupervisiPoints,
  totalSkor: 0,
  nilaiPersentase: 0,
  predikat: 'Belum Dinilai',
  catatanUmum: '',
  saranTindakLanjut: '',
  status: 'Draf'
};
