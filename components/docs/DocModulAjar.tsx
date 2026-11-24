'use client';

import React, { useState } from 'react';
import { ModulAjarData, SchoolProfile } from '@/lib/types';
import { KopSurat } from '../KopSurat';
import { TandaTangan } from '../TandaTangan';
import { Edit2, Check, Printer } from 'lucide-react';

interface Props {
  data: ModulAjarData;
  profile: SchoolProfile;
  onSave: (data: ModulAjarData) => void;
}

export const DocModulAjar: React.FC<Props> = ({ data, profile, onSave }) => {
  const [modul, setModul] = useState<ModulAjarData>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(modul);
    setIsEditing(false);
  };

  return (
    <div className="printable-document bg-white p-6 md:p-10 shadow-sm border border-slate-200 rounded-lg max-w-5xl mx-auto text-slate-800">
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-semibold rounded text-xs">
            Poin 5 dari 15
          </span>
          <h2 className="text-lg font-bold text-slate-800">Modul Ajar / RPP Kurikulum Merdeka</h2>
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

      <KopSurat
        profile={profile}
        judulDokumen="MODUL AJAR KURIKULUM MERDEKA"
        subJudul={modul.judulModul}
        nomorDokumen={modul.id}
      />

      <div className="space-y-6 text-xs md:text-sm">
        {/* I. INFORMASI UMUM */}
        <section className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 text-sm uppercase">
            I. Informasi Umum
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div>
              <p className="text-slate-600">Penyusun / Guru: <strong className="text-slate-900">{profile.teacherName}</strong></p>
              <p className="text-slate-600">Satuan Pendidikan: <strong className="text-slate-900">{profile.schoolName}</strong></p>
              <p className="text-slate-600">Tahun Penyusunan: <strong className="text-slate-900">{profile.academicYear}</strong></p>
              <p className="text-slate-600">Jenjang / Fase / Kelas: <strong className="text-slate-900">{profile.phase} / {profile.grade}</strong></p>
            </div>
            <div>
              <p className="text-slate-600">Mata Pelajaran: <strong className="text-slate-900">{profile.subject}</strong></p>
              <p className="text-slate-600">Elemen / Domain: <strong className="text-slate-900">{modul.elemen}</strong></p>
              <p className="text-slate-600">Alokasi Waktu: <strong className="text-slate-900">{modul.alokasiWaktu}</strong></p>
              <p className="text-slate-600">Model Pembelajaran: <strong className="text-slate-900">{modul.modelPembelajaran}</strong></p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
            <div>
              <strong className="text-slate-800">Kompetensi Awal:</strong>
              {isEditing ? (
                <textarea
                  value={modul.kompetensiAwal}
                  onChange={(e) => setModul({ ...modul, kompetensiAwal: e.target.value })}
                  className="w-full border rounded p-1 text-xs mt-1"
                />
              ) : (
                <p className="text-slate-700 mt-0.5">{modul.kompetensiAwal}</p>
              )}
            </div>
            <div>
              <strong className="text-slate-800">Profil Pelajar Pancasila:</strong>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {modul.profilPelajarPancasila.map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium text-[11px] print:border print:border-black">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <strong className="text-slate-800">Sarana dan Prasarana:</strong>
              <p className="text-slate-700 mt-0.5">{modul.saranaPrasarana}</p>
            </div>
            <div>
              <strong className="text-slate-800">Target Peserta Didik:</strong>
              <p className="text-slate-700 mt-0.5">{modul.targetPesertaDidik}</p>
            </div>
          </div>
        </section>

        {/* II. KOMPONEN INTI */}
        <section className="border border-slate-300 rounded p-4 bg-slate-50 print:bg-transparent avoid-break">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 text-sm uppercase">
            II. Komponen Inti
          </h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-slate-800">A. Tujuan Pembelajaran (TP):</h4>
              <ul className="list-decimal list-inside space-y-1 text-slate-700 mt-1">
                {modul.tujuanPembelajaran.map((tp, idx) => (
                  <li key={idx}>{tp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800">B. Pemahaman Bermakna:</h4>
              {isEditing ? (
                <textarea
                  value={modul.pemahamanBermakna}
                  onChange={(e) => setModul({ ...modul, pemahamanBermakna: e.target.value })}
                  className="w-full border rounded p-1 text-xs mt-1"
                />
              ) : (
                <p className="text-slate-700 italic mt-0.5 bg-sky-50 p-2 rounded border border-sky-100 print:bg-transparent print:border-none">
                  &ldquo;{modul.pemahamanBermakna}&rdquo;
                </p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-800">C. Pertanyaan Pemantik:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1">
                {modul.pertanyaanPemantik.map((pp, idx) => (
                  <li key={idx} className="italic">&ldquo;{pp}&rdquo;</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-2">D. Kegiatan Pembelajaran (Sintaks PBL):</h4>
              {modul.kegiatanPembelajaran.map((kp, kIdx) => (
                <div key={kIdx} className="border border-slate-300 rounded p-3 bg-white print:bg-transparent space-y-2 text-xs mb-3">
                  <div className="font-bold text-sky-800">
                    Pertemuan Ke-{kp.pertemuanKe} ({kp.alokasiMenit} Menit)
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">1. Pendahuluan (10 Menit):</span>
                    <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                      {kp.pendahuluan.map((pd, i) => (
                        <li key={i}>{pd}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">2. Kegiatan Inti (60 Menit):</span>
                    <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                      {kp.inti.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">3. Penutup (10 Menit):</span>
                    <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                      {kp.penutup.map((pn, i) => (
                        <li key={i}>{pn}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-bold text-slate-800">E. Asesmen Pembelajaran:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1 text-xs">
                <div className="p-2 border border-slate-300 rounded bg-white print:bg-transparent">
                  <span className="font-bold text-slate-800 block">1. Asesmen Awal (Diagnostik):</span>
                  <span className="text-slate-600">{modul.asesmenAwal}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-white print:bg-transparent">
                  <span className="font-bold text-slate-800 block">2. Asesmen Formatif (Proses):</span>
                  <span className="text-slate-600">{modul.asesmenFormatif}</span>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-white print:bg-transparent">
                  <span className="font-bold text-slate-800 block">3. Asesmen Sumatif (Akhir):</span>
                  <span className="text-slate-600">{modul.asesmenSumatif}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800">F. Pengayaan dan Remedial:</h4>
              <p className="text-slate-700 text-xs mt-0.5">{modul.remedialDanPengayaan}</p>
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
              <h4 className="font-bold text-slate-800 mb-1">Pertanyaan Refleksi Guru:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {modul.refleksiGuru.map((rg, i) => (
                  <li key={i}>{rg}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Pertanyaan Refleksi Peserta Didik:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {modul.refleksiSiswa.map((rs, i) => (
                  <li key={i}>{rs}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <TandaTangan profile={profile} />
    </div>
  );
};
