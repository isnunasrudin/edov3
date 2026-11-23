<script setup>
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import LevelBadge from '@/Components/LevelBadge.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import ProgressBar from '@/Components/ProgressBar.vue';
import EmptyState from '@/Components/EmptyState.vue';
import CompletenessRing from '@/Components/Public/CompletenessRing.vue';
import PacChecklistRow from '@/Components/Public/PacChecklistRow.vue';
import {
    pacStats,
    publicCompleteness,
    publicLevelSummary,
    publicStatuses,
} from '@/data/public';
import { formatNumber } from '@/utils/format';

defineOptions({ layout: PublicLayout, inheritAttrs: false });

const query = ref('');
const statusFilter = ref('semua');
const expanded = ref([]);

const filteredPacs = computed(() => {
    const term = query.value.toLowerCase().trim();

    return pacStats
        .filter((row) => statusFilter.value === 'semua' || row.status === statusFilter.value)
        .filter(
            (row) =>
                !term ||
                `${row.nama} ${row.ketua} ${row.wilayah} ${row.org}`
                    .toLowerCase()
                    .includes(term),
        );
});

const statusCounts = computed(() =>
    Object.fromEntries(
        publicStatuses.map((status) => [
            status.key,
            pacStats.filter((row) => row.status === status.key).length,
        ]),
    ),
);

function toggleRow(id) {
    expanded.value = expanded.value.includes(id)
        ? expanded.value.filter((item) => item !== id)
        : [...expanded.value, id];
}

function isExpanded(id) {
    return expanded.value.includes(id);
}

function toggleStatus(key) {
    statusFilter.value = statusFilter.value === key ? 'semua' : key;
}

function resetFilters() {
    query.value = '';
    statusFilter.value = 'semua';
}
</script>

<template>
    <Head title="Statistik Pimpinan · EDO v2" />

    <div class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                        <i class="ph-light ph-chart-line-up" aria-hidden="true"></i>
                        Data Publik
                    </span>
                    <span class="badge border border-line bg-elevated text-muted">KAB. TRENGGALEK</span>
                </div>
                <h1 class="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    Statistik Pimpinan
                </h1>
                <p class="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    Ringkasan jumlah dan kelengkapan pimpinan IPNU &amp; IPPNU
                    dari tingkat anak cabang hingga ranting.
                </p>
            </div>
        </div>

        <!-- Level -->
        <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article
                v-for="level in publicLevelSummary"
                :key="level.code"
                v-reveal
                class="card p-5"
            >
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <LevelBadge :level="level.code" />
                        <h2 class="text-sm font-bold">{{ level.label }}</h2>
                    </div>
                    <span class="font-mono text-2xl font-semibold tabular-nums">
                        {{ level.ipnu + level.ippnu }}
                    </span>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-2">
                    <div class="rounded-xl border border-line/60 bg-elevated/70 p-3">
                        <OrgBadge org="IPNU" />
                        <p class="mt-1.5 font-mono text-xl font-semibold tabular-nums">{{ level.ipnu }}</p>
                    </div>
                    <div class="rounded-xl border border-line/60 bg-elevated/70 p-3">
                        <OrgBadge org="IPPNU" />
                        <p class="mt-1.5 font-mono text-xl font-semibold tabular-nums">{{ level.ippnu }}</p>
                    </div>
                </div>
            </article>
        </div>

        <!-- Kelengkapan -->
        <div v-reveal class="card mt-4 p-6">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                <CompletenessRing :percent="publicCompleteness.percent" />

                <div class="min-w-0 flex-1">
                    <h2 class="text-sm font-bold">Kelengkapan Pimpinan</h2>
                    <p class="mt-1 text-xs leading-relaxed text-muted">
                        Persentase kepengurusan yang sudah lengkap berdasarkan data publik.
                    </p>

                    <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div class="stat-tile">
                            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Total</p>
                            <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ formatNumber(publicCompleteness.total) }}</p>
                        </div>
                        <div class="stat-tile">
                            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Lengkap</p>
                            <p class="mt-1 font-mono text-xl font-semibold tabular-nums text-success">{{ formatNumber(publicCompleteness.complete) }}</p>
                        </div>
                        <div class="stat-tile">
                            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Perlu dilengkapi</p>
                            <p class="mt-1 font-mono text-xl font-semibold tabular-nums text-accent">{{ formatNumber(publicCompleteness.need) }}</p>
                        </div>
                        <div class="stat-tile">
                            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Kelengkapan</p>
                            <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ publicCompleteness.percent }}%</p>
                        </div>
                    </div>

                    <div class="mt-4">
                        <ProgressBar :value="publicCompleteness.percent" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Checklist -->
        <div class="mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 class="text-xl font-semibold tracking-[-0.025em]">Checklist Kelengkapan</h2>
                <p class="mt-1 text-xs text-muted">
                    Seluruh PAC ditampilkan. Buka baris PAC untuk memuat PR dan PK sesuai banomnya.
                </p>
            </div>
            <span class="badge bg-brand-soft text-brand">{{ filteredPacs.length }} PAC</span>
        </div>

        <div v-reveal class="card mt-4 overflow-hidden">
            <div class="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
                <div class="relative w-full sm:max-w-xs">
                    <label for="filter-pac" class="sr-only">Cari PAC, ketua, atau wilayah</label>
                    <i class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
                    <input
                        id="filter-pac"
                        v-model="query"
                        type="search"
                        class="input h-9 pl-9"
                        placeholder="Cari PAC, ketua, wilayah…"
                        autocomplete="off"
                    />
                </div>
                <button class="btn-ghost btn-sm sm:ml-auto" @click="resetFilters">
                    <i class="ph-light ph-arrow-counter-clockwise text-base" aria-hidden="true"></i>
                    Reset
                </button>
            </div>

            <div class="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
                <button
                    :class="['chip', { 'is-active': statusFilter === 'semua' }]"
                    :aria-pressed="statusFilter === 'semua'"
                    @click="statusFilter = 'semua'"
                >
                    Semua
                </button>
                <button
                    v-for="status in publicStatuses"
                    :key="status.key"
                    :class="['chip', { 'is-active': statusFilter === status.key }]"
                    :aria-pressed="statusFilter === status.key"
                    @click="toggleStatus(status.key)"
                >
                    <span :class="['h-1.5 w-1.5 rounded-full', status.dot]"></span>
                    {{ status.label }}
                    <span class="font-mono text-[10px] text-muted">{{ statusCounts[status.key] }}</span>
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="tbl min-w-[980px]">
                    <caption class="sr-only">
                        Checklist kelengkapan pimpinan anak cabang IPNU dan IPPNU
                    </caption>
                    <thead class="bg-elevated/70">
                        <tr>
                            <th scope="col" class="th w-10"><span class="sr-only">Buka rincian</span></th>
                            <th scope="col" class="th">Pimpinan</th>
                            <th scope="col" class="th hidden sm:table-cell">Periode</th>
                            <th scope="col" class="th hidden lg:table-cell">Ketua</th>
                            <th scope="col" class="th">Kekurangan</th>
                            <th scope="col" class="th">Status</th>
                            <th scope="col" class="th">Persentase PR/PK</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-line">
                        <PacChecklistRow
                            v-for="row in filteredPacs"
                            :key="row.id"
                            :row="row"
                            :expanded="isExpanded(row.id)"
                            @toggle="toggleRow"
                        />
                        <tr v-if="!filteredPacs.length">
                            <td colspan="7">
                                <EmptyState
                                    icon="ph-identification-card"
                                    title="PAC tidak ditemukan"
                                    description="Coba ubah kata kunci atau filter status."
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex flex-col gap-2 border-t border-line px-4 py-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p>Menampilkan {{ filteredPacs.length }} dari {{ pacStats.length }} PAC</p>
                <p class="inline-flex items-center gap-1">
                    <i class="ph-light ph-info" aria-hidden="true"></i>
                    Data publik · dummy prototipe
                </p>
            </div>
        </div>
    </div>
</template>
