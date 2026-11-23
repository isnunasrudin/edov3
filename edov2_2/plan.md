# Plan — EDO v2 Public Frontend

## Tujuan
Membangun frontend publik EDO v2 di project Laravel + Inertia + Vue yang sudah ada, mengikuti menu dan konten dari `v2.pelajartrenggalek.or.id`, dengan design system EDO yang sudah dipakai dashboard.

## Batasan
- Frontend saja. Tidak membuat model, controller, migration, atau API.
- Tidak menjalankan `npm run build` (dev server + HMR sudah berjalan via `composer run dev`).
- Tidak melakukan git operation.
- Data publik memakai dummy data frontend.
- Tidak menyalin persis styling situs lama; memakai design system EDO yang ada (Plus Jakarta Sans, biru, double-bezel, floating shell, dark mode).

## Inventaris menu dari situs acuan
| Menu | Perilaku situs | Rencana |
|---|---|---|
| Beranda | anchor `#home` | `/` → halaman publik |
| Fitur | anchor `#features` | `/#features` |
| Pengkaderan | anchor `#pengkaderan` | `/#pengkaderan` |
| Statistik Pimpinan | `/statistik/pimpinan/` | `/statistik/pimpinan` |
| Hubungi Kami | WhatsApp | link eksternal `wa.me/6282233441765` |
| Masuk | `/login/` | `/login` (perbarui view) |
| Buat Akun | `/register/` | `/register` |
| EDOPedia | wiki eksternal | `https://wiki.pelajartrenggalek.or.id` |

## Route target
```
/                       Public/Home
/statistik/pimpinan     Public/StatistikPimpinan
/login                  Auth/Login
/register               Auth/Register
/reset-pass             Auth/ResetPassword
/dashboard              Dashboard/Ringkasan
/dashboard/persuratan   Dashboard/Persuratan
/dashboard/anggota      Dashboard/Anggota
/dashboard/anggota/{id} Dashboard/AnggotaDetail
/dashboard/pimpinan     Dashboard/Pimpinan
/dashboard/pimpinan/{id} Dashboard/PimpinanDetail
/dashboard/kaderisasi   Dashboard/Kaderisasi
/dashboard/kaderisasi/{id} Dashboard/KaderisasiDetail
/dashboard/impersonate  Dashboard/Impersonate
/dashboard/sinkronisasi Dashboard/Sinkronisasi
/dashboard/kta          Dashboard/Kta
/dashboard/jenis-jabatan Dashboard/JenisJabatan
/dashboard/alamat      Dashboard/Alamat
```

## Fase pekerjaan
1. **Dokumen & konten**
   - [x] Inventaris menu/konten situs acuan.
   - [x] `plan.md` + `spec.md`.
2. **Public shell**
   - [x] `PublicLayout.vue` (ambient, header, footer, toast).
   - [x] `PublicHeader.vue` (floating nav, mobile menu, auth, theme).
   - [x] `PublicFooter.vue` (nav, kontak, SHEDOW Security Hub).
3. **Halaman publik**
   - [x] Home: hero + EDOPedia banner + statistik singkat + pengkaderan + 6 fitur + quote + CTA.
   - [x] Statistik Pimpinan: ringkasan PAC/PK/PR, kelengkapan, checklist PAC expandable + filter.
4. **Auth**
   - [x] `AuthBrandHeader.vue`.
   - [x] Login: email/WhatsApp, Google demo, lupa sandi, daftar.
   - [x] Register: nama, email/WhatsApp, gender, password, persetujuan.
   - [x] Reset password.
5. **Integrasi route dashboard**
   - [x] Pindahkan dashboard ke `/dashboard/*`.
   - [x] Update sidebar, header title, search result routes, link internal.
6. **Dashboard layanan**
   - [x] Impersonate: daftar pimpinan PC/PAC/PK/PR + konfirmasi + banner demo.
   - [x] Sinkronisasi SISTA & Sirekan: status, metrik, aksi sinkron, log.
   - [x] Kartu Tanda Anggota: pemilih anggota, preview KTA, aksi cetak/unduh demo.
   - [x] Grup nav “Layanan” + tautan EDOPedia.
7. **QA**
   - [x] Desktop 1440, tablet, mobile 390.
   - [x] Dark/light.
   - [x] Keyboard/focus/ARIA.
   - [x] Tidak ada horizontal scroll halaman.
   - [x] Cek via dev server, **tanpa build**.

## File utama
```
resources/js/
├── Layouts/PublicLayout.vue
├── Components/Public/
│   ├── PublicHeader.vue
│   ├── PublicFooter.vue
│   ├── SectionHeading.vue
│   ├── FeatureCard.vue
│   ├── HeroPreview.vue
│   ├── QuoteCard.vue
│   ├── CompletenessRing.vue
│   └── PacChecklistRow.vue
├── Components/AuthBrandHeader.vue
├── Components/KeanggotaanFormModal.vue
├── Components/MasaKhidmatFormModal.vue
├── Components/MovePeriodeModal.vue
├── Components/JenisJabatanFormModal.vue
├── Components/AlamatFormModal.vue
├── Components/AlamatTreeNode.vue
├── Components/AnggotaBiodataForm.vue
├── Components/DateRangePicker.vue
├── Components/KaderisasiEventForm.vue
├── Components/KaderisasiMateriForm.vue
├── Components/KaderisasiNilaiForm.vue
├── Components/KaderisasiMateriModal.vue
├── Components/KaderisasiAdministrasiForm.vue
├── Pages/Public/
│   ├── Home.vue
│   └── StatistikPimpinan.vue
├── Pages/Dashboard/
│   ├── Impersonate.vue
│   ├── Sinkronisasi.vue
│   ├── Kta.vue
│   ├── PimpinanDetail.vue
│   ├── AnggotaDetail.vue
│   ├── Kaderisasi.vue
│   ├── KaderisasiDetail.vue
│   ├── JenisJabatan.vue
│   └── Alamat.vue
├── Pages/Auth/
│   ├── Login.vue (update)
│   ├── Register.vue
│   └── ResetPassword.vue
├── data/public.js
└── data/reference.js
```

## Deep CRUD & Relasi (bertahap)

### Fase 8 — Model data relasional
- [x] Tambah entitas `periode`, `jabatan`, `pendidikan`.
- [x] Relasi:
  - `periode` → `pimpinan`
  - `jabatan` → `anggota`, `pimpinan`, `periode`
  - `pendidikan` → `anggota`
  - `surat` / `program` → `pimpinan` (opsional)
- [x] Cascading delete entity editable: anggota → pendidikan/jabatan; pimpinan → periode/jabatan. Data referensi tidak punya tombol hapus sendiri; cascade hanya mengikuti entity induk.
- [x] Master options: alamat, institusi, jenjang pendidikan, jabatan, status.

### Fase 9 — Komponen pencarian relasi
- [x] `SearchSelect.vue`: searchable, keyboard, ARIA, teleported dropdown, clear.
- [x] `ConfirmModal.vue` untuk hapus dengan konfirmasi.
- [x] Pakai `SearchSelect` di form/filter: pimpinan induk, pimpinan terkait, PAC, alamat, filter pimpinan/anggota.

### Fase 10 — CRUD resource yang sudah ada
- [x] Surat: create/read/update/delete; relasi pimpinan opsional.
- [x] Anggota: tambah lewat modal; edit biodata inline di detail; read/delete; alamat; relasi pendidikan/jabatan.
- [x] Pimpinan: create/read/update/delete; parent pimpinan; alamat.
- [x] Program kaderisasi: tabel dengan pencarian/filter/paginasi; create/read/update/delete; relasi pimpinan opsional.

### Fase 11 — Halaman data referensi (dihapus)
- [x] Halaman **Periode**, **Penugasan**, dan **Pendidikan** dihapus dari Data Master.
- [x] Route, tautan sidebar, dan judul header untuk ketiga halaman dihapus.
- [x] Data periode/jabatan/pendidikan tetap tersedia sebagai relasi di detail pimpinan/anggota.
- [x] Grup Data Master kini hanya berisi **Jenis Jabatan** dan **Alamat**.

### Fase 12 — Halaman detail & sinkron
- [x] Detail pimpinan `/dashboard/pimpinan/:id`: hero + tab Biodata terkelompok (identitas/pimpinan harian/alamat), tabel Periode, tabel Keanggotaan.
- [x] Detail anggota `/dashboard/anggota/:id`: hero + form biodata inline + pendidikan + keanggotaan + pimpinan terkait.
- [x] Nama dan tombol mata di list pimpinan/anggota membuka halaman detail.
- [x] Modal edit dihapus dari list Data Anggota; edit hanya lewat form inline Detail Anggota.
- [x] Sidebar tetap aktif dan judul header menyesuaikan halaman detail.
- [x] Profil saya di menu akun membuka detail anggota.
- [x] Riwayat sinkronisasi: hapus log / bersihkan.

### Fase 13 — QA relasi
- [x] Tambah anggota/pimpinan lewat form; master memakai data referensi read-only.
- [x] Edit surat/anggota/pimpinan/program lewat form.
- [x] Hapus dengan ConfirmModal; cascade pada store untuk anggota/pimpinan.
- [x] SearchSelect dipakai di form/filter relasi.
- [x] Mobile 390 tanpa overflow pada halaman utama, detail, dan form biodata dua kolom.
- [x] Uji keyboard penuh SearchSelect: buka dengan Enter, cari, ArrowDown, Enter, Escape/Tab di form anggota, pimpinan, surat, program, dan filter periode/jabatan/pendidikan.

### Fase 14 — Mekanisme keanggotaan & masa khidmat (paritas v2)
- [x] Attach keanggotaan dari detail anggota: pilih pimpinan, periode, jabatan, status.
- [x] Attach keanggotaan dari detail pimpinan: pilih anggota, periode, jabatan, status.
- [x] Detach keanggotaan dari kedua detail dengan konfirmasi.
- [x] Modifikasi keanggotaan: pimpinan/anggota, periode, jabatan, status.
- [x] Opsi “Sebagai anggota” hanya untuk PK & PR; filter banom IPNU/IPPNU.
- [x] Tambah/ubah/hapus masa khidmat dari tab Periode detail pimpinan.
- [x] Pindah periode massal dari tab Keanggotaan pimpinan.
- [x] Ubah data pimpinan dari detail; biodata anggota memakai form inline dua kolom di tab Biodata.
- [x] Halaman Periode/Penugasan/Pendidikan dihapus; data relasinya tetap dipakai di detail.
- [x] QA: attach/detach/edit, migrasi, modal, keyboard, mobile 390, axe tanpa violation.

### Fase 15 — Data Master: jenis jabatan & alamat
- [x] Halaman `/dashboard/jenis-jabatan`: CRUD referensi jenis jabatan.
- [x] Default **Anggota** wajib ada untuk IPNU & IPPNU; tidak dapat dihapus/dinonaktifkan/di-rename.
- [x] Aturan `hanyaPrPk`: Anggota hanya muncul untuk PK/PR; tipe Anggota otomatis terkunci.
- [x] Validasi kode/nama unik per organisasi; jenis yang sudah dipakai penugasan tidak dapat dihapus.
- [x] Rename jenis jabatan ikut memperbarui nama pada penugasan yang memakai referensi tersebut.
- [x] `KeanggotaanFormModal` membaca pilihan jabatan dari referensi jenis jabatan, bukan daftar statis.
- [x] Halaman `/dashboard/alamat`: CRUD wilayah bertingkat dengan tampilan **tree**.
- [x] Tambah provinsi, tambah turunan per baris, ubah, hapus; hapus ditolak bila masih ada turunan.
- [x] Pilihan alamat pada form anggota & pimpinan memakai store alamat yang sama.
- [x] Menu “Penugasan” dihapus bersama halaman relasinya; grup Data Master hanya Jenis Jabatan & Alamat.
- [x] QA mobile tree, dark mode, axe, console bersih.

### Fase 16 — Kaderisasi (paritas v2)
- [x] Tabel event: Nama, Pelaksana, Tanggal Pelaksanaan, Peserta, Pendaftaran, Aksi.
- [x] Form event: tipe Formal/Non-Formal, jenjang formal atau nama kegiatan, pelaksana internal/eksternal, tanggal mulai + durasi, tempat, logo.
- [x] Pendaftaran peserta: rentang tanggal, kuota internal/eksternal, paksa buka.
- [x] Status event diturunkan dari tanggal/rentang pendaftaran; tidak diedit manual.
- [x] Manajemen tabel: buat, buka detail, ubah, hapus.
- [x] Pencarian, filter tipe, paginasi.
- [x] Public home menyesuaikan field event baru.
- [x] Halaman detail event `/dashboard/kaderisasi/:id`: hero + link pendaftaran di cover kanan, kegiatan & pendaftaran (satu form), peserta, materi, nilai, administrasi.
- [x] Edit event, materi, nilai, administrasi, dan pengaturan dilakukan inline (tanpa modal), mengikuti pola form Data Anggota.
- [x] Tab Pengaturan digabung ke Kegiatan; pengaturan pendaftaran menjadi bagian dari form inline kegiatan.
- [x] Tab Materi & Nilai hanya menampilkan nilai; seluruh CRUD materi dipindah ke modal **Atur Materi**.
- [x] Nilai terkunci sampai materi tersedia; tombol Atur Materi tersedia di tab dan empty state.
- [x] Modal Atur Materi langsung tertutup setelah materi disimpan.
- [x] `DateRangePicker` reusable untuk rentang tanggal, tanggal tunggal, dan waktu.
- [x] Pencil pada tabel Kaderisasi membuka detail; modal hanya untuk pembuatan event baru.

### Fase 17 — QA ditunda
Sesuai arahan, QA tidak dijalankan pada iterasi ini. Daftar berikut disimpan sebagai rencana:

- [ ] Regression `DateRangePicker`: rentang, tanggal tunggal, waktu, preset, keyboard, dan mobile.
- [ ] Regression merge **Kegiatan + Pendaftaran**: simpan event, status, tautan, dan kuota.
- [ ] Regression merge **Materi + Nilai**: tab hanya nilai, modal Atur Materi, unlock nilai, dan sinkronisasi tabel materi.
- [ ] Regression link pendaftaran di cover: tampilan buka/tutup dan salin tautan.
- [ ] Regression inline editor kegiatan/materi/nilai/administrasi.
- [ ] Regression layout Detail Pimpinan: tab Biodata, tabel Periode, tabel Keanggotaan, selection/pindah periode.
- [ ] Regression logo Pimpinan di hero: box putih 1:1, logo contained/tidak overflow, proporsi dan kontras aman.
- [ ] Cek ulang dark mode, axe, console, dan Vite overlay.
- [ ] Cek build production saat diizinkan.


## Risiko & keputusan
- **Route `/` sekarang publik**, dashboard dipindah ke `/dashboard`. Semua link internal dashboard wajib diperbarui.
- **Statistik Pimpinan** memakai data kurasi dari halaman publik acuan; angka tidak real-time.
- **Google login & Turnstile** hanya UI/prototipe; tidak ada integrasi.
- **Fitur dashboard** tersedia di grup nav Layanan (Impersonate, Sinkronisasi, KTA); kartu publik mengarah ke `/login`.
- **Quote** memakai carousel manual (bukan autoplay) agar aman untuk reduced motion.
- **Halaman Data Master:** hanya Jenis Jabatan dan Alamat. Halaman Periode/Penugasan/Pendidikan dihapus; data relasinya tetap dipakai di detail pimpinan/anggota.
- **Detail pimpinan/anggota memakai route dinamis** dan membaca store frontend; belum ada API.
- **Mekanisme mengikuti source `../../edo-mono`:** dialog jabatan/keanggotaan, filter banom, is_anggota PK/PR, migrasi periode, dan pengelolaan masa khidmat di detail pimpinan.
- **Dev HMR** adalah satu-satunya verifikasi visual; tidak build.

## Definisi selesai
- Semua menu publik acuan tersedia dan bisa diakses.
- Halaman publik responsif, dark mode, dan konsisten dengan dashboard.
- Form login/register/reset tervalidasi dan memberi feedback.
- Dashboard tetap berfungsi setelah pindah ke `/dashboard/*`.
- Pimpinan/anggota punya halaman detail dengan biodata + relasi.
- Keanggotaan bisa ditambah, diubah, dilepas, dan dipindahkan periodenya.
- Masa khidmat bisa ditambah/diubah/dihapus dari detail pimpinan.
- Grup Data Master hanya Jenis Jabatan & Alamat.
- Tidak ada build/git yang dijalankan.
