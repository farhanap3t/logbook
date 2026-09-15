import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Download,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { ServerClock } from '../components/ServerClock';

interface GuideTopic {
  id: string;
  title: string;
  category: string;
  version: string;
  excerpt: string;
  content: React.ReactNode;
}

interface UserGuidePageProps {
  onBack: () => void;
}

export const UserGuidePage: React.FC<UserGuidePageProps> = ({ onBack }) => {
  const [selectedRole, setSelectedRole] = useState<'peserta' | 'mentor'>('peserta');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  const topics: GuideTopic[] = useMemo(
    () => [
      {
        id: 'mulai-di-sini',
        title: 'Panduan Peserta: Mulai di Sini',
        category: 'Mulai di sini',
        version: 'Versi 2026.09.10',
        excerpt:
          'Monev membantu Peserta menjalani kegiatan magang sehari-hari, mulai dari mencatat kehadiran dan aktivitas hingga melihat perkembangan pembelajaran.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Aplikasi <strong>Monev Magang BSI</strong> adalah sistem monitoring dan evaluasi terpadu
              untuk mendokumentasikan progres harian mahasiswa selama menjalani program magang kerja
              praktik di <strong>PT. Bank Syariah Indonesia Tbk</strong>.
            </p>
            <p>
              Panduan ini menjelaskan alur operasional, tata cara pengisian logbook harian yang sesuai
              standar penilaian mentor, serta pemanfaatan fitur-fitur utama sistem.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Menu Beranda
                </div>
                <p className="text-xs text-slate-500">
                  Pusat ringkasan informasi, status kartu hari ini, jam server WIB, pengumuman penting,
                  dan akses cepat ke pengisian laporan.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Menu Riwayat
                </div>
                <p className="text-xs text-slate-500">
                  Kalender kehadiran bulanan interaktif, penanda status warna, serta arsip lengkap logbook
                  harian yang telah diverifikasi mentor.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Menu Perkembangan
                </div>
                <p className="text-xs text-slate-500">
                  Silabus kurikulum magang, rincian 8 aspek evaluasi mentor per periode, dan transparansi
                  perhitungan uang saku.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Menu Akun
                </div>
                <p className="text-xs text-slate-500">
                  Data profil peserta, ekspor cetak lembar pengesahan logbook resmi (PDF), dan layanan
                  pengunduran diri mandiri.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'isi-laporan',
        title: 'Pengisian Laporan Harian & Validasi Karakter',
        category: 'Laporan Harian',
        version: 'Versi 2026.09.10',
        excerpt:
          'Ketahui aturan pengisian 3 kolom wajib, batas waktu harian 23:59 WIB, verifikasi koordinat GPS, dan unggah foto.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 text-sm block">Batas Waktu Pengisian</strong>
                Laporan harian harus dikirim sebelum pukul <strong>23:59 WIB</strong> pada hari kerja yang
                bersangkutan. Pengisian yang melewati batas waktu akan tercatat sebagai status tanpa catatan
                atau terlambat.
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Ketentuan Minimal 100 Karakter</h4>
              <p>
                Untuk menjamin akuntabilitas kegiatan magang, sistem menerapkan validasi ketat. Tombol{' '}
                <strong>Simpan dan Kirim</strong> hanya akan aktif jika 3 komponen berikut masing-masing
                telah mencapai minimal 100 karakter:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>
                  <strong>Uraian Aktivitas:</strong> Jelaskan secara spesifik apa saja tugas yang
                  dikerjakan, modul sistem yang diuji, atau pertemuan yang dihadiri.
                </li>
                <li>
                  <strong>Pembelajaran yang Diperoleh:</strong> Paparkan pemahaman konsep baru, proses
                  bisnis perbankan syariah, atau solusi teknis yang didapat.
                </li>
                <li>
                  <strong>Kendala yang Dialami:</strong> Tuliskan hambatan operasional serta inisiatif
                  pemecahan masalah yang telah Anda coba lakukan.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Verifikasi Lokasi GPS & Draf Otomatis</h4>
              <p>
                Saat membuka formulir, peramban akan meminta izin akses lokasi untuk memvalidasi posisi
                presensi kantor atau remote. Jika koneksi terputus saat mengetik, jangan khawatir: fitur{' '}
                <strong>Autosave Draft</strong> akan menyimpan ketikan Anda secara otomatis di memori
                perangkat.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'kalender-status',
        title: 'Arti Penanda Status Pada Kalender Presensi',
        category: 'Riwayat Kehadiran',
        version: 'Versi 2026.09.10',
        excerpt:
          'Penjelasan lengkap simbol dan warna status kehadiran pada kalender bulanan.',
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Kalender bulanan menggunakan sistem penanda visual agar Anda dapat memantau status persetujuan
              mentor secara seketika:
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-3 bg-slate-50/50 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-slate-900">Hadir Disetujui (Centang Hijau):</strong>
                  <span className="text-slate-600 block text-xs">
                    Laporan telah ditinjau dan disetujui penuh oleh mentor lapangan.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 flex items-center gap-3">
                <div className="w-3.5 h-1 bg-emerald-600 rounded-full shrink-0" />
                <div>
                  <strong className="text-slate-900">Izin Disetujui (Garis Hijau):</strong>
                  <span className="text-slate-600 block text-xs">
                    Pengajuan izin resmi telah disetujui mentor (eligible uang saku hingga batas kuota).
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-600 rotate-45 shrink-0" />
                <div>
                  <strong className="text-slate-900">Menunggu Tindakan Mentor (Belah Ketupat Biru):</strong>
                  <span className="text-slate-600 block text-xs">
                    Laporan sudah terkirim oleh Anda dan sedang berada dalam antrean evaluasi mentor.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full border border-slate-400 shrink-0" />
                <div>
                  <strong className="text-slate-900">Belum Diisi (Lingkaran Abu-Abu):</strong>
                  <span className="text-slate-600 block text-xs">
                    Hari kerja aktif yang belum memiliki catatan laporan harian.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 flex items-center gap-3">
                <div className="w-3 h-3 bg-slate-700 rounded-2xs shrink-0" />
                <div>
                  <strong className="text-slate-900">Hari Libur (Kotak Gelap):</strong>
                  <span className="text-slate-600 block text-xs">
                    Akhir pekan, hari libur nasional, atau libur penugasan divisi.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'uang-saku-evaluasi',
        title: 'Kebijakan Uang Saku & Matrix Evaluasi Mentor',
        category: 'Perkembangan & Benefit',
        version: 'Versi 2026.09.10',
        excerpt:
          'Formula perhitungan hari dibayar, batas cuti 3 hari berbayar, dan matrix 8 aspek evaluasi bulanan.',
        content: (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
              <strong className="font-bold text-sm block mb-1">
                Aturan 3 Hari Izin Berbayar (Eligible Stipend)
              </strong>
              Peserta berhak memperoleh izin berbayar hingga maksimal 3 hari per periode. Izin ke-4 dan
              seterusnya tidak dibayarkan, namun tidak akan menyebabkan sanksi pemutusan program magang.
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Matrix 8 Aspek Penilaian Mentor</h4>
              <p>
                Pada akhir setiap periode bulanan, mentor lapangan melakukan evaluasi performa kerja
                berdasarkan 8 aspek utama dengan standar nilai SB (Sangat Baik), B (Baik), C (Cukup), dan K
                (Kurang):
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-600">
                <li>Kehadiran dan disiplin kerja</li>
                <li>Sikap, etika, dan perilaku profesional</li>
                <li>Kemampuan komunikasi interpersonal dan tim</li>
                <li>Inisiatif dan rasa tanggung jawab terhadap tugas</li>
                <li>Kemampuan adaptasi terhadap budaya perbankan syariah</li>
                <li>Pengetahuan teknis IT dan eksekusi tugas</li>
                <li>Produktivitas dan ketepatan waktu penyelesaian tiket</li>
                <li>Kerja sama dan kontribusi dalam divisi</li>
              </ol>
            </div>
          </div>
        ),
      },
      {
        id: 'ekspor-resmi',
        title: 'Cetak Laporan Logbook Resmi & Lembar Pengesahan',
        category: 'Dokumen & Akun',
        version: 'Versi 2026.09.10',
        excerpt:
          'Cara mengekspor dokumen buku logbook ber-kop resmi untuk pelaporan kampus.',
        content: (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Di akhir masa kerja praktik, Anda diwajibkan menyerahkan berkas laporan aktivitas magang yang
              telah disahkan kepada fakultas atau perguruan tinggi asal.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" />
                Langkah Mencetak Dokumen Logbook:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-600">
                <li>Buka menu <strong>Akun</strong> di aplikasi.</li>
                <li>
                  Klik tombol <strong>Cetak Dokumen Logbook Resmi Sekarang</strong>.
                </li>
                <li>
                  Kotak dialog cetak peramban akan terbuka otomatis. Pilih printer atau opsi{' '}
                  <strong>"Save as PDF"</strong>.
                </li>
                <li>
                  Dokumen akan tersusun rapi dengan Kop Resmi BSI, data identitas, tabel rekapitulasi, serta
                  tiga kolom tanda tangan: <em>Peserta Magang</em>, <em>Dosen Pembimbing Kampus</em>, dan{' '}
                  <em>Mentor Lapangan BSI</em>.
                </li>
              </ol>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.excerpt.toLowerCase().includes(q)
    );
  }, [topics, searchQuery]);

  const currentTopic = filteredTopics[activeTopicIndex] || topics[0];

  const handleNextTopic = () => {
    if (activeTopicIndex < filteredTopics.length - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
    }
  };

  const handlePrevTopic = () => {
    if (activeTopicIndex > 0) {
      setActiveTopicIndex(activeTopicIndex - 1);
    }
  };

  const handlePrintGuide = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-20 fade-in">
      {/* Top Header with back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          title="Kembali ke Akun"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Panduan Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Pelajari alur Monev sesuai dengan akses peran Anda.
          </p>
        </div>
      </div>

      {/* Role Pill Selector */}
      <div className="p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs flex">
        <button
          onClick={() => setSelectedRole('peserta')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            selectedRole === 'peserta'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Peserta
        </button>
        <button
          onClick={() => setSelectedRole('mentor')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            selectedRole === 'mentor'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Mentor Lapangan
        </button>
      </div>

      {/* Search & Topic Selector Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveTopicIndex(0);
            }}
            placeholder="Cari topik panduan..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
          />
        </div>

        <div className="sm:col-span-5">
          <select
            value={currentTopic.id}
            onChange={(e) => {
              const idx = filteredTopics.findIndex((t) => t.id === e.target.value);
              if (idx >= 0) setActiveTopicIndex(idx);
            }}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
          >
            {filteredTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.category}: {t.title.split(':')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Guide Content Card matching screenshot */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
        {/* Top Card Meta & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            <span className="text-slate-400 capitalize">{selectedRole}</span> /{' '}
            <span className="text-blue-700 font-semibold">{currentTopic.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTopicIndex(0)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Panduan lengkap
            </button>

            <button
              onClick={handlePrintGuide}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 border border-blue-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF
            </button>
          </div>
        </div>

        {/* Title & Version */}
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {currentTopic.title}
          </h2>
          <span className="text-[11px] font-mono font-semibold text-slate-400 mt-1 inline-block">
            {currentTopic.version}
          </span>
        </div>

        {/* Body content */}
        <div className="pt-1">{currentTopic.content}</div>

        {/* Footer Navigation (Sebelumnya / Berikutnya) */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {activeTopicIndex > 0 ? (
            <button
              onClick={handlePrevTopic}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 group"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-normal">Sebelumnya</span>
                <span>{filteredTopics[activeTopicIndex - 1]?.title.split(':')[0]}</span>
              </div>
            </button>
          ) : (
            <div />
          )}

          {activeTopicIndex < filteredTopics.length - 1 && (
            <button
              onClick={handleNextTopic}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group text-right ml-auto"
            >
              <div>
                <span className="text-[10px] text-blue-400 block font-normal">Berikutnya &rarr;</span>
                <span>{filteredTopics[activeTopicIndex + 1]?.title.split(':')[0]}</span>
              </div>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Clock */}
      <div className="pt-2 text-center">
        <ServerClock />
      </div>
    </div>
  );
};
