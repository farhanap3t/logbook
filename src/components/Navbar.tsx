import React from 'react';
import { Home, Calendar, ClipboardList, User, Bell, Smartphone, Monitor } from 'lucide-react';

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
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'riwayat', label: 'Riwayat', icon: Calendar },
    { id: 'perkembangan', label: 'Perkembangan', icon: ClipboardList },
    { id: 'akun', label: 'Akun', icon: User },
  ];

  return (
    <>
      {/* Top Header for Desktop & Mobile bar container */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo & App Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-base shadow-xs shadow-emerald-500/20">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm tracking-tight">
                  Monev Magang
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {companyName.includes('BSI') ? 'BSI Portal' : 'Official'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-xs">
                {companyName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher (Simulator / Responsive) */}
            <button
              onClick={onToggleSimulator}
              title={isMobileSimulator ? 'Beralih ke Tampilan Desktop' : 'Beralih ke Preview Mobile'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
            >
              {isMobileSimulator ? (
                <>
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="hidden lg:inline text-[11px]">Mode Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="hidden lg:inline text-[11px]">Mode Mobile</span>
                </>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenAnnouncements}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Pengumuman"
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar for Mobile View / Mobile Simulator */}
      <div
        className={`fixed bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg no-print transition-all ${
          isMobileSimulator
            ? 'w-full max-w-md mx-auto left-0 right-0'
            : 'w-full left-0 md:hidden'
        }`}
      >
        <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center justify-center gap-1 transition-colors relative"
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 rounded-full bg-blue-600 animate-in fade-in" />
                )}
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'text-blue-600 bg-blue-50/80 scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-medium tracking-tight ${
                    isActive ? 'text-blue-700 font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
