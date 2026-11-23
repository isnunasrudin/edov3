import { computed, reactive } from 'vue';
import { PAC_DATA, seedAnggota, seedPrograms, seedSurat } from '@/data/dashboard';
import { seedPimpinan } from '@/data/pimpinan';
import { seedJabatan, seedPendidikan, seedPeriode } from '@/data/relations';
import { seedAlamat, seedJenisJabatan } from '@/data/reference';

export const dashboard = reactive({
    surat: seedSurat.map((item) => ({ ...item, pimpinanId: item.pimpinanId ?? null })),
    anggota: seedAnggota.map((item) => ({
        ...item,
        alamat: item.alamat ?? `Kec. ${item.pac}`,
        tempatLahir: item.tempatLahir ?? 'Trenggalek',
        tanggalLahir: item.tanggalLahir ?? '',
        nickname: item.nickname ?? item.nama.split(' ')[0],
        gender: item.gender ?? (item.org === 'IPNU' ? 'Laki-laki' : 'Perempuan'),
        rt: item.rt ?? '01',
        rw: item.rw ?? '02',
        dusun: item.dusun ?? '—',
        nik: item.nik ?? '—',
        hobi: item.hobi ?? '—',
        picture: item.picture ?? '',
        generalId: item.generalId ?? item.nia,
        generalCard: item.generalCard ?? '—',
        progress: item.progress ?? 80,
    })),
    programs: seedPrograms.map((item) => ({ ...item, pimpinanId: item.pimpinanId ?? null })),
    pimpinan: seedPimpinan.map((item) => ({ ...item })),
    periode: seedPeriode.map((item) => ({ ...item })),
    jabatan: seedJabatan.map((item) => ({ ...item })),
    pendidikan: seedPendidikan.map((item) => ({ ...item })),
    pacData: PAC_DATA,
    jenisJabatan: seedJenisJabatan.map((item) => ({ ...item })),
    alamat: seedAlamat.map((item) => ({ ...item })),
});

export const totalAnggota = 4812;
export const totalKader = 862;
export const totalSuratMasuk = 128;
export const totalSuratKeluar = 96;

export const pendingSurat = computed(
    () => dashboard.surat.filter((item) => item.status === 'Menunggu').length,
);

export const totalPimpinan = computed(() => dashboard.pimpinan.length);
export const totalPeriode = computed(() => dashboard.periode.length);
export const totalJabatan = computed(() => dashboard.jabatan.length);
export const totalPendidikan = computed(() => dashboard.pendidikan.length);
export const totalJenisJabatan = computed(() => dashboard.jenisJabatan.length);
export const totalAlamat = computed(() => dashboard.alamat.length);

function insert(list, payload, prefix) {
    const item = { id: `${prefix}-${Date.now()}`, ...payload };
    list.unshift(item);
    return item;
}

function update(list, id, payload) {
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const item = { ...list[index], ...payload, id };
    list[index] = item;
    return item;
}

function remove(list, id) {
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    return true;
}

/* ============================ JENIS JABATAN ============================ */
export function jenisJabatanById(id) {
    return dashboard.jenisJabatan.find((item) => item.id === id) ?? null;
}

export function addJenisJabatan(payload) {
    return insert(dashboard.jenisJabatan, payload, 'jj');
}

export function updateJenisJabatan(id, payload) {
    const previous = jenisJabatanById(id);
    const saved = update(dashboard.jenisJabatan, id, payload);

    if (saved && previous && previous.nama !== saved.nama) {
        dashboard.jabatan.forEach((row) => {
            const pimpinan = dashboard.pimpinan.find((p) => p.id === row.pimpinanId);
            if (row.nama === previous.nama && pimpinan?.org === previous.org) {
                row.nama = saved.nama;
            }
        });
    }

    return saved;
}

export function deleteJenisJabatan(id) {
    const item = jenisJabatanById(id);
    if (!item || item.default) return false;

    const used = dashboard.jabatan.some((row) => {
        const pimpinan = dashboard.pimpinan.find((p) => p.id === row.pimpinanId);
        return row.nama === item.nama && pimpinan?.org === item.org;
    });

    if (used) return false;

    return remove(dashboard.jenisJabatan, id);
}

/* ============================ ALAMAT ============================ */
export function alamatById(id) {
    return dashboard.alamat.find((item) => item.id === id) ?? null;
}

export function alamatChildren(parentId) {
    return dashboard.alamat.filter((item) => item.parentId === parentId);
}

export function alamatPath(id) {
    const names = [];
    let current = alamatById(id);

    while (current) {
        names.unshift(current.nama);
        current = current.parentId ? alamatById(current.parentId) : null;
    }

    return names;
}

export function addAlamat(payload) {
    return insert(dashboard.alamat, payload, 'addr');
}

export function updateAlamat(id, payload) {
    const previous = alamatById(id);
    const saved = update(dashboard.alamat, id, payload);

    if (saved && previous && previous.nama !== saved.nama) {
        dashboard.anggota.forEach((row) => {
            if (row.alamat === previous.nama) row.alamat = saved.nama;
        });
        dashboard.pimpinan.forEach((row) => {
            if (row.alamat === previous.nama) row.alamat = saved.nama;
        });
    }

    return saved;
}

export function deleteAlamat(id) {
    if (alamatChildren(id).length) return false;

    return remove(dashboard.alamat, id);
}

export const addressOptions = computed(() =>
    dashboard.alamat
        .filter((item) => item.tingkat !== 'provinsi')
        .map((item) => {
            const path = alamatPath(item.id).slice(0, -1).join(' › ');
            return {
                value: item.nama,
                label: item.nama,
                description: path || 'Wilayah',
            };
        })
        .sort((a, b) => a.label.localeCompare(b.label, 'id')),
);

/* ============================ SURAT ============================ */
export function addSurat(payload) {
    return insert(dashboard.surat, payload, 's');
}

export function updateSurat(id, payload) {
    return update(dashboard.surat, id, payload);
}

export function deleteSurat(id) {
    return remove(dashboard.surat, id);
}

/* ============================ ANGGOTA ============================ */
export function addAnggota(payload) {
    return insert(dashboard.anggota, payload, 'a');
}

export function updateAnggota(id, payload) {
    return update(dashboard.anggota, id, payload);
}

export function deleteAnggota(id) {
    dashboard.pendidikan = dashboard.pendidikan.filter((item) => item.anggotaId !== id);
    dashboard.jabatan = dashboard.jabatan.filter((item) => item.anggotaId !== id);
    return remove(dashboard.anggota, id);
}

/* ============================ PIMPINAN ============================ */
export function addPimpinan(payload) {
    return insert(dashboard.pimpinan, payload, 'pim');
}

export function updatePimpinan(id, payload) {
    return update(dashboard.pimpinan, id, payload);
}

export function deletePimpinan(id) {
    dashboard.periode = dashboard.periode.filter((item) => item.pimpinanId !== id);
    dashboard.jabatan = dashboard.jabatan.filter((item) => item.pimpinanId !== id);
    return remove(dashboard.pimpinan, id);
}

/* ============================ PERIODE (KONTEKS PIMPINAN) ============================ */
export function attachPeriode(payload) {
    return insert(dashboard.periode, payload, 'per');
}

export function updatePeriode(id, payload) {
    return update(dashboard.periode, id, payload);
}

export function detachPeriode(id) {
    const used = dashboard.jabatan.some((item) => item.periodeId === id);
    if (used) return false;

    return remove(dashboard.periode, id);
}

/* ============================ JABATAN (RELASI) ============================ */
export function attachJabatan(payload) {
    return insert(dashboard.jabatan, payload, 'jab');
}

export function updateJabatan(id, payload) {
    return update(dashboard.jabatan, id, payload);
}

export function detachJabatan(id) {
    return remove(dashboard.jabatan, id);
}

/* ============================ PROGRAM ============================ */
export function addProgram(payload) {
    return insert(dashboard.programs, { peserta: 0, materials: [], scores: [], administration: [], ...payload }, 'p');
}

export function updateProgram(id, payload) {
    return update(dashboard.programs, id, payload);
}

export function deleteProgram(id) {
    return remove(dashboard.programs, id);
}

/* ============================ HELPERS ============================ */
export function anggotaById(id) {
    return dashboard.anggota.find((item) => item.id === id) ?? null;
}

export function pimpinanById(id) {
    return dashboard.pimpinan.find((item) => item.id === id) ?? null;
}

export function periodeById(id) {
    return dashboard.periode.find((item) => item.id === id) ?? null;
}
