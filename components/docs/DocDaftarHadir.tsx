'use client';

import React, { useState } from 'react';
import { SiswaHadirItem, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: SiswaHadirItem[];
  profile: SchoolProfile;
  onSave: (data: SiswaHadirItem[]) => void;
}

export const DocDaftarHadir: React.FC<Props> = ({ data, profile, onSave }) => {
  const [items, setItems] = useState<SiswaHadirItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(items);
    setIsEditing(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        no: items.length + 1,
        nisn: `01029384${(items.length + 11).toString().slice(-2)}`,
        nama: 'Nama Siswa Baru',
        jenisKelamin: 'L',
        hadir: 16,
        sakit: 0,
        izin: 0,
        alpa: 0,
        persentase: 100
      }
    ]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 })));
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 9 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Daftar Hadir / Presensi Siswa</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Siswa
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Presensi
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
        judulDokumen="REKAPITULASI PRESENSI / DAFTAR HADIR SISWA"
        subJudul={`Kelas: ${profile.grade} | Mata Pelajaran: ${profile.subject} | Semester: ${profile.semester}`}
      />

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
              <th className="border border-slate-300 px-3 py-2 text-center w-28">NISN</th>
              <th className="border border-slate-300 px-3 py-2">Nama Lengkap Peserta Didik</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-12">L/P</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-16 font-bold text-emerald-800">Hadir</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-14 text-amber-800">Sakit</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-14 text-blue-800">Izin</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-14 text-rose-800">Alpa</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-20 font-bold">% Hadir</th>
              {isEditing && <th className="no-print border border-slate-300 px-1 py-2 text-center w-10">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-2 py-2 text-center font-medium">{row.no}</td>
                <td className="border border-slate-300 px-3 py-2 text-center font-mono">{row.nisn}</td>
                <td className="border border-slate-300 px-3 py-2 font-medium">
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.nama}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].nama = e.target.value;
                        setItems(copy);
                      }}
                      className="w-full border rounded px-1.5 py-0.5"
                    />
                  ) : (
                    row.nama
                  )}
                </td>
                <td className="border border-slate-300 px-2 py-2 text-center font-bold text-slate-600">{row.jenisKelamin}</td>
                <td className="border border-slate-300 px-2 py-2 text-center font-bold text-emerald-700">{row.hadir}</td>
                <td className="border border-slate-300 px-2 py-2 text-center text-amber-700">{row.sakit}</td>
                <td className="border border-slate-300 px-2 py-2 text-center text-blue-700">{row.izin}</td>
                <td className="border border-slate-300 px-2 py-2 text-center text-rose-700 font-bold">{row.alpa}</td>
                <td className="border border-slate-300 px-2 py-2 text-center font-bold text-slate-900 bg-slate-50 print:bg-transparent">
                  {row.persentase}%
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
