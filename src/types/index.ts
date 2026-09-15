export type AttendanceStatus =
  | 'hadir_disetujui'
  | 'izin_disetujui'
  | 'sakit'
  | 'tidak_hadir'
  | 'kehadiran_ditolak'
  | 'perlu_tindakan'
  | 'menunggu_mentor'
  | 'belum_diisi'
  | 'hari_libur'
  | 'libur_posisi';

export interface LogbookEntry {
  id: string;
  date: string; // YYYY-MM-DD
  periodId: number;
  attendanceType: 'Hadir' | 'Hadir (WFH)' | 'Izin' | 'Sakit' | 'Dinas Luar';
  status: AttendanceStatus;
  activityDescription: string;
  learnings: string;
  challenges: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    verified: boolean;
    timestamp: string;
  };
  attachments?: string[]; // base64 or photo URLs
  submittedAt?: string;
  mentorFeedback?: string;
  mentorApprovedAt?: string;
}

export interface InternshipPeriod {
  id: number;
  name: string; // e.g., "Periode 1", "Periode 2"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isCurrent: boolean;
}

export interface CurriculumModule {
  id: string;
  periodId: number;
  title: string;
  type: 'Praktik' | 'Teori' | 'Proyek';
  month: string;
  duration: string;
  description: string;
  learningFocus?: string;
  completed?: boolean;
}

export interface EvaluationAspect {
  id: string;
  aspect: string;
  score: 'SB' | 'B' | 'C' | 'K';
  notes?: string;
}

export interface CurriculumEvaluation {
  moduleName: string;
  score: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
}

export interface PeriodEvaluation {
  periodId: number;
  periodName: string;
  status: 'Selesai' | 'Dalam Proses' | 'Belum Dimulai';
  mentorName: string;
  completedAt: string;
  aspects: EvaluationAspect[];
  curriculumAchievements: CurriculumEvaluation[];
  mentorComment: string;
  overallScore: number; // e.g. 3.5 out of 4.0
}

export interface StipendDetail {
  periodId: number;
  periodName: string;
  dateRange: string;
  submissionStatus: 'Diajukan' | 'Diverifikasi' | 'Cair' | 'Belum Diajukan';
  submittedBy: string;
  submittedAt: string;
  nominalEstimate: number;
  bankName: string;
  accountNumberMasked: string;
  accountHolder: string;
  totalWorkingDays: number;
  paidDays: number;
  approvedAttendanceDays: number;
  paidLeaveDays: number;
  unpaidDays: number;
  absentDays: number;
  rejectedAttendanceDays: number;
  noRecordDays: number;
  unpaidLeaveDays: number;
  nonWorkingDays: number;
  holidays: number;
  positionOffDays: number;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl: string;
  company: string;
  position: string;
  placementLocation: string;
  internshipStartDate: string;
  internshipEndDate: string;
  status: 'Aktif' | 'Selesai' | 'Mengundurkan Diri';
  mentorName: string;
  mentorEmail: string;
  universityName: string;
  major: string;
  studentId: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Penting' | 'Informasi' | 'Kegiatan';
  content: string;
  isNew: boolean;
}

