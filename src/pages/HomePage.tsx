import React, { useState } from 'react';
import {
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  ClipboardList,
  AlertCircle,
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
  onOpenLogbookForm: (date: string, existingEntry?: LogbookEntry) => void;
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
  const [showNotice, setShowNotice] = useState(true);

  const formattedToday = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(todayDate));

  const unreadCount = announcements.filter((a) => a.isNew).length;

  return (
    <div className="space-y-4 pb-20 fade-in">
      {/* Profile Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Halo, {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">{profile.company}</p>
        </div>

        <button
          onClick={() => onNavigateTab('akun')}
          className="rounded-full ring-2 ring-slate-200 hover:ring-blue-500 transition-all cursor-pointer p-0.5"
          title="Lihat Profil"
        >
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-11 h-11 rounded-full object-cover"
          />
        </button>
      </div>

      {/* Policy Notice Banner */}
      {showNotice && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start justify-between gap-3 text-xs leading-relaxed">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
              i
            </div>
            <p>
              Izin hingga 3 hari per periode dibayar. Izin ke-4 dan seterusnya tidak dibayar, tetapi tidak
              dihitung untuk peringatan atau pemberhentian akibat ketidakhadiran.
            </p>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="text-blue-400 hover:text-blue-700 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
            title="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Announcements Notification Pill */}
      <div
        onClick={onOpenAnnouncements}
        className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-amber-950">
            {announcements.length} pengumuman {unreadCount > 0 && `· ${unreadCount} baru`}
          </span>
        </div>
        <button className="text-xs font-semibold text-amber-900 hover:underline">
          Lihat pengumuman
        </button>
      </div>

      {/* Main Today Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hari Ini</h2>
              <p className="text-xs text-slate-600 font-medium">{formattedToday}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Periode magang 10 Agu 2026 – 9 Feb 2027
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        </div>

        {/* Content Status */}
        {!todayEntry ? (
          <div className="py-6 flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ClipboardList className="w-7 h-7" />
            </div>

            <div className="max-w-sm space-y-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Laporan hari ini belum diisi
              </h3>
              <p className="text-xs text-slate-500">
                Silakan isi laporan harian Anda hari ini. Kehadiran akan tercatat bersamaan.
              </p>
            </div>

            <button
              onClick={() => onOpenLogbookForm(todayDate)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              Isi Laporan Hari Ini
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">
                  Laporan Hari Ini Terkirim ({todayEntry.attendanceType})
                </span>
              </div>
              <span className="text-[11px] text-slate-500">{todayEntry.submittedAt}</span>
            </div>

            <p className="text-xs text-slate-700 line-clamp-2 bg-white p-2.5 rounded-lg border border-emerald-100">
              {todayEntry.activityDescription}
            </p>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-600">
                Status:{' '}
                <strong className="text-blue-700 font-semibold">
                  {todayEntry.status === 'hadir_disetujui'
                    ? 'Disetujui Mentor'
                    : 'Menunggu Tindakan Mentor'}
                </strong>
              </span>
              <button
                onClick={() => onOpenLogbookForm(todayDate, todayEntry)}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Lihat / Edit &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Deadline Indicator */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex items-center justify-center gap-2 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Batas pengisian laporan hari ini pukul{' '}
            <strong className="text-slate-800 font-semibold">23.59 WIB</strong>
          </span>
        </div>
      </div>

      {/* 4 Clean Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateTab('riwayat')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="text-xs text-slate-500 font-medium mb-1">Kehadiran Disetujui</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">20 Hari</div>
          <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">100% dari target</p>
        </div>

        <div
          onClick={() => onNavigateTab('riwayat')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="text-xs text-slate-500 font-medium mb-1">Izin Berbayar</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">1 Hari</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Sisa kuota: 2 hari</p>
        </div>

        <div
          onClick={() => onNavigateTab('perkembangan')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="text-xs text-slate-500 font-medium mb-1">Evaluasi Mentor</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">3.5 / 4.0</div>
          <p className="text-[10px] text-blue-600 mt-0.5 font-medium">Sangat Baik</p>
        </div>

        <div
          onClick={() => onNavigateTab('perkembangan')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
        >
          <div className="text-xs text-slate-500 font-medium mb-1">Uang Saku Periode 1</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">100%</div>
          <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">Diajukan Mentor</p>
        </div>
      </div>

      {/* Footer Clock */}
      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
