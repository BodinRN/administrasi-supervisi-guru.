'use client';

import React, { useState, useEffect } from 'react';
import { PromesData, SchoolProfile, ProtaItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer, Link2 } from 'lucide-react';

interface Props {
  data: PromesData;
  profile: SchoolProfile;
  protaList?: ProtaItem[];
  onSave: (data: PromesData) => void;
}

const GANJIL_BULAN = [
  { nama: 'Juli', mingguCount: 4 },
  { nama: 'Agustus', mingguCount: 4 },
  { nama: 'September', mingguCount: 4 },
  { nama: 'Oktober', mingguCount: 4 },
  { nama: 'November', mingguCount: 4 },
  { nama: 'Desember', mingguCount: 4 }
];

const GENAP_BULAN = [
  { nama: 'Januari', mingguCount: 4 },
  { nama: 'Februari', mingguCount: 4 },
  { nama: 'Maret', mingguCount: 4 },
  { nama: 'April', mingguCount: 4 },
  { nama: 'Mei', mingguCount: 4 },
  { nama: 'Juni', mingguCount: 4 }
];

export const DocPromes: React.FC<Props> = ({ data, profile, protaList = [], onSave }) => {
  const [promes, setPromes] = useState<PromesData>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPromes(data);
  }, [data]);

  const handleSave = () => {
    onSave(promes);
    setIsEditing(false);
  };

  const switchSemester = (sem: 'Ganjil' | 'Genap') => {
    setPromes({
      ...promes,
      semester: sem,
      bulanList: sem === 'Genap' ? GENAP_BULAN : GANJIL_BULAN
    });
  };

  const addItem = () => {
    setPromes({
      ...promes,
      items: [
        ...promes.items,
        {
          no: promes.items.length + 1,
          tujuanPembelajaran: '',
          materiPokok: '',
          alokasiJP: 4,
          distribusiMinggu: {}
        }
      ]
    });
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setPromes({
      ...promes,
      items: promes.items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 }))
    });
  };

  const pullFromProta = () => {
    const filtered = protaList.filter((p) => p.semester === promes.semester);
    if (filtered.length === 0) {
      alert(`Belum ada item PROTA untuk Semester ${promes.semester}.`);
      return;
    }
    setPromes({
      ...promes,
      items: filtered.map((p, idx) => ({
        no: idx + 1,
        tujuanPembelajaran: p.tujuanPembelajaran,
        materiPokok: p.materiPokok,
        alokasiJP: p.alokasiWaktuJP,
        distribusiMinggu: {}
      }))
    });
    setIsEditing(true);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-6xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 3 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Program Semester (PROMES)</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded text-xs border border-slate-200">
            <button
              type="button"
              onClick={() => switchSemester('Ganjil')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                promes.semester === 'Ganjil' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              Sem. Ganjil
            </button>
            <button
              type="button"
              onClick={() => switchSemester('Genap')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                promes.semester === 'Genap' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              Sem. Genap
            </button>
          </div>
          {protaList.length > 0 && (
            <button
              type="button"
              onClick={pullFromProta}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-medium transition"
            >
              <Link2 className="w-3.5 h-3.5" /> Tarik TP dari PROTA (Poin 2)
            </button>
          )}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Baris
          </button>
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

      <ReferencePanel
        docKey="promes"
        onLoadExample={() => {
          setPromes(exampleDocuments.promes);
          onSave(exampleDocuments.promes);
        }}
      />

      <KopSurat
        profile={profile}
        judulDokumen={`PROGRAM SEMESTER (${promes.semester.toUpperCase()})`}
        subJudul={`Kurikulum Merdeka | Mata Pelajaran: ${profile.subject || '-'} | Tahun Ajaran: ${profile.academicYear || '-'}`}
      />

      {isEditing && (
        <div className="no-print mb-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700">Jumlah Minggu per Bulan:</span>
          {promes.bulanList.map((b, bIdx) => (
            <label key={b.nama} className="inline-flex items-center gap-1">
              <span>{b.nama}:</span>
              <input
                type="number"
                min={1}
                max={6}
                value={b.mingguCount}
                onChange={(e) => {
                  const copy = [...promes.bulanList];
                  copy[bIdx] = { ...copy[bIdx], mingguCount: Math.max(1, Math.min(6, parseInt(e.target.value, 10) || 4)) };
                  setPromes({ ...promes, bulanList: copy });
                }}
                className="w-10 border rounded text-center py-0.5"
              />
            </label>
          ))}
        </div>
      )}

      {promes.items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada data Program Semester ({promes.semester}).</p>
          <p>Klik <strong>Tambah Baris</strong> atau <strong>Tarik TP dari PROTA</strong> untuk mulai menyusun distribusi mingguan.</p>
        </div>
      ) : (
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
                <th rowSpan={2} className="no-print border border-slate-400 px-1 py-2 text-center w-14">Terisi</th>
                {isEditing && <th rowSpan={2} className="no-print border border-slate-400 px-1 py-2 text-center w-8">Aksi</th>}
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
              {promes.items.map((row, rIdx) => {
                const distributedJP = Object.values(row.distribusiMinggu || {}).reduce((a, b) => a + (b || 0), 0);
                const isMatch = distributedJP === row.alokasiJP;
                return (
                  <tr key={rIdx} className="hover:bg-slate-50">
                    <td className="border border-slate-400 px-1 py-1.5 text-center font-medium">{row.no}</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {isEditing ? (
                        <textarea
                          value={row.tujuanPembelajaran}
                          placeholder="Tujuan Pembelajaran..."
                          onChange={(e) => {
                            const copy = [...promes.items];
                            copy[rIdx] = { ...copy[rIdx], tujuanPembelajaran: e.target.value };
                            setPromes({ ...promes, items: copy });
                          }}
                          rows={2}
                          className="w-full border rounded px-1 py-0.5 text-[11px]"
                        />
                      ) : (
                        row.tujuanPembelajaran || '-'
                      )}
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.materiPokok}
                          placeholder="Materi Pokok"
                          onChange={(e) => {
                            const copy = [...promes.items];
                            copy[rIdx] = { ...copy[rIdx], materiPokok: e.target.value };
                            setPromes({ ...promes, items: copy });
                          }}
                          className="w-full border rounded px-1 py-0.5 text-[11px]"
                        />
                      ) : (
                        row.materiPokok || '-'
                      )}
                    </td>
                    <td className="border border-slate-400 px-1 py-1.5 text-center font-bold text-sky-800">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={row.alokasiJP}
                          onChange={(e) => {
                            const copy = [...promes.items];
                            copy[rIdx] = { ...copy[rIdx], alokasiJP: parseInt(e.target.value, 10) || 0 };
                            setPromes({ ...promes, items: copy });
                          }}
                          className="w-10 text-center border rounded"
                        />
                      ) : (
                        row.alokasiJP
                      )}
                    </td>
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
                                  const copyItems = [...promes.items];
                                  const copyDist = { ...copyItems[rIdx].distribusiMinggu };
                                  const num = parseInt(e.target.value, 10) || 0;
                                  if (num > 0) {
                                    copyDist[key] = num;
                                  } else {
                                    delete copyDist[key];
                                  }
                                  copyItems[rIdx] = { ...copyItems[rIdx], distribusiMinggu: copyDist };
                                  setPromes({ ...promes, items: copyItems });
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
                    <td className={`no-print border border-slate-400 px-1 py-1.5 text-center font-bold ${isMatch ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                      {distributedJP}/{row.alokasiJP}
                    </td>
                    {isEditing && (
                      <td className="no-print border border-slate-400 px-1 py-1.5 text-center">
                        <button onClick={() => removeItem(rIdx)} className="text-rose-600 hover:text-rose-800">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TandaTangan profile={profile} />
    </div>
  );
};
