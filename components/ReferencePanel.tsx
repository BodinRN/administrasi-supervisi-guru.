'use client';

import React, { useState } from 'react';
import { DOC_REFERENCES } from '@/lib/references';
import { exampleDocuments } from '@/lib/exampleData';
import { DocKey } from '@/lib/docStatus';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Link2,
  Lightbulb,
  Eye,
  X,
  FileText,
} from 'lucide-react';

interface ReferencePanelProps {
  docKey: DocKey;
  onLoadExample?: () => void;
  extraContent?: React.ReactNode;
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function renderTemplateValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-400 italic">-</span>;
  }
  if (typeof value === 'boolean') {
    return <span>{value ? 'Ya / Selesai' : 'Belum'}</span>;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return <span className="text-slate-800 whitespace-pre-line">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-400 italic">Kosong</span>;
    if (typeof value[0] !== 'object') {
      return (
        <ul className="list-disc list-inside space-y-0.5 text-slate-700">
          {value.map((item, i) => (
            <li key={i}>{String(item)}</li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-2 mt-1">
        {value.map((item, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1">
            <div className="text-[10px] font-bold text-indigo-700 uppercase">Item #{idx + 1}</div>
            {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] border-t border-slate-100 pt-1">
                <span className="font-semibold text-slate-600">{formatFieldLabel(k)}</span>
                <div className="sm:col-span-2">{renderTemplateValue(v)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === 'object') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1.5 mt-1">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] border-t border-slate-100 first:border-t-0 pt-1 first:pt-0">
            <span className="font-semibold text-slate-600">{formatFieldLabel(k)}</span>
            <div className="sm:col-span-2">{renderTemplateValue(v)}</div>
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
}

export const ReferencePanel: React.FC<ReferencePanelProps> = ({
  docKey,
  onLoadExample,
  extraContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const ref = DOC_REFERENCES[docKey];
  const exampleTemplate = exampleDocuments[docKey];

  if (!ref) return null;

  return (
    <>
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

          <div className="flex flex-wrap items-center gap-1.5">
            {exampleTemplate && (
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-sky-600 hover:text-white text-sky-700 border border-sky-300 rounded font-semibold text-[11px] transition"
                title="Lihat contoh template isian sebagai acuan tanpa mengubah data Anda"
              >
                <Eye className="w-3 h-3" /> Lihat Template Acuan
              </button>
            )}

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

      {/* Modal Preview Template Acuan */}
      {showTemplateModal && exampleTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">
                    Template Acuan Pengisian: {formatFieldLabel(docKey)}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Contoh isian standar Kurikulum Merdeka — aman dilihat tanpa mengubah data Anda.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                aria-label="Tutup modal template"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-sky-900 text-[11px]">
                <strong>Catatan:</strong> Contoh di bawah ini menggunakan mata pelajaran <em>Informatika Fase D (Kelas VII)</em> sebagai acuan format, struktur kalimat, dan kedalaman isi yang diharapkan dalam supervisi akademik.
              </div>
              {renderTemplateValue(exampleTemplate)}
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
              <span className="text-[11px] text-slate-500">
                Ingin langsung memakai contoh ini sebagai kerangka awal?
              </span>
              <div className="flex items-center gap-2">
                {onLoadExample && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Terapkan template acuan ini ke dokumen? Data yang sudah diisi pada dokumen ini akan diganti dengan contoh acuan.')) {
                        onLoadExample();
                        setShowTemplateModal(false);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Terapkan ke Dokumen Ini
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
