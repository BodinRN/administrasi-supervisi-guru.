'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  ShieldCheck,
  Database,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  HardDrive,
  AlertCircle,
  CheckCircle2,
  Loader2,
  BookOpen,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

interface AuthGateProps {
  onAuthenticated: () => void;
  onUseLocalMode: () => void;
  firebaseConfigured: boolean;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  onAuthenticated,
  onUseLocalMode,
  firebaseConfigured,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!firebaseConfigured) {
      setErrorMsg('Konfigurasi Firebase (.env.local) belum tersedia.');
      return;
    }

    if (mode === 'reset') {
      if (!email.trim()) {
        setErrorMsg('Masukkan alamat email Anda terlebih dahulu.');
        return;
      }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email.trim());
        setInfoMsg(
          'Tautan ganti kata sandi telah dikirim ke email Anda. Periksa kotak masuk atau folder spam, lalu ikuti instruksi untuk membuat kata sandi baru.'
        );
      } catch (err: any) {
        const code = err?.code || '';
        if (code === 'auth/user-not-found') {
          setErrorMsg('Email ini belum terdaftar. Silakan daftar akun baru terlebih dahulu.');
        } else if (code === 'auth/invalid-email') {
          setErrorMsg('Format alamat email tidak valid.');
        } else if (code === 'auth/too-many-requests') {
          setErrorMsg('Terlalu banyak permintaan. Coba lagi beberapa saat.');
        } else {
          setErrorMsg(err?.message || 'Gagal mengirim email ganti kata sandi.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        onAuthenticated();
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (user) {
          // Firebase biasanya langsung aktif tanpa perlu verifikasi email
          // (email verification bersifat opsional)
          onAuthenticated();
        }
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg('Email atau kata sandi salah. Pastikan akun sudah terdaftar.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('Terlalu banyak percobaan login. Coba lagi beberapa saat.');
      } else {
        setErrorMsg(err?.message || 'Terjadi gangguan koneksi ke server autentikasi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800/40">
        {/* Kolom Kiri: Penjelasan Aplikasi */}
        <div className="bg-slate-900 text-white p-7 md:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-inner">
                SP
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight leading-tight">SIPEN-GURU</h1>
                <p className="text-[11px] text-sky-300 font-medium">Administrasi Supervisi Pribadi Guru</p>
              </div>
            </div>

            <h2 className="text-xl font-bold leading-snug mb-3">
              Kelola 15 Perangkat Supervisi Secara Pribadi &amp; Terstruktur
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Setiap guru memiliki ruang kerja dan database pribadi. Semua dokumen dimulai dari{' '}
              <strong className="text-white">formulir kosong siap isi</strong> (bukan data contoh sekolah lain),
              dilengkapi panduan referensi Kurikulum Merdeka dan format cetak A4 resmi.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Privasi Terjaga (Per-Guru)</p>
                  <p className="text-slate-400 text-[11px]">
                    Data Anda terisolasi di Firebase dengan Security Rules—hanya bisa diakses oleh akun Anda sendiri.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Database Cloud Gratis (Firebase)</p>
                  <p className="text-slate-400 text-[11px]">
                    Tersimpan otomatis di Cloud Firestore sehingga aman diakses dari laptop maupun perangkat lain.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Referensi Terhubung Antar 15 Poin</p>
                  <p className="text-slate-400 text-[11px]">
                    TP dari PROTA/ATP, daftar siswa dari Presensi, hingga hasil Nilai &amp; Analisis terintegrasi otomatis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Standar Kurikulum Merdeka • Format Cetak Dinas A4
          </div>
        </div>

        {/* Kolom Kanan: Form Masuk / Daftar / Reset Password */}
        <div className="p-7 md:p-9 flex flex-col justify-center">
          {mode === 'reset' ? (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); setInfoMsg(null); }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Masuk Akun
              </button>
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Ganti / Reset Kata Sandi</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengatur kata sandi baru.
              </p>
            </div>
          ) : (
            <div className="flex bg-slate-100 p-1 rounded-lg mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); setInfoMsg(null); }}
                className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); setInfoMsg(null); }}
                className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Daftar Guru Baru
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Pribadi Guru</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@guru.belajar.id atau email pribadi"
                  className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold">Kata Sandi</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setErrorMsg(null); setInfoMsg(null); }}
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                    >
                      Lupa / Ganti kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-10 py-2 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ulangi Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi"
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-10 py-2 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Sembunyikan ulangi kata sandi' : 'Lihat ulangi kata sandi'}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !firebaseConfigured}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login'
                ? 'Masuk ke Ruang Kerja Saya'
                : mode === 'register'
                ? 'Buat Akun Pribadi Gratis'
                : 'Kirim Tautan Ganti Kata Sandi'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="px-2 bg-white text-slate-400">atau gunakan tanpa login</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onUseLocalMode}
            className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-2"
          >
            <HardDrive className="w-4 h-4 text-slate-500" />
            Mode Offline / Simpan Lokal di Browser Ini
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Pada mode lokal, data hanya tersimpan di peramban perangkat ini dan dapat dicadangkan via file JSON.
          </p>
        </div>
      </div>
    </div>
  );
};
