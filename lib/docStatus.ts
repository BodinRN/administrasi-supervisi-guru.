import { AdministrasiDocuments, SchoolProfile } from './types';

export type DocKey = keyof AdministrasiDocuments;

export function isProfileComplete(profile: SchoolProfile): boolean {
  return !!(
    profile.schoolName?.trim() &&
    profile.teacherName?.trim() &&
    profile.subject?.trim()
  );
}

export function isDocumentFilled(docKey: DocKey, documents: AdministrasiDocuments): boolean {
  if (!documents) return false;
  switch (docKey) {
    case 'alokasiWaktu': {
      const aw = documents.alokasiWaktu;
      if (!aw) return false;
      const hasGanjil = aw.semesterGanjil?.some((m) => m.jumlahMinggu > 0 || m.mingguEfektif > 0);
      const hasGenap = aw.semesterGenap?.some((m) => m.jumlahMinggu > 0 || m.mingguEfektif > 0);
      return (aw.jamPelajaranPerMinggu || 0) > 0 || !!hasGanjil || !!hasGenap;
    }
    case 'prota':
      return Array.isArray(documents.prota) && documents.prota.length > 0;
    case 'promes':
      return !!documents.promes && Array.isArray(documents.promes.items) && documents.promes.items.length > 0;
    case 'atp':
      return Array.isArray(documents.atp) && documents.atp.length > 0;
    case 'modulAjar': {
      const m = documents.modulAjar;
      if (!m) return false;
      return !!(
        m.judulModul?.trim() ||
        m.tujuanPembelajaran?.length > 0 ||
        m.kegiatanPembelajaran?.length > 0
      );
    }
    case 'jadwalPelajaran':
      return Array.isArray(documents.jadwalPelajaran) && documents.jadwalPelajaran.length > 0;
    case 'agendaHarian':
      return Array.isArray(documents.agendaHarian) && documents.agendaHarian.length > 0;
    case 'kktp':
      return Array.isArray(documents.kktp) && documents.kktp.length > 0;
    case 'daftarHadir':
      return Array.isArray(documents.daftarHadir) && documents.daftarHadir.length > 0;
    case 'daftarNilai':
      return Array.isArray(documents.daftarNilai) && documents.daftarNilai.length > 0;
    case 'kisiKisiSoal':
      return Array.isArray(documents.kisiKisiSoal) && documents.kisiKisiSoal.length > 0;
    case 'analisisEvaluasi': {
      const ae = documents.analisisEvaluasi;
      if (!ae) return false;
      return !!(ae.tujuanPembelajaran?.trim() || (ae.jumlahPeserta || 0) > 0 || ae.kesimpulan?.trim());
    }
    case 'programRemedial':
      return Array.isArray(documents.programRemedial) && documents.programRemedial.length > 0;
    case 'programPengayaan':
      return Array.isArray(documents.programPengayaan) && documents.programPengayaan.length > 0;
    case 'lkpd': {
      const l = documents.lkpd;
      if (!l) return false;
      return !!(l.judul?.trim() || l.stimulusMateri?.trim() || l.pertanyaanTugas?.length > 0);
    }
    default:
      return false;
  }
}

export function countFilledDocuments(documents: AdministrasiDocuments): number {
  const keys: DocKey[] = [
    'alokasiWaktu',
    'prota',
    'promes',
    'atp',
    'modulAjar',
    'jadwalPelajaran',
    'agendaHarian',
    'kktp',
    'daftarHadir',
    'daftarNilai',
    'kisiKisiSoal',
    'analisisEvaluasi',
    'programRemedial',
    'programPengayaan',
    'lkpd'
  ];
  return keys.filter((k) => isDocumentFilled(k, documents)).length;
}
