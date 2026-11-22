export function formatDate(iso) {
    if (!iso) return '';
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatLongDate(iso) {
    if (!iso) return '';
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function initials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
}

export function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(value);
}

export function readQuery(url, key = 'q') {
    try {
        return new URL(url, window.location.origin).searchParams.get(key) ?? '';
    } catch {
        return '';
    }
}

export function todayISO() {
    return new Date().toISOString().slice(0, 10);
}
