import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ServerClockProps {
  className?: string;
}

export const ServerClock: React.FC<ServerClockProps> = ({ className = '' }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to WIB (GMT+7)
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 text-slate-600 text-xs font-medium border border-slate-200/80 shadow-xs ${className}`}
    >
      <Clock className="w-3.5 h-3.5 text-slate-500 animate-pulse" />
      <span>
        Waktu Server <span className="font-mono font-semibold text-slate-700">{timeStr || '08.54.59'}</span> WIB (GMT+7)
      </span>
    </div>
  );
};
