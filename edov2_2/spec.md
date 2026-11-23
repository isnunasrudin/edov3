# Spec — EDO v2 Public Frontend

## 1. Konteks
Project: `edov2_2` — Laravel 13, Inertia 3, Vue 3.5, Tailwind CSS 4, Vite 8.
Frontend dashboard internal sudah ada. Sekarang menambahkan frontend publik lengkap berdasarkan menu dan konten `v2.pelajartrenggalek.or.id`, memakai design system EDO yang sudah ada.

## 2. Tujuan
1. Halaman publik yang lengkap: Beranda, Fitur, Pengkaderan, Statistik Pimpinan, Hubungi Kami, EDOPedia.
2. Auth publik: Masuk, Buat Akun, Lupa Sandi.
3. Statistik Pimpinan publik dengan ringkasan dan checklist kelengkapan PAC.
4. Integrasi navigasi ke dashboard internal (`/dashboard/*`).
5. Konsisten dengan design system: Plus Jakarta Sans, JetBrains Mono, palet biru, double-bezel card, floating header, motion spring, dark mode.

## 3. Di luar cakupan
- Autentikasi nyata, session guard, OAuth Google, Cloudflare Turnstile.
- API/model/controller/migration.
- Data real-time; semua data publik adalah contoh.
- Konten EDOPedia (hanya tautan ke wiki).
- Build production/git.

## 4. Peta halaman & konten

### 4.1 Public Home `/`
Section berurutan:
1. **Hero** (`#home`)
   - Banner EDOPedia: “EDOPedia: Ensiklopedia Digital IPNU & IPPNU Pertama” + tombol “Eksplorasi”.
   - Eyebrow: “Pengalaman Baru”.
   - H1: “Ekosistem Digital Organisasi (EDO)”.
   - Subjudul: “PC IPNU-IPPNU Trenggalek”.
   - Deskripsi singkat ekosistem.
   - CTA: “Buat Akun” → `/register`, “Masuk” → `/login`.
   - Visual: preview dashboard mengambang + logo EDO + orbit/glass.
2. **Statistik singkat**
   - Anggota 4.812 · Kader 862 · Pimpinan 360 · PAC 21.
3. **Pengkaderan** (`#pengkaderan`)
   - Heading “Pengkaderan”.
   - Kartu agenda program (MAKESTA/PKLT) dari data dummy + CTA masuk untuk detail.
   - Catatan jadwal dapat berubah.
4. **Fitur** (`#features`)
   - Heading “Fitur Baru Tersedia” / “Dan akan terus bertambah…”.
   - 6 kartu:
     1. Impersonate — “Gunakan akun Anda untuk mewakili pimpinan Anda.”
     2. Kelola Pimpinan — “Atur administrasi dan masa khidmat/bakti pimpinan.”
     3. Data Keanggotaan — “Kelola data anggota/pengurus secara terstruktur.”
     4. Sinkronisasi SISTA & Sirekan — “Data anggota terintegrasi secara Nasional.”
     5. Kartu Tanda Anggota — “Miliki KTA bernomor induk anggota.”
     6. EDOPedia — “Akses berbagai informasi tentang IPNU & IPPNU.”
   - Bento asimetris; ikon pastel; tautan masuk untuk fitur internal, toast untuk fitur “segera”, tautan wiki untuk EDOPedia.
5. **Quote**
   - Carousel manual (prev/next, tanpa autoplay).
   - Tokoh: KH. Ahmad Mustofa Bisri, KH. M. Hasyim Asy’ari, dll.
6. **CTA akhir**
   - “Siap membangun organisasi yang lebih rapi?” + Buat Akun/Masuk.
7. **Footer**
   - Navigasi publik, akses, kontak WhatsApp, alamat sekretariat.
   - Badge **SHEDOW Security Hub** — “oleh PC IPNU-IPPNU Trenggalek”.
   - Copyright.

### 4.2 Statistik Pimpinan `/statistik/pimpinan`
1. Header: badge “Data Publik”, label “KAB. TRENGGALEK”, H1 “Statistik Pimpinan”, deskripsi.
2. Tiga kartu level:
   - PAC (IPNU 10 / IPPNU 11)
   - PK (IPNU 2 / IPPNU 2)
   - PR (IPNU 39 / IPPNU 38)
3. Card **Kelengkapan Pimpinan**:
   - Total 360, Lengkap 60, Perlu dilengkapi 300, Kelengkapan 17% (ring).
4. **Checklist kelengkapan**:
   - Legenda/filter status: Lengkap, Perlu dilengkapi, Masa Tenggang, Expired, Duplikat, Beririsan.
   - Pencarian pimpinan/ketua.
   - Tabel expandable per PAC: Pimpinan, Periode, Ketua, Kekurangan, Status, Persentase PR/PK.
   - Baris anak PR/PK muncul saat expand.
   - Data 21 PAC (10 IPNU, 11 IPPNU).
5. Footer publik.

### 4.3 Auth
- `/login`
  - Kredensial: Email / No. WhatsApp.
  - Kata sandi + show/hide.
  - Tetap masuk.
  - Lupa sandi → `/reset-pass`.
  - Masuk (demo → `/dashboard`).
  - Lanjutkan dengan Google (demo toast).
  - “Belum punya akun? Buat akun” → `/register`.
- `/register`
  - Nama lengkap.
  - Email / No. WhatsApp.
  - Jenis kelamin (segmented Laki-laki/Perempuan).
  - Kata sandi + hint min. 8.
  - Persetujuan PD & PRT.
  - Buat Akun (demo → `/login`).
  - “Sudah punya akun? Masuk”.
- `/reset-pass`
  - Email / No. WhatsApp.
  - Kirim tautan reset (demo toast).
  - Kembali ke masuk.

### 4.4 Dashboard
Pindah ke:
```
/dashboard
/dashboard/persuratan
/dashboard/anggota
/dashboard/anggota/:id
/dashboard/pimpinan
/dashboard/pimpinan/:id
/dashboard/kaderisasi
/dashboard/kaderisasi/:id
/dashboard/jenis-jabatan
/dashboard/alamat
```
Semua link internal, search result, dan redirect login demo diperbarui. Nama pimpinan dan anggota di tabel menjadi tautan ke halaman detail; ikon mata juga membuka detail. Modal edit di list Data Anggota dihapus; edit biodata hanya lewat form inline Detail Anggota, sedangkan modal list hanya untuk tambah anggota.

Dashboard **Kaderisasi** `/dashboard/kaderisasi`:
- Statistik kader + alur jenjang.
- Tabel **Event Pengkaderan** dengan pencarian, filter tipe, paginasi.
- Kolom: nama event + tipe/fullname, pelaksana, tanggal pelaksanaan + durasi, peserta, pendaftaran, aksi.
- Form event: tipe Formal/Non-Formal; jenjang formal atau nama kegiatan; pelaksana pimpinan atau eksternal; tanggal mulai + durasi; tempat; logo; rentang pendaftaran; kuota internal/eksternal; paksa pendaftaran.
- Status event diturunkan dari tanggal/rentang pendaftaran (Pendaftaran/Dijadwalkan/Berjalan/Selesai), bukan field manual.
- Aksi: buka detail, ubah, hapus; tombol **Buat Event**.

Detail event `/dashboard/kaderisasi/:id`:
- Hero event: logo, tipe, status, fullname, pelaksana, tanggal, durasi; stat peserta/kuota/sisa.
- Tab **Kegiatan**: satu form inline untuk tipe, jenjang, pelaksana, tanggal & waktu, durasi, tempat, logo, rentang pendaftaran, kuota internal/eksternal, dan paksa pendaftaran; tombol Hapus Event.
- Tab **Peserta**: contoh peserta terdaftar + tautan profil.
- Tab **Materi & Nilai** hanya menampilkan matriks nilai peserta × materi dan rata-rata.
- Tombol **Atur Materi** membuka modal manajemen materi (tambah, ubah, hapus, status, urutan); modal langsung tertutup setelah materi disimpan.
- Jika materi belum ada, nilai terkunci dan tombol Atur Materi tetap tersedia; tidak ada editor materi inline di tab.
- Tab **Administrasi**: edit inline nama berkas, status unggah, catatan; tambah/hapus.
- Link pendaftaran ditempatkan di cover kanan (hero); timeline dan kartu penyelenggara dihapus.
- Tab tersisa: Kegiatan, Peserta, Materi, Nilai, Administrasi.
- Tidak menggunakan modal untuk mengedit event atau modul detail; hanya pembuatan event dari tabel yang memakai modal.
- Komponen `DateRangePicker` reusable mendukung rentang tanggal, tanggal tunggal, dan waktu opsional; dipakai pada tanggal kegiatan dan rentang pendaftaran.

### 4.5 Detail pimpinan & anggota
#### 4.5.1 Pimpinan `/dashboard/pimpinan/:id`
- Hero: logo EDO, level, organisasi, status, nama, wilayah, dan periode.
- Statistik: jumlah pengurus, periode, jabatan, organisasi.
- Tab **Biodata**: kelompok **Identitas** (organisasi, level, wilayah, induk, status), **Pimpinan harian** (ketua, sekretaris, periode, jumlah pengurus, nomor SK), dan alamat sekretariat; tombol **Ubah Data**.
- Tab **Periode**: tabel periode dengan kolom periode, rentang, status, jumlah jabatan, dan aksi ubah/hapus; tombol **Tambah Periode**. Penghapusan ditolak bila masih ada jabatan.
- Tab **Keanggotaan**: tabel anggota dengan checkbox seleksi, kolom anggota, jabatan, periode, status, dan aksi ubah/lepas; tombol **Tambah Pengurus** serta **Pindah Periode** massal.
- Dialog keanggotaan: anggota, pimpinan (konteks), periode, jabatan dari referensi jenis jabatan, status; opsi **Sebagai anggota** hanya untuk PK & PR; filter banom.
- Empty state “Pimpinan tidak ditemukan” + tautan kembali.

#### 4.5.2 Anggota `/dashboard/anggota/:id`
- Hero: foto/inisial, nama, nama panggilan, NIA, organisasi, status, jenjang, PAC.
- Statistik: pendidikan, jabatan, pimpinan terkait, progres kelengkapan.
- Tab **Biodata** berupa **form inline dua kolom**:
  - Kolom identitas: nama, panggilan, NIK (masked + toggle), gender segmented, NIA, organisasi, PAC, status, jenjang, tahun gabung.
  - Kolom domisili & profil: alamat dari referensi wilayah, RT/RW/dusun, tempat/tanggal lahir, hobi, foto profil.
  - Validasi inline, error summary, fokus ke field pertama yang salah, status dirty, tombol **Batalkan/Simpan Biodata**.
  - Foto profil mendukung unggah lokal (maks. 2 MB) dan tampil di hero.
- Tab **Pendidikan**: institusi, jenjang, jurusan, tahun, alamat, status.
- Tab **Keanggotaan**: jabatan, pimpinan, periode, tanggal, status; tombol **Tambah**, ubah, dan lepas.
- Dialog keanggotaan: pilih pimpinan (filter banom), periode, jabatan dari referensi, status; opsi **Sebagai anggota** untuk PK/PR; jenis Anggota default hanya muncul di PR/PK.
- Tab **Pimpinan**: pimpinan unik tempat anggota menjabat; kartu menuju detail pimpinan.
- Empty state “Anggota tidak ditemukan” + tautan kembali.

### 4.6 Dashboard data master
- **Jenis Jabatan** `/dashboard/jenis-jabatan`
  - CRUD referensi jenis jabatan IPNU & IPPNU.
  - Field: organisasi, kode, nama, grup, tipe (Pengurus/Anggota), hanya PR/PK, aktif, urutan.
  - **Anggota default wajib ada** per organisasi; tidak dapat dihapus, dinonaktifkan, atau diubah nama/tipe/organisasinya.
  - Tipe Anggota otomatis **hanya untuk PR/PK**.
  - Kode dan nama unik per organisasi; jenis yang sudah dipakai penugasan tidak dapat dihapus.
  - Rename jenis memperbarui nama pada penugasan terkait.
- **Alamat** `/dashboard/alamat`
  - CRUD wilayah bertingkat dengan **tree**: provinsi → kabupaten/kota → kecamatan → desa/kelurahan.
  - Tambah provinsi, tambah turunan dari baris tree, ubah, hapus.
  - Node yang masih punya turunan tidak dapat dihapus.
  - Pencarian menampilkan node yang cocok beserta leluhurnya.
  - Pilihan alamat pada form anggota/pimpinan memakai referensi ini.
- **Periode, Penugasan, dan Pendidikan tidak memiliki halaman master terpisah.**
  - Halaman `/dashboard/periode`, `/dashboard/jabatan`, dan `/dashboard/pendidikan` dihapus.
  - Data relasinya tetap tersedia di detail pimpinan dan detail anggota.
- **SearchSelect** dipakai pada form relasi surat/anggota/pimpinan/program dan filter anggota/pimpinan.
- **ConfirmModal** untuk semua aksi hapus/lepas: surat, anggota, pimpinan, program, periode, keanggotaan, jenis jabatan, dan alamat.
- Cascading delete untuk entity editable:
  - anggota → pendidikan + jabatan
  - pimpinan → periode + jabatan
- Data periode/jabatan/pendidikan tidak memiliki halaman master; cascade tetap mengikuti entity induk (anggota/pimpinan).
- Pengelolaan kontekstual dari detail pimpinan: tambah/ubah/hapus periode dan pindah periode anggota.
- Pengelolaan kontekstual dari detail anggota/pimpinan: attach, detach, dan modifikasi keanggotaan.

### 4.7 Dashboard layanan
- **Impersonate** `/dashboard/impersonate`
  - Daftar pimpinan PC/PAC/PK/PR; pencarian; filter organisasi.
  - Konfirmasi modal “Masuk sebagai pimpinan?”.
  - Banner mode impersonate demo + tombol keluar.
- **Sinkronisasi SISTA & Sirekan** `/dashboard/sinkronisasi`
  - Metrik total/cocok/perlu verifikasi/terakhir sinkron.
  - Kartu sumber SISTA & Sirekan; aksi sinkron (demo), status, record.
  - Tabel riwayat sinkronisasi.
- **Kartu Tanda Anggota** `/dashboard/kta`
  - Pemilih anggota (cari/filter), preview KTA digital dengan QR/barcode.
  - Aksi cetak/unduh demo.
- **EDOPedia** — tautan eksternal di grup nav “Layanan”.
- Nav sidebar: grup **Layanan** berisi Impersonate, Sinkronisasi, Kartu Anggota, EDOPedia.

## 5. Komponen
| Komponen | Fungsi |
|---|---|
| `PublicLayout.vue` | Ambient, header, main, footer, toast, skip link |
| `PublicHeader.vue` | Floating nav, mobile menu, auth, theme |
| `PublicFooter.vue` | Navigasi, kontak, SHEDOW badge |
| `SectionHeading.vue` | Eyebrow/judul/deskripsi/actions |
| `FeatureCard.vue` | Kartu fitur dengan tone ikon |
| `HeroPreview.vue` | Mockup dashboard untuk hero |
| `QuoteCard.vue` | Quote + navigasi manual |
| `CompletenessRing.vue` | Ring persentase conic-gradient |
| `PacChecklistRow.vue` | Baris PAC expandable + child rows |
| `AuthBrandHeader.vue` | Brand header untuk halaman auth |
| `Register.vue`, `ResetPassword.vue` | Halaman auth baru |
| `Login.vue` | Update kredensial, Google, link |
| `Dashboard/Impersonate.vue` | Simulasi mewakili pimpinan |
| `Dashboard/Sinkronisasi.vue` | Status & aksi sinkron SISTA/Sirekan |
| `Dashboard/Kta.vue` | Pemilih anggota + preview KTA digital |
| `SearchSelect.vue` | Combobox searchable untuk relasi |
| `ConfirmModal.vue` | Konfirmasi hapus/lepas data |
| `Dashboard/PimpinanDetail.vue` | Detail pimpinan: hero, biodata, periode, keanggotaan |
| `Dashboard/AnggotaDetail.vue` | Detail anggota: form biodata, pendidikan, keanggotaan, pimpinan |
| `Dashboard/Kaderisasi.vue` | Statistik kader + tabel program kaderisasi dengan CRUD |
| `Dashboard/KaderisasiDetail.vue` | Detail event: hero + link pendaftaran, tabs, peserta, materi, nilai, administrasi |
| `DateRangePicker.vue` | Date picker reusable: rentang, tanggal tunggal, waktu opsional |
| `KaderisasiEventForm.vue` | Form inline edit event + pendaftaran |
| `KaderisasiMateriForm.vue` | Editor materi yang dipakai di modal Atur Materi |
| `KaderisasiNilaiForm.vue` | Matriks nilai peserta × materi |
| `KaderisasiMateriModal.vue` | Modal manajemen materi; nilai terkunci sampai materi tersedia |
| `KaderisasiAdministrasiForm.vue` | Editor inline administrasi event |
| `ProgramFormModal.vue` | Form event kaderisasi: tipe, jenjang, pelaksana, durasi, logo, pendaftaran |
| `AnggotaBiodataForm.vue` | Form biodata inline dua kolom, foto, validasi, dirty state |
| `KeanggotaanFormModal.vue` | Attach/ubah keanggotaan; pimpinan, periode, jabatan dari referensi |
| `MasaKhidmatFormModal.vue` | Tambah/ubah masa khidmat dari detail pimpinan |
| `MovePeriodeModal.vue` | Pindah periode massal pengurus terpilih |
| `JenisJabatanFormModal.vue` | CRUD referensi jenis jabatan + aturan PR/PK |
| `AlamatFormModal.vue` | Tambah/ubah node alamat bertingkat |
| `AlamatTreeNode.vue` | Render tree alamat rekursif |
| `Dashboard/JenisJabatan.vue` | CRUD jenis jabatan |
| `Dashboard/Alamat.vue` | CRUD alamat berbentuk tree |

## 6. Data frontend (`data/public.js`)
- `publicFeatures` — 6 fitur.
- `publicQuotes` — minimal 3 quote.
- `publicLevelSummary` — PAC/PK/PR + IPNU/IPPNU.
- `publicCompleteness` — 360/60/300/17%.
- `pacStats` — 21 baris PAC:
  ```ts
  {
    id, org: 'IPNU'|'IPPNU', nama, periode, ketua,
    status: 'Lengkap'|'Perlu dilengkapi'|'Masa Tenggang'|'Expired'|'Duplikat'|'Beririsan',
    percent, complete, total, shortages: string[],
    children: { id, level:'PR'|'PK', nama, periode, ketua, status, percent, complete, total }[]
  }
  ```
- `publicStats` — angka hero/stats strip.
- `data/master.js` — opsi institusi, jenjang pendidikan, status.
- `data/reference.js` — seed jenis jabatan (termasuk Anggota default), tree alamat, dan referensi pengkaderan formal.
- `seedPrograms` — tipe, nama, jenjang/fullName, pelaksana internal/eksternal, tanggal, durasi, tempat, logo, peserta, kuota internal/eksternal, rentang/paksa pendaftaran, materi, nilai, dan administrasi.
- `data/relations.js` — seed periode, jabatan, pendidikan (referensi read-only).
- Store `dashboard` — array relasional + CRUD/cascade untuk surat, anggota, pimpinan, program.
- Store relasi: `attachJabatan`, `updateJabatan`, `detachJabatan`, `attachPeriode`, `updatePeriode`, `detachPeriode`.
- Store referensi: CRUD `jenisJabatan`, CRUD `alamat`, `alamatPath`, `addressOptions`; `deleteJenisJabatan` melindungi default dan referensi yang sudah dipakai.
- Anggota menyimpan identitas: `nickname`, `gender`, `rt`, `rw`, `dusun`, `nik`, `hobi`, `generalId`, `generalCard`, `progress`.
- Master reference data tidak memiliki tombol CRUD di halaman master; pengelolaan periode/keanggotaan dilakukan dari detail.

## 7. Design & UX
- Layout publik maksimum `max-w-7xl` dengan padding `px-4 sm:px-6 lg:px-8`.
- Header publik berupa floating pill (`sticky top-3`, `rounded-full`, blur) seperti dashboard.
- Card double-bezel; radius 1.5rem.
- Tombol pill + nested trailing icon untuk CTA utama.
- Section spacing `py-16 sm:py-24`.
- Dark mode memakai token yang sama; kontras AA.
- Reveal `v-reveal`; stagger; hover lift.
- Tidak ada autoplay carousel.
- Mobile-first; navigasi mobile berupa panel di bawah header.
- Semua target sentuh ≥44px.
- Tabel statistik: `overflow-x-auto`, caption sr-only.
- Halaman detail memakai hero gradient, stat tile, tab, dan kartu relasi; judul entitas memakai `h2` agar tetap satu `h1` per halaman.
- Form biodata anggota memakai layout dua kolom (identitas / domisili & profil) dengan separator vertikal di desktop, satu kolom di mobile, dan action bar di bawah form.
- Halaman data referensi memakai badge “Referensi”, tanpa tombol tambah/ubah/hapus.
- Aksi keanggotaan memakai ikon ubah/lepas, checkbox seleksi, dialog konfirmasi, dan toast.
- Masa khidmat memakai label dinamis: **Masa Khidmat** (IPNU) / **Masa Bakti** (IPPNU).
- Alamat memakai tree rekursif dengan indentasi, badge tingkat, kode wilayah, jumlah turunan, dan aksi tambah/ubah/hapus.
- Jenis Jabatan memakai badge Default/Hanya PR/PK dan proteksi hapus pada data default.

## 8. Aksesibilitas
- Satu `h1` per halaman.
- Label form terlihat; error inline + ringkasan error fokus.
- `aria-expanded` untuk menu mobile & baris checklist.
- `aria-pressed` untuk gender/status filter.
- `aria-live` untuk toast/hasil.
- Fokus ring terlihat; skip link.
- `prefers-reduced-motion`.
- Link eksternal memakai `target="_blank"` + `rel="noopener noreferrer"`.

## 9. Kriteria penerimaan
- [x] `/` menampilkan home publik lengkap.
- [x] Nav Beranda/Fitur/Pengkaderan scroll ke section yang benar.
- [x] `/statistik/pimpinan` menampilkan ringkasan + checklist + expand.
- [x] `/login`, `/register`, `/reset-pass` berfungsi sebagai UI dengan validasi.
- [x] Login demo mengarah ke `/dashboard`.
- [x] Dashboard lama tetap berfungsi di `/dashboard/*`.
- [x] Halaman Impersonate, Sinkronisasi, dan KTA dapat diakses dari sidebar Layanan.
- [x] Halaman Jenis Jabatan dan Alamat tersedia di grup Data Master dengan CRUD.
- [x] Default Anggota wajib ada dan aturan hanya PR/PK diterapkan pada form keanggotaan.
- [x] Alamat ditampilkan sebagai tree dan CRUD menjaga integritas parent/child.
- [x] Halaman Periode, Penugasan, dan Pendidikan dihapus dari Data Master; data relasinya tetap dipakai di detail.
- [x] Event kaderisasi ditampilkan sebagai tabel dengan pencarian, filter tipe, paginasi, dan aksi buka detail/ubah/hapus.
- [x] Detail event pengkaderan memiliki hero dengan link pendaftaran di kanan, tab kegiatan/peserta/materi/nilai/administrasi; timeline dan penyelenggara dihapus.
- [x] Edit event, materi, nilai, administrasi, dan pengaturan dilakukan inline seperti Data Anggota, bukan modal.
- [x] Pengaturan pendaftaran digabung ke tab Kegiatan agar lebih ringkas.
- [x] DateRangePicker reusable tersedia untuk rentang tanggal, tanggal tunggal, dan waktu.
- [x] Materi dan Nilai digabung dalam satu tab; tab hanya menampilkan nilai, sedangkan seluruh manajemen materi ada di modal Atur Materi.
- [x] Form event memakai field v2: tipe, jenjang/kegiatan, pelaksana, tanggal + durasi, logo, dan pengaturan pendaftaran.
- [x] Detail pimpinan menampilkan biodata terkelompok, tabel periode, dan tabel keanggotaan.
- [x] Detail anggota menampilkan form biodata inline dua kolom, pendidikan, keanggotaan, dan pimpinan terkait.
- [x] Modal edit di list Data Anggota dihapus; list hanya menyediakan tambah, detail, dan hapus.
- [x] Keanggotaan dapat ditambah, diubah, dilepas, dan dipindahkan periodenya.
- [x] Masa khidmat dapat ditambah, diubah, dan dihapus dari detail pimpinan.
- [x] Nama/ikon mata di list pimpinan dan anggota membuka halaman detail.
- [x] CRUD surat/anggota/pimpinan/program mendukung edit dan hapus.
- [x] SearchSelect dipakai pada form relasi dan filter anggota/pimpinan.
- [x] Keyboard SearchSelect diuji: Enter membuka, pencarian, ArrowDown, Enter memilih, Escape/Tab menutup.
- [x] Dark mode, mobile 390px, tanpa horizontal scroll halaman.
- [x] Tidak ada build/git dijalankan.
