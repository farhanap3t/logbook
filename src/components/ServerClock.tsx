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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-normal border border-slate-200/70 ${className}`}
    >
      <Clock className="w-3.5 h-3.5 text-slate-400" />
      <span>
        Waktu Server <span className="font-mono text-slate-700 font-medium">{timeStr || '08.54.59'}</span> WIB (GMT+7)
      </span>
    </div>
  );
};
