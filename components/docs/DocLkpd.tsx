'use client';

import React, { useState } from 'react';
import { LkpdData, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: LkpdData;
  profile: SchoolProfile;
  onSave: (data: LkpdData) => void;
}

export const DocLkpd: React.FC<Props> = ({ data, profile, onSave }) => {
  const [formData, setFormData] = useState<LkpdData>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
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

      <KopSurat
        profile={profile}
        judulDokumen="LEMBAR KERJA PESERTA DIDIK (LKPD)"
        subJudul={formData.judul}
      />

      <div className="space-y-6 text-xs md:text-sm">
        {/* Identitas Kelompok / Siswa */}
        <div className="p-3 border-2 border-dashed border-slate-300 rounded bg-slate-50 print:bg-transparent print:border-black text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p>Kelompok : ................................................................</p>
              <p className="mt-1">Nama Anggota :</p>
              <ol className="list-decimal list-inside ml-2 space-y-0.5 text-slate-500 print:text-black">
                <li>...........................................................................</li>
                <li>...........................................................................</li>
                <li>...........................................................................</li>
                <li>...........................................................................</li>
              </ol>
            </div>
            <div>
              <p>Kelas / Semester : <strong>{profile.grade} / {profile.semester}</strong></p>
              <p>Mata Pelajaran : <strong>{profile.subject}</strong></p>
              <p>Alokasi Waktu : <strong>{formData.alokasiWaktu}</strong></p>
            </div>
          </div>
        </div>

        {/* Petunjuk Belajar */}
        <div className="border border-slate-300 rounded p-4 bg-white print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 uppercase text-xs mb-2">A. Petunjuk Pengerjaan</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
            {formData.petunjukBelajar.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Stimulus Masalah */}
        <div className="border border-slate-300 rounded p-4 bg-sky-50/50 print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 uppercase text-xs mb-2">B. Paparan Kasus / Stimulus Masalah</h3>
          {isEditing ? (
            <textarea
              value={formData.stimulusMateri}
              onChange={(e) => setFormData({ ...formData, stimulusMateri: e.target.value })}
              rows={4}
              className="w-full border rounded p-1.5 text-xs"
            />
          ) : (
            <p className="text-slate-800 whitespace-pre-line leading-relaxed text-xs">
              {formData.stimulusMateri}
            </p>
          )}
        </div>

        {/* Langkah Kegiatan */}
        <div className="border border-slate-300 rounded p-4 bg-white print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 uppercase text-xs mb-2">C. Langkah Kerja Kelompok</h3>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-xs">
            {formData.langkahKegiatan.map((lk, i) => (
              <li key={i} className="pl-1">{lk}</li>
            ))}
          </ol>
        </div>

        {/* Pertanyaan Tugas */}
        <div className="border border-slate-300 rounded p-4 bg-white print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 uppercase text-xs mb-2">D. Tugas dan Pertanyaan Diskusi</h3>
          <div className="space-y-4 text-xs mt-3">
            {formData.pertanyaanTugas.map((t, i) => (
              <div key={i} className="space-y-1">
                <p className="font-semibold text-slate-800">
                  {t.no}. {t.pertanyaan} <span className="text-slate-500 font-normal">(Bobot: {t.bobot} Poin)</span>
                </p>
                {/* Kotak Jawaban Siswa */}
                <div className="border border-dashed border-slate-300 rounded p-3 h-20 bg-slate-50 print:bg-transparent print:border-black">
                  <span className="text-[10px] text-slate-400 italic print:hidden">Ruang Jawaban Peserta Didik:</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rubrik Penilaian LKPD */}
        <div className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 uppercase text-xs mb-2">E. Rubrik Penilaian Unjuk Kerja LKPD</h3>
          <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-slate-200 text-slate-800">
                <th className="border border-slate-300 px-2 py-1.5 w-32">Kriteria</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 4 (Sangat Baik)</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 3 (Baik)</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 2 (Cukup)</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center">Skor 1 (Kurang)</th>
              </tr>
            </thead>
            <tbody>
              {formData.rubrikPenilaian.map((rubrik, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-300 px-2 py-1.5 font-bold">{rubrik.kriteria}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-slate-700">{rubrik.skor4}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-slate-700">{rubrik.skor3}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-slate-700">{rubrik.skor2}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-slate-700">{rubrik.skor1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
