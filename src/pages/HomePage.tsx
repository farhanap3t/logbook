import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
  Zap,
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
  const [showPolicyNotice, setShowPolicyNotice] = useState(true);

  const formattedToday = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(todayDate));

  const unreadCount = announcements.filter((a) => a.isNew).length;

  return (
    <div className="space-y-5 pb-20 fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/10 border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.position}</span>
              <span className="opacity-60">•</span>
              <span className="text-white font-bold">{profile.status}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Halo, {profile.name.split(' ')[0]} <span className="inline-block origin-bottom-right animate-wave">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 font-normal max-w-lg leading-relaxed">
              Selamat datang di workspace Logbook. Pantau presensi harian, pengerjaan tugas, dan evaluasi
              kompetensi magang Anda di <strong className="text-white font-semibold">{profile.company}</strong>.
            </p>
          </div>

          {/* User Avatar Card */}
          <div
            onClick={() => onNavigateTab('akun')}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer shrink-0 self-start sm:self-auto backdrop-blur-md"
            title="Buka Profil & Akun"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-400/40"
            />
            <div className="pr-2">
              <div className="text-xs font-bold text-white leading-tight">{profile.name}</div>
              <div className="text-[11px] text-indigo-200">{profile.studentId}</div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
              Kehadiran
            </span>
            <span className="text-lg font-black text-white">20 Hari</span>
            <span className="text-[10px] text-emerald-400 block font-medium">100% Target</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
              Izin Berbayar
            </span>
            <span className="text-lg font-black text-white">1 Hari</span>
            <span className="text-[10px] text-indigo-300 block font-medium">Sisa 2 hari</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
              Evaluasi Mentor
            </span>
            <span className="text-lg font-black text-white">3.5 / 4.0</span>
            <span className="text-[10px] text-amber-300 block font-medium">Predikat Sangat Baik</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
              Uang Saku Periode 1
            </span>
            <span className="text-lg font-black text-white">100% Cair</span>
            <span className="text-[10px] text-emerald-400 block font-medium">Diajukan Mentor</span>
          </div>
        </div>
      </div>

      {/* Announcements & Policy Alert */}
      <div className="space-y-2.5">
        {/* Policy Notice */}
        {showPolicyNotice && (
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 text-indigo-950 flex items-start justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-[13px] leading-relaxed">
                <strong className="font-bold text-indigo-950 block">Kebijakan Presensi & Izin Berbayar</strong>
                Hak izin resmi hingga 3 hari kerja per periode tetap dihitung berbayar (eligible uang saku). Izin ke-4 dan seterusnya tidak dibayarkan namun tidak memengaruhi catatan sanksi kelulusan.
              </div>
            </div>
            <button
              onClick={() => setShowPolicyNotice(false)}
              className="text-indigo-400 hover:text-indigo-700 text-xs font-semibold p-1 hover:bg-indigo-100/50 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Announcements Pill Bar */}
        <div
          onClick={onOpenAnnouncements}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {announcements.length} Pengumuman Terkini
              </span>
              {unreadCount > 0 && (
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {unreadCount} baru
                </span>
              )}
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
            Buka Papan Pengumuman &rarr;
          </span>
        </div>
      </div>

      {/* Main Action Card: Laporan Hari Ini */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Catatan Aktivitas Hari Ini</h2>
              <p className="text-xs text-slate-500 font-medium">{formattedToday}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Batas: 23:59 WIB</span>
            </div>
          </div>
        </div>

        {/* Content depending on state */}
        {!todayEntry ? (
          <div className="py-4 px-3 sm:px-6 rounded-2xl bg-gradient-to-r from-indigo-50/50 via-slate-50/50 to-indigo-50/50 border border-dashed border-indigo-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20">
              <FileCheck2 className="w-7 h-7" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Laporan Hari Ini Belum Diserahkan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tuliskan uraian tugas yang Anda selesaikan, pembelajaran teknis baru, serta kendala &
                solusi (minimal 100 karakter pada tiap bagian). Koordinat GPS akan diverifikasi otomatis.
              </p>
            </div>

            <button
              onClick={() => onOpenLogbookForm(todayDate)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Isi Laporan Hari Ini Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  Laporan Berhasil Diserahkan ({todayEntry.attendanceType})
                </span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-500">
                {todayEntry.submittedAt}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 bg-white/80 p-3.5 rounded-xl border border-emerald-100 leading-relaxed">
              {todayEntry.activityDescription}
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-slate-600">
                Status:{' '}
                <strong className="text-indigo-700">
                  {todayEntry.status === 'hadir_disetujui'
                    ? 'Disetujui Mentor'
                    : 'Menunggu Review Mentor'}
                </strong>
              </div>
              <button
                onClick={() => onOpenLogbookForm(todayDate, todayEntry)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Lihat / Perbarui Laporan &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => onNavigateTab('riwayat')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600">
                Kalender Presensi
              </h4>
              <p className="text-[11px] text-slate-500">Cek status riwayat kehadiran</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </div>

        <div
          onClick={() => onNavigateTab('perkembangan')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600">
                Evaluasi & Kurikulum
              </h4>
              <p className="text-[11px] text-slate-500">Nilai mentor & silabus</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </div>

        <div
          onClick={() => onNavigateTab('akun')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600">
                Cetak Laporan Resmi
              </h4>
              <p className="text-[11px] text-slate-500">Ekspor buku logbook PDF</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </div>
      </div>

      {/* Footer Live Server Sync */}
      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
