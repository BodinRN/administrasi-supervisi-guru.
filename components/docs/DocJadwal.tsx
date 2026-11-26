'use client';

import React, { useState, useEffect } from 'react';
import { JadwalItem, SchoolProfile } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: JadwalItem[];
  profile: SchoolProfile;
  onSave: (data: JadwalItem[]) => void;
}

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const DocJadwal: React.FC<Props> = ({ data, profile, onSave }) => {
  const [items, setItems] = useState<JadwalItem[]>(data);
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
      { hari: 'Senin', jamKe: '', waktu: '', kelas: profile.grade || '', mataPelajaran: profile.subject || '', ruang: '' }
    ]);
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 6 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Jadwal Pelajaran / Tatap Muka</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Jadwal
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Jadwal
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
        docKey="jadwalPelajaran"
        onLoadExample={() => {
          setItems(exampleDocuments.jadwalPelajaran);
          onSave(exampleDocuments.jadwalPelajaran);
        }}
      />

      <KopSurat
        profile={profile}
        judulDokumen="JADWAL TATAP MUKA / MENGAJAR GURU"
        subJudul={`Nama Guru: ${profile.teacherName || '-'} (NIP. ${profile.teacherNip || '-'}) | Semester: ${profile.semester || '-'}`}
      />

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada jadwal mengajar yang diisi.</p>
          <p>Klik <strong>Tambah Jadwal</strong> untuk memasukkan jadwal tatap muka Anda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 px-3 py-2 text-center w-12">No</th>
                <th className="border border-slate-300 px-3 py-2 text-center w-28">Hari</th>
                <th className="border border-slate-300 px-3 py-2 text-center w-24">Jam Ke-</th>
                <th className="border border-slate-300 px-3 py-2 text-center w-36">Waktu</th>
                <th className="border border-slate-300 px-3 py-2 text-center w-24">Kelas</th>
                <th className="border border-slate-300 px-3 py-2">Mata Pelajaran</th>
                <th className="border border-slate-300 px-3 py-2 w-32">Ruang / Lab</th>
                {isEditing && <th className="no-print border border-slate-300 px-2 py-2 text-center w-12">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-300 px-2 py-2 font-semibold text-center">
                    {isEditing ? (
                      <select
                        value={row.hari}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], hari: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full text-center border rounded px-1 py-0.5 bg-white"
                      >
                        {HARI_OPTIONS.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    ) : (
                      row.hari
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.jamKe}
                        placeholder="1 - 2"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], jamKe: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full text-center border rounded px-1 py-0.5"
                      />
                    ) : (
                      row.jamKe || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-mono">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.waktu}
                        placeholder="07.30 - 08.50"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], waktu: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full text-center border rounded px-1 py-0.5"
                      />
                    ) : (
                      row.waktu || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-bold text-sky-800">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.kelas}
                        placeholder="VII-A"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], kelas: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full text-center border rounded px-1 py-0.5"
                      />
                    ) : (
                      row.kelas || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.mataPelajaran}
                        placeholder="Mata pelajaran"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], mataPelajaran: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full border rounded px-1.5 py-0.5"
                      />
                    ) : (
                      row.mataPelajaran || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.ruang}
                        placeholder="Ruang / Lab"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], ruang: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full border rounded px-1.5 py-0.5"
                      />
                    ) : (
                      row.ruang || '-'
                    )}
                  </td>
                  {isEditing && (
                    <td className="no-print border border-slate-300 px-2 py-2 text-center">
                      <button onClick={() => removeItem(idx)} className="text-rose-600 hover:text-rose-800">
                        <Trash2 className="w-4 h-4" />
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
