import React from 'react';
import { X, BookOpen, Clock, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Panduan Pengguna Monev</h3>
              <p className="text-xs text-slate-500">Standar pengisian logbook & kehadiran</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed flex-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              1. Batas Waktu Pengisian Harian
            </div>
            <p>
              Logbook harus diserahkan setiap hari kerja sebelum pukul <strong>23:59 WIB</strong>.
              Pengisian setelah batas waktu otomatis dihitung sebagai keterlambatan atau tanpa catatan.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              2. Ketentuan Minimal 100 Karakter
            </div>
            <p>
              Masing-masing dari 3 bagian wajib (Uraian Aktivitas, Pembelajaran, dan Kendala) wajib
              memiliki minimal 100 karakter. Deskripsikan pekerjaan secara substantif, bukan ringkasan
              satu kalimat pendek.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <MapPin className="w-4 h-4 text-purple-600" />
              3. Verifikasi Lokasi GPS
            </div>
            <p>
              Sistem akan meminta akses GPS untuk memvalidasi presensi WFO / WFH / Dinas Luar. Pastikan
              browser Anda mengizinkan deteksi lokasi.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              4. Aturan Izin & Perhitungan Uang Saku
            </div>
            <p>
              Maksimal 3 hari izin per periode tetap berhak menerima uang saku penuh (dibayar). Izin
              ke-4 dan selanjutnya tidak dibayarkan namun tidak mengurangi kuota kehadiran kelulusan.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
