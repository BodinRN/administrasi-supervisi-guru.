'use client';

import React, { useState } from 'react';
import { SupervisiRecord, SupervisiPoint, SchoolProfile } from '@/lib/types';
import { KopSurat } from './KopSurat';
import { TandaTangan } from './TandaTangan';
import { Award, CheckCircle2, AlertTriangle, Edit2, Check, Printer, RotateCcw } from 'lucide-react';

interface Props {
  record: SupervisiRecord;
  profile: SchoolProfile;
  onSave: (record: SupervisiRecord) => void;
}

export const SupervisiChecklist: React.FC<Props> = ({ record, profile, onSave }) => {
  const [data, setData] = useState<SupervisiRecord>(record);
  const [isEditing, setIsEditing] = useState(false);

  // Kalkulasi Skor Otomatis
  const calculateTotal = (points: SupervisiPoint[]) => {
    const total = points.reduce((acc, curr) => acc + (curr.kondisi === 'Ada' ? curr.skor : 0), 0);
    const maxScore = points.length * 4;
    const percentage = maxScore > 0 ? parseFloat(((total / maxScore) * 100).toFixed(2)) : 0;
    
    let predikat: SupervisiRecord['predikat'] = 'D (Kurang)';
    if (percentage >= 86) predikat = 'A (Amat Baik)';
    else if (percentage >= 70) predikat = 'B (Baik)';
    else if (percentage >= 55) predikat = 'C (Cukup)';

    return { total, percentage, predikat };
  };

  const handlePointChange = (idx: number, field: keyof SupervisiPoint, value: any) => {
    const updatedPoints = [...data.points];
    updatedPoints[idx] = { ...updatedPoints[idx], [field]: value };
    const { total, percentage, predikat } = calculateTotal(updatedPoints);
    setData({
      ...data,
      points: updatedPoints,
      totalSkor: total,
      nilaiPersentase: percentage,
      predikat: predikat
    });
  };

  const handleSave = () => {
    onSave(data);
    setIsEditing(false);
  };

  const getPredikatBadgeColor = (predikat: string) => {
    if (predikat.startsWith('A')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (predikat.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (predikat.startsWith('C')) return 'bg-amber-100 text-amber-800 border-amber-300';
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
            <h2 className="text-lg font-bold text-slate-800">Checklist & Evaluasi 15 Poin Supervisi</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan untuk self-assessment mandiri guru atau lembar penilaian resmi saat disupervisi Kepala Sekolah / Pengawas.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Nilai & Catatan
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-600">Nama Sekolah : <strong className="text-slate-900">{profile.schoolName}</strong></p>
            <p className="text-slate-600">Nama Guru : <strong className="text-slate-900">{profile.teacherName}</strong></p>
            <p className="text-slate-600">NIP Guru : <strong className="text-slate-900">{profile.teacherNip}</strong></p>
            <p className="text-slate-600">Mata Pelajaran : <strong className="text-slate-900">{profile.subject}</strong></p>
          </div>
          <div>
            <p className="text-slate-600">Fase / Kelas : <strong className="text-slate-900">{profile.phase} / {profile.grade}</strong></p>
            <p className="text-slate-600">Tahun Ajaran / Sem : <strong className="text-slate-900">{profile.academicYear} / {profile.semester}</strong></p>
            <p className="text-slate-600">Nama Supervisor : <strong className="text-slate-900">{data.supervisorName || profile.supervisorName}</strong></p>
            <p className="text-slate-600">Tanggal Supervisi : <strong className="text-slate-900">{data.tanggalSupervisi}</strong></p>
          </div>
        </div>
      </div>

      {/* Kotak Ringkasan Nilai & Predikat (Dashboard Mini) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 bg-gradient-to-r from-slate-50 to-sky-50 border border-slate-300 rounded text-center print:border-black print:bg-transparent avoid-break">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Skor Perolehan</span>
          <span className="text-2xl font-extrabold text-slate-900">
            {data.totalSkor} <span className="text-xs font-normal text-slate-500">/ 60</span>
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

      {/* Tabel 15 Komponen Penilaian */}
      <div className="overflow-x-auto text-xs mb-6">
        <table className="w-full text-left border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-400 px-2 py-2 text-center w-8">No</th>
              <th className="border border-slate-400 px-3 py-2 w-64">Komponen Administrasi Pembelajaran</th>
              <th className="border border-slate-400 px-2 py-2 text-center w-20">Kondisi</th>
              <th className="border border-slate-400 px-2 py-2 text-center w-20">Skor (1-4)</th>
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
                      className="border rounded text-xs px-1"
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
                      onChange={(e) => handlePointChange(idx, 'skor', parseInt(e.target.value) || 1)}
                      className="border rounded text-xs px-1 font-bold text-center"
                    >
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
                      className="w-full border rounded p-1 text-[11px]"
                    />
                  ) : (
                    pt.catatanSupervisor
                  )}
                </td>
                <td className="border border-slate-400 px-3 py-2 text-[11px] italic text-slate-700">
                  {isEditing ? (
                    <textarea
                      value={pt.rekomendasi}
                      onChange={(e) => handlePointChange(idx, 'rekomendasi', e.target.value)}
                      rows={2}
                      className="w-full border rounded p-1 text-[11px]"
                    />
                  ) : (
                    pt.rekomendasi
                  )}
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-slate-100 font-extrabold text-slate-900">
              <td colSpan={3} className="border border-slate-400 px-3 py-2 text-right uppercase">
                Jumlah Skor Perolehan ($\Sigma$ Skor):
              </td>
              <td className="border border-slate-400 px-2 py-2 text-center text-base text-sky-900 font-extrabold">
                {data.totalSkor}
              </td>
              <td colSpan={2} className="border border-slate-400 px-3 py-2 text-slate-700 text-[11px]">
                Skor Maksimal: 60 | Nilai Akhir: <strong>{data.nilaiPersentase}%</strong> ({data.predikat})
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Kriteria Penskoran Pedoman */}
      <div className="p-3 border border-slate-300 rounded bg-slate-50 text-[11px] mb-6 print:bg-transparent print:border-black avoid-break">
        <p className="font-bold text-slate-800 mb-1">Pedoman Kriteria Penskoran & Predikat:</p>
        <p className="text-slate-600 mb-1">
          <strong>Skor Komponen:</strong> 4 = Sangat Baik / Lengkap & Mutakhir | 3 = Baik / Lengkap | 2 = Cukup / Kurang Lengkap | 1 = Sangat Kurang / Tidak Ada.
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
              className="w-full border rounded p-1.5 text-xs"
            />
          ) : (
            <p className="text-slate-700 leading-relaxed italic">{data.catatanUmum}</p>
          )}
        </div>
        <div className="border-t border-slate-200 pt-2">
          <h4 className="font-bold text-slate-800 uppercase mb-1">Saran Tindak Lanjut:</h4>
          {isEditing ? (
            <textarea
              value={data.saranTindakLanjut}
              onChange={(e) => setData({ ...data, saranTindakLanjut: e.target.value })}
              rows={2}
              className="w-full border rounded p-1.5 text-xs"
            />
          ) : (
            <p className="text-slate-700 leading-relaxed italic">{data.saranTindakLanjut}</p>
          )}
        </div>
      </div>

      {/* Pengesahan Tanda Tangan */}
      <TandaTangan profile={profile} withSupervisor={true} />
    </div>
  );
};
