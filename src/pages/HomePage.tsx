import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ClipboardList,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  X,
  FileCheck2,
} from 'lucide-react';
import type { UserProfile, LogbookEntry, Announcement } from '../types';
import { ServerClock } from '../components/ServerClock';

interface HomePageProps {
  profile: UserProfile;
  todayDate: string; // YYYY-MM-DD
  todayEntry?: LogbookEntry;
  announcements: Announcement[];
  onOpenLogbookForm: (date: string) => void;
  onOpenAnnouncements: () => void;
  onNavigateTab: (tab: 'riwayat' | 'perkembangan' | 'akun') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  todayDate,
  todayEntry,
  announcements,
  onOpenLogbookForm,
  onOpenAnnouncements,
  onNavigateTab,
}) => {
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);

  // Format today's human-readable date e.g. "Selasa, 15 September 2026"
  const formattedToday = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(todayDate));

  const unreadCount = announcements.filter((a) => a.isNew).length;

  return (
    <div className="space-y-4 pb-20 fade-in">
      {/* Header Profile Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            Halo, {profile.name.split(' ')[0]} <span className="animate-wave inline-block origin-bottom-right">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{profile.company}</p>
        </div>

        <button
          onClick={() => onNavigateTab('akun')}
          className="relative group rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/50 transition-all cursor-pointer p-0.5"
          title="Lihat Profil"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-11 h-11 rounded-full object-cover shadow-xs"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
      </div>

      {/* Dismissible Policy Notice Banner */}
      {showNoticeBanner && (
        <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200/90 text-blue-900 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold font-serif">i</span>
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-blue-900 font-medium">
              Izin hingga 3 hari per periode dibayar. Izin ke-4 dan seterusnya tidak dibayar, tetapi tidak
              dihitung untuk peringatan atau pemberhentian akibat ketidakhadiran.
            </p>
          </div>
          <button
            onClick={() => setShowNoticeBanner(false)}
            className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-100/50 transition-colors shrink-0"
            title="Tutup pengumuman"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Announcement Notification Pill */}
      <div
        onClick={onOpenAnnouncements}
        className="p-3 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/60 transition-all shadow-2xs group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-amber-950">
            {announcements.length} pengumuman {unreadCount > 0 && `· ${unreadCount} baru`}
          </span>
        </div>
        <button className="text-xs font-bold text-amber-900 group-hover:underline flex items-center gap-0.5">
          Lihat pengumuman &rarr;
        </button>
      </div>

      {/* Main Card: Hari Ini */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hari Ini</h2>
              <p className="text-xs text-slate-700 font-semibold">{formattedToday}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Periode magang 10 Agu 2026 – 9 Feb 2027
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        </div>

        {/* Card Content Status */}
        {!todayEntry ? (
          /* Unfilled State */
          <div className="py-5 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-blue-50/80 text-blue-600 flex items-center justify-center border border-blue-100">
              <ClipboardList className="w-8 h-8" />
            </div>

            <div className="max-w-xs space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Laporan hari ini belum diisi</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Silakan isi laporan harian Anda hari ini. Kehadiran akan tercatat bersamaan.
              </p>
            </div>

            <button
              onClick={() => onOpenLogbookForm(todayDate)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/30 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              Isi Laporan Hari Ini
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Filled State */
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">
                  Laporan Hari Ini Terkirim ({todayEntry.attendanceType})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {todayEntry.submittedAt}
              </span>
            </div>

            <p className="text-xs text-slate-700 line-clamp-2 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
              {todayEntry.activityDescription}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                Status:{' '}
                <strong className="text-blue-700">
                  {todayEntry.status === 'hadir_disetujui'
                    ? 'Disetujui Mentor'
                    : 'Menunggu Review Mentor'}
                </strong>
              </span>
              <button
                onClick={() => onOpenLogbookForm(todayDate)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Lihat / Edit Laporan &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Deadline Information */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex items-center justify-center gap-2 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>
            Batas pengisian laporan hari ini pukul{' '}
            <strong className="text-slate-800 font-bold">23.59 WIB</strong>
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateTab('riwayat')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold">Kehadiran Disetujui</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">20 Hari</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">100% dari target periode</p>
        </div>

        <div
          onClick={() => onNavigateTab('riwayat')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold">Izin Berbayar</span>
            <ClipboardList className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">1 Hari</div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Sisa kuota: 2 hari</p>
        </div>

        <div
          onClick={() => onNavigateTab('perkembangan')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold">Evaluasi Mentor</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900">3.3 / 4.0</div>
          <p className="text-[10px] text-amber-600 font-medium mt-0.5">Predikat: Baik</p>
        </div>

        <div
          onClick={() => onNavigateTab('perkembangan')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-semibold">Uang Saku Periode 1</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">100%</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Status: Diajukan Mentor</p>
        </div>
      </div>

      {/* Footer Server Time Banner */}
      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
