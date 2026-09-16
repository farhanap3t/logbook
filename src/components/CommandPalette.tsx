import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Table,
  LayoutGrid,
  Clock,
  Shield,
  UserCheck,
  Eye,
  User,
  Download,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import type { LogbookRecord, UserRole, ViewMode, LogbookStatus } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  logbooks: LogbookRecord[];
  onSelectLogbook: (record: LogbookRecord) => void;
  onOpenCreate: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onRoleChange: (role: UserRole) => void;
  onFilterStatus: (status: LogbookStatus | 'All') => void;
  onExportData: () => void;
  onResetData: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  logbooks,
  onSelectLogbook,
  onOpenCreate,
  onViewModeChange,
  onRoleChange,
  onFilterStatus,
  onExportData,
  onResetData,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Generate commands list
  const staticCommands: CommandItem[] = [
    {
      id: 'cmd-new',
      title: 'Tambah Logbook Baru',
      category: 'Aksi Cepat',
      icon: <Plus className="w-4 h-4 text-emerald-600" />,
      action: () => {
        onClose();
        onOpenCreate();
      },
      shortcut: 'N',
    },
    {
      id: 'cmd-view-table',
      title: 'Ganti Tampilan ke Tabel',
      category: 'Tampilan',
      icon: <Table className="w-4 h-4 text-blue-600" />,
      action: () => {
        onClose();
        onViewModeChange('table');
      },
    },
    {
      id: 'cmd-view-board',
      title: 'Ganti Tampilan ke Papan Status (Kanban)',
      category: 'Tampilan',
      icon: <LayoutGrid className="w-4 h-4 text-purple-600" />,
      action: () => {
        onClose();
        onViewModeChange('board');
      },
    },
    {
      id: 'cmd-view-timeline',
      title: 'Ganti Tampilan ke Linimasa (Timeline)',
      category: 'Tampilan',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      action: () => {
        onClose();
        onViewModeChange('timeline');
      },
    },
    {
      id: 'cmd-filter-completed',
      title: 'Filter: Hanya yang Selesai (Completed)',
      category: 'Filter Status',
      icon: <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />,
      action: () => {
        onClose();
        onFilterStatus('Completed');
      },
    },
    {
      id: 'cmd-filter-inprogress',
      title: 'Filter: Hanya yang Sedang Berjalan (In Progress)',
      category: 'Filter Status',
      icon: <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />,
      action: () => {
        onClose();
        onFilterStatus('In Progress');
      },
    },
    {
      id: 'cmd-role-user',
      title: 'Simulasikan Role: User',
      category: 'Peran Pengguna (RBAC)',
      icon: <User className="w-4 h-4 text-slate-700" />,
      action: () => {
        onClose();
        onRoleChange('User');
      },
    },
    {
      id: 'cmd-role-supervisor',
      title: 'Simulasikan Role: Supervisor',
      category: 'Peran Pengguna (RBAC)',
      icon: <UserCheck className="w-4 h-4 text-blue-700" />,
      action: () => {
        onClose();
        onRoleChange('Supervisor');
      },
    },
    {
      id: 'cmd-role-admin',
      title: 'Simulasikan Role: Admin',
      category: 'Peran Pengguna (RBAC)',
      icon: <Shield className="w-4 h-4 text-purple-700" />,
      action: () => {
        onClose();
        onRoleChange('Admin');
      },
    },
    {
      id: 'cmd-role-viewer',
      title: 'Simulasikan Role: Viewer (Read-only)',
      category: 'Peran Pengguna (RBAC)',
      icon: <Eye className="w-4 h-4 text-amber-700" />,
      action: () => {
        onClose();
        onRoleChange('Viewer');
      },
    },
    {
      id: 'cmd-export',
      title: 'Ekspor Cadangan Data (JSON)',
      category: 'Data & Utilitas',
      icon: <Download className="w-4 h-4 text-slate-600" />,
      action: () => {
        onClose();
        onExportData();
      },
    },
    {
      id: 'cmd-reset',
      title: 'Reset ke Data Demo Awal',
      category: 'Data & Utilitas',
      icon: <RotateCcw className="w-4 h-4 text-rose-600" />,
      action: () => {
        onClose();
        onResetData();
      },
    },
  ];

  // Also include matching logbook records in results
  const logbookCommands: CommandItem[] = logbooks.map((l) => ({
    id: `lb-${l.id}`,
    title: `${l.id} • ${l.judul}`,
    category: `Logbook (${l.kategori} - ${l.status})`,
    icon: (
      <span
        className={`w-2 h-2 rounded-full ${
          l.status === 'Completed'
            ? 'bg-emerald-500'
            : l.status === 'In Progress'
            ? 'bg-blue-500'
            : l.status === 'Submitted'
            ? 'bg-sky-500'
            : 'bg-slate-400'
        }`}
      />
    ),
    action: () => {
      onClose();
      onSelectLogbook(l);
    },
  }));

  const allItems = [...staticCommands, ...logbookCommands];

  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev - 1 < 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 duration-150">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ketik perintah atau cari aktivitas logbook..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
          />
          <kbd className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Tidak ada perintah atau logbook yang cocok.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="overflow-hidden">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {item.category}
                      </p>
                    </div>
                  </div>

                  {item.shortcut ? (
                    <kbd
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isSelected
                          ? 'bg-slate-800 text-slate-200 border-slate-700'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {item.shortcut}
                    </kbd>
                  ) : (
                    isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer tips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Pilih dengan panah</span>
            <kbd className="px-1 bg-white border border-slate-200 rounded font-mono">↑</kbd>
            <kbd className="px-1 bg-white border border-slate-200 rounded font-mono">↓</kbd>
            <span>Eksekusi dengan</span>
            <kbd className="px-1 bg-white border border-slate-200 rounded font-mono">↵</kbd>
          </div>
          <span>Logbook Command Palette</span>
        </div>
      </div>
    </div>
  );
};
