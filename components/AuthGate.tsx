'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
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
  BookOpen
} from 'lucide-react';

interface AuthGateProps {
  onAuthenticated: () => void;
  onUseLocalMode: () => void;
  supabaseConfigured: boolean;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  onAuthenticated,
  onUseLocalMode,
  supabaseConfigured,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg('Konfigurasi Supabase (.env.local) belum tersedia.');
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          setErrorMsg(
            error.message === 'Invalid login credentials'
              ? 'Email atau kata sandi salah. Pastikan akun sudah terdaftar dan terverifikasi.'
              : error.message
          );
          return;
        }
        if (data.session) {
          onAuthenticated();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        if (data.session) {
          onAuthenticated();
        } else {
          setInfoMsg(
            'Pendaftaran berhasil! Silakan cek kotak masuk / folder spam email Anda untuk klik tautan konfirmasi, lalu kembali untuk Masuk.'
          );
          setMode('login');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi gangguan koneksi ke server autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800/40">
        {/* Kolom Kiri: Penjelasan Aplikasi Pribadi Guru */}
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
                    Data Anda terisolasi di Supabase dengan Row Level Security—hanya bisa diakses oleh akun Anda sendiri.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Database Cloud Gratis (Supabase)</p>
                  <p className="text-slate-400 text-[11px]">
                    Tersimpan otomatis di cloud PostgreSQL sehingga aman diakses dari laptop maupun perangkat lain.
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

        {/* Kolom Kanan: Form Masuk / Daftar */}
        <div className="p-7 md:p-9 flex flex-col justify-center">
          <div className="flex bg-slate-100 p-1 rounded-lg mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Daftar Guru Baru
            </button>
          </div>

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

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ulangi Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi"
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !supabaseConfigured}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Masuk ke Ruang Kerja Saya' : 'Buat Akun Pribadi Gratis'}
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
