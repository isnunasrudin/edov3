<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import LevelBadge from '@/Components/LevelBadge.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import KeanggotaanFormModal from '@/Components/KeanggotaanFormModal.vue';
import MasaKhidmatFormModal from '@/Components/MasaKhidmatFormModal.vue';
import MovePeriodeModal from '@/Components/MovePeriodeModal.vue';
import PimpinanFormModal from '@/Components/PimpinanFormModal.vue';
import { LEVELS } from '@/data/pimpinan';
import {
    anggotaById,
    dashboard,
    detachJabatan,
    detachPeriode,
    periodeById,
    updateJabatan,
    updatePimpinan,
} from '@/stores/dashboard';
import { formatDate, initials } from '@/utils/format';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const page = usePage();
const logo = '/images/edo.png';
const id = computed(() =>
    (page.url || '').split('?')[0].replace(/\/+$/, '').split('/').pop(),
);
const item = computed(() => dashboard.pimpinan.find((row) => row.id === id.value) ?? null);

const tab = ref('biodata');
const tabs = [
    { key: 'biodata', label: 'Biodata', icon: 'ph-user' },
    { key: 'periode', label: 'Periode', icon: 'ph-calendar-blank' },
    { key: 'struktur', label: 'Keanggotaan', icon: 'ph-users-three' },
];

function setTab(event, index) {
    tab.value = tabs[index].key;

    nextTick(() => {
        event.currentTarget?.parentElement
            ?.querySelectorAll('[role="tab"]')[index]?.focus();
    });
}

function cycleTab(event, step) {
    const index = tabs.findIndex((row) => row.key === tab.value);
    setTab(event, (index + step + tabs.length) % tabs.length);
}


const editOpen = ref(false);
const membershipOpen = ref(false);
const editingMembership = ref(null);
const deletingMembership = ref(null);
const periodOpen = ref(false);
const editingPeriod = ref(null);
const deletingPeriod = ref(null);
const selectedMemberships = ref([]);
const moveOpen = ref(false);

const allSelected = computed({
    get: () =>
        positions.value.length > 0 &&
        positions.value.every((row) => selectedMemberships.value.includes(row.id)),
    set: (value) => {
        selectedMemberships.value = value ? positions.value.map((row) => row.id) : [];
    },
});

const activePeriodeId = computed(
    () =>
        periods.value.find((row) => row.status === 'Aktif')?.id ??
        periods.value[0]?.id ??
        '',
);

const moveOptions = computed(() =>
    periods.value
        .filter((row) => row.id !== activePeriodeId.value)
        .map((row) => ({
            value: row.id,
            label: row.nama,
            description: `${formatDate(row.mulai)} – ${formatDate(row.selesai)}${row.status === 'Aktif' ? ' · Aktif' : ''}`,
        })),
);

watch(id, () => {
    editOpen.value = false;
    membershipOpen.value = false;
    editingMembership.value = null;
    deletingMembership.value = null;
    periodOpen.value = false;
    editingPeriod.value = null;
    deletingPeriod.value = null;
    selectedMemberships.value = [];
    moveOpen.value = false;
});

function openCreateMembership() {
    editingMembership.value = null;
    membershipOpen.value = true;
}

function openEditMembership(position) {
    editingMembership.value =
        dashboard.jabatan.find((row) => row.id === position.id) ?? position;
    membershipOpen.value = true;
}

function onMembershipSaved({ item: saved, mode }) {
    membershipOpen.value = false;
    editingMembership.value = null;
    selectedMemberships.value = selectedMemberships.value.filter(
        (memberId) => memberId !== saved.id,
    );

    if (mode === 'attached') {
        const alreadyMember = dashboard.jabatan.some(
            (row) =>
                row.id !== saved.id &&
                row.anggotaId === saved.anggotaId &&
                row.pimpinanId === saved.pimpinanId,
        );

        if (!alreadyMember) {
            updatePimpinan(item.value.id, {
                members: Number(item.value.members ?? 0) + 1,
            });
        }
    }

    const member = anggotaById(saved.anggotaId);
    showToast(
        mode === 'attached'
            ? `${member?.nama ?? 'Anggota'} ditambahkan ke struktur ${item.value?.nama ?? 'pimpinan'}.`
            : `Keanggotaan ${member?.nama ?? 'anggota'} berhasil diperbarui.`,
    );
}

function confirmDeleteMembership() {
    if (!deletingMembership.value) return;

    const member = anggotaById(deletingMembership.value.anggotaId);
    const detachingId = deletingMembership.value.id;
    const remainingRoles = dashboard.jabatan.some(
        (row) =>
            row.id !== detachingId &&
            row.anggotaId === deletingMembership.value.anggotaId &&
            row.pimpinanId === item.value.id,
    );
    detachJabatan(detachingId);

    if (!remainingRoles) {
        updatePimpinan(item.value.id, {
            members: Math.max(0, Number(item.value.members ?? 0) - 1),
        });
    }
    selectedMemberships.value = selectedMemberships.value.filter(
        (memberId) => memberId !== deletingMembership.value.id,
    );
    deletingMembership.value = null;
    showToast(`${member?.nama ?? 'Pengurus'} dilepas dari struktur.`);
}

function openCreatePeriod() {
    editingPeriod.value = null;
    periodOpen.value = true;
}

function openEditPeriod(period) {
    editingPeriod.value = period;
    periodOpen.value = true;
}

function onPeriodSaved(saved) {
    periodOpen.value = false;
    editingPeriod.value = null;

    if (saved.status !== 'Aktif' && !periods.value.some((row) => row.status === 'Aktif')) {
        updatePimpinan(item.value.id, { periode: saved.nama });
    }

    showToast(`${periodLabel.value} ${saved.nama} berhasil disimpan.`);
}

function remainingPeriode() {
    return (
        dashboard.periode.find(
            (row) => row.pimpinanId === id.value && row.status === 'Aktif',
        ) ??
        dashboard.periode.find((row) => row.pimpinanId === id.value) ??
        null
    );
}

function confirmDeletePeriod() {
    if (!deletingPeriod.value) return;

    const deleted = detachPeriode(deletingPeriod.value.id);

    if (!deleted) {
        showToast('Periode masih memiliki jabatan. Pindahkan atau lepas pengurus terlebih dahulu.', 'error');
        deletingPeriod.value = null;
        return;
    }

    const remaining = remainingPeriode();
    updatePimpinan(item.value.id, { periode: remaining?.nama ?? '—' });
    showToast(`Masa khidmat ${deletingPeriod.value.nama} dihapus.`);
    deletingPeriod.value = null;
}

function moveMemberships(periodeId) {
    const target = periodeById(periodeId);
    if (!target) return;

    const count = selectedMemberships.value.length;
    const selectedRows = dashboard.jabatan.filter((row) =>
        selectedMemberships.value.includes(row.id),
    );
    const conflict = selectedRows.some((row) =>
        dashboard.jabatan.some(
            (other) =>
                other.id !== row.id &&
                other.anggotaId === row.anggotaId &&
                other.pimpinanId === row.pimpinanId &&
                other.periodeId === target.id,
        ),
    );

    if (conflict) {
        showToast(
            'Ada pengurus yang sudah terdaftar pada periode tujuan. Periksa kembali pilihan.',
            'error',
        );
        return;
    }

    selectedMemberships.value.forEach((membershipId) => {
        updateJabatan(membershipId, {
            periodeId: target.id,
            mulai: target.mulai,
            selesai: target.selesai,
        });
    });

    selectedMemberships.value = [];
    moveOpen.value = false;
    showToast(`${count} pengurus dipindahkan ke periode ${target.nama}.`);
}

const periodLabel = computed(() => (item.value?.org === 'IPPNU' ? 'Masa Bakti' : 'Masa Khidmat'));

const periods = computed(() =>
    dashboard.periode.filter((row) => row.pimpinanId === id.value),
);

const sortedPeriods = computed(() =>
    [...periods.value].sort(
        (a, b) =>
            Number(b.status === 'Aktif') - Number(a.status === 'Aktif') ||
            b.mulai.localeCompare(a.mulai),
    ),
);

const positions = computed(() =>
    dashboard.jabatan
        .filter((row) => row.pimpinanId === id.value)
        .map((row) => ({
            ...row,
            anggota: anggotaById(row.anggotaId),
            periode: periodeById(row.periodeId),
        })),
);

function levelLabel(code) {
    return LEVELS.find((level) => level.code === code)?.label ?? code;
}

function jabatanCount(periodeId) {
    return dashboard.jabatan.filter((row) => row.periodeId === periodeId).length;
}

const identityFields = computed(() => {
    if (!item.value) return [];

    return [
        { label: 'Organisasi', value: item.value.org },
        { label: 'Level', value: `${item.value.level} — ${levelLabel(item.value.level)}` },
        { label: 'Wilayah', value: item.value.region },
        { label: 'Induk kepengurusan', value: item.value.parent },
        { label: 'Status', value: item.value.status },
    ];
});

const leadershipFields = computed(() => {
    if (!item.value) return [];

    return [
        { label: 'Ketua', value: item.value.ketua },
        { label: 'Sekretaris', value: item.value.sekretaris },
        { label: 'Periode aktif', value: item.value.periode },
        { label: 'Jumlah pengurus', value: String(item.value.members) },
        { label: 'Nomor SK', value: item.value.sk },
    ];
});
</script>

<template>
    <Head :title="item ? `${item.nama} · EDO v2` : 'Detail Pimpinan · EDO v2'" />

    <div v-if="item">
        <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
                <Link href="/dashboard/pimpinan" class="btn-ghost btn-sm min-h-11">
                    <i class="ph-light ph-arrow-left text-base" aria-hidden="true"></i>
                    Kembali
                </Link>
                <h1 class="text-sm font-semibold md:hidden">Detail Pimpinan</h1>
                <span class="hidden truncate text-xs text-muted md:inline">Detail pimpinan</span>
            </div>
            <button class="btn-secondary min-h-11" @click="editOpen = true">
                <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                Ubah Data
            </button>
        </div>

        <!-- Hero -->
        <div class="card mt-4 overflow-hidden">
            <div class="relative bg-gradient-to-br from-[#06172f] via-[#0a2858] to-[#1e3a8a] p-6 text-white sm:p-8">
                <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/25 blur-3xl" aria-hidden="true"></div>

                <div class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <span class="grid h-20 w-20 aspect-square shrink-0 place-items-center rounded-2xl bg-white p-3 ring-1 ring-white/20 sm:h-24 sm:w-24">
                        <img
                            :src="logo"
                            alt=""
                            class="block h-full w-full select-none object-contain object-center"
                        />
                    </span>

                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <LevelBadge :level="item.level" />
                            <OrgBadge :org="item.org" />
                            <StatusBadge :status="item.status" />
                        </div>
                        <h2 class="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{{ item.nama }}</h2>
                        <p class="mt-1 text-xs text-white/75">{{ item.region }} · {{ item.periode }}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Pengurus</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ item.members }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Periode</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ periods.length }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Jabatan</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ positions.length }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Organisasi</p>
                    <p class="mt-1 text-sm font-semibold">{{ item.org }}</p>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="card mt-4 overflow-hidden">
            <div class="flex overflow-x-auto border-b border-line px-3 pt-3" role="tablist" aria-label="Detail pimpinan">
                <button
                    v-for="itemTab in tabs"
                    :id="`tab-${itemTab.key}`"
                    :key="itemTab.key"
                    role="tab"
                    :aria-selected="tab === itemTab.key"
                    :aria-controls="`panel-${itemTab.key}`"
                    :tabindex="tab === itemTab.key ? 0 : -1"
                    :class="[
                        'inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-t-xl px-3 text-xs font-bold transition sm:px-4',
                        tab === itemTab.key ? 'border-b-2 border-brand text-brand' : 'text-muted hover:text-ink',
                    ]"
                    @click="tab = itemTab.key"
                    @keydown.right.prevent="cycleTab($event, 1)"
                    @keydown.left.prevent="cycleTab($event, -1)"
                    @keydown.home.prevent="setTab($event, 0)"
                    @keydown.end.prevent="setTab($event, tabs.length - 1)"
                >
                    <i :class="['ph-light text-base', itemTab.icon]" aria-hidden="true"></i>
                    {{ itemTab.label }}
                    <span v-if="itemTab.key === 'periode'" class="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted">{{ periods.length }}</span>
                    <span v-else-if="itemTab.key === 'struktur'" class="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted">{{ positions.length }}</span>
                </button>
            </div>

            <div class="p-5 sm:p-6">
                <!-- Biodata -->
                <div v-if="tab === 'biodata'" id="panel-biodata" role="tabpanel" aria-labelledby="tab-biodata" tabindex="0">
                    <div>
                        <h2 class="text-sm font-bold">Biodata Pimpinan</h2>
                        <p class="mt-1 text-xs text-muted">Identitas kepengurusan dan pimpinan harian.</p>
                    </div>

                    <div class="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section>
                            <div class="flex items-center gap-2.5 border-b border-line pb-3">
                                <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                                    <i class="ph-light ph-identification-card text-lg" aria-hidden="true"></i>
                                </span>
                                <div>
                                    <h3 class="text-sm font-bold">Identitas</h3>
                                    <p class="text-[11px] text-muted">Organisasi dan wilayah kepengurusan.</p>
                                </div>
                            </div>

                            <dl class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div v-for="row in identityFields" :key="row.label" class="rounded-xl border border-line bg-elevated/40 p-3">
                                    <dt class="text-[10px] font-semibold uppercase tracking-wider text-muted">{{ row.label }}</dt>
                                    <dd class="mt-1 text-sm font-medium">{{ row.value }}</dd>
                                </div>
                            </dl>
                        </section>

                        <section class="lg:border-l lg:border-line lg:pl-6">
                            <div class="flex items-center gap-2.5 border-b border-line pb-3">
                                <span class="grid h-9 w-9 place-items-center rounded-xl bg-info-soft text-info">
                                    <i class="ph-light ph-users-three text-lg" aria-hidden="true"></i>
                                </span>
                                <div>
                                    <h3 class="text-sm font-bold">Pimpinan harian</h3>
                                    <p class="text-[11px] text-muted">Pengurus inti dan administrasi.</p>
                                </div>
                            </div>

                            <dl class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div v-for="row in leadershipFields" :key="row.label" class="rounded-xl border border-line bg-elevated/40 p-3">
                                    <dt class="text-[10px] font-semibold uppercase tracking-wider text-muted">{{ row.label }}</dt>
                                    <dd class="mt-1 text-sm font-medium">{{ row.value }}</dd>
                                </div>
                            </dl>
                        </section>
                    </div>

                    <section class="mt-4 rounded-xl border border-line bg-elevated/30 p-4">
                        <div class="flex items-center gap-2.5">
                            <span class="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
                                <i class="ph-light ph-map-pin text-lg" aria-hidden="true"></i>
                            </span>
                            <div>
                                <h3 class="text-sm font-bold">Alamat sekretariat</h3>
                                <p class="text-[11px] text-muted">{{ item.alamat }}</p>
                            </div>
                        </div>
                    </section>

                </div>

                <!-- Periode -->
                <div v-if="tab === 'periode'" id="panel-periode" role="tabpanel" aria-labelledby="tab-periode" tabindex="0">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 class="text-sm font-bold">Rincian {{ periodLabel }}</h2>
                            <p class="mt-1 text-xs text-muted">Masa khidmat, status, dan jumlah jabatan.</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button class="btn-primary min-h-11" @click="openCreatePeriod">
                                <i class="ph-light ph-plus" aria-hidden="true"></i>
                                Tambah {{ periodLabel }}
                            </button>
                            <span class="badge bg-brand-soft text-brand">{{ periods.length }} periode</span>
                        </div>
                    </div>

                    <div class="mt-5 overflow-x-auto">
                        <table class="tbl min-w-[760px]">
                            <caption class="sr-only">Daftar {{ periodLabel.toLowerCase() }} pimpinan</caption>
                            <thead class="bg-elevated/70">
                                <tr>
                                    <th scope="col" class="th">Periode</th>
                                    <th scope="col" class="th">Rentang</th>
                                    <th scope="col" class="th">Status</th>
                                    <th scope="col" class="th">Jabatan</th>
                                    <th scope="col" class="th text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-line">
                                <tr v-for="period in sortedPeriods" :key="period.id" class="transition-colors hover:bg-elevated/60">
                                    <td class="td">
                                        <p class="font-mono text-sm font-semibold">{{ period.nama }}</p>
                                        <p class="mt-0.5 max-w-[16rem] truncate text-[11px] text-muted">{{ period.catatan }}</p>
                                    </td>
                                    <td class="td whitespace-nowrap text-xs text-muted">{{ formatDate(period.mulai) }} – {{ formatDate(period.selesai) }}</td>
                                    <td class="td"><StatusBadge :status="period.status" /></td>
                                    <td class="td font-mono text-xs">{{ jabatanCount(period.id) }}</td>
                                    <td class="td text-right">
                                        <div class="flex items-center justify-end gap-1">
                                            <button class="icon-btn-sm h-11 w-11" :aria-label="`Ubah periode ${period.nama}`" title="Ubah periode" @click="openEditPeriod(period)">
                                                <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                                            </button>
                                            <button
                                                class="icon-btn-sm h-11 w-11 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                                                :aria-label="`Hapus periode ${period.nama}`"
                                                :title="jabatanCount(period.id) ? 'Masih ada jabatan pada periode ini' : 'Hapus periode'"
                                                :disabled="jabatanCount(period.id) > 0"
                                                @click="deletingPeriod = period"
                                            >
                                                <i class="ph-light ph-trash" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="!periods.length">
                                    <td colspan="5"><EmptyState icon="ph-calendar-blank" title="Belum ada periode" description="Tambahkan masa khidmat pertama untuk pimpinan ini." /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p class="mt-4 text-[11px] text-muted">
                        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
                        {{ periodLabel }} dikelola langsung dari detail pimpinan.
                    </p>
                </div>

                <!-- Keanggotaan -->
                <div v-if="tab === 'struktur'" id="panel-struktur" role="tabpanel" aria-labelledby="tab-struktur" tabindex="0">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 class="text-sm font-bold">Keanggotaan Kepengurusan</h2>
                            <p class="mt-1 text-xs text-muted">Jabatan dan anggota yang mengisi struktur pimpinan.</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button v-if="selectedMemberships.length && moveOptions.length" class="btn-secondary min-h-11" @click="moveOpen = true">
                                <i class="ph-light ph-arrows-left-right" aria-hidden="true"></i>
                                Pindah Periode ({{ selectedMemberships.length }})
                            </button>
                            <button class="btn-primary min-h-11" @click="openCreateMembership">
                                <i class="ph-light ph-plus" aria-hidden="true"></i>
                                Tambah Pengurus
                            </button>
                        </div>
                    </div>

                    <div class="mt-5 overflow-x-auto">
                        <table class="tbl min-w-[980px]">
                            <caption class="sr-only">Daftar keanggotaan pimpinan</caption>
                            <thead class="bg-elevated/70">
                                <tr>
                                    <th scope="col" class="th w-12">
                                        <input v-model="allSelected" type="checkbox" class="h-4 w-4 rounded border-line text-brand focus:ring-brand/30" aria-label="Pilih semua pengurus" />
                                    </th>
                                    <th scope="col" class="th">Anggota</th>
                                    <th scope="col" class="th">Jabatan</th>
                                    <th scope="col" class="th">Periode</th>
                                    <th scope="col" class="th">Status</th>
                                    <th scope="col" class="th text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-line">
                                <tr v-for="position in positions" :key="position.id" class="transition-colors hover:bg-elevated/60">
                                    <td class="td">
                                        <label class="grid h-11 w-8 cursor-pointer place-items-center">
                                            <input
                                                v-model="selectedMemberships"
                                                :value="position.id"
                                                type="checkbox"
                                                class="h-4 w-4 rounded border-line text-brand focus:ring-brand/30"
                                                :aria-label="`Pilih ${position.anggota?.nama ?? 'pengurus'}`"
                                            />
                                        </label>
                                    </td>
                                    <td class="td">
                                        <Link :href="`/dashboard/anggota/${position.anggotaId}`" class="flex items-center gap-2.5">
                                            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[10px] font-bold text-brand">
                                                {{ initials(position.anggota?.nama ?? '—') }}
                                            </span>
                                            <span class="min-w-0">
                                                <span class="block truncate text-sm font-semibold hover:text-brand">{{ position.anggota?.nama ?? '—' }}</span>
                                                <span class="block truncate text-[11px] text-muted">{{ position.anggota?.nia ?? '—' }}</span>
                                            </span>
                                        </Link>
                                    </td>
                                    <td class="td"><span class="badge bg-brand-soft text-brand">{{ position.nama }}</span></td>
                                    <td class="td whitespace-nowrap font-mono text-xs text-muted">{{ position.periode?.nama ?? '—' }}</td>
                                    <td class="td"><StatusBadge :status="position.status" /></td>
                                    <td class="td text-right">
                                        <div class="flex items-center justify-end gap-1">
                                            <button class="icon-btn-sm h-11 w-11" :aria-label="`Ubah keanggotaan ${position.anggota?.nama ?? ''}`" title="Ubah keanggotaan" @click="openEditMembership(position)">
                                                <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                                            </button>
                                            <button class="icon-btn-sm h-11 w-11 hover:text-danger" :aria-label="`Lepas ${position.anggota?.nama ?? ''}`" title="Lepas dari struktur" @click="deletingMembership = position">
                                                <i class="ph-light ph-user-minus" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="!positions.length">
                                    <td colspan="6"><EmptyState icon="ph-users-three" title="Belum ada pengurus" description="Tambahkan pengurus untuk mulai mengisi struktur." /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p class="mt-3 text-[11px] text-muted">
                        Pilih pengurus dengan checkbox untuk memindahkan periode secara massal.
                        <span v-if="selectedMemberships.length"> {{ selectedMemberships.length }} dipilih.</span>
                    </p>
                </div>
            </div>
        </div>

        <PimpinanFormModal :open="editOpen" :item="item" @close="editOpen = false" />
        <KeanggotaanFormModal
            :open="membershipOpen"
            :item="editingMembership"
            :pimpinan-id="item.id"
            @close="membershipOpen = false; editingMembership = null"
            @saved="onMembershipSaved"
        />
        <MasaKhidmatFormModal
            :open="periodOpen"
            :label="periodLabel"
            :item="editingPeriod"
            :pimpinan-id="item.id"
            @close="periodOpen = false; editingPeriod = null"
            @saved="onPeriodSaved"
        />
        <MovePeriodeModal
            :open="moveOpen"
            :count="selectedMemberships.length"
            :options="moveOptions"
            :default-periode-id="activePeriodeId"
            @close="moveOpen = false"
            @confirm="moveMemberships"
        />
        <ConfirmModal
            :open="!!deletingMembership"
            title="Lepas Pengurus"
            confirm-label="Lepas"
            :message="`Lepas ${deletingMembership?.anggota?.nama ?? 'pengurus'} dari struktur ${item.nama}? Jabatan dan relasi periode pada baris ini akan dihapus.`"
            @close="deletingMembership = null"
            @confirm="confirmDeleteMembership"
        />
        <ConfirmModal
            :open="!!deletingPeriod"
            title="Hapus Periode"
            confirm-label="Hapus"
            :message="`Hapus masa khidmat ${deletingPeriod?.nama ?? ''}? Tindakan ini hanya dapat dilakukan jika tidak ada jabatan di dalamnya.`"
            @close="deletingPeriod = null"
            @confirm="confirmDeletePeriod"
        />
    </div>

    <div v-else class="card p-10 text-center">
        <i class="ph-light ph-identification-card mx-auto block text-4xl text-muted" aria-hidden="true"></i>
        <h2 class="mt-3 text-lg font-bold">Pimpinan tidak ditemukan</h2>
        <p class="mt-1 text-sm text-muted">Data pimpinan mungkin sudah dihapus.</p>
        <Link href="/dashboard/pimpinan" class="btn-primary mt-5">Kembali ke daftar pimpinan</Link>
    </div>
</template>
