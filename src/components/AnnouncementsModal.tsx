import React from 'react';
import { X, Bell, Calendar, ChevronRight, AlertCircle, Info } from 'lucide-react';
import type { Announcement } from '../types';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onMarkRead: (id: string) => void;
}

export const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({
  isOpen,
  onClose,
  announcements,
  onMarkRead,
}) => {
  const [selectedAnn, setSelectedAnn] = React.useState<Announcement | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Pusat Pengumuman</h3>
              <p className="text-xs text-slate-500">Informasi dan kebijakan penting magang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 space-y-3.5 flex-1">
          {selectedAnn ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedAnn(null)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                &larr; Kembali ke daftar pengumuman
              </button>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      selectedAnn.category === 'Penting'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {selectedAnn.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedAnn.date}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-800 leading-snug">{selectedAnn.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedAnn.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => {
                    setSelectedAnn(ann);
                    if (ann.isNew) onMarkRead(ann.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 hover:shadow-xs ${
                    ann.isNew
                      ? 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                      ann.category === 'Penting'
                        ? 'bg-amber-500/15 text-amber-700'
                        : 'bg-blue-500/15 text-blue-700'
                    }`}
                  >
                    {ann.category === 'Penting' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-500">{ann.date}</span>
                      {ann.isNew && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-500 text-white">
                          Baru
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 truncate">{ann.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{ann.content}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
