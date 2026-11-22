<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import LevelBadge from '@/Components/LevelBadge.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import Pagination from '@/Components/Pagination.vue';
import PimpinanFormModal from '@/Components/PimpinanFormModal.vue';
import DetailModal from '@/Components/DetailModal.vue';
import { LEVELS } from '@/data/pimpinan';
import { dashboard, totalPimpinan } from '@/stores/dashboard';
import { downloadCSV } from '@/utils/export';
import { showToast } from '@/composables/useToast';
import { formatNumber, readQuery } from '@/utils/format';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const page = usePage();
const query = ref(readQuery(page.url));
const org = ref('semua');
const level = ref('semua');
const status = ref('semua');
const currentPage = ref(1);
const pageSize = 8;

const formOpen = ref(false);
const selected = ref(null);
const tableRef = ref(null);

watch(
    () => page.url,
    (url) => {
        query.value = readQuery(url);
        org.value = 'semua';
        level.value = 'semua';
        status.value = 'semua';
        currentPage.value = 1;
    },
);

watch([query, org, level, status], () => {
    currentPage.value = 1;
});

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    return dashboard.pimpinan
        .filter((item) => org.value === 'semua' || item.org === org.value)
        .filter((item) => level.value === 'semua' || item.level === level.value)
        .filter((item) => status.value === 'semua' || item.status === status.value)
        .filter(
            (item) =>
                !term ||
                `${item.nama} ${item.region} ${item.ketua} ${item.parent}`
                    .toLowerCase()
                    .includes(term),
        );
});

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));

watch(pages, (value) => {
    if (currentPage.value > value) currentPage.value = value;
});

const rows = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filtered.value.slice(start, start + pageSize);
});

const levelCounts = computed(() =>
    LEVELS.map((item) => ({
        ...item,
        count: dashboard.pimpinan.filter((pimpinan) => pimpinan.level === item.code).length,
    })),
);

const activeCount = computed(
    () => dashboard.pimpinan.filter((pimpinan) => pimpinan.status === 'Aktif').length,
);

const showingFrom = computed(() =>
    filtered.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1,
);

const showingTo = computed(() =>
    Math.min(currentPage.value * pageSize, filtered.value.length),
);

function levelLabel(code) {
    return LEVELS.find((item) => item.code === code)?.label ?? code;
}

const detailRows = computed(() => {
    if (!selected.value) return [];

    const item = selected.value;

    return [
        { label: 'Organisasi', value: item.org },
        { label: 'Level', value: `${item.level} — ${levelLabel(item.level)}` },
        { label: 'Wilayah', value: item.region },
        { label: 'Induk kepengurusan', value: item.parent },
        { label: 'Ketua', value: item.ketua },
        { label: 'Sekretaris', value: item.sekretaris },
        { label: 'Periode', value: item.periode },
        { label: 'Jumlah pengurus', value: String(item.members) },
        { label: 'Nomor SK', value: item.sk },
        { label: 'Status', value: item.status },
        { label: 'Alamat', value: item.alamat },
    ];
});

function toggleLevel(code) {
    level.value = level.value === code ? 'semua' : code;
    currentPage.value = 1;

    nextTick(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        tableRef.value?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
}

function resetFilters() {
    query.value = '';
    org.value = 'semua';
    level.value = 'semua';
    status.value = 'semua';
    currentPage.value = 1;
    showToast('Filter pimpinan direset.', 'info');
}

function onSaved() {
    query.value = '';
    org.value = 'semua';
    level.value = 'semua';
    status.value = 'semua';
    currentPage.value = 1;
    formOpen.value = false;
}

function exportPimpinan() {
    const data = [
        ['Organisasi', 'Level', 'Nama', 'Wilayah', 'Induk', 'Ketua', 'Sekretaris', 'Periode', 'Pengurus', 'Status', 'SK'],
    ];

    filtered.value.forEach((item) =>
        data.push([
            item.org,
            item.level,
            item.nama,
            item.region,
            item.parent,
            item.ketua,
            item.sekretaris,
            item.periode,
            item.members,
            item.status,
            item.sk,
        ]),
    );

    downloadCSV('data-pimpinan.csv', data);
    showToast('Data pimpinan diekspor sebagai CSV.');
}
</script>

<template>
    <Head title="Manajemen Pimpinan · EDO v2" />

    <PageHeader
        eyebrow="Struktur Organisasi"
        title="Manajemen Pimpinan"
        description="Kelola kepengurusan PR, PK, PAC, PC, PCI, PW, dan PP untuk IPNU & IPPNU."
        icon="ph-identification-card"
    >
        <template #actions>
            <button class="btn-secondary" @click="exportPimpinan">
                <i class="ph-light ph-download-simple text-base" aria-hidden="true"></i>
                Ekspor CSV
            </button>
            <button class="btn-primary group" @click="formOpen = true">
                <span>Tambah Pimpinan</span>
                <span class="btn-trail" aria-hidden="true">
                    <i class="ph-light ph-plus text-sm"></i>
                </span>
            </button>
        </template>
    </PageHeader>

    <div class="mt-6 flex flex-wrap items-end justify-between gap-2">
        <div>
            <h3 class="text-sm font-bold">Jenjang Pimpinan</h3>
            <p class="text-xs text-muted">7 jenjang · IPNU &amp; IPPNU</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="badge bg-brand-soft text-brand">Total {{ formatNumber(totalPimpinan) }}</span>
            <span class="badge bg-success-soft text-success">{{ activeCount }} aktif</span>
        </div>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <div v-for="item in levelCounts" :key="item.code" v-reveal class="h-full">
            <button
                type="button"
                :class="[
                    'stat-tile flex h-full w-full cursor-pointer flex-col justify-between text-left transition duration-500',
                    level === item.code ? 'ring-2 ring-brand/30' : 'hover:bg-elevated',
                ]"
                :aria-pressed="level === item.code"
                :title="`Filter ${item.label}`"
                @click="toggleLevel(item.code)"
            >
                <div class="flex items-center justify-between gap-1">
                    <LevelBadge :level="item.code" />
                    <span class="font-mono text-lg font-semibold tabular-nums">{{ item.count }}</span>
                </div>
                <p class="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {{ item.label }}
                </p>
            </button>
        </div>
    </div>

    <div ref="tableRef" v-reveal class="card mt-4 scroll-mt-24 overflow-hidden">
        <div class="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div class="relative w-full sm:max-w-xs">
                <label for="filter-pimpinan-q" class="sr-only">Cari pimpinan</label>
                <i
                    class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted"
                    aria-hidden="true"
                ></i>
                <input
                    id="filter-pimpinan-q"
                    v-model="query"
                    type="search"
                    class="input h-9 pl-9"
                    placeholder="Cari pimpinan, wilayah, ketua…"
                    autocomplete="off"
                />
            </div>

            <label for="filter-pimpinan-level" class="sr-only">Filter level</label>
            <select id="filter-pimpinan-level" v-model="level" class="select h-9 w-full sm:w-48">
                <option value="semua">Semua level</option>
                <option v-for="item in LEVELS" :key="item.code" :value="item.code">
                    {{ item.code }} — {{ item.label }}
                </option>
            </select>

            <label for="filter-pimpinan-status" class="sr-only">Filter status</label>
            <select id="filter-pimpinan-status" v-model="status" class="select h-9 w-full sm:w-44">
                <option value="semua">Semua status</option>
                <option value="Aktif">Aktif</option>
                <option value="Menunggu Pelantikan">Menunggu Pelantikan</option>
                <option value="Periode Berakhir">Periode Berakhir</option>
            </select>

            <button class="btn-ghost btn-sm sm:ml-auto" @click="resetFilters">
                <i class="ph-light ph-arrow-counter-clockwise text-base" aria-hidden="true"></i>
                Reset
            </button>
        </div>

        <div class="flex items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
            <div class="flex flex-wrap gap-2" role="group" aria-label="Filter organisasi">
                <button
                    v-for="option in ['semua', 'IPNU', 'IPPNU']"
                    :key="option"
                    :class="['chip', { 'is-active': org === option }]"
                    :aria-pressed="org === option"
                    @click="org = option"
                >
                    {{ option === 'semua' ? 'Semua' : option }}
                </button>
            </div>
            <span class="ml-auto hidden text-xs text-muted sm:block" aria-live="polite">
                {{ filtered.length }} pimpinan
            </span>
        </div>

        <div class="overflow-x-auto">
            <table class="tbl min-w-[980px]">
                <caption class="sr-only">
                    Daftar pimpinan IPNU dan IPPNU dari PR hingga PP
                </caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th">Pimpinan</th>
                        <th scope="col" class="th">Organisasi</th>
                        <th scope="col" class="th">Level</th>
                        <th scope="col" class="th hidden md:table-cell">Wilayah</th>
                        <th scope="col" class="th hidden lg:table-cell">Ketua</th>
                        <th scope="col" class="th hidden sm:table-cell">Periode</th>
                        <th scope="col" class="th hidden xl:table-cell">Pengurus</th>
                        <th scope="col" class="th">Status</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <template v-if="rows.length">
                        <tr
                            v-for="item in rows"
                            :key="item.id"
                            class="transition-colors hover:bg-elevated/60"
                        >
                            <td class="td">
                                <p class="font-semibold">{{ item.nama }}</p>
                                <p class="mt-0.5 text-[11px] text-muted">Induk: {{ item.parent }}</p>
                            </td>
                            <td class="td"><OrgBadge :org="item.org" /></td>
                            <td class="td"><LevelBadge :level="item.level" /></td>
                            <td class="td hidden text-muted md:table-cell">{{ item.region }}</td>
                            <td class="td hidden lg:table-cell">{{ item.ketua }}</td>
                            <td class="td hidden whitespace-nowrap text-muted sm:table-cell">
                                {{ item.periode }}
                            </td>
                            <td class="td hidden xl:table-cell">
                                <span class="font-mono text-xs text-muted">{{ item.members }}</span>
                            </td>
                            <td class="td"><StatusBadge :status="item.status" /></td>
                            <td class="td text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button
                                        class="icon-btn-sm"
                                        :aria-label="`Lihat detail ${item.nama}`"
                                        title="Lihat detail"
                                        @click="selected = item"
                                    >
                                        <i class="ph-light ph-eye" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        class="icon-btn-sm"
                                        :aria-label="`Ubah data ${item.nama}`"
                                        title="Ubah data"
                                        @click="showToast('Form ubah pimpinan belum tersedia pada prototipe.', 'info')"
                                    >
                                        <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="9">
                            <EmptyState
                                icon="ph-identification-card"
                                title="Pimpinan tidak ditemukan"
                                description="Coba ubah kata kunci, level, atau filter status."
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-col gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p class="text-xs text-muted" aria-live="polite">
                <template v-if="filtered.length">
                    Menampilkan {{ showingFrom }}–{{ showingTo }} dari {{ filtered.length }} pimpinan
                </template>
                <template v-else>Tidak ada hasil</template>
            </p>
            <Pagination v-model:page="currentPage" :pages="pages" />
        </div>
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Data pimpinan bersifat contoh. Klik jenjang di atas untuk memfilter tabel.
    </p>

    <PimpinanFormModal
        :open="formOpen"
        @close="formOpen = false"
        @saved="onSaved"
    />

    <DetailModal
        :open="!!selected"
        :title="selected?.nama ?? 'Detail Pimpinan'"
        :subtitle="selected ? `${selected.level} · ${selected.org}` : ''"
        :rows="detailRows"
        @close="selected = null"
    />
</template>
