<script setup>
import { computed, ref, watch } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import Pagination from '@/Components/Pagination.vue';
import SuratFormModal from '@/Components/SuratFormModal.vue';
import DetailModal from '@/Components/DetailModal.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import { dashboard, deleteSurat } from '@/stores/dashboard';
import { downloadCSV, downloadSurat } from '@/utils/export';
import { showToast } from '@/composables/useToast';
import { formatDate, formatLongDate, readQuery } from '@/utils/format';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const page = usePage();
const query = ref(readQuery(page.url));
const initialJenis = readQuery(page.url, 'jenis');
const tab = ref(initialJenis === 'keluar' ? 'keluar' : 'masuk');
const status = ref('semua');
const currentPage = ref(1);
const pageSize = 6;

const suratModalOpen = ref(false);
const editingSurat = ref(null);
const deletingSurat = ref(null);
const selectedSurat = ref(null);
const selectedIds = ref([]);

watch(
    () => page.url,
    (url) => {
        query.value = readQuery(url);
        const jenis = readQuery(url, 'jenis');
        if (jenis === 'masuk' || jenis === 'keluar') tab.value = jenis;
        currentPage.value = 1;
    },
);

watch([query, tab, status], () => {
    currentPage.value = 1;
});

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    return dashboard.surat
        .filter((surat) => surat.jenis === tab.value)
        .filter((surat) => status.value === 'semua' || surat.status === status.value)
        .filter(
            (surat) =>
                !term ||
                `${surat.nomor} ${surat.perihal} ${surat.pihak}`.toLowerCase().includes(term),
        )
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
});

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));

watch(pages, (value) => {
    if (currentPage.value > value) currentPage.value = value;
});

const rows = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filtered.value.slice(start, start + pageSize);
});

const masukCount = computed(() => dashboard.surat.filter((surat) => surat.jenis === 'masuk').length);
const keluarCount = computed(() => dashboard.surat.filter((surat) => surat.jenis === 'keluar').length);

const allSelected = computed({
    get: () => rows.value.length > 0 && rows.value.every((row) => selectedIds.value.includes(row.id)),
    set: (checked) => {
        if (checked) {
            const ids = new Set([...selectedIds.value, ...rows.value.map((row) => row.id)]);
            selectedIds.value = [...ids];
        } else {
            selectedIds.value = selectedIds.value.filter(
                (id) => !rows.value.some((row) => row.id === id),
            );
        }
    },
});

const detailRows = computed(() => {
    if (!selectedSurat.value) return [];

    const surat = selectedSurat.value;
    const pimpinan = surat.pimpinanId
        ? dashboard.pimpinan.find((item) => item.id === surat.pimpinanId)?.nama
        : null;

    return [
        { label: 'Jenis', value: surat.jenis === 'masuk' ? 'Surat Masuk' : 'Surat Keluar' },
        { label: 'Nomor', value: surat.nomor },
        { label: 'Perihal', value: surat.perihal },
        { label: 'Asal / Tujuan', value: surat.pihak },
        { label: 'Pimpinan terkait', value: pimpinan ?? '—' },
        { label: 'Tanggal', value: formatLongDate(surat.tanggal) },
        { label: 'Status', value: surat.status },
    ];
});

const showingFrom = computed(() =>
    filtered.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1,
);

const showingTo = computed(() =>
    Math.min(currentPage.value * pageSize, filtered.value.length),
);

function resetFilters() {
    query.value = '';
    status.value = 'semua';
    currentPage.value = 1;
    showToast('Filter persuratan direset.', 'info');
}

function exportSurat() {
    const data = [['Jenis', 'Nomor', 'Perihal', 'Asal/Tujuan', 'Tanggal', 'Status']];
    filtered.value.forEach((surat) =>
        data.push([surat.jenis, surat.nomor, surat.perihal, surat.pihak, surat.tanggal, surat.status]),
    );

    downloadCSV(`arsip-surat-${tab.value}.csv`, data);
    showToast('Arsip surat diekspor sebagai CSV.');
}

function handleDownload(surat) {
    downloadSurat(surat);
    showToast('Surat diunduh sebagai file teks.');
}

function openCreate() {
    editingSurat.value = null;
    suratModalOpen.value = true;
}

function openEdit(surat) {
    editingSurat.value = surat;
    suratModalOpen.value = true;
}

function confirmDelete() {
    if (!deletingSurat.value) return;

    deleteSurat(deletingSurat.value.id);
    deletingSurat.value = null;
    selectedSurat.value = null;
    showToast('Surat berhasil dihapus.', 'success');
}

function onSaved(item) {
    tab.value = item.jenis;
    query.value = '';
    status.value = 'semua';
    currentPage.value = 1;
    suratModalOpen.value = false;
    editingSurat.value = null;
}
</script>

<template>
    <Head title="Persuratan · EDO v2" />

    <PageHeader
        eyebrow="Administrasi"
        title="Persuratan"
        description="Kelola surat masuk dan keluar, disposisi, serta arsip digital."
        icon="ph-envelope-simple"
    >
        <template #actions>
            <button class="btn-secondary" @click="exportSurat">
                <i class="ph-light ph-download-simple text-base" aria-hidden="true"></i>
                Ekspor CSV
            </button>
            <button class="btn-primary group" @click="openCreate">
                <span>Buat Surat</span>
                <span class="btn-trail" aria-hidden="true">
                    <i class="ph-light ph-plus text-sm"></i>
                </span>
            </button>
        </template>
    </PageHeader>

    <div v-reveal class="card mt-6 overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
            <div class="flex items-center gap-1 rounded-xl bg-elevated p-1" role="tablist" aria-label="Jenis surat">
                <button
                    role="tab"
                    :aria-selected="tab === 'masuk'"
                    :class="[
                        'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                        tab === 'masuk' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
                    ]"
                    @click="tab = 'masuk'"
                >
                    <i class="ph-light ph-tray text-base" aria-hidden="true"></i>
                    Surat Masuk
                    <span class="rounded-md bg-brand-soft px-1.5 font-mono text-[10px] text-brand">{{ masukCount }}</span>
                </button>
                <button
                    role="tab"
                    :aria-selected="tab === 'keluar'"
                    :class="[
                        'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                        tab === 'keluar' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
                    ]"
                    @click="tab = 'keluar'"
                >
                    <i class="ph-light ph-paper-plane-tilt text-base" aria-hidden="true"></i>
                    Surat Keluar
                    <span class="rounded-md bg-surface px-1.5 font-mono text-[10px] text-muted">{{ keluarCount }}</span>
                </button>
            </div>

            <p class="text-xs text-muted">
                Arsip tahun <span class="font-semibold text-ink">2026</span>
            </p>
        </div>

        <div class="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div class="relative w-full sm:max-w-xs">
                <label for="filter-surat-q" class="sr-only">Cari surat</label>
                <i
                    class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted"
                    aria-hidden="true"
                ></i>
                <input
                    id="filter-surat-q"
                    v-model="query"
                    type="search"
                    class="input h-9 pl-9"
                    placeholder="Cari nomor, perihal, pengirim…"
                    autocomplete="off"
                />
            </div>

            <label for="filter-surat-status" class="sr-only">Filter status surat</label>
            <select id="filter-surat-status" v-model="status" class="select h-9 w-full sm:w-44">
                <option value="semua">Semua status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
            </select>

            <button class="btn-ghost btn-sm sm:ml-auto" @click="resetFilters">
                <i class="ph-light ph-arrow-counter-clockwise text-base" aria-hidden="true"></i>
                Reset
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="tbl min-w-[720px]">
                <caption class="sr-only">
                    Daftar surat masuk dan keluar PC IPNU &amp; IPPNU Trenggalek
                </caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th w-10">
                            <input
                                v-model="allSelected"
                                type="checkbox"
                                class="h-4 w-4 cursor-pointer rounded border-line accent-[rgb(var(--brand))]"
                                aria-label="Pilih semua surat"
                            />
                        </th>
                        <th scope="col" class="th">Nomor Surat</th>
                        <th scope="col" class="th">Perihal</th>
                        <th scope="col" class="th hidden lg:table-cell">Asal / Tujuan</th>
                        <th scope="col" class="th hidden sm:table-cell">Tanggal</th>
                        <th scope="col" class="th">Status</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <template v-if="rows.length">
                        <tr
                            v-for="surat in rows"
                            :key="surat.id"
                            class="transition-colors hover:bg-elevated/60"
                        >
                            <td class="td w-10">
                                <input
                                    v-model="selectedIds"
                                    :value="surat.id"
                                    type="checkbox"
                                    class="h-4 w-4 cursor-pointer rounded border-line accent-[rgb(var(--brand))]"
                                    :aria-label="`Pilih surat ${surat.nomor}`"
                                />
                            </td>
                            <td class="td">
                                <span class="font-mono text-xs text-muted">{{ surat.nomor }}</span>
                            </td>
                            <td class="td">
                                <p class="font-semibold">{{ surat.perihal }}</p>
                                <p class="mt-0.5 text-[11px] text-muted lg:hidden">
                                    {{ surat.jenis === 'masuk' ? 'Pengirim' : 'Tujuan' }}:
                                    {{ surat.pihak }}
                                </p>
                            </td>
                            <td class="td hidden text-muted lg:table-cell">{{ surat.pihak }}</td>
                            <td class="td hidden whitespace-nowrap text-muted sm:table-cell">
                                {{ formatDate(surat.tanggal) }}
                            </td>
                            <td class="td"><StatusBadge :status="surat.status" /></td>
                            <td class="td text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button
                                        class="icon-btn-sm"
                                        :aria-label="`Lihat detail ${surat.nomor}`"
                                        title="Lihat detail"
                                        @click="selectedSurat = surat"
                                    >
                                        <i class="ph-light ph-eye" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        class="icon-btn-sm"
                                        :aria-label="`Unduh ${surat.nomor}`"
                                        title="Unduh surat"
                                        @click="handleDownload(surat)"
                                    >
                                        <i class="ph-light ph-download-simple" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        class="icon-btn-sm"
                                        :aria-label="`Ubah surat ${surat.nomor}`"
                                        title="Ubah surat"
                                        @click="openEdit(surat)"
                                    >
                                        <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        class="icon-btn-sm hover:text-danger"
                                        :aria-label="`Hapus surat ${surat.nomor}`"
                                        title="Hapus surat"
                                        @click="deletingSurat = surat"
                                    >
                                        <i class="ph-light ph-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="7">
                            <EmptyState
                                icon="ph-envelope-simple"
                                title="Tidak ada surat yang cocok"
                                description="Coba ubah kata kunci atau filter status."
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-col gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p class="text-xs text-muted" aria-live="polite">
                <template v-if="filtered.length">
                    Menampilkan {{ showingFrom }}–{{ showingTo }} dari {{ filtered.length }} surat
                </template>
                <template v-else>Tidak ada hasil</template>
            </p>
            <Pagination v-model:page="currentPage" :pages="pages" />
        </div>
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Surat berstatus <span class="font-semibold text-ink">Menunggu</span> perlu disposisi sebelum diproses.
    </p>

    <SuratFormModal
        :open="suratModalOpen"
        :item="editingSurat"
        @close="suratModalOpen = false; editingSurat = null"
        @saved="onSaved"
    />

    <ConfirmModal
        :open="!!deletingSurat"
        title="Hapus surat?"
        :message="`Surat “${deletingSurat?.perihal ?? ''}” akan dihapus dari arsip.`"
        confirm-label="Hapus surat"
        @close="deletingSurat = null"
        @confirm="confirmDelete"
    />

    <DetailModal
        :open="!!selectedSurat"
        :title="selectedSurat?.perihal ?? 'Detail Surat'"
        :subtitle="selectedSurat?.nomor ?? ''"
        :rows="detailRows"
        @close="selectedSurat = null"
    >
        <template #actions>
            <button
                v-if="selectedSurat"
                class="btn-primary mt-4 w-full"
                @click="handleDownload(selectedSurat)"
            >
                <i class="ph-light ph-download-simple" aria-hidden="true"></i>
                Unduh surat (.txt)
            </button>
        </template>
    </DetailModal>
</template>
