'use client';

import React, { useState } from 'react';
import { AlokasiWaktuData, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Plus, Trash2, Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: AlokasiWaktuData;
  profile: SchoolProfile;
  onSave: (data: AlokasiWaktuData) => void;
}

export const DocAlokasiWaktu: React.FC<Props> = ({ data, profile, onSave }) => {
  const [formData, setFormData] = useState<AlokasiWaktuData>(data);
  const [isEditing, setIsEditing] = useState(false);

  const totalMingguGanjil = formData.semesterGanjil.reduce((acc, curr) => acc + curr.jumlahMinggu, 0);
  const totalEfektifGanjil = formData.semesterGanjil.reduce((acc, curr) => acc + curr.mingguEfektif, 0);
  const totalNonEfektifGanjil = formData.semesterGanjil.reduce((acc, curr) => acc + curr.mingguTidakEfektif, 0);
  const totalJPGanjil = totalEfektifGanjil * formData.jamPelajaranPerMinggu;

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto">
      {/* Action Header (Hidden on Print) */}
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 1 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Analisis Alokasi Waktu & Pekan Efektif</h2>
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

      {/* Dokumen Fisik Resmi */}
      <KopSurat
        profile={profile}
        judulDokumen="ANALISIS ALOKASI WAKTU DAN RINCIAN PEKAN EFEKTIF"
        subJudul={`Mata Pelajaran: ${profile.subject} | Fase/Kelas: ${profile.phase} - ${profile.grade}`}
      />

      {/* Rincian Beban Mengajar */}
      <div className="mb-6 text-xs md:text-sm">
        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded mb-4 print:bg-transparent print:border-black">
          <div>
            <p className="text-slate-600">Mata Pelajaran: <strong className="text-slate-900">{profile.subject}</strong></p>
            <p className="text-slate-600">Satuan Pendidikan: <strong className="text-slate-900">{profile.schoolName}</strong></p>
          </div>
          <div>
            <p className="text-slate-600">Alokasi Waktu per Minggu: <strong className="text-slate-900">{formData.jamPelajaranPerMinggu} Jam Pelajaran (JP)</strong></p>
            <p className="text-slate-600">Tahun Ajaran / Semester: <strong className="text-slate-900">{profile.academicYear} / {profile.semester}</strong></p>
          </div>
        </div>

        <h3 className="font-bold text-sm text-slate-800 uppercase mb-2">
          I. Distribusi Alokasi Waktu Semester {profile.semester}
        </h3>

        {/* Tabel Rincian Pekan */}
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
              {formData.semesterGanjil.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-300 px-3 py-2 font-medium">{item.bulan}</td>
                  <td className="border border-slate-300 px-3 py-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        value={item.jumlahMinggu}
                        onChange={(e) => {
                          const updated = [...formData.semesterGanjil];
                          updated[idx].jumlahMinggu = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, semesterGanjil: updated });
                        }}
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
                        value={item.mingguEfektif}
                        onChange={(e) => {
                          const updated = [...formData.semesterGanjil];
                          updated[idx].mingguEfektif = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, semesterGanjil: updated });
                        }}
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
                        value={item.mingguTidakEfektif}
                        onChange={(e) => {
                          const updated = [...formData.semesterGanjil];
                          updated[idx].mingguTidakEfektif = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, semesterGanjil: updated });
                        }}
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
                        onChange={(e) => {
                          const updated = [...formData.semesterGanjil];
                          updated[idx].keterangan = e.target.value;
                          setFormData({ ...formData, semesterGanjil: updated });
                        }}
                        className="w-full border rounded px-2 py-0.5"
                      />
                    ) : (
                      item.keterangan
                    )}
                  </td>
                </tr>
              ))}
              {/* Baris Total */}
              <tr className="bg-slate-100 font-bold text-slate-900">
                <td colSpan={2} className="border border-slate-300 px-3 py-2 text-center">JUMLAH TOTAL</td>
                <td className="border border-slate-300 px-3 py-2 text-center">{totalMingguGanjil} Minggu</td>
                <td className="border border-slate-300 px-3 py-2 text-center text-emerald-800">{totalEfektifGanjil} Minggu</td>
                <td className="border border-slate-300 px-3 py-2 text-center text-rose-800">{totalNonEfektifGanjil} Minggu</td>
                <td className="border border-slate-300 px-3 py-2 text-slate-600">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ringkasan Perhitungan Jam Pelajaran */}
        <div className="mt-6 p-4 border border-slate-300 rounded bg-slate-50 print:bg-transparent text-xs md:text-sm">
          <h4 className="font-bold text-slate-800 uppercase mb-2">II. Perhitungan Jam Pembelajaran Efektif</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Jumlah Minggu Efektif: <strong>{totalEfektifGanjil} Minggu</strong></li>
            <li>Jam Pelajaran (JP) per Minggu: <strong>{formData.jamPelajaranPerMinggu} JP</strong></li>
            <li>Total Jam Pelajaran Efektif (Tatap Muka): <strong>{totalEfektifGanjil} × {formData.jamPelajaranPerMinggu} JP = {totalJPGanjil} JP</strong></li>
            <li>Alokasi Cadangan & Pengayaan/Remedial: <strong>4 JP</strong></li>
            <li>Alokasi Pembelajaran Materi Inti: <strong>{totalJPGanjil - 4} JP</strong></li>
          </ul>
        </div>
      </div>

      {/* Lembar Tanda Tangan */}
      <TandaTangan profile={profile} />
    </div>
  );
};
