'use client';

import React, { useState, useEffect } from 'react';
import { ProtaItem, SchoolProfile, AlokasiWaktuData, AtpItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer, Link2 } from 'lucide-react';

interface Props {
  data: ProtaItem[];
  profile: SchoolProfile;
  alokasiWaktu?: AlokasiWaktuData;
  atpList?: AtpItem[];
  onSave: (data: ProtaItem[]) => void;
}

export const DocProta: React.FC<Props> = ({ data, profile, alokasiWaktu, atpList = [], onSave }) => {
  const [items, setItems] = useState<ProtaItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const totalJPGanjil = items.filter(i => i.semester === 'Ganjil').reduce((acc, curr) => acc + (curr.alokasiWaktuJP || 0), 0);
  const totalJPGenap = items.filter(i => i.semester === 'Genap').reduce((acc, curr) => acc + (curr.alokasiWaktuJP || 0), 0);
  const totalJPTahun = totalJPGanjil + totalJPGenap;

  const jpPerMinggu = alokasiWaktu?.jamPelajaranPerMinggu || 0;
  const efektifGanjilJP = (alokasiWaktu?.semesterGanjil?.reduce((a, b) => a + (b.mingguEfektif || 0), 0) || 0) * jpPerMinggu;
  const efektifGenapJP = (alokasiWaktu?.semesterGenap?.reduce((a, b) => a + (b.mingguEfektif || 0), 0) || 0) * jpPerMinggu;

  const handleSave = () => {
    onSave(items);
    setIsEditing(false);
  };

  const addItem = () => {
    const newItem: ProtaItem = {
      no: items.length + 1,
      elemen: '',
      capaianPembelajaran: '',
      tujuanPembelajaran: '',
      materiPokok: '',
      alokasiWaktuJP: 4,
      semester: profile.semester === 'Genap' ? 'Genap' : 'Ganjil'
    };
    setItems([...items, newItem]);
    setIsEditing(true);
  };

  const pullFromAtp = () => {
    if (atpList.length === 0) {
      alert('Data ATP (Poin 4) masih kosong. Silakan isi ATP terlebih dahulu atau tambah baris PROTA secara manual.');
      return;
    }
    const mapped: ProtaItem[] = atpList.map((a, idx) => ({
      no: idx + 1,
      elemen: a.elemen,
      capaianPembelajaran: a.capaianPembelajaran,
      tujuanPembelajaran: a.tujuanPembelajaran,
      materiPokok: a.kataKunciMateri,
      alokasiWaktuJP: a.alokasiWaktuJP,
      semester: profile.semester === 'Genap' ? 'Genap' : 'Ganjil'
    }));
    setItems(mapped);
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx).map((item, i) => ({ ...item, no: i + 1 }));
    setItems(updated);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 2 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Program Tahunan (PROTA)</h2>
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Data
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
        docKey="prota"
        onLoadExample={() => {
          setItems(exampleDocuments.prota);
          onSave(exampleDocuments.prota);
        }}
        extraContent={
          <div className="text-[11px] flex flex-wrap items-center gap-4">
            <span>
              <strong>Acuan Poin 1 (Alokasi Waktu):</strong> Ganjil = <strong>{efektifGanjilJP} JP</strong>, Genap = <strong>{efektifGenapJP} JP</strong>
            </span>
            <span>
              <strong>Terjadwal di PROTA:</strong> Ganjil = <strong>{totalJPGanjil} JP</strong>, Genap = <strong>{totalJPGenap} JP</strong>
            </span>
          </div>
        }
      />

      <KopSurat
        profile={profile}
        judulDokumen="PROGRAM TAHUNAN (PROTA)"
        subJudul={`Kurikulum Merdeka | Mata Pelajaran: ${profile.subject || '-'}`}
      />

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada data Program Tahunan (PROTA).</p>
          <p>Klik <strong>Tambah Baris</strong> untuk menyusun elemen &amp; alokasi JP Anda, atau gunakan <strong>Muat Contoh Referensi</strong> di panel panduan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 px-2 py-2 text-center w-10">No</th>
                <th className="border border-slate-300 px-3 py-2 w-32">Elemen CP</th>
                <th className="border border-slate-300 px-3 py-2">Capaian Pembelajaran (CP)</th>
                <th className="border border-slate-300 px-3 py-2">Tujuan Pembelajaran (TP)</th>
                <th className="border border-slate-300 px-3 py-2 w-40">Materi Pokok</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-16">Alokasi (JP)</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-20">Semester</th>
                {isEditing && <th className="no-print border border-slate-300 px-2 py-2 text-center w-12">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-2 text-center font-medium">{item.no}</td>
                  <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.elemen}
                        placeholder="Elemen"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], elemen: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full border rounded px-1.5 py-0.5"
                      />
                    ) : (
                      item.elemen || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">
                    {isEditing ? (
                      <textarea
                        value={item.capaianPembelajaran}
                        placeholder="Rumusan CP dari BSKAP..."
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], capaianPembelajaran: e.target.value };
                          setItems(copy);
                        }}
                        rows={2}
                        className="w-full border rounded px-1.5 py-0.5"
                      />
                    ) : (
                      item.capaianPembelajaran || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {isEditing ? (
                      <textarea
                        value={item.tujuanPembelajaran}
                        placeholder="Tujuan Pembelajaran..."
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], tujuanPembelajaran: e.target.value };
                          setItems(copy);
                        }}
                        rows={2}
                        className="w-full border rounded px-1.5 py-0.5"
                      />
                    ) : (
                      item.tujuanPembelajaran || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.materiPokok}
                        placeholder="Materi Pokok"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], materiPokok: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full border rounded px-1.5 py-0.5"
                      />
                    ) : (
                      item.materiPokok || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-bold text-sky-800">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={item.alokasiWaktuJP}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], alokasiWaktuJP: parseInt(e.target.value, 10) || 0 };
                          setItems(copy);
                        }}
                        className="w-14 border rounded px-1 text-center"
                      />
                    ) : (
                      `${item.alokasiWaktuJP} JP`
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center">
                    {isEditing ? (
                      <select
                        value={item.semester}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], semester: e.target.value as 'Ganjil' | 'Genap' };
                          setItems(copy);
                        }}
                        className="border rounded px-1 text-xs"
                      >
                        <option value="Ganjil">Ganjil</option>
                        <option value="Genap">Genap</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${item.semester === 'Ganjil' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'} print:bg-transparent print:text-black`}>
                        {item.semester}
                      </span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="no-print border border-slate-300 px-2 py-2 text-center">
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold text-slate-900">
                <td colSpan={5} className="border border-slate-300 px-3 py-2 text-right">
                  TOTAL ALOKASI WAKTU 1 TAHUN AJARAN:
                </td>
                <td className="border border-slate-300 px-2 py-2 text-center text-sky-900 font-extrabold">
                  {totalJPTahun} JP
                </td>
                <td colSpan={isEditing ? 2 : 1} className="border border-slate-300 px-2 py-2 text-center text-[10px] text-slate-600">
                  (Ganjil: {totalJPGanjil} JP | Genap: {totalJPGenap} JP)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <TandaTangan profile={profile} />
    </div>
  );
};
