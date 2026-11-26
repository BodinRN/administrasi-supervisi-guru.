'use client';

import React from 'react';
import { SchoolProfile } from '@/lib/types';

interface TandaTanganProps {
  profile: SchoolProfile;
  withSupervisor?: boolean;
}

export const TandaTangan: React.FC<TandaTanganProps> = ({
  profile,
  withSupervisor = false
}) => {
  return (
    <div className="w-full mt-10 text-xs md:text-sm text-slate-900 page-break-avoid">
      <div className="flex justify-between items-start gap-6">
        {/* Pihak 1: Kepala Sekolah */}
        <div className="text-center w-1/3">
          <p className="font-semibold">Mengetahui,</p>
          <p className="font-semibold">Kepala Sekolah</p>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[10px] text-slate-300 italic print:hidden">(Tanda Tangan &amp; Cap)</span>
          </div>
          <p className="font-bold underline uppercase">
            {profile.headmasterName?.trim() || '........................................'}
          </p>
          <p className="text-slate-700 text-xs mt-0.5">
            NIP. {profile.headmasterNip?.trim() || '........................................'}
          </p>
        </div>

        {/* Pihak 2: Pengawas Sekolah (Jika Supervisi) */}
        {withSupervisor && (
          <div className="text-center w-1/3">
            <p className="font-semibold">Menyetujui,</p>
            <p className="font-semibold">Pengawas Sekolah / Supervisor</p>
            <div className="h-20 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic print:hidden">(Tanda Tangan)</span>
            </div>
            <p className="font-bold underline uppercase">
              {profile.supervisorName?.trim() || '........................................'}
            </p>
            <p className="text-slate-700 text-xs mt-0.5">
              NIP. {profile.supervisorNip?.trim() || '........................................'}
            </p>
          </div>
        )}

        {/* Pihak 3: Guru Mata Pelajaran */}
        <div className="text-center w-1/3">
          <p>
            {profile.city?.trim() || '........................'},{' '}
            {profile.documentDate?.trim() || '........................'}
          </p>
          <p className="font-semibold">
            Guru {profile.subject?.trim() ? `Mata Pelajaran ${profile.subject}` : 'Mata Pelajaran / Kelas'}
          </p>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[10px] text-slate-300 italic print:hidden">(Tanda Tangan)</span>
          </div>
          <p className="font-bold underline uppercase">
            {profile.teacherName?.trim() || '........................................'}
          </p>
          <p className="text-slate-700 text-xs mt-0.5">
            NIP. {profile.teacherNip?.trim() || '........................................'}
          </p>
        </div>
      </div>
    </div>
  );
};
