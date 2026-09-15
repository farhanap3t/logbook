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
  GraduationCap,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
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
    <div className="space-y-5 pb-20 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Profil & Dokumen Resmi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Kelola informasi identitas magang, cetak laporan resmi, dan panduan sistem.
        </p>
      </div>

      {/* Modern Profile Passport Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-sm border border-indigo-900/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-[10px] font-bold">
              <span>{profile.role}</span>
              <span>•</span>
              <span className="text-white">{profile.status}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white truncate">
              {profile.name}
            </h2>
            <p className="text-xs text-indigo-200/80 font-medium flex items-center gap-1.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>{profile.universityName} — {profile.major}</span>
            </p>
          </div>
        </div>

        {/* Contact Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-white/10 text-xs text-indigo-200">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 truncate">
            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{profile.phone}</span>
          </div>
        </div>
      </div>

      {/* Internship Placement Info */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Informasi Penugasan</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {profile.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Perusahaan Penempatan
            </span>
            <strong className="text-slate-900 block font-bold">{profile.company}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Posisi / Role
            </span>
            <strong className="text-slate-900 block font-bold">{profile.position}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Lokasi Penugasan
            </span>
            <strong className="text-slate-900 block font-bold">{profile.placementLocation}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Periode Magang
            </span>
            <strong className="text-slate-900 block font-bold">10 Agustus 2026 – 09 Februari 2027</strong>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 text-xs text-indigo-950 flex items-center justify-between">
          <span>Mentor Lapangan: <strong>{profile.mentorName}</strong> ({profile.mentorEmail})</span>
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
        </div>
      </div>

      {/* Official PDF Print Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Cetak Dokumen Logbook Resmi</h3>
            <p className="text-xs text-indigo-100">
              Format buku laporan magang formal lengkap dengan lembar tanda tangan pengesahan (PDF).
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-3 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform hover:scale-[1.01] cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Cetak Dokumen Logbook Resmi Sekarang
        </button>
      </div>

      {/* Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Panduan Pengguna */}
        <div
          onClick={() => setIsViewingGuide(true)}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                Panduan Pengguna
              </h4>
              <p className="text-xs text-slate-500">Pelajari alur monev, ketentuan & FAQ</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </div>

        {/* Pengunduran Diri */}
        <div
          onClick={() => setShowResignModal(true)}
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-rose-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                Pengunduran Diri
              </h4>
              <p className="text-xs text-slate-500">Ajukan pengunduran diri mandiri</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
        </div>
      </div>

      {/* Data Management */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700">Penyimpanan & Cadangan Data</span>
          <span className="text-[10px] text-slate-400 font-mono">v2.0 • Local Persistent Engine</span>
        </div>
        <div className="flex gap-2.5 pt-1">
          <button
            onClick={onExportData}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Cadangkan Data (JSON)
          </button>
          <button
            onClick={onResetData}
            className="py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            title="Kembalikan data ke kondisi awal"
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
          className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
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

      {/* Resignation Modal */}
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
