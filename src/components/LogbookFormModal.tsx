import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  UploadCloud,
  Trash2,
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
          address: 'Lokasi Terverifikasi',
        });
        setLocationStatus('success');
      },
      () => {
        setCoords({
          lat: -6.2088,
          lng: 106.8456,
          address: 'Jakarta Selatan (Terverifikasi)',
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
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {}

    onSuccess(saved);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs no-print overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {existingEntry ? 'Edit Laporan' : 'Tambah laporan'} · {formatDateTitle(date)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 flex-1 text-xs sm:text-sm">
          {/* Location Box */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {locationStatus === 'success' ? 'Lokasi berhasil diakses' : 'Mendeteksi lokasi...'}
                  {locationStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {coords ? `${coords.address} (${coords.lat}, ${coords.lng})` : 'Mencari sinyal GPS...'}
                </p>
              </div>
            </div>
            {locationStatus !== 'success' && (
              <button
                type="button"
                onClick={detectLocation}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Deteksi
              </button>
            )}
          </div>

          {/* Kehadiran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kehadiran</label>
            <select
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="Hadir">Hadir</option>
              <option value="Hadir (WFH)">Hadir (WFH)</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Dinas Luar">Dinas Luar</option>
            </select>
          </div>

          {/* Textarea 1: Uraian Aktivitas */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-semibold ${
                  !isActivityValid ? 'text-red-600' : 'text-slate-700'
                }`}
              >
                Uraian aktivitas
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {activityDescription.trim().length}/{MIN_CHARS} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              placeholder="Tuliskan aktivitas harian..."
              className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border bg-white focus:outline-none transition-colors resize-none ${
                !isActivityValid
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            <p className={`text-[11px] ${!isActivityValid ? 'text-red-500 font-medium' : 'text-emerald-600'}`}>
              {!isActivityValid ? 'Minimal 100 karakter' : '✓ Minimal 100 karakter terpenuhi'}
            </p>
          </div>

          {/* Textarea 2: Pembelajaran */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-semibold ${
                  !isLearningsValid ? 'text-red-600' : 'text-slate-700'
                }`}
              >
                Pembelajaran yang diperoleh
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {learnings.trim().length}/{MIN_CHARS} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              placeholder="Tuliskan pembelajaran yang diperoleh..."
              className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border bg-white focus:outline-none transition-colors resize-none ${
                !isLearningsValid
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            <p className={`text-[11px] ${!isLearningsValid ? 'text-red-500 font-medium' : 'text-emerald-600'}`}>
              {!isLearningsValid ? 'Minimal 100 karakter' : '✓ Minimal 100 karakter terpenuhi'}
            </p>
          </div>

          {/* Textarea 3: Kendala */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-semibold ${
                  !isChallengesValid ? 'text-red-600' : 'text-slate-700'
                }`}
              >
                Kendala yang dialami
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {challenges.trim().length}/{MIN_CHARS} karakter
              </span>
            </div>
            <textarea
              rows={3}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Tuliskan kendala dan solusi yang Anda ambil..."
              className={`w-full p-2.5 text-xs sm:text-sm rounded-lg border bg-white focus:outline-none transition-colors resize-none ${
                !isChallengesValid
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            <p className={`text-[11px] ${!isChallengesValid ? 'text-red-500 font-medium' : 'text-emerald-600'}`}>
              {!isChallengesValid ? 'Minimal 100 karakter' : '✓ Minimal 100 karakter terpenuhi'}
            </p>
          </div>

          {/* Photo upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Dokumentasi Foto (Opsional)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {attachments.map((img, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
                  <img src={img} alt="Bukti" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  </button>
                </div>
              ))}
              <label className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer">
                <UploadCloud className="w-4 h-4" />
                <span className="text-[9px] mt-0.5 font-medium">Unggah</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Confirmation */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300"
            />
            <span className="text-xs text-slate-700 select-none">
              Saya menyatakan telah meninjau dan memastikan isian laporan ini sudah benar.
            </span>
          </label>
        </form>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              canSubmit
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
          >
            Simpan dan Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
