# 📘 Logbook — Sistem Pencatatan & Pemantauan Aktivitas (Enterprise PRD)

Aplikasi web **Logbook** modern, terstruktur, responsif, dan siap langsung online via **GitHub Pages**. Dibangun berdasarkan spesifikasi formal **Product Requirement Document (PRD) LOGBOOK** dengan standar arsitektur korporat yang bersih, efisien, dan sepenuhnya bebas dari *AI slop*.

---

## 🌐 Demo Online (GitHub Pages)

Aplikasi ini dapat diakses secara langsung melalui tautan GitHub Pages:
**[https://farhanap3t.github.io/logbook/](https://farhanap3t.github.io/logbook/)**

---

## ✨ Fitur Sesuai Spesifikasi PRD

### 1. Manajemen Hak Akses Pengguna (Role-Based Access Control - Bagian 6)
- **User**: Membuat, melihat, mengubah, dan menghapus logbook miliknya sesuai ketentuan.
- **Supervisor**: Memantau logbook user di bawah cakupan dan melakukan pengawasan.
- **Admin**: Mengelola seluruh data, konfigurasi, dan audit trail logbook.
- **Viewer**: Mode hanya baca (*read-only*).
- *Tersedia Role Switcher interaktif di bilah atas untuk pengujian seluruh skenario hak akses secara langsung.*

### 2. Daftar Logbook & Tampilan Responsif (FR-02, Mockup Bagian 29)
- **Tabel Enterprise**: Kolom No., Tanggal, Logbook ID (`LB-000001`), Judul/Aktivitas, Kategori, Status, Indikator Lampiran, Pembuat & Waktu Buat, serta Tombol Aksi.
- **Tampilan Kartu Mobile**: Tata letak otomatis menyesuaikan pada layar ponsel atau tablet.
- **Paginasi Fleksibel (Bagian 5.1 & 24)**: Opsi 10, 25, atau 50 baris per halaman dengan kontrol navigasi halaman.

### 3. Pencarian & Penyaringan Lengkap (Bagian 15 & 16, AC-06, AC-07)
- **Multi-field Search**: Pencarian instan berdasarkan Judul Aktivitas, Logbook ID, Deskripsi, atau Pembuat.
- **Pesan Kondisi Kosong**: Menampilkan pesan terstandarisasi PRD: *"Data logbook tidak ditemukan."*
- **Filter Bar PRD**:
  - Rentang Tanggal: `Tanggal [ Dari ] - [ Sampai ]`
  - Kategori (9 kategori resmi): *Meeting, Development, Testing, Monitoring, Analysis, Documentation, Issue/Incident, Maintenance, Other*
  - Status (5 status siklus): *Draft, Submitted, In Progress, Completed, Cancelled*
  - Tombol **Filter** & **Reset**.

### 4. Pengurutan Data (Sorting - Bagian 17)
- Pengurutan berdasarkan: Tanggal, Waktu Pembuatan (*Created Date*), Waktu Pembaruan (*Updated Date*), atau Judul Aktivitas.
- Default: Data terbaru ditampilkan paling atas.

### 5. Tambah & Ubah Logbook (Bagian 9, 10, 11, 13, 21)
- Penomoran otomatis ID: `LB-000001`, `LB-000002`, dst.
- **Validasi Mandatory Field**: Tanggal, Judul Aktivitas, Kategori, Deskripsi, dan Status wajib terisi. Jika belum lengkap, sistem menampilkan notifikasi: *"Mohon lengkapi seluruh field yang wajib diisi."*
- **Business Rule BR-07**: Logbook yang telah berstatus `Completed` terkunci dari pengeditan (tombol edit nonaktif dengan ikon gembok proteksi).

### 6. Lampiran / Attachment Bukti Aktivitas (Bagian 19, AC-08)
- Mendukung upload file bukti pekerjaan (PDF, PNG, JPG, DOCX, ZIP).
- Validasi ukuran file (maksimal 5MB).
- Opsi pratinjau, unduh, dan hapus berkas sebelum disimpan.

### 7. Hapus Logbook & Soft Delete (Bagian 14)
- Dialog konfirmasi modal: *"Apakah Anda yakin ingin menghapus logbook ini?"* dengan pilihan **Batal** dan **Hapus**.
- Menerapkan mekanisme *soft-delete* agar rekam jejak penghapusan tetap terdokumentasi dalam audit trail.

### 8. Audit Trail Sistem (Bagian 22, BR-08, BR-09, AC-09)
- Setiap aktivitas pembuatan, perubahan (status, judul, kategori), dan penghapusan otomatis dicatat lengkap dengan:
  - Logbook ID
  - Waktu perubahan
  - Aksi (*Create / Edit / Delete*)
  - Field yang diubah
  - Nilai lama (*Old Value*)
  - Nilai baru (*New Value*)
  - Pengguna yang melakukan perubahan (*Changed By*)
- Riwayat audit dapat dilihat per logbook pada modal detail, maupun secara global melalui tombol **Audit Trail** di header.

### 9. Pencadangan Data Lokal (Backup & Restore)
- Fitur ekspor berkas cadangan JSON (`Download JSON`).
- Fitur impor data JSON (`Upload JSON`).
- Tombol reset ke data contoh awal.

---

## 🛠️ Arsitektur & Teknologi

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (Clean Neutral Palette Slate/Zinc, zero tacky neon AI slop)
- **Icons**: Lucide React
- **Storage Layer**: LocalStorage persisten dengan service pattern reaktif
- **Deployment**: GitHub Actions (`.github/workflows/deploy.yml`) & GitHub Pages

---

## 🚀 Menjalankan Secara Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/farhanap3t/logbook.git
   cd logbook
   ```

2. **Pasang dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka URL lokal yang muncul (default: `http://localhost:5173/`).

4. **Kompilasi build produksi**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy Otomatis ke GitHub Pages

Setiap kali kode didorong ke branch `main`, GitHub Actions akan menjalankan workflow `.github/workflows/deploy.yml` untuk melakukan build dan mempublikasikan versi terbaru ke GitHub Pages secara otomatis tanpa konfigurasi manual tambahan.
