'use client';

import React, { useState, useEffect } from 'react';
import { SoalItem, SchoolProfile, AtpItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { TAKSONOMI_BLOOM } from '@/lib/references';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: SoalItem[];
  profile: SchoolProfile;
  atpList?: AtpItem[];
  onSave: (data: SoalItem[]) => void;
}

export const DocKisiKisiSoal: React.FC<Props> = ({ data, profile, atpList = [], onSave }) => {
  const [items, setItems] = useState<SoalItem[]>(data);
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
        tujuanPembelajaran: atpList[0]?.tujuanPembelajaran || '',
        materi: '',
        indikatorSoal: '',
        levelKognitif: 'C3',
        bentukSoal: 'Pilihan Ganda',
        nomorSoal: items.length + 1,
        butirSoal: '',
        kunciJawaban: '',
        skor: 10
      }
    ]);
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1, nomorSoal: i + 1 })));
  };

  const updateRow = (idx: number, field: keyof SoalItem, val: any) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: val };
    setItems(copy);
  };

  const totalSkor = items.reduce((acc, s) => acc + (s.skor || 0), 0);
  const hotsCount = items.filter((s) => ['C4', 'C5', 'C6'].includes(s.levelKognitif)).length;

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 11 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Kisi-kisi &amp; Butir Soal Penilaian</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Soal
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

      <ReferencePanel
        docKey="kisiKisiSoal"
        onLoadExample={() => {
          setItems(exampleDocuments.kisiKisiSoal);
          onSave(exampleDocuments.kisiKisiSoal);
        }}
        extraContent={
          <div className="space-y-1.5 text-[11px]">
            <p className="font-bold text-indigo-900">Referensi Level Kognitif (Taksonomi Bloom):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {TAKSONOMI_BLOOM.map((t) => (
                <div key={t.level} className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <strong className="text-sky-800">{t.level} ({t.nama}):</strong> {t.kko}
                </div>
              ))}
            </div>
          </div>
        }
      />

      <KopSurat
        profile={profile}
        judulDokumen="KISI-KISI, KARTU SOAL & KUNCI JAWABAN ASESMEN"
        subJudul={`Mata Pelajaran: ${profile.subject || '-'} | Fase/Kelas: ${profile.phase || '-'} - ${profile.grade || '-'}`}
      />

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada kisi-kisi dan butir soal.</p>
          <p>Klik <strong>Tambah Soal</strong> untuk mulai menyusun kisi-kisi, kartu soal, dan kunci jawaban.</p>
        </div>
      ) : (
        <>
          <div className="no-print mb-4 flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
            <span>Jumlah Soal: <strong>{items.length}</strong></span>
            <span>•</span>
            <span>Soal HOTS (C4–C6): <strong>{hotsCount}</strong> ({Math.round((hotsCount / items.length) * 100)}%)</span>
            <span>•</span>
            <span>Total Bobot Skor: <strong className={totalSkor === 100 ? 'text-emerald-700' : 'text-amber-700'}>{totalSkor}</strong></span>
          </div>

          {/* Bagian 1: Matriks Kisi-kisi */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-800 uppercase text-xs mb-2">A. Matriks Kisi-Kisi Asesmen</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                    <th className="border border-slate-300 px-2 py-2 w-44">Tujuan Pembelajaran</th>
                    <th className="border border-slate-300 px-2 py-2 w-32">Materi</th>
                    <th className="border border-slate-300 px-2 py-2">Indikator Soal</th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-16">Level</th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-28">Bentuk</th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-14">No Soal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-medium">{row.no}</td>
                      <td className="border border-slate-300 px-2 py-1.5">
                        {isEditing ? (
                          <textarea
                            value={row.tujuanPembelajaran}
                            placeholder="TP..."
                            onChange={(e) => updateRow(idx, 'tujuanPembelajaran', e.target.value)}
                            rows={2}
                            className="w-full border rounded p-1 text-[11px]"
                          />
                        ) : (
                          row.tujuanPembelajaran || '-'
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 font-medium">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.materi}
                            placeholder="Materi..."
                            onChange={(e) => updateRow(idx, 'materi', e.target.value)}
                            className="w-full border rounded px-1 py-0.5 text-[11px]"
                          />
                        ) : (
                          row.materi || '-'
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5">
                        {isEditing ? (
                          <textarea
                            value={row.indikatorSoal}
                            placeholder="Disajikan ..., peserta didik dapat ..."
                            onChange={(e) => updateRow(idx, 'indikatorSoal', e.target.value)}
                            rows={2}
                            className="w-full border rounded p-1 text-[11px]"
                          />
                        ) : (
                          row.indikatorSoal || '-'
                        )}
                      </td>
                      <td className="border border-slate-300 px-1.5 py-1.5 text-center font-bold text-sky-800">
                        {isEditing ? (
                          <select
                            value={row.levelKognitif}
                            onChange={(e) => updateRow(idx, 'levelKognitif', e.target.value)}
                            className="border rounded px-1 py-0.5 text-[11px] bg-white"
                          >
                            {['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].map((lvl) => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                        ) : (
                          row.levelKognitif
                        )}
                      </td>
                      <td className="border border-slate-300 px-1.5 py-1.5 text-center">
                        {isEditing ? (
                          <select
                            value={row.bentukSoal}
                            onChange={(e) => updateRow(idx, 'bentukSoal', e.target.value)}
                            className="border rounded px-1 py-0.5 text-[11px] bg-white w-full"
                          >
                            <option value="Pilihan Ganda">Pilihan Ganda</option>
                            <option value="Isian Singkat">Isian Singkat</option>
                            <option value="Uraian">Uraian</option>
                          </select>
                        ) : (
                          row.bentukSoal
                        )}
                      </td>
                      <td className="border border-slate-300 px-1.5 py-1.5 text-center font-bold">
                        {isEditing ? (
                          <input
                            type="number"
                            min={1}
                            value={row.nomorSoal}
                            onChange={(e) => updateRow(idx, 'nomorSoal', parseInt(e.target.value, 10) || 1)}
                            className="w-12 border rounded text-center py-0.5"
                          />
                        ) : (
                          row.nomorSoal
                        )}
                      </td>
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
                  <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-200 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-800 text-white font-bold rounded text-xs">
                        Soal No. {row.nomorSoal}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        Bentuk: {row.bentukSoal} | Level: {row.levelKognitif} |{' '}
                        {isEditing ? (
                          <span className="inline-flex items-center gap-1">
                            Bobot Skor:
                            <input
                              type="number"
                              min={0}
                              value={row.skor}
                              onChange={(e) => updateRow(idx, 'skor', parseInt(e.target.value, 10) || 0)}
                              className="w-12 border rounded text-center py-0.5"
                            />
                          </span>
                        ) : (
                          <>Bobot Skor: {row.skor}</>
                        )}
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
                          placeholder="Tuliskan naskah soal lengkap dengan opsi jawaban jika Pilihan Ganda..."
                          onChange={(e) => updateRow(idx, 'butirSoal', e.target.value)}
                          rows={3}
                          className="w-full border rounded p-1.5 text-xs mt-1"
                        />
                      ) : (
                        <p className="text-slate-900 mt-1 whitespace-pre-line font-serif text-sm">{row.butirSoal || '-'}</p>
                      )}
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded print:bg-transparent print:border-black">
                      <span className="font-bold text-emerald-900 block text-[11px]">Kunci Jawaban / Kriteria Penilaian:</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.kunciJawaban}
                          placeholder="Kunci jawaban atau rubrik penskoran..."
                          onChange={(e) => updateRow(idx, 'kunciJawaban', e.target.value)}
                          className="w-full border rounded px-1.5 py-0.5 text-xs mt-1"
                        />
                      ) : (
                        <span className="text-emerald-800 font-medium text-xs">{row.kunciJawaban || '-'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <TandaTangan profile={profile} />
    </div>
  );
};
