import { DocKey } from './docStatus';

export const PROFIL_PELAJAR_PANCASILA = [
  'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
  'Berkebinekaan Global',
  'Bergotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif'
];

export const FASE_KURIKULUM_MERDEKA = [
  { value: 'Fase Fondasi (PAUD)', label: 'Fase Fondasi — PAUD / TK / RA' },
  { value: 'Fase A (SD/MI Kelas I–II)', label: 'Fase A — SD/MI Kelas I–II' },
  { value: 'Fase B (SD/MI Kelas III–IV)', label: 'Fase B — SD/MI Kelas III–IV' },
  { value: 'Fase C (SD/MI Kelas V–VI)', label: 'Fase C — SD/MI Kelas V–VI' },
  { value: 'Fase D (SMP/MTs Kelas VII–IX)', label: 'Fase D — SMP/MTs Kelas VII–IX' },
  { value: 'Fase E (SMA/MA/SMK Kelas X)', label: 'Fase E — SMA/MA/SMK Kelas X' },
  { value: 'Fase F (SMA/MA/SMK Kelas XI–XII)', label: 'Fase F — SMA/MA/SMK Kelas XI–XII' }
];

export const TAKSONOMI_BLOOM = [
  { level: 'C1', nama: 'Mengingat (LOTS)', kko: 'Menyebutkan, mendefinisikan, mengidentifikasi, mendaftar, mencocokkan' },
  { level: 'C2', nama: 'Memahami (LOTS)', kko: 'Menjelaskan, merangkum, mengklasifikasikan, membandingkan, mencontohkan' },
  { level: 'C3', nama: 'Menerapkan (MOTS)', kko: 'Menggunakan, menghitung, mendemonstrasikan, menerapkan, mengilustrasikan' },
  { level: 'C4', nama: 'Menganalisis (HOTS)', kko: 'Menganalisis, membedakan, menguraikan, menelaah, mengaitkan' },
  { level: 'C5', nama: 'Mengevaluasi (HOTS)', kko: 'Menilai, mengkritik, membenarkan, menyimpulkan, memutuskan' },
  { level: 'C6', nama: 'Mencipta (HOTS)', kko: 'Merancang, menyusun, menciptakan, mengembangkan, memproduksi' }
];

export const MODEL_PEMBELAJARAN_LIST = [
  {
    nama: 'Problem Based Learning (PBL)',
    sintaks: '1) Orientasi masalah, 2) Mengorganisasikan peserta didik, 3) Penyelidikan individu/kelompok, 4) Pengembangan & penyajian karya, 5) Analisis & evaluasi.'
  },
  {
    nama: 'Project Based Learning (PjBL)',
    sintaks: '1) Pertanyaan mendasar, 2) Mendesain perencanaan proyek, 3) Menyusun jadwal, 4) Memonitor kemajuan proyek, 5) Menguji hasil, 6) Evaluasi pengalaman.'
  },
  {
    nama: 'Discovery Learning',
    sintaks: '1) Pemberian rangsangan, 2) Pernyataan/identifikasi masalah, 3) Pengumpulan data, 4) Pengolahan data, 5) Pembuktian, 6) Menarik simpulan.'
  },
  {
    nama: 'Inquiry Learning',
    sintaks: '1) Orientasi, 2) Merumuskan masalah, 3) Merumuskan hipotesis, 4) Mengumpulkan data, 5) Menguji hipotesis, 6) Merumuskan kesimpulan.'
  },
  {
    nama: 'Pembelajaran Berdiferensiasi',
    sintaks: 'Menyesuaikan konten, proses, dan produk belajar berdasarkan asesmen awal kesiapan, minat, dan profil belajar peserta didik.'
  }
];

export interface DocReferenceGuide {
  regulasi: string;
  tujuan: string;
  syaratSkor4: string[];
  hubunganDokumen: string;
  tips: string[];
}

export const DOC_REFERENCES: Record<DocKey, DocReferenceGuide> = {
  alokasiWaktu: {
    regulasi: 'Permendikbudristek No. 12 Tahun 2024 & Kalender Pendidikan Dinas/Kemenag Setempat',
    tujuan: 'Memetakan jumlah minggu dalam kalender pendidikan menjadi minggu efektif tatap muka, minggu non-efektif, dan total JP efektif per semester.',
    syaratSkor4: [
      'Memuat Semester Ganjil (Jul–Des) dan Semester Genap (Jan–Jun) sesuai kalender pendidikan provinsi/kabupaten.',
      'Rincian kegiatan non-efektif (MPLS, STS, SAS/SAT, pembagian rapor, libur) terdata jelas.',
      'Total JP Efektif = Minggu Efektif × JP per Minggu, disertai alokasi cadangan/remedial.'
    ],
    hubunganDokumen: 'Menjadi acuan batas total JP pada Program Tahunan (Poin 2) dan Program Semester (Poin 3).',
    tips: [
      'Cek Kalender Pendidikan resmi Dinas Pendidikan / Kemenag daerah Anda sebelum mengisi jumlah minggu per bulan.',
      'Sisakan minimal 2–4 JP cadangan untuk asesmen sumatif, remedial, atau kegiatan mendadak sekolah.'
    ]
  },
  prota: {
    regulasi: 'Permendikbudristek No. 16 Tahun 2022 (Standar Proses) & Keputusan Kepala BSKAP tentang Capaian Pembelajaran',
    tujuan: 'Merencanakan distribusi seluruh Elemen, Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), dan beban JP selama 1 tahun ajaran.',
    syaratSkor4: [
      'Mencantumkan Elemen CP, rumusan CP/TP, materi pokok, dan alokasi JP secara proporsional.',
      'Jumlah JP Semester Ganjil dan Genap sinkron dengan hasil Analisis Alokasi Waktu (Poin 1).'
    ],
    hubunganDokumen: 'Mengacu pada total JP Poin 1 (Alokasi Waktu) dan dapat ditarik langsung ke Poin 3 (Promes) & Poin 4 (ATP).',
    tips: [
      'Pastikan CP diambil dari dokumen resmi BSKAP terbaru sesuai Fase mata pelajaran Anda.',
      'Gunakan tombol "Tarik dari ATP" jika Anda sudah menyusun ATP terlebih dahulu.'
    ]
  },
  promes: {
    regulasi: 'Permendikbudristek No. 16 Tahun 2022 (Standar Proses) & Panduan Pembelajaran dan Asesmen',
    tujuan: 'Menjabarkan rencana dari PROTA ke dalam matriks distribusi JP per minggu di setiap bulan pada semester berjalan.',
    syaratSkor4: [
      'Matriks mingguan sesuai dengan jumlah minggu efektif pada Poin 1.',
      'Total distribusi JP pada tiap baris TP sama dengan alokasi JP yang direncanakan.'
    ],
    hubunganDokumen: 'Menjabarkan TP dari PROTA (Poin 2) ke jadwal mingguan berdasarkan minggu efektif Poin 1.',
    tips: [
      'Klik "Tarik TP dari PROTA" agar daftar TP & materi otomatis masuk sesuai semester.',
      'Perhatikan indikator kecocokan JP (terjadwal vs target JP) di bagian kanan tabel.'
    ]
  },
  atp: {
    regulasi: 'Panduan Pembelajaran dan Asesmen BSKAP Kemendikbudristek',
    tujuan: 'Menyusun rangkaian Tujuan Pembelajaran (TP) secara sistematis dan logis dari awal hingga akhir fase beserta indikator & dimensi Profil Pelajar Pancasila.',
    syaratSkor4: [
      'TP disusun hierarkis (konkret ke abstrak / sederhana ke kompleks) menggunakan KKO yang terukur.',
      'Memuat indikator ketercapaian (IKTP), Profil Pelajar Pancasila, alokasi JP, dan glosarium istilah.'
    ],
    hubunganDokumen: 'Menjadi sumber utama perumusan Modul Ajar (Poin 5), KKTP (Poin 8), Agenda Harian (Poin 7), dan Kisi-kisi Soal (Poin 11).',
    tips: [
      'Gunakan Kata Kerja Operasional (KKO) Taksonomi Bloom (C2–C6) agar TP mudah diukur pada KKTP dan soal.',
      'Centang dimensi Profil Pelajar Pancasila yang benar-benar dikembangkan dalam TP tersebut.'
    ]
  },
  modulAjar: {
    regulasi: 'Permendikbudristek No. 16 Tahun 2022 & Panduan Pembelajaran dan Asesmen (Komponen Minimum Modul Ajar)',
    tujuan: 'Menjadi skenario operasional pembelajaran di kelas yang memuat informasi umum, komponen inti, asesmen, diferensiasi, dan refleksi.',
    syaratSkor4: [
      'Memuat TP, pemahaman bermakna, pertanyaan pemantik, dan langkah kegiatan sesuai sintaks model pembelajaran (PBL/PjBL/Discovery).',
      'Mencantumkan asesmen awal (diagnostik), formatif, sumatif, serta tindak lanjut remedial/pengayaan dan refleksi.'
    ],
    hubunganDokumen: 'Mengambil TP & Profil Pelajar Pancasila dari ATP (Poin 4) dan dipasangkan dengan LKPD (Poin 15).',
    tips: [
      'Cantumkan strategi diferensiasi (konten, proses, atau produk) di kegiatan inti/remedial agar memenuhi standar mutu supervisor.',
      'Gunakan tombol "Tarik TP & P3 dari ATP" untuk menghemat waktu penulisan.'
    ]
  },
  jadwalPelajaran: {
    regulasi: 'SK Pembagian Tugas Mengajar Kepala Sekolah & Permendikbudristek No. 12 Tahun 2024 (Struktur Kurikulum)',
    tujuan: 'Mendokumentasikan jam tatap muka mingguan guru per hari, kelas, jam ke-, waktu, dan ruang belajar.',
    syaratSkor4: [
      'Memuat hari, jam ke-, rentang waktu riil, kelas binaan, mata pelajaran, dan ruang/lab.',
      'Sesuai dengan SK pembagian tugas mengajar dari Kepala Sekolah.'
    ],
    hubunganDokumen: 'Menjadi referensi kelas dan jam mengajar saat mengisi Agenda Harian (Poin 7).',
    tips: [
      'Isi seluruh rombel/kelas yang Anda ampu agar total beban JP mingguan terlihat otomatis.'
    ]
  },
  agendaHarian: {
    regulasi: 'Permendikbudristek No. 16 Tahun 2022 (Pelaksanaan Pembelajaran & Refleksi)',
    tujuan: 'Mencatat pelaksanaan tatap muka harian di kelas, keterlaksanaan TP, kehadiran siswa, serta catatan refleksi guru.',
    syaratSkor4: [
      'Diisi rutin per pertemuan dengan tanggal, kelas, jam, TP, aktivitas, presensi ringkas, dan refleksi nyata.',
      'Memuat kendala kelas dan tindak lanjut perbaikan pertemuan berikutnya.'
    ],
    hubunganDokumen: 'Mengacu pada kelas/jam dari Jadwal Mengajar (Poin 6) dan TP dari ATP/PROTA.',
    tips: [
      'Gunakan pilihan cepat TP & Jadwal saat menambah baris jurnal agar penulisan konsisten.'
    ]
  },
  kktp: {
    regulasi: 'Permendikbudristek No. 21 Tahun 2022 (Standar Penilaian) & Panduan Pembelajaran dan Asesmen',
    tujuan: 'Menetapkan tolok ukur ketercapaian Tujuan Pembelajaran menggunakan pendekatan Deskripsi Kriteria, Rubrik, atau Interval Nilai.',
    syaratSkor4: [
      'Memuat pendekatan penilaian yang jelas (misal Interval Nilai: 0–68, 69–79, 80–89, 90–100) beserta deskripsi tiap rentang.',
      'Memuat rencana tindak lanjut konkret (remedial vs pengayaan) untuk tiap kategori.'
    ],
    hubunganDokumen: 'Menjadi dasar penentuan ketuntasan siswa pada Daftar Nilai (Poin 10), Analisis Evaluasi (Poin 12), Remedial (Poin 13), dan Pengayaan (Poin 14).',
    tips: [
      'Dalam Kurikulum Merdeka, tidak ada KKM tunggal yang kaku; gunakan interval nilai atau rubrik per TP.',
      'Tarik daftar TP langsung dari ATP/PROTA.'
    ]
  },
  daftarHadir: {
    regulasi: 'Administrasi Kesiswaan & Tata Tertib Satuan Pendidikan',
    tujuan: 'Merekap kehadiran peserta didik (Hadir, Sakit, Izin, Alpa) serta persentase kehadiran untuk pemantauan kedisiplinan.',
    syaratSkor4: [
      'Mencantumkan NISN, nama lengkap, jenis kelamin, rincian H/S/I/A, dan persentase kehadiran akurat.',
      'Menjadi dasar pembinaan siswa yang sering absen tanpa keterangan.'
    ],
    hubunganDokumen: 'Daftar nama & NISN siswa dapat ditarik otomatis ke Buku Daftar Nilai (Poin 10).',
    tips: [
      'Persentase kehadiran dihitung otomatis dari `Hadir / (Hadir + Sakit + Izin + Alpa) × 100%` saat Anda mengubah angka.'
    ]
  },
  daftarNilai: {
    regulasi: 'Permendikbudristek No. 21 Tahun 2022 (Asesmen Formatif & Sumatif)',
    tujuan: 'Merekap hasil asesmen formatif, sumatif lingkup materi, sumatif akhir semester (SAS), nilai akhir rapor, dan deskripsi capaian kompetensi.',
    syaratSkor4: [
      'Memisahkan asesmen formatif (perbaikan proses) dan sumatif (penentuan nilai akhir/rapor).',
      'Memuat deskripsi capaian kompetensi yang menggambarkan kekuatan & aspek yang perlu ditingkatkan.'
    ],
    hubunganDokumen: 'Dapat menarik daftar siswa dari Presensi (Poin 9), dan hasilnya digunakan otomatis oleh Analisis Evaluasi (Poin 12), Remedial (Poin 13), dan Pengayaan (Poin 14).',
    tips: [
      'Nilai Akhir dihitung otomatis dari rata-rata Sumatif Lingkup Materi & SAS (sesuai prinsip Kurikulum Merdeka bahwa nilai rapor berasal dari asesmen sumatif), atau dapat Anda sesuaikan manual.'
    ]
  },
  kisiKisiSoal: {
    regulasi: 'Permendikbudristek No. 21 Tahun 2022 & Kaidah Penulisan Soal Asesmen',
    tujuan: 'Menyusun matriks kisi-kisi (TP, materi, indikator soal, level kognitif C1–C6, bentuk soal) beserta kartu butir soal, kunci jawaban, dan pedoman penskoran.',
    syaratSkor4: [
      'Indikator soal selaras dengan TP dan level kognitif (proporsi soal HOTS C4–C6 memadai).',
      'Dilengkapi naskah butir soal, kunci jawaban, dan bobot skor objektif.'
    ],
    hubunganDokumen: 'Mengacu pada TP di ATP/PROTA, dan butir soalnya dapat dianalisis di Poin 12 (Analisis Evaluasi).',
    tips: [
      'Periksa distribusi level kognitif (LOTS vs HOTS) dan total bobot skor yang otomatis ditampilkan di atas matriks.'
    ]
  },
  analisisEvaluasi: {
    regulasi: 'Permendikbudristek No. 21 Tahun 2022 (Pengolahan & Tindak Lanjut Hasil Asesmen)',
    tujuan: 'Mengolah data hasil asesmen untuk mengetahui ketuntasan belajar klasikal, daya serap materi, analisis tingkat kesukaran butir soal, dan tindak lanjut.',
    syaratSkor4: [
      'Menampilkan jumlah peserta, jumlah tuntas, belum tuntas, dan daya serap (%) secara akurat.',
      'Memuat analisis butir soal (identifikasi soal mudah/sedang/sukar) serta kesimpulan dan tindak lanjut klasikal.'
    ],
    hubunganDokumen: 'Dapat dihitung otomatis dari Buku Daftar Nilai (Poin 10) dan merujuk pada Kisi-kisi Soal (Poin 11).',
    tips: [
      'Gunakan tombol "Hitung dari Daftar Nilai" dengan menentukan batas nilai tuntas KKTP (misal 70 atau 75).',
      'Tambahkan baris Analisis Butir Soal agar supervisi poin 12 memperoleh skor maksimal 4.'
    ]
  },
  programRemedial: {
    regulasi: 'Panduan Pembelajaran dan Asesmen BSKAP (Tindak Lanjut Asesmen bagi Peserta Didik Belum Tuntas)',
    tujuan: 'Mendokumentasikan layanan bimbingan ulang bagi peserta didik yang belum mencapai KKTP beserta bentuk intervensi dan nilai perbaikan.',
    syaratSkor4: [
      'Mencantumkan identitas siswa, TP spesifik yang belum tuntas, nilai awal, bentuk bimbingan (bimbingan individu/tutor sebaya/tugas ulang), dan nilai akhir.'
    ],
    hubunganDokumen: 'Menarik daftar siswa yang nilainya di bawah batas KKTP dari Daftar Nilai (Poin 10).',
    tips: [
      'Klik "Tarik Siswa Belum Tuntas dari Daftar Nilai" untuk memfilter siswa yang perlu remedial secara otomatis.'
    ]
  },
  programPengayaan: {
    regulasi: 'Panduan Pembelajaran dan Asesmen BSKAP (Tindak Lanjut bagi Peserta Didik yang Melampaui Kriteria)',
    tujuan: 'Memberikan tantangan belajar bermakna bagi peserta didik yang telah melampaui KKTP (proyek eksplorasi, studi kasus, tutor sebaya).',
    syaratSkor4: [
      'Mencantumkan siswa berprestasi, TP pengayaan, bentuk aktivitas eksploratif, dan hasil pencapaiannya.'
    ],
    hubunganDokumen: 'Menarik daftar siswa dengan nilai tinggi dari Daftar Nilai (Poin 10).',
    tips: [
      'Klik "Tarik Siswa Tuntas Tinggi dari Daftar Nilai" untuk mendata kandidat pengayaan secara cepat.'
    ]
  },
  lkpd: {
    regulasi: 'Permendikbudristek No. 16 Tahun 2022 (Perangkat Ajar Pendukung Modul Ajar)',
    tujuan: 'Menyediakan lembar aktivitas peserta didik berisi tujuan, petunjuk belajar, stimulus kontekstual, langkah kerja, tugas, dan rubrik penilaian.',
    syaratSkor4: [
      'Stimulus masalah kontekstual memicu nalar kritis/kolaborasi.',
      'Langkah kegiatan jelas dan dilengkapi rubrik penilaian unjuk kerja (skor 1–4).'
    ],
    hubunganDokumen: 'Melengkapi kegiatan inti pada Modul Ajar (Poin 5).',
    tips: [
      'Pastikan total bobot pertanyaan tugas berjumlah 100 poin agar mudah dikonversi ke nilai.'
    ]
  }
};
