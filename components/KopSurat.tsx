'use client';

import React from 'react';
import { SchoolProfile } from '@/lib/types';

interface KopSuratProps {
  profile: SchoolProfile;
  judulDokumen: string;
  nomorDokumen?: string;
  subJudul?: string;
}

export const KopSurat: React.FC<KopSuratProps> = ({
  profile,
  judulDokumen,
  nomorDokumen,
  subJudul
}) => {
  const line1 =
    profile.headerLine1?.trim() ||
    (profile.province?.trim() ? `PEMERINTAH ${profile.province.toUpperCase()}` : 'PEMERINTAH PROVINSI / KABUPATEN / YAYASAN');
  const line2 =
    profile.headerLine2?.trim() || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';

  const addressParts = [
    profile.schoolAddress?.trim(),
    profile.district?.trim(),
    profile.city?.trim(),
    profile.postalCode?.trim() ? `Kode Pos ${profile.postalCode.trim()}` : ''
  ].filter(Boolean);

  const hasAnyLogo = Boolean(profile.logoLeft || profile.logoRight);

  return (
    <div className="w-full mb-6">
      {/* Header Kop Surat Standar Dinas Pendidikan */}
      <div className="relative pb-3 border-b-2 border-black">
        <div className={hasAnyLogo ? 'flex items-center justify-between gap-3 md:gap-4' : 'text-center'}>
          {hasAnyLogo && (
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center">
              {profile.logoLeft && (
                <img
                  src={profile.logoLeft}
                  alt="Logo Kiri Kop Surat"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          )}

          <div className="flex-1 text-center min-w-0">
            <div className="uppercase tracking-wide text-xs md:text-sm font-semibold text-slate-700">
              {line1}
            </div>
            <div className="uppercase tracking-wide text-xs md:text-sm font-semibold text-slate-700">
              {line2}
            </div>
            <div className="uppercase text-lg md:text-xl font-extrabold text-slate-900 tracking-wider my-0.5">
              {profile.schoolName?.trim() || 'NAMA SATUAN PENDIDIKAN (ISI DI PROFIL)'}
            </div>
            <div className="text-[11px] md:text-xs text-slate-600">
              {addressParts.length > 0 ? addressParts.join(' • ') : 'Alamat Satuan Pendidikan'}
            </div>
            {(profile.npsn || profile.schoolEmail || profile.schoolWebsite) && (
              <div className="text-[10px] md:text-xs text-slate-500 space-x-3 mt-0.5">
                {profile.npsn && <span>NPSN: <strong>{profile.npsn}</strong></span>}
                {profile.schoolEmail && <span>Surel: {profile.schoolEmail}</span>}
                {profile.schoolWebsite && <span>Laman: {profile.schoolWebsite}</span>}
              </div>
            )}
          </div>

          {hasAnyLogo && (
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center">
              {profile.logoRight && (
                <img
                  src={profile.logoRight}
                  alt="Logo Kanan Kop Surat"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          )}
        </div>

        {/* Garis Ganda Standar Kop Surat Resmi (Tebal & Tipis) */}
        <div className="absolute -bottom-[3px] left-0 right-0 border-b border-black"></div>
      </div>

      {/* Judul Dokumen Administrasi */}
      <div className="text-center mt-5 mb-4">
        <h1 className="text-base md:text-lg font-bold uppercase tracking-wide text-slate-900">
          {judulDokumen}
        </h1>
        {subJudul && (
          <p className="text-xs md:text-sm font-medium text-slate-600 mt-0.5">
            {subJudul}
          </p>
        )}
        {nomorDokumen && (
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Nomor: {nomorDokumen}
          </p>
        )}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-2 px-3 py-1 bg-slate-100 rounded text-[11px] font-medium text-slate-700 border border-slate-200 print:bg-transparent print:border-none">
          <span>Tahun Ajaran: <strong>{profile.academicYear || '-'}</strong></span>
          <span>•</span>
          <span>Semester: <strong>{profile.semester || '-'}</strong></span>
          <span>•</span>
          <span>Fase/Kelas: <strong>{profile.phase || '-'} / {profile.grade || '-'}</strong></span>
        </div>
      </div>
    </div>
  );
};
