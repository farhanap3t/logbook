import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Trash2,
  Paperclip,
  Calendar,
  Lock,
} from 'lucide-react';
import type { LogbookRecord, SortField, SortDirection, UserRole } from '../types';
import { StatusBadge, CategoryBadge } from './Badges';

interface LogbookTableProps {
  logbooks: LogbookRecord[];
  sortField: SortField;
  sortDir: SortDirection;
  onSort: (field: SortField) => void;
  onViewDetail: (record: LogbookRecord) => void;
  onEdit: (record: LogbookRecord) => void;
  onDelete: (record: LogbookRecord) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const LogbookTable: React.FC<LogbookTableProps> = ({
  logbooks,
  sortField,
  sortDir,
  onSort,
  onViewDetail,
  onEdit,
  onDelete,
  currentUserRole,
  currentUserName,
}) => {
  // Pagination state
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalItems = logbooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * pageSize;
  const currentItems = logbooks.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 ml-1 inline" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-slate-900 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-slate-900 ml-1 inline" />
    );
  };

  const isEditable = (record: LogbookRecord): boolean => {
    // BR-05 & Section 6: Viewer cannot edit
    if (currentUserRole === 'Viewer') return false;
    // BR-07: Completed cannot be edited by standard users
    if (record.status === 'Completed' && currentUserRole !== 'Admin') return false;
    // User can only edit their own
    if (currentUserRole === 'User' && record.createdBy !== currentUserName) return false;
    return true;
  };

  const isDeletable = (record: LogbookRecord): boolean => {
    if (currentUserRole === 'Viewer') return false;
    if (currentUserRole === 'Admin') return true;
    // User can delete their own draft or submitted
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

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table for Desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
              <th className="py-3 px-3 w-12 text-center">No.</th>
              <th
                onClick={() => onSort('tanggal')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Tanggal {renderSortIcon('tanggal')}
              </th>
              <th className="py-3 px-3 whitespace-nowrap">Logbook ID</th>
              <th
                onClick={() => onSort('judul')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors min-w-[200px]"
              >
                Judul / Aktivitas {renderSortIcon('judul')}
              </th>
              <th className="py-3 px-3 whitespace-nowrap">Kategori</th>
              <th className="py-3 px-3 whitespace-nowrap">Status</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Lampiran</th>
              <th
                onClick={() => onSort('createdDate')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Dibuat Oleh {renderSortIcon('createdDate')}
              </th>
              <th className="py-3 px-3 text-center w-28 whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-1">
                    <p className="text-slate-800 font-semibold text-sm">
                      Data logbook tidak ditemukan.
                    </p>
                    <p className="text-slate-500 text-xs">
                      Silakan sesuaikan kata kunci pencarian atau ubah kriteria filter Anda.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item, idx) => {
                const rowNo = startIndex + idx + 1;
                const canEdit = isEditable(item);
                const canDelete = isDeletable(item);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onViewDetail(item)}
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {rowNo}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {formatDateDisplay(item.tanggal)}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.judul}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.deskripsi}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <CategoryBadge category={item.kategori} />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.attachment ? (
                        <span
                          title={item.attachment.name}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Paperclip className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{item.createdBy}</div>
                      <div className="text-[10px] text-slate-400">{item.createdDate}</div>
                    </td>
                    <td
                      className="py-3 px-3 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onViewDetail(item)}
                          title="Lihat Detail Logbook"
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canEdit ? (
                          <button
                            onClick={() => onEdit(item)}
                            title="Ubah Logbook"
                            className="p-1.5 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        ) : item.status === 'Completed' ? (
                          <span
                            title="Logbook dengan status Completed terkunci dan tidak dapat diubah (BR-07)"
                            className="p-1.5 text-slate-300 cursor-not-allowed"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        ) : null}
                        {canDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            title="Hapus Logbook"
                            className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Cards View for Mobile Devices */}
      <div className="md:hidden divide-y divide-slate-100">
        {currentItems.length === 0 ? (
          <div className="py-10 text-center px-4">
            <p className="text-slate-800 font-semibold text-sm">
              Data logbook tidak ditemukan.
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Silakan sesuaikan kata kunci pencarian atau ubah kriteria filter Anda.
            </p>
          </div>
        ) : (
          currentItems.map((item, idx) => {
            const rowNo = startIndex + idx + 1;
            const canEdit = isEditable(item);
            const canDelete = isDeletable(item);

            return (
              <div
                key={item.id}
                onClick={() => onViewDetail(item)}
                className="p-4 hover:bg-slate-50 transition-colors space-y-2.5 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      #{rowNo}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {item.id}
                    </span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.judul}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDateDisplay(item.tanggal)}
                    </span>
                    <CategoryBadge category={item.kategori} />
                  </div>

                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onViewDetail(item)}
                      className="p-1 text-slate-500 hover:text-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar (Section 5.1 & 24) */}
      <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Menampilkan</span>
          <select
            aria-label="Pilih Jumlah Baris per Halaman"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>baris dari total <strong>{totalItems}</strong> logbook</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage <= 1}
            className="px-2.5 py-1 rounded border border-slate-300 bg-white font-medium hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>
          <span className="px-2 font-medium text-slate-800">
            Halaman {validCurrentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage >= totalPages}
            className="px-2.5 py-1 rounded border border-slate-300 bg-white font-medium hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};
