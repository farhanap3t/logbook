import React, { useState } from 'react';
import {
  X,
  Calendar,
  User,
  Clock,
  Paperclip,
  Download,
  Edit2,
  Trash2,
  Lock,
  History,
} from 'lucide-react';
import type { LogbookRecord, AuditTrailRecord, UserRole } from '../types';
import { StatusBadge, CategoryBadge } from './Badges';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LogbookRecord | null;
  auditTrails: AuditTrailRecord[];
  onEdit: (record: LogbookRecord) => void;
  onDelete: (record: LogbookRecord) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const LogbookDetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  record,
  auditTrails,
  onEdit,
  onDelete,
  currentUserRole,
  currentUserName,
}) => {
  const [activeTab, setActiveTab] = useState<'detail' | 'history'>('detail');

  if (!isOpen || !record) return null;

  const isEditable = (): boolean => {
    if (currentUserRole === 'Viewer') return false;
    if (record.status === 'Completed' && currentUserRole !== 'Admin') return false;
    if (currentUserRole === 'User' && record.createdBy !== currentUserName) return false;
    return true;
  };

  const isDeletable = (): boolean => {
    if (currentUserRole === 'Viewer') return false;
    if (currentUserRole === 'Admin') return true;
    if (currentUserRole === 'User' && record.createdBy === currentUserName) {
      return record.status !== 'Completed';
    }
    return false;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    } catch {
      return dateStr;
    }
  };

  const handleDownloadAttachment = () => {
    if (!record.attachment) return;
    if (record.attachment.dataUrl) {
      const link = document.createElement('a');
      link.href = record.attachment.dataUrl;
      link.download = record.attachment.name;
      link.click();
    } else {
      alert(`Mengunduh berkas lampiran: ${record.attachment.name}`);
    }
  };

  const canEdit = isEditable();
  const canDelete = isDeletable();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                  {record.id}
                </span>
                <StatusBadge status={record.status} />
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
                {record.judul}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch (Detail vs Audit History) */}
        <div className="px-5 border-b border-slate-200 flex gap-4 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveTab('detail')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'detail'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Informasi Detail
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditTrails.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {activeTab === 'detail' ? (
            <>
              {/* Metadata row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Tanggal</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDateDisplay(record.tanggal)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Kategori</span>
                  <CategoryBadge category={record.kategori} />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Dibuat Oleh</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                    <User className="w-3 h-3 text-slate-400" />
                    {record.createdBy}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Waktu Buat</span>
                  <span className="font-mono text-slate-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {record.createdDate}
                  </span>
                </div>
              </div>

              {/* Updated By & Date (if exists) */}
              {record.updatedDate && (
                <div className="text-[11px] text-slate-500 px-1">
                  Terakhir diperbarui pada <strong>{record.updatedDate}</strong> oleh{' '}
                  <strong>{record.updatedBy || record.createdBy}</strong>
                </div>
              )}

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  Deskripsi Aktivitas
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {record.deskripsi}
                </div>
              </div>

              {/* Catatan Tambahan (if any) */}
              {record.catatan && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                    Catatan Tambahan
                  </h4>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 leading-relaxed whitespace-pre-wrap">
                    {record.catatan}
                  </div>
                </div>
              )}

              {/* Attachment */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  Lampiran / Bukti
                </h4>
                {record.attachment ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 truncate">
                          {record.attachment.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {record.attachment.type} &bull;{' '}
                          {(record.attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadAttachment}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">
                    Tidak ada lampiran berkas pada logbook ini.
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Audit Trail Tab (PRD Section 22) */
            <div className="space-y-3">
              <p className="text-slate-500 text-xs">
                Histori perubahan data logbook untuk keperluan auditabilitas sistem (BR-08, BR-09).
              </p>

              {auditTrails.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  Belum ada catatan histori perubahan untuk logbook ini.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Waktu</th>
                        <th className="py-2.5 px-3">Aksi</th>
                        <th className="py-2.5 px-3">Field</th>
                        <th className="py-2.5 px-3">Nilai Lama</th>
                        <th className="py-2.5 px-3">Nilai Baru</th>
                        <th className="py-2.5 px-3">Oleh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditTrails.map((trail) => (
                        <tr key={trail.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {trail.changedDate}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                trail.action === 'Create'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : trail.action === 'Edit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {trail.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-700">
                            {trail.fieldChanged || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {trail.oldValue || '-'}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {trail.newValue || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{trail.changedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Kembali
          </button>

          <div className="flex items-center gap-2">
            {canDelete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(record);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}

            {canEdit ? (
              <button
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Ubah Logbook</span>
              </button>
            ) : record.status === 'Completed' ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 text-xs font-medium cursor-not-allowed">
                <Lock className="w-3.5 h-3.5" />
                <span>Terkunci (Completed)</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
