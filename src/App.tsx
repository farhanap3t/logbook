import { useState, useMemo, useEffect } from 'react';
import { storageService, AVAILABLE_USERS } from './services/storageService';
import type {
  LogbookRecord,
  LogbookFilterState,
  SortField,
  SortDirection,
  LogbookCategory,
  LogbookStatus,
  UserRole,
  CurrentUser,
  ToastMessage,
  AttachmentFile,
  ViewMode,
} from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LogbookFilterBar } from './components/LogbookFilterBar';
import { LogbookTable } from './components/LogbookTable';
import { LogbookBoard } from './components/LogbookBoard';
import { LogbookTimeline } from './components/LogbookTimeline';
import { CalendarView } from './components/CalendarView';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { FastCaptureBar } from './components/FastCaptureBar';
import { LogbookDrawer } from './components/LogbookDrawer';
import { LogbookFormModal } from './components/LogbookFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SystemAuditModal } from './components/SystemAuditModal';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/Toast';

const CATEGORIES: LogbookCategory[] = [
  'Meeting',
  'Development',
  'Testing',
  'Monitoring',
  'Analysis',
  'Documentation',
  'Issue/Incident',
  'Maintenance',
  'Other',
];

const STATUSES: LogbookStatus[] = [
  'Draft',
  'Submitted',
  'In Progress',
  'Completed',
  'Cancelled',
];

export function App() {
  // Current user state (RBAC)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() =>
    storageService.getCurrentUser()
  );

  // Data states
  const [logbooks, setLogbooks] = useState<LogbookRecord[]>(() =>
    storageService.getAllLogbooks()
  );
  const [auditTrails, setAuditTrails] = useState(() =>
    storageService.getAllAuditTrails()
  );

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Filter & Search states
  const [filter, setFilter] = useState<LogbookFilterState>({
    search: '',
    startDate: '',
    endDate: '',
    kategori: 'All',
    status: 'All',
    createdBy: 'All',
  });

  // Sorting state (Section 17: Default sorting: data terbaru ditampilkan paling atas)
  const [sortField, setSortField] = useState<SortField>('tanggal');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  // Modals & Drawer state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LogbookRecord | null>(null);

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<LogbookRecord | null>(null);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Toast Notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'validation', message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener: Cmd+K / Ctrl+K & N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // N for New Logbook
      else if (
        (e.key === 'n' || e.key === 'N') &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        !isFormOpen &&
        !isCommandPaletteOpen &&
        !isDeleteOpen
      ) {
        if (currentUser.role === 'User' || currentUser.role === 'Admin') {
          e.preventDefault();
          handleOpenCreate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser.role, isFormOpen, isCommandPaletteOpen, isDeleteOpen]);

  // Change Role simulation
  const handleRoleChange = (role: UserRole) => {
    const updated = storageService.setCurrentUserRole(role);
    setCurrentUser(updated);
    addToast('success', `Beralih ke peran: ${role} (${updated.name})`);
  };

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Filter and sort items with RBAC visibility rules (Section 6 & FR-01)
  const filteredLogbooks = useMemo(() => {
    return storageService.filterAndSortLogbooks(
      logbooks,
      filter,
      sortField,
      sortDir,
      currentUser.role,
      currentUser.name
    );
  }, [logbooks, filter, sortField, sortDir, currentUser]);

  // Selected item for slide-over drawer
  const selectedRecord = useMemo(() => {
    if (!selectedRecordId) return null;
    return logbooks.find((l) => l.id === selectedRecordId) || null;
  }, [logbooks, selectedRecordId]);

  const selectedIndex = useMemo(() => {
    if (!selectedRecordId) return -1;
    return filteredLogbooks.findIndex((l) => l.id === selectedRecordId);
  }, [filteredLogbooks, selectedRecordId]);

  // Unique authors for filter dropdown
  const usersList = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_USERS.forEach((u) => set.add(u.name));
    logbooks.forEach((l) => set.add(l.createdBy));
    return Array.from(set);
  }, [logbooks]);

  // Statistics summary counters
  const stats = useMemo(() => {
    const roleItems =
      currentUser.role === 'User'
        ? logbooks.filter((l) => l.createdBy === currentUser.name)
        : logbooks;
    const total = roleItems.length;
    const completed = roleItems.filter((l) => l.status === 'Completed').length;
    const inProgress = roleItems.filter((l) => l.status === 'In Progress').length;
    const submitted = roleItems.filter((l) => l.status === 'Submitted').length;
    const draft = roleItems.filter((l) => l.status === 'Draft').length;
    return { total, completed, inProgress, submitted, draft };
  }, [logbooks, currentUser]);

  // Actions
  const handleOpenCreate = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleOpenCreateWithDate = (date: string) => {
    const defaultData: LogbookRecord = {
      id: '',
      tanggal: date,
      judul: '',
      kategori: 'Development',
      deskripsi: '',
      status: 'In Progress',
      createdBy: currentUser.name,
      createdDate: '',
    };
    setEditingRecord(defaultData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: LogbookRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: LogbookRecord) => {
    setSelectedRecordId(record.id);
  };

  const handleCloseDetail = () => {
    setSelectedRecordId(null);
  };

  const handleOpenDelete = (record: LogbookRecord) => {
    setDeletingRecord(record);
    setIsDeleteOpen(true);
  };

  // Quick Clone
  const handleCloneAsToday = (record: LogbookRecord) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    setEditingRecord({
      ...record,
      id: '',
      tanggal: todayStr,
      status: 'In Progress',
      judul: `${record.judul} (Lanjutan)`,
    });
    setIsFormOpen(true);
    addToast('success', 'Aktivitas disalin sebagai draf hari ini.');
  };

  // Quick Status Transition
  const handleQuickStatusChange = (record: LogbookRecord, newStatus: LogbookStatus) => {
    if (record.status === newStatus) return;
    const res = storageService.updateLogbook(
      record.id,
      { status: newStatus },
      currentUser.name
    );
    if (res.success) {
      setLogbooks(storageService.getAllLogbooks());
      setAuditTrails(storageService.getAllAuditTrails());
      addToast('success', `Status ${record.id} diubah menjadi "${newStatus}".`);
    } else {
      addToast('error', res.message || 'Gagal mengubah status logbook.');
    }
  };

  // Fast Capture
  const handleFastCreate = (judul: string, kategori: LogbookCategory) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const res = storageService.createLogbook(
      {
        tanggal: today,
        judul,
        kategori,
        deskripsi: `Aktivitas ${judul.toLowerCase()} yang dicatat melalui entri cepat.`,
        status: 'In Progress',
      },
      currentUser.name
    );

    if (res.success) {
      setLogbooks(storageService.getAllLogbooks());
      setAuditTrails(storageService.getAllAuditTrails());
      addToast('success', `Aktivitas "${judul}" berhasil dicatat.`);
    } else {
      addToast('error', res.message || 'Gagal menyimpan.');
    }
  };

  // KPI Quick Filter Toggle
  const handleToggleStatusFilter = (targetStatus: LogbookStatus | 'All') => {
    setFilter((prev) => ({
      ...prev,
      status: prev.status === targetStatus ? 'All' : targetStatus,
    }));
  };

  // Save (Create or Update)
  const handleSaveForm = (formData: {
    tanggal: string;
    judul: string;
    kategori: LogbookCategory;
    deskripsi: string;
    status: LogbookStatus;
    catatan?: string;
    attachment?: AttachmentFile;
  }) => {
    if (editingRecord && editingRecord.id) {
      // Update
      const res = storageService.updateLogbook(
        editingRecord.id,
        formData,
        currentUser.name
      );
      if (res.success) {
        setLogbooks(storageService.getAllLogbooks());
        setAuditTrails(storageService.getAllAuditTrails());
        setIsFormOpen(false);
        addToast('success', 'Logbook berhasil diperbarui.');
      } else {
        addToast('error', res.message || 'Logbook gagal disimpan. Silakan coba kembali.');
      }
    } else {
      // Create
      const res = storageService.createLogbook(formData, currentUser.name);
      if (res.success) {
        setLogbooks(storageService.getAllLogbooks());
        setAuditTrails(storageService.getAllAuditTrails());
        setIsFormOpen(false);
        addToast('success', 'Logbook berhasil dibuat.');
      } else {
        addToast('error', res.message || 'Logbook gagal disimpan. Silakan coba kembali.');
      }
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingRecord) return;
    const res = storageService.deleteLogbook(deletingRecord.id, currentUser.name);
    if (res.success) {
      setLogbooks(storageService.getAllLogbooks());
      setAuditTrails(storageService.getAllAuditTrails());
      setIsDeleteOpen(false);
      if (selectedRecordId === deletingRecord.id) {
        setSelectedRecordId(null);
      }
      setDeletingRecord(null);
      addToast('success', 'Logbook berhasil dihapus.');
    } else {
      addToast('error', res.message || 'Gagal menghapus logbook.');
    }
  };

  // Reset to default
  const handleResetData = () => {
    if (
      window.confirm(
        'Kembalikan seluruh data logbook dan audit trail ke contoh bawaan?'
      )
    ) {
      storageService.resetToDefault();
      setLogbooks(storageService.getAllLogbooks());
      setAuditTrails(storageService.getAllAuditTrails());
      setCurrentUser(storageService.getCurrentUser());
      setSelectedRecordId(null);
      addToast('success', 'Data logbook berhasil direset ke kondisi awal.');
    }
  };

  // Export JSON
  const handleExportData = () => {
    const json = storageService.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logbook-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Berkas cadangan logbook berhasil diunduh.');
  };

  // Import JSON
  const handleImportData = (jsonStr: string) => {
    const ok = storageService.importBackupJson(jsonStr);
    if (ok) {
      setLogbooks(storageService.getAllLogbooks());
      setAuditTrails(storageService.getAllAuditTrails());
      addToast('success', 'Data logbook berhasil dipulihkan.');
    } else {
      addToast('error', 'Format berkas JSON tidak valid.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-row font-sans selection:bg-slate-800 selection:text-white">
      {/* Left Modern Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeStatusFilter={filter.status}
        onFilterStatus={handleToggleStatusFilter}
        onFilterMine={() =>
          setFilter((prev) => ({
            ...prev,
            createdBy: prev.createdBy === currentUser.name ? 'All' : currentUser.name,
          }))
        }
        isFilterMineActive={filter.createdBy === currentUser.name}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onExportData={handleExportData}
        onResetData={handleResetData}
        counts={stats}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
          onOpenAuditModal={() => setIsAuditModalOpen(true)}
          onResetData={handleResetData}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />

        {/* Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          {/* Fast Capture Bar */}
          <FastCaptureBar
            onFastCreate={handleFastCreate}
            canCreate={currentUser.role === 'User' || currentUser.role === 'Admin'}
          />

          {/* Activity Heatmap Strip */}
          <ActivityHeatmap
            logbooks={logbooks}
            onSelectDate={(date) =>
              setFilter((prev) => ({
                ...prev,
                startDate: prev.startDate === date ? '' : date,
                endDate: prev.endDate === date ? '' : date,
              }))
            }
            selectedDate={filter.startDate === filter.endDate ? filter.startDate : undefined}
          />

          {/* Interactive KPI Counters Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => handleToggleStatusFilter('All')}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                filter.status === 'All'
                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider block ${
                  filter.status === 'All' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                Total Logbook
              </span>
              <span className="text-xl font-extrabold mt-1 block">
                {stats.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleStatusFilter('Completed')}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                filter.status === 'Completed'
                  ? 'bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-600 ring-offset-2'
                  : 'bg-white border-slate-200 hover:border-emerald-300 text-emerald-700'
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider block ${
                  filter.status === 'Completed' ? 'text-emerald-100' : 'text-emerald-700'
                }`}
              >
                Completed
              </span>
              <span className="text-xl font-extrabold mt-1 block">
                {stats.completed}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleStatusFilter('In Progress')}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                filter.status === 'In Progress'
                  ? 'bg-blue-700 text-white border-blue-700 ring-2 ring-blue-600 ring-offset-2'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-blue-700'
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider block ${
                  filter.status === 'In Progress' ? 'text-blue-100' : 'text-blue-700'
                }`}
              >
                In Progress
              </span>
              <span className="text-xl font-extrabold mt-1 block">
                {stats.inProgress}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleStatusFilter('Submitted')}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                filter.status === 'Submitted'
                  ? 'bg-sky-700 text-white border-sky-700 ring-2 ring-sky-600 ring-offset-2'
                  : 'bg-white border-slate-200 hover:border-sky-300 text-sky-700'
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider block ${
                  filter.status === 'Submitted' ? 'text-sky-100' : 'text-sky-700'
                }`}
              >
                Submitted
              </span>
              <span className="text-xl font-extrabold mt-1 block">
                {stats.submitted}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleStatusFilter('Draft')}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm col-span-2 sm:col-span-1 ${
                filter.status === 'Draft'
                  ? 'bg-slate-700 text-white border-slate-700 ring-2 ring-slate-600 ring-offset-2'
                  : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider block ${
                  filter.status === 'Draft' ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                Draft
              </span>
              <span className="text-xl font-extrabold mt-1 block">
                {stats.draft}
              </span>
            </button>
          </div>

          {/* Filter Bar with View Switcher */}
          <LogbookFilterBar
            filter={filter}
            onFilterChange={setFilter}
            onOpenCreateModal={handleOpenCreate}
            userRole={currentUser.role}
            currentUserName={currentUser.name}
            categories={CATEGORIES}
            statuses={STATUSES}
            usersList={usersList}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={filteredLogbooks.length}
          />

          {/* Dynamic Views: Table, Board, Timeline, or Calendar */}
          {viewMode === 'table' && (
            <LogbookTable
              logbooks={filteredLogbooks}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
              onViewDetail={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onCloneAsToday={handleCloneAsToday}
              onQuickStatusChange={handleQuickStatusChange}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
            />
          )}

          {viewMode === 'board' && (
            <LogbookBoard
              logbooks={filteredLogbooks}
              onViewDetail={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onQuickStatusChange={handleQuickStatusChange}
              onOpenCreateModal={handleOpenCreate}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
            />
          )}

          {viewMode === 'timeline' && (
            <LogbookTimeline
              logbooks={filteredLogbooks}
              onViewDetail={handleOpenDetail}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onCloneAsToday={handleCloneAsToday}
              currentUserRole={currentUser.role}
              currentUserName={currentUser.name}
            />
          )}

          {viewMode === 'calendar' && (
            <CalendarView
              logbooks={filteredLogbooks}
              onViewDetail={handleOpenDetail}
              onOpenCreateModalWithDate={handleOpenCreateWithDate}
              currentUserRole={currentUser.role}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Logbook Enterprise. Sistem pencatatan aktivitas terstruktur
            dan terpadu sesuai standar tata kelola korporat.
          </p>
        </footer>
      </div>

      {/* Slide-Over Inspector Drawer (Modern Detail View) */}
      <LogbookDrawer
        isOpen={Boolean(selectedRecord)}
        onClose={handleCloseDetail}
        record={selectedRecord}
        auditTrails={
          selectedRecord
            ? storageService.getAuditTrailsByLogbookId(selectedRecord.id)
            : []
        }
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onQuickStatusChange={handleQuickStatusChange}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex >= 0 && selectedIndex < filteredLogbooks.length - 1}
        onNavigatePrev={() => {
          if (selectedIndex > 0) {
            setSelectedRecordId(filteredLogbooks[selectedIndex - 1].id);
          }
        }}
        onNavigateNext={() => {
          if (selectedIndex < filteredLogbooks.length - 1) {
            setSelectedRecordId(filteredLogbooks[selectedIndex + 1].id);
          }
        }}
        currentUserRole={currentUser.role}
        currentUserName={currentUser.name}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        logbooks={logbooks}
        onSelectLogbook={(record) => setSelectedRecordId(record.id)}
        onOpenCreate={handleOpenCreate}
        onViewModeChange={setViewMode}
        onRoleChange={handleRoleChange}
        onFilterStatus={(st) => setFilter((prev) => ({ ...prev, status: st }))}
        onExportData={handleExportData}
        onResetData={handleResetData}
      />

      {/* Create / Edit Modal */}
      <LogbookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
        initialData={editingRecord}
        categories={CATEGORIES}
        statuses={STATUSES}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        record={deletingRecord}
      />

      {/* System Audit Modal */}
      <SystemAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditTrails={auditTrails}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
