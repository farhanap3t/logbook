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
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LogbookRecord, AuditTrailRecord, UserRole, LogbookStatus } from '../types';
import { StatusBadge, CategoryBadge } from './Badges';

interface LogbookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: LogbookRecord | null;
  auditTrails: AuditTrailRecord[];
  onEdit: (record: LogbookRecord) => void;
  onDelete: (record: LogbookRecord) => void;
  onQuickStatusChange: (record: LogbookRecord, newStatus: LogbookStatus) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const LogbookDrawer: React.FC<LogbookDrawerProps> = ({
  isOpen,
  onClose,
  record,
  auditTrails,
  onEdit,
  onDelete,
  onQuickStatusChange,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
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

  const handleStatusShift = (newStatus: LogbookStatus) => {
    if (newStatus === 'Completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#0f172a'],
      });
    }
    onQuickStatusChange(record, newStatus);
  };

  const canEdit = isEditable();
  const canDelete = isDeletable();

  const STATUS_LIST: LogbookStatus[] = [
    'Draft',
    'Submitted',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Top Bar: Nav Arrows & Close */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                {record.id}
              </span>
              <div className="flex items-center gap-1">
                {hasPrev && (
                  <button
                    onClick={onNavigatePrev}
                    title="Aktivitas Sebelumnya"
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={onNavigateNext}
                    title="Aktivitas Berikutnya"
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Header */}
          <div className="p-5 pb-3 border-b border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CategoryBadge category={record.kategori} />

              {/* Status Switcher Pill */}
              {canEdit ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                  <select
                    aria-label="Ubah Status Logbook"
                    value={record.status}
                    onChange={(e) => handleStatusShift(e.target.value as LogbookStatus)}
                    className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
                  >
                    {STATUS_LIST.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <StatusBadge status={record.status} />
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {record.judul}
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="px-5 border-b border-slate-200 flex gap-4 text-xs font-bold bg-white">
            <button
              onClick={() => setActiveTab('detail')}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'detail'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Informasi Detail
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Trail ({auditTrails.length})</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
            {activeTab === 'detail' ? (
              <>
                {/* Meta properties box */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">Tanggal</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDateDisplay(record.tanggal)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">Dibuat Oleh</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {record.createdBy}
                    </span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Dibuat: {record.createdDate}
                    </span>
                    {record.updatedDate && (
                      <span className="font-mono">Pembaruan: {record.updatedDate}</span>
                    )}
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                    Deskripsi Pekerjaan
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {record.deskripsi}
                  </div>
                </div>

                {/* Catatan Tambahan if any */}
                {record.catatan && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                      Catatan Tambahan
                    </h4>
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 leading-relaxed whitespace-pre-wrap">
                      {record.catatan}
                    </div>
                  </div>
                )}

                {/* Attachment */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
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
              /* Audit Trail Tab */
              <div className="space-y-3">
                <p className="text-slate-500 text-xs">
                  Histori perubahan data logbook untuk auditabilitas (BR-08, BR-09).
                </p>

                {auditTrails.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    Belum ada catatan histori perubahan untuk logbook ini.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditTrails.map((trail) => (
                      <div
                        key={trail.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                              trail.action === 'Create'
                                ? 'bg-emerald-100 text-emerald-800'
                                : trail.action === 'Edit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {trail.action}
                          </span>
                          <span className="font-mono text-slate-400">{trail.changedDate}</span>
                        </div>
                        <p className="font-medium text-slate-800">
                          {trail.fieldChanged ? (
                            <>
                              Field <strong>{trail.fieldChanged}</strong> diubah:{' '}
                              <span className="text-slate-400 line-through mr-1">
                                {trail.oldValue || '-'}
                              </span>
                              &rarr; <span className="font-bold text-slate-900">{trail.newValue}</span>
                            </>
                          ) : (
                            <>Nilai status: {trail.newValue}</>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">Oleh: {trail.changedBy}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            {canDelete ? (
              <button
                onClick={() => {
                  onClose();
                  onDelete(record);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              {canEdit ? (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(record);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Ubah Lengkap</span>
                </button>
              ) : record.status === 'Completed' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-medium cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Terkunci (Completed)</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
