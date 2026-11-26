'use client';

import React, { useState, useEffect } from 'react';
import { AnalisisHasilItem, AnalisisButirItem, SchoolProfile, NilaiSiswaItem } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Edit2, Check, Printer, Plus, Trash2, Link2 } from 'lucide-react';

interface Props {
  data: AnalisisHasilItem;
  profile: SchoolProfile;
  daftarNilaiList?: NilaiSiswaItem[];
  onSave: (data: AnalisisHasilItem) => void;
}

export const DocAnalisisEvaluasi: React.FC<Props> = ({ data, profile, daftarNilaiList = [], onSave }) => {
  const [formData, setFormData] = useState<AnalisisHasilItem>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [kktpThreshold, setKktpThreshold] = useState<number>(70);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const recalcCounts = (peserta: number, tuntas: number) => {
    const safePeserta = Math.max(0, peserta);
    const safeTuntas = Math.min(safePeserta, Math.max(0, tuntas));
    const belum = Math.max(0, safePeserta - safeTuntas);
    const dayaSerap = safePeserta > 0 ? parseFloat(((safeTuntas / safePeserta) * 100).toFixed(2)) : 0;
    setFormData({
      ...formData,
      jumlahPeserta: safePeserta,
      jumlahTuntas: safeTuntas,
      jumlahBelumTuntas: belum,
      dayaSerapPersen: dayaSerap
    });
  };

  const calcFromDaftarNilai = () => {
    if (daftarNilaiList.length === 0) {
      alert('Buku Daftar Nilai (Poin 10) masih kosong.');
      return;
    }
    const peserta = daftarNilaiList.length;
    const tuntas = daftarNilaiList.filter((s) => (s.nilaiAkhir || 0) >= kktpThreshold).length;
    const belum = peserta - tuntas;
    const dayaSerap = parseFloat(((tuntas / peserta) * 100).toFixed(2));
    setFormData({
      ...formData,
      jumlahPeserta: peserta,
      jumlahTuntas: tuntas,
      jumlahBelumTuntas: belum,
      dayaSerapPersen: dayaSerap,
      kesimpulan:
        dayaSerap >= 85
          ? `Ketuntasan belajar klasikal tercapai (${dayaSerap}% dari ${peserta} siswa mencapai batas ${kktpThreshold}).`
          : `Ketuntasan klasikal mencapai ${dayaSerap}% (${tuntas} tuntas, ${belum} belum tuntas pada batas ${kktpThreshold}). Perlu penguatan dan remedial.`,
      tindakLanjutKlasikal:
        belum > 0
          ? `${belum} siswa yang belum tuntas mengikuti program remedial terfokus pada TP yang belum dikuasai.`
          : 'Seluruh siswa tuntas dan diarahkan ke program pengayaan.'
    });
    setIsEditing(true);
  };

  const addButir = () => {
    const list = formData.analisisButirSoal || [];
    const newItem: AnalisisButirItem = {
      noSoal: list.length + 1,
      materi: '',
      jumlahBenar: 0,
      dayaSerapPersen: 0,
      tingkatKesukaran: 'Sedang',
      keterangan: ''
    };
    setFormData({ ...formData, analisisButirSoal: [...list, newItem] });
    setIsEditing(true);
  };

  const updateButir = (idx: number, field: keyof AnalisisButirItem, val: any) => {
    const list = [...(formData.analisisButirSoal || [])];
    const next = { ...list[idx], [field]: val };
    if (field === 'jumlahBenar' && formData.jumlahPeserta > 0) {
      const pct = parseFloat(((Number(val) / formData.jumlahPeserta) * 100).toFixed(1));
      next.dayaSerapPersen = pct;
      next.tingkatKesukaran = pct >= 70 ? 'Mudah' : pct >= 40 ? 'Sedang' : 'Sukar';
    }
    list[idx] = next;
    setFormData({ ...formData, analisisButirSoal: list });
  };

  const removeButir = (idx: number) => {
    const list = (formData.analisisButirSoal || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, analisisButirSoal: list });
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 12 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Analisis Hasil Evaluasi Pembelajaran</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {daftarNilaiList.length > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-2 py-1 text-xs">
              <span className="text-amber-900">Batas KKTP:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={kktpThreshold}
                onChange={(e) => setKktpThreshold(parseInt(e.target.value, 10) || 70)}
                className="w-12 border rounded text-center py-0.5 bg-white"
              />
              <button
                type="button"
                onClick={calcFromDaftarNilai}
                className="flex items-center gap-1 text-amber-800 font-semibold hover:underline ml-1"
              >
                <Link2 className="w-3.5 h-3.5" /> Hitung dari Nilai
              </button>
            </div>
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Analisis
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
        docKey="analisisEvaluasi"
        onLoadExample={() => {
          setFormData(exampleDocuments.analisisEvaluasi);
          onSave(exampleDocuments.analisisEvaluasi);
        }}
      />

      <KopSurat
        profile={profile}
        judulDokumen="LAPORAN ANALISIS HASIL EVALUASI / ASESMEN PEMBELAJARAN"
        subJudul={`Kelas: ${profile.grade || '-'} | Mata Pelajaran: ${profile.subject || '-'} | Semester: ${profile.semester || '-'}`}
      />

      <div className="space-y-6 text-xs md:text-sm">
        <div className="p-4 border border-slate-300 rounded bg-slate-50 print:bg-transparent">
          <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs">I. Lingkup Materi / Asesmen yang Dianalisis</h3>
          {isEditing ? (
            <input
              type="text"
              value={formData.tujuanPembelajaran}
              placeholder="Contoh: Sumatif Lingkup Materi 1 ..."
              onChange={(e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value })}
              className="w-full border rounded p-1.5 text-xs font-semibold"
            />
          ) : (
            <p className="font-semibold text-slate-800">{formData.tujuanPembelajaran || '-'}</p>
          )}
        </div>

        <div>
          <h3 className="font-bold text-slate-900 mb-2 uppercase text-xs">II. Data Rekapitulasi Ketuntasan Belajar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 border border-slate-300 rounded bg-white print:bg-transparent">
              <span className="text-[11px] text-slate-500 block uppercase">Jumlah Peserta Tes</span>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={formData.jumlahPeserta}
                  onChange={(e) => recalcCounts(parseInt(e.target.value, 10) || 0, formData.jumlahTuntas)}
                  className="w-20 border rounded text-center text-lg font-extrabold mt-1"
                />
              ) : (
                <span className="text-xl font-extrabold text-slate-800">{formData.jumlahPeserta} Siswa</span>
              )}
            </div>
            <div className="p-3 border border-emerald-300 bg-emerald-50 rounded print:bg-transparent print:border-black">
              <span className="text-[11px] text-emerald-700 block uppercase">Jumlah Siswa Tuntas</span>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={formData.jumlahTuntas}
                  onChange={(e) => recalcCounts(formData.jumlahPeserta, parseInt(e.target.value, 10) || 0)}
                  className="w-20 border rounded text-center text-lg font-extrabold mt-1 bg-white"
                />
              ) : (
                <span className="text-xl font-extrabold text-emerald-800">{formData.jumlahTuntas} Siswa</span>
              )}
            </div>
            <div className="p-3 border border-rose-300 bg-rose-50 rounded print:bg-transparent print:border-black">
              <span className="text-[11px] text-rose-700 block uppercase">Belum Tuntas (Remedial)</span>
              <span className="text-xl font-extrabold text-rose-800 block mt-1">{formData.jumlahBelumTuntas} Siswa</span>
            </div>
            <div className="p-3 border border-sky-300 bg-sky-50 rounded print:bg-transparent print:border-black">
              <span className="text-[11px] text-sky-700 block uppercase">Daya Serap Klasikal</span>
              <span className="text-xl font-extrabold text-sky-800 block mt-1">{formData.dayaSerapPersen}%</span>
            </div>
          </div>
        </div>

        {/* Analisis Butir Soal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 uppercase text-xs">III. Analisis Daya Serap &amp; Tingkat Kesukaran Butir Soal</h3>
            {isEditing && (
              <button
                type="button"
                onClick={addButir}
                className="no-print inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px]"
              >
                <Plus className="w-3 h-3" /> Tambah Butir Soal
              </button>
            )}
          </div>
          {(formData.analisisButirSoal || []).length === 0 ? (
            <p className="text-xs text-slate-400 italic border border-dashed border-slate-300 rounded p-4 text-center">
              Belum ada analisis per butir soal. Klik Edit Analisis lalu Tambah Butir Soal untuk melengkapi identifikasi soal mudah/sedang/sukar.
            </p>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-16">No Soal</th>
                    <th className="border border-slate-300 px-3 py-1.5">Materi / Indikator</th>
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-24">Jml Benar</th>
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-24">Daya Serap</th>
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-28">Kategori</th>
                    <th className="border border-slate-300 px-3 py-1.5">Keterangan / Tindak Lanjut</th>
                    {isEditing && <th className="no-print border border-slate-300 px-1 py-1.5 w-8"></th>}
                  </tr>
                </thead>
                <tbody>
                  {(formData.analisisButirSoal || []).map((b, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                        {isEditing ? (
                          <input
                            type="number"
                            min={1}
                            value={b.noSoal}
                            onChange={(e) => updateButir(idx, 'noSoal', parseInt(e.target.value, 10) || 1)}
                            className="w-12 border rounded text-center"
                          />
                        ) : (
                          b.noSoal
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={b.materi}
                            onChange={(e) => updateButir(idx, 'materi', e.target.value)}
                            className="w-full border rounded px-1.5 py-0.5"
                          />
                        ) : (
                          b.materi || '-'
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={b.jumlahBenar}
                            onChange={(e) => updateButir(idx, 'jumlahBenar', parseInt(e.target.value, 10) || 0)}
                            className="w-14 border rounded text-center"
                          />
                        ) : (
                          b.jumlahBenar
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                        {b.dayaSerapPersen}%
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center">
                        {isEditing ? (
                          <select
                            value={b.tingkatKesukaran}
                            onChange={(e) => updateButir(idx, 'tingkatKesukaran', e.target.value)}
                            className="border rounded px-1 py-0.5 bg-white"
                          >
                            <option value="Mudah">Mudah</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Sukar">Sukar</option>
                          </select>
                        ) : (
                          b.tingkatKesukaran
                        )}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={b.keterangan}
                            onChange={(e) => updateButir(idx, 'keterangan', e.target.value)}
                            className="w-full border rounded px-1.5 py-0.5"
                          />
                        ) : (
                          b.keterangan || '-'
                        )}
                      </td>
                      {isEditing && (
                        <td className="no-print border border-slate-300 px-1 py-1.5 text-center">
                          <button type="button" onClick={() => removeButir(idx)} className="text-rose-600">
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

        <div className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">IV. Kesimpulan Hasil Belajar Klasikal:</h4>
            {isEditing ? (
              <textarea
                value={formData.kesimpulan}
                placeholder="Kesimpulan ketuntasan klasikal..."
                onChange={(e) => setFormData({ ...formData, kesimpulan: e.target.value })}
                rows={2}
                className="w-full border rounded p-1.5 text-xs"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{formData.kesimpulan || '-'}</p>
            )}
          </div>

          <div className="border-t border-slate-200 pt-3">
            <h4 className="font-bold text-slate-900 mb-1">V. Rencana Tindak Lanjut Guru:</h4>
            {isEditing ? (
              <textarea
                value={formData.tindakLanjutKlasikal}
                placeholder="Rencana tindak lanjut remedial & pengayaan..."
                onChange={(e) => setFormData({ ...formData, tindakLanjutKlasikal: e.target.value })}
                rows={2}
                className="w-full border rounded p-1.5 text-xs"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{formData.tindakLanjutKlasikal || '-'}</p>
            )}
          </div>
        </div>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
