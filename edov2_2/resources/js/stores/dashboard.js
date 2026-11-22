import { computed, reactive } from 'vue';
import { PAC_DATA, seedAnggota, seedPrograms, seedSurat } from '@/data/dashboard';
import { seedPimpinan } from '@/data/pimpinan';

export const dashboard = reactive({
    surat: seedSurat.map((item) => ({ ...item })),
    anggota: seedAnggota.map((item) => ({ ...item })),
    programs: seedPrograms.map((item) => ({ ...item })),
    pimpinan: seedPimpinan.map((item) => ({ ...item })),
    pacData: PAC_DATA,
});

export const totalAnggota = 4812;
export const totalKader = 862;
export const totalSuratMasuk = 128;
export const totalSuratKeluar = 96;

export const pendingSurat = computed(
    () => dashboard.surat.filter((item) => item.status === 'Menunggu').length,
);

export const totalPimpinan = computed(() => dashboard.pimpinan.length);

export function addSurat(payload) {
    const item = { id: `s-${Date.now()}`, ...payload };
    dashboard.surat.unshift(item);
    return item;
}

export function addAnggota(payload) {
    const item = { id: `a-${Date.now()}`, ...payload };
    dashboard.anggota.unshift(item);
    return item;
}

export function addProgram(payload) {
    const item = { id: `p-${Date.now()}`, peserta: 0, ...payload };
    dashboard.programs.unshift(item);
    return item;
}

export function addPimpinan(payload) {
    const item = { id: `pim-${Date.now()}`, ...payload };
    dashboard.pimpinan.unshift(item);
    return item;
}
