import { formatDate, todayISO } from './format';

export function totalKuota(program) {
    return Number(program?.kuotaInternal ?? 0) + Number(program?.kuotaExternal ?? 0);
}

export function eventEndDate(program) {
    if (!program?.tanggal) return '';

    const date = new Date(`${program.tanggal}T00:00:00`);
    date.setDate(date.getDate() + Math.max(1, Number(program.durasi ?? 1)) - 1);
    const pad = (value) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function registrationOpen(program) {
    if (!program) return false;
    if (program.registrationForced) return true;
    if (!program.registrationFrom && !program.registrationUntil) return false;

    const today = todayISO();
    return (
        (!program.registrationFrom || program.registrationFrom <= today) &&
        (!program.registrationUntil || program.registrationUntil >= today)
    );
}

export function registrationLabel(program) {
    if (!program) return '—';
    if (program.registrationForced) return 'Dibuka paksa';
    if (program.registrationUntil) return `s.d. ${formatDate(program.registrationUntil)}`;
    return 'Tanpa batas';
}

export function deriveEventStatus(program) {
    if (!program?.tanggal) return 'Dijadwalkan';

    const today = todayISO();
    const from = program.registrationFrom;
    const until = program.registrationUntil;

    if (program.registrationForced || (from && from <= today && (!until || until >= today))) {
        return 'Pendaftaran';
    }

    if (program.tanggal > today) return 'Dijadwalkan';

    const end = eventEndDate(program);
    return end && end < today ? 'Selesai' : 'Berjalan';
}
