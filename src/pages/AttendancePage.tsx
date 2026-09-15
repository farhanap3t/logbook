import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  MapPin,
  Clock,
  FileEdit,
  PlusCircle,
  CheckCircle2,
  Calendar,
  MessageSquare,
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
    return idx >= 0 ? idx : 1;
  });

  const [selectedDate, setSelectedDate] = useState<string>(todayDate);

  const currentPeriod = periods[selectedPeriodIndex] || periods[0];

  const handlePrevPeriod = () => {
    if (selectedPeriodIndex > 0) setSelectedPeriodIndex(selectedPeriodIndex - 1);
  };

  const handleNextPeriod = () => {
    if (selectedPeriodIndex < periods.length - 1) setSelectedPeriodIndex(selectedPeriodIndex + 1);
  };

  const selectedDateEntry = entries.find((e) => e.date === selectedDate);

  interface CalDay {
    dayNumber: number;
    monthName: string;
    fullDate: string;
    dayOfWeek: number;
    status: AttendanceStatus;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
  }

  const calendarDays: (CalDay | null)[] = useMemo(() => {
    const days: (CalDay | null)[] = [];

    // Periode 2: Sep 10 - Oct 9 (3 padding cells for Thu start)
    for (let i = 0; i < 3; i++) {
      days.push(null);
    }

    // Days 10 to 30 Sep
    for (let d = 10; d <= 30; d++) {
      const dateStr = `2026-09-${d.toString().padStart(2, '0')}`;
      const dateObj = new Date(2026, 8, d);
      const dayOfWeek = (dateObj.getDay() + 6) % 7;
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

    // Days 1 to 9 Oct
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

  const renderStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'hadir_disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
            <Check className="w-2.5 h-2.5 stroke-[3]" /> Hadir
          </span>
        );
      case 'izin_disetujui':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200/60">
            <Minus className="w-2.5 h-2.5 stroke-[3]" /> Izin
          </span>
        );
      case 'tidak_hadir':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200/60">
            Alpha
          </span>
        );
      case 'menunggu_mentor':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/60">
            Review
          </span>
        );
      case 'hari_libur':
      case 'libur_posisi':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-medium">
            Libur
          </span>
        );
      case 'belum_diisi':
      default:
        return (
          <span className="w-2 h-2 rounded-full border border-slate-300 inline-block" />
        );
    }
  };

  const formatHeaderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-5 pb-20 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Presensi & Kalender Aktivitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Kelola rekam jejak kehadiran harian dan riwayat verifikasi mentor.
          </p>
        </div>

        {/* Quick Period Selector Pill */}
        <div className="inline-flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <button
            onClick={handlePrevPeriod}
            disabled={selectedPeriodIndex === 0}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div className="px-3 text-center">
            <span className="text-xs font-bold text-slate-800">{currentPeriod.name}</span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {currentPeriod.startDate} - {currentPeriod.endDate}
            </span>
          </div>
          <button
            onClick={handleNextPeriod}
            disabled={selectedPeriodIndex === periods.length - 1}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main Interactive Calendar Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70 py-2.5 text-center text-xs font-bold text-slate-600">
          <div>Sen</div>
          <div>Sel</div>
          <div>Rab</div>
          <div>Kam</div>
          <div>Jum</div>
          <div className="text-indigo-400">Sab</div>
          <div className="text-indigo-400">Min</div>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 divide-y divide-x divide-slate-100/90 text-center">
          {calendarDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-20 bg-slate-50/30" />;
            }

            const isSelected = day.fullDate === selectedDate;
            const isToday = day.isToday;

            return (
              <button
                key={day.fullDate}
                onClick={() => setSelectedDate(day.fullDate)}
                className={`h-20 p-2 flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-50/80 ring-2 ring-indigo-600 ring-inset z-10'
                    : 'hover:bg-slate-50 bg-white'
                }`}
              >
                {/* Date number */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold transition-transform ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                        : isSelected
                        ? 'text-indigo-900 font-extrabold'
                        : day.isWeekend
                        ? 'text-slate-400'
                        : 'text-slate-700'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                  )}
                </div>

                {/* Status Badge */}
                <div className="w-full flex justify-center">{renderStatusBadge(day.status)}</div>
              </button>
            );
          })}
        </div>

        {/* Legend Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-[11px] text-slate-600">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Hadir Disetujui
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Izin Resmi
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Menunggu Mentor
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Tidak Hadir
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Hari Libur
            </span>
          </div>
        </div>
      </div>

      {/* Selected Day Logbook Note Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Detail Rekam Logbook
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {formatHeaderDate(selectedDate)}
            </h2>
          </div>

          {selectedDateEntry ? (
            <button
              onClick={() => onOpenLogbookForm(selectedDate, selectedDateEntry)}
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileEdit className="w-3.5 h-3.5" />
              Perbarui Laporan
            </button>
          ) : (
            <button
              onClick={() => onOpenLogbookForm(selectedDate)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Isi Laporan Tanggal Ini
            </button>
          )}
        </div>

        {selectedDateEntry ? (
          <div className="space-y-4">
            {/* Status bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-2xs">
                  {selectedDateEntry.attendanceType}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Dikirim: {selectedDateEntry.submittedAt}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {selectedDateEntry.status === 'hadir_disetujui' ? (
                  <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui Mentor
                  </span>
                ) : (
                  <span className="font-bold text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    <Clock className="w-3.5 h-3.5" /> Menunggu Review
                  </span>
                )}
              </div>
            </div>

            {/* Location pill */}
            {selectedDateEntry.location && (
              <div className="text-xs text-slate-600 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Koordinat Terverifikasi:</strong> {selectedDateEntry.location.address} (
                  {selectedDateEntry.location.latitude}, {selectedDateEntry.location.longitude})
                </span>
              </div>
            )}

            {/* Activity blocks */}
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Uraian Aktivitas & Capaian:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedDateEntry.activityDescription}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pembelajaran Teknis:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedDateEntry.learnings}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Kendala & Solusi:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedDateEntry.challenges}
                </p>
              </div>
            </div>

            {/* Mentor feedback */}
            {selectedDateEntry.mentorFeedback && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-950">Catatan Masukan Mentor:</div>
                  <p className="text-xs sm:text-sm text-amber-900 italic leading-relaxed">
                    &ldquo;{selectedDateEntry.mentorFeedback}&rdquo;
                  </p>
                  <span className="text-[10px] text-amber-700 font-mono block">
                    Ditinjau pada: {selectedDateEntry.mentorApprovedAt}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Belum Ada Laporan Aktivitas</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                Pilih tanggal kerja untuk merekam tugas harian atau melihat riwayat yang sudah disetujui.
              </p>
            </div>
            <button
              onClick={() => onOpenLogbookForm(selectedDate)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Mulai Tulis Laporan
            </button>
          </div>
        )}
      </div>

      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
