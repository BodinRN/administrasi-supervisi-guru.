'use client';

import React, { useState } from 'react';
import { AgendaHarianItem, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: AgendaHarianItem[];
  profile: SchoolProfile;
  onSave: (data: AgendaHarianItem[]) => void;
}

export const DocAgendaHarian: React.FC<Props> = ({ data, profile, onSave }) => {
  const [items, setItems] = useState<AgendaHarianItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(items);
    setIsEditing(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `JH-${Date.now().toString().slice(-3)}`,
        hariTanggal: 'Senin, ' + new Date().toLocaleDateString('id-ID'),
        jamKe: '1 - 2',
        kelas: profile.grade,
        tujuanPembelajaran: 'Tujuan Pembelajaran hari ini...',
        materiDanKegiatan: 'Uraian materi & kegiatan belajar...',
        kehadiranSiswa: 'Hadir: 32, Sakit: 0, Izin: 0, Alpa: 0',
        catatanRefleksi: 'Pembelajaran berlangsung kondusif.',
        tandaTanganStatus: true
      }
    ]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 7 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Agenda Harian / Jurnal Mengajar Guru</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Jurnal
            </button>
          )}
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Jurnal
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
        judulDokumen="JURNAL MENGAJAR HARIAN / AGENDA GURU"
        subJudul={`Mata Pelajaran: ${profile.subject} | Tahun Ajaran: ${profile.academicYear} | Semester: ${profile.semester}`}
      />

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
              <th className="border border-slate-300 px-2 py-2 w-28 text-center">Hari / Tanggal</th>
              <th className="border border-slate-300 px-1 py-2 w-14 text-center">Jam / Kelas</th>
              <th className="border border-slate-300 px-3 py-2 w-48">Tujuan Pembelajaran</th>
              <th className="border border-slate-300 px-3 py-2">Materi & Aktivitas Pembelajaran</th>
              <th className="border border-slate-300 px-2 py-2 w-28 text-center">Presensi Siswa</th>
              <th className="border border-slate-300 px-3 py-2 w-40">Catatan Refleksi / Kendala</th>
              <th className="border border-slate-300 px-1 py-2 w-12 text-center">Paraf</th>
              {isEditing && <th className="no-print border border-slate-300 px-1 py-2 text-center w-10">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-1 py-2 text-center font-medium">{idx + 1}</td>
                <td className="border border-slate-300 px-2 py-2 font-medium text-center">{row.hariTanggal}</td>
                <td className="border border-slate-300 px-1 py-2 text-center">
                  <span className="block font-bold text-sky-800">{row.kelas}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Jam {row.jamKe}</span>
                </td>
                <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">{row.tujuanPembelajaran}</td>
                <td className="border border-slate-300 px-3 py-2">{row.materiDanKegiatan}</td>
                <td className="border border-slate-300 px-2 py-2 text-center text-[10px] bg-slate-50 print:bg-transparent">
                  {row.kehadiranSiswa}
                </td>
                <td className="border border-slate-300 px-3 py-2 italic text-slate-600">{row.catatanRefleksi}</td>
                <td className="border border-slate-300 px-1 py-2 text-center font-bold text-emerald-700">
                  ✓
                </td>
                {isEditing && (
                  <td className="no-print border border-slate-300 px-1 py-2 text-center">
                    <button onClick={() => removeItem(idx)} className="text-rose-600 hover:text-rose-800">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
