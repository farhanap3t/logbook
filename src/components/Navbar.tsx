import React from 'react';
import {
  Home,
  Calendar,
  BarChart2,
  User,
  Bell,
  Smartphone,
  Monitor,
  BookOpen,
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
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'riwayat', label: 'Riwayat', icon: Calendar },
    { id: 'perkembangan', label: 'Perkembangan', icon: BarChart2 },
    { id: 'akun', label: 'Akun', icon: User },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm tracking-tight">Logbook</span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  Magang
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-xs">
                {companyName}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSimulator}
              title={isMobileSimulator ? 'Tampilan Penuh Desktop' : 'Pratinjau Mobile'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              {isMobileSimulator ? (
                <>
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline text-[11px] font-medium">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline text-[11px] font-medium">Mobile</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenAnnouncements}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Pengumuman"
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div
        className={`fixed bottom-0 z-40 bg-white border-t border-slate-200 shadow-lg no-print transition-all ${
          isMobileSimulator
            ? 'w-full max-w-[420px] mx-auto left-0 right-0'
            : 'w-full left-0 md:hidden'
        }`}
      >
        <div className="grid grid-cols-4 h-14 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span
                  className={`text-[10px] ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 font-normal'
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
