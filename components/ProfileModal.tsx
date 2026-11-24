'use client';

import React, { useState } from 'react';
import { SchoolProfile } from '@/lib/types';
import { X, Save, School, User, Calendar, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onSave: (updated: SchoolProfile) => void;
}

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState<SchoolProfile>(profile);

  if (!isOpen) return null;

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
              <School className="w-5 h-5 text-sky-400" /> Pengaturan Profil Sekolah & Guru
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
              <School className="w-4 h-4 text-sky-600" /> I. Identitas Satuan Pendidikan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Alamat Lengkap Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolAddress}
                  onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Surel / Email Sekolah</label>
                <input
                  type="text"
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian 2: Pejabat & Guru */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-xs flex items-center gap-1.5 border-b pb-1 mb-3">
              <User className="w-4 h-4 text-indigo-600" /> II. Identitas Pimpinan & Guru
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Kepala Sekolah (Lengkap Gelar)</label>
                <input
                  type="text"
                  value={formData.headmasterName}
                  onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.headmasterNip}
                  onChange={(e) => setFormData({ ...formData, headmasterNip: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Guru yang Disupervisi</label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NIP Guru</label>
                <input
                  type="text"
                  value={formData.teacherNip}
                  onChange={(e) => setFormData({ ...formData, teacherNip: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Pengawas Pembina / Supervisor</label>
                <input
                  type="text"
                  value={formData.supervisorName}
                  onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">NIP Pengawas</label>
                <input
                  type="text"
                  value={formData.supervisorNip}
                  onChange={(e) => setFormData({ ...formData, supervisorNip: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bagian 3: Pembelajaran & Periode */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase text-xs flex items-center gap-1.5 border-b pb-1 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-600" /> III. Konteks Pembelajaran & Waktu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Fase</label>
                <input
                  type="text"
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Contoh: Fase D (SMP)"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Kelas</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Contoh: Kelas VII"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="2024/2025"
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
                  placeholder="15 Juli 2024"
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
