# Design System: EDO v2 — Dashboard PC IPNU & IPPNU Trenggalek

> **Status:** Prototipe produksi internal · **Versi:** 2.0 · **Bahasa UI:** Indonesia
> **Source of truth:** `index.html` (token, komponen, dan perilaku aktual)
> **Dokumen ini:** acuan untuk manusia dan agen yang akan menambah halaman/komponen.

---

## 1. Visual Theme & Atmosphere

**Soft Structuralism bertemu editorial data density.**

Dashboard ini harus terasa seperti perangkat kerja yang tenang dan presisi: panel-panel mengambang di atas kanvas sejuk, garis hairline, bayangan menyebar lembut, dan satu aksen biru yang tegas. Bukan template admin generik, bukan pula landing page dekoratif.

| Dials | Nilai | Arti |
|---|---|---|
| Density | **7 / 10** | Cockpit dense; data banyak tetapi tetap lapang |
| Variance | **6 / 10** | Offset asimetris; grid 8/4 dan 7/5, bukan 3 kolom simetris |
| Motion | **6 / 10** | Fluid CSS; reveal bertahap, hover fisik, tanpa animasi berlebihan |

**Kata kunci atmosfer:** tenang, presisi, struktural, biru, bersih, mengambang, terpercaya.
**Yang harus terasa:** seperti instrumen organisasi modern — rapi, cepat dipindai, dan tidak melelahkan.
**Yang harus dihindari:** gradien neon, glassmorphism berlebihan, warna pastel acak, kartu bertumpuk tanpa alasan, dan kesan "template bootstrap".

---

## 2. Color Palette & Roles

Semua warna didefinisikan sebagai **RGB triplet** di CSS variable, lalu dipetakan ke Tailwind:

```css
--brand: 37 99 235;          /* dipakai sebagai rgb(var(--brand) / alpha) */
```

**Dilarang memakai hex mentah di komponen.** Gunakan kelas token: `bg-brand`, `text-muted`, `border-line/70`, dst.

### 2.1 Light Mode

| Token | Hex | Peran |
|---|---|---|
| `canvas` | `#F8FAFC` | Latar halaman |
| `surface` | `#FFFFFF` | Permukaan card, sidebar, header |
| `elevated` | `#F1F5F9` | Hover, sub-panel, tray double-bezel, badge netral |
| `line` | `#E2E8F0` | Garis struktural, border input, divider |
| `ink` | `#0F172A` | Teks utama, angka, judul |
| `muted` | `#475569` | Teks sekunder, metadata, label tabel |
| `brand` | `#2563EB` | Aksi utama, tautan, state aktif, focus ring |
| `brand-deep` | `#1D4ED8` | Hover aksi utama |
| `brand-soft` | `#EFF6FF` | Latar badge/chip aktif, tile ikon |
| `brand-fg` | `#FFFFFF` | Teks di atas `brand` |
| `accent` | `#B45309` | Peringatan / Diproses / Cuti / Kader Utama |
| `accent-soft` | `#FEF3C7` | Latar status peringatan |
| `success` | `#047857` | Selesai / Aktif / Berjalan |
| `success-soft` | `#D1FAE5` | Latar status sukses |
| `info` | `#0E7490` | Pendaftaran / IPPNU / Anggota |
| `info-soft` | `#CFFAFE` | Latar status informasi |
| `violet` | `#6D28D9` | Anggota Muda, aksen KPI |
| `violet-soft` | `#EDE9FE` | Latar aksen violet |
| `danger` | `#B91C1C` | Aksi destruktif, error |
| `danger-soft` | `#FEE2E2` | Latar error |
| `ring` | `#2563EB` | Outline fokus keyboard |

### 2.2 Dark Mode — `aura-dark-blue`

Dark mode **bukan inversi**. Palet diturunkan dari tema `aura-dark-blue` milik `v2.pelajartrenggalek.or.id`.

| Token | Hex | Peran |
|---|---|---|
| `canvas` | `#09090B` | Latar halaman (off-black, bukan `#000`) |
| `surface` | `#18181B` | Permukaan card/sidebar/header |
| `elevated` | `#27272A` | Hover, tray, sub-panel |
| `line` | `#27272A` | Garis struktural |
| `ink` | `#FFFFFF` | Teks utama |
| `muted` | `#A1A1AA` | Teks sekunder |
| `brand` | `#60A5FA` | Aksi utama (lebih terang di dark) |
| `brand-deep` | `#93C5FD` | Hover aksi utama |
| `brand-soft` | `#172554` | Latar aktif/badge |
| `brand-fg` | `#020617` | Teks di atas `brand` |
| `accent` | `#EAB308` | Peringatan |
| `accent-soft` | `#422006` | Latar peringatan |
| `success` | `#4ADE80` | Sukses |
| `success-soft` | `#064E3B` | Latar sukses |
| `info` | `#38BDF8` | Informasi |
| `info-soft` | `#082F49` | Latar informasi |
| `violet` | `#C084FC` | Aksen violet |
| `violet-soft` | `#3B0764` | Latar violet |
| `danger` | `#F87171` | Error |
| `danger-soft` | `#450A0A` | Latar error |
| `ring` | `#60A5FA` | Fokus keyboard |

### 2.3 Aturan Warna

- **Satu aksen utama:** biru. Tidak ada aksen kedua untuk CTA.
- **Semantik status wajib konsisten:**
  - `success` → Selesai, Aktif, Berjalan
  - `accent` → Diproses, Cuti, Kader Utama
  - `info` → Pendaftaran, IPPNU, Anggota
  - `violet` → Anggota Muda
  - `muted + elevated` → Menunggu, Non-aktif, Dijadwalkan
  - `danger` → error/destruktif saja
- **Jangan menyampaikan arti hanya lewat warna** — selalu ada teks/label status.
- **Kontras minimum:** 4.5:1 untuk teks normal, 3:1 untuk teks besar dan elemen non-teks.
- Pasangan utama yang sudah aman: `#0F172A` di `#FFFFFF` (≈17:1), `#475569` di `#FFFFFF` (≈7:1), `#FFFFFF` di `#2563EB` (≈5.2:1), `#60A5FA` di `#09090B` (≈8:1), `#A1A1AA` di `#18181B` (≈7:1).
- Jangan memakai `#000000`; gunakan `#09090B`.
- Jangan memakai glow neon atau gradient text.

---

## 3. Typography

### 3.1 Font Stacks

| Peran | Font | Fallback |
|---|---|---|
| UI / Body / Heading | **Plus Jakarta Sans** (300–800) | `ui-sans-serif, system-ui, sans-serif` |
| Data teknis / kode | **JetBrains Mono** (400–600) | `ui-monospace, monospace` |

Font diambil dari Google Fonts dengan `display=swap`. Bodynya memakai `font-feature-settings: "cv02","cv03","cv04","cv11"`.

**Banned:** Inter, Roboto, Arial, Helvetica, Open Sans, serif apa pun untuk dashboard.

### 3.2 Type Scale

| Peran | Kelas acuan | Size | Weight | Tracking / Line-height |
|---|---|---|---|---|
| Page title (header) | `text-sm font-bold` | 14px | 700 | normal |
| Judul section (h2) | `text-3xl sm:text-4xl` | 30 → 36px | 600 | `-0.035em` |
| Angka KPI | `text-[2rem]` | 32px | 600 | `-0.03em`, `tabular-nums` |
| Judul section/card | `text-sm font-bold` | 14px | 700 | normal |
| Body | `text-sm` | 14px | 400 | 1.5–1.625 |
| Metadata | `text-xs` | 12px | 400/500 | 1.5 |
| Micro-label | `text-[10px] uppercase` | 10px | 600 | `0.18em` |
| Table header | `text-[11px] uppercase` | 11px | 600 | `wider` |
| Badge | `text-[11px]` | 11px | 600 | normal |
| Tombol | `text-sm` | 14px | 500 | normal |
| Input/label | `text-sm` / `text-xs` | 14 / 12px | 400 / 600 | normal |

### 3.3 Aturan Tipografi

- Angka besar dan kolom data memakai **tabular numerals** agar tidak bergeser.
- `JetBrains Mono` hanya untuk: NIA, nomor surat, ID, angka teknis kecil. Bukan untuk paragraf.
- Judul memakai hierarki lewat **weight + warna**, bukan sekadar ukuran raksasa.
- Panjang baris body maksimum ±65 karakter (`max-w-2xl` untuk intro).
- Label kecil boleh uppercase dengan tracking lebar; body tidak.
- Jangan memakai placeholder sebagai satu-satunya label.
- Jangan memecah kata di tengah dengan `word-break: break-all` pada teks biasa.

---

## 4. Spacing, Radius, Elevation

### 4.1 Spacing Scale

Basis 4px (Tailwind): `1 = 4px`, `2 = 8px`, `3 = 12px`, `4 = 16px`, `5 = 20px`, `6 = 24px`, `8 = 32px`, `10 = 40px`.

| Area | Nilai |
|---|---|
| Padding card | `p-5` (20px) |
| Gap grid | `gap-3` s.d. `gap-5` (12–20px) |
| Padding main | `px-4 sm:px-6 lg:px-8`, `py-8 lg:py-10` |
| Jarak antar-section | `mt-4` / `mt-6` (16–24px) |
| Sidebar | `w-[16.5rem]` (264px), inset 12px di desktop |
| Offset konten desktop | `lg:pl-[18rem]` (288px) |

### 4.2 Radius

| Elemen | Radius |
|---|---|
| Card utama | `1.5rem` (24px) |
| Modal / sidebar desktop | `1.75rem` (28px) |
| Sub-panel, dropdown | `1rem` (16px) |
| Stat tile | `1.25rem` (20px) |
| Input, select, nav item | `0.75rem` (12px) |
| Tombol, chip, badge, icon button | `9999px` (pill/circle) |

### 4.3 Elevation — Double-Bezel

Setiap card memakai **double-bezel**: tray tipis 4px di luar + hairline + inner highlight, bukan border abu-abu 1px generik.

```css
/* Light */
box-shadow:
  0 0 0 1px rgb(var(--line) / 0.9),
  0 0 0 4px rgb(var(--elevated) / 0.92),
  inset 0 1px 0 rgb(255 255 255 / 0.62),
  0 34px 64px -44px rgb(15 23 42 / 0.38);

/* Dark */
box-shadow:
  0 0 0 1px rgb(var(--line) / 0.9),
  0 0 0 4px rgb(var(--elevated) / 0.6),
  inset 0 1px 0 rgb(255 255 255 / 0.05),
  0 34px 64px -44px rgb(0 0 0 / 0.85);
```

| Layer | Shadow |
|---|---|
| Header island | `0 20px 44px -30px rgb(15 23 42 / 0.45)` |
| Sidebar desktop | `0 36px 80px -48px rgb(15 23 42 / 0.6)` |
| Modal | `0 50px 100px -40px rgb(15 23 42 / 0.6)` |
| Primary button | `inset 0 1px 0 rgb(255 255 255 / 0.2), 0 16px 30px -18px rgb(var(--brand) / 0.75)` |
| Card hover (`card-lift`) | `translateY(-3px)` + tray/ambient sedikit lebih dalam |

Bayangan selalu **diffused dan tinted** ke arah warna latar. Tidak ada drop shadow keras.

---

## 5. Layout & Grid

### 5.1 App Shell

```
┌──────────────────────────────────────────────────────┐
│  [sidebar mengambang]   [header island mengambang]    │
│                         ┌──────────────────────────┐  │
│                         │ main (fluid, padding)    │  │
│                         └──────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- **Sidebar** — `fixed`, 264px, hanya mengambang di `lg` (`inset-y-3 left-3 rounded-[1.75rem]`). Di mobile menjadi drawer penuh dengan overlay.
- **Header** — `sticky top-0`, pill `rounded-full`, `bg-surface/75` + `backdrop-blur-2xl`, margin atas 12px. Bukan edge-to-edge bar.
- **Main** — fluid, tanpa `max-width` global; padding bertingkat. Tabel mengatur lebarnya sendiri.

### 5.2 Grid Patterns (Ringkasan)

| Blok | Grid |
|---|---|
| KPI | `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` |
| Chart + funnel | `lg:grid-cols-3`; chart `lg:col-span-2`, funnel `1` |
| Surat terbaru + agenda | `lg:grid-cols-3`; surat `lg:col-span-2`, agenda `1` |
| Statistik kaderisasi | `grid-cols-2 lg:grid-cols-4` |
| Pipeline jenjang | `sm:grid-cols-2 xl:grid-cols-4` |
| Program | `grid-cols-1 lg:grid-cols-2` |

Pola asimetris **8/4** dan **7/5** adalah default. Jangan membuat deretan 3 kartu sama besar tanpa alasan.

### 5.3 Breakpoints

| Prefix | Min width | Perilaku |
|---|---|---|
| — | 0 | 1 kolom; sidebar drawer; tabel horizontal scroll |
| `sm` | 640px | 2 kolom KPI/statistik; sebagian kolom tabel muncul |
| `md` | 768px | Judul header muncul; kolom PAC muncul |
| `lg` | 1024px | Sidebar mengambang; grid 3 kolom; chart 2/1 |
| `xl` | 1280px | KPI 4 kolom; pipeline 4 kolom |

### 5.4 Aturan Responsif

- **Mobile-first.** Semua grid multi-kolom turun ke 1 kolom di bawah `768px`, kecuali pasangan statistik 2 kolom yang tetap terbaca.
- **Tidak boleh ada horizontal scroll pada halaman.** Tabel lebar dibungkus `overflow-x-auto` dengan `min-w-[720px]` / `min-w-[760px]`.
- Sidebar di mobile memakai drawer + overlay, bukan sidebar sempit permanen.
- Target sentuh minimal **44×44px** untuk kontrol utama.
- Gunakan `min-h-dvh`, bukan `h-screen`.
- Ikon dan tombol tabel mengecil di mobile, tetapi area klik tetap nyaman.

### 5.5 Z-Index Scale

| Layer | z-index |
|---|---|
| Konten | auto / 0 |
| Header sticky | 30 |
| Overlay drawer + grain | 40 |
| Sidebar + modal | 50 |
| Toast | 60 |
| Skip link | 100 |

Gunakan skala ini; jangan menulis `z-[9999]`.

---

## 6. Components

### 6.1 Buttons

**Primary** — pill biru, untuk satu aksi utama per layar.

| State | Spesifikasi |
|---|---|
| Default | `bg-brand`, `text-brand-fg`, `rounded-full`, `px-5 py-2.5`, `text-sm/500` |
| Hover | `bg-brand-deep`, ikon trail bergeser `translate(2px,-1px) scale(1.06)` |
| Active | `scale(0.98)` |
| Focus | outline 2px `ring`, offset 2px (global `:focus-visible`) |
| Disabled | opacity 50%, `cursor-not-allowed` |

**Secondary** — pill putih, border `line/70`, hover `elevated`.
**Ghost** — tanpa latar, teks `muted`, hover `elevated` + `ink`.
**Icon button** — lingkaran 44px (header) / 36px (tabel), border `line/70`.
**Small** — `btn-sm`, pill, padding `px-3 py-1.5`, teks 12px.

**Button-in-button:** CTA dengan ikon memakai struktur:

```html
<button class="btn-primary group">
  <span>Buat Surat</span>
  <span class="btn-trail" aria-hidden="true">
    <i class="ph-light ph-plus text-sm"></i>
  </span>
</button>
```

`btn-trail` = 24px circle, `bg-brand-fg/15`, ikon di dalamnya. Ikon tidak pernah berdiri telanjang di samping teks.

### 6.2 Cards

- `rounded-[1.5rem]`, `bg-surface`, double-bezel shadow.
- Padding default `p-5`.
- `card-lift` untuk card yang boleh hover: `translateY(-3px)`, transisi 620ms.
- Card statistik memakai `p-4` dan ikon tile `rounded-2xl` dengan latar semantik.
- Card tabel memakai `overflow-hidden` dan `overflow-x-auto` di dalamnya.

### 6.3 Inputs & Forms

- Label **di atas** input, `text-xs font-semibold`, jarak 6px. Tidak ada floating label.
- Input `h-10`, `rounded-xl`, border `line/70`, padding horizontal 14px.
- Focus: border `brand` + ring 2px `brand/20`.
- Wajib: tanda `*` berwarna `danger`; error di bawah field; helper text boleh di bawah.
- Placeholder hanya contoh, bukan pengganti label.
- Modal form: grid 2 kolom di `sm`, 1 kolom di mobile.
- Tombol submit memakai loading/disabled state bila terhubung API.

### 6.4 Tabs, Chips, Badges

- **Tabs** — segmented control dalam `bg-elevated rounded-xl p-1`; aktif `bg-surface shadow-sm`; `role="tablist"` + `aria-selected`.
- **Chips** — pill, border `line/70`; aktif `bg-brand-soft text-brand border-brand/30`; `aria-pressed`.
- **Badges** — pill 11px/600; warna mengikuti semantik status di §2.3; selalu berisi teks, bukan warna saja.

### 6.5 Tables

| Properti | Nilai |
|---|---|
| Header | 11px uppercase, `text-muted`, bg `elevated/70` |
| Sel | 14px, padding `px-4 py-3`, `align-middle` |
| Divider | `divide-y divide-line` (tanpa border vertikal) |
| Hover row | `bg-elevated/60` |
| Wrapper | `overflow-x-auto`, `min-w-[720px]` / `[760px]` |
| Caption | `sr-only` |
| Aksi | ikon mata/unduh/pensil, `aria-label` per baris |
| Pagination | `page / total`, tombol caret, info jumlah (`aria-live="polite"`) |

Page size: **6** surat, **8** anggota.

### 6.6 Modal

- Panel `max-w-lg`, `rounded-[1.75rem]`, border `line/70`, shadow modal.
- Backdrop `bg-slate-950/50` + `backdrop-blur-sm`.
- Fokus pertama masuk ke field form (bukan tombol close).
- Focus trap Tab/Shift+Tab; Escape menutup; klik backdrop menutup; fokus kembali ke pemicu.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- Form panjang/punya perubahan belum disimpan → konfirmasi sebelum menutup (belum diimplementasikan; wajib saat produksi).

### 6.7 Dropdown & Search

- Panel `rounded-2xl`, border `line/70`, shadow ambient, padding 6px.
- Item hover/focus `bg-elevated`.
- Search global: input pill, shortcut `/`, hasil gabungan surat + anggota (maks 6), klik hasil → pindah route + filter.
- `aria-expanded` pada pemicu; hasil pencarian `aria-live="polite"`.

### 6.8 Toast

- `rounded-2xl`, border sesuai tone, ikon + teks.
- Sukses = `success`, info = `info`, error = `danger`.
- Auto-dismiss **3.6 detik**, `aria-live="polite"`, tidak merebut fokus.

### 6.9 Charts

- **Bar chart** PAC: SVG/div batang, gradient `brand` → `brand/55`, label nilai di atas, label PAC di bawah.
- **Sparkline KPI**: full-bleed di kaki card, `text-{tone}/35`, `preserveAspectRatio="none"`, `vector-effect="non-scaling-stroke"`.
- **Progress bar**: track `bg-elevated`, fill `bg-brand`, tinggi 8px, radius penuh.
- Semua chart punya:
  - `role="img"` + `aria-label` ringkasan insight,
  - tabel `sr-only` sebagai alternatif,
  - nilai langsung (direct labeling),
  - warna yang tidak bergantung pada merah/hijau saja.
- Data kosong → empty state terarah, bukan grafik kosong.

### 6.10 Empty States

Gunakan ikon light, judul singkat, dan satu arahan/aksi. Contoh:

> "Tidak ada surat yang cocok" → "Coba ubah kata kunci atau filter status."

Bukan sekadar "No data".

---

## 7. Iconography

- **Satu keluarga ikon: Phosphor Light** (`ph-light`). Tidak ada emoji sebagai ikon struktural.
- Ukuran: `text-base` (16px) untuk inline, `text-lg` (18px) untuk nav, `text-xl` (20px) untuk tile.
- Ikon dekoratif di samping teks wajib `aria-hidden="true"`.
- Ikon tanpa teks wajib punya `aria-label` (contoh: tombol close, mata, unduh).
- Jangan memakai FontAwesome, Material Icons, atau stroke tebal.
- Logo resmi EDO memakai aset resmi (`layout/images/edo.png`) yang di-embed base64. Jangan menggambar ulang logo.

---

## 8. Motion & Interaction

### 8.1 Easing Tokens

```css
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);   /* interaksi, hover, drawer */
--ease-out-quint: cubic-bezier(0.16, 1, 0.3, 1); /* reveal, entrance */
```

**Banned:** `linear`, `ease-in-out`, dan transisi tanpa interpolasi.

### 8.2 Duration

| Interaksi | Durasi |
|---|---|
| Modal masuk | 220ms |
| Section route masuk | 420ms |
| Hover/state kontrol | 500ms |
| Card lift | 620ms |
| Scroll reveal | 900ms |
| Toast masuk / tinggal | 240ms / 3600ms |

### 8.3 Scroll Reveal

- Atribut `data-reveal` pada card/section utama.
- Initial: `opacity: 0; transform: translateY(26px) scale(0.985)`.
- Saat masuk viewport: `opacity: 1; transform: none`.
- `IntersectionObserver`: `threshold: 0.08`, `rootMargin: "0px 0px -48px 0px"`.
- Stagger: `55ms × index`, maksimum `330ms`.
- Jangan memakai `window.addEventListener('scroll')`.
- `prefers-reduced-motion: reduce` → semua transisi/animasi 0.001ms dan elemen langsung terlihat.

### 8.4 Micro-Interactions

| Elemen | Perilaku |
|---|---|
| Primary button | hover naik 1px + ikon trail diagonal; active `scale(0.98)` |
| Icon button | hover `elevated`; active `scale(0.95)` |
| Card lift | hover `translateY(-3px)`, shadow menguat |
| Sidebar drawer | `translateX` 500ms dengan `ease-spring` |
| Nav active | indikator biru 3px di kiri |
| Theme toggle | ikon matahari/bulan berganti via class `dark`; preferensi disimpan di `localStorage` key `nu-theme` |

### 8.5 Performance

- Animasi hanya `transform` dan `opacity` (plus `box-shadow` untuk elevation).
- Jangan menganimasikan `width`, `height`, `top`, `left`.
- `backdrop-blur` hanya pada elemen fixed/sticky (header, sidebar, overlay, modal).
- Grain overlay memakai pseudo-element fixed, bukan container scroll.
- Tidak ada blur pada container yang ikut scroll.
- Gunakan `will-change` hanya jika benar-benar perlu; hindari pemakaian permanen.

---

## 9. Content & Tone

- **Bahasa:** Indonesia, formal tetapi tidak kaku. Sapa pengguna dengan "Anda" bila perlu.
- **Nada:** tenang, informatif, tidak bombastis.
- **Label:** sentence case untuk isi, UPPERCASE hanya untuk micro-label.
- **Tanggal:** `18 Nov 2026` (ringkas) dan `18 November 2026` (panjang).
- **Angka:** format Indonesia (`4.812`, `17,9%`), `tabular-nums` untuk kolom.
- **Status:** gunakan istilah konsisten — Menunggu, Diproses, Selesai, Aktif, Non-aktif, Cuti, Berjalan, Pendaftaran, Dijadwalkan.
- **Data contoh:** semua angka di prototipe adalah dummy. Jangan menampilkan data pribadi nyata.
- **Dilarang:** "Elevate", "Seamless", "Unleash", "Next-Gen", "Solusi terbaik untuk…", dan klise copywriting AI lainnya.
- **Nama contoh:** gunakan nama Indonesia yang wajar, bukan "John Doe" atau "Acme".

---

## 10. Accessibility

### Wajib

- Kontras teks ≥ **4.5:1**; teks besar/non-teks ≥ **3:1**.
- `:focus-visible` selalu terlihat: outline 2px `ring`, offset 2px. Jangan menghapus focus ring.
- Skip link "Lewati ke konten utama" di awal `<body>`.
- Semua input punya `<label for>`; error dihubungkan `aria-describedby`.
- Tombol ikon punya `aria-label`; ikon dekoratif `aria-hidden="true"`.
- Tabel punya `<caption class="sr-only">` dan `th scope="col"`.
- Modal: `role="dialog"`, `aria-modal`, focus trap, Escape, kembalikan fokus.
- Toast: `aria-live="polite"`, tidak merebut fokus.
- Chart: `role="img"` + `aria-label` + tabel alternatif `sr-only`.
- Status tidak boleh hanya dibedakan lewat warna.
- Target sentuh utama ≥ **44×44px**.
- Hormati `prefers-reduced-motion` dan pembesaran teks.
- Jangan menonaktifkan zoom (`user-scalable=no` dilarang).

### Keyboard Map

| Tombol | Aksi |
|---|---|
| `/` | Fokus ke pencarian global |
| `Tab` / `Shift+Tab` | Navigasi fokus (tertahan di dalam modal) |
| `Escape` | Tutup modal / dropdown / pencarian |
| `Enter` | Jalankan hasil pencarian pertama / submit form |

---

## 11. Implementation Notes

### 11.1 Struktur

```
edov3/
├── index.html   # seluruh aplikasi: token, markup, Tailwind, JS
└── DESIGN.md    # dokumen ini
```

`index.html` adalah **source of truth**. Jika token berubah, ubah di dua tempat:

1. Blok `:root` untuk light mode.
2. Blok `.dark` untuk dark mode.
3. Pemetaan Tailwind di `tailwind.config` (canvas, surface, elevated, line, ink, muted, brand, accent, success, info, violet, danger).

### 11.2 Menambah Halaman Baru

1. Tambah `<section data-view="nama" class="hidden animate-fade-up">…</section>`.
2. Tambah link sidebar: `<a href="#nama" data-route="nama" class="nav-link">…</a>`.
3. Tambah entri di `const ROUTES = { … }` pada script.
4. Pastikan setiap card memakai `data-reveal` (dan `card-lift` bila interaktif).
5. Uji di 390px, 768px, 1024px, 1440px.

### 11.3 Menambah Card

```html
<article data-reveal class="card card-lift p-5">
  <h3 class="text-sm font-bold">Judul</h3>
  <p class="mt-1 text-xs text-muted">Deskripsi singkat</p>
  <!-- isi -->
</article>
```

Jangan menambah `border` 1px baru; gunakan double-bezel shadow yang sudah ada.

### 11.4 Menambah Tombol Aksi

```html
<button class="btn-primary group">
  <span>Label Aksi</span>
  <span class="btn-trail" aria-hidden="true">
    <i class="ph-light ph-arrow-up-right text-sm"></i>
  </span>
</button>
```

Gunakan maksimal **satu** tombol primary per layar. Aksi sekunder memakai `btn-secondary` atau `btn-ghost`.

### 11.5 Catatan Produksi

- Prototipe ini memakai CDN Tailwind, Phosphor, dan Google Fonts.
- Untuk produksi: pindahkan Tailwind ke build lokal, self-host font/ikon, dan ganti data dummy dengan API.
- Jangan menambah dependensi animasi berat tanpa alasan; motion saat ini cukup dengan CSS + IntersectionObserver.
- Simpan `DESIGN.md` di root dan perbarui saat token/komponen berubah.

---

## 12. Anti-Patterns (Banned)

**Tipografi**
- ❌ Inter, Roboto, Arial, Helvetica, Open Sans
- ❌ Serif untuk dashboard
- ❌ Teks body < 12px
- ❌ Huruf kapital semua pada paragraf

**Warna & Elevasi**
- ❌ `#000000` murni
- ❌ Neon glow / outer glow / gradient text
- ❌ Aksen kedua di luar palet
- ❌ Border abu-abu 1px keras (`#ccc`, gray default)
- ❌ Drop shadow hitam keras (`rgba(0,0,0,.3)`)
- ❌ Warna sebagai satu-satunya penanda status

**Layout**
- ❌ Navbar sticky edge-to-edge menempel atas
- ❌ Deretan 3 kartu sama besar tanpa hierarki
- ❌ Horizontal scroll pada halaman
- ❌ `h-screen` untuk section penuh (pakai `min-h-dvh`)
- ❌ Overlap elemen tanpa zona spasial yang jelas
- ❌ `z-[9999]`

**Motion**
- ❌ `linear` / `ease-in-out`
- ❌ Animasi `width`, `height`, `top`, `left`
- ❌ `window.addEventListener('scroll')` untuk reveal
- ❌ Blur pada container yang ikut scroll
- ❌ Animasi yang memblokir input pengguna

**Komponen & Konten**
- ❌ Emoji sebagai ikon struktural
- ❌ Ikon stroke tebal / campur keluarga ikon
- ❌ Placeholder-only label
- ❌ "No data" tanpa arahan
- ❌ Logo brand palsu / digambar ulang
- ❌ Nama generik dan angka palsu bulat (`99,99%`, `50%`)
- ❌ Klise copywriting AI

---

## 13. Pre-Delivery Checklist

Sebelum mengirim layar/komponen baru:

- [ ] Token warna dipakai; tidak ada hex mentah.
- [ ] Mode terang dan gelap dicek terpisah.
- [ ] Kontras teks ≥ 4.5:1; focus ring terlihat.
- [ ] Semua target sentuh utama ≥ 44px.
- [ ] Tidak ada horizontal scroll di 390px.
- [ ] Tabel punya caption + scope + wrapper scroll.
- [ ] Card memakai double-bezel dan `data-reveal`.
- [ ] CTA utama memakai pola button-in-button.
- [ ] Motion memakai `--ease-spring` / `--ease-out-quint`, bukan linear.
- [ ] `prefers-reduced-motion` aman.
- [ ] Modal: focus trap, Escape, fokus kembali.
- [ ] Empty/error/loading state tersedia.
- [ ] Copywriting Indonesia, tanpa klise AI.
- [ ] Tidak ada emoji, Inter, atau tiga kartu sama besar.

---

*Terakhir diperbarui: 19 November 2026 · mengikuti implementasi `index.html` versi 2.0.*
