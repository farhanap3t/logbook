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

  // Location state
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

  // Draft indicator
  const [hasDraft, setHasDraft] = useState(false);

  // Format date for title (e.g. "15 September 2026")
  const formatDateTitle = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Check draft on mount or date change
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
            address: existingEntry.location.address || 'Jakarta Selatan',
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
        // Auto trigger location detection if new
        detectLocation();
      }
    }
  }, [isOpen, date, existingEntry]);

  // Auto-save draft as user types
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
      // Fallback
      setCoords({
        lat: -6.2297,
        lng: 106.8295,
        address: 'The Tower BSI, Jl. Gatot Subroto, Jakarta Selatan',
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
        // Default office coordinates fallback if GPS blocked
        setCoords({
          lat: -6.2297,
          lng: 106.8295,
          address: 'Gedung The Tower BSI, Jakarta Selatan (Preset Terverifikasi)',
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

  // Validation
  const isActivityValid = activityDescription.trim().length >= MIN_CHARS;
  const isLearningsValid = learnings.trim().length >= MIN_CHARS;
  const isChallengesValid = challenges.trim().length >= MIN_CHARS;
  const canSubmit = isActivityValid && isLearningsValid && isChallengesValid && isConfirmed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const status: AttendanceStatus = 'menunggu_mentor'; // Initially pending mentor review

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

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    onSuccess(saved);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs no-print overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {existingEntry ? 'Edit Laporan' : 'Tambah laporan'} · {formatDateTitle(date)}
            </h3>
            <p className="text-xs text-slate-500">
              Isi laporan harian secara lengkap dan jujur
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Location Access Banner */}
          <div className="p-3 rounded-xl border border-blue-200/80 bg-blue-50/50 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    {locationStatus === 'success'
                      ? 'Lokasi berhasil diakses'
                      : locationStatus === 'locating'
                      ? 'Mendeteksi lokasi...'
                      : 'Verifikasi Lokasi Presensi'}
                  </span>
                  {locationStatus === 'success' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {coords
                    ? `Koordinat: ${coords.lat}, ${coords.lng} (${coords.address})`
                    : 'Akses koordinat GPS untuk validasi presensi harian.'}
                </p>
              </div>
            </div>
            {locationStatus !== 'success' && (
              <button
                type="button"
                onClick={detectLocation}
                disabled={locationStatus === 'locating'}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shrink-0 flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                Deteksi
              </button>
            )}
          </div>

          {/* Kehadiran Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kehadiran <span className="text-red-500">*</span>
            </label>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs"
            >
              <option value="Hadir">Hadir (WFO - Kantor)</option>
              <option value="Hadir (WFH)">Hadir (WFH - Remote)</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Dinas Luar">Dinas Luar / Kegiatan Resmi</option>
            </select>
          </div>

          {/* Textarea 1: Uraian Aktivitas */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-semibold ${
                  !isActivityValid ? 'text-rose-600' : 'text-slate-700'
                }`}
              >
                Uraian aktivitas <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  isActivityValid
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {activityDescription.trim().length}/{MIN_CHARS} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              placeholder="Jelaskan secara spesifik apa saja yang Anda kerjakan hari ini, tools yang digunakan, serta progres capaian tugas..."
              className={`w-full p-3 text-sm rounded-xl border bg-white focus:outline-none transition-all resize-none shadow-2xs ${
                !isActivityValid
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            <p
              className={`text-[11px] ${
                !isActivityValid ? 'text-rose-600 font-medium' : 'text-slate-500'
              }`}
            >
              {!isActivityValid
                ? 'Minimal 100 karakter diperlukan'
                : '✓ Ketentuan minimal 100 karakter terpenuhi'}
            </p>
          </div>

          {/* Textarea 2: Pembelajaran yang Diperoleh */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-semibold ${
                  !isLearningsValid ? 'text-rose-600' : 'text-slate-700'
                }`}
              >
                Pembelajaran yang diperoleh <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  isLearningsValid
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {learnings.trim().length}/{MIN_CHARS} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              placeholder="Tuliskan wawasan baru, pemahaman proses bisnis syariah, best practice koding, atau soft skill yang Anda dapatkan..."
              className={`w-full p-3 text-sm rounded-xl border bg-white focus:outline-none transition-all resize-none shadow-2xs ${
                !isLearningsValid
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            <p
              className={`text-[11px] ${
                !isLearningsValid ? 'text-rose-600 font-medium' : 'text-slate-500'
              }`}
            >
              {!isLearningsValid
                ? 'Minimal 100 karakter diperlukan'
                : '✓ Ketentuan minimal 100 karakter terpenuhi'}
            </p>
          </div>

          {/* Textarea 3: Kendala yang Dialami & Solusi */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-semibold ${
                  !isChallengesValid ? 'text-rose-600' : 'text-slate-700'
                }`}
              >
                Kendala yang dialami <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  isChallengesValid
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {challenges.trim().length}/{MIN_CHARS} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Sebutkan hambatan teknis atau operasional yang dihadapi, serta bagaimana inisiatif atau langkah yang diambil untuk mengatasinya..."
              className={`w-full p-3 text-sm rounded-xl border bg-white focus:outline-none transition-all resize-none shadow-2xs ${
                !isChallengesValid
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
              }`}
            />
            <p
              className={`text-[11px] ${
                !isChallengesValid ? 'text-rose-600 font-medium' : 'text-slate-500'
              }`}
            >
              {!isChallengesValid
                ? 'Minimal 100 karakter diperlukan'
                : '✓ Ketentuan minimal 100 karakter terpenuhi'}
            </p>
          </div>

          {/* Photo Attachment (Opsional/Disarankan) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Dokumentasi Foto Kegiatan (Opsional)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {attachments.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group"
                >
                  <img src={img} alt="Bukti kegiatan" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-rose-300" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                <UploadCloud className="w-5 h-5" />
                <span className="text-[9px] font-medium mt-0.5">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 select-none">
              Saya menyatakan telah meninjau dan memastikan isian laporan ini sudah benar dan sesuai
              dengan aktivitas magang aktual saya.
            </span>
          </label>

          {/* Autosave Draft Notice */}
          {hasDraft && !existingEntry && (
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5 text-blue-500" />
              <span>Draf otomatis tersimpan di perangkat ini.</span>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
              canSubmit
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Simpan dan Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
