import React, { useState } from 'react';
import { Search, Plus, RotateCcw, Filter, Calendar } from 'lucide-react';
import type { LogbookFilterState, LogbookCategory, LogbookStatus, UserRole } from '../types';

interface FilterBarProps {
  filter: LogbookFilterState;
  onFilterChange: (newFilter: LogbookFilterState) => void;
  onOpenCreateModal: () => void;
  userRole: UserRole;
  categories: LogbookCategory[];
  statuses: LogbookStatus[];
  usersList: string[];
}

export const LogbookFilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  onOpenCreateModal,
  userRole,
  categories,
  statuses,
  usersList,
}) => {
  // Local state for filter inputs so user can adjust and click "Filter" or press Enter
  const [localFilter, setLocalFilter] = useState<LogbookFilterState>(filter);

  const canCreate = userRole === 'User' || userRole === 'Admin';

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange(localFilter);
  };

  const handleReset = () => {
    const emptyFilter: LogbookFilterState = {
      search: '',
      startDate: '',
      endDate: '',
      kategori: 'All',
      status: 'All',
      createdBy: 'All',
    };
    setLocalFilter(emptyFilter);
    onFilterChange(emptyFilter);
  };

  const hasActiveFilters =
    Boolean(localFilter.search) ||
    Boolean(localFilter.startDate) ||
    Boolean(localFilter.endDate) ||
    localFilter.kategori !== 'All' ||
    localFilter.status !== 'All' ||
    localFilter.createdBy !== 'All';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top row: Title / Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Daftar Logbook Aktivitas
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan dan pemantauan aktivitas terpusat berdasarkan tanggal, kategori, dan status.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors focus:ring-2 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Logbook</span>
          </button>
        )}
      </div>

      {/* Filter Form Matching PRD Mockup (Section 29) */}
      <form onSubmit={handleApplyFilter} className="space-y-3">
        {/* Row 1: Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan judul aktivitas, Logbook ID (LB-xxxxxx), deskripsi, atau pembuat..."
            value={localFilter.search}
            onChange={(e) => setLocalFilter({ ...localFilter, search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-colors"
          />
        </div>

        {/* Row 2: Date Range, Category, Status, CreatedBy, Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={localFilter.startDate}
              onChange={(e) => setLocalFilter({ ...localFilter, startDate: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={localFilter.endDate}
              onChange={(e) => setLocalFilter({ ...localFilter, endDate: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Kategori
            </label>
            <select
              aria-label="Pilih Kategori"
              value={localFilter.kategori}
              onChange={(e) => setLocalFilter({ ...localFilter, kategori: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="All">Semua Kategori (All)</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Status
            </label>
            <select
              aria-label="Pilih Status"
              value={localFilter.status}
              onChange={(e) => setLocalFilter({ ...localFilter, status: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="All">Semua Status (All)</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Created By Dropdown */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Dibuat Oleh
            </label>
            <select
              aria-label="Pilih Pembuat"
              value={localFilter.createdBy}
              onChange={(e) => setLocalFilter({ ...localFilter, createdBy: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="All">Semua Pembuat (All)</option>
              {usersList.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons (Filter & Reset) */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors focus:ring-2 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              title="Kembalikan filter ke kondisi awal"
              className={`inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                hasActiveFilters
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer'
                  : 'border-slate-200 text-slate-300 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
