import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import type { LogbookRecord, UserRole } from '../types';

interface CalendarViewProps {
  logbooks: LogbookRecord[];
  onViewDetail: (record: LogbookRecord) => void;
  onOpenCreateModalWithDate: (date: string) => void;
  currentUserRole: UserRole;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  logbooks,
  onViewDetail,
  onOpenCreateModalWithDate,
  currentUserRole,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 16)); // September 2026 as per PRD data

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Days array for calendar grid
  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  const pad = (n: number) => String(n).padStart(2, '0');

  // Previous month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonth = month === 0 ? 12 : month;
    const prevYear = month === 0 ? year - 1 : year;
    days.push({
      dateStr: `${prevYear}-${pad(prevMonth)}-${pad(d)}`,
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      dateStr: `${year}-${pad(month + 1)}-${pad(i)}`,
      dayNum: i,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to fill up to multiple of 7
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        dateStr: `${nextYear}-${pad(nextMonth)}-${pad(i)}`,
        dayNum: i,
        isCurrentMonth: false,
      });
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const canCreate = currentUserRole === 'User' || currentUserRole === 'Admin';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Calendar Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 text-white">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-500">
              Kalender bulanan pemantauan aktivitas logbook dan presensi kerja.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Hari Ini
          </button>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white">
            <button
              onClick={handlePrevMonth}
              title="Bulan Sebelumnya"
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-l-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              title="Bulan Berikutnya"
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-r-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center text-xs font-bold text-slate-500 py-2.5">
        <span>Minggu</span>
        <span>Senin</span>
        <span>Selasa</span>
        <span>Rabu</span>
        <span>Kamis</span>
        <span>Jumat</span>
        <span>Sabtu</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100/40">
        {days.map((d) => {
          const items = logbooks.filter((item) => item.tanggal === d.dateStr);
          const isToday =
            d.dateStr ===
            `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}-${pad(
              new Date().getDate()
            )}`;

          return (
            <div
              key={d.dateStr}
              className={`min-h-[110px] p-2 transition-colors relative group flex flex-col justify-between ${
                d.isCurrentMonth ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/50 text-slate-300'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-md ${
                    isToday
                      ? 'bg-slate-900 text-white'
                      : d.isCurrentMonth
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {d.dayNum}
                </span>

                {canCreate && d.isCurrentMonth && (
                  <button
                    onClick={() => onOpenCreateModalWithDate(d.dateStr)}
                    title={`Tambah logbook pada tanggal ${d.dateStr}`}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-slate-600 transition-opacity cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Logbook Items inside day cell */}
              <div className="space-y-1 my-1 overflow-y-auto max-h-[75px]">
                {items.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onViewDetail(l)}
                    title={`${l.id}: ${l.judul} (${l.status})`}
                    className={`p-1 rounded-md text-[10px] font-medium truncate cursor-pointer transition-colors border ${
                      l.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : l.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                        : l.status === 'Submitted'
                        ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span className="font-bold mr-1">{l.id.slice(-3)}</span>
                    <span>{l.judul}</span>
                  </div>
                ))}
              </div>

              {/* Count indicator if many */}
              {items.length > 0 && (
                <div className="text-[9px] font-mono text-slate-400 text-right">
                  {items.length} aktivitas
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
