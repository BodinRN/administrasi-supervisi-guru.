'use client';

import React, { useState, useEffect } from 'react';
import { AtpItem, SchoolProfile, ProtaItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { PROFIL_PELAJAR_PANCASILA, TAKSONOMI_BLOOM } from '@/lib/references';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer, Link2 } from 'lucide-react';

interface Props {
  data: AtpItem[];
  profile: SchoolProfile;
  protaList?: ProtaItem[];
  onSave: (data: AtpItem[]) => void;
}

export const DocAtp: React.FC<Props> = ({ data, profile, protaList = [], onSave }) => {
  const [items, setItems] = useState<AtpItem[]>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleSave = () => {
    onSave(items);
    setIsEditing(false);
  };

  const addItem = () => {
    const newItem: AtpItem = {
      no: items.length + 1,
      elemen: '',
      capaianPembelajaran: '',
      tujuanPembelajaran: '',
      indikatorKetercapaian: [''],
      profilPelajarPancasila: [],
      alokasiWaktuJP: 4,
      kataKunciMateri: '',
      glosarium: ''
    };
    setItems([...items, newItem]);
    setIsEditing(true);
  };

  const pullFromProta = () => {
    if (protaList.length === 0) {
      alert('Data PROTA (Poin 2) masih kosong.');
      return;
    }
    const mapped: AtpItem[] = protaList.map((p, idx) => ({
      no: idx + 1,
      elemen: p.elemen,
      capaianPembelajaran: p.capaianPembelajaran,
      tujuanPembelajaran: p.tujuanPembelajaran,
      indikatorKetercapaian: ['Peserta didik mampu menjelaskan konsep dasar dan menerapkannya.'],
      profilPelajarPancasila: ['Bernalar Kritis'],
      alokasiWaktuJP: p.alokasiWaktuJP,
      kataKunciMateri: p.materiPokok,
      glosarium: ''
    }));
    setItems(mapped);
    setIsEditing(true);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, no: i + 1 })));
  };

  const toggleP3 = (idx: number, dim: string) => {
    const copy = [...items];
    const current = copy[idx].profilPelajarPancasila || [];
    const exists = current.includes(dim);
    copy[idx] = {
      ...copy[idx],
      profilPelajarPancasila: exists ? current.filter((d) => d !== dim) : [...current, dim]
    };
    setItems(copy);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 4 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Alur Tujuan Pembelajaran (ATP)</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {protaList.length > 0 && (
            <button
              type="button"
              onClick={pullFromProta}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-medium transition"
            >
              <Link2 className="w-3.5 h-3.5" /> Tarik dari PROTA (Poin 2)
            </button>
          )}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah ATP
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
              <Edit2 className="w-3.5 h-3.5" /> Edit ATP
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
        docKey="atp"
        onLoadExample={() => {
          setItems(exampleDocuments.atp);
          onSave(exampleDocuments.atp);
        }}
        extraContent={
          <div className="space-y-1.5 text-[11px]">
            <p className="font-bold text-indigo-900">Referensi Kata Kerja Operasional (Taksonomi Bloom C1–C6):</p>
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
        judulDokumen="ALUR TUJUAN PEMBELAJARAN (ATP)"
        subJudul={`Kurikulum Merdeka | Mata Pelajaran: ${profile.subject || '-'} | Fase/Kelas: ${profile.phase || '-'} - ${profile.grade || '-'}`}
      />

      {items.length === 0 ? (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-xs text-slate-500 my-4">
          <p className="font-semibold text-slate-700 mb-1">Belum ada data Alur Tujuan Pembelajaran (ATP).</p>
          <p>Klik <strong>Tambah ATP</strong> untuk mulai menyusun alur tujuan pembelajaran Anda.</p>
        </div>
      ) : (
        <div className="space-y-6 text-xs md:text-sm">
          {items.map((item, idx) => (
            <div key={idx} className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent page-break-avoid">
              <div className="flex flex-wrap items-center justify-between pb-2 mb-3 border-b border-slate-200 gap-2">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <span className="w-6 h-6 flex items-center justify-center bg-slate-800 text-white rounded-full font-bold text-xs shrink-0">
                    {item.no}
                  </span>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={item.elemen}
                        placeholder="Nama Elemen CP"
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], elemen: e.target.value };
                          setItems(copy);
                        }}
                        className="border rounded px-2 py-1 text-xs font-bold flex-1 min-w-[160px]"
                      />
                      <div className="flex items-center gap-1 text-xs">
                        <input
                          type="number"
                          min={0}
                          value={item.alokasiWaktuJP}
                          onChange={(e) => {
                            const copy = [...items];
                            copy[idx] = { ...copy[idx], alokasiWaktuJP: parseInt(e.target.value, 10) || 0 };
                            setItems(copy);
                          }}
                          className="w-16 border rounded px-1.5 py-1 text-center font-bold"
                        />
                        <span>JP</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-slate-800 text-sm">{item.elemen || 'Elemen'}</span>
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-semibold rounded text-[11px] print:border print:border-black">
                        {item.alokasiWaktuJP} JP
                      </span>
                    </>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeItem(idx)}
                    className="no-print text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Capaian Pembelajaran (CP):</p>
                  {isEditing ? (
                    <textarea
                      value={item.capaianPembelajaran}
                      placeholder="Tuliskan Capaian Pembelajaran resmi..."
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx] = { ...copy[idx], capaianPembelajaran: e.target.value };
                        setItems(copy);
                      }}
                      rows={2}
                      className="w-full border rounded p-1.5 text-xs mt-1"
                    />
                  ) : (
                    <p className="text-slate-800 italic mt-0.5">{item.capaianPembelajaran || '-'}</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Tujuan Pembelajaran (TP):</p>
                  {isEditing ? (
                    <textarea
                      value={item.tujuanPembelajaran}
                      placeholder="Tuliskan Tujuan Pembelajaran terukur..."
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx] = { ...copy[idx], tujuanPembelajaran: e.target.value };
                        setItems(copy);
                      }}
                      rows={2}
                      className="w-full border rounded p-1.5 text-xs font-semibold mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 font-semibold mt-0.5">{item.tujuanPembelajaran || '-'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-slate-200 pt-2">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-700">Indikator Ketercapaian (IKTP):</p>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...items];
                          copy[idx] = {
                            ...copy[idx],
                            indikatorKetercapaian: [...copy[idx].indikatorKetercapaian, '']
                          };
                          setItems(copy);
                        }}
                        className="text-[10px] text-indigo-600 font-semibold hover:underline"
                      >
                        + Indikator
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-1 mt-1">
                      {item.indikatorKetercapaian.map((ind, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <input
                            type="text"
                            value={ind}
                            placeholder={`Indikator ${i + 1}`}
                            onChange={(e) => {
                              const copy = [...items];
                              const inds = [...copy[idx].indikatorKetercapaian];
                              inds[i] = e.target.value;
                              copy[idx] = { ...copy[idx], indikatorKetercapaian: inds };
                              setItems(copy);
                            }}
                            className="flex-1 border rounded px-1.5 py-0.5 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...items];
                              copy[idx] = {
                                ...copy[idx],
                                indikatorKetercapaian: copy[idx].indikatorKetercapaian.filter((_, k) => k !== i)
                              };
                              setItems(copy);
                            }}
                            className="text-rose-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 mt-1">
                      {item.indikatorKetercapaian.filter(Boolean).map((ind, i) => (
                        <li key={i}>{ind}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <p className="font-bold text-slate-700">Dimensi Profil Pelajar Pancasila:</p>
                  {isEditing ? (
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {PROFIL_PELAJAR_PANCASILA.map((dim) => (
                        <label key={dim} className="inline-flex items-center gap-1.5 text-[11px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(item.profilPelajarPancasila || []).includes(dim)}
                            onChange={() => toggleP3(idx, dim)}
                          />
                          <span>{dim}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.profilPelajarPancasila.length === 0 ? (
                        <span className="text-slate-400 italic">-</span>
                      ) : (
                        item.profilPelajarPancasila.map((p, i) => (
                          <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium print:border print:border-black">
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-600 mt-2">
                    <strong>Kata Kunci:</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.kataKunciMateri}
                        placeholder="Kata kunci materi..."
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx] = { ...copy[idx], kataKunciMateri: e.target.value };
                          setItems(copy);
                        }}
                        className="w-full border rounded px-1.5 py-0.5 mt-0.5"
                      />
                    ) : (
                      item.kataKunciMateri || '-'
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-dashed border-slate-300 text-[11px] text-slate-500">
                <strong className="not-italic text-slate-600">Glosarium:</strong>{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={item.glosarium}
                    placeholder="Definisi istilah penting dalam materi ini..."
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], glosarium: e.target.value };
                      setItems(copy);
                    }}
                    className="w-full border rounded px-1.5 py-0.5 mt-0.5"
                  />
                ) : (
                  <span className="italic">{item.glosarium || '-'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TandaTangan profile={profile} />
    </div>
  );
};
