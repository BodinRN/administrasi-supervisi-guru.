'use client';

import React, { useState, useEffect } from 'react';
import { SupervisiRecord, SupervisiPoint, SchoolProfile, AdministrasiDocuments } from '@/lib/types';
import { isDocumentFilled, DocKey } from '@/lib/docStatus';
import { KopSurat } from './KopSurat';
import { TandaTangan } from './TandaTangan';
import { Award, Edit2, Check, Printer, RefreshCw } from 'lucide-react';

interface Props {
  record: SupervisiRecord;
  profile: SchoolProfile;
  documents: AdministrasiDocuments;
  onSave: (record: SupervisiRecord) => void;
}

const POINT_TO_DOC_KEY: Record<number, DocKey> = {
  1: 'alokasiWaktu',
  2: 'prota',
  3: 'promes',
  4: 'atp',
  5: 'modulAjar',
  6: 'jadwalPelajaran',
  7: 'agendaHarian',
  8: 'kktp',
  9: 'daftarHadir',
  10: 'daftarNilai',
  11: 'kisiKisiSoal',
  12: 'analisisEvaluasi',
  13: 'programRemedial',
  14: 'programPengayaan',
  15: 'lkpd',
};

export const SupervisiChecklist: React.FC<Props> = ({ record, profile, documents, onSave }) => {
  const [data, setData] = useState<SupervisiRecord>(record);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setData(record);
  }, [record]);

  const maxScore = data.points.length * 4;

  // Kalkulasi Skor Otomatis
  const calculateTotal = (points: SupervisiPoint[]): { total: number; percentage: number; predikat: SupervisiRecord['predikat'] } => {
    const total = points.reduce((acc, curr) => acc + (curr.kondisi === 'Ada' ? (curr.skor || 0) : 0), 0);
    const max = points.length * 4;
    const percentage = max > 0 ? parseFloat(((total / max) * 100).toFixed(2)) : 0;

    if (total === 0) {
      return { total: 0, percentage: 0, predikat: 'Belum Dinilai' };
    }

    let predikat: SupervisiRecord['predikat'] = 'D (Kurang)';
    if (percentage >= 86) predikat = 'A (Amat Baik)';
    else if (percentage >= 70) predikat = 'B (Baik)';
    else if (percentage >= 55) predikat = 'C (Cukup)';

    return { total, percentage, predikat };
  };

  const handlePointChange = (idx: number, field: keyof SupervisiPoint, value: any) => {
    const updatedPoints = [...data.points];
    const nextPoint = { ...updatedPoints[idx], [field]: value };
    if (field === 'kondisi' && value === 'Tidak Ada') {
      nextPoint.skor = 0;
    } else if (field === 'kondisi' && value === 'Ada' && nextPoint.skor === 0) {
      nextPoint.skor = 3;
    } else if (field === 'skor' && Number(value) > 0 && nextPoint.kondisi === 'Tidak Ada') {
      nextPoint.kondisi = 'Ada';
    }
    updatedPoints[idx] = nextPoint;
    const { total, percentage, predikat } = calculateTotal(updatedPoints);
    setData({
      ...data,
      points: updatedPoints,
      totalSkor: total,
      nilaiPersentase: percentage,
      predikat
    });
  };

  const handleSyncFromDocuments = () => {
    const updatedPoints = data.points.map((pt) => {
      const docKey = POINT_TO_DOC_KEY[pt.id];
      if (!docKey) return pt;
      const filled = isDocumentFilled(docKey, documents);
      return {
        ...pt,
        kondisi: filled ? ('Ada' as const) : ('Tidak Ada' as const),
        skor: filled ? (pt.skor > 0 ? pt.skor : 3) : 0,
      };
    });
    const { total, percentage, predikat } = calculateTotal(updatedPoints);
    const nextRecord: SupervisiRecord = {
      ...data,
      points: updatedPoints,
      totalSkor: total,
      nilaiPersentase: percentage,
      predikat,
    };
    setData(nextRecord);
    onSave(nextRecord);
  };

  const handleSave = () => {
    onSave(data);
    setIsEditing(false);
  };

  const getPredikatBadgeColor = (predikat: string) => {
    if (predikat.startsWith('A')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (predikat.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (predikat.startsWith('C')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (predikat === 'Belum Dinilai') return 'bg-slate-100 text-slate-700 border-slate-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      {/* Header Aksi (Hidden on Print) */}
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-semibold rounded text-xs flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Instrumen Evaluasi Resmi
            </span>
            <h2 className="text-lg font-bold text-slate-800">Checklist &amp; Evaluasi {data.points.length} Poin Supervisi</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan untuk self-assessment mandiri guru atau lembar penilaian resmi saat disupervisi Kepala Sekolah / Pengawas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncFromDocuments}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded text-xs font-medium transition"
            title="Cek otomatis dokumen mana saja yang sudah Anda isi pada 15 poin"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Cek Kelengkapan Dokumen
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" /> Simpan Hasil Evaluasi
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Nilai &amp; Catatan
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Lembar Supervisi
          </button>
        </div>
      </div>

      {/* Dokumen Resmi */}
      <KopSurat
        profile={profile}
        judulDokumen="INSTRUMEN SUPERVISI PERANGKAT ADMINISTRASI PEMBELAJARAN"
        subJudul="STANDAR SUPERVISI AKADEMIK GURU KURIKULUM MERDEKA"
        nomorDokumen={data.id}
      />

      {/* Identitas Supervisi */}
      <div className="p-3 bg-slate-50 border border-slate-300 rounded mb-6 text-xs print:bg-transparent print:border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-slate-600">Nama Sekolah : <strong className="text-slate-900">{profile.schoolName || '-'}</strong></p>
            <p className="text-slate-600">Nama Guru : <strong className="text-slate-900">{profile.teacherName || '-'}</strong></p>
            <p className="text-slate-600">NIP Guru : <strong className="text-slate-900">{profile.teacherNip || '-'}</strong></p>
            <p className="text-slate-600">Mata Pelajaran : <strong className="text-slate-900">{profile.subject || '-'}</strong></p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600">Fase / Kelas : <strong className="text-slate-900">{profile.phase || '-'} / {profile.grade || '-'}</strong></p>
            <p className="text-slate-600">Tahun Ajaran / Sem : <strong className="text-slate-900">{profile.academicYear || '-'} / {profile.semester || '-'}</strong></p>
            <p className="text-slate-600">
              Nama Supervisor :{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={data.supervisorName}
                  onChange={(e) => setData({ ...data, supervisorName: e.target.value })}
                  placeholder={profile.supervisorName || 'Nama Supervisor'}
                  className="border rounded px-1.5 py-0.5 text-xs ml-1"
                />
              ) : (
                <strong className="text-slate-900">{data.supervisorName || profile.supervisorName || '-'}</strong>
              )}
            </p>
            <p className="text-slate-600">
              Tanggal Supervisi :{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={data.tanggalSupervisi}
                  onChange={(e) => setData({ ...data, tanggalSupervisi: e.target.value })}
                  placeholder="Contoh: 12 Agustus 2026"
                  className="border rounded px-1.5 py-0.5 text-xs ml-1"
                />
              ) : (
                <strong className="text-slate-900">{data.tanggalSupervisi || '-'}</strong>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Kotak Ringkasan Nilai & Predikat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 bg-gradient-to-r from-slate-50 to-sky-50 border border-slate-300 rounded text-center print:border-black print:bg-transparent avoid-break">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Skor Perolehan</span>
          <span className="text-2xl font-extrabold text-slate-900">
            {data.totalSkor} <span className="text-xs font-normal text-slate-500">/ {maxScore}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Persentase Ketercapaian</span>
          <span className="text-2xl font-extrabold text-sky-700">
            {data.nilaiPersentase}%
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Predikat Kelayakan</span>
          <span className={`inline-block px-3 py-1 text-sm font-extrabold rounded-full border mt-1 ${getPredikatBadgeColor(data.predikat)} print:border-none print:p-0`}>
            {data.predikat}
          </span>
        </div>
      </div>

      {/* Tabel Komponen Penilaian */}
      <div className="overflow-x-auto text-xs mb-6">
        <table className="w-full text-left border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-400 px-2 py-2 text-center w-8">No</th>
              <th className="border border-slate-400 px-3 py-2 w-64">Komponen Administrasi Pembelajaran</th>
              <th className="border border-slate-400 px-2 py-2 text-center w-24">Kondisi</th>
              <th className="border border-slate-400 px-2 py-2 text-center w-28">Skor (0–4)</th>
              <th className="border border-slate-400 px-3 py-2">Catatan Supervisor / Bukti Fisik</th>
              <th className="border border-slate-400 px-3 py-2 w-48">Rekomendasi Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            {data.points.map((pt, idx) => (
              <tr key={pt.id} className="hover:bg-slate-50">
                <td className="border border-slate-400 px-2 py-2 text-center font-bold text-slate-700">{pt.id}</td>
                <td className="border border-slate-400 px-3 py-2">
                  <span className="font-bold text-slate-900 block">{pt.namaKomponen}</span>
                  <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{pt.deskripsi}</span>
                </td>
                <td className="border border-slate-400 px-2 py-2 text-center">
                  {isEditing ? (
                    <select
                      value={pt.kondisi}
                      onChange={(e) => handlePointChange(idx, 'kondisi', e.target.value)}
                      className="border rounded text-xs px-1 py-0.5"
                    >
                      <option value="Ada">Ada</option>
                      <option value="Tidak Ada">Tidak Ada</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pt.kondisi === 'Ada' ? 'text-emerald-800 bg-emerald-100' : 'text-rose-800 bg-rose-100'} print:bg-transparent print:text-black`}>
                      {pt.kondisi}
                    </span>
                  )}
                </td>
                <td className="border border-slate-400 px-2 py-2 text-center">
                  {isEditing ? (
                    <select
                      value={pt.skor}
                      onChange={(e) => handlePointChange(idx, 'skor', parseInt(e.target.value, 10) || 0)}
                      className="border rounded text-xs px-1 py-0.5 font-bold text-center"
                    >
                      <option value={0}>0 (Belum Ada)</option>
                      <option value={4}>4 (Sangat Baik)</option>
                      <option value={3}>3 (Baik)</option>
                      <option value={2}>2 (Cukup)</option>
                      <option value={1}>1 (Kurang)</option>
                    </select>
                  ) : (
                    <span className="text-sm font-extrabold text-slate-900">
                      {pt.skor}
                    </span>
                  )}
                </td>
                <td className="border border-slate-400 px-3 py-2 text-[11px]">
                  {isEditing ? (
                    <textarea
                      value={pt.catatanSupervisor}
                      onChange={(e) => handlePointChange(idx, 'catatanSupervisor', e.target.value)}
                      rows={2}
                      placeholder="Catatan bukti fisik..."
                      className="w-full border rounded p-1 text-[11px]"
                    />
                  ) : (
                    pt.catatanSupervisor || <span className="text-slate-400 italic">-</span>
                  )}
                </td>
                <td className="border border-slate-400 px-3 py-2 text-[11px] italic text-slate-700">
                  {isEditing ? (
                    <textarea
                      value={pt.rekomendasi}
                      onChange={(e) => handlePointChange(idx, 'rekomendasi', e.target.value)}
                      rows={2}
                      placeholder="Rekomendasi..."
                      className="w-full border rounded p-1 text-[11px]"
                    />
                  ) : (
                    pt.rekomendasi || <span className="text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-slate-100 font-extrabold text-slate-900">
              <td colSpan={3} className="border border-slate-400 px-3 py-2 text-right uppercase">
                Jumlah Skor Perolehan (Σ Skor):
              </td>
              <td className="border border-slate-400 px-2 py-2 text-center text-base text-sky-900 font-extrabold">
                {data.totalSkor}
              </td>
              <td colSpan={2} className="border border-slate-400 px-3 py-2 text-slate-700 text-[11px]">
                Skor Maksimal: {maxScore} | Nilai Akhir: <strong>{data.nilaiPersentase}%</strong> ({data.predikat})
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Kriteria Penskoran Pedoman */}
      <div className="p-3 border border-slate-300 rounded bg-slate-50 text-[11px] mb-6 print:bg-transparent print:border-black avoid-break">
        <p className="font-bold text-slate-800 mb-1">Pedoman Kriteria Penskoran &amp; Predikat:</p>
        <p className="text-slate-600 mb-1">
          <strong>Skor Komponen:</strong> 4 = Sangat Baik / Lengkap &amp; Mutakhir | 3 = Baik / Lengkap | 2 = Cukup / Kurang Lengkap | 1 = Sangat Kurang | 0 = Tidak Ada.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
          <span>• <strong>86% – 100%:</strong> Amat Baik (A)</span>
          <span>• <strong>70% – 85%:</strong> Baik (B)</span>
          <span>• <strong>55% – 69%:</strong> Cukup (C)</span>
          <span>• <strong>&lt; 55%:</strong> Kurang (D)</span>
        </div>
      </div>

      {/* Catatan Umum & Saran Tindak Lanjut Supervisor */}
      <div className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent space-y-3 text-xs mb-6 avoid-break">
        <div>
          <h4 className="font-bold text-slate-800 uppercase mb-1">Catatan Umum Supervisor:</h4>
          {isEditing ? (
            <textarea
              value={data.catatanUmum}
              onChange={(e) => setData({ ...data, catatanUmum: e.target.value })}
              rows={2}
              placeholder="Tuliskan catatan umum hasil supervisi..."
              className="w-full border rounded p-1.5 text-xs"
            />
          ) : (
            <p className="text-slate-700 leading-relaxed italic">{data.catatanUmum || '-'}</p>
          )}
        </div>
        <div className="border-t border-slate-200 pt-2">
          <h4 className="font-bold text-slate-800 uppercase mb-1">Saran Tindak Lanjut:</h4>
          {isEditing ? (
            <textarea
              value={data.saranTindakLanjut}
              onChange={(e) => setData({ ...data, saranTindakLanjut: e.target.value })}
              rows={2}
              placeholder="Tuliskan saran tindak lanjut..."
              className="w-full border rounded p-1.5 text-xs"
            />
          ) : (
            <p className="text-slate-700 leading-relaxed italic">{data.saranTindakLanjut || '-'}</p>
          )}
        </div>
      </div>

      {/* Pengesahan Tanda Tangan */}
      <TandaTangan profile={profile} withSupervisor={true} />
    </div>
  );
};
