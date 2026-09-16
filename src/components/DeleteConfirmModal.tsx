import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { LogbookRecord } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  record: LogbookRecord | null;
}

export const DeleteConfirmModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  record,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hapus Logbook</h3>
              <p className="text-xs text-slate-500 font-mono">{record.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <p className="font-semibold text-slate-800 text-sm mb-1">
            Apakah Anda yakin ingin menghapus logbook ini?
          </p>
          <p className="text-slate-500">
            Aktivitas: <strong>{record.judul}</strong> ({record.tanggal})
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Catatan: Sistem menerapkan <em>soft-delete</em> sehingga catatan penghapusan akan
            didokumentasikan dalam riwayat Audit Trail sesuai standar kepatuhan sistem.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs transition-colors cursor-pointer text-xs"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
