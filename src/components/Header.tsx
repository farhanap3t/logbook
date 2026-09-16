import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  UserCheck,
  Shield,
  Eye,
  RotateCcw,
  Download,
  Upload,
  History,
} from 'lucide-react';
import type { CurrentUser, UserRole } from '../types';
import { AVAILABLE_USERS } from '../services/storageService';

interface HeaderProps {
  currentUser: CurrentUser;
  onRoleChange: (role: UserRole) => void;
  onOpenAuditModal: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (json: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onOpenAuditModal,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
      setDateStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) onImportData(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'Supervisor':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <UserCheck className="w-3 h-3" /> Supervisor
          </span>
        );
      case 'Viewer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Eye className="w-3 h-3" /> Viewer (Read-only)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            User
          </span>
        );
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">LOGBOOK</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Pencatatan, Pengelolaan & Pemantauan Aktivitas
              </p>
            </div>
          </div>

          {/* Center Info: Real-time Date & Clock */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <span className="font-medium text-slate-700">{dateStr}</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono font-semibold text-slate-900">{timeStr}</span>
          </div>

          {/* Right: Actions & Role Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Audit Trail quick button */}
            <button
              onClick={onOpenAuditModal}
              title="Lihat Log Audit Trail Sistem"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Audit Trail</span>
            </button>

            {/* Export & Import Backup */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={onExportData}
                title="Cadangkan Data (Export JSON)"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <label
                title="Pulihkan Data (Import JSON)"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={onResetData}
                title="Reset ke Data Demo Awal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Role Switcher Dropdown (Simulating PRD RBAC) */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="mt-0.5">{getRoleBadge(currentUser.role)}</div>
              </div>

              <select
                aria-label="Pilih Role Pengguna"
                value={currentUser.role}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
                title="Ganti Peran Pengguna (Role Simulation)"
              >
                {AVAILABLE_USERS.map((u) => (
                  <option key={u.role} value={u.role}>
                    Role: {u.role} ({u.name.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

