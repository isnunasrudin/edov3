<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import LevelBadge from '@/Components/LevelBadge.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import ProgressBar from '@/Components/ProgressBar.vue';
import AnggotaBiodataForm from '@/Components/AnggotaBiodataForm.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import KeanggotaanFormModal from '@/Components/KeanggotaanFormModal.vue';
import { anggotaById, dashboard, detachJabatan, periodeById, pimpinanById, updatePimpinan } from '@/stores/dashboard';
import { formatDate, initials } from '@/utils/format';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const page = usePage();
const id = computed(() =>
    (page.url || '').split('?')[0].replace(/\/+$/, '').split('/').pop(),
);
const item = computed(() => dashboard.anggota.find((row) => row.id === id.value) ?? null);

const tab = ref('biodata');
const tabs = [
    { key: 'biodata', label: 'Biodata' },
    { key: 'pendidikan', label: 'Pendidikan' },
    { key: 'jabatan', label: 'Keanggotaan' },
    { key: 'pimpinan', label: 'Pimpinan' },
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


const membershipOpen = ref(false);
const editingMembership = ref(null);
const deletingMembership = ref(null);

watch(id, () => {
    membershipOpen.value = false;
    editingMembership.value = null;
    deletingMembership.value = null;
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

    const pimpinan = pimpinanById(saved.pimpinanId);

    if (mode === 'attached' && pimpinan) {
        const alreadyMember = dashboard.jabatan.some(
            (row) =>
                row.id !== saved.id &&
                row.anggotaId === saved.anggotaId &&
                row.pimpinanId === saved.pimpinanId,
        );

        if (!alreadyMember) {
            updatePimpinan(pimpinan.id, {
                members: Number(pimpinan.members ?? 0) + 1,
            });
        }
    }

    showToast(
        mode === 'attached'
            ? `Keanggotaan pada ${pimpinan?.nama ?? 'pimpinan'} berhasil ditambahkan.`
            : 'Keanggotaan berhasil diperbarui.',
    );
}

function confirmDeleteMembership() {
    if (!deletingMembership.value) return;

    const pimpinan = pimpinanById(deletingMembership.value.pimpinanId);
    const detachingId = deletingMembership.value.id;
    const remainingRoles = dashboard.jabatan.some(
        (row) =>
            row.id !== detachingId &&
            row.anggotaId === deletingMembership.value.anggotaId &&
            row.pimpinanId === deletingMembership.value.pimpinanId,
    );
    detachJabatan(detachingId);

    if (pimpinan && !remainingRoles) {
        updatePimpinan(pimpinan.id, {
            members: Math.max(0, Number(pimpinan.members ?? 0) - 1),
        });
    }

    deletingMembership.value = null;
    showToast(`Keanggotaan pada ${pimpinan?.nama ?? 'pimpinan'} dilepas.`);
}

const education = computed(() =>
    dashboard.pendidikan.filter((row) => row.anggotaId === id.value),
);

const positions = computed(() =>
    dashboard.jabatan
        .filter((row) => row.anggotaId === id.value)
        .map((row) => ({
            ...row,
            pimpinan: pimpinanById(row.pimpinanId),
            periode: periodeById(row.periodeId),
        })),
);

const pimpinanHistory = computed(() => {
    const map = new Map();

    positions.value.forEach((row) => {
        if (row.pimpinan) map.set(row.pimpinan.id, row.pimpinan);
    });

    return [...map.values()];
});


</script>

<template>
    <Head :title="item ? `${item.nama} · EDO v2` : 'Detail Anggota · EDO v2'" />

    <div v-if="item">
        <div class="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/anggota" class="btn-ghost btn-sm min-h-11">
                <i class="ph-light ph-arrow-left text-base" aria-hidden="true"></i>
                Kembali
            </Link>
            <h1 class="text-sm font-semibold md:hidden">Detail Anggota</h1>
            <span class="hidden truncate text-xs text-muted md:inline">Detail anggota</span>
        </div>

        <!-- Hero -->
        <div class="card mt-4 overflow-hidden">
            <div class="relative bg-gradient-to-br from-[#06172f] via-[#0a2858] to-[#1e3a8a] p-6 text-white sm:p-8">
                <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/25 blur-3xl" aria-hidden="true"></div>

                <div class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <span class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/10 font-mono text-xl font-bold text-white ring-1 ring-white/15">
                        <img v-if="item.picture" :src="item.picture" alt="" class="h-full w-full object-cover" />
                        <template v-else>{{ initials(item.nama) }}</template>
                    </span>

                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <OrgBadge :org="item.org" />
                            <StatusBadge :status="item.status" />
                            <span class="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/70">
                                {{ item.jenjang }}
                            </span>
                        </div>
                        <h2 class="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{{ item.nama }}</h2>
                        <p class="mt-1 text-xs text-white/75">
                            {{ item.nickname }} · {{ item.nia }} · PAC {{ item.pac }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Pendidikan</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ education.length }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Jabatan</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ positions.length }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Pimpinan</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ pimpinanHistory.length }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Progres</p>
                    <div class="mt-2 flex items-center gap-2">
                        <ProgressBar :value="item.progress" class="flex-1" />
                        <span class="font-mono text-xs font-semibold">{{ item.progress }}%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mt-4 flex flex-wrap items-center gap-1 rounded-xl bg-elevated p-1" role="tablist" aria-label="Detail anggota">
            <button
                v-for="itemTab in tabs"
                :id="`tab-${itemTab.key}`"
                :key="itemTab.key"
                role="tab"
                :aria-selected="tab === itemTab.key"
                :aria-controls="`panel-${itemTab.key}`"
                :tabindex="tab === itemTab.key ? 0 : -1"
                :class="[
                    'inline-flex min-h-11 cursor-pointer items-center rounded-lg px-2.5 text-xs font-bold transition sm:px-4',
                    tab === itemTab.key ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
                ]"
                @click="tab = itemTab.key"
                @keydown.right.prevent="cycleTab($event, 1)"
                @keydown.left.prevent="cycleTab($event, -1)"
                @keydown.home.prevent="setTab($event, 0)"
                @keydown.end.prevent="setTab($event, tabs.length - 1)"
            >
                {{ itemTab.label }}
            </button>
        </div>

        <!-- Biodata -->
        <div v-show="tab === 'biodata'" id="panel-biodata" role="tabpanel" aria-labelledby="tab-biodata" tabindex="0" class="card mt-4 p-5 sm:p-6">
            <div class="mb-5">
                <h2 class="text-sm font-bold">Biodata Anggota</h2>
                <p class="mt-1 text-xs text-muted">Perbarui data induk, domisili, dan profil anggota.</p>
            </div>
            <AnggotaBiodataForm :item="item" />
        </div>

        <!-- Pendidikan -->
        <div v-if="tab === 'pendidikan'" id="panel-pendidikan" role="tabpanel" aria-labelledby="tab-pendidikan" tabindex="0" class="card mt-4 p-5 sm:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-sm font-bold">Riwayat Pendidikan</h2>
                    <p class="mt-1 text-xs text-muted">Pendidikan formal dan pesantren.</p>
                </div>
                <span class="badge bg-brand-soft text-brand">{{ education.length }} data</span>
            </div>

            <div v-if="education.length" class="mt-4 space-y-3">
                <article v-for="row in education" :key="row.id" class="rounded-xl border border-line p-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="badge bg-brand-soft text-brand">{{ row.jenjang }}</span>
                            <p class="text-sm font-bold">{{ row.institusi }}</p>
                        </div>
                        <StatusBadge :status="row.status" />
                    </div>
                    <p class="mt-1 text-xs text-muted">{{ row.jurusan || '—' }} · {{ row.tahunMulai }}–{{ row.tahunSelesai }}</p>
                    <p class="mt-1 text-[11px] text-muted">{{ row.alamat }}</p>
                </article>
            </div>
            <p v-else class="mt-4 rounded-xl bg-elevated p-4 text-xs text-muted">Belum ada riwayat pendidikan.</p>
        </div>

        <!-- Jabatan -->
        <div v-if="tab === 'jabatan'" id="panel-jabatan" role="tabpanel" aria-labelledby="tab-jabatan" tabindex="0" class="card mt-4 p-5 sm:p-6">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 class="text-sm font-bold">Riwayat Keanggotaan</h2>
                    <p class="mt-1 text-xs text-muted">Pimpinan, jabatan, dan periode yang pernah/sedang diikuti.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button class="btn-primary min-h-11" @click="openCreateMembership">
                        <i class="ph-light ph-plus" aria-hidden="true"></i>
                        Tambah
                    </button>
                </div>
            </div>

            <div v-if="positions.length" class="mt-4 space-y-2">
                <div v-for="row in positions" :key="row.id" class="flex flex-col gap-2 rounded-xl border border-line p-3 sm:flex-row sm:items-center">
                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="badge bg-brand-soft text-brand">{{ row.nama }}</span>
                            <Link :href="`/dashboard/pimpinan/${row.pimpinanId}`" class="text-sm font-semibold hover:text-brand">
                                {{ row.pimpinan?.nama ?? '—' }}
                            </Link>
                        </div>
                        <p class="mt-1 text-[11px] text-muted">
                            {{ row.periode?.nama ?? '—' }} · {{ row.mulai ? formatDate(row.mulai) : '—' }} – {{ row.selesai ? formatDate(row.selesai) : '—' }}
                        </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 sm:justify-end">
                        <StatusBadge :status="row.status" />
                        <button class="icon-btn-sm h-11 w-11" :aria-label="`Ubah keanggotaan di ${row.pimpinan?.nama ?? 'pimpinan'}`" title="Ubah keanggotaan" @click="openEditMembership(row)">
                            <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                        </button>
                        <button class="icon-btn-sm h-11 w-11 hover:text-danger" :aria-label="`Lepas keanggotaan di ${row.pimpinan?.nama ?? 'pimpinan'}`" title="Lepas keanggotaan" @click="deletingMembership = row">
                            <i class="ph-light ph-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
            <p v-else class="mt-4 rounded-xl bg-elevated p-4 text-xs text-muted">Belum ada riwayat keanggotaan. Tambahkan jabatan untuk menghubungkan anggota dengan pimpinan.</p>
        </div>

        <!-- Pimpinan -->
        <div v-if="tab === 'pimpinan'" id="panel-pimpinan" role="tabpanel" aria-labelledby="tab-pimpinan" tabindex="0" class="card mt-4 p-5 sm:p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-sm font-bold">Pimpinan Terkait</h2>
                    <p class="mt-1 text-xs text-muted">Pimpinan tempat anggota pernah/sedang menjabat.</p>
                </div>
                <span class="badge bg-brand-soft text-brand">{{ pimpinanHistory.length }} pimpinan</span>
            </div>

            <div v-if="pimpinanHistory.length" class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                    v-for="pimpinan in pimpinanHistory"
                    :key="pimpinan.id"
                    :href="`/dashboard/pimpinan/${pimpinan.id}`"
                    class="card card-lift flex items-center gap-3 p-4"
                >
                    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                        <i class="ph-light ph-identification-card text-lg" aria-hidden="true"></i>
                    </span>
                    <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-semibold">{{ pimpinan.nama }}</span>
                        <span class="block truncate text-[11px] text-muted">{{ pimpinan.level }} · {{ pimpinan.org }} · {{ pimpinan.region }}</span>
                    </span>
                    <LevelBadge :level="pimpinan.level" />
                </Link>
            </div>
            <p v-else class="mt-4 rounded-xl bg-elevated p-4 text-xs text-muted">Belum terhubung dengan pimpinan.</p>
        </div>

        <KeanggotaanFormModal
            :open="membershipOpen"
            :item="editingMembership"
            :anggota-id="item.id"
            @close="membershipOpen = false; editingMembership = null"
            @saved="onMembershipSaved"
        />
        <ConfirmModal
            :open="!!deletingMembership"
            title="Lepas Keanggotaan"
            confirm-label="Lepas"
            :message="`Lepas keanggotaan di ${deletingMembership?.pimpinan?.nama ?? 'pimpinan'}? Relasi jabatan dan periode pada baris ini akan dihapus.`"
            @close="deletingMembership = null"
            @confirm="confirmDeleteMembership"
        />
    </div>

    <div v-else class="card p-10 text-center">
        <i class="ph-light ph-users mx-auto block text-4xl text-muted" aria-hidden="true"></i>
        <h2 class="mt-3 text-lg font-bold">Anggota tidak ditemukan</h2>
        <p class="mt-1 text-sm text-muted">Data anggota mungkin sudah dihapus.</p>
        <Link href="/dashboard/anggota" class="btn-primary mt-5">Kembali ke daftar anggota</Link>
    </div>
</template>
