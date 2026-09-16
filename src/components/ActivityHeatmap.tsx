import React from 'react';
import { Flame } from 'lucide-react';
import type { LogbookRecord } from '../types';

interface HeatmapProps {
  logbooks: LogbookRecord[];
  onSelectDate: (date: string) => void;
  selectedDate?: string;
}

export const ActivityHeatmap: React.FC<HeatmapProps> = ({
  logbooks,
  onSelectDate,
  selectedDate,
}) => {
  // Generate last 28 days
  const days = React.useMemo(() => {
    const list: { date: string; dayName: string; count: number; dayNum: number }[] = [];
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');

    // Count map
    const countMap: Record<string, number> = {};
    for (const item of logbooks) {
      countMap[item.tanggal] = (countMap[item.tanggal] || 0) + 1;
    }

    for (let i = 27; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'narrow' });
      list.push({
        date: dateStr,
        dayName,
        count: countMap[dateStr] || 0,
        dayNum: d.getDate(),
      });
    }
    return list;
  }, [logbooks]);

  // Calculate streak
  const streak = React.useMemo(() => {
    let count = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [days]);

  const totalLogs = logbooks.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
      {/* Left: Streak & Metric */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
          <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm">
              {streak > 0 ? `${streak} Hari Aktif` : 'Mulai Catat Hari Ini'}
            </span>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
              {totalLogs} total aktivitas
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Peta intensitas pencatatan logbook dalam 28 hari terakhir. Klik kotak tanggal untuk menyaring.
          </p>
        </div>
      </div>

      {/* Right: Interactive 28-day Squares Grid */}
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {days.map((d) => {
          const isSelected = selectedDate === d.date;

          let color = 'bg-slate-100 border-slate-200 hover:border-slate-300';
          if (d.count === 1) {
            color = 'bg-emerald-100 border-emerald-300 text-emerald-800';
          } else if (d.count === 2) {
            color = 'bg-emerald-300 border-emerald-400 text-emerald-950 font-bold';
          } else if (d.count >= 3) {
            color = 'bg-emerald-500 border-emerald-600 text-white font-bold';
          }

          return (
            <button
              key={d.date}
              type="button"
              onClick={() => onSelectDate(d.date)}
              title={`${d.date}: ${d.count} aktivitas logbook`}
              className={`w-7 h-8 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${color} ${
                isSelected ? 'ring-2 ring-slate-900 ring-offset-1 scale-105' : 'hover:scale-105'
              }`}
            >
              <span className="text-[9px] opacity-70 leading-none">{d.dayName}</span>
              <span className="text-[10px] font-mono leading-tight">{d.dayNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
