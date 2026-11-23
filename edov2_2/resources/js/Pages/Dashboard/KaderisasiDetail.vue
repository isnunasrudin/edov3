<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import KaderisasiEventForm from '@/Components/KaderisasiEventForm.vue';
import KaderisasiMateriModal from '@/Components/KaderisasiMateriModal.vue';
import KaderisasiNilaiForm from '@/Components/KaderisasiNilaiForm.vue';
import KaderisasiAdministrasiForm from '@/Components/KaderisasiAdministrasiForm.vue';
import { anggotaById, dashboard, deleteProgram, pimpinanById } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { formatDate, formatLongDate, initials } from '@/utils/format';
import { registrationOpen as isRegistrationOpen, totalKuota } from '@/utils/kaderisasi';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const page = usePage();
const id = computed(() =>
    (page.url || '').split('?')[0].replace(/\/+$/, '').split('/').pop(),
);
const item = computed(() => dashboard.programs.find((row) => row.id === id.value) ?? null);

const tab = ref('kegiatan');
const tabs = [
    { key: 'kegiatan', label: 'Kegiatan' },
    { key: 'peserta', label: 'Peserta' },
    { key: 'materi', label: 'Materi & Nilai' },
    { key: 'administrasi', label: 'Administrasi' },
];

const deleting = ref(false);
const materialModalOpen = ref(false);

watch(id, () => {
    materialModalOpen.value = false;
});

const pimpinan = computed(() => (item.value?.pimpinanId ? pimpinanById(item.value.pimpinanId) : null));
const pelaksana = computed(() =>
    item.value?.isExternal ? item.value.externalPelaksana || '—' : pimpinan.value?.nama ?? '—',
);
const total = computed(() => totalKuota(item.value));
const remainingKuota = computed(() =>
    Math.max(0, total.value - Number(item.value?.peserta ?? 0)),
);

const participants = computed(() =>
    (item.value?.pesertaIds ?? [])
        .map((anggotaId) => anggotaById(anggotaId))
        .filter(Boolean),
);

const registrationOpen = computed(() => isRegistrationOpen(item.value));
const registrationLabel = computed(() => {
    if (!item.value) return '—';
    if (item.value.registrationForced) return 'Dibuka paksa';
    if (item.value.registrationUntil) return `s.d. ${formatDate(item.value.registrationUntil)}`;
    return 'Tanpa batas';
});

const registrationLink = computed(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/register?t=${item.value?.id ?? ''}`;
});

function selectTab(key) {
    tab.value = key;
}

function setTab(event, index) {
    selectTab(tabs[index].key);

    nextTick(() => {
        event.currentTarget?.parentElement
            ?.querySelectorAll('[role="tab"]')[index]?.focus();
    });
}

function cycleTab(event, step) {
    const index = tabs.findIndex((row) => row.key === tab.value);
    setTab(event, (index + step + tabs.length) % tabs.length);
}

async function copyLink() {
    try {
        await navigator.clipboard.writeText(registrationLink.value);
        showToast('Tautan pendaftaran berhasil disalin.', 'success');
    } catch {
        showToast('Tautan tidak dapat disalin otomatis. Salin manual dari tautan yang tertera.', 'error');
    }
}

function confirmDelete() {
    if (!item.value) return;

    deleteProgram(item.value.id);
    deleting.value = false;
    showToast('Event pengkaderan berhasil dihapus.', 'success');
    router.visit('/dashboard/kaderisasi');
}
</script>

<template>
    <Head :title="item ? `${item.fullName || item.nama} · EDO v2` : 'Detail Kaderisasi · EDO v2'" />

    <div v-if="item">
        <div class="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/kaderisasi" class="btn-ghost btn-sm min-h-11">
                <i class="ph-light ph-arrow-left text-base" aria-hidden="true"></i>
                Kembali
            </Link>
            <h1 class="text-sm font-semibold md:hidden">Detail Kaderisasi</h1>
            <span class="hidden truncate text-xs text-muted md:inline">Detail event pengkaderan</span>
        </div>

        <!-- Hero -->
        <div class="card mt-4 overflow-hidden">
            <div class="relative bg-gradient-to-br from-[#06172f] via-[#0a2858] to-[#1e3a8a] p-6 text-white sm:p-8">
                <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/25 blur-3xl" aria-hidden="true"></div>

                <div class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <span class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                        <img v-if="item.logo" :src="item.logo" alt="" class="h-full w-full object-cover" />
                        <i v-else class="ph-light ph-graduation-cap text-3xl" aria-hidden="true"></i>
                    </span>

                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80">{{ item.type }}</span>
                            <StatusBadge :status="item.status" />
                        </div>
                        <h2 class="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{{ item.fullName || item.nama }}</h2>
                        <p class="mt-1 text-xs text-white/75">{{ pelaksana }} · {{ formatLongDate(item.tanggal) }}{{ item.startTime ? ` · ${item.startTime}` : '' }} · {{ item.durasi }} hari</p>
                    </div>

                    <div class="w-full shrink-0 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:w-80">
                        <p class="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                            <i class="ph-light ph-link text-sm" aria-hidden="true"></i>
                            Link Pendaftaran
                        </p>

                        <template v-if="registrationOpen">
                            <p class="mt-2 text-[11px] text-white/70">{{ registrationLabel }}</p>
                            <a :href="registrationLink" class="mt-1.5 block break-all text-xs font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white">
                                {{ registrationLink }}
                            </a>
                            <button type="button" class="mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-[#0a2858] transition hover:bg-white/90 active:scale-[0.98]" @click="copyLink">
                                <i class="ph-light ph-copy" aria-hidden="true"></i>
                                Salin tautan
                            </button>
                        </template>
                        <p v-else class="mt-2 text-[11px] leading-relaxed text-white/75">
                            Pendaftaran belum dibuka atau sudah ditutup. Aktifkan paksa pendaftaran dari form kegiatan bila diperlukan.
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Peserta</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ item.peserta }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Kuota</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ total }}</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Durasi</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ item.durasi }} hari</p>
                </div>
                <div class="stat-tile">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Sisa kuota</p>
                    <p class="mt-1 font-mono text-xl font-semibold tabular-nums">{{ remainingKuota }}</p>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mt-4 card overflow-hidden">
            <div class="flex overflow-x-auto border-b border-line px-3 pt-3" role="tablist" aria-label="Detail event pengkaderan">
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
                    @click="selectTab(itemTab.key)"
                    @keydown.right.prevent="cycleTab($event, 1)"
                    @keydown.left.prevent="cycleTab($event, -1)"
                    @keydown.home.prevent="setTab($event, 0)"
                    @keydown.end.prevent="setTab($event, tabs.length - 1)"
                >
                    {{ itemTab.label }}
                    <span v-if="itemTab.key === 'peserta'" class="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted">{{ item.peserta }}</span>
                    <span v-else-if="itemTab.key === 'materi'" class="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted">{{ item.materials?.length ?? 0 }}</span>
                    <span v-else-if="itemTab.key === 'administrasi'" class="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-muted">{{ item.administration?.length ?? 0 }}</span>
                </button>
            </div>

            <div class="p-5 sm:p-6">
                <!-- Kegiatan -->
                <div v-show="tab === 'kegiatan'" id="panel-kegiatan" role="tabpanel" aria-labelledby="tab-kegiatan" tabindex="0">
                    <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 class="text-sm font-bold">Kegiatan &amp; Pendaftaran</h2>
                            <p class="mt-1 text-xs text-muted">Perbarui event, pelaksana, dan pengaturan pendaftaran dalam satu form.</p>
                        </div>
                        <button class="btn-secondary min-h-11 text-danger" @click="deleting = true">
                            <i class="ph-light ph-trash" aria-hidden="true"></i>
                            Hapus Event
                        </button>
                    </div>
                    <KaderisasiEventForm :item="item" />

                </div>

                <!-- Peserta -->
                <div v-show="tab === 'peserta'" id="panel-peserta" role="tabpanel" aria-labelledby="tab-peserta" tabindex="0">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 class="text-sm font-bold">Peserta Terdaftar</h2>
                            <p class="mt-1 text-xs text-muted">{{ item.peserta }} peserta terdaftar pada event ini.</p>
                        </div>
                        <span class="badge bg-brand-soft text-brand">{{ participants.length }} contoh data</span>
                    </div>

                    <div v-if="participants.length" class="mt-5 overflow-x-auto">
                        <table class="tbl min-w-[620px]">
                            <caption class="sr-only">Contoh peserta event pengkaderan</caption>
                            <thead class="bg-elevated/70">
                                <tr>
                                    <th scope="col" class="th">Nama</th>
                                    <th scope="col" class="th">NIA</th>
                                    <th scope="col" class="th">PAC</th>
                                    <th scope="col" class="th">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-line">
                                <tr v-for="member in participants" :key="member.id" class="transition-colors hover:bg-elevated/60">
                                    <td class="td">
                                        <Link :href="`/dashboard/anggota/${member.id}`" class="flex items-center gap-2.5">
                                            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[10px] font-bold text-brand">
                                                {{ initials(member.nama) }}
                                            </span>
                                            <span class="min-w-0">
                                                <span class="block truncate text-sm font-semibold hover:text-brand">{{ member.nama }}</span>
                                                <span class="block truncate text-[11px] text-muted">{{ member.jenjang }}</span>
                                            </span>
                                        </Link>
                                    </td>
                                    <td class="td font-mono text-xs text-muted">{{ member.nia }}</td>
                                    <td class="td text-xs">{{ member.pac }}</td>
                                    <td class="td"><StatusBadge :status="member.status" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <p class="mt-3 text-[11px] text-muted">Tabel menampilkan contoh peserta; total peserta mengikuti angka pada kepala halaman.</p>
                    </div>
                    <EmptyState v-else icon="ph-users-three" title="Belum ada peserta" description="Data peserta event belum ditautkan pada prototipe ini." />
                </div>

                <!-- Materi & Nilai -->
                <div v-show="tab === 'materi'" id="panel-materi" role="tabpanel" aria-labelledby="tab-materi" tabindex="0">
                    <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 class="text-sm font-bold">Penilaian Peserta</h2>
                            <p class="mt-1 text-xs text-muted">Isi nilai peserta; materi dikelola terpisah lewat tombol Atur Materi.</p>
                        </div>
                        <button type="button" class="btn-secondary min-h-11" @click="materialModalOpen = true">
                            <i class="ph-light ph-sliders-horizontal" aria-hidden="true"></i>
                            Atur Materi
                            <span class="badge bg-brand-soft text-brand">{{ item.materials?.length ?? 0 }}</span>
                        </button>
                    </div>

                    <KaderisasiNilaiForm v-if="item.materials?.length" hide-heading :item="item" />
                    <div v-else class="rounded-xl border border-dashed border-line bg-elevated/30 p-6 text-center">
                        <i class="ph-light ph-lock-key mx-auto block text-3xl text-muted" aria-hidden="true"></i>
                        <h2 class="mt-2 text-sm font-bold">Nilai peserta terkunci</h2>
                        <p class="mt-1 text-xs text-muted">Materi harus diatur terlebih dahulu sebelum nilai peserta dapat diisi.</p>
                        <button type="button" class="btn-primary mt-4 min-h-11" @click="materialModalOpen = true">
                            <i class="ph-light ph-sliders-horizontal" aria-hidden="true"></i>
                            Atur Materi
                        </button>
                    </div>
                </div>

                <!-- Administrasi -->
                <div v-show="tab === 'administrasi'" id="panel-administrasi" role="tabpanel" aria-labelledby="tab-administrasi" tabindex="0">
                    <KaderisasiAdministrasiForm :item="item" />
                </div>

            </div>
        </div>

        <KaderisasiMateriModal
            :open="materialModalOpen"
            :item="item"
            @close="materialModalOpen = false"
        />

        <ConfirmModal
            :open="deleting"
            title="Hapus event?"
            :message="`Event “${item.fullName || item.nama}” akan dihapus dari agenda kaderisasi.`"
            confirm-label="Hapus event"
            @close="deleting = false"
            @confirm="confirmDelete"
        />
    </div>

    <div v-else class="card p-10 text-center">
        <i class="ph-light ph-graduation-cap mx-auto block text-4xl text-muted" aria-hidden="true"></i>
        <h2 class="mt-3 text-lg font-bold">Event tidak ditemukan</h2>
        <p class="mt-1 text-sm text-muted">Data event mungkin sudah dihapus.</p>
        <Link href="/dashboard/kaderisasi" class="btn-primary mt-5">Kembali ke daftar event</Link>
    </div>
</template>
