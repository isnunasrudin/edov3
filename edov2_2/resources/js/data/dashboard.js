export const PAC_LIST = [
    'Trenggalek',
    'Pogalan',
    'Karangan',
    'Watulimo',
    'Panggul',
    'Durenan',
    'Gandusari',
    'Kampak',
    'Bendungan',
    'Munjungan',
    'Pule',
    'Suruh',
    'Tugu',
    'Dongko',
];

export const PAC_DATA = [
    { name: 'Trenggalek', total: 612 },
    { name: 'Pogalan', total: 498 },
    { name: 'Karangan', total: 464 },
    { name: 'Watulimo', total: 421 },
    { name: 'Panggul', total: 388 },
    { name: 'Durenan', total: 356 },
    { name: 'Gandusari', total: 327 },
    { name: 'Kampak', total: 296 },
];

export const seedSurat = [
    { id: 's1', jenis: 'masuk', nomor: '128/PC-A/IPNU-TGL/XI/2026', perihal: 'Undangan Rapat Kerja Cabang', pihak: 'PC IPNU Kab. Tulungagung', tanggal: '2026-11-18', status: 'Menunggu' },
    { id: 's2', jenis: 'masuk', nomor: '127/PC-A/IPNU-TGL/XI/2026', perihal: 'Permohonan Narasumber MAKESTA', pihak: 'PAC Pogalan', tanggal: '2026-11-17', status: 'Diproses' },
    { id: 's3', jenis: 'masuk', nomor: '126/PC-A/IPNU-TGL/XI/2026', perihal: 'Pemberitahuan Perubahan Jadwal PKLT', pihak: 'PW IPNU Jawa Timur', tanggal: '2026-11-15', status: 'Selesai' },
    { id: 's4', jenis: 'masuk', nomor: '125/PC-A/IPNU-TGL/XI/2026', perihal: 'Permohonan Data Keanggotaan', pihak: 'Kemenag Trenggalek', tanggal: '2026-11-14', status: 'Selesai' },
    { id: 's5', jenis: 'masuk', nomor: '124/PC-A/IPNU-TGL/XI/2026', perihal: 'Undangan Harlah NU ke-100', pihak: 'PCNU Trenggalek', tanggal: '2026-11-12', status: 'Selesai' },
    { id: 's6', jenis: 'masuk', nomor: '123/PC-A/IPNU-TGL/XI/2026', perihal: 'Permohonan Izin Kegiatan', pihak: 'PAC Watulimo', tanggal: '2026-11-11', status: 'Diproses' },
    { id: 's7', jenis: 'masuk', nomor: '122/PC-A/IPNU-TGL/XI/2026', perihal: 'Surat Edaran Administrasi', pihak: 'PW IPPNU Jawa Timur', tanggal: '2026-11-09', status: 'Selesai' },
    { id: 's8', jenis: 'masuk', nomor: '121/PC-A/IPNU-TGL/XI/2026', perihal: 'Undangan Musyawarah Anak Cabang', pihak: 'PAC Karangan', tanggal: '2026-11-07', status: 'Menunggu' },
    { id: 's9', jenis: 'masuk', nomor: '120/PC-A/IPNU-TGL/XI/2026', perihal: 'Permohonan Kerja Sama Pelatihan', pihak: 'SMKN 1 Trenggalek', tanggal: '2026-11-05', status: 'Selesai' },
    { id: 's10', jenis: 'masuk', nomor: '119/PC-A/IPNU-TGL/XI/2026', perihal: 'Undangan Peringatan Hari Santri', pihak: 'Pemkab Trenggalek', tanggal: '2026-11-03', status: 'Selesai' },
    { id: 's11', jenis: 'keluar', nomor: '096/PC-A/IPNU-TGL/XI/2026', perihal: 'Balasan Undangan Rapat Kerja', pihak: 'PC IPNU Kab. Tulungagung', tanggal: '2026-11-18', status: 'Selesai' },
    { id: 's12', jenis: 'keluar', nomor: '095/PC-A/IPNU-TGL/XI/2026', perihal: 'Pengantar Data Anggota 2026', pihak: 'Kemenag Trenggalek', tanggal: '2026-11-16', status: 'Selesai' },
    { id: 's13', jenis: 'keluar', nomor: '094/PC-A/IPNU-TGL/XI/2026', perihal: 'Permohonan Tempat MAKESTA', pihak: 'SMKN 1 Trenggalek', tanggal: '2026-11-14', status: 'Diproses' },
    { id: 's14', jenis: 'keluar', nomor: '093/PC-A/IPNU-TGL/XI/2026', perihal: 'Undangan Rapat Pleno', pihak: 'PAC se-Trenggalek', tanggal: '2026-11-12', status: 'Selesai' },
    { id: 's15', jenis: 'keluar', nomor: '092/PC-A/IPNU-TGL/XI/2026', perihal: 'Laporan Kegiatan LAKMUD IX', pihak: 'PW IPNU Jawa Timur', tanggal: '2026-11-10', status: 'Selesai' },
    { id: 's16', jenis: 'keluar', nomor: '091/PC-A/IPNU-TGL/XI/2026', perihal: 'Permohonan Rekomendasi', pihak: 'PCNU Trenggalek', tanggal: '2026-11-08', status: 'Menunggu' },
];

export const seedAnggota = [
    { id: 'a1', nama: 'Ahmad Fauzan Hidayat', nia: '2019.01.00123', org: 'IPNU', pac: 'Trenggalek', status: 'Aktif', jenjang: 'Kader', joined: 2019 },
    { id: 'a2', nama: 'M. Rizal Fahmi', nia: '2021.01.00421', org: 'IPNU', pac: 'Pogalan', status: 'Aktif', jenjang: 'Anggota', joined: 2021 },
    { id: 'a3', nama: 'Agus Setiawan', nia: '2018.01.00087', org: 'IPNU', pac: 'Karangan', status: 'Aktif', jenjang: 'Kader', joined: 2018 },
    { id: 'a4', nama: 'Nur Kholis Majid', nia: '2022.01.00564', org: 'IPNU', pac: 'Watulimo', status: 'Aktif', jenjang: 'Anggota', joined: 2022 },
    { id: 'a5', nama: 'Bagus Dwi Prasetyo', nia: '2020.01.00298', org: 'IPNU', pac: 'Panggul', status: 'Aktif', jenjang: 'Kader Utama', joined: 2016 },
    { id: 'a6', nama: 'Syaiful Anam', nia: '2017.01.00064', org: 'IPNU', pac: 'Durenan', status: 'Aktif', jenjang: 'Kader', joined: 2017 },
    { id: 'a7', nama: 'M. Fahmi Idris', nia: '2019.01.00156', org: 'IPNU', pac: 'Gandusari', status: 'Non-aktif', jenjang: 'Anggota', joined: 2019 },
    { id: 'a8', nama: 'Dimas Arya Putra', nia: '2023.01.00712', org: 'IPNU', pac: 'Kampak', status: 'Aktif', jenjang: 'Anggota Muda', joined: 2023 },
    { id: 'a9', nama: 'Nabila Putri Ramadhani', nia: '2020.02.00311', org: 'IPPNU', pac: 'Trenggalek', status: 'Aktif', jenjang: 'Kader', joined: 2020 },
    { id: 'a10', nama: 'Siti Nur Aisyah', nia: '2022.02.00602', org: 'IPPNU', pac: 'Pogalan', status: 'Aktif', jenjang: 'Anggota', joined: 2022 },
    { id: 'a11', nama: 'Dewi Anggraini', nia: '2018.02.00104', org: 'IPPNU', pac: 'Karangan', status: 'Aktif', jenjang: 'Kader', joined: 2018 },
    { id: 'a12', nama: 'Lailatul Fitriyah', nia: '2021.02.00488', org: 'IPPNU', pac: 'Watulimo', status: 'Aktif', jenjang: 'Anggota', joined: 2021 },
    { id: 'a13', nama: 'Rina Maulida', nia: '2023.02.00745', org: 'IPPNU', pac: 'Bendungan', status: 'Aktif', jenjang: 'Anggota Muda', joined: 2023 },
    { id: 'a14', nama: 'Umi Kulsum', nia: '2017.02.00059', org: 'IPPNU', pac: 'Tugu', status: 'Cuti', jenjang: 'Kader', joined: 2017 },
    { id: 'a15', nama: 'Frida Aulia Rahma', nia: '2019.02.00237', org: 'IPPNU', pac: 'Suruh', status: 'Aktif', jenjang: 'Kader Utama', joined: 2015 },
    { id: 'a16', nama: 'Ayu Wulandari', nia: '2022.02.00519', org: 'IPPNU', pac: 'Munjungan', status: 'Non-aktif', jenjang: 'Anggota', joined: 2022 },
];

export const seedPrograms = [
    { id: 'p1', nama: 'MAKESTA Angkatan XXIV', level: 'Dasar', peserta: 48, kuota: 60, tanggal: '2026-12-12', status: 'Pendaftaran' },
    { id: 'p2', nama: 'PKLT Angkatan XII', level: 'Lanjutan', peserta: 24, kuota: 30, tanggal: '2026-12-05', status: 'Berjalan' },
    { id: 'p3', nama: 'LAKMUD Angkatan IX', level: 'Menengah', peserta: 18, kuota: 25, tanggal: '2026-11-20', status: 'Berjalan' },
    { id: 'p4', nama: 'LAKUT Angkatan V', level: 'Tinggi', peserta: 12, kuota: 20, tanggal: '2027-01-08', status: 'Dijadwalkan' },
];

export const agenda = [
    { day: '20', month: 'Nov', title: 'Rapat Pleno Pengurus', meta: '19.30 WIB · Sekretariat PC', tone: 'brand' },
    { day: '22', month: 'Nov', title: 'LAKMUD Angkatan IX', meta: '20–22 Nov · Aula PCNU', tone: 'accent' },
    { day: '28', month: 'Nov', title: 'Pelantikan PAC Pogalan', meta: '09.00 WIB · Kantor Kecamatan', tone: 'info' },
    { day: '12', month: 'Des', title: 'MAKESTA Angkatan XXIV', meta: '12–14 Des · SMKN 1 Trenggalek', tone: 'brand' },
];

export const notifications = [
    { icon: 'ph-envelope-simple', tone: 'brand', title: '2 surat menunggu disposisi', meta: 'Sekretariat · 10 menit lalu' },
    { icon: 'ph-graduation-cap', tone: 'accent', title: 'Pendaftaran MAKESTA XXIV dibuka', meta: 'Kaderisasi · 1 jam lalu' },
    { icon: 'ph-user-plus', tone: 'info', title: '12 anggota baru terverifikasi', meta: 'Keanggotaan · Kemarin' },
];
