import React from 'react';
import type { UserProfile, LogbookEntry, InternshipPeriod } from '../types';

interface LogbookPrintViewProps {
  profile: UserProfile;
  period: InternshipPeriod;
  entries: LogbookEntry[];
}

export const LogbookPrintView: React.FC<LogbookPrintViewProps> = ({
  profile,
  period,
  entries,
}) => {
  return (
    <div className="print-only p-8 text-black bg-white font-serif max-w-4xl mx-auto">
      {/* Official Universal Header */}
      <div className="border-b-2 border-black pb-4 text-center mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wider">
          Buku Laporan Aktivitas Harian (Logbook) Magang
        </h1>
        <h2 className="text-base font-bold uppercase text-slate-800 mt-1">
          {profile.company}
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Program Monitoring & Evaluasi (Monev) Praktik Kerja & Magang Mahasiswa
        </p>
      </div>

      {/* Student & Internship Profile Info */}
      <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-slate-300 p-4 rounded-sm">
        <div className="space-y-1">
          <div>
            <strong>Nama Peserta:</strong> {profile.name}
          </div>
          <div>
            <strong>Nomor Induk Mahasiswa:</strong> {profile.studentId}
          </div>
          <div>
            <strong>Perguruan Tinggi:</strong> {profile.universityName}
          </div>
          <div>
            <strong>Program Studi:</strong> {profile.major}
          </div>
        </div>
        <div className="space-y-1">
          <div>
            <strong>Posisi / Divisi:</strong> {profile.position}
          </div>
          <div>
            <strong>Lokasi Penempatan:</strong> {profile.placementLocation}
          </div>
          <div>
            <strong>Periode Laporan:</strong> {period.name} ({period.startDate} s/d {period.endDate})
          </div>
          <div>
            <strong>Mentor Lapangan:</strong> {profile.mentorName} ({profile.mentorEmail})
          </div>
        </div>
      </div>

      {/* Logbook Table */}
      <h3 className="text-sm font-bold uppercase mb-2">Rekapitulasi Catatan Aktivitas Harian</h3>
      <table className="w-full text-left text-xs border-collapse border border-black mb-8">
        <thead>
          <tr className="bg-slate-100 border-b border-black">
            <th className="border border-black p-2 w-10 text-center">No</th>
            <th className="border border-black p-2 w-24">Tanggal</th>
            <th className="border border-black p-2 w-20">Presensi</th>
            <th className="border border-black p-2">Uraian Aktivitas & Capaian</th>
            <th className="border border-black p-2 w-32">Status Verifikasi</th>
          </tr>
        </thead>
        <tbody>
          {entries.length > 0 ? (
            entries.map((entry, idx) => (
              <tr key={entry.id} className="border-b border-black align-top">
                <td className="border border-black p-2 text-center">{idx + 1}</td>
                <td className="border border-black p-2 font-mono whitespace-nowrap">{entry.date}</td>
                <td className="border border-black p-2 font-semibold">{entry.attendanceType}</td>
                <td className="border border-black p-2 space-y-1.5">
                  <div>
                    <strong>Aktivitas:</strong> {entry.activityDescription}
                  </div>
                  <div>
                    <strong>Pembelajaran:</strong> {entry.learnings}
                  </div>
                  <div>
                    <strong>Kendala & Solusi:</strong> {entry.challenges}
                  </div>
                </td>
                <td className="border border-black p-2 text-[11px]">
                  {entry.status === 'hadir_disetujui' ? (
                    <span className="text-emerald-700 font-bold">✓ Disetujui Mentor</span>
                  ) : (
                    <span className="text-slate-600">Menunggu Review</span>
                  )}
                  {entry.mentorFeedback && (
                    <div className="italic text-[10px] mt-1 text-slate-700">
                      "{entry.mentorFeedback}"
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border border-black p-4 text-center italic">
                Belum ada entri aktivitas pada periode ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Signature Section */}
      <div className="grid grid-cols-3 text-center text-xs mt-12 pt-6">
        <div>
          <p className="mb-16">
            Peserta Magang,
            <br />
            {profile.company}
          </p>
          <p className="font-bold underline">{profile.name}</p>
          <p>NIM. {profile.studentId}</p>
        </div>

        <div>
          <p className="mb-16">
            Mengetahui,
            <br />
            Dosen Pembimbing Kampus
          </p>
          <p className="font-bold underline">(............................................)</p>
          <p>NIP/NIDN.</p>
        </div>

        <div>
          <p className="mb-16">
            Menyetujui,
            <br />
            Mentor Lapangan
          </p>
          <p className="font-bold underline">{profile.mentorName}</p>
          <p>{profile.mentorEmail}</p>
        </div>
      </div>
    </div>
  );
};
