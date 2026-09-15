# 📘 Monev Magang BSI - Aplikasi Web Logbook Aktivitas & Presensi Harian

Aplikasi web pemantauan aktivitas magang (Monev Logbook) modern, responsif, dan siap langsung online via **GitHub Pages**. Dirancang dengan arsitektur UI/UX korporat profesional tanpa kesan *AI slop*, mengintegrasikan validasi presensi GPS riil, counter minimal 100 karakter, kurikulum magang, evaluasi berkala mentor, transparansi perhitungan uang saku, hingga ekspor cetak buku logbook resmi.

---

## ✨ Fitur Utama

1. **🏠 Beranda Interaktif**:
   - Header profil peserta & instansi penempatan (*PT. Bank Syariah Indonesia Tbk*).
   - Jam operasional server real-time (WIB/GMT+7) dengan detik bergerak aktif.
   - Status kartu harian terpadu: pengingat batas pengisian pukul 23.59 WIB & status kehadiran.
   - Banner notifikasi kebijakan cuti/izin berbayar dan modal pusat pengumuman interaktif.
   - Ringkasan statistik kehadiran & pencapaian periode.

2. **📅 Riwayat Kehadiran & Kalender Aktivitas**:
   - Navigasi antar periode magang (Periode 1 s/d 6).
   - Kalender visual interaktif dengan status presensi lengkap (Hadir Disetujui, Izin, Tidak Hadir, Ditolak, Menunggu Mentor, Hari Libur Nasional & Libur Posisi).
   - Panel detail laporan per tanggal dengan catatan masukan dari mentor.

3. **📝 Formulir Logbook Harian Terstandarisasi**:
   - **Validasi Geolocation Real**: Mengambil koordinat GPS perangkat langsung via HTML5 Geolocation API dengan fallback otomatis.
   - **Validasi Kualitas Deskripsi (Minimal 100 Karakter)**:
     - Uraian Aktivitas (Real-time live counter & progress indicator).
     - Pembelajaran yang Diperoleh (Minimal 100 karakter).
     - Kendala yang Dialami & Solusi (Minimal 100 karakter).
   - Lampiran dokumentasi foto kegiatan (disimpan otomatis di local storage).
   - **Autosave Draft**: Draf pengisian tersimpan otomatis di browser agar tidak hilang jika tidak sengaja tertutup.
   - Efek animasi konfeti saat laporan berhasil diserahkan.

4. **📈 Perkembangan Magang**:
   - **Kurikulum & Modul**: Modul target harian/mingguan (Praktik, Teori, Proyek), deskripsi target kompetensi, dan arahan fokus pembelajaran khusus per periode.
   - **Evaluasi Bulanan**: Matrix 8 aspek penilaian profesional oleh Mentor (SB = Sangat Baik, B = Baik, C = Cukup, K = Kurang), capaian kurikulum, dan pesan evaluasi kualitatif mentor.
   - **Transparansi Uang Saku**: Ringkasan persentase hari dibayar (e.g. 21 dari 21 hari = 100%), rincian hari kerja vs hari libur posisi, serta rekening penerima terenkripsi.
   - **Survei Evaluasi**: Indikator survei program pada bulan terakhir magang.

5. **👤 Akun Peserta & Dokumen Resmi**:
   - Identitas peserta, status magang aktif, kontak PIC/mentor.
   - **Fitur Cetak Laporan Resmi (Print / PDF Export)**: Menghasilkan lembar pengesahan resmi ber-kop instansi dengan tanda tangan Peserta, Mentor Lapangan, dan Dosen Pembimbing Akademik.
   - Alur pengajuan pengunduran diri mandiri beserta upload surat.
   - Backup & restore data JSON serta tombol reset data demo.
   - **Toggle Mode Mobile / Desktop**: Memungkinkan pengguna beralih antara tampilan simulasi aplikasi mobile dan layout desktop penuh.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18/19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons, Canvas Confetti
- **Storage Layer**: LocalStorage persisten dengan service pattern (siap dihubungkan ke backend REST / Supabase)
- **Deployment**: GitHub Actions + GitHub Pages (`.github/workflows/deploy.yml`)

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone atau buka folder proyek ini di terminal**:
   ```bash
   cd Project
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka URL lokal yang muncul di terminal (biasanya `http://localhost:5173/`).

3. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## 🌐 Cara Menghubungkan ke GitHub & Meng-online-kan (GitHub Pages)

Aplikasi ini telah dilengkapi konfigurasi **GitHub Actions** (`.github/workflows/deploy.yml`) dan base path relatif di `vite.config.ts`, sehingga siap di-deploy secara gratis ke GitHub Pages:

### Langkah 1: Buat Repository Baru di GitHub
1. Masuk ke akun [GitHub](https://github.com/) Anda.
2. Buat repository baru (misalnya dengan nama: `monev-magang-logbook`).
3. Pilih visibilitas **Public** dan jangan centang "Initialize with a README" (karena sudah kita sediakan).

### Langkah 2: Hubungkan Repository Lokal ke GitHub
Buka terminal di folder proyek ini dan jalankan perintah:

```bash
# Inisialisasi git jika belum
git init

# Tambahkan semua file dan buat commit pertama
git add .
git commit -m "feat: inisialisasi aplikasi web logbook magang bsi monev"

# Ubah nama branch utama ke main
git branch -M main

# Hubungkan dengan remote repository GitHub Anda (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git push -u origin main
```

### Langkah 3: Aktifkan GitHub Pages pada Repository
1. Di halaman repository GitHub Anda, buka menu **Settings** > **Pages** (di sidebar kiri).
2. Di bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
3. Workflow GitHub Actions yang sudah ada di folder `.github/workflows/deploy.yml` akan langsung otomatis melakukan build dan menerbitkan web Anda.
4. Dalam 1-2 menit, web logbook Anda sudah aktif di alamat:
   `https://USERNAME.github.io/REPO_NAME/`
