'use client';

import React, { useState } from 'react';
import { NilaiSiswaItem, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: NilaiSiswaItem[];
  profile: SchoolProfile;
  onSave: (data: NilaiSiswaItem[]) => void;
}

export const DocDaftarNilai: React.FC<Props> = ({ data, profile, onSave }) => {
  const [items, setItems] = useState<NilaiSiswaItem[]>(data);
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
        formatif: [80, 80, 80],
        sumatifLingkupMateri: [80, 80, 80],
        sumatifAkhirSemester: 80,
        nilaiAkhir: 80,
        capaianKompetensi: 'Menunjukkan penguasaan baik dalam materi pembelajaran.'
      }
    ]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 })));
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-6xl mx-auto text-slate-800">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 10 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Buku Daftar Nilai (Formatif & Sumatif)</h2>
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Nilai
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
        judulDokumen="BUKU DAFTAR NILAI ASESMEN SISWA"
        subJudul={`Kurikulum Merdeka (Asesmen Formatif & Sumatif) | Kelas: ${profile.grade} | Mata Pelajaran: ${profile.subject}`}
      />

      <div className="overflow-x-auto text-[11px]">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th rowSpan={2} className="border border-slate-300 px-2 py-1 text-center w-8">No</th>
              <th rowSpan={2} className="border border-slate-300 px-2 py-1 text-center w-24">NISN</th>
              <th rowSpan={2} className="border border-slate-300 px-3 py-1 w-44">Nama Peserta Didik</th>
              <th colSpan={3} className="border border-slate-300 px-1 py-1 text-center font-bold text-sky-900 bg-sky-50">Formatif (TP)</th>
              <th colSpan={3} className="border border-slate-300 px-1 py-1 text-center font-bold text-indigo-900 bg-indigo-50">Sumatif Lingkup Materi</th>
              <th rowSpan={2} className="border border-slate-300 px-1 py-1 text-center w-12 font-bold bg-amber-50">SAS</th>
              <th rowSpan={2} className="border border-slate-300 px-1 py-1 text-center w-12 font-extrabold bg-emerald-50 text-emerald-900">Nilai Akhir</th>
              <th rowSpan={2} className="border border-slate-300 px-3 py-1">Deskripsi Capaian Kompetensi (Raport)</th>
              {isEditing && <th rowSpan={2} className="no-print border border-slate-300 px-1 py-1 text-center w-8">Aksi</th>}
            </tr>
            <tr className="bg-slate-50 text-[10px] text-slate-700 text-center">
              <th className="border border-slate-300 px-1 py-0.5 w-8">F1</th>
              <th className="border border-slate-300 px-1 py-0.5 w-8">F2</th>
              <th className="border border-slate-300 px-1 py-0.5 w-8">F3</th>
              <th className="border border-slate-300 px-1 py-0.5 w-8">LM1</th>
              <th className="border border-slate-300 px-1 py-0.5 w-8">LM2</th>
              <th className="border border-slate-300 px-1 py-0.5 w-8">LM3</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-1 py-1 text-center font-medium">{row.no}</td>
                <td className="border border-slate-300 px-2 py-1 text-center font-mono">{row.nisn}</td>
                <td className="border border-slate-300 px-2 py-1 font-medium">{row.nama}</td>
                
                {/* Formatif */}
                {row.formatif.map((f, fIdx) => (
                  <td key={`f_${fIdx}`} className="border border-slate-300 px-1 py-1 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        value={f}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx].formatif[fIdx] = parseInt(e.target.value) || 0;
                          setItems(copy);
                        }}
                        className="w-8 border rounded text-center text-[10px]"
                      />
                    ) : f}
                  </td>
                ))}

                {/* Sumatif LM */}
                {row.sumatifLingkupMateri.map((lm, lmIdx) => (
                  <td key={`lm_${lmIdx}`} className="border border-slate-300 px-1 py-1 text-center font-medium">
                    {isEditing ? (
                      <input
                        type="number"
                        value={lm}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx].sumatifLingkupMateri[lmIdx] = parseInt(e.target.value) || 0;
                          setItems(copy);
                        }}
                        className="w-8 border rounded text-center text-[10px]"
                      />
                    ) : lm}
                  </td>
                ))}

                {/* SAS */}
                <td className="border border-slate-300 px-1 py-1 text-center font-medium bg-amber-50/50 print:bg-transparent">
                  {isEditing ? (
                    <input
                      type="number"
                      value={row.sumatifAkhirSemester}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].sumatifAkhirSemester = parseInt(e.target.value) || 0;
                        setItems(copy);
                      }}
                      className="w-8 border rounded text-center text-[10px]"
                    />
                  ) : row.sumatifAkhirSemester}
                </td>

                {/* Nilai Akhir */}
                <td className="border border-slate-300 px-1 py-1 text-center font-extrabold text-emerald-800 bg-emerald-50 print:bg-transparent">
                  {row.nilaiAkhir}
                </td>

                {/* Capaian */}
                <td className="border border-slate-300 px-2 py-1 text-[10px] text-slate-700 italic">
                  {isEditing ? (
                    <textarea
                      value={row.capaianKompetensi}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].capaianKompetensi = e.target.value;
                        setItems(copy);
                      }}
                      rows={1}
                      className="w-full border rounded p-1 text-[10px]"
                    />
                  ) : row.capaianKompetensi}
                </td>

                {isEditing && (
                  <td className="no-print border border-slate-300 px-1 py-1 text-center">
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
