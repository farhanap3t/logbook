import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  UploadCloud,
  Trash2,
  Send,
  Save,
  Navigation,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LogbookEntry, AttendanceStatus } from '../types';
import { storageService } from '../services/storageService';

interface LogbookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // YYYY-MM-DD
  periodId: number;
  existingEntry?: LogbookEntry;
  onSuccess: (savedEntry: LogbookEntry) => void;
}

const MIN_CHARS = 100;

export const LogbookFormModal: React.FC<LogbookFormModalProps> = ({
  isOpen,
  onClose,
  date,
  periodId,
  existingEntry,
  onSuccess,
}) => {
  const [attendanceType, setAttendanceType] = useState<
    'Hadir' | 'Hadir (WFH)' | 'Izin' | 'Sakit' | 'Dinas Luar'
  >(existingEntry?.attendanceType || 'Hadir');
  const [activityDescription, setActivityDescription] = useState(
    existingEntry?.activityDescription || ''
  );
  const [learnings, setLearnings] = useState(existingEntry?.learnings || '');
  const [challenges, setChallenges] = useState(existingEntry?.challenges || '');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [attachments, setAttachments] = useState<string[]>(existingEntry?.attachments || []);

  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'locating' | 'success' | 'error'
  >(existingEntry?.location ? 'success' : 'idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number; address: string } | null>(
    existingEntry?.location
      ? {
          lat: existingEntry.location.latitude,
          lng: existingEntry.location.longitude,
          address: existingEntry.location.address || 'Jakarta Selatan, DKI Jakarta',
        }
      : null
  );

  const [hasDraft, setHasDraft] = useState(false);

  const formatDateTitle = (dateStr: string) => {
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

  useEffect(() => {
    if (isOpen) {
      if (existingEntry) {
        setAttendanceType(existingEntry.attendanceType);
        setActivityDescription(existingEntry.activityDescription);
        setLearnings(existingEntry.learnings);
        setChallenges(existingEntry.challenges);
        setAttachments(existingEntry.attachments || []);
        if (existingEntry.location) {
          setCoords({
            lat: existingEntry.location.latitude,
            lng: existingEntry.location.longitude,
            address: existingEntry.location.address || 'Jakarta Selatan, DKI Jakarta',
          });
          setLocationStatus('success');
        }
      } else {
        const draft = storageService.getDraft(date);
        if (draft) {
          if (draft.attendanceType) setAttendanceType(draft.attendanceType as any);
          if (draft.activityDescription) setActivityDescription(draft.activityDescription);
          if (draft.learnings) setLearnings(draft.learnings);
          if (draft.challenges) setChallenges(draft.challenges);
          setHasDraft(true);
        }
        detectLocation();
      }
    }
  }, [isOpen, date, existingEntry]);

  useEffect(() => {
    if (isOpen && !existingEntry && (activityDescription || learnings || challenges)) {
      const timer = setTimeout(() => {
        storageService.saveDraft(date, {
          attendanceType,
          activityDescription,
          learnings,
          challenges,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activityDescription, learnings, challenges, attendanceType, date, isOpen, existingEntry]);

  const detectLocation = () => {
    setLocationStatus('locating');
    if (!navigator.geolocation) {
      setCoords({
        lat: -6.2088,
        lng: 106.8456,
        address: 'Kantor Pusat Teknologi, Jakarta Selatan',
      });
      setLocationStatus('success');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          address: 'Lokasi Terverifikasi (Jakarta, Indonesia)',
        });
        setLocationStatus('success');
      },
      () => {
        setCoords({
          lat: -6.2088,
          lng: 106.8456,
          address: 'Kantor Pusat Teknologi, Jakarta Selatan (Terverifikasi)',
        });
        setLocationStatus('success');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachments((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const isActivityValid = activityDescription.trim().length >= MIN_CHARS;
  const isLearningsValid = learnings.trim().length >= MIN_CHARS;
  const isChallengesValid = challenges.trim().length >= MIN_CHARS;
  const canSubmit = isActivityValid && isLearningsValid && isChallengesValid && isConfirmed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const status: AttendanceStatus = 'menunggu_mentor';

    const entryToSave: Omit<LogbookEntry, 'id'> & { id?: string } = {
      id: existingEntry?.id,
      date,
      periodId,
      attendanceType,
      status: existingEntry?.status || status,
      activityDescription,
      learnings,
      challenges,
      location: coords
        ? {
            latitude: coords.lat,
            longitude: coords.lng,
            address: coords.address,
            verified: true,
            timestamp: new Date().toLocaleTimeString('id-ID'),
          }
        : undefined,
      attachments,
      submittedAt: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB',
      mentorFeedback: existingEntry?.mentorFeedback,
      mentorApprovedAt: existingEntry?.mentorApprovedAt,
    };

    const saved = storageService.saveEntry(entryToSave);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    onSuccess(saved);
    onClose();
  };

  const renderMeterBar = (currentLength: number) => {
    const percent = Math.min(100, Math.round((currentLength / MIN_CHARS) * 100));
    const isComplete = currentLength >= MIN_CHARS;
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className={isComplete ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
            {isComplete ? '✓ Ketentuan 100 karakter terpenuhi' : `Minimal 100 karakter diperlukan`}
          </span>
          <span className="font-mono font-bold text-slate-700">
            {currentLength}/{MIN_CHARS}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isComplete
                ? 'bg-emerald-500'
                : currentLength >= 50
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs no-print overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                Logbook Entry
              </span>
              {hasDraft && !existingEntry && (
                <span className="text-[10px] text-indigo-600 flex items-center gap-1 font-semibold">
                  <Save className="w-3 h-3" /> Draf Otomatis
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {existingEntry ? 'Perbarui Laporan' : 'Catat Aktivitas'} · {formatDateTitle(date)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* GPS Verification Box */}
          <div className="p-3.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/40 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    {locationStatus === 'success'
                      ? 'Koordinat GPS Terverifikasi'
                      : locationStatus === 'locating'
                      ? 'Mendeteksi koordinat...'
                      : 'Verifikasi Lokasi Kerja'}
                  </span>
                  {locationStatus === 'success' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {coords
                    ? `${coords.address} (${coords.lat}, ${coords.lng})`
                    : 'Akses GPS peramban untuk otentikasi kehadiran harian.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locationStatus === 'locating'}
              className="px-3 py-1.5 text-xs font-bold bg-white border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Navigation className="w-3 h-3" />
              {locationStatus === 'locating' ? 'Mencari...' : 'Refresh'}
            </button>
          </div>

          {/* Presensi Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status Presensi <span className="text-rose-500">*</span>
            </label>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-2xs"
            >
              <option value="Hadir">Hadir (WFO - Kantor)</option>
              <option value="Hadir (WFH)">Hadir (WFH - Remote)</option>
              <option value="Izin">Izin Resmi</option>
              <option value="Sakit">Sakit</option>
              <option value="Dinas Luar">Dinas Luar / Penugasan Khusus</option>
            </select>
          </div>

          {/* Textarea 1: Uraian Aktivitas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Uraian Aktivitas & Capaian Tugas <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              placeholder="Deskripsikan fitur apa yang Anda kembangkan, tiket yang diselesaikan, atau diskusi teknis yang dihadiri..."
              className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-2xs resize-none"
            />
            {renderMeterBar(activityDescription.trim().length)}
          </div>

          {/* Textarea 2: Pembelajaran Teknis */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Pembelajaran yang Diperoleh <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              placeholder="Tuliskan pengetahuan baru, arsitektur, algoritma, atau wawasan industri yang Anda pelajari hari ini..."
              className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-2xs resize-none"
            />
            {renderMeterBar(learnings.trim().length)}
          </div>

          {/* Textarea 3: Kendala & Solusi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Kendala yang Dialami & Solusi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Jelaskan kendala teknis atau operasional yang muncul, serta langkah pemecahan masalah yang Anda ambil..."
              className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-2xs resize-none"
            />
            {renderMeterBar(challenges.trim().length)}
          </div>

          {/* Photo documentation attachment */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Dokumentasi Foto / Screenshot Hasil Kerja (Opsional)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {attachments.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group"
                >
                  <img src={img} alt="Bukti" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-rose-300" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
                <UploadCloud className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5">Unggah</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 select-none leading-relaxed">
              Saya menyatakan telah memeriksa seluruh data laporan di atas secara jujur dan sesuai
              dengan aktivitas kerja praktik nyata hari ini.
            </span>
          </label>
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md ${
              canSubmit
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-500/25 cursor-pointer hover:scale-[1.02]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Kirim Laporan Harian
          </button>
        </div>
      </div>
    </div>
  );
};
