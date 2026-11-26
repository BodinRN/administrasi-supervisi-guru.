'use client';

import React, { useState, useEffect } from 'react';
import { NilaiSiswaItem, SchoolProfile, SiswaHadirItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer, Link2 } from 'lucide-react';

interface Props {
  data: NilaiSiswaItem[];
  profile: SchoolProfile;
  daftarHadirList?: SiswaHadirItem[];
  onSave: (data: NilaiSiswaItem[]) => void;
}

function calcNilaiAkhir(row: NilaiSiswaItem): number {
  const sumatifScores = [...(row.sumatifLingkupMateri || []), row.sumatifAkhirSemester].filter(
    (v) => typeof v === 'number' && v > 0
  );
  if (sumatifScores.length === 0) {
    const formatifScores = (row.formatif || []).filter((v) => v > 0);
    if (formatifScores.length === 0) return 0;
    return Math.round(formatifScores.reduce((a, b) => a + b, 0) / formatifScores.length);
  }
  return Math.round(sumatifScores.reduce((a, b) => a + b, 0) / sumatifScores.length);
}

export const DocDaftarNilai: React.FC<Props> = ({ data, profile, daftarHadirList = [], onSave }) => {
  const [items, setItems] = useState<NilaiSiswaItem[]>(data);
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
        nisn: '',
        nama: '',
        formatif: [0, 0, 0],
        sumatifLingkupMateri: [0, 0, 0],
        sumatifAkhirSemester: 0,
        nilaiAkhir: 0,
        capaianKompetensi: ''
      }
    ]);
    setIsEditing(true);
  };

  const pullStudentsFromPresensi = () => {
    if (daftarHadirList.length === 0) {
      alert('Data siswa di Daftar Hadir (Poin 9) masih kosong.');
      return;
    }
    const existingByName = new Map(items.map((it) => [it.nama.toLowerCase(), it]));
    const merged: NilaiSiswaItem[] = daftarHadirList.map((s, idx) => {
      const prev = existingByName.get(s.nama.toLowerCase());
      if (prev) return { ...prev, no: idx + 1, nisn: s.nisn || prev.nisn };
      return {
        no: idx + 1,
        nisn: s.nisn,
        nama: s.nama,
        formatif: [0, 0, 0],
        sumatifLingkupMateri: [0, 0, 0],
        sumatifAkhirSemester: 0,
        nilaiAkhir: 0,
        capaianKompetensi: ''
      };
    });
    setItems(merged);
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 })));
  };

  const updateField = (idx: number, nextRow: NilaiSiswaItem, recalc: boolean = true) => {
    const copy = [...items];
    copy[idx] = recalc ? { ...nextRow, nilaiAkhir: calcNilaiAkhir(nextRow) } : nextRow;
    setItems(copy);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-6xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 10 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Buku Daftar Nilai (Formatif &amp; Sumatif)</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {daftarHadirList.length > 0 && (
            <button
              type="button"
              onClick={pullStudentsFromPresensi}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-medium transition"
            >
              <Link2 className="w-3.5 h-3.5" /> Tarik Siswa dari Presensi (Poin 9)
            </button>
          )}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Siswa
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

      <ReferencePanel
        docKey="daftarNilai"
        onLoadExample={() => {
          setItems(exampleDocuments.daftarNilai);
          onSave(exampleDocuments.daftarNilai);
        }}
      />

      <KopSurat
        profile={profile}
        judulDokumen="BUKU DAFTAR NILAI ASESMEN SISWA"
        subJudul={`Kurikulum Merdeka (Asesmen Formatif & Sumatif) | Kelas: ${profile.grade || '-'} | Mata Pelajaran: ${profile.subject || '-'}`}
      />

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada data nilai siswa.</p>
          <p>Klik <strong>Tambah Siswa</strong> atau <strong>Tarik Siswa dari Presensi (Poin 9)</strong> untuk mulai mengisi nilai.</p>
        </div>
      ) : (
        <div className="overflow-x-auto text-[11px]">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th rowSpan={2} className="border border-slate-300 px-2 py-1 text-center w-8">No</th>
                <th rowSpan={2} className="border border-slate-300 px-2 py-1 text-center w-24">NISN</th>
                <th rowSpan={2} className="border border-slate-300 px-3 py-1 w-40">Nama Peserta Didik</th>
                <th colSpan={3} className="border border-slate-300 px-1 py-1 text-center font-bold text-sky-900 bg-sky-50">Formatif (TP)</th>
                <th colSpan={3} className="border border-slate-300 px-1 py-1 text-center font-bold text-indigo-900 bg-indigo-50">Sumatif Lingkup Materi</th>
                <th rowSpan={2} className="border border-slate-300 px-1 py-1 text-center w-12 font-bold bg-amber-50">SAS</th>
                <th rowSpan={2} className="border border-slate-300 px-1 py-1 text-center w-12 font-extrabold bg-emerald-50 text-emerald-900">Nilai Akhir</th>
                <th rowSpan={2} className="border border-slate-300 px-3 py-1">Deskripsi Capaian Kompetensi (Rapor)</th>
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
                  <td className="border border-slate-300 px-1.5 py-1 text-center font-mono">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.nisn}
                        placeholder="NISN"
                        onChange={(e) => updateField(idx, { ...row, nisn: e.target.value }, false)}
                        className="w-full border rounded px-1 py-0.5 text-center text-[10px]"
                      />
                    ) : (
                      row.nisn || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-1 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.nama}
                        placeholder="Nama siswa"
                        onChange={(e) => updateField(idx, { ...row, nama: e.target.value }, false)}
                        className="w-full border rounded px-1.5 py-0.5 text-[11px]"
                      />
                    ) : (
                      row.nama || '-'
                    )}
                  </td>

                  {/* Formatif */}
                  {row.formatif.map((f, fIdx) => (
                    <td key={`f_${fIdx}`} className="border border-slate-300 px-1 py-1 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={f}
                          onChange={(e) => {
                            const nextF = [...row.formatif];
                            nextF[fIdx] = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                            updateField(idx, { ...row, formatif: nextF });
                          }}
                          className="w-9 border rounded text-center text-[10px]"
                        />
                      ) : (
                        f
                      )}
                    </td>
                  ))}

                  {/* Sumatif LM */}
                  {row.sumatifLingkupMateri.map((lm, lmIdx) => (
                    <td key={`lm_${lmIdx}`} className="border border-slate-300 px-1 py-1 text-center font-medium">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={lm}
                          onChange={(e) => {
                            const nextLm = [...row.sumatifLingkupMateri];
                            nextLm[lmIdx] = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                            updateField(idx, { ...row, sumatifLingkupMateri: nextLm });
                          }}
                          className="w-9 border rounded text-center text-[10px]"
                        />
                      ) : (
                        lm
                      )}
                    </td>
                  ))}

                  {/* SAS */}
                  <td className="border border-slate-300 px-1 py-1 text-center font-medium bg-amber-50/50 print:bg-transparent">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.sumatifAkhirSemester}
                        onChange={(e) =>
                          updateField(idx, {
                            ...row,
                            sumatifAkhirSemester: Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0))
                          })
                        }
                        className="w-9 border rounded text-center text-[10px]"
                      />
                    ) : (
                      row.sumatifAkhirSemester
                    )}
                  </td>

                  {/* Nilai Akhir */}
                  <td className="border border-slate-300 px-1 py-1 text-center font-extrabold text-emerald-800 bg-emerald-50 print:bg-transparent">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.nilaiAkhir}
                        onChange={(e) =>
                          updateField(idx, { ...row, nilaiAkhir: Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)) }, false)
                        }
                        className="w-9 border rounded text-center text-[10px] font-bold"
                      />
                    ) : (
                      row.nilaiAkhir
                    )}
                  </td>

                  {/* Capaian */}
                  <td className="border border-slate-300 px-2 py-1 text-[10px] text-slate-700 italic">
                    {isEditing ? (
                      <textarea
                        value={row.capaianKompetensi}
                        placeholder="Deskripsi capaian kompetensi..."
                        onChange={(e) => updateField(idx, { ...row, capaianKompetensi: e.target.value }, false)}
                        rows={1}
                        className="w-full border rounded p-1 text-[10px]"
                      />
                    ) : (
                      row.capaianKompetensi || '-'
                    )}
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
      )}

      <TandaTangan profile={profile} />
    </div>
  );
};
