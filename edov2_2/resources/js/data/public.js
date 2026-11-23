export const publicFeatures = [
    {
        id: 'impersonate',
        title: 'Impersonate',
        description: 'Gunakan akun Anda untuk mewakili pimpinan Anda.',
        icon: 'ph-user-switch',
        tone: 'accent',
        action: 'login',
        cta: 'Masuk untuk menggunakan',
        span: 'md:col-span-1 lg:col-span-4',
    },
    {
        id: 'kelola-pimpinan',
        title: 'Kelola Pimpinan',
        description: 'Atur administrasi dan masa khidmat/bakti pimpinan.',
        icon: 'ph-identification-card',
        tone: 'brand',
        action: 'login',
        cta: 'Masuk untuk mengelola',
        span: 'md:col-span-1 lg:col-span-4',
    },
    {
        id: 'data-keanggotaan',
        title: 'Data Keanggotaan',
        description: 'Kelola data anggota/pengurus pimpinan secara terstruktur.',
        icon: 'ph-users-three',
        tone: 'info',
        action: 'login',
        cta: 'Masuk untuk mengelola',
        span: 'md:col-span-1 lg:col-span-4',
    },
    {
        id: 'sinkronisasi',
        title: 'Sinkronisasi SISTA & Sirekan',
        description: 'Data anggota terintegrasi secara nasional.',
        icon: 'ph-arrows-clockwise',
        tone: 'success',
        action: 'login',
        cta: 'Masuk untuk sinkronisasi',
        span: 'md:col-span-1 lg:col-span-6',
    },
    {
        id: 'kta',
        title: 'Kartu Tanda Anggota',
        description: 'Miliki KTA bernomor induk anggota.',
        icon: 'ph-identification-badge',
        tone: 'violet',
        action: 'login',
        cta: 'Masuk untuk KTA',
        span: 'md:col-span-1 lg:col-span-6',
    },
    {
        id: 'edopedia',
        title: 'EDOPedia',
        description: 'Akses berbagai informasi tentang IPNU & IPPNU.',
        icon: 'ph-book-open',
        tone: 'info',
        action: 'wiki',
        href: 'https://wiki.pelajartrenggalek.or.id',
        cta: 'Jelajahi EDOPedia',
        badge: 'Ensiklopedia',
        span: 'md:col-span-2 lg:col-span-12',
    },
];

export const publicQuotes = [
    {
        name: 'KH. Ahmad Mustofa Bisri',
        role: 'Tokoh Nahdlatul Ulama',
        quote: '“Agama itu letaknya di hati. Kalau hatinya baik, agamanya baik. Kalau hatinya buruk, agamanya buruk.”',
    },
    {
        name: "Hadratussyekh KH. M. Hasyim Asy'ari",
        role: 'Perintis Nahdlatul Ulama',
        quote: '“Tak ada satu pun di dunia ini yang kekal. Maka, ukirlah cerita indah sebagai kenangan. Karena dunia memang sebuah cerita.”',
    },
];

export const publicStats = [
    { label: 'Anggota', value: '4.812', icon: 'ph-users-three' },
    { label: 'Kader', value: '862', icon: 'ph-graduation-cap' },
    { label: 'Pimpinan', value: '360', icon: 'ph-identification-card' },
    { label: 'PAC', value: '21', icon: 'ph-buildings' },
];

export const publicLevelSummary = [
    { code: 'PAC', label: 'Pimpinan Anak Cabang', ipnu: 10, ippnu: 11 },
    { code: 'PK', label: 'Pimpinan Komisariat', ipnu: 2, ippnu: 2 },
    { code: 'PR', label: 'Pimpinan Ranting', ipnu: 39, ippnu: 38 },
];

export const publicCompleteness = {
    total: 360,
    complete: 60,
    need: 300,
    percent: 17,
};

export const publicStatuses = [
    { key: 'Lengkap', label: 'Lengkap', dot: 'bg-success' },
    { key: 'Perlu dilengkapi', label: 'Perlu dilengkapi', dot: 'bg-accent' },
    { key: 'Masa Tenggang', label: 'Masa Tenggang', dot: 'bg-info' },
    { key: 'Expired', label: 'Expired', dot: 'bg-danger' },
    { key: 'Duplikat', label: 'Duplikat', dot: 'bg-violet' },
    { key: 'Beririsan', label: 'Beririsan', dot: 'bg-muted' },
];

const pacBaseline = [
    // IPNU
    { org: 'IPNU', wilayah: 'Pule', periode: '12 Sep 2025 - 12 Sep 2027', ketua: 'Mahfud Fauzi', status: 'Lengkap', percent: 45, complete: 5, total: 11, shortages: [] },
    { org: 'IPNU', wilayah: 'Suruh', periode: '30 Jun 2024 - 30 Jun 2026', ketua: 'Mulya Agung Santoso', status: 'Expired', percent: 43, complete: 3, total: 7, shortages: ['Periode Aktif', 'Expired'] },
    { org: 'IPNU', wilayah: 'Gandusari', periode: '27 Apr 2025 - 27 Apr 2027', ketua: 'Dawam Al Asror', status: 'Lengkap', percent: 25, complete: 3, total: 12, shortages: [] },
    { org: 'IPNU', wilayah: 'Durenan', periode: '19 Mei 2024 - 19 Mei 2026', ketua: 'Muhammad Zidni Mubaroq', status: 'Expired', percent: 24, complete: 4, total: 17, shortages: ['Periode Aktif', 'Expired'] },
    { org: 'IPNU', wilayah: 'Dongko', periode: '2026 - 2028', ketua: '—', status: 'Perlu dilengkapi', percent: 20, complete: 2, total: 10, shortages: ['Tanggal', 'Periode Aktif', 'Ketua', 'Surat Pengesahan'] },
    { org: 'IPNU', wilayah: 'Pogalan', periode: '01 Feb 2025 - 01 Feb 2027', ketua: 'Muhamad Ulul Fadli', status: 'Lengkap', percent: 20, complete: 2, total: 10, shortages: [] },
    { org: 'IPNU', wilayah: 'Bendungan', periode: '11 Mei 2025 - 11 Mei 2027', ketua: "Habib Rahman Assa'adi", status: 'Lengkap', percent: 13, complete: 1, total: 8, shortages: [] },
    { org: 'IPNU', wilayah: 'Munjungan', periode: '28 Des 2025 - 28 Des 2027', ketua: 'Diki Saputra', status: 'Lengkap', percent: 8, complete: 1, total: 12, shortages: [] },
    { org: 'IPNU', wilayah: 'Watulimo', periode: '23 Feb 2025 - 23 Feb 2027', ketua: 'Misyaifudin', status: 'Lengkap', percent: 8, complete: 1, total: 12, shortages: [] },
    { org: 'IPNU', wilayah: 'Tugu', periode: '09 Feb 2025 - 09 Feb 2027', ketua: 'Muhammad Wildaan Habiibullah', status: 'Lengkap', percent: 7, complete: 1, total: 15, shortages: [] },
    // IPPNU
    { org: 'IPPNU', wilayah: 'Pule', periode: '04 Mei 2025 - 04 Mei 2027', ketua: 'Ida Nur Aini', status: 'Lengkap', percent: 36, complete: 4, total: 11, shortages: [] },
    { org: 'IPPNU', wilayah: 'Suruh', periode: '2026 - 2028', ketua: 'Olindia', status: 'Perlu dilengkapi', percent: 29, complete: 2, total: 7, shortages: ['Tanggal', 'Periode Aktif', 'Surat Pengesahan'] },
    { org: 'IPPNU', wilayah: 'Durenan', periode: '2026 - 2028', ketua: 'Miladatur Rosidah', status: 'Perlu dilengkapi', percent: 24, complete: 4, total: 17, shortages: ['Tanggal', 'Periode Aktif', 'Surat Pengesahan'] },
    { org: 'IPPNU', wilayah: 'Gandusari', periode: '27 Apr 2025 - 27 Apr 2027', ketua: 'Zenny Rosyidah', status: 'Lengkap', percent: 17, complete: 2, total: 12, shortages: [] },
    { org: 'IPPNU', wilayah: 'Watulimo', periode: '23 Feb 2025 - 23 Feb 2027', ketua: 'Padila Pebi Nurngaini', status: 'Lengkap', percent: 17, complete: 2, total: 12, shortages: [] },
    { org: 'IPPNU', wilayah: 'Pogalan', periode: '02 Feb 2025 - 02 Feb 2027', ketua: 'Indah Ainus Sofa', status: 'Lengkap', percent: 10, complete: 1, total: 10, shortages: [] },
    { org: 'IPPNU', wilayah: 'Bendungan', periode: '12 Feb 2025 - 12 Feb 2027', ketua: 'Reza Oktaviona', status: 'Lengkap', percent: 0, complete: 0, total: 8, shortages: [] },
    { org: 'IPPNU', wilayah: 'Dongko', periode: '15 Mar 2026 - 15 Mar 2028', ketua: 'Mualifah', status: 'Lengkap', percent: 0, complete: 0, total: 10, shortages: [] },
    { org: 'IPPNU', wilayah: 'Kampak', periode: '27 Apr 2025 - 27 Apr 2027', ketua: 'Faridhotuz Zulfa', status: 'Lengkap', percent: 0, complete: 0, total: 7, shortages: [] },
    { org: 'IPPNU', wilayah: 'Karangan', periode: '—', ketua: '—', status: 'Perlu dilengkapi', percent: 0, complete: 0, total: 12, shortages: ['Periode', 'Tanggal', 'Periode Aktif', 'Ketua', 'Surat Pengesahan'] },
    { org: 'IPPNU', wilayah: 'Panggul', periode: '29 Des 2024 - 29 Des 2026', ketua: '—', status: 'Perlu dilengkapi', percent: 0, complete: 0, total: 8, shortages: ['Ketua', 'Surat Pengesahan'] },
];

function buildChildren(row, index) {
    const suffix = String(index + 1).padStart(2, '0');
    const completeChild = row.percent >= 30;

    return [
        {
            id: `child-${suffix}-pr`,
            level: 'PR',
            nama: `PR ${row.org} ${row.wilayah}`,
            periode: '2025 - 2027',
            ketua: completeChild ? 'Pengurus PR' : '—',
            status: completeChild ? 'Lengkap' : 'Perlu dilengkapi',
            percent: completeChild ? 100 : 60,
            complete: completeChild ? 5 : 3,
            total: 5,
        },
        {
            id: `child-${suffix}-pk`,
            level: 'PK',
            nama: `PK ${row.org} ${row.wilayah}`,
            periode: '2025 - 2026',
            ketua: 'Pengurus PK',
            status: row.percent >= 20 ? 'Lengkap' : 'Perlu dilengkapi',
            percent: row.percent >= 20 ? 80 : 40,
            complete: row.percent >= 20 ? 4 : 2,
            total: 5,
        },
    ];
}

export const pacStats = pacBaseline.map((row, index) => ({
    id: `pac-${String(index + 1).padStart(2, '0')}`,
    nama: `PAC ${row.org} ${row.wilayah}`,
    ...row,
    children: buildChildren(row, index),
}));
