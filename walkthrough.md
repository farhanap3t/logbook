# Walkthrough: Logbook — Platform Pemantauan & Presensi Magang Modern

Aplikasi telah berhasil dirombak total menjadi platform **"Logbook"** yang universal (terlepas dari branding spesifik BSI) dengan tampilan antarmuka (*UI/UX*) modern berestetika SaaS profesional (mengadopsi *design system* ala Linear, Vercel, dan Raycast: glassmorphism, palet indigo-slate, progress meter dinamis, dan visualisasi metrik eksekutif).

Aplikasi terhubung langsung ke repository GitHub dan otomatis dideploy ke **GitHub Pages**.

---

## Ringkasan Perombakan & Fitur Baru

### 1. 🌟 Rebranding Universal
- **Nama Aplikasi**: Menjadi **Logbook Workspace** (bukan lagi Monev BSI).
- **Profil Perusahaan**: Menjadi *PT Inovasi Digital Nusantara* (dan dapat dikonfigurasi fleksibel di profil peserta).
- **Judul & Metadata**: Diperbarui di `index.html` dan seluruh dokumen cetak resmi.

### 2. 🎨 Perombakan Antarmuka (Modern UI Redesign)
- **Top Navigation Bar**:
  - Logo gradien modern dengan chip status *"Workspace"*.
  - Segmented control pills untuk navigasi desktop yang halus.
  - Floating bottom bar mobile bergaya *dark glassmorphism* dengan backdrop blur.
  - Widget jam server dengan *live sync pulse* neon hijau.
- **Dashboard (Beranda) Berestetika Tinggi**:
  - **Dark Hero Card**: Sambutan dengan latar belakang gradien slate-indigo yang elegan, indikator status magang aktif, serta ringkasan metrik 4 kuadran (Kehadiran, Izin Berbayar, Evaluasi Mentor, dan Rasio Uang Saku).
  - **Kartu Catatan Hari Ini**: Desain modern terpadu dengan countdown pengingat batas pengisian 23:59 WIB dan tombol gradien interaktif.
  - **Banner Kebijakan & Notifikasi**: Accordion chip yang bersih dan hemat ruang.
- **Presensi & Kalender Interaktif**:
  - Tanggal dengan indikator visual *modern badge pills* (Hadir, Izin, Alpha, Review, Libur).
  - Highlight tanggal aktif dengan border ring indigo.
  - Kartu catatan harian (*note card*) dengan pin lokasi GPS, kutipan masukan mentor, dan tombol edit laporan.
- **Formulir Laporan Harian Modern**:
  - Pemindai GPS dengan tombol *refresh* lokasi seketika.
  - **Dynamic Character Meter Bars**: Progress bar responsif (berubah warna dari merah &rarr; amber &rarr; hijau) saat mengetik menuju minimal 100 karakter pada ketiga bagian wajib.
  - Lampiran foto/dokumentasi kegiatan dengan drag-and-drop uploader.
  - Efek konfeti saat pengiriman sukses.
- **Perkembangan & Kompetensi**:
  - Segmented pill navigation (*Evaluasi Mentor*, *Kurikulum*, *Uang Saku*, *Survei*).
  - **Evaluasi Mentor**: Executive score card (skor 3.5 / 4.0) dengan *competency progress bars* per aspek penilaian dan kartu kutipan mentor ber-avatar.
  - **Uang Saku**: Kartu bergaya *fintech dashboard* dengan visual rasio hari dibayar dan rekening penerima.
- **Profil & Dokumen Resmi**:
  - Kartu *Passport ID* modern dengan rincian kampus dan kontak.
  - Tombol **Cetak Dokumen Logbook Resmi** (menghasilkan lembar pengesahan dan tabel rekapitulasi formal siap PDF).
  - Integrasi halaman **Panduan Pengguna (Knowledge Base)** interaktif dengan pencarian instan dan unduh PDF.

---

## Status Deployment GitHub Pages

- **Branch**: `main`
- **Workflow**: `.github/workflows/deploy.yml`
- **Alamat Online**: [https://farhanap3t.github.io/logbook/](https://farhanap3t.github.io/logbook/)

Setiap kali perubahan di-push ke branch `main`, GitHub Actions akan otomatis melakukan kompilasi dan memperbarui web online dalam 1–2 menit.
