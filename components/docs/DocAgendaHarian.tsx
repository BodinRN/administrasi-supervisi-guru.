'use client';

import React, { useState, useEffect } from 'react';
import { AgendaHarianItem, SchoolProfile, AtpItem, JadwalItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: AgendaHarianItem[];
  profile: SchoolProfile;
  atpList?: AtpItem[];
  jadwalList?: JadwalItem[];
  onSave: (data: AgendaHarianItem[]) => void;
}

export const DocAgendaHarian: React.FC<Props> = ({
  data,
  profile,
  atpList = [],
  jadwalList = [],
  onSave
}) => {
  const [items, setItems] = useState<AgendaHarianItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleSave = () => {
    onSave(items);
    setIsEditing(false);
  };

  const addItem = () => {
    const firstJadwal = jadwalList[0];
    setItems([
      ...items,
      {
        id: `JH-${Date.now().toString().slice(-4)}`,
        hariTanggal: '',
        jamKe: firstJadwal?.jamKe || '',
        kelas: firstJadwal?.kelas || profile.grade || '',
        tujuanPembelajaran: atpList[0]?.tujuanPembelajaran || '',
        materiDanKegiatan: '',
        kehadiranSiswa: '',
        catatanRefleksi: '',
        tandaTanganStatus: true
      }
    ]);
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, field: keyof AgendaHarianItem, value: any) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: value };
    setItems(copy);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 7 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Agenda Harian / Jurnal Mengajar Guru</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Jurnal
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Jurnal
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
        docKey="agendaHarian"
        onLoadExample={() => {
          setItems(exampleDocuments.agendaHarian);
          onSave(exampleDocuments.agendaHarian);
        }}
      />

      <KopSurat
        profile={profile}
        judulDokumen="JURNAL MENGAJAR HARIAN / AGENDA GURU"
        subJudul={`Mata Pelajaran: ${profile.subject || '-'} | Tahun Ajaran: ${profile.academicYear || '-'} | Semester: ${profile.semester || '-'}`}
      />

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada catatan Jurnal Mengajar Harian.</p>
          <p>Klik <strong>Tambah Jurnal</strong> untuk mencatat pelaksanaan pembelajaran tiap pertemuan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                <th className="border border-slate-300 px-2 py-2 w-28 text-center">Hari / Tanggal</th>
                <th className="border border-slate-300 px-2 py-2 w-24 text-center">Jam / Kelas</th>
                <th className="border border-slate-300 px-3 py-2 w-44">Tujuan Pembelajaran</th>
                <th className="border border-slate-300 px-3 py-2">Materi &amp; Aktivitas Pembelajaran</th>
                <th className="border border-slate-300 px-2 py-2 w-32 text-center">Presensi Siswa</th>
                <th className="border border-slate-300 px-3 py-2 w-40">Catatan Refleksi / Kendala</th>
                <th className="border border-slate-300 px-1 py-2 w-12 text-center">Paraf</th>
                {isEditing && <th className="no-print border border-slate-300 px-1 py-2 text-center w-10">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-1 py-2 text-center font-medium">{idx + 1}</td>
                  <td className="border border-slate-300 px-2 py-2 font-medium text-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.hariTanggal}
                        placeholder="Senin, 20 Jul 2026"
                        onChange={(e) => updateRow(idx, 'hariTanggal', e.target.value)}
                        className="w-full border rounded px-1 py-0.5 text-[11px]"
                      />
                    ) : (
                      row.hariTanggal || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-1.5 py-2 text-center">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={row.kelas}
                          placeholder="Kelas"
                          onChange={(e) => updateRow(idx, 'kelas', e.target.value)}
                          className="w-full border rounded px-1 py-0.5 text-[11px] text-center font-bold"
                        />
                        <input
                          type="text"
                          value={row.jamKe}
                          placeholder="Jam ke-"
                          onChange={(e) => updateRow(idx, 'jamKe', e.target.value)}
                          className="w-full border rounded px-1 py-0.5 text-[10px] text-center"
                        />
                      </div>
                    ) : (
                      <>
                        <span className="block font-bold text-sky-800">{row.kelas || '-'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Jam {row.jamKe || '-'}</span>
                      </>
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 font-semibold text-slate-800">
                    {isEditing ? (
                      <>
                        <textarea
                          value={row.tujuanPembelajaran}
                          placeholder="TP yang dilaksanakan..."
                          onChange={(e) => updateRow(idx, 'tujuanPembelajaran', e.target.value)}
                          rows={2}
                          className="w-full border rounded p-1 text-[11px]"
                        />
                        {atpList.length > 0 && (
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) updateRow(idx, 'tujuanPembelajaran', e.target.value);
                            }}
                            className="w-full border rounded px-1 py-0.5 text-[10px] mt-1 bg-amber-50 text-amber-900"
                          >
                            <option value="">-- Pilih dari ATP --</option>
                            {atpList.map((a, aIdx) => (
                              <option key={aIdx} value={a.tujuanPembelajaran}>
                                {a.tujuanPembelajaran.slice(0, 60)}
                              </option>
                            ))}
                          </select>
                        )}
                      </>
                    ) : (
                      row.tujuanPembelajaran || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2">
                    {isEditing ? (
                      <textarea
                        value={row.materiDanKegiatan}
                        placeholder="Uraian materi & aktivitas kelas..."
                        onChange={(e) => updateRow(idx, 'materiDanKegiatan', e.target.value)}
                        rows={2}
                        className="w-full border rounded p-1 text-[11px]"
                      />
                    ) : (
                      row.materiDanKegiatan || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-[10px] bg-slate-50 print:bg-transparent">
                    {isEditing ? (
                      <textarea
                        value={row.kehadiranSiswa}
                        placeholder="Hadir: 30, S: 1, I: 0, A: 0"
                        onChange={(e) => updateRow(idx, 'kehadiranSiswa', e.target.value)}
                        rows={2}
                        className="w-full border rounded p-1 text-[10px]"
                      />
                    ) : (
                      row.kehadiranSiswa || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 italic text-slate-600">
                    {isEditing ? (
                      <textarea
                        value={row.catatanRefleksi}
                        placeholder="Catatan kendala & refleksi..."
                        onChange={(e) => updateRow(idx, 'catatanRefleksi', e.target.value)}
                        rows={2}
                        className="w-full border rounded p-1 text-[11px]"
                      />
                    ) : (
                      row.catatanRefleksi || '-'
                    )}
                  </td>
                  <td className="border border-slate-300 px-1 py-2 text-center font-bold text-emerald-700">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={row.tandaTanganStatus}
                        onChange={(e) => updateRow(idx, 'tandaTanganStatus', e.target.checked)}
                      />
                    ) : row.tandaTanganStatus ? (
                      '✓'
                    ) : (
                      '-'
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
