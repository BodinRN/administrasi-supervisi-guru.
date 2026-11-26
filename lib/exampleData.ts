import { SchoolProfile, AdministrasiDocuments } from './types';

// Contoh referensi opsional (hanya dimuat jika guru mengklik tombol "Muat Contoh Referensi")
export const exampleProfile: SchoolProfile = {
  schoolName: 'SMP NEGERI 1 TELADAN',
  npsn: '20104567',
  schoolAddress: 'Jl. Pendidikan No. 45, Kompleks Pendidikan',
  district: 'Kec. Sukamaju',
  city: 'Kota Pelajar',
  province: 'Jawa Barat',
  postalCode: '40123',
  schoolEmail: 'smpn1teladan@sekolah.belajar.id',
  schoolWebsite: 'https://smpn1teladan.sch.id',
  headerLine1: 'PEMERINTAH PROVINSI JAWA BARAT',
  headerLine2: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  jenjang: 'SMP/MTs',
  headmasterName: 'Drs. H. Ahmad Fauzi, M.Pd.',
  headmasterNip: '19680512 199303 1 004',
  supervisorName: 'Dr. Hj. Siti Nurhasanah, M.Pd.',
  supervisorNip: '19710815 199702 2 001',
  teacherName: 'Budi Santoso, S.Pd., Gr.',
  teacherNip: '19880421 201503 1 002',
  subject: 'Informatika',
  phase: 'Fase D (SMP)',
  grade: 'Kelas VII',
  academicYear: '2026/2027',
  semester: 'Ganjil',
  documentDate: '15 Juli 2026'
};

export const exampleDocuments: AdministrasiDocuments = {
  alokasiWaktu: {
    jamPelajaranPerMinggu: 2,
    alokasiCadanganJP: 4,
    semesterGanjil: [
      { bulan: 'Juli', jumlahMinggu: 5, mingguEfektif: 3, mingguTidakEfektif: 2, keterangan: 'MPLS dan Libur Awal Tahun' },
      { bulan: 'Agustus', jumlahMinggu: 4, mingguEfektif: 4, mingguTidakEfektif: 0, keterangan: 'Kegiatan Belajar Mengajar' },
      { bulan: 'September', jumlahMinggu: 4, mingguEfektif: 3, mingguTidakEfektif: 1, keterangan: 'Sumatif Tengah Semester (STS)' },
      { bulan: 'Oktober', jumlahMinggu: 5, mingguEfektif: 5, mingguTidakEfektif: 0, keterangan: 'Kegiatan Belajar Mengajar' },
      { bulan: 'November', jumlahMinggu: 4, mingguEfektif: 4, mingguTidakEfektif: 0, keterangan: 'Kegiatan Belajar Mengajar & P5' },
      { bulan: 'Desember', jumlahMinggu: 4, mingguEfektif: 1, mingguTidakEfektif: 3, keterangan: 'SAS, Pengolahan Nilai & Libur' }
    ],
    semesterGenap: [
      { bulan: 'Januari', jumlahMinggu: 5, mingguEfektif: 4, mingguTidakEfektif: 1, keterangan: 'Awal Semester & KBM' },
      { bulan: 'Februari', jumlahMinggu: 4, mingguEfektif: 4, mingguTidakEfektif: 0, keterangan: 'Kegiatan Belajar Mengajar' },
      { bulan: 'Maret', jumlahMinggu: 4, mingguEfektif: 3, mingguTidakEfektif: 1, keterangan: 'STS & Libur Awal Puasa' },
      { bulan: 'April', jumlahMinggu: 4, mingguEfektif: 2, mingguTidakEfektif: 2, keterangan: 'Libur Hari Raya Idul Fitri' },
      { bulan: 'Mei', jumlahMinggu: 5, mingguEfektif: 4, mingguTidakEfektif: 1, keterangan: 'Asesmen Sekolah & KBM' },
      { bulan: 'Juni', jumlahMinggu: 4, mingguEfektif: 1, mingguTidakEfektif: 3, keterangan: 'SAT, Pembagian Rapor & Libur' }
    ],
    kegiatanNonEfektif: [
      { kegiatan: 'Masa Pengenalan Lingkungan Sekolah (MPLS)', jumlahMinggu: 1 },
      { kegiatan: 'Sumatif Tengah Semester (STS)', jumlahMinggu: 1 },
      { kegiatan: 'Sumatif Akhir Semester (SAS)', jumlahMinggu: 1 },
      { kegiatan: 'Pengolahan Nilai & Pembagian Rapor', jumlahMinggu: 1 },
      { kegiatan: 'Libur Akhir Semester', jumlahMinggu: 2 }
    ],
    catatanDistribusi: 'Total Minggu Efektif Semester Ganjil: 20 Minggu. Total JP Efektif: 20 x 2 JP = 40 JP (36 JP Intrakurikuler, 4 JP Cadangan).'
  },
  prota: [
    {
      no: 1,
      elemen: 'Berpikir Komputasional (BK)',
      capaianPembelajaran: 'Peserta didik mampu menerapkan berpikir komputasional untuk menghasilkan solusi terhadap persoalan sehari-hari.',
      tujuanPembelajaran: 'Menerapkan konsep pola, dekomposisi, abstraksi, dan algoritma dalam kehidupan sehari-hari.',
      materiPokok: 'Fondasi Berpikir Komputasional',
      alokasiWaktuJP: 8,
      semester: 'Ganjil'
    },
    {
      no: 2,
      elemen: 'Teknologi Informasi dan Komunikasi (TIK)',
      capaianPembelajaran: 'Peserta didik mampu memanfaatkan antarmuka grafis, surel, peramban, aplikasi pengolah kata dan angka.',
      tujuanPembelajaran: 'Mengoperasikan pengolah kata dan lembar kerja untuk membuat laporan sederhana terpadu.',
      materiPokok: 'Aplikasi Perkantoran & Surel',
      alokasiWaktuJP: 12,
      semester: 'Ganjil'
    }
  ],
  promes: {
    semester: 'Ganjil',
    bulanList: [
      { nama: 'Juli', mingguCount: 5 },
      { nama: 'Agustus', mingguCount: 4 },
      { nama: 'September', mingguCount: 4 },
      { nama: 'Oktober', mingguCount: 5 },
      { nama: 'November', mingguCount: 4 },
      { nama: 'Desember', mingguCount: 4 }
    ],
    items: [
      {
        no: 1,
        tujuanPembelajaran: 'Menerapkan 4 fondasi Berpikir Komputasional (BK)',
        materiPokok: 'Fondasi Berpikir Komputasional',
        alokasiJP: 8,
        distribusiMinggu: { Juli_3: 2, Juli_4: 2, Agustus_1: 2, Agustus_2: 2 }
      }
    ]
  },
  atp: [
    {
      no: 1,
      elemen: 'Berpikir Komputasional',
      capaianPembelajaran: 'Peserta didik mampu menerapkan berpikir komputasional untuk menghasilkan solusi dari persoalan dengan data diskrit bervolume kecil.',
      tujuanPembelajaran: '7.1.1 Menganalisis masalah sehari-hari dan memecahnya menjadi bagian kecil (Dekomposisi).',
      indikatorKetercapaian: [
        'Mengidentifikasi masalah inti dari studi kasus nyata.',
        'Mengelompokkan sub-masalah secara mandiri.'
      ],
      profilPelajarPancasila: ['Bernalar Kritis', 'Mandiri'],
      alokasiWaktuJP: 4,
      kataKunciMateri: 'Dekomposisi, Struktur Masalah, Solusi',
      glosarium: 'Dekomposisi: proses memecah masalah besar menjadi bagian kecil yang dapat dikelola.'
    }
  ],
  modulAjar: {
    id: 'MA-01',
    judulModul: 'Fondasi Berpikir Komputasional dalam Kehidupan Nyata',
    fase: 'Fase D',
    elemen: 'Berpikir Komputasional (BK)',
    alokasiWaktu: '2 Pertemuan (4 JP x 40 Menit)',
    kompetensiAwal: 'Peserta didik telah mengenal penggunaan perangkat gawai sederhana dan pemecahan masalah sehari-hari.',
    profilPelajarPancasila: ['Bernalar Kritis', 'Gotong Royong', 'Kreatif'],
    saranaPrasarana: 'Laptop, Proyektor, Kartu Teka-Teki, LKPD, Papan Tulis.',
    targetPesertaDidik: 'Peserta didik reguler/tipikal',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    metodePembelajaran: 'Diskusi kelompok, simulasi, dan presentasi',
    tujuanPembelajaran: [
      'Menjelaskan 4 fondasi berpikir komputasional (Dekomposisi, Pengenalan Pola, Abstraksi, Algoritma).',
      'Menerapkan berpikir komputasional pada studi kasus kehidupan sehari-hari.'
    ],
    pemahamanBermakna: 'Berpikir komputasional adalah cara berpikir terstruktur untuk menyelesaikan berbagai tantangan hidup.',
    pertanyaanPemantik: [
      'Bagaimana cara menentukan rute tercepat dari rumah ke sekolah saat macet?'
    ],
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        alokasiMenit: 80,
        pendahuluan: ['Salam, doa, presensi, apersepsi, dan penyampaian tujuan pembelajaran.'],
        inti: ['Orientasi masalah, pengorganisasian kelompok, penyelidikan LKPD, pengembangan solusi, dan presentasi.'],
        penutup: ['Simpulan bersama, umpan balik, refleksi, dan doa penutup.']
      }
    ],
    asesmenAwal: 'Kuis diagnostik singkat 3 soal penalaran logis.',
    asesmenFormatif: 'Observasi diskusi kelompok dan presentasi LKPD.',
    asesmenSumatif: 'Tes tertulis pilihan ganda dan uraian.',
    remedialDanPengayaan: 'Remedial: bimbingan terbimbing. Pengayaan: soal tantangan tingkat lanjut.',
    refleksiGuru: ['Apakah seluruh peserta didik aktif berpartisipasi dalam diskusi kelompok?'],
    refleksiSiswa: ['Bagian apa dari materi ini yang paling menantang dan menarik?']
  },
  jadwalPelajaran: [
    { hari: 'Senin', jamKe: '1 - 2', waktu: '07.30 - 08.50', kelas: 'VII-A', mataPelajaran: 'Informatika', ruang: 'Lab Komputer 1' }
  ],
  agendaHarian: [
    {
      id: 'JH-001',
      hariTanggal: 'Senin, 20 Juli 2026',
      jamKe: '1 - 2 (07.30 - 08.50)',
      kelas: 'VII-A',
      tujuanPembelajaran: '7.1.1 Memahami konsep dekomposisi dalam Berpikir Komputasional',
      materiDanKegiatan: 'Materi 4 Fondasi BK dan diskusi studi kasus LKPD 1.',
      kehadiranSiswa: 'Hadir: 31, Sakit: 1, Izin: 0, Alpa: 0',
      catatanRefleksi: 'Pembelajaran berjalan lancar, perlu penguatan pada konsep abstraksi.',
      tandaTanganStatus: true
    }
  ],
  kktp: [
    {
      no: 1,
      tujuanPembelajaran: 'Menganalisis masalah sehari-hari dengan dekomposisi',
      pendekatan: 'Interval Nilai',
      kriteriaInterval: {
        perluBimbingan: '0 - 68: Belum mampu mengidentifikasi komponen masalah inti, perlu bimbingan penuh.',
        cukup: '69 - 79: Mampu mengidentifikasi sebagian sub-masalah namun belum terstruktur.',
        baik: '80 - 89: Mampu menguraikan seluruh sub-masalah secara mandiri dan logis.',
        sangatBaik: '90 - 100: Mampu menguraikan masalah kompleks dan memberikan solusi prioritas.'
      },
      tindakLanjut: 'Nilai < 69 mengikuti bimbingan remedial dengan tutor sebaya.'
    }
  ],
  daftarHadir: [
    { no: 1, nisn: '0102938401', nama: 'Contoh Siswa 1', jenisKelamin: 'L', hadir: 16, sakit: 0, izin: 0, alpa: 0, persentase: 100 },
    { no: 2, nisn: '0102938402', nama: 'Contoh Siswa 2', jenisKelamin: 'P', hadir: 15, sakit: 1, izin: 0, alpa: 0, persentase: 94 }
  ],
  daftarNilai: [
    {
      no: 1,
      nisn: '0102938401',
      nama: 'Contoh Siswa 1',
      formatif: [85, 88, 90],
      sumatifLingkupMateri: [88, 92, 85],
      sumatifAkhirSemester: 90,
      nilaiAkhir: 89,
      capaianKompetensi: 'Menunjukkan penguasaan sangat baik pada berpikir komputasional.'
    },
    {
      no: 2,
      nisn: '0102938402',
      nama: 'Contoh Siswa 2',
      formatif: [64, 66, 68],
      sumatifLingkupMateri: [62, 65, 68],
      sumatifAkhirSemester: 65,
      nilaiAkhir: 65,
      capaianKompetensi: 'Memerlukan bimbingan dalam menyusun langkah dekomposisi masalah.'
    }
  ],
  kisiKisiSoal: [
    {
      no: 1,
      tujuanPembelajaran: 'Menerapkan 4 fondasi Berpikir Komputasional',
      materi: 'Dekomposisi Masalah',
      indikatorSoal: 'Disajikan kasus sehari-hari, peserta didik dapat menentukan pilar dekomposisi yang tepat.',
      levelKognitif: 'C3',
      bentukSoal: 'Pilihan Ganda',
      nomorSoal: 1,
      butirSoal: 'Saat sepeda motor mogok, montir memeriksa busi, bahan bakar, dan kelistrikan satu per satu. Tindakan ini mencerminkan...',
      kunciJawaban: 'A. Dekomposisi',
      skor: 20
    }
  ],
  analisisEvaluasi: {
    tujuanPembelajaran: 'Sumatif Lingkup Materi 1: Berpikir Komputasional',
    jumlahPeserta: 32,
    jumlahTuntas: 29,
    jumlahBelumTuntas: 3,
    dayaSerapPersen: 90.63,
    kesimpulan: 'Ketuntasan klasikal mencapai 90,63% (di atas kriteria 85%).',
    tindakLanjutKlasikal: '3 siswa belum tuntas mengikuti program remedial terfokus.',
    analisisButirSoal: [
      { noSoal: 1, materi: 'Dekomposisi Masalah', jumlahBenar: 30, dayaSerapPersen: 93.75, tingkatKesukaran: 'Mudah', keterangan: 'Dikuasai sebagian besar siswa' },
      { noSoal: 2, materi: 'Abstraksi & Pola', jumlahBenar: 18, dayaSerapPersen: 56.25, tingkatKesukaran: 'Sukar', keterangan: 'Perlu pengulangan pada pertemuan berikutnya' }
    ]
  },
  programRemedial: [
    {
      no: 1,
      namaSiswa: 'Contoh Siswa 2',
      nisn: '0102938402',
      tpBelumTuntas: '7.1.1 Dekomposisi Masalah',
      nilaiAwal: 65,
      bentukBimbingan: 'Bimbingan perorangan dan latihan studi kasus sederhana.',
      nilaiAkhirRemedial: 76,
      status: 'Tuntas',
      keterangan: 'Tuntas setelah bimbingan 1 sesi.'
    }
  ],
  programPengayaan: [
    {
      no: 1,
      namaSiswa: 'Contoh Siswa 1',
      nisn: '0102938401',
      tpPengayaan: 'Eksplorasi Pemecahan Masalah Lanjut',
      nilaiAwal: 89,
      bentukAktivitas: 'Pemberian tantangan soal pemecahan masalah tingkat lanjut.',
      hasilPengayaan: 'Menyelesaikan tantangan tepat waktu dengan solusi efisien.',
      keterangan: 'Direkomendasikan sebagai tutor sebaya.'
    }
  ],
  lkpd: {
    judul: 'LKPD 1: Eksplorasi 4 Fondasi Berpikir Komputasional',
    mataPelajaran: 'Informatika',
    faseKelas: 'Fase D / Kelas VII',
    alokasiWaktu: '2 x 40 Menit',
    tujuanAktivitas: [
      'Menguraikan masalah nyata menjadi bagian kecil (Dekomposisi).',
      'Menyusun langkah terurut penyelesaian masalah (Algoritma).'
    ],
    petunjukBelajar: [
      'Bentuk kelompok beranggotakan 4-5 orang.',
      'Diskusikan studi kasus dan tuliskan jawaban di kolom yang tersedia.'
    ],
    stimulusMateri: 'STUDI KASUS: Kelas kalian ditugaskan mengelola bazar makanan sehat sekolah dengan modal terbatas dan waktu 3 jam.',
    langkahKegiatan: [
      'Uraikan pembagian tugas kelompok (Dekomposisi).',
      'Susun alur pelayanan pembeli dari pesan hingga selesai (Algoritma).'
    ],
    pertanyaanTugas: [
      { no: 1, pertanyaan: 'Tuliskan pembagian sub-tugas yang kalian buat!', bobot: 50 },
      { no: 2, pertanyaan: 'Susun diagram alir pelayanan bazar!', bobot: 50 }
    ],
    rubrikPenilaian: [
      {
        kriteria: 'Dekomposisi Masalah',
        skor4: 'Menguraikan tugas sangat rinci dan proporsional.',
        skor3: 'Menguraikan tugas cukup lengkap.',
        skor2: 'Hanya menyebut 1-2 tugas umum.',
        skor1: 'Belum mampu membagi masalah.'
      }
    ]
  }
};
