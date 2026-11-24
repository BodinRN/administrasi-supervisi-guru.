'use client';

import React, { useState } from 'react';
import { AtpItem, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: AtpItem[];
  profile: SchoolProfile;
  onSave: (data: AtpItem[]) => void;
}

export const DocAtp: React.FC<Props> = ({ data, profile, onSave }) => {
  const [items, setItems] = useState<AtpItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(items);
    setIsEditing(false);
  };

  const addItem = () => {
    const newItem: AtpItem = {
      no: items.length + 1,
      elemen: 'Elemen',
      capaianPembelajaran: 'Capaian Pembelajaran...',
      tujuanPembelajaran: 'Tujuan Pembelajaran...',
      indikatorKetercapaian: ['Indikator 1', 'Indikator 2'],
      profilPelajarPancasila: ['Bernalar Kritis', 'Mandiri'],
      alokasiWaktuJP: 4,
      kataKunciMateri: 'Kata Kunci',
      glosarium: 'Definisi istilah penting...'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 })));
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 4 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Alur Tujuan Pembelajaran (ATP)</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah ATP
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
              <Edit2 className="w-3.5 h-3.5" /> Edit ATP
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
        judulDokumen="ALUR TUJUAN PEMBELAJARAN (ATP)"
        subJudul={`Kurikulum Merdeka | Mata Pelajaran: ${profile.subject} | Fase/Kelas: ${profile.phase} - ${profile.grade}`}
      />

      <div className="space-y-6 text-xs md:text-sm">
        {items.map((item, idx) => (
          <div key={idx} className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent page-break-avoid">
            <div className="flex items-start justify-between pb-2 mb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-800 text-white rounded-full font-bold text-xs">
                  {item.no}
                </span>
                <span className="font-bold text-slate-800 text-sm">{item.elemen}</span>
                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-semibold rounded text-[11px] print:border print:border-black">
                  {item.alokasiWaktuJP} JP
                </span>
              </div>
              {isEditing && (
                <button
                  onClick={() => removeItem(idx)}
                  className="no-print text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Capaian Pembelajaran (CP):</p>
                {isEditing ? (
                  <textarea
                    value={item.capaianPembelajaran}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx].capaianPembelajaran = e.target.value;
                      setItems(copy);
                    }}
                    rows={2}
                    className="w-full border rounded p-1.5 text-xs"
                  />
                ) : (
                  <p className="text-slate-800 italic mt-0.5">{item.capaianPembelajaran}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Tujuan Pembelajaran (TP):</p>
                {isEditing ? (
                  <textarea
                    value={item.tujuanPembelajaran}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx].tujuanPembelajaran = e.target.value;
                      setItems(copy);
                    }}
                    rows={2}
                    className="w-full border rounded p-1.5 text-xs font-semibold"
                  />
                ) : (
                  <p className="text-slate-900 font-semibold mt-0.5">{item.tujuanPembelajaran}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-slate-200 pt-2">
              <div>
                <p className="font-bold text-slate-700">Indikator Ketercapaian:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 mt-1">
                  {item.indikatorKetercapaian.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-700">Dimensi Profil Pelajar Pancasila:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.profilPelajarPancasila.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium print:border print:border-black">
                      {p}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 mt-2">
                  <strong>Kata Kunci:</strong> {item.kataKunciMateri}
                </p>
              </div>
            </div>

            {item.glosarium && (
              <div className="mt-2 pt-2 border-t border-dashed border-slate-300 text-[11px] text-slate-500 italic">
                {item.glosarium}
              </div>
            )}
          </div>
        ))}
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
