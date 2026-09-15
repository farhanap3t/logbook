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
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Akun Peserta
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Kelola informasi akun, program magang, dan pengunduran diri Anda.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border border-slate-200"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-slate-900 text-base sm:text-lg truncate">
            {profile.name}
          </h2>
          <p className="text-xs text-slate-500 mb-1">{profile.role}</p>

          <div className="space-y-0.5 text-xs text-slate-600">
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

      {/* Informasi Magang */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Informasi Magang</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {profile.status}
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500">Perusahaan</span>
            <strong className="text-slate-800 font-semibold">{profile.company}</strong>
          </div>

          <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500">Posisi</span>
            <strong className="text-slate-800 font-semibold">{profile.position}</strong>
          </div>

          <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500">Lokasi Posisi</span>
            <strong className="text-slate-800 font-semibold uppercase">
              {profile.placementLocation}
            </strong>
          </div>

          <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500">Periode Magang</span>
            <strong className="text-slate-800 font-semibold">
              10 Agustus 2026 – 09 Februari 2027
            </strong>
          </div>

          <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-slate-500">Mentor</span>
            <strong className="text-slate-800 font-semibold">
              {profile.mentorName} ({profile.mentorEmail})
            </strong>
          </div>
        </div>
      </div>

      {/* Cetak Logbook PDF */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Cetak Laporan Logbook Resmi</h3>
            <p className="text-xs text-slate-500">
              Format lembar pengesahan dan rekapitulasi harian untuk kampus / kantor
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Cetak Dokumen Laporan (PDF)
        </button>
      </div>

      {/* Pengunduran Diri */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Pengunduran Diri</h3>
          <p className="text-xs text-slate-500">
            Ajukan pengunduran diri secara mandiri dari aplikasi Monev.
          </p>
        </div>

        <div
          onClick={() => setShowResignModal(true)}
          className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 hover:bg-red-50 flex items-center justify-between cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-700">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-red-900 text-xs sm:text-sm">Ajukan Pengunduran Diri</h4>
              <p className="text-[11px] text-red-700">
                Isi alasan, tanggal efektif, dan unggah surat bertanda tangan.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-red-700" />
        </div>
      </div>

      {/* Panduan Pengguna */}
      <div
        onClick={() => setIsViewingGuide(true)}
        className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Panduan Pengguna</h4>
            <p className="text-xs text-slate-500">Pelajari alur Monev untuk Peserta.</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
      </div>

      {/* Backup & Reset */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
        <span className="font-semibold text-slate-700 block">Penyimpanan Data Lokal</span>
        <div className="flex gap-2">
          <button
            onClick={onExportData}
            className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Cadangkan Data (JSON)
          </button>
          <button
            onClick={onResetData}
            className="py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data Demo
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="text-center pt-1">
        <button
          onClick={() => setLogoutAlert(true)}
          className="text-xs font-semibold text-red-600 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
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

      <ResignationModal
        isOpen={showResignModal}
        onClose={() => setShowResignModal(false)}
        userName={profile.name}
        companyName={profile.company}
      />

      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
