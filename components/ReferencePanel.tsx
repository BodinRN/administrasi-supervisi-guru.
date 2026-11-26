'use client';

import React, { useState } from 'react';
import { DOC_REFERENCES } from '@/lib/references';
import { DocKey } from '@/lib/docStatus';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, CheckCircle2, Link2, Lightbulb } from 'lucide-react';

interface ReferencePanelProps {
  docKey: DocKey;
  onLoadExample?: () => void;
  extraContent?: React.ReactNode;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({
  docKey,
  onLoadExample,
  extraContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = DOC_REFERENCES[docKey];

  if (!ref) return null;

  return (
    <div className="no-print mb-5 rounded-lg border border-indigo-200 bg-indigo-50/60 text-xs overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-indigo-100/70 border-b border-indigo-200/70">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 font-bold text-indigo-950 hover:text-indigo-700 transition text-left"
        >
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Referensi &amp; Panduan Pengisian (Kurikulum Merdeka)</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {onLoadExample && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Muat contoh referensi ke dokumen ini? Data yang sudah Anda isi pada dokumen ini akan diganti dengan contoh referensi agar mudah dipelajari/diedit.')) {
                onLoadExample();
              }
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-300 rounded font-semibold text-[11px] transition"
            title="Isi dokumen ini dengan contoh referensi agar mudah dipelajari"
          >
            <Sparkles className="w-3 h-3" /> Muat Contoh Referensi
          </button>
        )}
      </div>

      {isOpen && (
        <div className="p-3.5 space-y-3 text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-2.5 rounded border border-indigo-100">
              <p className="font-bold text-indigo-900 mb-1">Dasar Regulasi &amp; Fungsi</p>
              <p className="text-[11px] font-semibold text-indigo-700 mb-1">{ref.regulasi}</p>
              <p className="text-[11px] text-slate-600">{ref.tujuan}</p>
            </div>

            <div className="bg-white p-2.5 rounded border border-indigo-100">
              <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kriteria Skor 4 (Supervisi)
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                {ref.syaratSkor4.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-2.5 rounded border border-indigo-100">
              <p className="font-bold text-sky-900 mb-1 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-sky-600" /> Keterkaitan Antar-Dokumen
              </p>
              <p className="text-[11px] text-slate-600">{ref.hubunganDokumen}</p>
            </div>

            <div className="bg-white p-2.5 rounded border border-indigo-100">
              <p className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Tips Pengisian
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                {ref.tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {extraContent && (
            <div className="bg-white p-2.5 rounded border border-indigo-100">
              {extraContent}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
