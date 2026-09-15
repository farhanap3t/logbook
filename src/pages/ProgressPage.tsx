import React, { useState } from 'react';
import {
  BookOpen,
  Wallet,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Award,
  MessageSquareQuote,
} from 'lucide-react';
import type {
  InternshipPeriod,
  CurriculumModule,
  PeriodEvaluation,
  StipendDetail,
} from '../types';
import { ServerClock } from '../components/ServerClock';

type SubViewType = 'kurikulum' | 'evaluasi' | 'uang_saku' | 'survei';

interface ProgressPageProps {
  periods: InternshipPeriod[];
  currentPeriodId: number;
  curriculums: CurriculumModule[];
  evaluations: PeriodEvaluation[];
  stipends: StipendDetail[];
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  periods,
  currentPeriodId,
  curriculums,
  evaluations,
  stipends,
}) => {
  const [subView, setSubView] = useState<SubViewType>('evaluasi');
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(currentPeriodId);

  const periodIndex = periods.findIndex((p) => p.id === selectedPeriodId);
  const currentPeriodObj = periods[periodIndex] || periods[0];

  const handlePrevPeriod = () => {
    if (periodIndex > 0) setSelectedPeriodId(periods[periodIndex - 1].id);
  };

  const handleNextPeriod = () => {
    if (periodIndex < periods.length - 1) setSelectedPeriodId(periods[periodIndex + 1].id);
  };

  const periodCurriculums = curriculums.filter((c) => c.periodId === selectedPeriodId);
  const periodEvaluation = evaluations.find((e) => e.periodId === selectedPeriodId);
  const periodStipend = stipends.find((s) => s.periodId === selectedPeriodId);

  return (
    <div className="space-y-5 pb-20 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Perkembangan & Kompetensi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Pantau capaian silabus, penilaian performa berkala, dan transparansi benefit magang.
          </p>
        </div>

        {/* Period Selector Pill */}
        <div className="inline-flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <button
            onClick={handlePrevPeriod}
            disabled={periodIndex === 0}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div className="px-3 text-center">
            <span className="text-xs font-bold text-slate-800">{currentPeriodObj.name}</span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {currentPeriodObj.startDate} - {currentPeriodObj.endDate}
            </span>
          </div>
          <button
            onClick={handleNextPeriod}
            disabled={periodIndex === periods.length - 1}
            className="p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-1">
        <button
          onClick={() => setSubView('evaluasi')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subView === 'evaluasi'
              ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Evaluasi Mentor
        </button>

        <button
          onClick={() => setSubView('kurikulum')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subView === 'kurikulum'
              ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Kurikulum & Modul
        </button>

        <button
          onClick={() => setSubView('uang_saku')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subView === 'uang_saku'
              ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          Uang Saku & Benefit
        </button>

        <button
          onClick={() => setSubView('survei')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            subView === 'survei'
              ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          Survei Program
        </button>
      </div>

      {/* ===================== TAB: EVALUASI MENTOR ===================== */}
      {subView === 'evaluasi' && (
        <div className="space-y-4">
          {periodEvaluation ? (
            <>
              {/* Executive Score Summary Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/10">
                    Nilai Kinerja {currentPeriodObj.name}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Hasil Penilaian Mentor Lapangan
                  </h3>
                  <p className="text-xs text-indigo-200/80 max-w-md">
                    Dievaluasi secara komprehensif oleh <strong>{periodEvaluation.mentorName}</strong> pada{' '}
                    {periodEvaluation.completedAt}.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center shrink-0 min-w-[140px]">
                  <div className="text-3xl font-black text-white">{periodEvaluation.overallScore}</div>
                  <div className="text-[11px] font-semibold text-indigo-200">dari skala 4.0</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Sangat Baik
                  </span>
                </div>
              </div>

              {/* 8 Aspek Penilaian Competency Bars */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Matrix 8 Aspek Kompetensi Kerja
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">SB: Sangat Baik</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">B: Baik</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">C: Cukup</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {periodEvaluation.aspects.map((asp) => {
                    const scoreVal =
                      asp.score === 'SB' ? 95 : asp.score === 'B' ? 80 : asp.score === 'C' ? 65 : 40;
                    return (
                      <div
                        key={asp.id}
                        className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{asp.aspect}</span>
                          <span
                            className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                              asp.score === 'SB'
                                ? 'bg-indigo-100 text-indigo-800'
                                : asp.score === 'B'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {asp.score}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              asp.score === 'SB'
                                ? 'bg-indigo-600'
                                : asp.score === 'B'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${scoreVal}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Capaian Kurikulum & Feedback Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm">Capaian Modul Kurikulum</h4>
                  <div className="space-y-2">
                    {periodEvaluation.curriculumAchievements.map((ca, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-700">{ca.moduleName}</span>
                        <span className="font-bold text-indigo-600 px-2 py-0.5 rounded-md bg-indigo-50">
                          {ca.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                      <MessageSquareQuote className="w-4 h-4 text-amber-600" />
                      Catatan Masukan Mentor
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900 italic leading-relaxed">
                      &ldquo;{periodEvaluation.mentorComment}&rdquo;
                    </p>
                  </div>
                  <div className="text-[11px] text-amber-700 font-semibold pt-2 border-t border-amber-200/60 flex items-center justify-between">
                    <span>{periodEvaluation.mentorName}</span>
                    <span>Verified ✓</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">Evaluasi Sedang Berlangsung</h3>
              <p className="text-xs text-slate-500">
                Mentor lapangan akan menginputkan penilaian kinerja pada akhir siklus periode ini.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB: KURIKULUM & MODUL ===================== */}
      {subView === 'kurikulum' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Silabus & Modul Pembelajaran</h3>
                  <p className="text-xs text-slate-500">{periodCurriculums.length} modul aktif di {currentPeriodObj.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {periodCurriculums.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-2.5 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{mod.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 pl-7">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {mod.type}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{mod.month}</span>
                        <span className="text-xs text-slate-400 font-medium">· {mod.duration}</span>
                      </div>
                    </div>

                    {mod.completed && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        Tuntas ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                    {mod.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB: UANG SAKU & BENEFIT ===================== */}
      {subView === 'uang_saku' && periodStipend && (
        <div className="space-y-4">
          {/* Fintech Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/40 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
                  Estimasi Uang Saku {currentPeriodObj.name}
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  Rp {periodStipend.nominalEstimate.toLocaleString('id-ID')}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  periodStipend.submissionStatus === 'Diajukan' ||
                  periodStipend.submissionStatus === 'Cair'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-white/10 text-indigo-200'
                }`}
              >
                {periodStipend.submissionStatus}
              </span>
            </div>

            {/* Paid days meter */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs text-indigo-200">
                <span>Rasio Hari Kerja Dibayar</span>
                <strong className="text-white">
                  {periodStipend.paidDays} dari {periodStipend.totalWorkingDays} hari (
                  {Math.round((periodStipend.paidDays / (periodStipend.totalWorkingDays || 1)) * 100)}%)
                </strong>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  style={{
                    width: `${Math.round(
                      (periodStipend.paidDays / (periodStipend.totalWorkingDays || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Rincian Hari Kehadiran</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 font-semibold">
                  <span>Kehadiran Disetujui</span>
                  <strong>{periodStipend.approvedAttendanceDays} Hari</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-teal-50 text-teal-900 font-semibold">
                  <span>Izin Berbayar (Eligible)</span>
                  <strong>{periodStipend.paidLeaveDays} Hari</strong>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 text-slate-700">
                  <span>Hari Libur Operasional & Nasional</span>
                  <strong>{periodStipend.nonWorkingDays} Hari</strong>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Rekening Penerima Manfaat</h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank</span>
                  <strong className="text-slate-900">{periodStipend.bankName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Rekening</span>
                  <strong className="font-mono text-slate-900">{periodStipend.accountNumberMasked}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Atas Nama</span>
                  <strong className="text-slate-900">{periodStipend.accountHolder}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB: SURVEI ===================== */}
      {subView === 'survei' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Survei Pengalaman Magang</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Kuesioner evaluasi program, mentoring, dan fasilitas magang akan terbuka otomatis pada bulan
            terakhir periode magang Anda (Periode 6).
          </p>
        </div>
      )}

      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
