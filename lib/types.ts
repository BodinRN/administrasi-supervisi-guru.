export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  schoolAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  schoolEmail: string;
  schoolWebsite: string;
  headerLine1?: string; // e.g. "PEMERINTAH KABUPATEN ..." atau "YAYASAN ..."
  headerLine2?: string; // e.g. "DINAS PENDIDIKAN DAN KEBUDAYAAN"
  jenjang?: string; // e.g. "SD/MI", "SMP/MTs", "SMA/MA", "SMK"
  logoLeft?: string; // Base64/Data URL logo kiri kop surat
  logoRight?: string; // Base64/Data URL logo kanan kop surat
  headmasterName: string;
  headmasterNip: string;
  supervisorName: string;
  supervisorNip: string;
  teacherName: string;
  teacherNip: string;
  subject: string;
  phase: string; // e.g. "Fase D (SMP/MTs)", "Fase E (SMA/SMK Kelas 10)"
  grade: string; // e.g. "Kelas VII", "Kelas X"
  academicYear: string; // e.g. "2026/2027"
  semester: string; // "Ganjil" | "Genap"
  documentDate: string; // e.g. "15 Juli 2026"
}

// 1. Analisis Alokasi Waktu / Pekan Efektif
export interface PekanBulan {
  bulan: string;
  jumlahMinggu: number;
  mingguEfektif: number;
  mingguTidakEfektif: number;
  keterangan: string;
}

export interface AlokasiWaktuData {
  semesterGanjil: PekanBulan[];
  semesterGenap: PekanBulan[];
  jamPelajaranPerMinggu: number;
  alokasiCadanganJP?: number;
  kegiatanNonEfektif: { kegiatan: string; jumlahMinggu: number }[];
  catatanDistribusi: string;
}

// 2. Program Tahunan (Prota)
export interface ProtaItem {
  no: number;
  elemen: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materiPokok: string;
  alokasiWaktuJP: number;
  semester: 'Ganjil' | 'Genap';
}

// 3. Program Semester (Promes)
export interface PromesItem {
  no: number;
  tujuanPembelajaran: string;
  materiPokok: string;
  alokasiJP: number;
  distribusiMinggu: { [key: string]: number }; // e.g. "Juli_1": 2, "Juli_2": 2
}

export interface PromesData {
  semester: 'Ganjil' | 'Genap';
  bulanList: { nama: string; mingguCount: number }[];
  items: PromesItem[];
}

// 4. Alur Tujuan Pembelajaran (ATP)
export interface AtpItem {
  no: number;
  elemen: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  indikatorKetercapaian: string[];
  profilPelajarPancasila: string[];
  alokasiWaktuJP: number;
  kataKunciMateri: string;
  glosarium: string;
}

// 5. Modul Ajar
export interface ModulAjarData {
  id: string;
  judulModul: string;
  fase: string;
  elemen: string;
  alokasiWaktu: string;
  kompetensiAwal: string;
  profilPelajarPancasila: string[];
  saranaPrasarana: string;
  targetPesertaDidik: string;
  modelPembelajaran: string;
  metodePembelajaran: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  kegiatanPembelajaran: {
    pertemuanKe: number;
    pendahuluan: string[];
    inti: string[];
    penutup: string[];
    alokasiMenit: number;
  }[];
  asesmenAwal: string;
  asesmenFormatif: string;
  asesmenSumatif: string;
  remedialDanPengayaan: string;
  refleksiGuru: string[];
  refleksiSiswa: string[];
}

// 6. Jadwal Pelajaran
export interface JadwalItem {
  hari: string;
  jamKe: string;
  waktu: string;
  kelas: string;
  mataPelajaran: string;
  ruang: string;
}

// 7. Jurnal Mengajar Harian / Agenda Guru
export interface AgendaHarianItem {
  id: string;
  hariTanggal: string;
  jamKe: string;
  kelas: string;
  tujuanPembelajaran: string;
  materiDanKegiatan: string;
  kehadiranSiswa: string;
  catatanRefleksi: string;
  tandaTanganStatus: boolean;
}

// 8. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
export interface KktpItem {
  no: number;
  tujuanPembelajaran: string;
  pendekatan: 'Interval Nilai' | 'Rubrik' | 'Deskripsi Kriteria';
  kriteriaInterval: {
    perluBimbingan: string; // 0 - 68
    cukup: string;          // 69 - 79
    baik: string;           // 80 - 89
    sangatBaik: string;     // 90 - 100
  };
  tindakLanjut: string;
}

// 9. Daftar Hadir / Presensi Siswa
export interface SiswaHadirItem {
  no: number;
  nisn: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  persentase: number;
}

// 10. Buku Daftar Nilai (Formatif & Sumatif)
export interface NilaiSiswaItem {
  no: number;
  nisn: string;
  nama: string;
  formatif: number[];
  sumatifLingkupMateri: number[];
  sumatifAkhirSemester: number;
  nilaiAkhir: number;
  capaianKompetensi: string;
}

// 11. Kisi-kisi & Butir Soal Penilaian
export interface SoalItem {
  no: number;
  tujuanPembelajaran: string;
  materi: string;
  indikatorSoal: string;
  levelKognitif: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  bentukSoal: 'Pilihan Ganda' | 'Isian Singkat' | 'Uraian';
  nomorSoal: number;
  butirSoal: string;
  kunciJawaban: string;
  skor: number;
}

// 12. Analisis Hasil Evaluasi
export interface AnalisisButirItem {
  noSoal: number;
  materi: string;
  jumlahBenar: number;
  dayaSerapPersen: number;
  tingkatKesukaran: 'Mudah' | 'Sedang' | 'Sukar';
  keterangan: string;
}

export interface AnalisisHasilItem {
  tujuanPembelajaran: string;
  jumlahPeserta: number;
  jumlahTuntas: number;
  jumlahBelumTuntas: number;
  dayaSerapPersen: number;
  kesimpulan: string;
  tindakLanjutKlasikal: string;
  analisisButirSoal?: AnalisisButirItem[];
}

// 13. Program & Kartu Pelaksanaan Remedial
export interface RemedialItem {
  no: number;
  namaSiswa: string;
  nisn: string;
  tpBelumTuntas: string;
  nilaiAwal: number;
  bentukBimbingan: string;
  nilaiAkhirRemedial: number;
  status: 'Tuntas' | 'Belum Tuntas';
  keterangan: string;
}

// 14. Program & Kartu Pelaksanaan Pengayaan
export interface PengayaanItem {
  no: number;
  namaSiswa: string;
  nisn: string;
  tpPengayaan: string;
  nilaiAwal: number;
  bentukAktivitas: string;
  hasilPengayaan: string;
  keterangan: string;
}

// 15. Lembar Kerja Peserta Didik (LKPD)
export interface LkpdData {
  judul: string;
  mataPelajaran: string;
  faseKelas: string;
  alokasiWaktu: string;
  tujuanAktivitas: string[];
  petunjukBelajar: string[];
  stimulusMateri: string;
  langkahKegiatan: string[];
  pertanyaanTugas: { no: number; pertanyaan: string; bobot: number }[];
  rubrikPenilaian: { kriteria: string; skor4: string; skor3: string; skor2: string; skor1: string }[];
}

// Full Dokumen Administrasi
export interface AdministrasiDocuments {
  alokasiWaktu: AlokasiWaktuData;
  prota: ProtaItem[];
  promes: PromesData;
  atp: AtpItem[];
  modulAjar: ModulAjarData;
  jadwalPelajaran: JadwalItem[];
  agendaHarian: AgendaHarianItem[];
  kktp: KktpItem[];
  daftarHadir: SiswaHadirItem[];
  daftarNilai: NilaiSiswaItem[];
  kisiKisiSoal: SoalItem[];
  analisisEvaluasi: AnalisisHasilItem;
  programRemedial: RemedialItem[];
  programPengayaan: PengayaanItem[];
  lkpd: LkpdData;
}

// Instrumen Supervisi
export interface SupervisiPoint {
  id: number;
  namaKomponen: string;
  deskripsi: string;
  kondisi: 'Ada' | 'Tidak Ada';
  skor: number; // 0 - 4 (0 = belum dinilai / tidak ada)
  catatanSupervisor: string;
  rekomendasi: string;
}

export interface SupervisiRecord {
  id: string;
  tanggalSupervisi: string;
  supervisorName: string;
  supervisorNip: string;
  teacherName: string;
  subject: string;
  grade: string;
  points: SupervisiPoint[];
  totalSkor: number;
  nilaiPersentase: number;
  predikat: 'A (Amat Baik)' | 'B (Baik)' | 'C (Cukup)' | 'D (Kurang)' | 'Belum Dinilai';
  catatanUmum: string;
  saranTindakLanjut: string;
  status: 'Draf' | 'Selesai';
}
