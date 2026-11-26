'use client';

import React, { useState, useEffect } from 'react';
import { AlokasiWaktuData, SchoolProfile, PekanBulan } from '@/lib/types';
import { exampleDocuments } from '@/lib/exampleData';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { ReferencePanel } from '../ReferencePanel';
import { Plus, Trash2, Edit2, Check, Printer, FileUp, Eye, EyeOff, FileText, ExternalLink } from 'lucide-react';

interface Props {
  data: AlokasiWaktuData;
  profile: SchoolProfile;
  onSave: (data: AlokasiWaktuData) => void;
}

export const DocAlokasiWaktu: React.FC<Props> = ({ data, profile, onSave }) => {
  const [formData, setFormData] = useState<AlokasiWaktuData>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSemester, setActiveSemester] = useState<'Ganjil' | 'Genap'>(
    profile.semester === 'Genap' ? 'Genap' : 'Ganjil'
  );
  const [showKalenderPreview, setShowKalenderPreview] = useState(true);
  const [sessionKalenderUrl, setSessionKalenderUrl] = useState<string | null>(null);
  const [sessionKalenderMime, setSessionKalenderMime] = useState<string>('application/pdf');
  const [kalenderNotice, setKalenderNotice] = useState<string | null>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  useEffect(() => {
    if (profile.semester === 'Ganjil' || profile.semester === 'Genap') {
      setActiveSemester(profile.semester);
    }
  }, [profile.semester]);

  const activeRows: PekanBulan[] =
    activeSemester === 'Genap' ? formData.semesterGenap : formData.semesterGanjil;

  const totalMinggu = activeRows.reduce((acc, curr) => acc + (curr.jumlahMinggu || 0), 0);
  const totalEfektif = activeRows.reduce((acc, curr) => acc + (curr.mingguEfektif || 0), 0);
  const totalNonEfektif = activeRows.reduce((acc, curr) => acc + (curr.mingguTidakEfektif || 0), 0);
  const jpPerMinggu = formData.jamPelajaranPerMinggu || 0;
  const totalJP = totalEfektif * jpPerMinggu;
  const cadanganJP = formData.alokasiCadanganJP ?? 0;
  const materiIntiJP = Math.max(0, totalJP - cadanganJP);

  const updateMonthRow = (idx: number, field: keyof PekanBulan, rawVal: string) => {
    const key = activeSemester === 'Genap' ? 'semesterGenap' : 'semesterGanjil';
    const updated = [...formData[key]];
    const row = { ...updated[idx] };
    if (field === 'keterangan' || field === 'bulan') {
      (row as any)[field] = rawVal;
    } else {
      const num = Math.max(0, parseInt(rawVal, 10) || 0);
      (row as any)[field] = num;
      if (field === 'jumlahMinggu' || field === 'mingguEfektif') {
        row.mingguTidakEfektif = Math.max(0, (row.jumlahMinggu || 0) - (row.mingguEfektif || 0));
      }
    }
    updated[idx] = row;
    setFormData({ ...formData, [key]: updated });
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleUploadKalender = (file?: File) => {
    if (!file) return;
    setKalenderNotice(null);

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    if (!isPdf && !isImage) {
      setKalenderNotice('Format file harus berupa PDF (.pdf) atau Gambar (PNG/JPG).');
      return;
    }

    const maxCloudBytes = 450 * 1024; // 450 KB agar aman dengan batas dokumen Firestore 1 MB
    setShowKalenderPreview(true);

    if (file.size <= maxCloudBytes) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        if (sessionKalenderUrl) {
          URL.revokeObjectURL(sessionKalenderUrl);
          setSessionKalenderUrl(null);
        }
        const updated: AlokasiWaktuData = {
          ...formData,
          kalenderPdfName: file.name,
          kalenderPdfDataUrl: dataUrl,
        };
        setFormData(updated);
        onSave(updated);
        setKalenderNotice('Kalender Pendidikan berhasil diunggah & disimpan ke cloud!');
      };
      reader.readAsDataURL(file);
    } else {
      if (sessionKalenderUrl) URL.revokeObjectURL(sessionKalenderUrl);
      const blobUrl = URL.createObjectURL(file);
      setSessionKalenderUrl(blobUrl);
      setSessionKalenderMime(isPdf ? 'application/pdf' : file.type);
      const updated: AlokasiWaktuData = {
        ...formData,
        kalenderPdfName: file.name,
        kalenderPdfDataUrl: undefined,
      };
      setFormData(updated);
      onSave(updated);
      setKalenderNotice(
        `File (${(file.size / 1024).toFixed(0)} KB) ditampilkan untuk sesi ini agar tidak melebihi batas cloud 450 KB. Silakan sesuaikan tabel di bawah sambil melihat kalender ini.`
      );
    }
  };

  const handleRemoveKalender = () => {
    if (sessionKalenderUrl) {
      URL.revokeObjectURL(sessionKalenderUrl);
      setSessionKalenderUrl(null);
    }
    setKalenderNotice(null);
    const updated: AlokasiWaktuData = {
      ...formData,
      kalenderPdfName: undefined,
      kalenderPdfDataUrl: undefined,
    };
    setFormData(updated);
    onSave(updated);
  };

  const activeKalenderUrl = sessionKalenderUrl || formData.kalenderPdfDataUrl || null;
  const activeKalenderIsPdf = activeKalenderUrl
    ? activeKalenderUrl.startsWith('data:application/pdf') ||
      (sessionKalenderUrl ? sessionKalenderMime === 'application/pdf' : false)
    : false;

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      {/* Action Header */}
      <div className="no-print flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 1 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Analisis Alokasi Waktu &amp; Pekan Efektif</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded text-xs border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSemester('Ganjil')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                activeSemester === 'Ganjil' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              Sem. Ganjil
            </button>
            <button
              type="button"
              onClick={() => setActiveSemester('Genap')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                activeSemester === 'Genap' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              Sem. Genap
            </button>
          </div>
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
        docKey="alokasiWaktu"
        onLoadExample={() => {
          setFormData(exampleDocuments.alokasiWaktu);
          onSave(exampleDocuments.alokasiWaktu);
        }}
      />

      {/* Panel Upload & Pratinjau PDF Kalender Pendidikan (no-print) */}
      <div className="no-print mb-5 rounded-lg border border-sky-200 bg-sky-50/50 text-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-sky-100/70 border-b border-sky-200/70">
          <div className="flex items-center gap-2 font-bold text-sky-950">
            <FileText className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Acuan Kalender Pendidikan (PDF / Gambar)</span>
            {formData.kalenderPdfName && (
              <span className="px-2 py-0.5 rounded bg-white text-sky-800 border border-sky-200 font-medium text-[10px] truncate max-w-[200px]">
                {formData.kalenderPdfName}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-[11px] transition shadow-sm">
              <FileUp className="w-3 h-3" />
              {activeKalenderUrl ? 'Ganti File Kalender' : 'Unggah PDF / Gambar Kalender'}
              <input
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  handleUploadKalender(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>

            {activeKalenderUrl && (
              <>
                <button
                  type="button"
                  onClick={() => setShowKalenderPreview((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold text-[11px] transition"
                >
                  {showKalenderPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showKalenderPreview ? 'Tutup Pratinjau' : 'Lihat Pratinjau'}
                </button>
                <a
                  href={activeKalenderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold text-[11px] transition"
                >
                  <ExternalLink className="w-3 h-3" /> Buka Tab Baru
                </a>
                <button
                  type="button"
                  onClick={handleRemoveKalender}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-semibold text-[11px] transition"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </>
            )}
          </div>
        </div>

        {kalenderNotice && (
          <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px]">
            {kalenderNotice}
          </div>
        )}

        {activeKalenderUrl && showKalenderPreview ? (
          <div className="p-3 bg-white">
            <p className="text-[11px] text-slate-500 mb-2">
              Klik <strong>Edit Data</strong> di kanan atas, lalu sesuaikan angka <em>Jumlah Minggu</em>, <em>Minggu Efektif</em>, dan <em>Kegiatan Non-Efektif</em> di bawah sambil melihat kalender ini.
            </p>
            {activeKalenderIsPdf ? (
              <iframe
                src={activeKalenderUrl}
                title="Pratinjau Kalender Pendidikan PDF"
                className="w-full h-[460px] rounded border border-slate-200"
              />
            ) : (
              <div className="max-h-[460px] overflow-auto border border-slate-200 rounded bg-slate-50 p-2 text-center">
                <img
                  src={activeKalenderUrl}
                  alt="Kalender Pendidikan"
                  className="max-w-full mx-auto rounded"
                />
              </div>
            )}
          </div>
        ) : (
          !activeKalenderUrl && (
            <div className="px-3.5 py-2.5 text-[11px] text-slate-600">
              Punya file PDF / gambar Kalender Pendidikan dari Dinas atau Kemenag? Unggah di sini agar tampil berdampingan saat Anda mengisi rincian pekan efektif di bawah. (Tidak ikut tercetak saat print A4.)
            </div>
          )
        )}
      </div>

      <KopSurat
        profile={profile}
        judulDokumen="ANALISIS ALOKASI WAKTU DAN RINCIAN PEKAN EFEKTIF"
        subJudul={`Mata Pelajaran: ${profile.subject || '-'} | Fase/Kelas: ${profile.phase || '-'} - ${profile.grade || '-'}`}
      />

      <div className="mb-6 text-xs md:text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded mb-4 print:bg-transparent print:border-black">
          <div>
            <p className="text-slate-600">Mata Pelajaran: <strong className="text-slate-900">{profile.subject || '-'}</strong></p>
            <p className="text-slate-600">Satuan Pendidikan: <strong className="text-slate-900">{profile.schoolName || '-'}</strong></p>
          </div>
          <div className="space-y-1">
            <div className="text-slate-600 flex items-center gap-2">
              <span>Alokasi Waktu per Minggu:</span>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={jpPerMinggu}
                  onChange={(e) =>
                    setFormData({ ...formData, jamPelajaranPerMinggu: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className="w-20 border border-slate-300 rounded px-2 py-0.5 text-xs font-bold text-slate-900"
                />
              ) : (
                <strong className="text-slate-900">{jpPerMinggu} Jam Pelajaran (JP)</strong>
              )}
            </div>
            <p className="text-slate-600">
              Tahun Ajaran / Semester: <strong className="text-slate-900">{profile.academicYear || '-'} / {activeSemester}</strong>
            </p>
          </div>
        </div>

        <h3 className="font-bold text-sm text-slate-800 uppercase mb-2">
          I. Distribusi Alokasi Waktu Semester {activeSemester}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-300 px-3 py-2 text-center w-12">No</th>
                <th className="border border-slate-300 px-3 py-2">Nama Bulan</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Jumlah Minggu</th>
                <th className="border border-slate-300 px-3 py-2 text-center text-emerald-800">Minggu Efektif</th>
                <th className="border border-slate-300 px-3 py-2 text-center text-rose-800">Minggu Tidak Efektif</th>
                <th className="border border-slate-300 px-3 py-2">Keterangan Kegiatan</th>
              </tr>
            </thead>
            <tbody>
              {activeRows.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-300 px-3 py-2 font-medium">{item.bulan}</td>
                  <td className="border border-slate-300 px-3 py-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={item.jumlahMinggu}
                        onChange={(e) => updateMonthRow(idx, 'jumlahMinggu', e.target.value)}
                        className="w-16 border rounded px-1.5 py-0.5 text-center"
                      />
                    ) : (
                      item.jumlahMinggu
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-center font-bold text-emerald-700">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={item.mingguEfektif}
                        onChange={(e) => updateMonthRow(idx, 'mingguEfektif', e.target.value)}
                        className="w-16 border rounded px-1.5 py-0.5 text-center font-bold"
                      />
                    ) : (
                      item.mingguEfektif
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-center font-bold text-rose-700">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={item.mingguTidakEfektif}
                        onChange={(e) => updateMonthRow(idx, 'mingguTidakEfektif', e.target.value)}
                        className="w-16 border rounded px-1.5 py-0.5 text-center"
                      />
                    ) : (
                      item.mingguTidakEfektif
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.keterangan}
                        placeholder="Contoh: KBM / STS / MPLS / Libur"
                        onChange={(e) => updateMonthRow(idx, 'keterangan', e.target.value)}
                        className="w-full border rounded px-2 py-0.5"
                      />
                    ) : (
                      item.keterangan || '-'
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold text-slate-900">
                <td colSpan={2} className="border border-slate-300 px-3 py-2 text-center">JUMLAH TOTAL</td>
                <td className="border border-slate-300 px-3 py-2 text-center">{totalMinggu} Minggu</td>
                <td className="border border-slate-300 px-3 py-2 text-center text-emerald-800">{totalEfektif} Minggu</td>
                <td className="border border-slate-300 px-3 py-2 text-center text-rose-800">{totalNonEfektif} Minggu</td>
                <td className="border border-slate-300 px-3 py-2 text-slate-600">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Rincian Kegiatan Non-Efektif */}
        <div className="mt-5 p-4 border border-slate-300 rounded bg-white print:bg-transparent text-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800 uppercase">II. Rincian Pekan Tidak Efektif (Kalender Akademik)</h4>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    kegiatanNonEfektif: [...(formData.kegiatanNonEfektif || []), { kegiatan: '', jumlahMinggu: 1 }]
                  })
                }
                className="no-print inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white rounded text-[11px]"
              >
                <Plus className="w-3 h-3" /> Tambah Kegiatan
              </button>
            )}
          </div>
          {(formData.kegiatanNonEfektif || []).length === 0 ? (
            <p className="text-slate-400 italic">Belum ada rincian kegiatan non-efektif (MPLS, STS, SAS, Libur).</p>
          ) : (
            <ul className="space-y-1.5">
              {formData.kegiatanNonEfektif.map((k, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={k.kegiatan}
                        placeholder="Nama kegiatan non-efektif"
                        onChange={(e) => {
                          const copy = [...formData.kegiatanNonEfektif];
                          copy[idx] = { ...copy[idx], kegiatan: e.target.value };
                          setFormData({ ...formData, kegiatanNonEfektif: copy });
                        }}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <input
                        type="number"
                        min={0}
                        value={k.jumlahMinggu}
                        onChange={(e) => {
                          const copy = [...formData.kegiatanNonEfektif];
                          copy[idx] = { ...copy[idx], jumlahMinggu: parseInt(e.target.value, 10) || 0 };
                          setFormData({ ...formData, kegiatanNonEfektif: copy });
                        }}
                        className="w-16 border rounded px-2 py-1 text-center"
                      />
                      <span className="text-slate-500">minggu</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            kegiatanNonEfektif: formData.kegiatanNonEfektif.filter((_, i) => i !== idx)
                          })
                        }
                        className="text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <span>
                      • {k.kegiatan || '-'}: <strong>{k.jumlahMinggu} Minggu</strong>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ringkasan Perhitungan Jam Pelajaran */}
        <div className="mt-5 p-4 border border-slate-300 rounded bg-slate-50 print:bg-transparent text-xs md:text-sm">
          <h4 className="font-bold text-slate-800 uppercase mb-2">III. Perhitungan Jam Pembelajaran Efektif</h4>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700">
            <li>Jumlah Minggu Efektif Semester {activeSemester}: <strong>{totalEfektif} Minggu</strong></li>
            <li>Jam Pelajaran (JP) per Minggu: <strong>{jpPerMinggu} JP</strong></li>
            <li>Total Jam Pelajaran Efektif (Tatap Muka): <strong>{totalEfektif} × {jpPerMinggu} JP = {totalJP} JP</strong></li>
            <li>
              Alokasi Cadangan &amp; Pengayaan/Remedial:{' '}
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  value={cadanganJP}
                  onChange={(e) =>
                    setFormData({ ...formData, alokasiCadanganJP: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-center font-bold"
                />
              ) : (
                <strong>{cadanganJP} JP</strong>
              )}
            </li>
            <li>Alokasi Pembelajaran Materi Inti: <strong>{materiIntiJP} JP</strong></li>
          </ul>

          <div className="mt-3 pt-3 border-t border-slate-200">
            <span className="font-semibold text-slate-800 block mb-1 text-xs">Catatan Distribusi:</span>
            {isEditing ? (
              <textarea
                value={formData.catatanDistribusi}
                onChange={(e) => setFormData({ ...formData, catatanDistribusi: e.target.value })}
                rows={2}
                placeholder="Catatan tambahan distribusi waktu..."
                className="w-full border rounded p-1.5 text-xs"
              />
            ) : (
              <p className="text-xs text-slate-600 italic">{formData.catatanDistribusi || '-'}</p>
            )}
          </div>
        </div>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
