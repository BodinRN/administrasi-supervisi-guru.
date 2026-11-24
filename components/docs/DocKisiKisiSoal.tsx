'use client';

import React, { useState } from 'react';
import { SoalItem, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: SoalItem[];
  profile: SchoolProfile;
  onSave: (data: SoalItem[]) => void;
}

export const DocKisiKisiSoal: React.FC<Props> = ({ data, profile, onSave }) => {
  const [items, setItems] = useState<SoalItem[]>(data);
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
        tujuanPembelajaran: 'Tujuan Pembelajaran...',
        materi: 'Materi...',
        indikatorSoal: 'Disajikan narasi...',
        levelKognitif: 'C3',
        bentukSoal: 'Pilihan Ganda',
        nomorSoal: items.length + 1,
        butirSoal: 'Tuliskan butir soal di sini...',
        kunciJawaban: 'A. Pilihan jawaban benar',
        skor: 20
      }
    ]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1, nomorSoal: i + 1 })));
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 11 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Kisi-kisi & Butir Soal Penilaian</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Soal
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Soal
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
        judulDokumen="KISI-KISI, KARTU SOAL & KUNCI JAWABAN ASESMEN"
        subJudul={`Mata Pelajaran: ${profile.subject} | Fase/Kelas: ${profile.phase} - ${profile.grade}`}
      />

      {/* Bagian 1: Matriks Kisi-kisi */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-800 uppercase text-xs mb-2">A. Matriks Kisi-Kisi Asesmen</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                <th className="border border-slate-300 px-3 py-2 w-44">Tujuan Pembelajaran</th>
                <th className="border border-slate-300 px-3 py-2 w-32">Materi</th>
                <th className="border border-slate-300 px-3 py-2">Indikator Soal</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-14">Level</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-24">Bentuk</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-12">No Soal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-1.5 text-center font-medium">{row.no}</td>
                  <td className="border border-slate-300 px-3 py-1.5">{row.tujuanPembelajaran}</td>
                  <td className="border border-slate-300 px-3 py-1.5 font-medium">{row.materi}</td>
                  <td className="border border-slate-300 px-3 py-1.5">{row.indikatorSoal}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-sky-800">{row.levelKognitif}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center">{row.bentukSoal}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">{row.nomorSoal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian 2: Kartu Butir Soal & Kunci Jawaban */}
      <div>
        <h3 className="font-bold text-slate-800 uppercase text-xs mb-3">B. Naskah Butir Soal dan Rubrik Penilaian</h3>
        <div className="space-y-4 text-xs">
          {items.map((row, idx) => (
            <div key={idx} className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-white font-bold rounded text-xs">
                    Soal No. {row.nomorSoal}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    Bentuk: {row.bentukSoal} | Level: {row.levelKognitif} | Bobot Skor: {row.skor}
                  </span>
                </div>
                {isEditing && (
                  <button onClick={() => removeItem(idx)} className="no-print text-rose-600 hover:text-rose-800">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <span className="font-bold text-slate-800">Butir Pertanyaan:</span>
                  {isEditing ? (
                    <textarea
                      value={row.butirSoal}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].butirSoal = e.target.value;
                        setItems(copy);
                      }}
                      rows={2}
                      className="w-full border rounded p-1 text-xs mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1 whitespace-pre-line font-serif text-sm">{row.butirSoal}</p>
                  )}
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded print:bg-transparent print:border-black">
                  <span className="font-bold text-emerald-900 block text-[11px]">Kunci Jawaban / Kriteria Penilaian:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.kunciJawaban}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].kunciJawaban = e.target.value;
                        setItems(copy);
                      }}
                      className="w-full border rounded px-1.5 py-0.5 text-xs mt-1"
                    />
                  ) : (
                    <span className="text-emerald-800 font-medium text-xs">{row.kunciJawaban}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
