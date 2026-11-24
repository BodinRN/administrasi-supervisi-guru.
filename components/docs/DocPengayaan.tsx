'use client';

import React, { useState } from 'react';
import { PengayaanItem, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: PengayaanItem[];
  profile: SchoolProfile;
  onSave: (data: PengayaanItem[]) => void;
}

export const DocPengayaan: React.FC<Props> = ({ data, profile, onSave }) => {
  const [items, setItems] = useState<PengayaanItem[]>(data);
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
        namaSiswa: 'Nama Siswa Berprestasi',
        nisn: '0102938400',
        tpPengayaan: 'Materi eksplorasi tingkat lanjut...',
        nilaiAwal: 92,
        bentukAktivitas: 'Pemberian proyek eksplorasi dan tantangan Bebras...',
        hasilPengayaan: 'Selesai dengan hasil istimewa.',
        keterangan: 'Tutor sebaya aktif.'
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
            Poin 14 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Program & Pelaksanaan Pengayaan</h2>
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Pengayaan
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
        judulDokumen="PROGRAM DAN LAPORAN PELAKSANAAN PENGAYAAN"
        subJudul={`Mata Pelajaran: ${profile.subject} | Kelas: ${profile.grade} | Semester: ${profile.semester}`}
      />

      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
              <th className="border border-slate-300 px-3 py-2 w-40">Nama Siswa</th>
              <th className="border border-slate-300 px-3 py-2">Materi / TP Pengayaan</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-14 font-bold text-sky-800">Nilai Asal</th>
              <th className="border border-slate-300 px-3 py-2">Bentuk Kegiatan Pengayaan</th>
              <th className="border border-slate-300 px-3 py-2">Hasil yang Dicapai</th>
              <th className="border border-slate-300 px-3 py-2 w-32">Keterangan</th>
              {isEditing && <th className="no-print border border-slate-300 px-1 py-2 text-center w-8">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-2 py-2 text-center font-medium">{row.no}</td>
                <td className="border border-slate-300 px-3 py-2 font-medium">
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.namaSiswa}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].namaSiswa = e.target.value;
                        setItems(copy);
                      }}
                      className="w-full border rounded px-1 text-xs"
                    />
                  ) : (
                    row.namaSiswa
                  )}
                </td>
                <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">{row.tpPengayaan}</td>
                <td className="border border-slate-300 px-2 py-2 text-center font-bold text-sky-700 bg-sky-50 print:bg-transparent">
                  {row.nilaiAwal}
                </td>
                <td className="border border-slate-300 px-3 py-2">{row.bentukAktivitas}</td>
                <td className="border border-slate-300 px-3 py-2 text-emerald-800 font-medium">{row.hasilPengayaan}</td>
                <td className="border border-slate-300 px-3 py-2 text-[11px] text-slate-600">{row.keterangan}</td>
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
