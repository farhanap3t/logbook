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
  PROFILE: 'app_logbook_profile',
  PERIODS: 'app_logbook_periods',
  ENTRIES: 'app_logbook_entries',
  CURRICULUM: 'app_logbook_curriculum',
  EVALUATIONS: 'app_logbook_evaluations',
  STIPENDS: 'app_logbook_stipends',
  ANNOUNCEMENTS: 'app_logbook_announcements',
  DRAFTS: 'app_logbook_drafts',
};

// Modern initial profile
const initialProfile: UserProfile = {
  name: 'MUHAMMAD FARHAN',
  role: 'Software Engineering Intern',
  email: 'farhn.mhmmad@gmail.com',
  phone: '0895331284320',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  company: 'PT Inovasi Digital Nusantara',
  position: 'Junior Software Engineer Intern',
  placementLocation: 'Jakarta Selatan, DKI Jakarta',
  internshipStartDate: '2026-08-10',
  internshipEndDate: '2027-02-09',
  status: 'Aktif',
  mentorName: 'Rian Prasetyo, S.Kom',
  mentorEmail: 'rian.prasetyo@inovasidigital.id',
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
    title: 'Ketentuan Kebijakan Kehadiran & Hak Izin Berbayar',
    date: '2026-09-10',
    category: 'Penting',
    content:
      'Izin resmi hingga maksimal 3 hari kerja per periode magang tetap dihitung berbayar (eligible stipend). Izin ke-4 dan seterusnya tidak dibayarkan, namun tidak memengaruhi kelulusan program.',
    isNew: true,
  },
  {
    id: 'ann-2',
    title: 'Batas Akhir Penyerahan Logbook Harian Pukul 23:59 WIB',
    date: '2026-09-05',
    category: 'Penting',
    content:
      'Setiap peserta wajib menyerahkan laporan aktivitas harian dengan minimal 100 karakter pada ketiga bagian utama sebelum pukul 23:59 WIB setiap hari kerja aktif.',
    isNew: false,
  },
  {
    id: 'ann-3',
    title: 'Sesi Sinergi Tim & Engineering Mentoring Mingguan',
    date: '2026-09-02',
    category: 'Kegiatan',
    content:
      'Sesi sharing mingguan bersama Engineering Lead akan diselenggarakan setiap hari Jumat pukul 14:00 WIB untuk meninjau progres sprint dan arsitektur kode.',
    isNew: false,
  },
];

const initialCurriculum: CurriculumModule[] = [
  {
    id: 'curr-p2-1',
    periodId: 2,
    title: 'System Architecture, Code Review & Teamwork',
    type: 'Praktik',
    month: 'Bulan ke-2',
    duration: '1–14 hari',
    description:
      'Fokus dua minggu ini adalah mendalami arsitektur perangkat lunak modern, praktik code review yang bersih, penulisan automated tests, dan berkolaborasi intensif dalam tim pengembangan lintas fungsi.',
    completed: true,
  },
  {
    id: 'curr-p2-2',
    periodId: 2,
    title: 'Problem Solving in Action & Sprint Reporting',
    type: 'Praktik',
    month: 'Bulan ke-2',
    duration: '1–14 hari',
    description:
      'Peserta diasah kemampuan analitisnya dalam mendiagnosis bug, merumuskan solusi optimal berbasis data, serta memaparkan ringkasan hasil kerja dalam sesi demo sprint mingguan.',
    completed: false,
  },
  {
    id: 'curr-p1-1',
    periodId: 1,
    title: 'Engineering Onboarding & Infrastructure Setup',
    type: 'Teori',
    month: 'Bulan ke-1',
    duration: '1–7 hari',
    description:
      'Pengenalan standar keamanan kode, setup workstation, arsitektur microservices, pipeline CI/CD, dan aturan repository git tim.',
    completed: true,
  },
  {
    id: 'curr-p1-2',
    periodId: 1,
    title: 'First Project Sprint & Technical Documentation',
    type: 'Praktik',
    month: 'Bulan ke-1',
    duration: '8–30 hari',
    description:
      'Pengerjaan tiket fitur perdana, implementasi modul API, penulisan dokumentasi teknis OpenAPI, serta koordinasi daily standup.',
    completed: true,
  },
];

const initialEvaluations: PeriodEvaluation[] = [
  {
    periodId: 1,
    periodName: 'Periode 1 (10 Agustus 2026 - 08 September 2026)',
    status: 'Selesai',
    mentorName: 'Rian Prasetyo, S.Kom',
    completedAt: '2026-09-08 20:39 WIB',
    overallScore: 3.5,
    aspects: [
      { id: 'asp-1', aspect: '1. Kehadiran dan kedisiplinan kerja', score: 'SB' },
      { id: 'asp-2', aspect: '2. Sikap dan profesionalisme', score: 'B' },
      { id: 'asp-3', aspect: '3. Kemampuan komunikasi & koordinasi', score: 'B' },
      { id: 'asp-4', aspect: '4. Inisiatif dan tanggung jawab tugas', score: 'B' },
      { id: 'asp-5', aspect: '5. Kecepatan adaptasi teknologi', score: 'SB' },
      { id: 'asp-6', aspect: '6. Kualitas eksekusi teknis & koding', score: 'B' },
      { id: 'asp-7', aspect: '7. Produktivitas dan ketepatan waktu', score: 'B' },
      { id: 'asp-8', aspect: '8. Kolaborasi & kerja sama tim', score: 'SB' },
    ],
    curriculumAchievements: [
      { moduleName: 'Engineering Onboarding & Infrastructure Setup', score: 'Sangat Baik' },
      { moduleName: 'First Project Sprint & Technical Documentation', score: 'Baik' },
    ],
    mentorComment:
      'Farhan menunjukkan adaptasi yang sangat cepat terhadap codebase proyek. Struktur koding rapi dan komunikasi di tim berjalan sangat baik.',
  },
];

const initialStipends: StipendDetail[] = [
  {
    periodId: 1,
    periodName: 'Periode 1',
    dateRange: '10 Agustus 2026 - 09 September 2026',
    submissionStatus: 'Diajukan',
    submittedBy: 'Rian Prasetyo, S.Kom (Mentor)',
    submittedAt: '9 September 2026 pukul 16.10 WIB',
    nominalEstimate: 3500000,
    bankName: 'Bank Central Asia (BCA)',
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
    nominalEstimate: 3500000,
    bankName: 'Bank Central Asia (BCA)',
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

const initialEntries: LogbookEntry[] = [
  {
    id: 'entry-2026-09-10',
    date: '2026-09-10',
    periodId: 2,
    attendanceType: 'Hadir',
    status: 'hadir_disetujui',
    activityDescription:
      'Melakukan analisis arsitektur microservices untuk modul streaming data. Mempelajari dokumentasi internal mengenai event-driven architecture menggunakan Apache Kafka dan Redis caching.',
    learnings:
      'Memahami mekanisme decoupling sistem dengan asynchronous message queues serta teknik handling backpressure untuk mencegah buffer overflow pada high traffic.',
    challenges:
      'Memerlukan waktu untuk memahami setup distributed tracing dengan OpenTelemetry pada container Docker lokal.',
    location: {
      latitude: -6.2088,
      longitude: 106.8456,
      address: 'Kantor Pusat Teknologi, Jakarta Selatan',
      verified: true,
      timestamp: '2026-09-10 08:30:15 WIB',
    },
    submittedAt: '2026-09-10 17:15:00 WIB',
    mentorFeedback: 'Analisis arsitektur sangat mendalam dan terstruktur rapi. Teruskan!',
    mentorApprovedAt: '2026-09-10 18:00:00 WIB',
  },
  {
    id: 'entry-2026-09-11',
    date: '2026-09-11',
    periodId: 2,
    attendanceType: 'Hadir',
    status: 'hadir_disetujui',
    activityDescription:
      'Menghadiri sesi 1-on-1 sprint review bersama Mas Rian Prasetyo. Mengulas capaian bulan pertama dan menyusun rencana otomatisasi testing endpoint autentikasi.',
    learnings:
      'Mengetahui strategi pengujian integration test berbasis testcontainer agar lingkungan test database tetap terisolasi dan deterministik.',
    challenges:
      'Perbedaan konfigurasi environment variable antara mesin development lokal dengan runner GitHub Actions.',
    location: {
      latitude: -6.2088,
      longitude: 106.8456,
      address: 'Kantor Pusat Teknologi, Jakarta Selatan',
      verified: true,
      timestamp: '2026-09-11 08:45:22 WIB',
    },
    submittedAt: '2026-09-11 17:30:10 WIB',
    mentorFeedback: 'Catatan progres sangat baik, saran pengujian sudah mulai diimplementasikan.',
    mentorApprovedAt: '2026-09-11 19:10:00 WIB',
  },
  {
    id: 'entry-2026-09-14',
    date: '2026-09-14',
    periodId: 2,
    attendanceType: 'Hadir',
    status: 'hadir_disetujui',
    activityDescription:
      'Mengembangkan skrip automated integration tests untuk pipeline CI/CD. Menambahkan benchmark performance testing menggunakan K6 untuk menguji response latency.',
    learnings:
      'Mendapatkan wawasan mengenai p95 dan p99 latency threshold serta pentingnya connection pooling pada PostgreSQL client.',
    challenges:
      'Beberapa query analitis lambat saat dieksekusi dengan volume data 100.000 records sintetis.',
    location: {
      latitude: -6.2088,
      longitude: 106.8456,
      address: 'Kantor Pusat Teknologi, Jakarta Selatan',
      verified: true,
      timestamp: '2026-09-14 08:35:40 WIB',
    },
    submittedAt: '2026-09-14 17:45:00 WIB',
    mentorFeedback: 'Coverage automated test naik ke 88%. Kerja luar biasa!',
    mentorApprovedAt: '2026-09-14 20:00:00 WIB',
  },
];

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
