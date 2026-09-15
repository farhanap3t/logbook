import React, { useState } from 'react';
import {
  Mail,
  Phone,
  LogOut,
  AlertOctagon,
  BookOpen,
  Printer,
  Download,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import type { UserProfile } from '../types';
import { ServerClock } from '../components/ServerClock';
import { ResignationModal } from '../components/ResignationModal';
import { UserGuidePage } from './UserGuidePage';

interface AccountPageProps {
  profile: UserProfile;
  onResetData: () => void;
  onExportData: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  profile,
  onResetData,
  onExportData,
}) => {
  const [showResignModal, setShowResignModal] = useState(false);
  const [isViewingGuide, setIsViewingGuide] = useState(false);
  const [logoutAlert, setLogoutAlert] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  if (isViewingGuide) {
    return <UserGuidePage onBack={() => setIsViewingGuide(false)} />;
  }

  return (
    <div className="space-y-4 pb-20 fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Akun Peserta
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Kelola informasi akun, program magang, dan pengunduran diri Anda.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-black text-slate-900 text-base sm:text-lg truncate">
            {profile.name}
          </h2>
          <p className="text-xs font-semibold text-blue-600 mb-1">{profile.role}</p>

          <div className="space-y-0.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{profile.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Informasi Magang */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Informasi Magang</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {profile.status}
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500 font-medium">Perusahaan</span>
            <strong className="text-slate-800 font-semibold">{profile.company}</strong>
          </div>

          <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500 font-medium">Posisi</span>
            <strong className="text-slate-800 font-semibold">{profile.position}</strong>
          </div>

          <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500 font-medium">Lokasi Posisi</span>
            <strong className="text-slate-800 font-semibold uppercase">
              {profile.placementLocation}
            </strong>
          </div>

          <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500 font-medium">Periode Magang</span>
            <strong className="text-slate-800 font-semibold">
              10 Agustus 2026 - 09 Februari 2027
            </strong>
          </div>

          <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500 font-medium">Mentor Lapangan</span>
            <strong className="text-slate-800 font-semibold">
              {profile.mentorName} ({profile.mentorEmail})
            </strong>
          </div>
        </div>
      </div>

      {/* Official Export & Print Action Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Cetak Laporan Logbook Resmi</h3>
            <p className="text-xs text-slate-600">
              Format lembar pengesahan & rekap aktivitas magang (PDF/Print)
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Cetak Dokumen Logbook Resmi Sekarang
        </button>
      </div>

      {/* Card Pengunduran Diri */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Pengunduran Diri</h3>
          <p className="text-xs text-slate-500">
            Ajukan pengunduran diri secara mandiri dari aplikasi Monev.
          </p>
        </div>

        <div
          onClick={() => setShowResignModal(true)}
          className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 hover:bg-rose-50 flex items-center justify-between cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 text-xs sm:text-sm">Ajukan Pengunduran Diri</h4>
              <p className="text-[11px] text-rose-700">
                Isi alasan, tanggal efektif, dan unggah surat bertanda tangan.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-700" />
        </div>
      </div>

      {/* Card Panduan Pengguna */}
      <div
        onClick={() => setIsViewingGuide(true)}
        className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 flex items-center justify-between cursor-pointer transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Panduan Pengguna</h4>
            <p className="text-xs text-slate-500">Pelajari penggunaan Monev untuk Peserta.</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
      </div>

      {/* Backup & Data Controls */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700">Manajemen Data Lokal</span>
          <span className="text-[10px] text-slate-400 font-mono">v1.2.0 • Offline Persistent</span>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onExportData}
            className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Cadangkan Data (JSON)
          </button>
          <button
            onClick={onResetData}
            className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="Kembalikan ke data demo awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <div className="text-center pt-2">
        <button
          onClick={() => setLogoutAlert(true)}
          className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline inline-flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar dari akun
        </button>

        {logoutAlert && (
          <div className="mt-2 text-xs text-slate-500">
            Sesi lokal aktif. Anda dapat terus menggunakan aplikasi ini di peramban kapan saja.
          </div>
        )}
      </div>

      {/* Modals */}
      <ResignationModal
        isOpen={showResignModal}
        onClose={() => setShowResignModal(false)}
        userName={profile.name}
        companyName={profile.company}
      />

      {/* Footer Clock */}
      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
