import type {
  UserProfile,
  InternshipPeriod,
  LogbookEntry,
  CurriculumModule,
  PeriodEvaluation,
  StipendDetail,
  Announcement,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'bsi_logbook_profile',
  PERIODS: 'bsi_logbook_periods',
  ENTRIES: 'bsi_logbook_entries',
  CURRICULUM: 'bsi_logbook_curriculum',
  EVALUATIONS: 'bsi_logbook_evaluations',
  STIPENDS: 'bsi_logbook_stipends',
  ANNOUNCEMENTS: 'bsi_logbook_announcements',
  DRAFTS: 'bsi_logbook_drafts',
};

// Initial Profile matching references
const initialProfile: UserProfile = {
  name: 'MUHAMMAD FARHAN',
  role: 'Peserta Magang',
  email: 'farhn.mhmmad@gmail.com',
  phone: '0895331284320',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  company: 'PT. Bank Syariah Indonesia Tbk',
  position: 'Junior IT Intern',
  placementLocation: 'KOTA ADM. JAKARTA SELATAN',
  internshipStartDate: '2026-08-10',
  internshipEndDate: '2027-02-09',
  status: 'Aktif',
  mentorName: 'Zaim Nur Afif',
  mentorEmail: 'zaim.afif@bankbsi.co.id',
  universityName: 'Universitas Indonesia',
  major: 'Ilmu Komputer & Sistem Informasi',
  studentId: '2206123456',
};

const initialPeriods: InternshipPeriod[] = [
  {
    id: 1,
    name: 'Periode 1',
    startDate: '2026-08-10',
    endDate: '2026-09-09',
    isCurrent: false,
  },
  {
    id: 2,
    name: 'Periode 2',
    startDate: '2026-09-10',
    endDate: '2026-10-09',
    isCurrent: true,
  },
  {
    id: 3,
    name: 'Periode 3',
    startDate: '2026-10-10',
    endDate: '2026-11-09',
    isCurrent: false,
  },
  {
    id: 4,
    name: 'Periode 4',
    startDate: '2026-11-10',
    endDate: '2026-12-09',
    isCurrent: false,
  },
  {
    id: 5,
    name: 'Periode 5',
    startDate: '2026-12-10',
    endDate: '2027-01-09',
    isCurrent: false,
  },
  {
    id: 6,
    name: 'Periode 6',
    startDate: '2027-01-10',
    endDate: '2027-02-09',
    isCurrent: false,
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Ketentuan Kebijakan Cuti & Izin Berbayar',
    date: '2026-09-10',
    category: 'Penting',
    content:
      'Izin hingga maksimal 3 hari kerja per periode magang tetap berbayar (eligible uang saku). Izin ke-4 dan seterusnya tidak dibayarkan, namun tidak dihitung sebagai pelanggaran/peringatan pemutusan magang.',
    isNew: true,
  },
  {
    id: 'ann-2',
    title: 'Batas Akhir Pengisian Logbook Harian Pukul 23:59 WIB',
    date: '2026-09-05',
    category: 'Penting',
    content:
      'Seluruh peserta wajib melengkapi laporan aktivitas harian dengan minimal 100 karakter pada setiap kolom sebelum pukul 23:59 WIB setiap hari kerja. Keterlambatan akan berstatus tanpa catatan kehadiran.',
    isNew: false,
  },
  {
    id: 'ann-3',
    title: 'Jadwal Townhall & Mentoring Session Mingguan',
    date: '2026-09-02',
    category: 'Kegiatan',
    content:
      'Sesi 1-on-1 sharing session bersama mentor divisi IT BSI akan dilaksanakan setiap hari Jumat pukul 14:00 WIB via Microsoft Teams.',
    isNew: false,
  },
];

const initialCurriculum: CurriculumModule[] = [
  {
    id: 'curr-p2-1',
    periodId: 2,
    title: 'Performance Evaluation, Feedback & Teamwork',
    type: 'Praktik',
    month: 'Bulan ke-2',
    duration: '1–14 hari',
    description:
      'Dua minggu ini difokuskan pada evaluasi hasil kinerja bulan pertama melalui sesi diskusi satu-lawan-satu (one-on-one) bersama mentor untuk membahas ruang perbaikan kerja dengan mengedepankan growth mindset. Setelah itu, peserta dilibatkan dalam tugas kolaboratif di dalam divisi untuk memahami dinamika kelompok dan melihat bagaimana peran harian mereka saling terhubung dengan pekerjaan anggota tim lainnya.',
    completed: true,
  },
  {
    id: 'curr-p2-2',
    periodId: 2,
    title: 'Problem Solving in Action & Reporting Skills',
    type: 'Praktik',
    month: 'Bulan ke-2',
    duration: '1–14 hari',
    description:
      'Dalam periode 14 hari ini, peserta dibekali kemampuan berpikir kritis untuk mendeteksi kendala operasional harian dan merumuskan alternatif solusinya secara logis menggunakan metode analisis sederhana sebelum melapor ke mentor. Sesi ini ditutup dengan pelatihan komunikasi visual, di mana peserta belajar menyusun draf presentasi laporan hasil kerja bulanan mereka dan memaparkannya dalam rapat internal divisi.',
    completed: false,
  },
  {
    id: 'curr-p1-1',
    periodId: 1,
    title: 'Company Orientation, Workflow & Team Intro',
    type: 'Teori',
    month: 'Bulan ke-1',
    duration: '1–7 hari',
    description:
      'Pengenalan budaya kerja Bank Syariah Indonesia, tata tertib, standar keamanan data perbankan syariah, dan pengenalan arsitektur infrastruktur IT korporat.',
    completed: true,
  },
  {
    id: 'curr-p1-2',
    periodId: 1,
    title: 'First Assignment, Professional Communication & Time Management',
    type: 'Praktik',
    month: 'Bulan ke-1',
    duration: '8–30 hari',
    description:
      'Pengerjaan tiket pendukung awal, penyesuaian alur kerja sprint scrum, koordinasi lintas tim dan penulisan dokumentasi teknis harian.',
    completed: true,
  },
];

const initialEvaluations: PeriodEvaluation[] = [
  {
    periodId: 1,
    periodName: 'Periode 1 (10 Agustus 2026 - 08 September 2026)',
    status: 'Selesai',
    mentorName: 'Zaim Nur Afif',
    completedAt: '2026-09-08 20:39 WIB',
    overallScore: 3.3,
    aspects: [
      { id: 'asp-1', aspect: '1. Kehadiran dan disiplin', score: 'SB' },
      { id: 'asp-2', aspect: '2. Sikap dan perilaku', score: 'B' },
      { id: 'asp-3', aspect: '3. Kemampuan komunikasi', score: 'C' },
      { id: 'asp-4', aspect: '4. Inisiatif dan tanggung jawab', score: 'C' },
      { id: 'asp-5', aspect: '5. Kemampuan adaptasi', score: 'B' },
      { id: 'asp-6', aspect: '6. Pengetahuan teknis', score: 'C' },
      { id: 'asp-7', aspect: '7. Produktivitas dan ketepatan waktu', score: 'B' },
      { id: 'asp-8', aspect: '8. Kerja sama tim', score: 'B' },
    ],
    curriculumAchievements: [
      { moduleName: 'Company Orientation, Workflow & Team Intro', score: 'Baik' },
      {
        moduleName: 'First Assignment, Professional Communication & Time Management',
        score: 'Cukup',
      },
    ],
    mentorComment: 'Sudah cukup baik dan dapat ditingkatkan lagi keaktifan berkomunikasi serta eksplorasi teknisnya.',
  },
];

const initialStipends: StipendDetail[] = [
  {
    periodId: 1,
    periodName: 'Periode 1',
    dateRange: '10 Agustus 2026 - 09 September 2026',
    submissionStatus: 'Diajukan',
    submittedBy: 'Zaim Nur Afif (Mentor)',
    submittedAt: '9 September 2026 pukul 16.10 WIB',
    nominalEstimate: 3200000,
    bankName: 'PT. Bank Syariah Indonesia Tbk',
    accountNumberMasked: '*******6588',
    accountHolder: 'Muhammad Farhan',
    totalWorkingDays: 21,
    paidDays: 21,
    approvedAttendanceDays: 20,
    paidLeaveDays: 1,
    unpaidDays: 0,
    absentDays: 0,
    rejectedAttendanceDays: 0,
    noRecordDays: 0,
    unpaidLeaveDays: 0,
    nonWorkingDays: 10,
    holidays: 2,
    positionOffDays: 8,
  },
  {
    periodId: 2,
    periodName: 'Periode 2',
    dateRange: '10 September 2026 - 09 Oktober 2026',
    submissionStatus: 'Belum Diajukan',
    submittedBy: '-',
    submittedAt: '-',
    nominalEstimate: 3200000,
    bankName: 'PT. Bank Syariah Indonesia Tbk',
    accountNumberMasked: '*******6588',
    accountHolder: 'Muhammad Farhan',
    totalWorkingDays: 22,
    paidDays: 4,
    approvedAttendanceDays: 4,
    paidLeaveDays: 0,
    unpaidDays: 0,
    absentDays: 0,
    rejectedAttendanceDays: 0,
    noRecordDays: 0,
    unpaidLeaveDays: 0,
    nonWorkingDays: 2,
    holidays: 0,
    positionOffDays: 2,
  },
];

// Initial logbook entries matching the reference calendar (10 Sep, 11 Sep, 14 Sep approved, 12-13 weekend, 15 is today and not filled)
const initialEntries: LogbookEntry[] = [
  {
    id: 'entry-2026-09-10',
    date: '2026-09-10',
    periodId: 2,
    attendanceType: 'Hadir',
    status: 'hadir_disetujui',
    activityDescription:
      'Melakukan analisis arsitektur microservices core banking BSI untuk modul e-channel. Mempelajari dokumentasi internal mengenai protokol message broker Kafka dan data pipelines.',
    learnings:
      'Memahami mekanisme sinkronisasi data transaksi antar cabang dengan latensi rendah serta penanganan idempotency pada transaksi finansial syariah.',
    challenges:
      'Terdapat beberapa istilah perbankan syariah baru dan arsitektur legacy yang membutuhkan konfirmasi langsung ke tim senior backend engineer.',
    location: {
      latitude: -6.2297,
      longitude: 106.8295,
      address: 'The Tower BSI, Jakarta Selatan',
      verified: true,
      timestamp: '2026-09-10 08:30:15 WIB',
    },
    submittedAt: '2026-09-10 17:15:00 WIB',
    mentorFeedback: 'Analisis awal sangat rapi. Pertahankan pencatatan detailnya.',
    mentorApprovedAt: '2026-09-10 18:00:00 WIB',
  },
  {
    id: 'entry-2026-09-11',
    date: '2026-09-11',
    periodId: 2,
    attendanceType: 'Hadir',
    status: 'hadir_disetujui',
    activityDescription:
      'Mengikuti sesi mentoring 1-on-1 bersama Mas Zaim mengenai evaluasi performa bulan pertama. Mengidentifikasi target capaian bulan ke-2 dalam problem solving dan kolaborasi tim.',
    learnings:
      'Mendapatkan masukan konstruktif tentang pentingnya proactive updates dalam daily standup serta perapian log error sebelum submit PR ke branch staging.',
    challenges:
      'Menyesuaikan pola kerja individual ke standar review code korporat yang memiliki checklist keamanan ketat.',
    location: {
      latitude: -6.2297,
      longitude: 106.8295,
      address: 'The Tower BSI, Jakarta Selatan',
      verified: true,
      timestamp: '2026-09-11 08:45:22 WIB',
    },
    submittedAt: '2026-09-11 17:30:10 WIB',
    mentorFeedback: 'Bagus, fokuskan implementasi masukan pada sprint berikutnya.',
    mentorApprovedAt: '2026-09-11 19:10:00 WIB',
  },
  {
    id: 'entry-2026-09-14',
    date: '2026-09-14',
    periodId: 2,
    attendanceType: 'Hadir',
    status: 'hadir_disetujui',
    activityDescription:
      'Membuat automated test scripts untuk modul endpoint otentikasi menggunakan Jest dan Supertest. Menguji skenario edge case seperti token expiry dan rate limiting.',
    learnings:
      'Mempelajari bagaimana rate limiter bekerja di layer reverse proxy NGINX dan bagaimana penanganan error code 429 pada aplikasi mobile BSI Mobile.',
    challenges:
      'Beberapa unit test sempat flaky karena mock database connection pool yang tidak ditutup sempurna.',
    location: {
      latitude: -6.2297,
      longitude: 106.8295,
      address: 'The Tower BSI, Jakarta Selatan',
      verified: true,
      timestamp: '2026-09-14 08:35:40 WIB',
    },
    submittedAt: '2026-09-14 17:45:00 WIB',
    mentorFeedback: 'Coverage testing meningkat 15%. Kerja bagus!',
    mentorApprovedAt: '2026-09-14 20:00:00 WIB',
  },
];

// Helper to safely access localStorage
export const storageService = {
  getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
      return initialProfile;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialProfile;
    }
  },

  updateProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  getPeriods(): InternshipPeriod[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PERIODS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(initialPeriods));
      return initialPeriods;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialPeriods;
    }
  },

  getEntries(): LogbookEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(initialEntries));
      return initialEntries;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialEntries;
    }
  },

  getEntryByDate(date: string): LogbookEntry | undefined {
    const entries = this.getEntries();
    return entries.find((e) => e.date === date);
  },

  saveEntry(entryData: Omit<LogbookEntry, 'id'> & { id?: string }): LogbookEntry {
    const entries = this.getEntries();
    const id = entryData.id || `entry-${entryData.date}-${Date.now()}`;
    const newEntry: LogbookEntry = {
      ...entryData,
      id,
    };

    const existingIndex = entries.findIndex((e) => e.date === newEntry.date);
    let updatedEntries: LogbookEntry[];
    if (existingIndex >= 0) {
      updatedEntries = [...entries];
      updatedEntries[existingIndex] = newEntry;
    } else {
      updatedEntries = [...entries, newEntry];
    }

    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updatedEntries));
    this.clearDraft(newEntry.date);
    return newEntry;
  },

  deleteEntry(id: string): void {
    const entries = this.getEntries();
    const updated = entries.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updated));
  },

  getCurriculum(periodId?: number): CurriculumModule[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
    const all: CurriculumModule[] = raw ? JSON.parse(raw) : initialCurriculum;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(initialCurriculum));
    }
    if (periodId !== undefined) {
      return all.filter((c) => c.periodId === periodId);
    }
    return all;
  },

  getEvaluations(): PeriodEvaluation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(initialEvaluations));
      return initialEvaluations;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialEvaluations;
    }
  },

  getEvaluation(periodId: number): PeriodEvaluation | undefined {
    const all = this.getEvaluations();
    return all.find((e) => e.periodId === periodId);
  },

  getStipends(): StipendDetail[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STIPENDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STIPENDS, JSON.stringify(initialStipends));
      return initialStipends;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialStipends;
    }
  },

  getStipend(periodId: number): StipendDetail | undefined {
    const all = this.getStipends();
    return all.find((s) => s.periodId === periodId);
  },

  getAnnouncements(): Announcement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(initialAnnouncements));
      return initialAnnouncements;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialAnnouncements;
    }
  },

  markAnnouncementRead(id: string): void {
    const list = this.getAnnouncements();
    const updated = list.map((a) => (a.id === id ? { ...a, isNew: false } : a));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updated));
  },

  // Drafts for form autosave
  getDraft(date: string): Partial<LogbookEntry> | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.DRAFTS}_${date}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveDraft(date: string, draft: Partial<LogbookEntry>): void {
    try {
      localStorage.setItem(`${STORAGE_KEYS.DRAFTS}_${date}`, JSON.stringify(draft));
    } catch (e) {
      console.warn('Draft save error', e);
    }
  },

  clearDraft(date: string): void {
    localStorage.removeItem(`${STORAGE_KEYS.DRAFTS}_${date}`);
  },

  resetToDefaultData(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
    localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(initialPeriods));
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(initialEntries));
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(initialCurriculum));
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(initialEvaluations));
    localStorage.setItem(STORAGE_KEYS.STIPENDS, JSON.stringify(initialStipends));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(initialAnnouncements));
  },

  exportAllData(): string {
    return JSON.stringify(
      {
        profile: this.getProfile(),
        periods: this.getPeriods(),
        entries: this.getEntries(),
        curriculum: this.getCurriculum(),
        evaluations: this.getEvaluations(),
        stipends: this.getStipends(),
        announcements: this.getAnnouncements(),
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
      if (parsed.entries) localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(parsed.entries));
      if (parsed.evaluations) localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(parsed.evaluations));
      if (parsed.stipends) localStorage.setItem(STORAGE_KEYS.STIPENDS, JSON.stringify(parsed.stipends));
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },
};
