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
            {/* Ruang Tanda Tangan & Cap */}
            <span className="text-[10px] text-slate-300 italic print:hidden">(Tanda Tangan & Cap)</span>
          </div>
          <p className="font-bold underline uppercase">{profile.headmasterName || '........................................'}</p>
          <p className="text-slate-700 text-xs mt-0.5">NIP. {profile.headmasterNip || '........................................'}</p>
        </div>

        {/* Pihak 2: Pengawas Sekolah (Jika Supervisi) */}
        {withSupervisor && (
          <div className="text-center w-1/3">
            <p className="font-semibold">Menyetujui,</p>
            <p className="font-semibold">Pengawas Sekolah / Supervisor</p>
            <div className="h-20 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic print:hidden">(Tanda Tangan)</span>
            </div>
            <p className="font-bold underline uppercase">{profile.supervisorName || '........................................'}</p>
            <p className="text-slate-700 text-xs mt-0.5">NIP. {profile.supervisorNip || '........................................'}</p>
          </div>
        )}

        {/* Pihak 3: Guru Mata Pelajaran */}
        <div className="text-center w-1/3">
          <p>{profile.city || 'Kota'}, {profile.documentDate || '........................'}</p>
          <p className="font-semibold">Guru Mata Pelajaran {profile.subject}</p>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[10px] text-slate-300 italic print:hidden">(Tanda Tangan)</span>
          </div>
          <p className="font-bold underline uppercase">{profile.teacherName || '........................................'}</p>
          <p className="text-slate-700 text-xs mt-0.5">NIP. {profile.teacherNip || '........................................'}</p>
        </div>
      </div>
    </div>
  );
};
