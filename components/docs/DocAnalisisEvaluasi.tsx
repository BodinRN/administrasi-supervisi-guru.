'use client';

import React, { useState } from 'react';
import { AnalisisHasilItem, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: AnalisisHasilItem;
  profile: SchoolProfile;
  onSave: (data: AnalisisHasilItem) => void;
}

export const DocAnalisisEvaluasi: React.FC<Props> = ({ data, profile, onSave }) => {
  const [formData, setFormData] = useState<AnalisisHasilItem>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 12 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Analisis Hasil Evaluasi Pembelajaran</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" /> Simpan Perubahan
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Analisis
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Dokumen
          </button>
        </div>
      </div>

      <KopSurat
        profile={profile}
        judulDokumen="LAPORAN ANALISIS HASIL EVALUASI / ASESMEN PEMBELAJARAN"
        subJudul={`Kelas: ${profile.grade} | Mata Pelajaran: ${profile.subject} | Semester: ${profile.semester}`}
      />

      <div className="space-y-6 text-xs md:text-sm">
        <div className="p-4 border border-slate-300 rounded bg-slate-50 print:bg-transparent">
          <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs">I. Lingkup Materi / Asesmen yang Dianalisis</h3>
          {isEditing ? (
            <input
              type="text"
              value={formData.tujuanPembelajaran}
              onChange={(e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value })}
              className="w-full border rounded p-1.5 text-xs font-semibold"
            />
          ) : (
            <p className="font-semibold text-slate-800">{formData.tujuanPembelajaran}</p>
          )}
        </div>

        <div>
          <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs">II. Data Rekapitulasi Ketuntasan Belajar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 border border-slate-300 rounded bg-white print:bg-transparent">
              <span className="text-[11px] text-slate-500 block uppercase">Jumlah Peserta Tes</span>
              <span className="text-xl font-extrabold text-slate-800">{formData.jumlahPeserta} Siswa</span>
            </div>
            <div className="p-3 border border-emerald-300 bg-emerald-50 rounded print:bg-transparent print:border-black">
              <span className="text-[11px] text-emerald-700 block uppercase">Jumlah Siswa Tuntas</span>
              <span className="text-xl font-extrabold text-emerald-800">{formData.jumlahTuntas} Siswa</span>
            </div>
            <div className="p-3 border border-rose-300 bg-rose-50 rounded print:bg-transparent print:border-black">
              <span className="text-[11px] text-rose-700 block uppercase">Belum Tuntas (Remedial)</span>
              <span className="text-xl font-extrabold text-rose-800">{formData.jumlahBelumTuntas} Siswa</span>
            </div>
            <div className="p-3 border border-sky-300 bg-sky-50 rounded print:bg-transparent print:border-black">
              <span className="text-[11px] text-sky-700 block uppercase">Daya Serap Klasikal</span>
              <span className="text-xl font-extrabold text-sky-800">{formData.dayaSerapPersen}%</span>
            </div>
          </div>
        </div>

        <div className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">III. Kesimpulan Hasil Belajar Klasikal:</h4>
            {isEditing ? (
              <textarea
                value={formData.kesimpulan}
                onChange={(e) => setFormData({ ...formData, kesimpulan: e.target.value })}
                rows={2}
                className="w-full border rounded p-1.5 text-xs"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{formData.kesimpulan}</p>
            )}
          </div>

          <div className="border-t border-slate-200 pt-3">
            <h4 className="font-bold text-slate-900 mb-1">IV. Rencana Tindak Lanjut Guru:</h4>
            {isEditing ? (
              <textarea
                value={formData.tindakLanjutKlasikal}
                onChange={(e) => setFormData({ ...formData, tindakLanjutKlasikal: e.target.value })}
                rows={2}
                className="w-full border rounded p-1.5 text-xs"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{formData.tindakLanjutKlasikal}</p>
            )}
          </div>
        </div>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
