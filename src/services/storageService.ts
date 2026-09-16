import type {
  LogbookRecord,
  AuditTrailRecord,
  CurrentUser,
  UserRole,
  LogbookFilterState,
  SortField,
  SortDirection,
} from '../types';

const STORAGE_KEYS = {
  LOGBOOKS: 'app_logbook_records_v1',
  AUDIT_TRAIL: 'app_logbook_audit_trail_v1',
  CURRENT_USER: 'app_logbook_current_user_v1',
};

// Available system users for testing role-based access
export const AVAILABLE_USERS: CurrentUser[] = [
  {
    id: 'usr-1',
    name: 'Farhan Pratama',
    role: 'User',
    department: 'Software Engineering',
    email: 'farhan.pratama@inovasidigital.id',
  },
  {
    id: 'usr-2',
    name: 'Siti Nurhaliza',
    role: 'Supervisor',
    department: 'Engineering & Tech',
    email: 'siti.nurhaliza@inovasidigital.id',
  },
  {
    id: 'usr-3',
    name: 'Budi Santoso',
    role: 'Admin',
    department: 'IT Operations',
    email: 'budi.santoso@inovasidigital.id',
  },
  {
    id: 'usr-4',
    name: 'Dian Permata',
    role: 'Viewer',
    department: 'Auditor Eksternal',
    email: 'dian.permata@auditor.id',
  },
];

const INITIAL_LOGBOOKS: LogbookRecord[] = [
  {
    id: 'LB-000001',
    tanggal: '2026-09-16',
    judul: 'UAT Testing Modul Manajemen Logbook',
    kategori: 'Testing',
    status: 'Completed',
    deskripsi:
      'Melakukan User Acceptance Testing (UAT) komprehensif terhadap fungsionalitas pembuatan, pencarian, dan audit trail logbook sesuai spesifikasi dokumen PRD.',
    catatan: 'Seluruh skenario uji acceptance criteria AC-01 hingga AC-09 terpenuhi dengan hasil lulus (pass).',
    createdBy: 'Farhan Pratama',
    createdDate: '2026-09-16 09:30',
    updatedBy: 'Siti Nurhaliza',
    updatedDate: '2026-09-16 11:15',
    attachment: {
      id: 'att-1',
      name: 'UAT_Result_SignOff.pdf',
      size: 142050,
      type: 'application/pdf',
      uploadedAt: '2026-09-16 09:30',
    },
    isDeleted: false,
  },
  {
    id: 'LB-000002',
    tanggal: '2026-09-15',
    judul: 'Pengembangan Komponen Filter & Pencarian Multi-field',
    kategori: 'Development',
    status: 'Completed',
    deskripsi:
      'Mengimplementasikan filter dinamis berdasarkan rentang tanggal, kategori aktivitas, dan status logbook dengan performa query lokal tanpa lag.',
    catatan: 'Menambahkan debounce pada kolom pencarian teks untuk efisiensi render.',
    createdBy: 'Farhan Pratama',
    createdDate: '2026-09-15 08:45',
    updatedBy: 'Farhan Pratama',
    updatedDate: '2026-09-15 17:00',
    isDeleted: false,
  },
  {
    id: 'LB-000003',
    tanggal: '2026-09-15',
    judul: 'Daily Standup Meeting & Sprint Planning',
    kategori: 'Meeting',
    status: 'Completed',
    deskripsi:
      'Menghadiri rapat sinkronisasi harian bersama tim teknis dan Product Manager untuk mereview progress sprint dan identifikasi potensi kendala integrasi.',
    catatan: 'Tidak ada blocker utama untuk rilis minggu ini.',
    createdBy: 'Farhan Pratama',
    createdDate: '2026-09-15 09:00',
    isDeleted: false,
  },
  {
    id: 'LB-000004',
    tanggal: '2026-09-14',
    judul: 'Investigasi Kendala Latency pada Database Replica',
    kategori: 'Issue/Incident',
    status: 'Completed',
    deskripsi:
      'Menganalisis lonjakan response time pada read-replica cluster database PostgreSQL serta melakukan optimalisasi query index.',
    catatan: 'Indeks komposit ditambahkan pada tabel audit trail, response time turun dari 450ms menjadi 18ms.',
    createdBy: 'Budi Santoso',
    createdDate: '2026-09-14 13:20',
    updatedBy: 'Budi Santoso',
    updatedDate: '2026-09-14 16:40',
    attachment: {
      id: 'att-2',
      name: 'Incident_PostMortem_Report.pdf',
      size: 284000,
      type: 'application/pdf',
      uploadedAt: '2026-09-14 16:40',
    },
    isDeleted: false,
  },
  {
    id: 'LB-000005',
    tanggal: '2026-09-14',
    judul: 'Penyusunan Dokumentasi Teknis API & Data Dictionary',
    kategori: 'Documentation',
    status: 'In Progress',
    deskripsi:
      'Menulis spesifikasi OpenAPI untuk endpoint logbook dan menyusun panduan integrasi bagi pengembang internal.',
    catatan: 'Progres saat ini mencapai 75%, menunggu validasi skema audit trail dari tech lead.',
    createdBy: 'Farhan Pratama',
    createdDate: '2026-09-14 10:15',
    isDeleted: false,
  },
  {
    id: 'LB-000006',
    tanggal: '2026-09-13',
    judul: 'Pemeliharaan Rutin Server Staging & Update Security Patch',
    kategori: 'Maintenance',
    status: 'Completed',
    deskripsi:
      'Menerapkan pembaruan keamanan sistem operasi dan dependensi library pada node server lingkungan staging.',
    catatan: 'Proses restart service berjalan mulus tanpa insiden.',
    createdBy: 'Budi Santoso',
    createdDate: '2026-09-13 20:00',
    isDeleted: false,
  },
  {
    id: 'LB-000007',
    tanggal: '2026-09-12',
    judul: 'Monitoring Beban Trafik dan Resource Utilization',
    kategori: 'Monitoring',
    status: 'Completed',
    deskripsi:
      'Memantau metrik CPU, memory, dan network I/O selama jam kerja sibuk untuk memverifikasi kestabilan service.',
    catatan: 'Rata-rata penggunaan CPU berada pada kisaran 38%, memori aman di 52%.',
    createdBy: 'Siti Nurhaliza',
    createdDate: '2026-09-12 11:00',
    isDeleted: false,
  },
  {
    id: 'LB-000008',
    tanggal: '2026-09-11',
    judul: 'Analisis Kebutuhan Role-Based Access Control (RBAC)',
    kategori: 'Analysis',
    status: 'Submitted',
    deskripsi:
      'Melakukan analisis matriks kewenangan antara peran User, Supervisor, Admin, dan Viewer agar sesuai standar tata kelola kepatuhan perusahaan.',
    catatan: 'Draf dokumen matriks telah diserahkan untuk direview oleh tim Governance.',
    createdBy: 'Farhan Pratama',
    createdDate: '2026-09-11 14:30',
    isDeleted: false,
  },
  {
    id: 'LB-000009',
    tanggal: '2026-09-10',
    judul: 'Eksplorasi Framework Frontend & Arsitektur Komponen',
    kategori: 'Development',
    status: 'Draft',
    deskripsi:
      'Meneliti struktur arsitektur modular yang ringan, maintainable, dan bebas ketergantungan kompleks untuk antarmuka web logbook.',
    catatan: 'Masih berupa catatan draf riset teknis awal.',
    createdBy: 'Farhan Pratama',
    createdDate: '2026-09-10 15:45',
    isDeleted: false,
  },
];

const INITIAL_AUDIT_TRAILS: AuditTrailRecord[] = [
  {
    id: 'aud-1',
    logbookId: 'LB-000001',
    action: 'Create',
    changedBy: 'Farhan Pratama',
    changedDate: '16/09/2026 09:30',
    newValue: 'In Progress',
  },
  {
    id: 'aud-2',
    logbookId: 'LB-000001',
    action: 'Edit',
    fieldChanged: 'Status',
    oldValue: 'In Progress',
    newValue: 'Completed',
    changedBy: 'Siti Nurhaliza',
    changedDate: '16/09/2026 11:15',
  },
  {
    id: 'aud-3',
    logbookId: 'LB-000004',
    action: 'Create',
    changedBy: 'Budi Santoso',
    changedDate: '14/09/2026 13:20',
    newValue: 'Submitted',
  },
  {
    id: 'aud-4',
    logbookId: 'LB-000004',
    action: 'Edit',
    fieldChanged: 'Status',
    oldValue: 'Submitted',
    newValue: 'Completed',
    changedBy: 'Budi Santoso',
    changedDate: '14/09/2026 16:40',
  },
];

export const storageService = {
  // Current User Management
  getCurrentUser(): CurrentUser {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      const defaultUser = AVAILABLE_USERS[0];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return AVAILABLE_USERS[0];
    }
  },

  setCurrentUserRole(role: UserRole): CurrentUser {
    const found = AVAILABLE_USERS.find((u) => u.role === role) || AVAILABLE_USERS[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
    return found;
  },

  // Logbook CRUD
  getAllLogbooks(includeDeleted = false): LogbookRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGBOOKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(INITIAL_LOGBOOKS));
      return INITIAL_LOGBOOKS;
    }
    try {
      const list: LogbookRecord[] = JSON.parse(raw);
      return includeDeleted ? list : list.filter((item) => !item.isDeleted);
    } catch {
      return INITIAL_LOGBOOKS;
    }
  },

  getLogbookById(id: string): LogbookRecord | undefined {
    const list = this.getAllLogbooks(true);
    return list.find((item) => item.id === id);
  },

  generateNextLogbookId(): string {
    const list = this.getAllLogbooks(true);
    let maxNum = 0;
    for (const item of list) {
      const match = item.id.match(/^LB-(\d+)$/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const nextNum = maxNum + 1;
    return `LB-${String(nextNum).padStart(6, '0')}`;
  },

  createLogbook(
    data: Omit<LogbookRecord, 'id' | 'createdDate' | 'isDeleted' | 'createdBy'>,
    authorName: string
  ): { success: boolean; data?: LogbookRecord; message?: string } {
    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const createdDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const newId = this.generateNextLogbookId();
      const newRecord: LogbookRecord = {
        ...data,
        id: newId,
        createdBy: authorName,
        createdDate,
        isDeleted: false,
      };

      const list = this.getAllLogbooks(true);
      list.unshift(newRecord);
      localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(list));

      // Audit Trail for creation
      this.addAuditTrail({
        logbookId: newId,
        action: 'Create',
        fieldChanged: 'Status',
        oldValue: '-',
        newValue: newRecord.status,
        changedBy: authorName,
      });

      return { success: true, data: newRecord };
    } catch (err) {
      return { success: false, message: 'Logbook gagal disimpan. Silakan coba kembali.' };
    }
  },

  updateLogbook(
    id: string,
    updates: Partial<Omit<LogbookRecord, 'id' | 'createdDate' | 'createdBy' | 'isDeleted'>>,
    editorName: string
  ): { success: boolean; data?: LogbookRecord; message?: string } {
    try {
      const list = this.getAllLogbooks(true);
      const index = list.findIndex((item) => item.id === id);
      if (index === -1) {
        return { success: false, message: 'Data logbook tidak ditemukan.' };
      }

      const existing = list[index];

      // BR-07: Logbook yang telah berstatus final/completed tidak dapat diubah (unless status is being updated by admin/supervisor)
      if (existing.status === 'Completed' && updates.status === undefined) {
        return {
          success: false,
          message: 'Logbook yang telah berstatus Completed tidak dapat diubah.',
        };
      }

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const updatedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      // Detect field changes for audit trail
      if (updates.status && updates.status !== existing.status) {
        this.addAuditTrail({
          logbookId: id,
          action: 'Edit',
          fieldChanged: 'Status',
          oldValue: existing.status,
          newValue: updates.status,
          changedBy: editorName,
        });
      }

      if (updates.judul && updates.judul !== existing.judul) {
        this.addAuditTrail({
          logbookId: id,
          action: 'Edit',
          fieldChanged: 'Judul Aktivitas',
          oldValue: existing.judul,
          newValue: updates.judul,
          changedBy: editorName,
        });
      }

      if (updates.kategori && updates.kategori !== existing.kategori) {
        this.addAuditTrail({
          logbookId: id,
          action: 'Edit',
          fieldChanged: 'Kategori',
          oldValue: existing.kategori,
          newValue: updates.kategori,
          changedBy: editorName,
        });
      }

      const updatedRecord: LogbookRecord = {
        ...existing,
        ...updates,
        updatedBy: editorName,
        updatedDate,
      };

      list[index] = updatedRecord;
      localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(list));

      return { success: true, data: updatedRecord };
    } catch (err) {
      return { success: false, message: 'Logbook gagal disimpan. Silakan coba kembali.' };
    }
  },

  // Soft delete implementation according to PRD section 14
  deleteLogbook(id: string, deleterName: string): { success: boolean; message?: string } {
    try {
      const list = this.getAllLogbooks(true);
      const index = list.findIndex((item) => item.id === id);
      if (index === -1) {
        return { success: false, message: 'Data logbook tidak ditemukan.' };
      }

      list[index].isDeleted = true;
      localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(list));

      // Record in audit trail
      this.addAuditTrail({
        logbookId: id,
        action: 'Delete',
        fieldChanged: 'isDeleted',
        oldValue: 'Active',
        newValue: 'Deleted (Soft Delete)',
        changedBy: deleterName,
      });

      return { success: true };
    } catch {
      return { success: false, message: 'Gagal menghapus logbook.' };
    }
  },

  // Audit Trail
  getAllAuditTrails(): AuditTrailRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_TRAIL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_TRAIL, JSON.stringify(INITIAL_AUDIT_TRAILS));
      return INITIAL_AUDIT_TRAILS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_TRAILS;
    }
  },

  getAuditTrailsByLogbookId(logbookId: string): AuditTrailRecord[] {
    const all = this.getAllAuditTrails();
    return all.filter((a) => a.logbookId === logbookId);
  },

  addAuditTrail(item: Omit<AuditTrailRecord, 'id' | 'changedDate'>): void {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const changedDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;

    const newRecord: AuditTrailRecord = {
      ...item,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      changedDate,
    };

    const list = this.getAllAuditTrails();
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.AUDIT_TRAIL, JSON.stringify(list));
  },

  // Search, Filter, and Sort Helper
  filterAndSortLogbooks(
    list: LogbookRecord[],
    filter: LogbookFilterState,
    sortField: SortField = 'tanggal',
    sortDir: SortDirection = 'desc',
    currentUserRole: UserRole,
    currentUserName: string
  ): LogbookRecord[] {
    let result = [...list];

    // Role-based visibility check (FR-01, Section 6)
    // User can only see their own logbooks, while Supervisor/Admin/Viewer can see all
    if (currentUserRole === 'User') {
      result = result.filter((item) => item.createdBy === currentUserName);
    }

    // 1. Search (AC-06, Section 15): search by Judul, ID, Deskripsi, or CreatedBy
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.judul.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.deskripsi.toLowerCase().includes(q) ||
          item.createdBy.toLowerCase().includes(q)
      );
    }

    // 2. Date Range Filter (Section 16)
    if (filter.startDate) {
      result = result.filter((item) => item.tanggal >= filter.startDate);
    }
    if (filter.endDate) {
      result = result.filter((item) => item.tanggal <= filter.endDate);
    }

    // 3. Category Filter
    if (filter.kategori && filter.kategori !== 'All') {
      result = result.filter((item) => item.kategori === filter.kategori);
    }

    // 4. Status Filter
    if (filter.status && filter.status !== 'All') {
      result = result.filter((item) => item.status === filter.status);
    }

    // 5. CreatedBy Filter (if specified and not 'All')
    if (filter.createdBy && filter.createdBy !== 'All') {
      result = result.filter((item) => item.createdBy === filter.createdBy);
    }

    // 6. Sorting (Section 17)
    result.sort((a, b) => {
      let valA: string = '';
      let valB: string = '';

      switch (sortField) {
        case 'tanggal':
          valA = a.tanggal;
          valB = b.tanggal;
          break;
        case 'createdDate':
          valA = a.createdDate;
          valB = b.createdDate;
          break;
        case 'updatedDate':
          valA = a.updatedDate || a.createdDate;
          valB = b.updatedDate || b.createdDate;
          break;
        case 'judul':
          valA = a.judul.toLowerCase();
          valB = b.judul.toLowerCase();
          break;
        default:
          valA = a.tanggal;
          valB = b.tanggal;
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  },

  // Reset to default sample data
  resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(INITIAL_LOGBOOKS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_TRAIL, JSON.stringify(INITIAL_AUDIT_TRAILS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(AVAILABLE_USERS[0]));
  },

  // Export & Import backup
  exportBackupJson(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      logbooks: this.getAllLogbooks(true),
      auditTrails: this.getAllAuditTrails(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.logbooks)) {
        localStorage.setItem(STORAGE_KEYS.LOGBOOKS, JSON.stringify(parsed.logbooks));
      }
      if (Array.isArray(parsed.auditTrails)) {
        localStorage.setItem(STORAGE_KEYS.AUDIT_TRAIL, JSON.stringify(parsed.auditTrails));
      }
      return true;
    } catch {
      return false;
    }
  },
};
