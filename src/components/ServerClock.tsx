import React, { useState, useEffect } from 'react';

interface ServerClockProps {
  className?: string;
}

export const ServerClock: React.FC<ServerClockProps> = ({ className = '' }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('id-ID', options).format(now).replace(/:/g, '.');
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 text-slate-600 text-[11px] font-medium border border-slate-200 shadow-2xs backdrop-blur-xs ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>
        Server Sync <span className="font-mono font-bold text-slate-800">{timeStr || '08.54.59'}</span> WIB (GMT+7)
      </span>
    </div>
  );
};
