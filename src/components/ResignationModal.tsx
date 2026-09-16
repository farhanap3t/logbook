import React, { useState } from 'react';
import { X, AlertOctagon, UploadCloud, CheckCircle2 } from 'lucide-react';

interface ResignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  companyName: string;
}

export const ResignationModal: React.FC<ResignationModalProps> = ({
  isOpen,
  onClose,
  userName,
  companyName,
}) => {
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [letterUploaded, setLetterUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !effectiveDate) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Pengajuan Pengunduran Diri
              </h3>
              <p className="text-xs text-slate-500">Logbook Magang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Permohonan Telah Diajukan</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Pengajuan pengunduran diri atas nama <strong>{userName}</strong> dari program magang di{' '}
              <strong>{companyName}</strong> telah diteruskan ke PIC Divisi HC & Pembimbing Lapangan.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-2 px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Selesai & Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              Pengunduran diri bersifat permanen dan memerlukan persetujuan dari Mentor Lapangan serta
              Dosen Pembimbing Akademik.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan Pengunduran Diri <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tuliskan alasan pengunduran diri secara objektif..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Efektif Berhenti <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unggah Surat Resmi Bertanda Tangan (PDF/Gambar)
              </label>
              <label className="p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <UploadCloud className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-600">
                  {letterUploaded ? '✓ Berkas surat telah dipilih' : 'Pilih file surat pengunduran diri'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={() => setLetterUploaded(true)}
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!reason || !effectiveDate}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Kirim Pengajuan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
