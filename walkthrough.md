# Walkthrough: Implementasi Logbook Berdasarkan PRD Resmi

Aplikasi web **Logbook** telah berhasil dirombak total dari nol sesuai dengan seluruh spesifikasi dokumen **Product Requirement Document (PRD) LOGBOOK** yang diberikan. Aplikasi dirancang dengan pendekatan antarmuka *Enterprise Web Application* profesional yang bersih, tajam, dan sepenuhnya bebas dari elemen *AI slop*.

Kode sumber telah terhubung ke GitHub dan otomatis ter-deploy ke GitHub Pages.

---

## 🌐 Tautan Online (Live Demo)
Aplikasi dapat langsung diakses dan diuji coba melalui tautan:
**[https://farhanap3t.github.io/logbook/](https://farhanap3t.github.io/logbook/)**

---

## 📋 Pemenuhan Spesifikasi Dokumen PRD

### 1. Role-Based Access Control (Bagian 6 & FR-01)
- **4 Role Terdefinisi**: `User`, `Supervisor`, `Admin`, `Viewer`.
- **Role Switcher Interaktif**: Terletak di bilah atas (*header*) sehingga penguji/evaluator dapat berganti peran secara langsung untuk menguji hak akses:
  - `User`: Hanya dapat melihat dan mengelola logbook miliknya.
  - `Supervisor`: Memantau seluruh logbook dalam cakupan.
  - `Admin`: Memiliki akses penuh termasuk mengedit status dan melihat audit trail global.
  - `Viewer`: Mode *read-only* (tombol tambah, edit, dan hapus disembunyikan/dinonaktifkan).

### 2. Daftar Logbook & Mockup Layout (Bagian 8, 28, & 29)
- **Tabel Data Terstruktur**:
  - Kolom: No, Tanggal, Logbook ID (`LB-000001`), Judul/Aktivitas, Kategori, Status, Lampiran, Pembuat & Waktu Buat, serta Tombol Aksi (Detail, Edit, Hapus).
- **Tampilan Kartu Mobile**: Responsif otomatis pada layar perangkat mobile.
- **Paginasi (Bagian 5.1 & 24)**: Opsi 10, 25, atau 50 data per halaman dengan navigasi halaman yang mulus.

### 3. Pencarian & Filter Multi-field (Bagian 15, 16, AC-06, AC-07)
- **Multi-field Search**: Pencarian instan mencakup Judul Aktivitas, Logbook ID, Deskripsi, dan Pembuat.
- **Pesan State Kosong**: Jika tidak ada data yang cocok, sistem menampilkan teks standar PRD:
  > *"Data logbook tidak ditemukan."*
- **Filter Bar PRD**:
  - Tanggal Mulai dan Tanggal Selesai (`[ Dari ] - [ Sampai ]`)
  - Dropdown Kategori (9 kategori: *Meeting, Development, Testing, Monitoring, Analysis, Documentation, Issue/Incident, Maintenance, Other*)
  - Dropdown Status (5 status: *Draft, Submitted, In Progress, Completed, Cancelled*)
  - Dropdown Pembuat (*Created By*)
  - Tombol **Filter** dan tombol **Reset**.

### 4. Pengurutan Data (Sorting - Bagian 17)
- Sortable kolom berdasarkan: Tanggal, Waktu Pembuatan (*Created Date*), Waktu Pembaruan (*Updated Date*), dan Judul Aktivitas.
- Default sorting: Data terbaru ditampilkan paling atas.

### 5. Formulir Tambah & Ubah Logbook (Bagian 9, 10, 11, 13, 21)
- **Penomoran Otomatis**: Generator ID berurutan (`LB-000001`, `LB-000002`, dst.).
- **Validasi Mandatory Field**:
  - `Tanggal *`, `Judul Aktivitas *`, `Kategori *`, `Deskripsi *`, `Status *`.
  - Jika belum lengkap, muncul pesan validasi: *"Mohon lengkapi seluruh field yang wajib diisi."*
- **Business Rule BR-07**: Logbook yang berstatus `Completed` terkunci dari perubahan (tombol edit berikon gembok dan dinonaktifkan untuk non-admin).

### 6. Lampiran / Attachment Bukti Aktivitas (Bagian 19, AC-08)
- Upload file bukti pekerjaan (PDF, gambar, dokumen, ZIP) hingga 5MB.
- Pratinjau nama file, ukuran berkas terformat (KB/MB), tombol unduh, dan opsi hapus sebelum menyimpan.

### 7. Hapus Logbook & Soft Delete (Bagian 14)
- Dialog konfirmasi modal: *"Apakah Anda yakin ingin menghapus logbook ini?"* dengan pilihan tombol **Batal** dan **Hapus**.
- Menerapkan *soft delete* agar riwayat audit trail tetap utuh untuk keperluan auditabilitas sistem.

### 8. Audit Trail Sistem (Bagian 22, BR-08, BR-09, AC-09)
- Setiap aktivitas `Create`, `Edit`, dan `Delete` otomatis dicatat ke riwayat audit trail dengan data:
  - Logbook ID, Waktu Perubahan, Aksi, Field yang diubah, Nilai lama, Nilai baru, dan Pengguna yang mengubah.
- Riwayat audit dapat dilihat per item di modal Detail maupun secara keseluruhan melalui tombol **Audit Trail** di header.

### 9. Notifikasi Toast (Bagian 20)
- *"Logbook berhasil dibuat."*
- *"Logbook berhasil diperbarui."*
- *"Logbook berhasil dihapus."*
- *"Mohon lengkapi seluruh field yang wajib diisi."*
