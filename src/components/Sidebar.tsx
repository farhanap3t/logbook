import React from 'react';
import {
  BookOpen,
  LayoutList,
  User,
  Clock,
  CheckCircle2,
  Table,
  LayoutGrid,
  Calendar,
  History,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Command,
} from 'lucide-react';
import type { CurrentUser, UserRole, ViewMode, LogbookStatus } from '../types';
import { AVAILABLE_USERS } from '../services/storageService';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: CurrentUser;
  onRoleChange: (role: UserRole) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeStatusFilter: string;
  onFilterStatus: (status: LogbookStatus | 'All') => void;
  onFilterMine: () => void;
  isFilterMineActive: boolean;
  onOpenAuditModal: () => void;
  onOpenCommandPalette: () => void;
  onExportData: () => void;
  onResetData: () => void;
  counts: {
    total: number;
    completed: number;
    inProgress: number;
    submitted: number;
    draft: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onRoleChange,
  viewMode,
  onViewModeChange,
  activeStatusFilter,
  onFilterStatus,
  onFilterMine,
  isFilterMineActive,
  onOpenAuditModal,
  onOpenCommandPalette,
  onExportData,
  onResetData,
  counts,
}) => {
  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight block truncate">
                  LOGBOOK
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Enterprise Workspace
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Quick Command Launcher Button */}
        <div className="p-3">
          <button
            onClick={onOpenCommandPalette}
            className={`w-full flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 text-xs transition-all cursor-pointer ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4 text-slate-600" />
              {!isCollapsed && <span className="font-medium text-xs">Cari Perintah...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Nav Sections */}
        <div className="px-3 py-2 space-y-5 text-xs overflow-y-auto max-h-[calc(100vh-280px)]">
          {/* Section 1: Aktivitas Filter */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Koleksi
              </div>
            )}

            <button
              onClick={() => onFilterStatus('All')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeStatusFilter === 'All' && !isFilterMineActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutList className="w-4 h-4" />
                {!isCollapsed && <span>Semua Logbook</span>}
              </div>
              {!isCollapsed && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    activeStatusFilter === 'All' && !isFilterMineActive
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {counts.total}
                </span>
              )}
            </button>

            {currentUser.role !== 'User' && (
              <button
                onClick={onFilterMine}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                  isFilterMineActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  {!isCollapsed && <span>Aktivitas Saya</span>}
                </div>
              </button>
            )}

            <button
              onClick={() => onFilterStatus('In Progress')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeStatusFilter === 'In Progress'
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                {!isCollapsed && <span>Sedang Berjalan</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {counts.inProgress}
                </span>
              )}
            </button>

            <button
              onClick={() => onFilterStatus('Completed')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeStatusFilter === 'Completed'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4" />
                {!isCollapsed && <span>Selesai (Completed)</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {counts.completed}
                </span>
              )}
            </button>
          </div>

          {/* Section 2: Mode Tampilan */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tampilan
              </div>
            )}

            <button
              onClick={() => onViewModeChange('table')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Table className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>Tabel Data</span>}
            </button>

            <button
              onClick={() => onViewModeChange('board')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>Papan Kanban</span>}
            </button>

            <button
              onClick={() => onViewModeChange('timeline')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>Linimasa</span>}
            </button>

            <button
              onClick={() => onViewModeChange('calendar')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>Kalender Bulanan</span>}
            </button>
          </div>

          {/* Section 3: Audit Trail & Data */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tata Kelola
              </div>
            )}

            <button
              onClick={onOpenAuditModal}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>Audit Trail Sistem</span>}
            </button>

            <button
              onClick={onExportData}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>Ekspor Backup JSON</span>}
            </button>

            <button
              onClick={onResetData}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              {!isCollapsed && <span>Reset Data Demo</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Role Switcher */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.name[0]}
              </div>
              <div className="overflow-hidden text-xs">
                <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.department}</p>
              </div>
            </div>

            {/* Quick Role selector */}
            <select
              aria-label="Pilih Role Pengguna"
              value={currentUser.role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              {AVAILABLE_USERS.map((u) => (
                <option key={u.role} value={u.role}>
                  Role: {u.role}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              title={`${currentUser.name} (${currentUser.role})`}
              className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
            >
              {currentUser.name[0]}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
