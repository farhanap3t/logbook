import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Paperclip, AlertCircle } from 'lucide-react';
import type {
  LogbookRecord,
  LogbookCategory,
  LogbookStatus,
  AttachmentFile,
} from '../types';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: {
    tanggal: string;
    judul: string;
    kategori: LogbookCategory;
    deskripsi: string;
    status: LogbookStatus;
    catatan?: string;
    attachment?: AttachmentFile;
  }) => void;
  initialData?: LogbookRecord | null;
  categories: LogbookCategory[];
  statuses: LogbookStatus[];
}

export const LogbookFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  statuses,
}) => {
  const isEditing = Boolean(initialData);

  const [tanggal, setTanggal] = useState<string>('');
  const [judul, setJudul] = useState<string>('');
  const [kategori, setKategori] = useState<LogbookCategory>('Development');
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [status, setStatus] = useState<LogbookStatus>('Submitted');
  const [catatan, setCatatan] = useState<string>('');
  const [attachment, setAttachment] = useState<AttachmentFile | undefined>(undefined);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize or reset form state
  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || '');
      setJudul(initialData.judul || '');
      setKategori(initialData.kategori || 'Development');
      setDeskripsi(initialData.deskripsi || '');
      setStatus(initialData.status || 'Submitted');
      setCatatan(initialData.catatan || '');
      setAttachment(initialData.attachment);
    } else {
      // Default to today's date YYYY-MM-DD
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      setTanggal(todayStr);
      setJudul('');
      setKategori('Development');
      setDeskripsi('');
      setStatus('In Progress');
      setCatatan('');
      setAttachment(undefined);
    }
    setValidationError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 5MB file size limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Ukuran file maksimal adalah 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAttachment({
        id: `att-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mandatory Field Validation according to PRD Section 10
    if (
      !tanggal.trim() ||
      !judul.trim() ||
      !kategori ||
      !deskripsi.trim() ||
      !status
    ) {
      setValidationError('Mohon lengkapi seluruh field yang wajib diisi.');
      return;
    }

    setValidationError(null);

    onSave({
      tanggal: tanggal.trim(),
      judul: judul.trim(),
      kategori,
      deskripsi: deskripsi.trim(),
      status,
      catatan: catatan.trim() || undefined,
      attachment,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isEditing ? `Ubah Logbook (${initialData?.id})` : 'Tambah Logbook Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Perbarui informasi aktivitas logbook Anda sesuai ketentuan.'
                : 'Lengkapi seluruh data mandatori bertanda bintang (*) untuk menyimpan logbook.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium text-xs">{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tanggal */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tanggal Aktivitas <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Kategori Aktivitas <span className="text-rose-500">*</span>
              </label>
              <select
                required
                aria-label="Pilih Kategori Aktivitas"
                value={kategori}
                onChange={(e) => setKategori(e.target.value as LogbookCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Judul Aktivitas */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Judul Aktivitas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: UAT Testing Modul Manajemen Logbook"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Status Logbook <span className="text-rose-500">*</span>
            </label>
            <select
              required
              aria-label="Pilih Status Logbook"
              value={status}
              onChange={(e) => setStatus(e.target.value as LogbookStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Alur status: Draft &rarr; Submitted &rarr; In Progress &rarr; Completed (atau Cancelled).
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Deskripsi Aktivitas <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan secara detail pekerjaan yang telah dilakukan, hasil yang dicapai, atau progres teknis..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 leading-relaxed"
            />
          </div>

          {/* Attachment Upload (PRD Section 19) */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Attachment / Dokumen Pendukung (Opsional)
            </label>
            {attachment ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 rounded-md bg-blue-100 text-blue-700">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden text-xs">
                    <p className="font-semibold text-slate-800 truncate">{attachment.name}</p>
                    <p className="text-[11px] text-slate-500">{formatFileSize(attachment.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  title="Hapus Attachment"
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700">Unggah berkas bukti aktivitas</span>
                <span className="text-[11px] text-slate-400">
                  Maksimal ukuran 5MB (PDF, PNG, JPG, DOCX, ZIP)
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.zip"
                />
              </label>
            )}
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Tambahkan catatan khusus, informasi kendala, atau referensi tiket..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Logbook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
