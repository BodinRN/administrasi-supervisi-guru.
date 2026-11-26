'use client';

import React, { useState, useEffect } from 'react';
import { SchoolProfile } from '@/lib/types';
import { FASE_KURIKULUM_MERDEKA } from '@/lib/references';
import { X, Save, School, User, BookOpen, Upload, Trash2, ImageIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onSave: (updated: SchoolProfile) => void;
}

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState<SchoolProfile>(profile);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(profile);
    setLogoError(null);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleLogoUpload = (side: 'logoLeft' | 'logoRight', file?: File) => {
    if (!file) return;
    setLogoError(null);

    if (!file.type.startsWith('image/')) {
      setLogoError('File harus berupa gambar (PNG, JPG, WebP, atau SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoError('Ukuran file maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 240;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setFormData((prev) => ({ ...prev, [side]: result }));
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/png');
        setFormData((prev) => ({ ...prev, [side]: compressed }));
      };
      img.onerror = () => {
        setLogoError('Gagal membaca file gambar. Coba file lain.');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <School className="w-5 h-5 text-sky-400" /> Pengaturan Profil Sekolah &amp; Guru
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Data ini akan otomatis tercantum pada seluruh Kop Surat dan Tanda Tangan 15 Dokumen Administrasi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Bagian 1: Identitas Satuan Pendidikan */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-xs flex items-center gap-1.5 border-b pb-1 mb-3">
              <School className="w-4 h-4 text-sky-600" /> I. Identitas Satuan Pendidikan &amp; Kop Surat
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Baris 1 Kop Surat (Pemda / Yayasan / Kemenag)</label>
                <input
                  type="text"
                  value={formData.headerLine1 || ''}
                  onChange={(e) => setFormData({ ...formData, headerLine1: e.target.value })}
                  placeholder="Contoh: PEMERINTAH KOTA BANDUNG / YAYASAN ..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Baris 2 Kop Surat (Dinas / Instansi)</label>
                <input
                  type="text"
                  value={formData.headerLine2 || ''}
                  onChange={(e) => setFormData({ ...formData, headerLine2: e.target.value })}
                  placeholder="Contoh: DINAS PENDIDIKAN DAN KEBUDAYAAN"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              {/* Upload Logo Kiri & Kanan Kop Surat */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-600" /> Logo Kop Surat (Kiri &amp; Kanan)
                  </span>
                  <span className="text-[10px] text-slate-500">PNG/JPG/WebP • Otomatis dioptimalkan</span>
                </div>
                {logoError && (
                  <p className="text-[11px] text-rose-600 mb-2">{logoError}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Logo Kiri */}
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {formData.logoLeft ? (
                        <img src={formData.logoLeft} alt="Logo Kiri" className="max-w-full max-h-full object-contain p-0.5" />
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center px-1">Kosong</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 text-[11px]">Logo Kiri</p>
                      <p className="text-[10px] text-slate-400 mb-1.5">Pemda / Kemenag / Tut Wuri</p>
                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-[10px] transition">
                          <Upload className="w-3 h-3" /> Unggah
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleLogoUpload('logoLeft', e.target.files?.[0]);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        {formData.logoLeft && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, logoLeft: '' })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[10px] transition"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Logo Kanan */}
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {formData.logoRight ? (
                        <img src={formData.logoRight} alt="Logo Kanan" className="max-w-full max-h-full object-contain p-0.5" />
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center px-1">Kosong</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 text-[11px]">Logo Kanan</p>
                      <p className="text-[10px] text-slate-400 mb-1.5">Logo Sekolah / Madrasah</p>
                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-[10px] transition">
                          <Upload className="w-3 h-3" /> Unggah
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleLogoUpload('logoRight', e.target.files?.[0]);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        {formData.logoRight && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, logoRight: '' })}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[10px] transition"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Sekolah / Madrasah *</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="Contoh: SDN 1 Harapan / SMPN 2 ... / SMAN 1 ..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  placeholder="8 digit NPSN sekolah"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Alamat Lengkap Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolAddress}
                  onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                  placeholder="Jalan, nomor, desa/kelurahan"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Contoh: Kec. Banjarmasin Selatan"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Contoh: Kota Banjarmasin"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="Contoh: Kalimantan Selatan"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Contoh: 70248"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Surel / Email Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  placeholder="email@sekolah.sch.id"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Website Sekolah (Opsional)</label>
                <input
                  type="text"
                  value={formData.schoolWebsite}
                  onChange={(e) => setFormData({ ...formData, schoolWebsite: e.target.value })}
                  placeholder="https://sekolah.sch.id"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian 2: Pejabat & Guru */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-xs flex items-center gap-1.5 border-b pb-1 mb-3">
              <User className="w-4 h-4 text-indigo-600" /> II. Identitas Pimpinan &amp; Guru
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Kepala Sekolah (Lengkap Gelar)</label>
                <input
                  type="text"
                  value={formData.headmasterName}
                  onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })}
                  placeholder="Nama lengkap Kepala Sekolah"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.headmasterNip}
                  onChange={(e) => setFormData({ ...formData, headmasterNip: e.target.value })}
                  placeholder="NIP / NIY Kepala Sekolah"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Guru yang Disupervisi *</label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="Nama lengkap & gelar Anda"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NIP / NUPTK Guru</label>
                <input
                  type="text"
                  value={formData.teacherNip}
                  onChange={(e) => setFormData({ ...formData, teacherNip: e.target.value })}
                  placeholder="NIP / PPPK / NUPTK"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Pengawas Pembina / Supervisor</label>
                <input
                  type="text"
                  value={formData.supervisorName}
                  onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                  placeholder="Nama Pengawas / Supervisor"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NIP Pengawas</label>
                <input
                  type="text"
                  value={formData.supervisorNip}
                  onChange={(e) => setFormData({ ...formData, supervisorNip: e.target.value })}
                  placeholder="NIP Pengawas"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Pembelajaran & Periode */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-xs flex items-center gap-1.5 border-b pb-1 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-600" /> III. Konteks Pembelajaran &amp; Waktu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Mata Pelajaran / Guru Kelas *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Contoh: Matematika / Guru Kelas IV"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Fase (Referensi Kurikulum Merdeka)</label>
                <input
                  type="text"
                  list="fase-list"
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Pilih atau ketik Fase..."
                />
                <datalist id="fase-list">
                  {FASE_KURIKULUM_MERDEKA.map((f) => (
                    <option key={f.value} value={f.value} label={f.label} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Kelas</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Contoh: Kelas IV / Kelas VII"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Contoh: 2026/2027"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Titimangsa (Tanggal Dokumen)</label>
                <input
                  type="text"
                  value={formData.documentDate}
                  onChange={(e) => setFormData({ ...formData, documentDate: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Contoh: 15 Juli 2026"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Data Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
