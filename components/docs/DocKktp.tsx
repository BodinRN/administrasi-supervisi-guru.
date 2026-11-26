'use client';

import React, { useState, useEffect } from 'react';
import { KktpItem, SchoolProfile, AtpItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer, Link2 } from 'lucide-react';

interface Props {
  data: KktpItem[];
  profile: SchoolProfile;
  atpList?: AtpItem[];
  onSave: (data: KktpItem[]) => void;
}

export const DocKktp: React.FC<Props> = ({ data, profile, atpList = [], onSave }) => {
  const [items, setItems] = useState<KktpItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleSave = () => {
    onSave(items);
    setIsEditing(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        no: items.length + 1,
        tujuanPembelajaran: '',
        pendekatan: 'Interval Nilai',
        kriteriaInterval: {
          perluBimbingan: '0 - 68: Belum mencapai ketuntasan, perlu bimbingan penuh.',
          cukup: '69 - 79: Mencapai kriteria minimal dengan bimbingan pada bagian tertentu.',
          baik: '80 - 89: Menguasai kompetensi secara mandiri.',
          sangatBaik: '90 - 100: Sangat terampil dan melampaui kriteria.'
        },
        tindakLanjut: ''
      }
    ]);
    setIsEditing(true);
  };

  const pullFromAtp = () => {
    if (atpList.length === 0) {
      alert('Data ATP (Poin 4) masih kosong.');
      return;
    }
    setItems(
      atpList.map((a, idx) => ({
        no: idx + 1,
        tujuanPembelajaran: a.tujuanPembelajaran,
        pendekatan: 'Interval Nilai',
        kriteriaInterval: {
          perluBimbingan: '0 - 68: Belum mencapai ketuntasan, perlu remedial menyeluruh.',
          cukup: '69 - 79: Cukup menguasai, remedial pada indikator tertentu.',
          baik: '80 - 89: Sudah mencapai ketuntasan secara mandiri.',
          sangatBaik: '90 - 100: Melampaui ketuntasan, siap mengikuti pengayaan.'
        },
        tindakLanjut: 'Peserta didik < 69 mengikuti bimbingan remedial; >= 90 diberikan pengayaan.'
      }))
    );
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 })));
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 8 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {atpList.length > 0 && (
            <button
              type="button"
              onClick={pullFromAtp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-medium transition"
            >
              <Link2 className="w-3.5 h-3.5" /> Tarik TP dari ATP (Poin 4)
            </button>
          )}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah KKTP
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
              <Edit2 className="w-3.5 h-3.5" /> Edit KKTP
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
        docKey="kktp"
        onLoadExample={() => {
          setItems(exampleDocuments.kktp);
          onSave(exampleDocuments.kktp);
        }}
        extraContent={
          <div className="text-[11px] space-y-1">
            <p className="font-bold text-indigo-900">3 Pendekatan Resmi KKTP (Panduan Pembelajaran &amp; Asesmen):</p>
            <p>1. <strong>Deskripsi Kriteria:</strong> Menentukan kriteria memadai/tidak memadai pada tiap indikator tugas.</p>
            <p>2. <strong>Rubrik:</strong> Mengelompokkan capaian ke dalam tingkatan (Baru Berkembang, Layak, Cakap, Mahir).</p>
            <p>3. <strong>Interval Nilai:</strong> Menggunakan rentang skor (misal 0–68%, 69–79%, 80–89%, 90–100%) beserta tindak lanjutnya.</p>
          </div>
        }
      />

      <KopSurat
        profile={profile}
        judulDokumen="KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)"
        subJudul={`Kurikulum Merdeka | Mata Pelajaran: ${profile.subject || '-'}`}
      />

      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-300 rounded print:bg-transparent">
          <p className="font-semibold text-slate-800 mb-1">Acuan Interval Nilai Ketuntasan:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 border border-rose-200 bg-rose-50 rounded text-rose-800 print:bg-transparent print:border-black">
              <strong>0 - 68%:</strong> Perlu Bimbingan (Remedial Seluruh Materi)
            </div>
            <div className="p-2 border border-amber-200 bg-amber-50 rounded text-amber-800 print:bg-transparent print:border-black">
              <strong>69 - 79%:</strong> Cukup (Remedial Bagian Tertentu)
            </div>
            <div className="p-2 border border-blue-200 bg-blue-50 rounded text-blue-800 print:bg-transparent print:border-black">
              <strong>80 - 89%:</strong> Baik (Tuntas, Pengayaan Terarah)
            </div>
            <div className="p-2 border border-emerald-200 bg-emerald-50 rounded text-emerald-800 print:bg-transparent print:border-black">
              <strong>90 - 100%:</strong> Sangat Baik (Tuntas Melampaui)
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">Belum ada data KKTP.</p>
            <p>Klik <strong>Tambah KKTP</strong> atau <strong>Tarik TP dari ATP</strong> untuk menetapkan kriteria ketuntasan tiap TP.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                  <th className="border border-slate-300 px-3 py-2 w-48">Tujuan Pembelajaran (TP)</th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-28">Pendekatan</th>
                  <th className="border border-slate-300 px-3 py-2">Kriteria / Interval Ketuntasan</th>
                  <th className="border border-slate-300 px-3 py-2 w-48">Rencana Tindak Lanjut</th>
                  {isEditing && <th className="no-print border border-slate-300 px-1 py-2 text-center w-10">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-2 py-2 text-center font-medium">{row.no}</td>
                    <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">
                      {isEditing ? (
                        <textarea
                          value={row.tujuanPembelajaran}
                          placeholder="Tujuan Pembelajaran..."
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx] = { ...copy[idx], tujuanPembelajaran: e.target.value };
                            setItems(copy);
                          }}
                          rows={3}
                          className="w-full border rounded p-1 text-xs"
                        />
                      ) : (
                        row.tujuanPembelajaran || '-'
                      )}
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-center">
                      {isEditing ? (
                        <select
                          value={row.pendekatan}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx] = { ...copy[idx], pendekatan: e.target.value as KktpItem['pendekatan'] };
                            setItems(copy);
                          }}
                          className="w-full border rounded px-1 py-1 text-[11px] bg-white"
                        >
                          <option value="Interval Nilai">Interval Nilai</option>
                          <option value="Rubrik">Rubrik</option>
                          <option value="Deskripsi Kriteria">Deskripsi Kriteria</option>
                        </select>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold">
                          {row.pendekatan}
                        </span>
                      )}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-[11px] space-y-1.5">
                      {isEditing ? (
                        <>
                          <div>
                            <span className="font-bold text-rose-700">Perlu Bimbingan:</span>
                            <input
                              type="text"
                              value={row.kriteriaInterval.perluBimbingan}
                              onChange={(e) => {
                                const copy = [...items];
                                copy[idx] = {
                                  ...copy[idx],
                                  kriteriaInterval: { ...copy[idx].kriteriaInterval, perluBimbingan: e.target.value }
                                };
                                setItems(copy);
                              }}
                              className="w-full border rounded px-1.5 py-0.5 mt-0.5"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-amber-700">Cukup:</span>
                            <input
                              type="text"
                              value={row.kriteriaInterval.cukup}
                              onChange={(e) => {
                                const copy = [...items];
                                copy[idx] = {
                                  ...copy[idx],
                                  kriteriaInterval: { ...copy[idx].kriteriaInterval, cukup: e.target.value }
                                };
                                setItems(copy);
                              }}
                              className="w-full border rounded px-1.5 py-0.5 mt-0.5"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-blue-700">Baik:</span>
                            <input
                              type="text"
                              value={row.kriteriaInterval.baik}
                              onChange={(e) => {
                                const copy = [...items];
                                copy[idx] = {
                                  ...copy[idx],
                                  kriteriaInterval: { ...copy[idx].kriteriaInterval, baik: e.target.value }
                                };
                                setItems(copy);
                              }}
                              className="w-full border rounded px-1.5 py-0.5 mt-0.5"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-emerald-700">Sangat Baik:</span>
                            <input
                              type="text"
                              value={row.kriteriaInterval.sangatBaik}
                              onChange={(e) => {
                                const copy = [...items];
                                copy[idx] = {
                                  ...copy[idx],
                                  kriteriaInterval: { ...copy[idx].kriteriaInterval, sangatBaik: e.target.value }
                                };
                                setItems(copy);
                              }}
                              className="w-full border rounded px-1.5 py-0.5 mt-0.5"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p><span className="font-bold text-rose-700">• Perlu Bimbingan:</span> {row.kriteriaInterval.perluBimbingan}</p>
                          <p><span className="font-bold text-amber-700">• Cukup:</span> {row.kriteriaInterval.cukup}</p>
                          <p><span className="font-bold text-blue-700">• Baik:</span> {row.kriteriaInterval.baik}</p>
                          <p><span className="font-bold text-emerald-700">• Sangat Baik:</span> {row.kriteriaInterval.sangatBaik}</p>
                        </>
                      )}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 italic text-slate-700">
                      {isEditing ? (
                        <textarea
                          value={row.tindakLanjut}
                          placeholder="Rencana tindak lanjut..."
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx] = { ...copy[idx], tindakLanjut: e.target.value };
                            setItems(copy);
                          }}
                          rows={3}
                          className="w-full border rounded p-1 text-xs"
                        />
                      ) : (
                        row.tindakLanjut || '-'
                      )}
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
        )}
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
