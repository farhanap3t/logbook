import React, { useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import type { LogbookCategory } from '../types';

interface FastCaptureBarProps {
  onFastCreate: (judul: string, kategori: LogbookCategory) => void;
  canCreate: boolean;
}

export const FastCaptureBar: React.FC<FastCaptureBarProps> = ({
  onFastCreate,
  canCreate,
}) => {
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<LogbookCategory>('Development');
  const [isFocused, setIsFocused] = useState(false);

  if (!canCreate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) return;
    onFastCreate(judul.trim(), kategori);
    setJudul('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl border p-2 pl-3.5 shadow-2xs transition-all flex items-center gap-2.5 ${
        isFocused
          ? 'border-slate-800 ring-2 ring-slate-900/10 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <Zap className="w-4 h-4 text-amber-500 shrink-0" />

      <input
        type="text"
        placeholder="Entri cepat aktivitas hari ini... (Ketik lalu tekan Enter)"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
      />

      <select
        aria-label="Pilih Kategori Cepat"
        value={kategori}
        onChange={(e) => setKategori(e.target.value as LogbookCategory)}
        className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden"
      >
        <option value="Development">Development</option>
        <option value="Meeting">Meeting</option>
        <option value="Testing">Testing</option>
        <option value="Documentation">Documentation</option>
        <option value="Issue/Incident">Issue/Incident</option>
        <option value="Monitoring">Monitoring</option>
      </select>

      <button
        type="submit"
        disabled={!judul.trim()}
        title="Simpan Aktivitas Cepat"
        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-transform active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
      >
        <span>Catat</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </form>
  );
};
