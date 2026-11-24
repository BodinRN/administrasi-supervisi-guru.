'use client';

import React, { useState } from 'react';
import { SupervisiPoint } from '@/lib/types';
import { X, Settings, Plus, Trash2, Download, Upload, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  points: SupervisiPoint[];
  onSavePoints: (points: SupervisiPoint[]) => void;
  onResetDefault: () => void;
}

export const RegulationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  points,
  onSavePoints,
  onResetDefault
}) => {
  const [items, setItems] = useState<SupervisiPoint[]>(points);

  if (!isOpen) return null;

  const handleAddPoint = () => {
    const newPoint: SupervisiPoint = {
      id: items.length + 1,
      namaKomponen: 'Komponen Supervisi Baru (Regulasi Baru)',
      deskripsi: 'Deskripsi kelengkapan bukti fisik dan standar mutu...',
      kondisi: 'Ada',
      skor: 4,
      catatanSupervisor: 'Bukti fisik lengkap.',
      rekomendasi: 'Pertahankan.'
    };
    setItems([...items, newPoint]);
  };

  const handleRemovePoint = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, id: i + 1 }));
    setItems(updated);
  };

  const handleSave = () => {
    onSavePoints(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" /> Penyesuaian Regulasi & Komponen Supervisi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola daftar instrumen jika ada instruksi tambahan dari dinas atau kurikulum baru (Bisa tambah/ubah poin).
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="font-bold text-slate-700">Daftar Komponen Supervisi ({items.length} Poin)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetDefault}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2.5 py-1 border rounded text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset ke 15 Poin Baku
              </button>
              <button
                type="button"
                onClick={handleAddPoint}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-xs transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Poin Baru
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((pt, idx) => (
              <div key={idx} className="border border-slate-300 rounded p-3 bg-slate-50 flex items-start justify-between gap-3">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-800 text-white rounded-full font-bold text-xs shrink-0 mt-0.5">
                  {pt.id}
                </span>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={pt.namaKomponen}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx].namaKomponen = e.target.value;
                      setItems(copy);
                    }}
                    className="w-full font-bold text-slate-900 border rounded px-2 py-1 text-xs"
                    placeholder="Nama Komponen"
                  />
                  <textarea
                    value={pt.deskripsi}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx].deskripsi = e.target.value;
                      setItems(copy);
                    }}
                    rows={1}
                    className="w-full text-slate-600 border rounded px-2 py-1 text-[11px]"
                    placeholder="Deskripsi bukti fisik yang dinilai..."
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePoint(idx)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-slate-700"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
            >
              Simpan Regulasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
