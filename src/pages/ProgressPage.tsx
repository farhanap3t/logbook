import React, { useState } from 'react';
import {
  BookOpen,
  FileCheck,
  Wallet,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  CheckCircle2,
  Building,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import type {
  InternshipPeriod,
  CurriculumModule,
  PeriodEvaluation,
  StipendDetail,
} from '../types';
import { ServerClock } from '../components/ServerClock';

type SubViewType = 'menu' | 'kurikulum' | 'evaluasi' | 'uang_saku' | 'survei';

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
  const [subView, setSubView] = useState<SubViewType>('menu');
  const [selectedPeriodId, setSelectedPeriodId] = useState<number>(currentPeriodId);

  // Period navigation helper
  const periodIndex = periods.findIndex((p) => p.id === selectedPeriodId);
  const currentPeriodObj = periods[periodIndex] || periods[0];

  const handlePrevPeriod = () => {
    if (periodIndex > 0) setSelectedPeriodId(periods[periodIndex - 1].id);
  };

  const handleNextPeriod = () => {
    if (periodIndex < periods.length - 1) setSelectedPeriodId(periods[periodIndex + 1].id);
  };

  // Filtered data
  const periodCurriculums = curriculums.filter((c) => c.periodId === selectedPeriodId);
  const periodEvaluation = evaluations.find((e) => e.periodId === selectedPeriodId);
  const periodStipend = stipends.find((s) => s.periodId === selectedPeriodId);

  // ====================== SUB-VIEW: KURIKULUM ======================
  if (subView === 'kurikulum') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        {/* Header with back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Kurikulum</h1>
            <p className="text-xs text-slate-500 font-medium">
              Lihat materi dan fokus pembelajaran untuk setiap periode magang.
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <button
            onClick={handlePrevPeriod}
            disabled={periodIndex === 0}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h4 className="font-bold text-slate-800 text-sm">{currentPeriodObj.name}</h4>
            <p className="text-[11px] text-slate-500 font-mono">
              {currentPeriodObj.startDate} - {currentPeriodObj.endDate}
            </p>
          </div>
          <button
            onClick={handleNextPeriod}
            disabled={periodIndex === periods.length - 1}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Modules List */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-base">Kurikulum Magang</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {periodCurriculums.length} materi
            </span>
          </div>

          {periodCurriculums.length > 0 ? (
            <div className="space-y-3">
              {periodCurriculums.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-2.5 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{mod.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {mod.type}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{mod.month}</span>
                        <span className="text-xs text-slate-400 font-medium">· {mod.duration}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pl-6">
                    {mod.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              Belum ada materi kurikulum untuk periode ini.
            </p>
          )}
        </div>

        {/* Fokus Pembelajaran Box */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Fokus Pembelajaran</h3>
                <span className="text-[10px] text-slate-400 font-medium">Opsional</span>
              </div>
              <p className="text-xs text-slate-500">Arahan pembelajaran khusus untuk periode ini.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
            {selectedPeriodId === 2
              ? 'Fokus pada pemahaman fault-tolerance sistem pembayaran dan standarisasi pelaporan sprint mingguan.'
              : 'Belum ada fokus pembelajaran khusus untuk periode ini.'}
          </div>
        </div>

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ====================== SUB-VIEW: EVALUASI BULANAN ======================
  if (subView === 'evaluasi') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        {/* Header with back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Evaluasi Bulanan</h1>
            <p className="text-xs text-slate-500 font-medium">
              Lihat hasil penilaian mentor untuk setiap periode magang.
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <button
            onClick={handlePrevPeriod}
            disabled={periodIndex === 0}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h4 className="font-bold text-slate-800 text-sm">{currentPeriodObj.name}</h4>
            <p className="text-[11px] text-slate-500 font-mono">
              {currentPeriodObj.startDate} - {currentPeriodObj.endDate}
            </p>
          </div>
          <button
            onClick={handleNextPeriod}
            disabled={periodIndex === periods.length - 1}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Evaluation Card */}
        {periodEvaluation ? (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Penilaian Mentor</h3>
                  <p className="text-xs text-slate-500">
                    Diselesaikan oleh{' '}
                    <strong className="text-slate-700">{periodEvaluation.mentorName}</strong> pada{' '}
                    {periodEvaluation.completedAt}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {periodEvaluation.status}
              </span>
            </div>

            {/* Score Legend */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700 px-4">
              <span>
                <strong className="text-blue-600">SB</strong> = Sangat Baik
              </span>
              <span>
                <strong className="text-emerald-600">B</strong> = Baik
              </span>
              <span>
                <strong className="text-amber-600">C</strong> = Cukup
              </span>
              <span>
                <strong className="text-rose-600">K</strong> = Kurang
              </span>
            </div>

            {/* Matrix Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="grid grid-cols-12 bg-slate-50/80 p-2.5 text-xs font-bold text-slate-700 border-b border-slate-200">
                <div className="col-span-8">Aspek Penilaian</div>
                <div className="col-span-1 text-center">SB</div>
                <div className="col-span-1 text-center">B</div>
                <div className="col-span-1 text-center">C</div>
                <div className="col-span-1 text-center">K</div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {periodEvaluation.aspects.map((asp) => (
                  <div key={asp.id} className="grid grid-cols-12 p-2.5 items-center hover:bg-slate-50/50">
                    <div className="col-span-8 font-medium text-slate-800">{asp.aspect}</div>
                    <div className="col-span-1 text-center font-bold">
                      {asp.score === 'SB' ? (
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center font-black">
                          SB
                        </span>
                      ) : (
                        <span className="text-slate-300">SB</span>
                      )}
                    </div>
                    <div className="col-span-1 text-center font-bold">
                      {asp.score === 'B' ? (
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center font-black">
                          B
                        </span>
                      ) : (
                        <span className="text-slate-300">B</span>
                      )}
                    </div>
                    <div className="col-span-1 text-center font-bold">
                      {asp.score === 'C' ? (
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center font-black">
                          C
                        </span>
                      ) : (
                        <span className="text-slate-300">C</span>
                      )}
                    </div>
                    <div className="col-span-1 text-center font-bold">
                      {asp.score === 'K' ? (
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 inline-flex items-center justify-center font-black">
                          K
                        </span>
                      ) : (
                        <span className="text-slate-300">K</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capaian Kurikulum */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Capaian Kurikulum
              </h4>
              <div className="space-y-1.5">
                {periodEvaluation.curriculumAchievements.map((ca, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-0">
                    <span className="text-slate-700 font-medium">{ca.moduleName}</span>
                    <span className="font-bold text-blue-700">{ca.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Comment */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-1">
              <span className="text-xs font-bold text-amber-950">Komentar Mentor:</span>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed italic">
                &ldquo;{periodEvaluation.mentorComment}&rdquo;
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
            <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Belum Ada Evaluasi</h3>
            <p className="text-xs text-slate-500">
              Evaluasi untuk periode ini sedang berjalan dan akan diisi oleh mentor pada akhir periode.
            </p>
          </div>
        )}

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ====================== SUB-VIEW: UANG SAKU ======================
  if (subView === 'uang_saku') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        {/* Header with back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Uang Saku</h1>
            <p className="text-xs text-slate-500 font-medium">
              Lihat hasil pengajuan pembayaran uang saku dan rincian perhitungannya.
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <button
            onClick={handlePrevPeriod}
            disabled={periodIndex === 0}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h4 className="font-bold text-slate-800 text-sm">{currentPeriodObj.name}</h4>
            <p className="text-[11px] text-slate-500 font-mono">
              {currentPeriodObj.startDate} - {currentPeriodObj.endDate}
            </p>
          </div>
          <button
            onClick={handleNextPeriod}
            disabled={periodIndex === periods.length - 1}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {periodStipend ? (
          <div className="space-y-4">
            {/* Status Banner */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                periodStipend.submissionStatus === 'Diajukan' ||
                periodStipend.submissionStatus === 'Cair'
                  ? 'bg-emerald-50 border-emerald-200/90 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm">
                    {periodStipend.submissionStatus === 'Diajukan'
                      ? 'Pembayaran uang saku telah diajukan'
                      : periodStipend.submissionStatus === 'Cair'
                      ? 'Pembayaran uang saku telah dicairkan'
                      : 'Pembayaran uang saku belum diajukan'}
                  </h4>
                  {periodStipend.submissionStatus === 'Diajukan' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {periodStipend.submissionStatus !== 'Belum Diajukan'
                    ? `Diajukan oleh Mentor pada ${periodStipend.submittedAt}`
                    : 'Akan diajukan oleh mentor setelah periode selesai.'}
                </p>
              </div>
            </div>

            {/* Rincian Perhitungan */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Rincian perhitungan</h3>
                    <p className="text-[11px] text-slate-500">Periode {periodStipend.dateRange}</p>
                  </div>
                </div>
                <span className="text-lg font-black text-blue-600">
                  {Math.round((periodStipend.paidDays / (periodStipend.totalWorkingDays || 1)) * 100)}%
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Ringkasan pembayaran</div>
                <div className="text-base font-bold text-slate-800">
                  {periodStipend.paidDays} dari {periodStipend.totalWorkingDays} hari dibayar
                </div>
              </div>

              {/* Grid Dibayar vs Tidak Dibayar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">Dibayar</span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      {periodStipend.paidDays} hari
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-emerald-800">
                    <div className="flex justify-between">
                      <span>Kehadiran disetujui</span>
                      <strong>{periodStipend.approvedAttendanceDays} hari</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Izin dibayar</span>
                      <strong>{periodStipend.paidLeaveDays} hari</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-950">Tidak dibayar</span>
                    <span className="text-xs font-extrabold text-rose-700">
                      {periodStipend.unpaidDays} hari
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-rose-800">
                    <div className="flex justify-between">
                      <span>Tidak hadir</span>
                      <strong>{periodStipend.absentDays} hari</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Kehadiran ditolak</span>
                      <strong>{periodStipend.rejectedAttendanceDays} hari</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tanpa catatan</span>
                      <strong>{periodStipend.noRecordDays} hari</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Non-working days info */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
                <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">
                    {periodStipend.nonWorkingDays} tanggal tidak termasuk hari kerja
                  </strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hari libur nasional ({periodStipend.holidays} hari) dan jadwal libur posisi (
                    {periodStipend.positionOffDays} hari) tidak memengaruhi pembayaran.
                  </p>
                </div>
              </div>
            </div>

            {/* Rincian status per tanggal breakdown */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Rincian status per kategori</h4>
              <div className="divide-y divide-slate-100 text-xs text-slate-700">
                <div className="py-2.5 flex justify-between">
                  <span>Kehadiran disetujui</span>
                  <strong className="text-emerald-700 font-bold">
                    {periodStipend.approvedAttendanceDays} hari
                  </strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Izin dibayar</span>
                  <strong className="text-emerald-700 font-bold">
                    {periodStipend.paidLeaveDays} hari
                  </strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Izin tidak dibayar</span>
                  <strong>{periodStipend.unpaidLeaveDays} hari</strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Tidak hadir</span>
                  <strong>{periodStipend.absentDays} hari</strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Kehadiran ditolak</span>
                  <strong>{periodStipend.rejectedAttendanceDays} hari</strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Hari libur nasional</span>
                  <strong>{periodStipend.holidays} hari</strong>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Jadwal libur posisi</span>
                  <strong>{periodStipend.positionOffDays} hari</strong>
                </div>
              </div>
            </div>

            {/* Rekening Penerima */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Rekening penerima</h4>
                  <p className="text-[11px] text-slate-500">
                    Rekening yang digunakan saat uang saku diajukan
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Bank</span>
                  <strong className="text-slate-800">{periodStipend.bankName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Nomor rekening</span>
                  <strong className="font-mono text-slate-800">
                    {periodStipend.accountNumberMasked}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Nama pemilik</span>
                  <strong className="text-slate-800">{periodStipend.accountHolder}</strong>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * Perhitungan dan rekening mengikuti data saat Mentor mengajukan uang saku.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
            <Wallet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Data uang saku tidak ditemukan untuk periode ini.</p>
          </div>
        )}

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ====================== SUB-VIEW: SURVEI ======================
  if (subView === 'survei') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        {/* Header with back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Survei</h1>
            <p className="text-xs text-slate-500 font-medium">
              Bagikan pengalaman Anda untuk membantu peningkatan program magang.
            </p>
          </div>
        </div>

        {/* Locked state banner matching screenshot */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            Survei akan tersedia pada bulan terakhir masa magang
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Formulir evaluasi kepuasan program, mentoring, dan fasilitas akan terbuka secara otomatis
            pada Periode 6 (Januari - Februari 2027).
          </p>
        </div>

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ====================== MAIN MENU VIEW ======================
  return (
    <div className="space-y-4 pb-20 fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Perkembangan Magang
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Lihat kurikulum, evaluasi bulanan, pembayaran uang saku, dan survei program Anda.
        </p>
      </div>

      {/* Menu Options matching Screenshot 4 */}
      <div className="space-y-3">
        {/* 1. Kurikulum */}
        <div
          onClick={() => setSubView('kurikulum')}
          className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                Kurikulum
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <span>Kurikulum Magang dan Fokus Pembelajaran</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>

        {/* 2. Evaluasi Bulanan */}
        <div
          onClick={() => setSubView('evaluasi')}
          className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                Evaluasi Bulanan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <span>Penilaian Mentor per periode</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>

        {/* 3. Uang Saku */}
        <div
          onClick={() => setSubView('uang_saku')}
          className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                Uang Saku
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <span>Rincian pembayaran per periode</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>

        {/* 4. Survei */}
        <div
          onClick={() => setSubView('survei')}
          className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                Survei
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <span>Tersedia pada bulan terakhir magang</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>
      </div>

      <div className="pt-4 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
