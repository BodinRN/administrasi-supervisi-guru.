'use client';

import React, { useState, useEffect } from 'react';
import { RemedialItem, SchoolProfile, NilaiSiswaItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer, Link2 } from 'lucide-react';

interface Props {
  data: RemedialItem[];
  profile: SchoolProfile;
  daftarNilaiList?: NilaiSiswaItem[];
  onSave: (data: RemedialItem[]) => void;
}

export const DocRemedial: React.FC<Props> = ({ data, profile, daftarNilaiList = [], onSave }) => {
  const [items, setItems] = useState<RemedialItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [batasTuntas, setBatasTuntas] = useState<number>(70);

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
        namaSiswa: '',
        nisn: '',
        tpBelumTuntas: '',
        nilaiAwal: 0,
        bentukBimbingan: '',
        nilaiAkhirRemedial: 0,
        status: 'Belum Tuntas',
        keterangan: ''
      }
    ]);
    setIsEditing(true);
  };

  const pullFromNilai = () => {
    const candidates = daftarNilaiList.filter((s) => (s.nilaiAkhir || 0) < batasTuntas);
    if (candidates.length === 0) {
      alert(`Tidak ada siswa dengan Nilai Akhir < ${batasTuntas} di Buku Daftar Nilai.`);
      return;
    }
    setItems(
      candidates.map((s, idx) => ({
        no: idx + 1,
        namaSiswa: s.nama,
        nisn: s.nisn,
        tpBelumTuntas: s.capaianKompetensi || 'TP belum mencapai kriteria ketuntasan',
        nilaiAwal: s.nilaiAkhir,
        bentukBimbingan: 'Bimbingan individu / tutor sebaya dan latihan ulang',
        nilaiAkhirRemedial: s.nilaiAkhir,
        status: 'Belum Tuntas',
        keterangan: ''
      }))
    );
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 })));
  };

  const updateRow = (idx: number, field: keyof RemedialItem, val: any) => {
    const copy = [...items];
    const next = { ...copy[idx], [field]: val };
    if (field === 'nilaiAkhirRemedial') {
      next.status = Number(val) >= batasTuntas ? 'Tuntas' : 'Belum Tuntas';
    }
    copy[idx] = next;
    setItems(copy);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 13 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Program &amp; Kartu Pelaksanaan Remedial</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {daftarNilaiList.length > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-2 py-1 text-xs">
              <span className="text-amber-900">&lt;</span>
              <input
                type="number"
                min={0}
                max={100}
                value={batasTuntas}
                onChange={(e) => setBatasTuntas(parseInt(e.target.value, 10) || 70)}
                className="w-12 border rounded text-center py-0.5 bg-white"
              />
              <button
                type="button"
                onClick={pullFromNilai}
                className="flex items-center gap-1 text-amber-800 font-semibold hover:underline ml-1"
              >
                <Link2 className="w-3.5 h-3.5" /> Tarik dari Nilai
              </button>
            </div>
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Remedial
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
        docKey="programRemedial"
        onLoadExample={() => {
          setItems(exampleDocuments.programRemedial);
          onSave(exampleDocuments.programRemedial);
        }}
      />

      <KopSurat
        profile={profile}
        judulDokumen="PROGRAM DAN LAPORAN PELAKSANAAN REMEDIAL"
        subJudul={`Mata Pelajaran: ${profile.subject || '-'} | Kelas: ${profile.grade || '-'} | Semester: ${profile.semester || '-'}`}
      />

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada data pelaksanaan remedial.</p>
          <p>Klik <strong>Tambah Siswa</strong> atau <strong>Tarik dari Nilai</strong> untuk mendata siswa yang memerlukan remedial.</p>
        </div>
      ) : (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                <th className="border border-slate-300 px-2 py-2 w-36">Nama Siswa</th>
                <th className="border border-slate-300 px-2 py-2">Indikator / TP Belum Tuntas</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-16 text-rose-800 font-bold">Nilai Awal</th>
                <th className="border border-slate-300 px-2 py-2">Bentuk Bimbingan / Remedial</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-16 text-emerald-800 font-bold">Nilai Akhir</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-24">Status</th>
                <th className="border border-slate-300 px-2 py-2 w-32">Keterangan</th>
                {isEditing && <th className="no-print border border-slate-300 px-1 py-2 text-center w-8">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-2 text-center font-medium">{row.no}</td>
                  <td className="border border-slate-300 px-2 py-2 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.namaSiswa}
                        placeholder="Nama siswa"
                        onChange={(e) => updateRow(idx, 'namaSiswa', e.target.value)}
                        className="w-full border rounded px-1 py-0.5 text-xs"
                      />
                    ) : (
                      row.namaSiswa || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    {isEditing ? (
                      <textarea
                        value={row.tpBelumTuntas}
                        placeholder="TP belum tuntas..."
                        onChange={(e) => updateRow(idx, 'tpBelumTuntas', e.target.value)}
                        rows={2}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      row.tpBelumTuntas || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-1.5 py-2 text-center font-bold text-rose-700 bg-rose-50 print:bg-transparent">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.nilaiAwal}
                        onChange={(e) => updateRow(idx, 'nilaiAwal', parseInt(e.target.value, 10) || 0)}
                        className="w-12 border rounded text-center py-0.5 bg-white"
                      />
                    ) : (
                      row.nilaiAwal
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    {isEditing ? (
                      <textarea
                        value={row.bentukBimbingan}
                        placeholder="Bentuk intervensi remedial..."
                        onChange={(e) => updateRow(idx, 'bentukBimbingan', e.target.value)}
                        rows={2}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      row.bentukBimbingan || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-1.5 py-2 text-center font-bold text-emerald-700 bg-emerald-50 print:bg-transparent">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.nilaiAkhirRemedial}
                        onChange={(e) => updateRow(idx, 'nilaiAkhirRemedial', parseInt(e.target.value, 10) || 0)}
                        className="w-12 border rounded text-center py-0.5 bg-white"
                      />
                    ) : (
                      row.nilaiAkhirRemedial
                    )}
                  </td>
                  <td className="border border-slate-300 px-1.5 py-2 text-center font-bold">
                    {isEditing ? (
                      <select
                        value={row.status}
                        onChange={(e) => updateRow(idx, 'status', e.target.value)}
                        className="border rounded px-1 py-0.5 text-[11px] bg-white"
                      >
                        <option value="Tuntas">Tuntas</option>
                        <option value="Belum Tuntas">Belum Tuntas</option>
                      </select>
                    ) : (
                      <span className={row.status === 'Tuntas' ? 'text-emerald-800' : 'text-rose-700'}>
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-[11px] text-slate-600">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.keterangan}
                        placeholder="Keterangan..."
                        onChange={(e) => updateRow(idx, 'keterangan', e.target.value)}
                        className="w-full border rounded px-1 py-0.5"
                      />
                    ) : (
                      row.keterangan || '-'
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

      <TandaTangan profile={profile} />
    </div>
  );
};
