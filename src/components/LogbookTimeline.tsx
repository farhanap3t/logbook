import React from 'react';
import {
  Clock,
  User,
  Paperclip,
  Eye,
  Edit2,
  Trash2,
  Copy,
} from 'lucide-react';
import type { LogbookRecord, UserRole } from '../types';
import { StatusBadge, CategoryBadge } from './Badges';

interface LogbookTimelineProps {
  logbooks: LogbookRecord[];
  onViewDetail: (record: LogbookRecord) => void;
  onEdit: (record: LogbookRecord) => void;
  onDelete: (record: LogbookRecord) => void;
  onCloneAsToday: (record: LogbookRecord) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const LogbookTimeline: React.FC<LogbookTimelineProps> = ({
  logbooks,
  onViewDetail,
  onEdit,
  onDelete,
  onCloneAsToday,
  currentUserRole,
  currentUserName,
}) => {
  // Group logbooks by date (YYYY-MM-DD)
  const grouped = React.useMemo(() => {
    const map = new Map<string, LogbookRecord[]>();
    for (const item of logbooks) {
      const list = map.get(item.tanggal) || [];
      list.push(item);
      map.set(item.tanggal, list);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [logbooks]);

  const formatDateHeader = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

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

  if (logbooks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-800 font-semibold text-sm">Data logbook tidak ditemukan.</p>
        <p className="text-slate-500 text-xs mt-1">
          Silakan sesuaikan kata kunci pencarian atau kriteria filter Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(([date, items]) => (
        <div key={date} className="relative">
          {/* Date Section Header */}
          <div className="sticky top-18 z-10 bg-slate-100/95 backdrop-blur-xs py-1.5 px-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-200" />
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              {formatDateHeader(date)}
            </span>
            <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {items.length} aktivitas
            </span>
          </div>

          {/* Timeline items with connecting line */}
          <div className="ml-3 sm:ml-5 pl-4 sm:pl-6 border-l-2 border-slate-200 space-y-3.5 pt-2 pb-2">
            {items.map((item) => {
              const canEdit = isEditable(item);
              const canDelete = isDeletable(item);

              return (
                <div
                  key={item.id}
                  onClick={() => onViewDetail(item)}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group space-y-2.5 relative"
                >
                  {/* Top Bar: ID, Category, Status, Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                        {item.id}
                      </span>
                      <CategoryBadge category={item.kategori} />
                      <StatusBadge status={item.status} />
                    </div>

                    <div
                      className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentUserRole !== 'Viewer' && (
                        <button
                          onClick={() => onCloneAsToday(item)}
                          title="Gandakan sebagai Draf Hari Ini"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span className="hidden sm:inline">Gandakan</span>
                        </button>
                      )}
                      <button
                        onClick={() => onViewDetail(item)}
                        title="Lihat Detail"
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          title="Ubah Logbook"
                          className="p-1.5 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          title="Hapus Logbook"
                          className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {item.judul}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1 whitespace-pre-wrap">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Notes Callout if exists */}
                  {item.catatan && (
                    <div className="text-[11px] text-amber-900 bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 leading-relaxed">
                      <span className="font-bold">Catatan:</span> {item.catatan}
                    </div>
                  )}

                  {/* Footer Meta */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        {item.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.createdDate}
                      </span>
                    </div>

                    {item.attachment && (
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-medium">
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate max-w-[160px]">{item.attachment.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
