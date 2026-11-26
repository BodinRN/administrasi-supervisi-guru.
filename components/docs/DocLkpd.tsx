'use client';

import React, { useState, useEffect } from 'react';
import { LkpdData, SchoolProfile } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Edit2, Check, Printer, Plus, Trash2 } from 'lucide-react';

interface Props {
  data: LkpdData;
  profile: SchoolProfile;
  onSave: (data: LkpdData) => void;
}

export const DocLkpd: React.FC<Props> = ({ data, profile, onSave }) => {
  const [formData, setFormData] = useState<LkpdData>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const updateList = (
    key: 'tujuanAktivitas' | 'petunjukBelajar' | 'langkahKegiatan',
    idx: number,
    val: string
  ) => {
    const arr = [...(formData[key] || [])];
    arr[idx] = val;
    setFormData({ ...formData, [key]: arr });
  };

  const addList = (key: 'tujuanAktivitas' | 'petunjukBelajar' | 'langkahKegiatan') => {
    setFormData({ ...formData, [key]: [...(formData[key] || []), ''] });
  };

  const removeList = (key: 'tujuanAktivitas' | 'petunjukBelajar' | 'langkahKegiatan', idx: number) => {
    setFormData({ ...formData, [key]: (formData[key] || []).filter((_, i) => i !== idx) });
  };

  const totalBobot = (formData.pertanyaanTugas || []).reduce((acc, t) => acc + (t.bobot || 0), 0);

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 15 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Lembar Kerja Peserta Didik (LKPD)</h2>
        </div>
        <div className="flex items-center gap-2">
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
              <Edit2 className="w-3.5 h-3.5" /> Edit LKPD
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
        docKey="lkpd"
        onLoadExample={() => {
          setFormData(exampleDocuments.lkpd);
          onSave(exampleDocuments.lkpd);
        }}
      />

      <KopSurat
        profile={profile}
        judulDokumen="LEMBAR KERJA PESERTA DIDIK (LKPD)"
        subJudul={formData.judul || 'Judul Aktivitas / Lembar Kerja'}
      />

      <div className="space-y-5 text-xs md:text-sm">
        {isEditing && (
          <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-indigo-50/50 border border-indigo-200 rounded text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Judul LKPD</label>
              <input
                type="text"
                value={formData.judul}
                placeholder="Contoh: LKPD 1 — Eksplorasi ..."
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alokasi Waktu</label>
              <input
                type="text"
                value={formData.alokasiWaktu}
                placeholder="Contoh: 2 x 40 Menit (Kelompok)"
                onChange={(e) => setFormData({ ...formData, alokasiWaktu: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        )}

        {/* Identitas Kelompok / Siswa */}
        <div className="p-3 border-2 border-dashed border-slate-300 rounded bg-slate-50 print:bg-transparent print:border-black text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p>Kelompok / Nama : ................................................................</p>
              <p className="mt-1">Nama Anggota :</p>
              <ol className="list-decimal list-inside ml-2 space-y-0.5 text-slate-500 print:text-black">
                <li>...........................................................................</li>
                <li>...........................................................................</li>
                <li>...........................................................................</li>
                <li>...........................................................................</li>
              </ol>
            </div>
            <div className="space-y-1">
              <p>Kelas / Semester : <strong>{profile.grade || '-'} / {profile.semester || '-'}</strong></p>
              <p>Mata Pelajaran : <strong>{profile.subject || '-'}</strong></p>
              <p>Alokasi Waktu : <strong>{formData.alokasiWaktu || '-'}</strong></p>
            </div>
          </div>
        </div>

        {/* Tujuan Aktivitas */}
        <div className="border border-slate-300 rounded p-4 bg-white print:bg-transparent avoid-break text-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 uppercase">A. Tujuan Aktivitas Belajar</h3>
            {isEditing && (
              <button type="button" onClick={() => addList('tujuanAktivitas')} className="text-indigo-600 font-semibold text-[11px]">
                + Tambah Tujuan
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-1">
              {(formData.tujuanAktivitas || []).map((t, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={t}
                    placeholder={`Tujuan ${i + 1}`}
                    onChange={(e) => updateList('tujuanAktivitas', i, e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <button type="button" onClick={() => removeList('tujuanAktivitas', i)} className="text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {(formData.tujuanAktivitas || []).length === 0 ? <li className="list-none text-slate-400 italic">-</li> : formData.tujuanAktivitas.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
        </div>

        {/* Petunjuk Belajar */}
        <div className="border border-slate-300 rounded p-4 bg-white print:bg-transparent avoid-break text-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 uppercase">B. Petunjuk Pengerjaan</h3>
            {isEditing && (
              <button type="button" onClick={() => addList('petunjukBelajar')} className="text-indigo-600 font-semibold text-[11px]">
                + Tambah Petunjuk
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-1">
              {(formData.petunjukBelajar || []).map((p, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={p}
                    placeholder={`Petunjuk ${i + 1}`}
                    onChange={(e) => updateList('petunjukBelajar', i, e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <button type="button" onClick={() => removeList('petunjukBelajar', i)} className="text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {(formData.petunjukBelajar || []).length === 0 ? <li className="list-none text-slate-400 italic">-</li> : formData.petunjukBelajar.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          )}
        </div>

        {/* Stimulus Masalah */}
        <div className="border border-slate-300 rounded p-4 bg-sky-50/50 print:bg-transparent avoid-break text-xs">
          <h3 className="font-bold text-slate-900 uppercase mb-2">C. Paparan Kasus / Stimulus Masalah</h3>
          {isEditing ? (
            <textarea
              value={formData.stimulusMateri}
              placeholder="Tuliskan konteks permasalahan atau wacana pemantik diskusi siswa..."
              onChange={(e) => setFormData({ ...formData, stimulusMateri: e.target.value })}
              rows={4}
              className="w-full border rounded p-1.5 text-xs"
            />
          ) : (
            <p className="text-slate-800 whitespace-pre-line leading-relaxed">
              {formData.stimulusMateri || '-'}
            </p>
          )}
        </div>

        {/* Langkah Kegiatan */}
        <div className="border border-slate-300 rounded p-4 bg-white print:bg-transparent avoid-break text-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 uppercase">D. Langkah Kerja</h3>
            {isEditing && (
              <button type="button" onClick={() => addList('langkahKegiatan')} className="text-indigo-600 font-semibold text-[11px]">
                + Tambah Langkah
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-1">
              {(formData.langkahKegiatan || []).map((lk, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={lk}
                    placeholder={`Langkah ${i + 1}`}
                    onChange={(e) => updateList('langkahKegiatan', i, e.target.value)}
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <button type="button" onClick={() => removeList('langkahKegiatan', i)} className="text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
              {(formData.langkahKegiatan || []).length === 0 ? <li className="list-none text-slate-400 italic">-</li> : formData.langkahKegiatan.map((lk, i) => <li key={i} className="pl-1">{lk}</li>)}
            </ol>
          )}
        </div>

        {/* Pertanyaan Tugas */}
        <div className="border border-slate-300 rounded p-4 bg-white print:bg-transparent avoid-break text-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 uppercase">
              E. Tugas dan Pertanyaan Diskusi{' '}
              <span className="no-print text-[11px] font-normal text-slate-500">(Total Bobot: {totalBobot} Poin)</span>
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    pertanyaanTugas: [
                      ...(formData.pertanyaanTugas || []),
                      { no: (formData.pertanyaanTugas?.length || 0) + 1, pertanyaan: '', bobot: 25 }
                    ]
                  })
                }
                className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-[11px]"
              >
                <Plus className="w-3 h-3" /> Tambah Pertanyaan
              </button>
            )}
          </div>
          {(formData.pertanyaanTugas || []).length === 0 ? (
            <p className="text-slate-400 italic">Belum ada pertanyaan tugas.</p>
          ) : (
            <div className="space-y-4 mt-3">
              {formData.pertanyaanTugas.map((t, i) => (
                <div key={i} className="space-y-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{t.no}.</span>
                      <input
                        type="text"
                        value={t.pertanyaan}
                        placeholder="Tuliskan pertanyaan..."
                        onChange={(e) => {
                          const copy = [...formData.pertanyaanTugas];
                          copy[i] = { ...copy[i], pertanyaan: e.target.value };
                          setFormData({ ...formData, pertanyaanTugas: copy });
                        }}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <input
                        type="number"
                        min={0}
                        value={t.bobot}
                        onChange={(e) => {
                          const copy = [...formData.pertanyaanTugas];
                          copy[i] = { ...copy[i], bobot: parseInt(e.target.value, 10) || 0 };
                          setFormData({ ...formData, pertanyaanTugas: copy });
                        }}
                        className="w-16 border rounded px-1 py-1 text-center"
                      />
                      <span className="text-[10px]">poin</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            pertanyaanTugas: formData.pertanyaanTugas
                              .filter((_, k) => k !== i)
                              .map((q, k) => ({ ...q, no: k + 1 }))
                          })
                        }
                        className="text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-800">
                        {t.no}. {t.pertanyaan} <span className="text-slate-500 font-normal">(Bobot: {t.bobot} Poin)</span>
                      </p>
                      <div className="border border-dashed border-slate-300 rounded p-3 h-20 bg-slate-50 print:bg-transparent print:border-black">
                        <span className="text-[10px] text-slate-400 italic print:hidden">Ruang Jawaban Peserta Didik:</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rubrik Penilaian LKPD */}
        <div className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break text-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 uppercase">F. Rubrik Penilaian Unjuk Kerja LKPD</h3>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    rubrikPenilaian: [
                      ...(formData.rubrikPenilaian || []),
                      { kriteria: '', skor4: '', skor3: '', skor2: '', skor1: '' }
                    ]
                  })
                }
                className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-[11px]"
              >
                <Plus className="w-3 h-3" /> Tambah Kriteria
              </button>
            )}
          </div>
          {(formData.rubrikPenilaian || []).length === 0 ? (
            <p className="text-slate-400 italic">Belum ada rubrik penilaian.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-slate-200 text-slate-800">
                  <th className="border border-slate-300 px-2 py-1.5 w-32">Kriteria</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 4 (Sangat Baik)</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 3 (Baik)</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 2 (Cukup)</th>
                  <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 1 (Kurang)</th>
                  {isEditing && <th className="no-print border border-slate-300 px-1 py-1.5 w-8"></th>}
                </tr>
              </thead>
              <tbody>
                {formData.rubrikPenilaian.map((rubrik, idx) => (
                  <tr key={idx}>
                    {(['kriteria', 'skor4', 'skor3', 'skor2', 'skor1'] as const).map((f) => (
                      <td key={f} className={`border border-slate-300 px-2 py-1.5 ${f === 'kriteria' ? 'font-bold' : 'text-slate-700'}`}>
                        {isEditing ? (
                          <textarea
                            value={rubrik[f]}
                            onChange={(e) => {
                              const copy = [...formData.rubrikPenilaian];
                              copy[idx] = { ...copy[idx], [f]: e.target.value };
                              setFormData({ ...formData, rubrikPenilaian: copy });
                            }}
                            rows={2}
                            className="w-full border rounded p-1 text-[11px]"
                          />
                        ) : (
                          rubrik[f] || '-'
                        )}
                      </td>
                    ))}
                    {isEditing && (
                      <td className="no-print border border-slate-300 px-1 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              rubrikPenilaian: formData.rubrikPenilaian.filter((_, k) => k !== idx)
                            })
                          }
                          className="text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
