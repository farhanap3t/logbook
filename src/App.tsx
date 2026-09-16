import { useState, useMemo } from 'react';
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
} from './types';
import { Header } from './components/Header';
import { LogbookFilterBar } from './components/LogbookFilterBar';
import { LogbookTable } from './components/LogbookTable';
import { LogbookFormModal } from './components/LogbookFormModal';
import { LogbookDetailModal } from './components/LogbookDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SystemAuditModal } from './components/SystemAuditModal';
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

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LogbookRecord | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<LogbookRecord | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<LogbookRecord | null>(null);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

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

  // Unique authors for filter dropdown
  const usersList = useMemo(() => {
    const set = new Set<string>();
    AVAILABLE_USERS.forEach((u) => set.add(u.name));
    logbooks.forEach((l) => set.add(l.createdBy));
    return Array.from(set);
  }, [logbooks]);

  // Statistics summary counters
  const stats = useMemo(() => {
    const total = filteredLogbooks.length;
    const completed = filteredLogbooks.filter((l) => l.status === 'Completed').length;
    const inProgress = filteredLogbooks.filter((l) => l.status === 'In Progress').length;
    const submitted = filteredLogbooks.filter((l) => l.status === 'Submitted').length;
    const draft = filteredLogbooks.filter((l) => l.status === 'Draft').length;
    return { total, completed, inProgress, submitted, draft };
  }, [filteredLogbooks]);

  // Actions
  const handleOpenCreate = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: LogbookRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: LogbookRecord) => {
    setDetailRecord(record);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (record: LogbookRecord) => {
    setDeletingRecord(record);
    setIsDeleteOpen(true);
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
    if (editingRecord) {
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-slate-800 selection:text-white">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* KPI / Metric Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Logbook
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              {stats.total}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
              {stats.completed}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
              In Progress
            </span>
            <span className="text-xl font-extrabold text-blue-700 mt-1 block">
              {stats.inProgress}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider block">
              Submitted
            </span>
            <span className="text-xl font-extrabold text-sky-700 mt-1 block">
              {stats.submitted}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
              Draft
            </span>
            <span className="text-xl font-extrabold text-slate-700 mt-1 block">
              {stats.draft}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <LogbookFilterBar
          filter={filter}
          onFilterChange={setFilter}
          onOpenCreateModal={handleOpenCreate}
          userRole={currentUser.role}
          categories={CATEGORIES}
          statuses={STATUSES}
          usersList={usersList}
        />

        {/* Data Table & Card List */}
        <LogbookTable
          logbooks={filteredLogbooks}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onViewDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          currentUserRole={currentUser.role}
          currentUserName={currentUser.name}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} Logbook Enterprise. Sistem pencatatan aktivitas terstruktur
          dan terpadu sesuai standar tata kelola korporat.
        </p>
      </footer>

      {/* Create / Edit Modal */}
      <LogbookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
        initialData={editingRecord}
        categories={CATEGORIES}
        statuses={STATUSES}
      />

      {/* Detail Modal */}
      <LogbookDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={detailRecord}
        auditTrails={
          detailRecord
            ? storageService.getAuditTrailsByLogbookId(detailRecord.id)
            : []
        }
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        currentUserRole={currentUser.role}
        currentUserName={currentUser.name}
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
