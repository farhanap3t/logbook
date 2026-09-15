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

  // ===================== SUB-VIEW: KURIKULUM =====================
  if (subView === 'kurikulum') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kurikulum</h1>
            <p className="text-xs text-slate-500">
              Lihat materi dan fokus pembelajaran untuk setiap periode magang.
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="rounded-xl bg-white border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <button
            onClick={handlePrevPeriod}
            disabled={periodIndex === 0}
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
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
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Curriculum List */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Kurikulum Magang</h2>
            </div>
            <span className="text-xs text-slate-500">{periodCurriculums.length} materi</span>
          </div>

          <div className="space-y-3">
            {periodCurriculums.map((mod) => (
              <div
                key={mod.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-2"
              >
                <h3 className="font-bold text-slate-800 text-sm">{mod.title}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {mod.type}
                  </span>
                  <span className="text-slate-500">{mod.month}</span>
                  <span className="text-slate-400">· {mod.duration}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fokus Pembelajaran */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Fokus Pembelajaran</h3>
            <span className="text-[10px] text-slate-400">Opsional</span>
          </div>
          <p className="text-xs text-slate-500">Arahan pembelajaran khusus untuk periode ini.</p>
          <div className="p-3.5 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 text-center">
            {selectedPeriodId === 2
              ? 'Fokus pada arsitektur microservices, automated testing, dan integrasi antar layanan.'
              : 'Belum ada fokus pembelajaran untuk periode ini.'}
          </div>
        </div>

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ===================== SUB-VIEW: EVALUASI BULANAN =====================
  if (subView === 'evaluasi') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Evaluasi Bulanan</h1>
            <p className="text-xs text-slate-500">
              Lihat hasil penilaian mentor untuk setiap periode magang.
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="rounded-xl bg-white border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <button
            onClick={handlePrevPeriod}
            disabled={periodIndex === 0}
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
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
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {periodEvaluation ? (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Penilaian Mentor</h3>
                  <p className="text-xs text-slate-500">
                    Diselesaikan oleh <strong>{periodEvaluation.mentorName}</strong> pada{' '}
                    {periodEvaluation.completedAt}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {periodEvaluation.status}
              </span>
            </div>

            {/* Score Legend */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex justify-between px-3">
              <span><strong>SB</strong> = Sangat Baik</span>
              <span><strong>B</strong> = Baik</span>
              <span><strong>C</strong> = Cukup</span>
              <span><strong>K</strong> = Kurang</span>
            </div>

            {/* Evaluation Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-50 p-2.5 font-bold text-slate-700 border-b border-slate-200">
                <div className="col-span-8">Aspek Penilaian</div>
                <div className="col-span-1 text-center">SB</div>
                <div className="col-span-1 text-center">B</div>
                <div className="col-span-1 text-center">C</div>
                <div className="col-span-1 text-center">K</div>
              </div>

              <div className="divide-y divide-slate-100">
                {periodEvaluation.aspects.map((asp) => (
                  <div key={asp.id} className="grid grid-cols-12 p-2.5 items-center hover:bg-slate-50">
                    <div className="col-span-8 text-slate-800">{asp.aspect}</div>
                    <div className="col-span-1 text-center font-bold text-blue-600">
                      {asp.score === 'SB' ? 'SB' : <span className="text-slate-300 font-normal">SB</span>}
                    </div>
                    <div className="col-span-1 text-center font-bold text-blue-600">
                      {asp.score === 'B' ? 'B' : <span className="text-slate-300 font-normal">B</span>}
                    </div>
                    <div className="col-span-1 text-center font-bold text-blue-600">
                      {asp.score === 'C' ? 'C' : <span className="text-slate-300 font-normal">C</span>}
                    </div>
                    <div className="col-span-1 text-center font-bold text-blue-600">
                      {asp.score === 'K' ? 'K' : <span className="text-slate-300 font-normal">K</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capaian Kurikulum */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-800">Capaian Kurikulum</h4>
              {periodEvaluation.curriculumAchievements.map((ca, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-slate-200/50 last:border-0">
                  <span className="text-slate-700">{ca.moduleName}</span>
                  <span className="font-semibold text-slate-900">{ca.score}</span>
                </div>
              ))}
            </div>

            {/* Komentar Mentor */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-900">Komentar Mentor</div>
              <p className="text-amber-800 leading-relaxed">&ldquo;{periodEvaluation.mentorComment}&rdquo;</p>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            Belum ada penilaian mentor untuk periode ini.
          </div>
        )}

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ===================== SUB-VIEW: UANG SAKU =====================
  if (subView === 'uang_saku') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Uang Saku</h1>
            <p className="text-xs text-slate-500">
              Lihat hasil pengajuan pembayaran uang saku dan rincian perhitungannya.
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="rounded-xl bg-white border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <button
            onClick={handlePrevPeriod}
            disabled={periodIndex === 0}
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
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
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {periodStipend && (
          <div className="space-y-3">
            {/* Status Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold flex items-center gap-1.5">
                  <span>Pembayaran uang saku telah diajukan</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-slate-600 mt-0.5">
                  Diajukan oleh Mentor pada {periodStipend.submittedAt}
                </p>
              </div>
            </div>

            {/* Rincian Perhitungan */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Rincian perhitungan</h3>
                    <p className="text-[11px] text-slate-500">Periode {periodStipend.dateRange}</p>
                  </div>
                </div>
                <span className="font-bold text-blue-600 text-base">100%</span>
              </div>

              <div>
                <span className="text-slate-500 text-xs block">Ringkasan pembayaran</span>
                <span className="font-bold text-slate-900 text-base">
                  {periodStipend.paidDays} dari {periodStipend.totalWorkingDays} hari dibayar
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="flex justify-between font-bold text-emerald-900">
                    <span>Dibayar</span>
                    <span>{periodStipend.paidDays} hari</span>
                  </div>
                  <div className="text-[11px] text-emerald-800 space-y-0.5 pt-1">
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

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="flex justify-between font-bold text-rose-900">
                    <span>Tidak dibayar</span>
                    <span>{periodStipend.unpaidDays} hari</span>
                  </div>
                  <div className="text-[11px] text-rose-800 space-y-0.5 pt-1">
                    <div className="flex justify-between">
                      <span>Tidak hadir</span>
                      <strong>{periodStipend.absentDays} hari</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Kehadiran ditolak</span>
                      <strong>{periodStipend.rejectedAttendanceDays} hari</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">
                    {periodStipend.nonWorkingDays} tanggal tidak termasuk hari kerja
                  </strong>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hari libur dan jadwal libur posisi tidak memengaruhi pembayaran.
                  </p>
                </div>
              </div>
            </div>

            {/* Rincian Status Per Tanggal */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Rincian status per tanggal</h4>
              <div className="divide-y divide-slate-100 text-slate-700">
                <div className="py-2 flex justify-between">
                  <span>Kehadiran disetujui</span>
                  <strong>{periodStipend.approvedAttendanceDays} hari</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Izin dibayar</span>
                  <strong>{periodStipend.paidLeaveDays} hari</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Izin tidak dibayar</span>
                  <strong>{periodStipend.unpaidLeaveDays} hari</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Tidak hadir</span>
                  <strong>{periodStipend.absentDays} hari</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Hari libur</span>
                  <strong>{periodStipend.holidays} hari</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span>Jadwal libur posisi</span>
                  <strong>{periodStipend.positionOffDays} hari</strong>
                </div>
              </div>
            </div>

            {/* Rekening */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-slate-600" />
                <h4 className="font-bold text-slate-900">Rekening penerima</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank</span>
                  <strong className="text-slate-800">{periodStipend.bankName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor rekening</span>
                  <strong className="font-mono text-slate-800">{periodStipend.accountNumberMasked}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama pemilik</span>
                  <strong className="text-slate-800">{periodStipend.accountHolder}</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                * Perhitungan dan rekening mengikuti data saat Mentor mengajukan uang saku.
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ===================== SUB-VIEW: SURVEI =====================
  if (subView === 'survei') {
    return (
      <div className="space-y-4 pb-20 fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubView('menu')}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Survei</h1>
            <p className="text-xs text-slate-500">
              Bagikan pengalaman Anda untuk membantu peningkatan program magang.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-2">
          <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Survei akan tersedia pada bulan terakhir masa magang
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Formulir survei akan aktif secara otomatis pada periode akhir masa magang.
          </p>
        </div>

        <div className="pt-2 text-center">
          <ServerClock />
        </div>
      </div>
    );
  }

  // ===================== MAIN MENU =====================
  return (
    <div className="space-y-4 pb-20 fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Perkembangan Magang
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Lihat kurikulum, evaluasi bulanan, pembayaran uang saku, dan survei program Anda.
        </p>
      </div>

      <div className="space-y-3">
        {/* 1. Kurikulum */}
        <div
          onClick={() => setSubView('kurikulum')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Kurikulum
              </h3>
              <p className="text-xs text-slate-500">Kurikulum Magang dan Fokus Pembelajaran</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
        </div>

        {/* 2. Evaluasi Bulanan */}
        <div
          onClick={() => setSubView('evaluasi')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Evaluasi Bulanan
              </h3>
              <p className="text-xs text-slate-500">Penilaian Mentor per periode</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
        </div>

        {/* 3. Uang Saku */}
        <div
          onClick={() => setSubView('uang_saku')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Uang Saku
              </h3>
              <p className="text-xs text-slate-500">Rincian pembayaran per periode</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
        </div>

        {/* 4. Survei */}
        <div
          onClick={() => setSubView('survei')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Survei
              </h3>
              <p className="text-xs text-slate-500">Tersedia pada bulan terakhir magang</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
        </div>
      </div>

      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
