import { useState } from 'react';
import { storageService } from './services/storageService';
import type {
  UserProfile,
  InternshipPeriod,
  LogbookEntry,
  CurriculumModule,
  PeriodEvaluation,
  StipendDetail,
  Announcement,
} from './types';
import { Navbar, type TabType } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AttendancePage } from './pages/AttendancePage';
import { ProgressPage } from './pages/ProgressPage';
import { AccountPage } from './pages/AccountPage';
import { LogbookFormModal } from './components/LogbookFormModal';
import { AnnouncementsModal } from './components/AnnouncementsModal';
import { LogbookPrintView } from './components/LogbookPrintView';

export function App() {
  // Application Data States
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [periods, setPeriods] = useState<InternshipPeriod[]>(() => storageService.getPeriods());
  const [entries, setEntries] = useState<LogbookEntry[]>(() => storageService.getEntries());
  const [curriculums, setCurriculums] = useState<CurriculumModule[]>(() =>
    storageService.getCurriculum()
  );
  const [evaluations, setEvaluations] = useState<PeriodEvaluation[]>(() =>
    storageService.getEvaluations()
  );
  const [stipends, setStipends] = useState<StipendDetail[]>(() => storageService.getStipends());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    storageService.getAnnouncements()
  );

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('beranda');
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

  // Today reference (2026-09-15 as in reference screenshots)
  const todayDate = '2026-09-15';
  const currentPeriod = periods.find((p) => p.isCurrent) || periods[1] || periods[0];
  const todayEntry = entries.find((e) => e.date === todayDate);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDate, setFormDate] = useState<string>(todayDate);
  const [formExistingEntry, setFormExistingEntry] = useState<LogbookEntry | undefined>(undefined);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);

  const unreadAnnouncementsCount = announcements.filter((a) => a.isNew).length;

  const handleOpenForm = (date: string, existing?: LogbookEntry) => {
    setFormDate(date);
    setFormExistingEntry(existing || entries.find((e) => e.date === date));
    setIsFormOpen(true);
  };

  const handleSuccessForm = () => {
    setEntries(storageService.getEntries());
  };

  const handleMarkAnnouncementRead = (id: string) => {
    storageService.markAnnouncementRead(id);
    setAnnouncements(storageService.getAnnouncements());
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan seluruh data logbook ke data demo awal?')) {
      storageService.resetToDefaultData();
      setProfile(storageService.getProfile());
      setPeriods(storageService.getPeriods());
      setEntries(storageService.getEntries());
      setCurriculums(storageService.getCurriculum());
      setEvaluations(storageService.getEvaluations());
      setStipends(storageService.getStipends());
      setAnnouncements(storageService.getAnnouncements());
    }
  };

  const handleExportData = () => {
    const dataStr = storageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monev-magang-${profile.name.toLowerCase().replace(/\s+/g, '-')}-backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
        isMobileSimulator={isMobileSimulator}
        onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        companyName={profile.company}
      />

      {/* Main Content Area: Responsive Container or Mobile Frame */}
      <main className="flex-1 flex justify-center p-2 sm:p-4 md:p-6 no-print">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileSimulator
              ? 'max-w-[440px] bg-slate-50/80 rounded-[36px] p-4 sm:p-5 shadow-2xl border-[8px] border-slate-800 ring-1 ring-slate-900/10 min-h-[840px] my-2 relative'
              : 'max-w-4xl bg-transparent'
          }`}
        >
          {/* Active Tab View */}
          {activeTab === 'beranda' && (
            <HomePage
              profile={profile}
              todayDate={todayDate}
              todayEntry={todayEntry}
              announcements={announcements}
              onOpenLogbookForm={(date) => handleOpenForm(date)}
              onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'riwayat' && (
            <AttendancePage
              periods={periods}
              currentPeriodId={currentPeriod.id}
              entries={entries}
              todayDate={todayDate}
              onOpenLogbookForm={handleOpenForm}
            />
          )}

          {activeTab === 'perkembangan' && (
            <ProgressPage
              periods={periods}
              currentPeriodId={currentPeriod.id}
              curriculums={curriculums}
              evaluations={evaluations}
              stipends={stipends}
            />
          )}

          {activeTab === 'akun' && (
            <AccountPage
              profile={profile}
              onResetData={handleResetData}
              onExportData={handleExportData}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <LogbookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        date={formDate}
        periodId={currentPeriod.id}
        existingEntry={formExistingEntry}
        onSuccess={handleSuccessForm}
      />

      <AnnouncementsModal
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
        announcements={announcements}
        onMarkRead={handleMarkAnnouncementRead}
      />

      {/* Print View (Visible only when printing) */}
      <LogbookPrintView
        profile={profile}
        period={currentPeriod}
        entries={entries}
      />
    </div>
  );
}

export default App;
