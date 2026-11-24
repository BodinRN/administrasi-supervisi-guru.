'use client';

import React, { useState } from 'react';
import { PromesData, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: PromesData;
  profile: SchoolProfile;
  onSave: (data: PromesData) => void;
}

export const DocPromes: React.FC<Props> = ({ data, profile, onSave }) => {
  const [promes, setPromes] = useState<PromesData>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(promes);
    setIsEditing(false);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-6xl mx-auto">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 3 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Program Semester (PROMES)</h2>
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Matriks
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
        judulDokumen={`PROGRAM SEMESTER (${profile.semester.toUpperCase()})`}
        subJudul={`Kurikulum Merdeka | Mata Pelajaran: ${profile.subject} | Tahun Ajaran: ${profile.academicYear}`}
      />

      <div className="overflow-x-auto text-[11px]">
        <table className="w-full text-left border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th rowSpan={2} className="border border-slate-400 px-2 py-2 text-center w-8">No</th>
              <th rowSpan={2} className="border border-slate-400 px-2 py-2 w-48">Tujuan Pembelajaran</th>
              <th rowSpan={2} className="border border-slate-400 px-2 py-2 w-40">Materi Pokok</th>
              <th rowSpan={2} className="border border-slate-400 px-1 py-2 text-center w-12">JP</th>
              {promes.bulanList.map((b, idx) => (
                <th key={idx} colSpan={b.mingguCount} className="border border-slate-400 px-1 py-1 text-center font-bold">
                  {b.nama}
                </th>
              ))}
            </tr>
            <tr className="bg-slate-50 text-[10px] text-slate-700">
              {promes.bulanList.flatMap(b =>
                Array.from({ length: b.mingguCount }, (_, i) => (
                  <th key={`${b.nama}_${i + 1}`} className="border border-slate-400 px-1 py-0.5 text-center w-6">
                    {i + 1}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {promes.items.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50">
                <td className="border border-slate-400 px-1 py-1.5 text-center font-medium">{row.no}</td>
                <td className="border border-slate-400 px-2 py-1.5">{row.tujuanPembelajaran}</td>
                <td className="border border-slate-400 px-2 py-1.5 font-medium">{row.materiPokok}</td>
                <td className="border border-slate-400 px-1 py-1.5 text-center font-bold text-sky-800">{row.alokasiJP}</td>
                {promes.bulanList.flatMap(b =>
                  Array.from({ length: b.mingguCount }, (_, mIdx) => {
                    const key = `${b.nama}_${mIdx + 1}`;
                    const val = row.distribusiMinggu[key] || '';
                    return (
                      <td key={key} className={`border border-slate-400 px-1 py-1 text-center ${val ? 'bg-sky-50 font-bold text-sky-800' : ''}`}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              const copy = { ...promes };
                              const num = parseInt(e.target.value) || 0;
                              if (num > 0) {
                                copy.items[rIdx].distribusiMinggu[key] = num;
                              } else {
                                delete copy.items[rIdx].distribusiMinggu[key];
                              }
                              setPromes(copy);
                            }}
                            className="w-5 text-center border rounded"
                          />
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })
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
