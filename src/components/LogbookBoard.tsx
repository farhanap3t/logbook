import React from 'react';
import {
  Paperclip,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Lock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LogbookRecord, LogbookStatus, UserRole } from '../types';
import { CategoryBadge } from './Badges';

interface LogbookBoardProps {
  logbooks: LogbookRecord[];
  onViewDetail: (record: LogbookRecord) => void;
  onEdit: (record: LogbookRecord) => void;
  onDelete: (record: LogbookRecord) => void;
  onQuickStatusChange: (record: LogbookRecord, newStatus: LogbookStatus) => void;
  onOpenCreateModal: () => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

const COLUMNS: { status: LogbookStatus; title: string; color: string; border: string; bg: string }[] = [
  {
    status: 'Draft',
    title: 'Draf',
    color: 'text-slate-700',
    border: 'border-slate-300',
    bg: 'bg-slate-100/70',
  },
  {
    status: 'Submitted',
    title: 'Diajukan',
    color: 'text-sky-700',
    border: 'border-sky-300',
    bg: 'bg-sky-50/70',
  },
  {
    status: 'In Progress',
    title: 'Sedang Berjalan',
    color: 'text-blue-700',
    border: 'border-blue-300',
    bg: 'bg-blue-50/70',
  },
  {
    status: 'Completed',
    title: 'Selesai',
    color: 'text-emerald-700',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50/70',
  },
  {
    status: 'Cancelled',
    title: 'Dibatalkan',
    color: 'text-rose-700',
    border: 'border-rose-300',
    bg: 'bg-rose-50/70',
  },
];

export const LogbookBoard: React.FC<LogbookBoardProps> = ({
  logbooks,
  onViewDetail,
  onEdit,
  onDelete,
  onQuickStatusChange,
  onOpenCreateModal,
  currentUserRole,
  currentUserName,
}) => {
  const isEditable = (record: LogbookRecord): boolean => {
    if (currentUserRole === 'Viewer') return false;
    if (record.status === 'Completed' && currentUserRole !== 'Admin') return false;
    if (currentUserRole === 'User' && record.createdBy !== currentUserName) return false;
    return true;
  };

  const isDeletable = (record: LogbookRecord): boolean => {
    if (currentUserRole === 'Viewer') return false;
    if (currentUserRole === 'Admin') return true;
    if (currentUserRole === 'User' && record.createdBy === currentUserName) {
      return record.status !== 'Completed';
    }
    return false;
  };

  const handleStatusChangeWithFeedback = (record: LogbookRecord, newStatus: LogbookStatus) => {
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

  return (
    <div className="overflow-x-auto pb-4 pt-1">
      <div className="flex gap-4 min-w-[1000px] items-start">
        {COLUMNS.map((col) => {
          const items = logbooks.filter((item) => item.status === col.status);

          return (
            <div
              key={col.status}
              className="flex-1 min-w-[220px] max-w-[280px] bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col max-h-[78vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full border ${col.border} ${col.bg}`} />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                  {items.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {items.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-slate-200/80 rounded-xl">
                    <p className="text-slate-400 text-xs">Kosong</p>
                    {col.status === 'Draft' && currentUserRole !== 'Viewer' && (
                      <button
                        onClick={onOpenCreateModal}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Tambah
                      </button>
                    )}
                  </div>
                ) : (
                  items.map((item) => {
                    const canEdit = isEditable(item);
                    const canDelete = isDeletable(item);

                    return (
                      <div
                        key={item.id}
                        onClick={() => onViewDetail(item)}
                        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group space-y-2 relative"
                      >
                        {/* Top: ID & Category */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            {item.id}
                          </span>
                          <CategoryBadge category={item.kategori} />
                        </div>

                        {/* Title & Desc */}
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.judul}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {item.deskripsi}
                          </p>
                        </div>

                        {/* Meta: Date & Attachment */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {item.tanggal}
                            </span>
                            {item.attachment && (
                              <span title={item.attachment.name} className="text-blue-600">
                                <Paperclip className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <span className="truncate max-w-[80px] font-medium text-slate-600">
                            {item.createdBy.split(' ')[0]}
                          </span>
                        </div>

                        {/* Quick Status Shift Bar on Hover */}
                        <div
                          className="pt-1.5 flex items-center justify-between gap-1 border-t border-slate-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onViewDetail(item)}
                              title="Lihat Detail"
                              className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            {canEdit && (
                              <button
                                onClick={() => onEdit(item)}
                                title="Ubah Logbook"
                                className="p-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => onDelete(item)}
                                title="Hapus Logbook"
                                className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                            {!canEdit && item.status === 'Completed' && (
                              <span title="Completed (Terkunci)" className="p-1 text-slate-300">
                                <Lock className="w-3 h-3" />
                              </span>
                            )}
                          </div>

                          {/* Quick Move to Next Logical Status */}
                          {canEdit && col.status !== 'Completed' && col.status !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                const nextMap: Record<LogbookStatus, LogbookStatus> = {
                                  Draft: 'Submitted',
                                  Submitted: 'In Progress',
                                  'In Progress': 'Completed',
                                  Completed: 'Completed',
                                  Cancelled: 'Cancelled',
                                };
                                handleStatusChangeWithFeedback(item, nextMap[col.status]);
                              }}
                              title={`Pindahkan ke ${
                                col.status === 'Draft'
                                  ? 'Submitted'
                                  : col.status === 'Submitted'
                                  ? 'In Progress'
                                  : 'Completed'
                              }`}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
