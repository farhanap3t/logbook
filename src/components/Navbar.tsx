import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  LineChart,
  UserCircle2,
  Bell,
  Smartphone,
  Monitor,
  Layers,
} from 'lucide-react';

export type TabType = 'beranda' | 'riwayat' | 'perkembangan' | 'akun';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadAnnouncementsCount: number;
  onOpenAnnouncements: () => void;
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  companyName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  unreadAnnouncementsCount,
  onOpenAnnouncements,
  isMobileSimulator,
  onToggleSimulator,
  companyName,
}) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'beranda', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'riwayat', label: 'Presensi & Kalender', icon: CalendarDays },
    { id: 'perkembangan', label: 'Perkembangan', icon: LineChart },
    { id: 'akun', label: 'Profil & Dokumen', icon: UserCircle2 },
  ];

  return (
    <>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          {/* Brand Logo & Workstation */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-500/25 ring-1 ring-white/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">
                  Logbook
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider">
                  Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-xs">
                {companyName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs shadow-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <button
              onClick={onToggleSimulator}
              title={isMobileSimulator ? 'Beralih ke Tampilan Desktop' : 'Beralih ke Simulasi Mobile'}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              {isMobileSimulator ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline text-[11px]">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline text-[11px]">Mobile View</span>
                </>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenAnnouncements}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors"
              title="Pengumuman & Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white animate-ping" />
              )}
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Nav for Mobile / Simulator */}
      <div
        className={`fixed bottom-3 z-40 px-3 no-print transition-all ${
          isMobileSimulator
            ? 'w-full max-w-[420px] mx-auto left-0 right-0'
            : 'w-full left-0 md:hidden'
        }`}
      >
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl shadow-slate-950/20 grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-[10px] tracking-tight truncate max-w-full">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
