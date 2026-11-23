<script setup>
import { computed, ref, watch } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import Pagination from '@/Components/Pagination.vue';
import EmptyState from '@/Components/EmptyState.vue';
import ProgramFormModal from '@/Components/ProgramFormModal.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import { dashboard, deleteProgram, pimpinanById } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { formatDate, todayISO } from '@/utils/format';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const query = ref('');
const type = ref('semua');
const currentPage = ref(1);
const pageSize = 8;

const programModalOpen = ref(false);
const deletingProgram = ref(null);

function registrationOpen(program) {
    if (program.registrationForced) return true;
    if (!program.registrationFrom && !program.registrationUntil) return false;

    const today = todayISO();
    return (
        (!program.registrationFrom || program.registrationFrom <= today) &&
        (!program.registrationUntil || program.registrationUntil >= today)
    );
}

function pimpinanFor(program) {
    return program.pimpinanId ? pimpinanById(program.pimpinanId) : null;
}

function pelaksanaFor(program) {
    if (program.isExternal) return program.externalPelaksana || '—';
    return pimpinanFor(program)?.nama ?? '—';
}

function totalKuota(program) {
    return Number(program.kuotaInternal ?? 0) + Number(program.kuotaExternal ?? 0);
}

const stats = computed(() => [
    {
        label: 'Kader Aktif',
        value: '862',
        note: '+42 tahun ini',
        icon: 'ph-users-three',
        tone: 'text-brand',
    },
    {
        label: 'Lulus 2026',
        value: '214',
        note: 'dari 5 angkatan',
        icon: 'ph-seal-check',
        tone: 'text-muted',
    },
    {
        label: 'Pendaftaran Dibuka',
        value: String(dashboard.programs.filter((item) => registrationOpen(item)).length),
        note: `${dashboard.programs.length} event pengkaderan`,
        icon: 'ph-ticket',
        tone: 'text-muted',
    },
    {
        label: 'Rasio Kader',
        value: '17,9%',
        note: 'dari total anggota',
        icon: 'ph-chart-line-up',
        tone: 'text-muted',
    },
]);

const pipeline = [
    { no: '01', label: 'Anggota Muda', value: '1.284', pct: 27, icon: 'ph-user', tone: 'brand-30', iconClass: 'text-muted' },
    { no: '02', label: 'Anggota', value: '2.518', pct: 52, icon: 'ph-user-check', tone: 'brand-55', iconClass: 'text-info' },
    { no: '03', label: 'Kader', value: '862', pct: 18, icon: 'ph-medal', tone: 'brand-80', iconClass: 'text-brand' },
    { no: '04', label: 'Kader Utama', value: '148', pct: 6, icon: 'ph-crown-simple', tone: 'brand', iconClass: 'text-accent' },
];

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    return dashboard.programs
        .filter((item) => type.value === 'semua' || item.type === type.value)
        .filter((item) => {
            if (!term) return true;
            return `${item.nama} ${item.fullName ?? ''} ${pelaksanaFor(item)} ${item.lokasi ?? ''}`
                .toLowerCase()
                .includes(term);
        })
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
});

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));

watch(pages, (value) => {
    if (currentPage.value > value) currentPage.value = value;
});

watch([query, type], () => {
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



function resetFilters() {
    query.value = '';
    type.value = 'semua';
    currentPage.value = 1;
}

function openCreate() {
    programModalOpen.value = true;
}

function confirmDelete() {
    if (!deletingProgram.value) return;

    deleteProgram(deletingProgram.value.id);
    deletingProgram.value = null;
    showToast('Event pengkaderan berhasil dihapus.', 'success');
}
</script>

<template>
    <Head title="Kaderisasi · EDO v2" />

    <PageHeader
        eyebrow="Pengembangan"
        title="Kaderisasi"
        description="Pantau jenjang kader dan kelola event pelatihan kader."
        icon="ph-graduation-cap"
    >
        <template #actions>
            <button class="btn-primary min-h-11 group" @click="openCreate">
                <span>Buat Event</span>
                <span class="btn-trail" aria-hidden="true">
                    <i class="ph-light ph-plus text-sm"></i>
                </span>
            </button>
        </template>
    </PageHeader>

    <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" v-reveal class="card p-4">
            <div class="flex items-center gap-2 text-muted">
                <i :class="['ph-light text-base', stat.icon]" aria-hidden="true"></i>
                <p class="text-[11px] font-semibold uppercase tracking-wider">{{ stat.label }}</p>
            </div>
            <p class="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{{ stat.value }}</p>
            <p :class="['text-[11px]', stat.tone]">{{ stat.note }}</p>
        </div>
    </div>

    <article v-reveal class="card mt-4 p-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
                <h3 class="text-sm font-bold">Alur Jenjang Kader</h3>
                <p class="text-xs text-muted">Dari anggota muda hingga kader utama</p>
            </div>
            <span class="badge bg-brand-soft text-brand">4 jenjang</span>
        </div>

        <ol class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <li
                v-for="step in pipeline"
                :key="step.no"
                class="relative rounded-xl border border-line bg-elevated/50 p-4"
            >
                <div class="flex items-center justify-between">
                    <span class="font-mono text-[10px] font-bold text-muted">{{ step.no }}</span>
                    <i :class="['ph-light text-lg', step.icon, step.iconClass]" aria-hidden="true"></i>
                </div>
                <p class="mt-2 text-xs font-semibold text-muted">{{ step.label }}</p>
                <p class="text-xl font-semibold tracking-tight tabular-nums">{{ step.value }}</p>
                <div class="mt-2">
                    <div class="h-1.5 rounded-full bg-line">
                        <div :class="['h-1.5 rounded-full', step.tone === 'brand' ? 'bg-brand' : step.tone === 'brand-80' ? 'bg-brand/80' : step.tone === 'brand-55' ? 'bg-brand/55' : 'bg-brand/30']" :style="{ width: `${step.pct}%` }"></div>
                    </div>
                </div>
            </li>
        </ol>
    </article>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div>
            <h3 class="text-sm font-bold">Event Pengkaderan</h3>
            <p class="mt-0.5 text-xs text-muted">Kelola agenda, pelaksana, dan pendaftaran peserta.</p>
        </div>
        <span class="badge bg-brand-soft text-brand">{{ dashboard.programs.length }} event</span>
    </div>

    <div v-reveal class="card mt-3 overflow-hidden">
        <div class="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div class="relative w-full sm:max-w-xs">
                <label for="program-search" class="sr-only">Cari event pengkaderan</label>
                <i class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
                <input id="program-search" v-model="query" type="search" class="input h-9 pl-9" placeholder="Cari event, pelaksana, tempat…" autocomplete="off" />
            </div>
            <select v-model="type" class="select h-9 w-full sm:w-44" aria-label="Filter tipe event">
                <option value="semua">Semua tipe</option>
                <option value="Formal">Formal</option>
                <option value="Non-Formal">Non-Formal</option>
            </select>
            <button class="btn-ghost btn-sm min-h-11 sm:ml-auto" @click="resetFilters">
                <i class="ph-light ph-arrow-counter-clockwise text-base" aria-hidden="true"></i>
                Reset
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="tbl min-w-[1040px]">
                <caption class="sr-only">Daftar event pengkaderan</caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th">Nama Event</th>
                        <th scope="col" class="th">Pelaksana</th>
                        <th scope="col" class="th">Tanggal Pelaksanaan</th>
                        <th scope="col" class="th">Peserta</th>
                        <th scope="col" class="th">Pendaftaran</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="row in rows" :key="row.id" class="transition-colors hover:bg-elevated/60">
                        <td class="td">
                            <div class="flex items-center gap-2.5">
                                <span class="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-soft text-brand">
                                    <img v-if="row.logo" :src="row.logo" alt="" class="h-full w-full object-cover" />
                                    <i v-else class="ph-light ph-graduation-cap text-base" aria-hidden="true"></i>
                                </span>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <Link :href="`/dashboard/kaderisasi/${row.id}`" class="block truncate font-semibold hover:text-brand">{{ row.nama }}</Link>
                                        <span class="badge shrink-0 border border-line bg-elevated text-muted">{{ row.type }}</span>
                                    </div>
                                    <p class="truncate text-[11px] text-muted">
                                        {{ row.type === 'Formal' ? row.fullName : 'Kegiatan non-formal' }}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td class="td">
                            <span class="block max-w-[10rem] truncate">{{ pelaksanaFor(row) }}</span>
                            <span v-if="row.isExternal" class="mt-0.5 inline-block text-[10px] font-semibold text-muted">Luar Trenggalek</span>
                        </td>
                        <td class="td whitespace-nowrap">
                            <span class="block font-mono text-xs">{{ formatDate(row.tanggal) }}</span>
                            <span class="block text-[10px] text-muted">{{ row.durasi }} hari</span>
                        </td>
                        <td class="td">
                            <span :class="['badge', row.peserta > 0 ? 'bg-success-soft text-success' : 'border border-line bg-elevated text-muted']">
                                {{ row.peserta }}
                            </span>
                            <span class="ml-1 whitespace-nowrap text-[10px] text-muted">/ {{ totalKuota(row) }}</span>
                        </td>
                        <td class="td">
                            <span v-if="row.registrationForced" class="badge bg-accent-soft text-accent">Dibuka paksa</span>
                            <span v-else-if="row.registrationUntil" class="whitespace-nowrap text-xs text-muted">s.d. {{ formatDate(row.registrationUntil) }}</span>
                            <span v-else class="text-xs text-muted">Tanpa batas</span>
                        </td>
                        <td class="td text-right">
                            <div class="flex items-center justify-end gap-1">
                                <Link :href="`/dashboard/kaderisasi/${row.id}`" class="icon-btn-sm" :aria-label="`Lihat ${row.nama}`" title="Lihat detail">
                                    <i class="ph-light ph-eye" aria-hidden="true"></i>
                                </Link>
                                <Link :href="`/dashboard/kaderisasi/${row.id}`" class="icon-btn-sm" :aria-label="`Ubah ${row.nama}`" title="Ubah event">
                                    <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                                </Link>
                                <button class="icon-btn-sm hover:text-danger" :aria-label="`Hapus ${row.nama}`" title="Hapus event" @click="deletingProgram = row">
                                    <i class="ph-light ph-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!rows.length">
                        <td colspan="6">
                            <EmptyState icon="ph-graduation-cap" title="Event tidak ditemukan" description="Coba ubah kata kunci atau filter." />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-col gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p class="text-xs text-muted">Menampilkan {{ showingFrom }}–{{ showingTo }} dari {{ filtered.length }} event</p>
            <Pagination v-model:page="currentPage" :pages="pages" />
        </div>
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Data peserta dan pendaftaran bersifat ilustratif. Perubahan tersimpan di sesi prototipe ini.
    </p>

    <ProgramFormModal
        :open="programModalOpen"
        :item="null"
        @close="programModalOpen = false"
        @saved="programModalOpen = false"
    />

    <ConfirmModal
        :open="!!deletingProgram"
        title="Hapus event?"
        :message="`Event “${deletingProgram?.nama ?? ''}” akan dihapus dari agenda kaderisasi.`"
        confirm-label="Hapus event"
        @close="deletingProgram = null"
        @confirm="confirmDelete"
    />

</template>
