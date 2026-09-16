import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  RotateCcw,
  Filter,
  Calendar,
  LayoutGrid,
  Table as TableIcon,
  Clock,
} from 'lucide-react';
import type {
  LogbookFilterState,
  LogbookCategory,
  LogbookStatus,
  UserRole,
  ViewMode,
} from '../types';

interface FilterBarProps {
  filter: LogbookFilterState;
  onFilterChange: (newFilter: LogbookFilterState) => void;
  onOpenCreateModal: () => void;
  userRole: UserRole;
  currentUserName: string;
  categories: LogbookCategory[];
  statuses: LogbookStatus[];
  usersList: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
}

export const LogbookFilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  onOpenCreateModal,
  userRole,
  currentUserName,
  categories,
  statuses,
  usersList,
  viewMode,
  onViewModeChange,
  resultCount,
}) => {
  const [localFilter, setLocalFilter] = useState<LogbookFilterState>(filter);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync if parent updates filter (e.g. via KPI card click)
  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  // Global keyboard shortcut: '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Quick Date Filter Presets
  const setQuickDate = (preset: 'today' | '7days' | 'month' | 'mine' | 'all') => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    let newFilter = { ...localFilter };

    if (preset === 'today') {
      newFilter.startDate = today;
      newFilter.endDate = today;
    } else if (preset === '7days') {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      newFilter.startDate = `${past.getFullYear()}-${pad(past.getMonth() + 1)}-${pad(past.getDate())}`;
      newFilter.endDate = today;
    } else if (preset === 'month') {
      newFilter.startDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
      newFilter.endDate = today;
    } else if (preset === 'mine') {
      newFilter.createdBy = currentUserName;
    } else if (preset === 'all') {
      newFilter.startDate = '';
      newFilter.endDate = '';
      newFilter.createdBy = 'All';
      newFilter.status = 'All';
      newFilter.kategori = 'All';
      newFilter.search = '';
    }

    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const hasActiveFilters =
    Boolean(localFilter.search) ||
    Boolean(localFilter.startDate) ||
    Boolean(localFilter.endDate) ||
    localFilter.kategori !== 'All' ||
    localFilter.status !== 'All' ||
    localFilter.createdBy !== 'All';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top row: Title, View Switcher & Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Aktivitas Logbook
            </h2>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
              {resultCount} data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola, monitor, dan pantau histori logbook aktivitas pekerjaan secara terstruktur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Segmented Controls */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onViewModeChange('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Tabel (Tabel Data)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
            <button
              onClick={() => onViewModeChange('board')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Papan Kanban (Status Board)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Papan Status</span>
            </button>
            <button
              onClick={() => onViewModeChange('timeline')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Linimasa Kronologis"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Linimasa</span>
            </button>
          </div>

          {/* Add Logbook Button */}
          {canCreate && (
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Logbook</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
                N
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Presets Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium text-[11px] mr-1">Filter Cepat:</span>
        <button
          type="button"
          onClick={() => setQuickDate('all')}
          className={`px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
            !hasActiveFilters
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Semua Data
        </button>
        <button
          type="button"
          onClick={() => setQuickDate('today')}
          className="px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
        >
          Hari Ini
        </button>
        <button
          type="button"
          onClick={() => setQuickDate('7days')}
          className="px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
        >
          7 Hari Terakhir
        </button>
        <button
          type="button"
          onClick={() => setQuickDate('month')}
          className="px-2.5 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
        >
          Bulan Ini
        </button>
        {userRole !== 'User' && (
          <button
            type="button"
            onClick={() => setQuickDate('mine')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              localFilter.createdBy === currentUserName
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Aktivitas Saya
          </button>
        )}
      </div>

      {/* Filter Form Matching PRD Mockup (Section 29) */}
      <form onSubmit={handleApplyFilter} className="space-y-3">
        {/* Row 1: Search input with keyboard shortcut hint */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Cari berdasarkan judul aktivitas, Logbook ID (LB-xxxxxx), deskripsi, atau pembuat..."
            value={localFilter.search}
            onChange={(e) => {
              const updated = { ...localFilter, search: e.target.value };
              setLocalFilter(updated);
              onFilterChange(updated);
            }}
            className="w-full pl-9 pr-14 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition-colors"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/80 rounded border border-slate-300">
              /
            </kbd>
          </div>
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
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
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
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
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
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
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
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
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
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
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
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors focus:ring-2 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Terapkan</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              title="Kembalikan filter ke kondisi awal"
              className={`inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-colors ${
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
