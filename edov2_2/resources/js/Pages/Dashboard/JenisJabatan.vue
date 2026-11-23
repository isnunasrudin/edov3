<script setup>
import { computed, ref, watch } from 'vue';
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import Pagination from '@/Components/Pagination.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import JenisJabatanFormModal from '@/Components/JenisJabatanFormModal.vue';
import { dashboard, deleteJenisJabatan, pimpinanById } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const query = ref('');
const org = ref('semua');
const tipe = ref('semua');
const status = ref('semua');
const currentPage = ref(1);
const pageSize = 8;

const formOpen = ref(false);
const editing = ref(null);
const deleting = ref(null);

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    return dashboard.jenisJabatan
        .filter((item) => org.value === 'semua' || item.org === org.value)
        .filter((item) => tipe.value === 'semua' || item.tipe === tipe.value)
        .filter((item) => status.value === 'semua' || (status.value === 'aktif' ? item.aktif : !item.aktif))
        .filter((item) => {
            if (!term) return true;
            return `${item.nama} ${item.kode} ${item.grup}`.toLowerCase().includes(term);
        })
        .sort((a, b) =>
            a.org.localeCompare(b.org) ||
            Number(b.default) - Number(a.default) ||
            a.urutan - b.urutan ||
            a.nama.localeCompare(b.nama, 'id'),
        );
});

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));

watch(pages, (value) => {
    if (currentPage.value > value) currentPage.value = value;
});

watch([query, org, tipe, status], () => {
    currentPage.value = 1;
});

const rows = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filtered.value.slice(start, start + pageSize);
});

const showingFrom = computed(() =>
    filtered.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1,
);
const showingTo = computed(() => Math.min(currentPage.value * pageSize, filtered.value.length));

const stats = computed(() => ({
    total: dashboard.jenisJabatan.length,
    pengurus: dashboard.jenisJabatan.filter((item) => item.tipe === 'Pengurus').length,
    anggota: dashboard.jenisJabatan.filter((item) => item.tipe === 'Anggota').length,
    nonaktif: dashboard.jenisJabatan.filter((item) => !item.aktif).length,
}));

function isUsed(item) {
    return dashboard.jabatan.some((row) => {
        const pimpinan = pimpinanById(row.pimpinanId);
        return row.nama === item.nama && pimpinan?.org === item.org;
    });
}

function canDelete(item) {
    return !item.default && !isUsed(item);
}

function resetFilters() {
    query.value = '';
    org.value = 'semua';
    tipe.value = 'semua';
    status.value = 'semua';
    currentPage.value = 1;
}

function openCreate() {
    editing.value = null;
    formOpen.value = true;
}

function openEdit(item) {
    editing.value = item;
    formOpen.value = true;
}

function onSaved(saved) {
    formOpen.value = false;
    editing.value = null;
    showToast(`Jenis jabatan “${saved.nama}” berhasil disimpan.`);
}

function confirmDelete() {
    if (!deleting.value) return;

    const deleted = deleteJenisJabatan(deleting.value.id);

    if (!deleted) {
        showToast('Jenis jabatan default atau yang sudah dipakai tidak dapat dihapus.', 'error');
        deleting.value = null;
        return;
    }

    showToast(`Jenis jabatan “${deleting.value.nama}” dihapus.`);
    deleting.value = null;
}
</script>

<template>
    <Head title="Jenis Jabatan · EDO v2" />

    <PageHeader
        eyebrow="Data Master"
        title="Jenis Jabatan"
        description="Referensi jenis jabatan IPNU & IPPNU, termasuk aturan Anggota yang hanya berlaku untuk PR/PK."
        icon="ph-list-dashes"
    >
        <template #actions>
            <button class="btn-primary min-h-11" @click="openCreate">
                <i class="ph-light ph-plus" aria-hidden="true"></i>
                Tambah Jenis
            </button>
        </template>
    </PageHeader>

    <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Total</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums">{{ stats.total }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Pengurus</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-brand">{{ stats.pengurus }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Anggota</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-info">{{ stats.anggota }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Non-aktif</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-muted">{{ stats.nonaktif }}</p>
        </div>
    </div>

    <div v-reveal class="card mt-4 overflow-hidden">
        <div class="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div class="relative w-full sm:max-w-xs">
                <label for="jenis-search" class="sr-only">Cari jenis jabatan</label>
                <i class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
                <input id="jenis-search" v-model="query" type="search" class="input h-9 pl-9" placeholder="Cari nama, kode, grup…" autocomplete="off" />
            </div>
            <select v-model="org" class="select h-9 w-full sm:w-36" aria-label="Filter organisasi">
                <option value="semua">Semua org</option>
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
            </select>
            <select v-model="tipe" class="select h-9 w-full sm:w-36" aria-label="Filter tipe">
                <option value="semua">Semua tipe</option>
                <option value="Pengurus">Pengurus</option>
                <option value="Anggota">Anggota</option>
            </select>
            <select v-model="status" class="select h-9 w-full sm:w-36" aria-label="Filter status">
                <option value="semua">Semua status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-aktif</option>
            </select>
            <button class="btn-ghost btn-sm min-h-11 sm:ml-auto" @click="resetFilters">
                <i class="ph-light ph-arrow-counter-clockwise text-base" aria-hidden="true"></i>
                Reset
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="tbl min-w-[900px]">
                <caption class="sr-only">Daftar referensi jenis jabatan</caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th">Jenis Jabatan</th>
                        <th scope="col" class="th">Organisasi</th>
                        <th scope="col" class="th">Grup</th>
                        <th scope="col" class="th">Tipe</th>
                        <th scope="col" class="th">Aturan</th>
                        <th scope="col" class="th">Status</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="row in rows" :key="row.id" class="transition-colors hover:bg-elevated/60">
                        <td class="td">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="font-semibold">{{ row.nama }}</span>
                                <span v-if="row.default" class="badge bg-brand-soft text-brand">Default</span>
                            </div>
                            <p class="mt-0.5 font-mono text-[10px] text-muted">{{ row.kode }}</p>
                        </td>
                        <td class="td"><OrgBadge :org="row.org" /></td>
                        <td class="td text-xs text-muted">{{ row.grup }}</td>
                        <td class="td">
                            <span :class="['badge', row.tipe === 'Anggota' ? 'bg-info-soft text-info' : 'bg-brand-soft text-brand']">
                                {{ row.tipe }}
                            </span>
                        </td>
                        <td class="td">
                            <span v-if="row.hanyaPrPk" class="badge bg-accent-soft text-accent">Hanya PR/PK</span>
                            <span v-else class="text-xs text-muted">Semua level</span>
                        </td>
                        <td class="td"><StatusBadge :status="row.aktif ? 'Aktif' : 'Non-aktif'" /></td>
                        <td class="td text-right">
                            <div class="flex items-center justify-end gap-1">
                                <button class="icon-btn-sm" :aria-label="`Ubah ${row.nama}`" title="Ubah" @click="openEdit(row)">
                                    <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                                </button>
                                <button
                                    class="icon-btn-sm hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                                    :aria-label="`Hapus ${row.nama}`"
                                    :title="row.default ? 'Jenis default tidak dapat dihapus' : isUsed(row) ? 'Sudah dipakai pada penugasan' : 'Hapus'"
                                    :disabled="!canDelete(row)"
                                    @click="deleting = row"
                                >
                                    <i class="ph-light ph-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!rows.length">
                        <td colspan="7">
                            <EmptyState icon="ph-list-dashes" title="Jenis jabatan tidak ditemukan" description="Coba ubah kata kunci atau filter." />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-col gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p class="text-xs text-muted">Menampilkan {{ showingFrom }}–{{ showingTo }} dari {{ filtered.length }} jenis</p>
            <Pagination v-model:page="currentPage" :pages="pages" />
        </div>
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Jenis <b>Anggota</b> default wajib ada dan hanya dapat dipakai pada PR/PK. Jenis yang sudah dipakai penugasan tidak dapat dihapus.
    </p>

    <JenisJabatanFormModal :open="formOpen" :item="editing" @close="formOpen = false; editing = null" @saved="onSaved" />
    <ConfirmModal
        :open="!!deleting"
        title="Hapus Jenis Jabatan"
        :message="`Hapus jenis jabatan “${deleting?.nama ?? ''}”? Data referensi ini akan hilang dari pilihan form.`"
        @close="deleting = null"
        @confirm="confirmDelete"
    />
</template>
