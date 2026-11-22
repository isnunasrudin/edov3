import { formatLongDate } from '@/utils/format';

export function downloadFile(filename, content, type = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadCSV(filename, rows) {
    const csv = rows
        .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    downloadFile(filename, `\uFEFF${csv}`, 'text/csv;charset=utf-8');
}

export function downloadSurat(surat) {
    const text = [
        'PC IPNU & IPPNU KABUPATEN TRENGGALEK',
        '----------------------------------------',
        `Jenis   : ${surat.jenis === 'masuk' ? 'Surat Masuk' : 'Surat Keluar'}`,
        `Nomor   : ${surat.nomor}`,
        `Perihal : ${surat.perihal}`,
        `Pihak   : ${surat.pihak}`,
        `Tanggal : ${formatLongDate(surat.tanggal)}`,
        `Status  : ${surat.status}`,
        '',
        'Dokumen ini dihasilkan dari prototipe dashboard.',
    ].join('\n');

    downloadFile(`${surat.nomor.replace(/[\\/]/g, '-')}.txt`, text);
}
