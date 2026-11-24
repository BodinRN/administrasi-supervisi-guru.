'use client';

import React, { useState, useEffect } from 'react';
import { SchoolProfile, AdministrasiDocuments, SupervisiRecord, SupervisiPoint } from '@/lib/types';
import { initialProfile, initialDocuments, initialSupervisiRecord } from '@/lib/initialData';

// Document Components
import { DocAlokasiWaktu } from '@/components/docs/DocAlokasiWaktu';
import { DocProta } from '@/components/docs/DocProta';
import { DocPromes } from '@/components/docs/DocPromes';
import { DocAtp } from '@/components/docs/DocAtp';
import { DocModulAjar } from '@/components/docs/DocModulAjar';
import { DocJadwal } from '@/components/docs/DocJadwal';
import { DocAgendaHarian } from '@/components/docs/DocAgendaHarian';
import { DocKktp } from '@/components/docs/DocKktp';
import { DocDaftarHadir } from '@/components/docs/DocDaftarHadir';
import { DocDaftarNilai } from '@/components/docs/DocDaftarNilai';
import { DocKisiKisiSoal } from '@/components/docs/DocKisiKisiSoal';
import { DocAnalisisEvaluasi } from '@/components/docs/DocAnalisisEvaluasi';
import { DocRemedial } from '@/components/docs/DocRemedial';
import { DocPengayaan } from '@/components/docs/DocPengayaan';
import { DocLkpd } from '@/components/docs/DocLkpd';

// Supervision & Modal Components
import { SupervisiChecklist } from '@/components/SupervisiChecklist';
import { ProfileModal } from '@/components/ProfileModal';
import { RegulationModal } from '@/components/RegulationModal';

// Icons
import {
  FileText,
  CheckCircle2,
  Award,
  Settings,
  School,
  Printer,
  RotateCcw,
  BookOpen,
  Calendar,
  Clock,
  ClipboardList,
  CheckSquare,
  Users,
  GraduationCap,
  HelpCircle,
  BarChart3,
  BookmarkCheck,
  Sparkles,
  Layers,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function HomePage() {
  const [profile, setProfile] = useState<SchoolProfile>(initialProfile);
  const [documents, setDocuments] = useState<AdministrasiDocuments>(initialDocuments);
  const [supervision, setSupervision] = useState<SupervisiRecord>(initialSupervisiRecord);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial data from localStorage or backend API
  useEffect(() => {
    async function loadData() {
      try {
        const local = localStorage.getItem('sipen_guru_user_data');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.documents) setDocuments(parsed.documents);
          if (parsed.supervision) setSupervision(parsed.supervision);
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setProfile(json.data.profile || initialProfile);
            setDocuments(json.data.documents || initialDocuments);
            setSupervision(json.data.supervision || initialSupervisiRecord);
          }
        }
      } catch (err) {
        console.warn('Menggunakan data memori awal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const syncLocal = (p = profile, d = documents, s = supervision) => {
    try {
      localStorage.setItem('sipen_guru_user_data', JSON.stringify({ profile: p, documents: d, supervision: s }));
    } catch (e) {}
  };

  // Save Handlers to Backend API & LocalStorage
  const handleSaveProfile = async (updated: SchoolProfile) => {
    setProfile(updated);
    syncLocal(updated, documents, supervision);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_profile', payload: updated })
      });
      showToast('Profil berhasil disimpan dan diperbarui!');
    } catch (e) {
      showToast('Profil disimpan di browser Anda');
    }
  };

  const handleSaveDocument = async (docKey: keyof AdministrasiDocuments, data: any) => {
    const updatedDocs = { ...documents, [docKey]: data };
    setDocuments(updatedDocs);
    syncLocal(profile, updatedDocs, supervision);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_document',
          payload: { docKey, data }
        })
      });
      showToast(`Dokumen ${docKey} berhasil disimpan!`);
    } catch (e) {
      showToast(`Dokumen ${docKey} tersimpan di browser`);
    }
  };

  const handleSaveSupervision = async (updated: SupervisiRecord) => {
    setSupervision(updated);
    syncLocal(profile, documents, updated);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_supervision', payload: updated })
      });
      showToast('Hasil penilaian supervisi berhasil disimpan!');
    } catch (e) {
      showToast('Penilaian supervisi tersimpan di browser');
    }
  };

  const handleResetData = async () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data administrasi ke setelan awal Kurikulum Merdeka?')) {
      try {
        localStorage.removeItem('sipen_guru_user_data');
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reset' })
        });
        if (res.ok) {
          const json = await res.json();
          setProfile(json.data.profile);
          setDocuments(json.data.documents);
          setSupervision(json.data.supervision);
          showToast('Data berhasil direset ke standar awal!');
        }
      } catch (e) {
        setProfile(initialProfile);
        setDocuments(initialDocuments);
        setSupervision(initialSupervisiRecord);
        showToast('Data direset ke setelan awal');
      }
    }
  };

  // Navigasi 15 Poin
  const menuList = [
    { id: 'alokasiWaktu', no: 1, title: 'Alokasi Waktu / Pekan Efektif', group: 'Perencanaan', icon: Clock },
    { id: 'prota', no: 2, title: 'Program Tahunan (PROTA)', group: 'Perencanaan', icon: Calendar },
    { id: 'promes', no: 3, title: 'Program Semester (PROMES)', group: 'Perencanaan', icon: Layers },
    { id: 'atp', no: 4, title: 'Alur Tujuan Pembelajaran (ATP)', group: 'Perencanaan', icon: BookOpen },
    { id: 'modulAjar', no: 5, title: 'Modul Ajar Kurikulum Merdeka', group: 'Perencanaan', icon: Sparkles },
    { id: 'jadwalPelajaran', no: 6, title: 'Jadwal Tatap Muka Guru', group: 'Pelaksanaan', icon: Clock },
    { id: 'agendaHarian', no: 7, title: 'Jurnal Mengajar / Agenda Harian', group: 'Pelaksanaan', icon: ClipboardList },
    { id: 'kktp', no: 8, title: 'Kriteria Ketuntasan (KKTP)', group: 'Asesmen', icon: CheckSquare },
    { id: 'daftarHadir', no: 9, title: 'Presensi / Daftar Hadir Siswa', group: 'Pelaksanaan', icon: Users },
    { id: 'daftarNilai', no: 10, title: 'Buku Nilai (Formatif & Sumatif)', group: 'Asesmen', icon: GraduationCap },
    { id: 'kisiKisiSoal', no: 11, title: 'Kisi-kisi & Butir Soal Asesmen', group: 'Asesmen', icon: HelpCircle },
    { id: 'analisisEvaluasi', no: 12, title: 'Analisis Hasil Evaluasi', group: 'Asesmen', icon: BarChart3 },
    { id: 'programRemedial', no: 13, title: 'Program & Pelaksanaan Remedial', group: 'Tindak Lanjut', icon: BookmarkCheck },
    { id: 'programPengayaan', no: 14, title: 'Program & Pelaksanaan Pengayaan', group: 'Tindak Lanjut', icon: Award },
    { id: 'lkpd', no: 15, title: 'Lembar Kerja Peserta Didik (LKPD)', group: 'Bahan Ajar', icon: FileText },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-semibold text-sm text-slate-300">Memuat Sistem Administrasi Supervisi Guru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-alert fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR / HEADER (Hidden on Print) */}
      <header className="no-print bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-base shadow-inner">
                SP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm md:text-base tracking-tight leading-tight">
                    SIPEN-GURU
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
                    Kurikulum Merdeka
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Aplikasi Administrasi 15 Poin Supervisi Akademik Guru
                </p>
              </div>
            </div>
          </div>

          {/* Quick Context & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col text-right pr-3 border-r border-slate-800 text-xs">
              <span className="font-semibold text-slate-200">{profile.teacherName}</span>
              <span className="text-[10px] text-slate-400">{profile.subject} • {profile.grade} ({profile.schoolName})</span>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition"
              title="Pengaturan Profil Guru & Sekolah"
            >
              <School className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Profil Sekolah & Guru</span>
            </button>

            <button
              onClick={() => setIsRegModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition"
              title="Penyesuaian Regulasi / Tambah Poin"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Regulasi</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold shadow-sm transition"
              title="Cetak Halaman Aktif"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Dokumen</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR & CONTENT */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
        {/* SIDEBAR NAVIGATION (Hidden on Print) */}
        <aside
          className={`no-print w-72 shrink-0 space-y-4 lg:block ${
            mobileMenuOpen
              ? 'fixed inset-y-0 left-0 z-50 bg-white p-4 shadow-2xl overflow-y-auto block'
              : 'hidden lg:block'
          }`}
        >
          {mobileMenuOpen && (
            <div className="flex items-center justify-between pb-3 border-b mb-3 lg:hidden">
              <span className="font-bold text-slate-800 text-sm">Menu Administrasi</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Quick Menu: Dashboard & Supervisi */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 space-y-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard & Kesiapan Supervisi</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('supervision');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'supervision'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Instrumen Evaluasi Resmi</span>
              </div>
              <span className="px-1.5 py-0.2 bg-white/20 rounded text-[10px] font-bold">
                {supervision.nilaiPersentase}%
              </span>
            </button>
          </div>

          {/* Daftar 15 Komponen Dokumen */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                15 Dokumen Administrasi
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                15/15 Lengkap
              </span>
            </div>

            <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {menuList.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition ${
                      isActive
                        ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold shrink-0 ${
                      isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.no}
                    </span>
                    <span className="truncate flex-1">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset / Backup Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cadangan & Pemulihan</span>
            <button
              onClick={() => {
                const dataToExport = { profile, documents, supervision, exportDate: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Administrasi_Supervisi_${profile.subject.replace(/\s+/g, '_')}_${profile.academicYear.replace(/\//g, '-')}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Berkas cadangan JSON berhasil diunduh!');
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-slate-700 hover:text-sky-700 hover:bg-sky-50 border border-slate-200 rounded text-xs transition"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" /> Unduh Cadangan (Backup)
            </button>

            <label className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 rounded text-xs transition cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" /> Pulihkan Data (Restore)
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = async (evt) => {
                    try {
                      const parsed = JSON.parse(evt.target?.result as string);
                      if (parsed.profile && parsed.documents && parsed.supervision) {
                        setProfile(parsed.profile);
                        setDocuments(parsed.documents);
                        setSupervision(parsed.supervision);
                        syncLocal(parsed.profile, parsed.documents, parsed.supervision);
                        await fetch('/api/data', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'import_all', payload: parsed })
                        });
                        showToast('Data administrasi berhasil dipulihkan!');
                      } else {
                        alert('Format berkas backup JSON tidak valid.');
                      }
                    } catch (err) {
                      alert('Gagal membaca berkas cadangan.');
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>

            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-100 rounded text-xs transition mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset ke Contoh Awal
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {/* TAB 0: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Standar Administrasi Guru Kurikulum Merdeka
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">
                    Selamat Datang di SIPEN-GURU, {profile.teacherName}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                    Aplikasi ini telah memuat format baku lengkap untuk <strong>15 Poin Administrasi Supervisi Akademik</strong>. Seluruh dokumen telah terisi contoh realistis, siap diedit kapan saja, dan diformat standar resmi A4 untuk langsung dicetak.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button
                      onClick={() => setActiveTab('supervision')}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" /> Buka Evaluasi Supervisi ({supervision.nilaiPersentase}%)
                    </button>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-xs backdrop-blur-sm transition border border-white/20 flex items-center gap-1.5"
                    >
                      <School className="w-4 h-4" /> Sesuaikan Profil Sekolah
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Kelengkapan 4 Indikator Utama */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="text-slate-500 text-xs font-medium">Status Kelengkapan</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">15 / 15</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Siap Supervisi
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="text-slate-500 text-xs font-medium">Skor Perolehan</div>
                  <div className="text-2xl font-black text-sky-700 mt-1">{supervision.totalSkor} <span className="text-xs font-normal text-slate-400">/ 60</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Berdasarkan 15 Instrumen
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="text-slate-500 text-xs font-medium">Nilai Akhir Kelayakan</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{supervision.nilaiPersentase}%</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Predikat: {supervision.predikat}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="text-slate-500 text-xs font-medium">Mata Pelajaran Aktif</div>
                  <div className="text-base font-bold text-slate-900 mt-1 truncate">{profile.subject}</div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    {profile.phase} • {profile.grade}
                  </div>
                </div>
              </div>

              {/* Grid 15 Komponen Dokumen dengan Akses Cepat */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Daftar 15 Komponen Administrasi Guru</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Pilih salah satu dokumen untuk membuka pratinjau, mengedit isi, atau mencetak dokumen.</p>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    Format Standar Baku A4
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {menuList.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className="group p-3.5 border border-slate-200 hover:border-sky-500 hover:shadow-md rounded-xl cursor-pointer transition bg-slate-50/50 hover:bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <span className="w-7 h-7 flex items-center justify-center bg-sky-100 text-sky-800 rounded-lg text-xs font-bold group-hover:bg-sky-600 group-hover:text-white transition">
                            {item.no}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {item.group}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs mt-2.5 group-hover:text-sky-700 transition">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Siap Cetak
                          </span>
                          <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition text-sky-600 font-medium">
                            Buka <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUPERVISI RESMI */}
          {activeTab === 'supervision' && (
            <SupervisiChecklist
              record={supervision}
              profile={profile}
              onSave={handleSaveSupervision}
            />
          )}

          {/* TAB 1: ALOKASI WAKTU */}
          {activeTab === 'alokasiWaktu' && (
            <DocAlokasiWaktu
              data={documents.alokasiWaktu}
              profile={profile}
              onSave={(data) => handleSaveDocument('alokasiWaktu', data)}
            />
          )}

          {/* TAB 2: PROTA */}
          {activeTab === 'prota' && (
            <DocProta
              data={documents.prota}
              profile={profile}
              onSave={(data) => handleSaveDocument('prota', data)}
            />
          )}

          {/* TAB 3: PROMES */}
          {activeTab === 'promes' && (
            <DocPromes
              data={documents.promes}
              profile={profile}
              onSave={(data) => handleSaveDocument('promes', data)}
            />
          )}

          {/* TAB 4: ATP */}
          {activeTab === 'atp' && (
            <DocAtp
              data={documents.atp}
              profile={profile}
              onSave={(data) => handleSaveDocument('atp', data)}
            />
          )}

          {/* TAB 5: MODUL AJAR */}
          {activeTab === 'modulAjar' && (
            <DocModulAjar
              data={documents.modulAjar}
              profile={profile}
              onSave={(data) => handleSaveDocument('modulAjar', data)}
            />
          )}

          {/* TAB 6: JADWAL */}
          {activeTab === 'jadwalPelajaran' && (
            <DocJadwal
              data={documents.jadwalPelajaran}
              profile={profile}
              onSave={(data) => handleSaveDocument('jadwalPelajaran', data)}
            />
          )}

          {/* TAB 7: AGENDA HARIAN */}
          {activeTab === 'agendaHarian' && (
            <DocAgendaHarian
              data={documents.agendaHarian}
              profile={profile}
              onSave={(data) => handleSaveDocument('agendaHarian', data)}
            />
          )}

          {/* TAB 8: KKTP */}
          {activeTab === 'kktp' && (
            <DocKktp
              data={documents.kktp}
              profile={profile}
              onSave={(data) => handleSaveDocument('kktp', data)}
            />
          )}

          {/* TAB 9: DAFTAR HADIR */}
          {activeTab === 'daftarHadir' && (
            <DocDaftarHadir
              data={documents.daftarHadir}
              profile={profile}
              onSave={(data) => handleSaveDocument('daftarHadir', data)}
            />
          )}

          {/* TAB 10: DAFTAR NILAI */}
          {activeTab === 'daftarNilai' && (
            <DocDaftarNilai
              data={documents.daftarNilai}
              profile={profile}
              onSave={(data) => handleSaveDocument('daftarNilai', data)}
            />
          )}

          {/* TAB 11: KISI-KISI SOAL */}
          {activeTab === 'kisiKisiSoal' && (
            <DocKisiKisiSoal
              data={documents.kisiKisiSoal}
              profile={profile}
              onSave={(data) => handleSaveDocument('kisiKisiSoal', data)}
            />
          )}

          {/* TAB 12: ANALISIS EVALUASI */}
          {activeTab === 'analisisEvaluasi' && (
            <DocAnalisisEvaluasi
              data={documents.analisisEvaluasi}
              profile={profile}
              onSave={(data) => handleSaveDocument('analisisEvaluasi', data)}
            />
          )}

          {/* TAB 13: REMEDIAL */}
          {activeTab === 'programRemedial' && (
            <DocRemedial
              data={documents.programRemedial}
              profile={profile}
              onSave={(data) => handleSaveDocument('programRemedial', data)}
            />
          )}

          {/* TAB 14: PENGAYAAN */}
          {activeTab === 'programPengayaan' && (
            <DocPengayaan
              data={documents.programPengayaan}
              profile={profile}
              onSave={(data) => handleSaveDocument('programPengayaan', data)}
            />
          )}

          {/* TAB 15: LKPD */}
          {activeTab === 'lkpd' && (
            <DocLkpd
              data={documents.lkpd}
              profile={profile}
              onSave={(data) => handleSaveDocument('lkpd', data)}
            />
          )}
        </main>
      </div>

      {/* MODAL PROFIL SEKOLAH & GURU */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* MODAL REGULASI & KOMPONEN FLEKSIBEL */}
      <RegulationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        points={supervision.points}
        onSavePoints={(pts) => {
          handleSaveSupervision({ ...supervision, points: pts });
          showToast('Komponen regulasi berhasil diperbarui!');
        }}
        onResetDefault={() => {
          handleSaveSupervision({
            ...supervision,
            points: initialSupervisiRecord.points
          });
          showToast('Komponen regulasi direset ke 15 poin standar!');
        }}
      />
    </div>
  );
}
