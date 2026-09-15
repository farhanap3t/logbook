import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  AlertTriangle,
  X,
  MapPin,
  Clock,
  FileEdit,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import type { InternshipPeriod, LogbookEntry, AttendanceStatus } from '../types';
import { ServerClock } from '../components/ServerClock';

interface AttendancePageProps {
  periods: InternshipPeriod[];
  currentPeriodId: number;
  entries: LogbookEntry[];
  todayDate: string; // YYYY-MM-DD
  onOpenLogbookForm: (date: string, existingEntry?: LogbookEntry) => void;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  periods,
  currentPeriodId,
  entries,
  todayDate,
  onOpenLogbookForm,
}) => {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(() => {
    const idx = periods.findIndex((p) => p.id === currentPeriodId);
    return idx >= 0 ? idx : 1; // Default to Periode 2
  });

  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  const currentPeriod = periods[selectedPeriodIndex] || periods[0];

  const handlePrevPeriod = () => {
    if (selectedPeriodIndex > 0) {
      setSelectedPeriodIndex(selectedPeriodIndex - 1);
    }
  };

  const handleNextPeriod = () => {
    if (selectedPeriodIndex < periods.length - 1) {
      setSelectedPeriodIndex(selectedPeriodIndex + 1);
    }
  };

  // Find entry for selected date
  const selectedDateEntry = entries.find((e) => e.date === selectedDate);

  // Generate calendar days for the current period (e.g. Periode 2: Sep 10 - Oct 9)
  // Matching the reference layout:
  // Weekdays: Sen (Mon), Sel (Tue), Rab (Wed), Kam (Thu), Jum (Fri), Sab (Sat), Min (Sun)
  // Sep 10 2026 is a Thursday (Kam)
  interface CalDay {
    dayNumber: number;
    monthName: string;
    fullDate: string; // YYYY-MM-DD
    dayOfWeek: number; // 0=Mon, 6=Sun
    status: AttendanceStatus;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
  }

  const calendarDays: (CalDay | null)[] = React.useMemo(() => {
    const days: (CalDay | null)[] = [];

    // For Periode 2 (10 Sep 2026 - 9 Okt 2026):
    // Sep 10 is Thursday. Empty cells for Sen, Sel, Rab (3 empty cells)
    for (let i = 0; i < 3; i++) {
      days.push(null);
    }

    // Days 10 to 30 September
    for (let d = 10; d <= 30; d++) {
      const dateStr = `2026-09-${d.toString().padStart(2, '0')}`;
      const dateObj = new Date(2026, 8, d); // month 8 is September
      const dayOfWeek = (dateObj.getDay() + 6) % 7; // Convert 0(Sun) to 6, 1(Mon) to 0
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

      const entry = entries.find((e) => e.date === dateStr);
      let status: AttendanceStatus = 'belum_diisi';

      if (isWeekend) {
        status = 'hari_libur';
      } else if (entry) {
        status = entry.status;
      } else if (dateStr < todayDate) {
        status = 'tidak_hadir';
      }

      days.push({
        dayNumber: d,
        monthName: 'Sep',
        fullDate: dateStr,
        dayOfWeek,
        status,
        isCurrentMonth: true,
        isToday: dateStr === todayDate,
        isWeekend,
      });
    }

    // Days 1 to 9 October
    for (let d = 1; d <= 9; d++) {
      const dateStr = `2026-10-${d.toString().padStart(2, '0')}`;
      const dateObj = new Date(2026, 9, d);
      const dayOfWeek = (dateObj.getDay() + 6) % 7;
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

      const entry = entries.find((e) => e.date === dateStr);
      let status: AttendanceStatus = 'belum_diisi';
      if (isWeekend) {
        status = 'hari_libur';
      } else if (entry) {
        status = entry.status;
      }

      days.push({
        dayNumber: d,
        monthName: 'Okt',
        fullDate: dateStr,
        dayOfWeek,
        status,
        isCurrentMonth: true,
        isToday: dateStr === todayDate,
        isWeekend,
      });
    }

    return days;
  }, [entries, todayDate]);

  // Status icon / glyph renderer matching reference
  const renderStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'hadir_disetujui':
        return <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />;
      case 'izin_disetujui':
        return <Minus className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />;
      case 'tidak_hadir':
        return <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />;
      case 'kehadiran_ditolak':
        return <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />;
      case 'perlu_tindakan':
        return <AlertTriangle className="w-3 h-3 text-amber-500 fill-amber-500" />;
      case 'menunggu_mentor':
        return <div className="w-2.5 h-2.5 bg-blue-600 rotate-45" />;
      case 'hari_libur':
      case 'libur_posisi':
        return <div className="w-2.5 h-2.5 bg-slate-700 rounded-2xs" />;
      case 'belum_diisi':
      default:
        return <div className="w-2 h-2 rounded-full border border-slate-400" />;
    }
  };

  const formatHeaderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 pb-20 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Riwayat Kehadiran
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Lihat catatan kehadiran dan laporan harian Anda.
        </p>
      </div>

      {/* Main Calendar Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Period Navigation */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <button
            onClick={handlePrevPeriod}
            disabled={selectedPeriodIndex === 0}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-sm">{currentPeriod.name}</h3>
            <p className="text-[11px] text-slate-500 font-mono">
              {currentPeriod.startDate} s/d {currentPeriod.endDate}
            </p>
          </div>

          <button
            onClick={handleNextPeriod}
            disabled={selectedPeriodIndex === periods.length - 1}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/40 text-center py-2 text-xs font-semibold text-slate-600">
          <div>Sen</div>
          <div>Sel</div>
          <div>Rab</div>
          <div>Kam</div>
          <div>Jum</div>
          <div className="text-slate-500">Sab</div>
          <div className="text-slate-500">Min</div>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 divide-y divide-x divide-slate-100 text-center text-xs">
          {calendarDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-16 bg-slate-50/20" />;
            }

            const isSelected = day.fullDate === selectedDate;
            const isToday = day.isToday;

            return (
              <button
                key={day.fullDate}
                onClick={() => setSelectedDate(day.fullDate)}
                className={`h-16 p-1.5 flex flex-col items-center justify-between transition-all relative ${
                  isSelected
                    ? 'bg-blue-50/90 ring-2 ring-blue-500 ring-inset z-10'
                    : 'hover:bg-slate-50/80 bg-white'
                }`}
              >
                {/* Date number badge */}
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : day.isWeekend
                      ? 'text-slate-400'
                      : 'text-slate-700'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Status Indicator Icon */}
                <div className="h-5 flex items-center justify-center">
                  {renderStatusIcon(day.status)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend matching reference screenshot */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-700">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Hadir disetujui
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Izin disetujui
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Tidak Hadir
            </span>
            <span className="flex items-center gap-1.5">
              <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" /> Kehadiran Ditolak
            </span>
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500 fill-amber-500" /> Perlu Tindakan Anda
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-600 rotate-45 inline-block" /> Menunggu Tindakan Mentor
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border border-slate-400 inline-block" /> Belum Diisi
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-slate-700 rounded-2xs inline-block" /> Hari Libur
            </span>
          </div>
        </div>
      </div>

      {/* Selected Day Logbook Detail & Action Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Laporan Aktivitas Harian
            </span>
            <h2 className="text-base font-bold text-slate-900">
              {formatHeaderDate(selectedDate)}
            </h2>
          </div>

          {selectedDateEntry ? (
            <button
              onClick={() => onOpenLogbookForm(selectedDate, selectedDateEntry)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileEdit className="w-3.5 h-3.5" />
              Edit Laporan
            </button>
          ) : (
            <button
              onClick={() => onOpenLogbookForm(selectedDate)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Isi Laporan
            </button>
          )}
        </div>

        {selectedDateEntry ? (
          /* Report already submitted for selected date */
          <div className="space-y-3.5">
            {/* Metadata status bar */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {selectedDateEntry.attendanceType}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Diserahkan: {selectedDateEntry.submittedAt}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {selectedDateEntry.status === 'hadir_disetujui' ? (
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Disetujui Mentor
                  </span>
                ) : (
                  <span className="font-bold text-blue-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Menunggu Tindakan Mentor
                  </span>
                )}
              </div>
            </div>

            {/* Location Tag */}
            {selectedDateEntry.location && (
              <div className="text-xs text-slate-600 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  <strong>Lokasi Terverifikasi:</strong> {selectedDateEntry.location.address} (
                  {selectedDateEntry.location.latitude}, {selectedDateEntry.location.longitude})
                </span>
              </div>
            )}

            {/* Content Blocks */}
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Uraian Aktivitas:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedDateEntry.activityDescription}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Pembelajaran yang Diperoleh:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedDateEntry.learnings}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Kendala yang Dialami:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedDateEntry.challenges}
                </p>
              </div>
            </div>

            {/* Mentor feedback if any */}
            {selectedDateEntry.mentorFeedback && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-900">Catatan Mentor:</span>
                  <span className="text-[10px] text-amber-700">{selectedDateEntry.mentorApprovedAt}</span>
                </div>
                <p className="text-xs text-amber-900 italic font-medium">
                  &ldquo;{selectedDateEntry.mentorFeedback}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Report not filled yet */
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileEdit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Belum ada laporan untuk tanggal ini</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                Pastikan Anda melengkapi uraian aktivitas, pembelajaran, dan kendala (minimal 100 karakter per bagian).
              </p>
            </div>
            <button
              onClick={() => onOpenLogbookForm(selectedDate)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-transform hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              Mulai Pengisian Laporan
            </button>
          </div>
        )}
      </div>

      {/* Footer Clock */}
      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
