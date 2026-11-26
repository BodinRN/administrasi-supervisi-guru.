'use client';

import React, { useState, useEffect } from 'react';
import { ModulAjarData, SchoolProfile, AtpItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { PROFIL_PELAJAR_PANCASILA, MODEL_PEMBELAJARAN_LIST } from '@/lib/references';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Edit2, Check, Printer, Plus, Trash2, Link2 } from 'lucide-react';

interface Props {
  data: ModulAjarData;
  profile: SchoolProfile;
  atpList?: AtpItem[];
  onSave: (data: ModulAjarData) => void;
}

export const DocModulAjar: React.FC<Props> = ({ data, profile, atpList = [], onSave }) => {
  const [modul, setModul] = useState<ModulAjarData>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setModul(data);
  }, [data]);

  const handleSave = () => {
    onSave(modul);
    setIsEditing(false);
  };

  const pullFromAtp = () => {
    if (atpList.length === 0) {
      alert('Data ATP (Poin 4) masih kosong.');
      return;
    }
    const tpAll = atpList.map((a) => a.tujuanPembelajaran).filter(Boolean);
    const p3All = Array.from(new Set(atpList.flatMap((a) => a.profilPelajarPancasila || [])));
    setModul({
      ...modul,
      fase: modul.fase || profile.phase,
      elemen: modul.elemen || atpList.map((a) => a.elemen).filter(Boolean).join(', '),
      tujuanPembelajaran: tpAll.length > 0 ? tpAll : modul.tujuanPembelajaran,
      profilPelajarPancasila: p3All.length > 0 ? p3All : modul.profilPelajarPancasila
    });
    setIsEditing(true);
  };

  const updateListField = (
    field: 'tujuanPembelajaran' | 'pertanyaanPemantik' | 'refleksiGuru' | 'refleksiSiswa',
    idx: number,
    value: string
  ) => {
    const arr = [...(modul[field] || [])];
    arr[idx] = value;
    setModul({ ...modul, [field]: arr });
  };

  const addListField = (
    field: 'tujuanPembelajaran' | 'pertanyaanPemantik' | 'refleksiGuru' | 'refleksiSiswa'
  ) => {
    setModul({ ...modul, [field]: [...(modul[field] || []), ''] });
  };

  const removeListField = (
    field: 'tujuanPembelajaran' | 'pertanyaanPemantik' | 'refleksiGuru' | 'refleksiSiswa',
    idx: number
  ) => {
    setModul({ ...modul, [field]: (modul[field] || []).filter((_, i) => i !== idx) });
  };

  const toggleP3 = (dim: string) => {
    const current = modul.profilPelajarPancasila || [];
    setModul({
      ...modul,
      profilPelajarPancasila: current.includes(dim)
        ? current.filter((d) => d !== dim)
        : [...current, dim]
    });
  };

  const addPertemuan = () => {
    setModul({
      ...modul,
      kegiatanPembelajaran: [
        ...(modul.kegiatanPembelajaran || []),
        {
          pertemuanKe: (modul.kegiatanPembelajaran?.length || 0) + 1,
          alokasiMenit: 80,
          pendahuluan: ['Salam, doa, presensi, apersepsi, dan penyampaian tujuan pembelajaran.'],
          inti: [''],
          penutup: ['Simpulan, refleksi singkat, dan doa penutup.']
        }
      ]
    });
  };

  const updateMeetingList = (
    kIdx: number,
    phaseKey: 'pendahuluan' | 'inti' | 'penutup',
    itemIdx: number,
    val: string
  ) => {
    const kps = [...modul.kegiatanPembelajaran];
    const lines = [...kps[kIdx][phaseKey]];
    lines[itemIdx] = val;
    kps[kIdx] = { ...kps[kIdx], [phaseKey]: lines };
    setModul({ ...modul, kegiatanPembelajaran: kps });
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 5 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Modul Ajar / RPP Kurikulum Merdeka</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {atpList.length > 0 && (
            <button
              type="button"
              onClick={pullFromAtp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-medium transition"
            >
              <Link2 className="w-3.5 h-3.5" /> Tarik TP &amp; P3 dari ATP
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Modul
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
        docKey="modulAjar"
        onLoadExample={() => {
          setModul(exampleDocuments.modulAjar);
          onSave(exampleDocuments.modulAjar);
        }}
        extraContent={
          <div className="space-y-1.5 text-[11px]">
            <p className="font-bold text-indigo-900">Referensi Sintaks Model Pembelajaran:</p>
            {MODEL_PEMBELAJARAN_LIST.map((m) => (
              <div key={m.nama} className="bg-slate-50 px-2 py-1 rounded border border-slate-200">
                <strong className="text-sky-800">{m.nama}:</strong> {m.sintaks}
              </div>
            ))}
          </div>
        }
      />

      <KopSurat
        profile={profile}
        judulDokumen="MODUL AJAR KURIKULUM MERDEKA"
        subJudul={modul.judulModul || 'Judul / Topik Modul Ajar'}
        nomorDokumen={modul.id}
      />

      <div className="space-y-6 text-xs md:text-sm">
        {/* I. INFORMASI UMUM */}
        <section className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 text-sm uppercase">
            I. Informasi Umum
          </h3>

          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-xs">
              <div className="md:col-span-2">
                <label className="font-semibold text-slate-600 block mb-0.5">Judul Modul Ajar</label>
                <input
                  type="text"
                  value={modul.judulModul}
                  placeholder="Contoh: Modul Ajar Bab 1 ..."
                  onChange={(e) => setModul({ ...modul, judulModul: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-0.5">Kode / Nomor Modul</label>
                <input
                  type="text"
                  value={modul.id}
                  onChange={(e) => setModul({ ...modul, id: e.target.value })}
                  className="w-full border rounded px-2 py-1 font-mono"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div className="space-y-1">
              <p className="text-slate-600">Penyusun / Guru: <strong className="text-slate-900">{profile.teacherName || '-'}</strong></p>
              <p className="text-slate-600">Satuan Pendidikan: <strong className="text-slate-900">{profile.schoolName || '-'}</strong></p>
              <p className="text-slate-600">Tahun Penyusunan: <strong className="text-slate-900">{profile.academicYear || '-'}</strong></p>
              <p className="text-slate-600">Jenjang / Fase / Kelas: <strong className="text-slate-900">{profile.phase || modul.fase || '-'} / {profile.grade || '-'}</strong></p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-600">Mata Pelajaran: <strong className="text-slate-900">{profile.subject || '-'}</strong></p>
              <p className="text-slate-600">
                Elemen / Domain:{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={modul.elemen}
                    placeholder="Elemen materi..."
                    onChange={(e) => setModul({ ...modul, elemen: e.target.value })}
                    className="border rounded px-1.5 py-0.5 ml-1 w-56"
                  />
                ) : (
                  <strong className="text-slate-900">{modul.elemen || '-'}</strong>
                )}
              </p>
              <p className="text-slate-600">
                Alokasi Waktu:{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={modul.alokasiWaktu}
                    placeholder="Contoh: 2 Pertemuan (4 JP x 40 Menit)"
                    onChange={(e) => setModul({ ...modul, alokasiWaktu: e.target.value })}
                    className="border rounded px-1.5 py-0.5 ml-1 w-56"
                  />
                ) : (
                  <strong className="text-slate-900">{modul.alokasiWaktu || '-'}</strong>
                )}
              </p>
              <p className="text-slate-600">
                Model Pembelajaran:{' '}
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      list="model-pembelajaran-list"
                      value={modul.modelPembelajaran}
                      placeholder="Contoh: Problem Based Learning (PBL)"
                      onChange={(e) => setModul({ ...modul, modelPembelajaran: e.target.value })}
                      className="border rounded px-1.5 py-0.5 ml-1 w-56"
                    />
                    <datalist id="model-pembelajaran-list">
                      {MODEL_PEMBELAJARAN_LIST.map((m) => (
                        <option key={m.nama} value={m.nama} />
                      ))}
                    </datalist>
                  </>
                ) : (
                  <strong className="text-slate-900">{modul.modelPembelajaran || '-'}</strong>
                )}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-xs">
            <div>
              <strong className="text-slate-800">Kompetensi Awal:</strong>
              {isEditing ? (
                <textarea
                  value={modul.kompetensiAwal}
                  placeholder="Pengetahuan/keterampilan prasyarat sebelum mempelajari materi ini..."
                  onChange={(e) => setModul({ ...modul, kompetensiAwal: e.target.value })}
                  rows={2}
                  className="w-full border rounded p-1.5 text-xs mt-1"
                />
              ) : (
                <p className="text-slate-700 mt-0.5">{modul.kompetensiAwal || '-'}</p>
              )}
            </div>

            <div>
              <strong className="text-slate-800">Profil Pelajar Pancasila:</strong>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-1 bg-white p-2 rounded border">
                  {PROFIL_PELAJAR_PANCASILA.map((dim) => (
                    <label key={dim} className="inline-flex items-center gap-1.5 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(modul.profilPelajarPancasila || []).includes(dim)}
                        onChange={() => toggleP3(dim)}
                      />
                      <span>{dim}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {modul.profilPelajarPancasila.length === 0 ? (
                    <span className="text-slate-400 italic">-</span>
                  ) : (
                    modul.profilPelajarPancasila.map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium text-[11px] print:border print:border-black">
                        {p}
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <strong className="text-slate-800">Sarana dan Prasarana:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={modul.saranaPrasarana}
                  placeholder="Media, alat, bahan ajar, sumber belajar..."
                  onChange={(e) => setModul({ ...modul, saranaPrasarana: e.target.value })}
                  className="w-full border rounded p-1.5 text-xs mt-1"
                />
              ) : (
                <p className="text-slate-700 mt-0.5">{modul.saranaPrasarana || '-'}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <strong className="text-slate-800">Target Peserta Didik:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={modul.targetPesertaDidik}
                    placeholder="Contoh: Peserta didik reguler / tipikal"
                    onChange={(e) => setModul({ ...modul, targetPesertaDidik: e.target.value })}
                    className="w-full border rounded p-1.5 text-xs mt-1"
                  />
                ) : (
                  <p className="text-slate-700 mt-0.5">{modul.targetPesertaDidik || '-'}</p>
                )}
              </div>
              <div>
                <strong className="text-slate-800">Metode Pembelajaran:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={modul.metodePembelajaran}
                    placeholder="Contoh: Diskusi, tanya jawab, praktik, presentasi"
                    onChange={(e) => setModul({ ...modul, metodePembelajaran: e.target.value })}
                    className="w-full border rounded p-1.5 text-xs mt-1"
                  />
                ) : (
                  <p className="text-slate-700 mt-0.5">{modul.metodePembelajaran || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* II. KOMPONEN INTI */}
        <section className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 text-sm uppercase">
            II. Komponen Inti
          </h3>

          <div className="space-y-4 text-xs">
            {/* A. Tujuan Pembelajaran */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800">A. Tujuan Pembelajaran (TP):</h4>
                {isEditing && (
                  <button type="button" onClick={() => addListField('tujuanPembelajaran')} className="text-indigo-600 font-semibold text-[11px]">
                    + Tambah TP
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-1 mt-1">
                  {modul.tujuanPembelajaran.map((tp, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tp}
                        placeholder={`TP ${idx + 1}`}
                        onChange={(e) => updateListField('tujuanPembelajaran', idx, e.target.value)}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <button type="button" onClick={() => removeListField('tujuanPembelajaran', idx)} className="text-rose-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-decimal list-inside space-y-1 text-slate-700 mt-1">
                  {modul.tujuanPembelajaran.length === 0 ? <li className="list-none text-slate-400 italic">-</li> : modul.tujuanPembelajaran.map((tp, idx) => <li key={idx}>{tp}</li>)}
                </ul>
              )}
            </div>

            {/* B. Pemahaman Bermakna */}
            <div>
              <h4 className="font-bold text-slate-800">B. Pemahaman Bermakna:</h4>
              {isEditing ? (
                <textarea
                  value={modul.pemahamanBermakna}
                  placeholder="Manfaat kontekstual yang dipahami peserta didik setelah belajar..."
                  onChange={(e) => setModul({ ...modul, pemahamanBermakna: e.target.value })}
                  rows={2}
                  className="w-full border rounded p-1.5 text-xs mt-1"
                />
              ) : (
                <p className="text-slate-700 italic mt-0.5 bg-sky-50 p-2 rounded border border-sky-100 print:bg-transparent print:border-none">
                  {modul.pemahamanBermakna ? `"${modul.pemahamanBermakna}"` : '-'}
                </p>
              )}
            </div>

            {/* C. Pertanyaan Pemantik */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800">C. Pertanyaan Pemantik:</h4>
                {isEditing && (
                  <button type="button" onClick={() => addListField('pertanyaanPemantik')} className="text-indigo-600 font-semibold text-[11px]">
                    + Tambah Pemantik
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-1 mt-1">
                  {modul.pertanyaanPemantik.map((pp, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={pp}
                        placeholder={`Pertanyaan pemantik ${idx + 1}`}
                        onChange={(e) => updateListField('pertanyaanPemantik', idx, e.target.value)}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <button type="button" onClick={() => removeListField('pertanyaanPemantik', idx)} className="text-rose-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1">
                  {modul.pertanyaanPemantik.length === 0 ? <li className="list-none text-slate-400 italic">-</li> : modul.pertanyaanPemantik.map((pp, idx) => <li key={idx} className="italic">&ldquo;{pp}&rdquo;</li>)}
                </ul>
              )}
            </div>

            {/* D. Kegiatan Pembelajaran */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800">D. Kegiatan Pembelajaran (Sintaks &amp; Diferensiasi):</h4>
                {isEditing && (
                  <button type="button" onClick={addPertemuan} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white rounded text-[11px]">
                    <Plus className="w-3 h-3" /> Tambah Pertemuan
                  </button>
                )}
              </div>
              {modul.kegiatanPembelajaran.length === 0 ? (
                <p className="text-slate-400 italic">Belum ada rincian pertemuan pembelajaran.</p>
              ) : (
                modul.kegiatanPembelajaran.map((kp, kIdx) => (
                  <div key={kIdx} className="border border-slate-300 rounded p-3 bg-white print:bg-transparent space-y-2 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sky-800 flex items-center gap-2">
                        <span>Pertemuan Ke-{kp.pertemuanKe}</span>
                        {isEditing ? (
                          <input
                            type="number"
                            min={10}
                            value={kp.alokasiMenit}
                            onChange={(e) => {
                              const kps = [...modul.kegiatanPembelajaran];
                              kps[kIdx] = { ...kps[kIdx], alokasiMenit: parseInt(e.target.value, 10) || 0 };
                              setModul({ ...modul, kegiatanPembelajaran: kps });
                            }}
                            className="w-16 border rounded px-1 py-0.5 text-center"
                          />
                        ) : (
                          <span>({kp.alokasiMenit} Menit)</span>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() =>
                            setModul({
                              ...modul,
                              kegiatanPembelajaran: modul.kegiatanPembelajaran
                                .filter((_, i) => i !== kIdx)
                                .map((m, i) => ({ ...m, pertemuanKe: i + 1 }))
                            })
                          }
                          className="text-rose-600 text-[11px]"
                        >
                          Hapus Pertemuan
                        </button>
                      )}
                    </div>

                    {(['pendahuluan', 'inti', 'penutup'] as const).map((phaseKey, pIdx) => (
                      <div key={phaseKey}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 capitalize">
                            {pIdx + 1}. {phaseKey === 'inti' ? 'Kegiatan Inti' : phaseKey === 'pendahuluan' ? 'Pendahuluan' : 'Penutup'}:
                          </span>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => {
                                const kps = [...modul.kegiatanPembelajaran];
                                kps[kIdx] = { ...kps[kIdx], [phaseKey]: [...kps[kIdx][phaseKey], ''] };
                                setModul({ ...modul, kegiatanPembelajaran: kps });
                              }}
                              className="text-[10px] text-indigo-600 font-semibold"
                            >
                              + Langkah
                            </button>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-1 mt-1">
                            {kp[phaseKey].map((line, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={line}
                                  placeholder={`Langkah ${phaseKey}...`}
                                  onChange={(e) => updateMeetingList(kIdx, phaseKey, i, e.target.value)}
                                  className="flex-1 border rounded px-2 py-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const kps = [...modul.kegiatanPembelajaran];
                                    kps[kIdx] = {
                                      ...kps[kIdx],
                                      [phaseKey]: kps[kIdx][phaseKey].filter((_, idx2) => idx2 !== i)
                                    };
                                    setModul({ ...modul, kegiatanPembelajaran: kps });
                                  }}
                                  className="text-rose-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                            {kp[phaseKey].filter(Boolean).map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* E. Asesmen Pembelajaran */}
            <div>
              <h4 className="font-bold text-slate-800">E. Asesmen Pembelajaran:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1 text-xs">
                <div className="p-2 border border-slate-300 rounded bg-white print:bg-transparent">
                  <span className="font-bold text-slate-800 block mb-1">1. Asesmen Awal (Diagnostik):</span>
                  {isEditing ? (
                    <textarea
                      value={modul.asesmenAwal}
                      onChange={(e) => setModul({ ...modul, asesmenAwal: e.target.value })}
                      rows={2}
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    <span className="text-slate-600">{modul.asesmenAwal || '-'}</span>
                  )}
                </div>
                <div className="p-2 border border-slate-300 rounded bg-white print:bg-transparent">
                  <span className="font-bold text-slate-800 block mb-1">2. Asesmen Formatif (Proses):</span>
                  {isEditing ? (
                    <textarea
                      value={modul.asesmenFormatif}
                      onChange={(e) => setModul({ ...modul, asesmenFormatif: e.target.value })}
                      rows={2}
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    <span className="text-slate-600">{modul.asesmenFormatif || '-'}</span>
                  )}
                </div>
                <div className="p-2 border border-slate-300 rounded bg-white print:bg-transparent">
                  <span className="font-bold text-slate-800 block mb-1">3. Asesmen Sumatif (Akhir):</span>
                  {isEditing ? (
                    <textarea
                      value={modul.asesmenSumatif}
                      onChange={(e) => setModul({ ...modul, asesmenSumatif: e.target.value })}
                      rows={2}
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    <span className="text-slate-600">{modul.asesmenSumatif || '-'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* F. Pengayaan & Remedial */}
            <div>
              <h4 className="font-bold text-slate-800">F. Pengayaan dan Remedial:</h4>
              {isEditing ? (
                <textarea
                  value={modul.remedialDanPengayaan}
                  placeholder="Rencana kegiatan remedial dan pengayaan..."
                  onChange={(e) => setModul({ ...modul, remedialDanPengayaan: e.target.value })}
                  rows={2}
                  className="w-full border rounded p-1.5 mt-1"
                />
              ) : (
                <p className="text-slate-700 text-xs mt-0.5">{modul.remedialDanPengayaan || '-'}</p>
              )}
            </div>
          </div>
        </section>

        {/* III. REFLEKSI GURU & SISWA */}
        <section className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break text-xs">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 text-sm uppercase">
            III. Refleksi Guru dan Peserta Didik
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-800">Pertanyaan Refleksi Guru:</h4>
                {isEditing && (
                  <button type="button" onClick={() => addListField('refleksiGuru')} className="text-indigo-600 text-[11px] font-semibold">
                    + Tambah
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-1">
                  {modul.refleksiGuru.map((rg, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={rg}
                        onChange={(e) => updateListField('refleksiGuru', i, e.target.value)}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <button type="button" onClick={() => removeListField('refleksiGuru', i)} className="text-rose-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {modul.refleksiGuru.length === 0 ? <li className="list-none text-slate-400 italic">-</li> : modul.refleksiGuru.map((rg, i) => <li key={i}>{rg}</li>)}
                </ul>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-800">Pertanyaan Refleksi Peserta Didik:</h4>
                {isEditing && (
                  <button type="button" onClick={() => addListField('refleksiSiswa')} className="text-indigo-600 text-[11px] font-semibold">
                    + Tambah
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-1">
                  {modul.refleksiSiswa.map((rs, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={rs}
                        onChange={(e) => updateListField('refleksiSiswa', i, e.target.value)}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <button type="button" onClick={() => removeListField('refleksiSiswa', i)} className="text-rose-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {modul.refleksiSiswa.length === 0 ? <li className="list-none text-slate-400 italic">-</li> : modul.refleksiSiswa.map((rs, i) => <li key={i}>{rs}</li>)}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
