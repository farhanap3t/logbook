import React, { useState } from 'react';
import { X, History, Search } from 'lucide-react';
import type { AuditTrailRecord } from '../types';

interface SystemAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditTrails: AuditTrailRecord[];
}

export const SystemAuditModal: React.FC<SystemAuditModalProps> = ({
  isOpen,
  onClose,
  auditTrails,
}) => {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = auditTrails.filter((item) => {
    if (filterAction !== 'All' && item.action !== filterAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.logbookId.toLowerCase().includes(q) ||
        item.changedBy.toLowerCase().includes(q) ||
        (item.fieldChanged && item.fieldChanged.toLowerCase().includes(q)) ||
        (item.newValue && item.newValue.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-900 text-white">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Audit Trail Sistem</h3>
              <p className="text-xs text-slate-500">
                Log histori perubahan data seluruh aktivitas logbook (BR-08, BR-09, Section 22).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan ID Logbook, Pengguna, atau Field..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Aksi:</span>
            <select
              aria-label="Filter Berdasarkan Aksi Audit"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 w-full sm:w-auto"
            >
              <option value="All">Semua Aksi</option>
              <option value="Create">Create</option>
              <option value="Edit">Edit</option>
              <option value="Delete">Delete</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              Tidak ada data riwayat audit trail yang cocok.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Logbook ID</th>
                    <th className="py-2.5 px-3">Aksi</th>
                    <th className="py-2.5 px-3">Field Diubah</th>
                    <th className="py-2.5 px-3">Nilai Lama</th>
                    <th className="py-2.5 px-3">Nilai Baru</th>
                    <th className="py-2.5 px-3">Dilakukan Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                        {item.changedDate}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.logbookId}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.action === 'Create'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.action === 'Edit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        {item.fieldChanged || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-[120px]">
                        {item.oldValue || '-'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 truncate max-w-[150px]">
                        {item.newValue || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        {item.changedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
          <span>Total {filtered.length} riwayat tercatat</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
