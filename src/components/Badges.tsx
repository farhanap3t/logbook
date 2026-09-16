import React from 'react';
import type { LogbookStatus, LogbookCategory } from '../types';

export const StatusBadge: React.FC<{ status: LogbookStatus }> = ({ status }) => {
  const styles: Record<LogbookStatus, { badge: string; dot: string; label: string }> = {
    Draft: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Draft',
    },
    Submitted: {
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500',
      label: 'Submitted',
    },
    'In Progress': {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      label: 'In Progress',
    },
    Completed: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Completed',
    },
    Cancelled: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      label: 'Cancelled',
    },
  };

  const current = styles[status] || styles.Draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: LogbookCategory }> = ({ category }) => {
  const colorMap: Record<LogbookCategory, string> = {
    Meeting: 'bg-purple-50 text-purple-700 border-purple-200',
    Development: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Testing: 'bg-amber-50 text-amber-700 border-amber-200',
    Monitoring: 'bg-teal-50 text-teal-700 border-teal-200',
    Analysis: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Documentation: 'bg-slate-50 text-slate-700 border-slate-200',
    'Issue/Incident': 'bg-rose-50 text-rose-700 border-rose-200',
    Maintenance: 'bg-orange-50 text-orange-700 border-orange-200',
    Other: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const style = colorMap[category] || colorMap.Other;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      {category}
    </span>
  );
};

