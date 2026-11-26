'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SchoolProfile, AdministrasiDocuments, SupervisiRecord } from '@/lib/types';
import { initialProfile, initialDocuments, initialSupervisiRecord } from '@/lib/initialData';
import { getSupabaseBrowserClient, getSupabaseInfo } from '@/lib/supabase';
import { isDocumentFilled, countFilledDocuments, isProfileComplete, DocKey } from '@/lib/docStatus';

// Auth Gate
import { AuthGate } from '@/components/AuthGate';

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
  X,
  Database,
  RefreshCw,
  LogOut,
  AlertCircle
} from 'lucide-react';

export default function HomePage() {
  const supabaseInfo = getSupabaseInfo();

  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState<'none' | 'supabase' | 'local'>('none');
  const [accessToken, setAccessToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const [profile, setProfile] = useState<SchoolProfile>(initialProfile);
  const [documents, setDocuments] = useState<AdministrasiDocuments>(initialDocuments);
  const [supervision, setSupervision] = useState<SupervisiRecord>(initialSupervisiRecord);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status Database Supabase Cloud
  const [dbState, setDbState] = useState<{
    provider: string;
    host: string;
    connected: boolean;
    tableName: string;
    lastSynced: string | null;
  }>({
    provider: 'supabase',
    host: supabaseInfo.host || 'supabase.co',
    connected: false,
    tableName: 'supervisi_records',
    lastSynced: null,
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getStorageKey = useCallback(
    (uid?: string) => {
      if (mode === 'local') return 'sipen_guru_offline_data';
      return `sipen_guru_user_data_${uid || userId || 'anon'}`;
    },
    [mode, userId]
  );

  const syncLocal = useCallback(
    (p = profile, d = documents, s = supervision, uid?: string) => {
      try {
        localStorage.setItem(getStorageKey(uid), JSON.stringify({ profile: p, documents: d, supervision: s }));
      } catch {}
    },
    [profile, documents, supervision, getStorageKey]
  );

  const loadSupabaseData = useCallback(async (token: string, uid: string) => {
    setIsSyncing(true);
    try {
      const localKey = `sipen_guru_user_data_${uid}`;
      const cached = localStorage.getItem(localKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.documents) setDocuments(parsed.documents);
        if (parsed.supervision) setSupervision(parsed.supervision);
      }
    } catch {}

    try {
      const res = await fetch('/api/data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const nextProfile = json.data.profile || initialProfile;
          const nextDocs = json.data.documents || initialDocuments;
          const nextSup = json.data.supervision || initialSupervisiRecord;
          setProfile(nextProfile);
          setDocuments(nextDocs);
          setSupervision(nextSup);
          try {
            localStorage.setItem(
              `sipen_guru_user_data_${uid}`,
              JSON.stringify({ profile: nextProfile, documents: nextDocs, supervision: nextSup })
            );
          } catch {}
        }
        setDbState({
          provider: 'supabase',
          host: json.host || supabaseInfo.host,
          connected: true,
          tableName: json.tableName || 'supervisi_records',
          lastSynced: json.data?.updatedAt
            ? new Date(json.data.updatedAt).toLocaleTimeString('id-ID')
            : new Date().toLocaleTimeString('id-ID'),
        });
      } else {
        setDbState((prev) => ({ ...prev, connected: false }));
      }
    } catch {
      setDbState((prev) => ({ ...prev, connected: false }));
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [supabaseInfo.host]);

  const loadLocalModeData = useCallback(() => {
    try {
      const cached = localStorage.getItem('sipen_guru_offline_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        setProfile(parsed.profile || initialProfile);
        setDocuments(parsed.documents || initialDocuments);
        setSupervision(parsed.supervision || initialSupervisiRecord);
      } else {
        setProfile(initialProfile);
        setDocuments(initialDocuments);
        setSupervision(initialSupervisiRecord);
      }
    } catch {
      setProfile(initialProfile);
      setDocuments(initialDocuments);
      setSupervision(initialSupervisiRecord);
    }
    setDbState({
      provider: 'local',
      host: 'Penyimpanan Browser Lokal',
      connected: false,
      tableName: 'localStorage',
      lastSynced: new Date().toLocaleTimeString('id-ID'),
    });
    setIsLoading(false);
  }, []);

  // Cek sesi Supabase Auth atau mode lokal saat halaman dibuka
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let active = true;

    async function initAuth() {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        if (data.session) {
          setMode('supabase');
          setAccessToken(data.session.access_token);
          setUserId(data.session.user.id);
          setUserEmail(data.session.user.email || '');
          setAuthReady(true);
          await loadSupabaseData(data.session.access_token, data.session.user.id);
          return;
        }
      }

      const savedMode = localStorage.getItem('sipen_guru_mode');
      if (savedMode === 'local') {
        setMode('local');
        setAuthReady(true);
        loadLocalModeData();
        return;
      }

      setMode('none');
      setAuthReady(true);
      setIsLoading(false);
    }

    initAuth();

    if (supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          localStorage.removeItem('sipen_guru_mode');
          setMode('supabase');
          setAccessToken(session.access_token);
          setUserId(session.user.id);
          setUserEmail(session.user.email || '');
          loadSupabaseData(session.access_token, session.user.id);
        }
      });
      return () => {
        active = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      active = false;
    };
  }, [loadSupabaseData, loadLocalModeData]);

  const handleAuthenticated = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    localStorage.removeItem('sipen_guru_mode');
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setMode('supabase');
      setAccessToken(data.session.access_token);
      setUserId(data.session.user.id);
      setUserEmail(data.session.user.email || '');
      await loadSupabaseData(data.session.access_token, data.session.user.id);
    }
  };

  const handleUseLocalMode = () => {
    localStorage.setItem('sipen_guru_mode', 'local');
    setMode('local');
    loadLocalModeData();
  };

  const handleLogout = async () => {
    if (mode === 'supabase') {
      const supabase = getSupabaseBrowserClient();
      if (supabase) await supabase.auth.signOut();
    } else {
      localStorage.removeItem('sipen_guru_mode');
    }
    setAccessToken('');
    setUserId('');
    setUserEmail('');
    setProfile(initialProfile);
    setDocuments(initialDocuments);
    setSupervision(initialSupervisiRecord);
    setMode('none');
    setActiveTab('dashboard');
  };

  const postToSupabase = async (body: any): Promise<boolean> => {
    if (mode !== 'supabase' || !accessToken) return false;
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  };

  const refreshFromSupabase = async () => {
    if (mode !== 'supabase' || !accessToken || !userId) {
      showToast('Saat ini Anda menggunakan Mode Offline Lokal Browser.');
      return;
    }
    await loadSupabaseData(accessToken, userId);
    showToast('Data pribadi berhasil disinkronkan ulang dari Supabase!');
  };

  const handleSaveProfile = async (updated: SchoolProfile) => {
    setProfile(updated);
    syncLocal(updated, documents, supervision);
    if (mode === 'supabase') {
      setIsSyncing(true);
      try {
        const ok = await postToSupabase({ action: 'update_profile', payload: updated });
        setDbState((prev) => ({ ...prev, connected: ok, lastSynced: new Date().toLocaleTimeString('id-ID') }));
        showToast(ok ? 'Profil tersimpan di Supabase Cloud!' : 'Profil tersimpan lokal (gagal sinkron ke cloud)');
      } catch {
        showToast('Profil tersimpan di browser (koneksi offline)');
      } finally {
        setIsSyncing(false);
      }
    } else {
      showToast('Profil tersimpan di browser lokal!');
    }
  };

  const handleSaveDocument = async (docKey: keyof AdministrasiDocuments, data: any) => {
    const updatedDocs = { ...documents, [docKey]: data };
    setDocuments(updatedDocs);
    syncLocal(profile, updatedDocs, supervision);
    if (mode === 'supabase') {
      setIsSyncing(true);
      try {
        const ok = await postToSupabase({ action: 'update_document', payload: { docKey, data } });
        setDbState((prev) => ({ ...prev, connected: ok, lastSynced: new Date().toLocaleTimeString('id-ID') }));
        showToast(ok ? 'Dokumen tersimpan di Supabase Cloud!' : 'Dokumen tersimpan lokal (gagal sinkron ke cloud)');
      } catch {
        showToast('Dokumen tersimpan di browser (koneksi offline)');
      } finally {
        setIsSyncing(false);
      }
    } else {
      showToast('Dokumen tersimpan di browser lokal!');
    }
  };

  const handleSaveSupervision = async (updated: SupervisiRecord) => {
    setSupervision(updated);
    syncLocal(profile, documents, updated);
    if (mode === 'supabase') {
      setIsSyncing(true);
      try {
        const ok = await postToSupabase({ action: 'update_supervision', payload: updated });
        setDbState((prev) => ({ ...prev, connected: ok, lastSynced: new Date().toLocaleTimeString('id-ID') }));
        showToast(ok ? 'Penilaian supervisi tersimpan di Supabase Cloud!' : 'Penilaian tersimpan lokal');
      } catch {
        showToast('Penilaian supervisi tersimpan di browser');
      } finally {
        setIsSyncing(false);
      }
    } else {
      showToast('Penilaian supervisi tersimpan di browser lokal!');
    }
  };

  const handleResetData = async () => {
    if (confirm('Kosongkan seluruh isian profil & 15 dokumen kembali ke formulir kosong siap isi?')) {
      setProfile(initialProfile);
      setDocuments(initialDocuments);
      setSupervision(initialSupervisiRecord);
      localStorage.removeItem(getStorageKey());
      if (mode === 'supabase') {
        setIsSyncing(true);
        try {
          await postToSupabase({ action: 'reset' });
          setDbState((prev) => ({ ...prev, lastSynced: new Date().toLocaleTimeString('id-ID') }));
          showToast('Seluruh data dikosongkan ke formulir awal di Supabase!');
        } catch {
          showToast('Data dikosongkan secara lokal.');
        } finally {
          setIsSyncing(false);
        }
      } else {
        showToast('Seluruh data dikosongkan ke formulir awal!');
      }
    }
  };

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

  const filledCount = countFilledDocuments(documents);
  const profileComplete = isProfileComplete(profile);
  const maxSupervisiSkor = (supervision.points?.length || 15) * 4;

  if (!authReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-semibold text-sm text-slate-300">Menyiapkan Ruang Kerja Pribadi Guru...</p>
        </div>
      </div>
    );
  }

  if (mode === 'none') {
    return (
      <AuthGate
        onAuthenticated={handleAuthenticated}
        onUseLocalMode={handleUseLocalMode}
        supabaseConfigured={supabaseInfo.configured}
      />
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

      {/* TOP BAR / HEADER */}
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
                    Pribadi Guru
                  </span>
                  <div
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border transition cursor-pointer ${
                      mode === 'supabase' && dbState.connected
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/40 shadow-sm hover:bg-emerald-900/80'
                        : 'bg-amber-950/70 text-amber-300 border-amber-600/40'
                    }`}
                    onClick={refreshFromSupabase}
                    title={mode === 'supabase' ? `Supabase (${dbState.host}) | Klik untuk sinkronkan ulang` : 'Mode Penyimpanan Lokal Browser'}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSyncing
                          ? 'bg-amber-400 animate-spin'
                          : mode === 'supabase' && dbState.connected
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-amber-400'
                      }`}
                    ></span>
                    <span className="font-semibold tracking-wide">
                      {isSyncing ? 'Sinkronisasi...' : mode === 'supabase' && dbState.connected ? 'Supabase Pribadi' : 'Lokal Browser'}
                    </span>
                    {dbState.lastSynced && (
                      <span className="text-[9px] text-slate-400 border-l border-slate-700 pl-1.5 ml-0.5">
                        {dbState.lastSynced}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {userEmail ? `Akun: ${userEmail}` : 'Aplikasi Administrasi 15 Poin Supervisi Akademik Guru'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col text-right pr-3 border-r border-slate-800 text-xs">
              <span className="font-semibold text-slate-200">{profile.teacherName || 'Nama Guru Belum Diisi'}</span>
              <span className="text-[10px] text-slate-400">
                {profile.subject || 'Mapel -'} • {profile.grade || 'Kelas -'} ({profile.schoolName || 'Sekolah -'})
              </span>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium border border-slate-700 transition"
              title="Pengaturan Profil Guru & Sekolah"
            >
              <School className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Profil</span>
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
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 rounded text-xs font-medium border border-slate-700 transition"
              title={mode === 'supabase' ? 'Keluar Akun' : 'Masuk ke Akun Supabase'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{mode === 'supabase' ? 'Keluar' : 'Login'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
        {/* SIDEBAR */}
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

          {/* Quick Menu */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 space-y-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard &amp; Kesiapan Supervisi</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('supervision');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'supervision' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
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

          {/* 15 Komponen Dokumen */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                15 Dokumen Administrasi
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  filledCount === 15 ? 'text-emerald-700 bg-emerald-50' : 'text-sky-700 bg-sky-50'
                }`}
              >
                {filledCount}/15 Terisi
              </span>
            </div>

            <div className="space-y-1 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
              {menuList.map((item) => {
                const isActive = activeTab === item.id;
                const filled = isDocumentFilled(item.id as DocKey, documents);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition ${
                      isActive
                        ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold shrink-0 ${
                        isActive
                          ? 'bg-sky-600 text-white'
                          : filled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.no}
                    </span>
                    <span className="truncate flex-1">{item.title}</span>
                    {filled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Database Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" /> Penyimpanan Data
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  mode === 'supabase' && dbState.connected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {mode === 'supabase' && dbState.connected ? 'Supabase Aktif' : 'Lokal'}
              </span>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] space-y-1 font-mono text-slate-600">
              <div className="truncate"><strong className="text-slate-800">Mode:</strong> {mode === 'supabase' ? 'Supabase Cloud' : 'Browser Lokal'}</div>
              <div className="truncate" title={dbState.host}><strong className="text-slate-800">Host:</strong> {dbState.host}</div>
              {userEmail && <div className="truncate" title={userEmail}><strong className="text-slate-800">User:</strong> {userEmail}</div>}
              {dbState.lastSynced && (
                <div className="text-[10px] text-emerald-700 font-sans mt-1">
                  ✓ Sinkron: {dbState.lastSynced}
                </div>
              )}
            </div>

            {mode === 'supabase' ? (
              <button
                onClick={refreshFromSupabase}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 rounded text-xs transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Ulang Supabase'}
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded text-xs font-semibold transition"
              >
                <Database className="w-3.5 h-3.5" /> Hubungkan ke Akun Supabase
              </button>
            )}
          </div>

          {/* Backup & Reset */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cadangan &amp; Pemulihan</span>
            <button
              onClick={() => {
                const dataToExport = { profile, documents, supervision, exportDate: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Administrasi_Supervisi_${(profile.subject || 'Guru').replace(/\s+/g, '_')}.json`;
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
                        if (mode === 'supabase') {
                          await postToSupabase({ action: 'import_all', payload: parsed });
                        }
                        showToast('Data administrasi berhasil dipulihkan!');
                      } else {
                        alert('Format berkas backup JSON tidak valid.');
                      }
                    } catch {
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
              <RotateCcw className="w-3.5 h-3.5" /> Kosongkan Semua Data
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Ruang Kerja Pribadi Guru • Kurikulum Merdeka
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">
                    Selamat Datang di SIPEN-GURU{profile.teacherName ? `, ${profile.teacherName}` : ''}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                    Seluruh formulir <strong>15 Poin Administrasi Supervisi</strong> dimulai dalam keadaan kosong siap diisi sesuai kelas dan mata pelajaran Anda sendiri. Setiap poin dilengkapi <strong>Referensi Kurikulum Merdeka</strong>, fitur tarik data antar-dokumen, serta format cetak resmi A4.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition flex items-center gap-1.5"
                    >
                      <School className="w-4 h-4" /> {profileComplete ? 'Ubah Profil Sekolah & Guru' : '1. Lengkapi Profil Sekolah & Guru'}
                    </button>
                    <button
                      onClick={() => setActiveTab('supervision')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-xs backdrop-blur-sm transition border border-white/20 flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" /> Instrumen Supervisi ({supervision.nilaiPersentase}%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Peringatan Profil Belum Lengkap */}
              {!profileComplete && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 p-4 rounded-xl border border-amber-300 text-amber-950">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-bold">Langkah Pertama: Lengkapi Profil Sekolah &amp; Guru</h4>
                      <p className="text-amber-800 mt-0.5">
                        Nama Sekolah, Nama Guru, dan Mata Pelajaran masih kosong. Isi sekali di menu Profil agar Kop Surat &amp; Tanda Tangan pada ke-15 dokumen terisi otomatis.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shrink-0 transition"
                  >
                    Isi Profil Sekarang
                  </button>
                </div>
              )}

              {/* Status Kelengkapan 4 Indikator Utama */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="text-slate-500 text-xs font-medium">Progres Pengisian</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{filledCount} / 15</div>
                  <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${filledCount === 15 ? 'text-emerald-600' : 'text-sky-600'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {Math.round((filledCount / 15) * 100)}% Dokumen Terisi
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="text-slate-500 text-xs font-medium">Skor Supervisi</div>
                  <div className="text-2xl font-black text-sky-700 mt-1">
                    {supervision.totalSkor} <span className="text-xs font-normal text-slate-400">/ {maxSupervisiSkor}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Berdasarkan {supervision.points?.length || 15} Instrumen
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
                  <div className="text-base font-bold text-slate-900 mt-1 truncate">{profile.subject || 'Belum diisi'}</div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    {profile.phase || '-'} • {profile.grade || '-'}
                  </div>
                </div>
              </div>

              {/* Grid 15 Komponen Dokumen */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Daftar 15 Komponen Administrasi Guru</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Pilih dokumen untuk mulai mengisi, melihat referensi Kurikulum Merdeka, atau mencetak A4.</p>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    Format Standar Baku A4
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {menuList.map((item) => {
                    const filled = isDocumentFilled(item.id as DocKey, documents);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className="group p-3.5 border border-slate-200 hover:border-sky-500 hover:shadow-md rounded-xl cursor-pointer transition bg-slate-50/50 hover:bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition ${
                              filled
                                ? 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white'
                                : 'bg-sky-100 text-sky-800 group-hover:bg-sky-600 group-hover:text-white'
                            }`}
                          >
                            {item.no}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.group}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs mt-2.5 group-hover:text-sky-700 transition">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between mt-3 text-[11px]">
                          {filled ? (
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Sudah Diisi
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">
                              Belum Diisi
                            </span>
                          )}
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

          {activeTab === 'supervision' && (
            <SupervisiChecklist
              record={supervision}
              profile={profile}
              documents={documents}
              onSave={handleSaveSupervision}
            />
          )}

          {activeTab === 'alokasiWaktu' && (
            <DocAlokasiWaktu
              data={documents.alokasiWaktu}
              profile={profile}
              onSave={(data) => handleSaveDocument('alokasiWaktu', data)}
            />
          )}

          {activeTab === 'prota' && (
            <DocProta
              data={documents.prota}
              profile={profile}
              alokasiWaktu={documents.alokasiWaktu}
              atpList={documents.atp}
              onSave={(data) => handleSaveDocument('prota', data)}
            />
          )}

          {activeTab === 'promes' && (
            <DocPromes
              data={documents.promes}
              profile={profile}
              protaList={documents.prota}
              onSave={(data) => handleSaveDocument('promes', data)}
            />
          )}

          {activeTab === 'atp' && (
            <DocAtp
              data={documents.atp}
              profile={profile}
              protaList={documents.prota}
              onSave={(data) => handleSaveDocument('atp', data)}
            />
          )}

          {activeTab === 'modulAjar' && (
            <DocModulAjar
              data={documents.modulAjar}
              profile={profile}
              atpList={documents.atp}
              onSave={(data) => handleSaveDocument('modulAjar', data)}
            />
          )}

          {activeTab === 'jadwalPelajaran' && (
            <DocJadwal
              data={documents.jadwalPelajaran}
              profile={profile}
              onSave={(data) => handleSaveDocument('jadwalPelajaran', data)}
            />
          )}

          {activeTab === 'agendaHarian' && (
            <DocAgendaHarian
              data={documents.agendaHarian}
              profile={profile}
              atpList={documents.atp}
              jadwalList={documents.jadwalPelajaran}
              onSave={(data) => handleSaveDocument('agendaHarian', data)}
            />
          )}

          {activeTab === 'kktp' && (
            <DocKktp
              data={documents.kktp}
              profile={profile}
              atpList={documents.atp}
              onSave={(data) => handleSaveDocument('kktp', data)}
            />
          )}

          {activeTab === 'daftarHadir' && (
            <DocDaftarHadir
              data={documents.daftarHadir}
              profile={profile}
              onSave={(data) => handleSaveDocument('daftarHadir', data)}
            />
          )}

          {activeTab === 'daftarNilai' && (
            <DocDaftarNilai
              data={documents.daftarNilai}
              profile={profile}
              daftarHadirList={documents.daftarHadir}
              onSave={(data) => handleSaveDocument('daftarNilai', data)}
            />
          )}

          {activeTab === 'kisiKisiSoal' && (
            <DocKisiKisiSoal
              data={documents.kisiKisiSoal}
              profile={profile}
              atpList={documents.atp}
              onSave={(data) => handleSaveDocument('kisiKisiSoal', data)}
            />
          )}

          {activeTab === 'analisisEvaluasi' && (
            <DocAnalisisEvaluasi
              data={documents.analisisEvaluasi}
              profile={profile}
              daftarNilaiList={documents.daftarNilai}
              onSave={(data) => handleSaveDocument('analisisEvaluasi', data)}
            />
          )}

          {activeTab === 'programRemedial' && (
            <DocRemedial
              data={documents.programRemedial}
              profile={profile}
              daftarNilaiList={documents.daftarNilai}
              onSave={(data) => handleSaveDocument('programRemedial', data)}
            />
          )}

          {activeTab === 'programPengayaan' && (
            <DocPengayaan
              data={documents.programPengayaan}
              profile={profile}
              daftarNilaiList={documents.daftarNilai}
              onSave={(data) => handleSaveDocument('programPengayaan', data)}
            />
          )}

          {activeTab === 'lkpd' && (
            <DocLkpd
              data={documents.lkpd}
              profile={profile}
              onSave={(data) => handleSaveDocument('lkpd', data)}
            />
          )}
        </main>
      </div>

      {/* MODAL PROFIL */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* MODAL REGULASI */}
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
