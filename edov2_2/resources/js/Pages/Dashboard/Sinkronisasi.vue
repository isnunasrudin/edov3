<script setup>
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import { formatNumber } from '@/utils/format';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const syncing = ref(false);
const lastSync = ref('22 Nov 2026 · 09.40');

const sources = [
    {
        name: 'SISTA',
        description: 'Sistem Informasi Anggota IPNU & IPPNU.',
        icon: 'ph-database',
        tone: 'bg-brand-soft text-brand',
        records: 4812,
    },
    {
        name: 'Sirekan',
        description: 'Sistem rekap keanggotaan Nahdlatul Ulama.',
        icon: 'ph-cloud-check',
        tone: 'bg-info-soft text-info',
        records: 4812,
    },
];

const logs = ref([
    { id: 1, time: '22 Nov 2026 · 09.40', source: 'SISTA', status: 'Berhasil', records: 4812, note: 'Sinkronisasi otomatis' },
    { id: 2, time: '21 Nov 2026 · 21.00', source: 'Sirekan', status: 'Berhasil', records: 4801, note: 'Sinkronisasi otomatis' },
    { id: 3, time: '20 Nov 2026 · 09.40', source: 'SISTA', status: 'Sebagian', records: 4780, note: '12 data perlu verifikasi' },
]);

function timestamp() {
    return new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function removeLog(id) {
    logs.value = logs.value.filter((item) => item.id !== id);
}

function clearLogs() {
    logs.value = [];
    showToast('Riwayat sinkronisasi dibersihkan.', 'info');
}

async function sync(source = 'Semua') {
    if (syncing.value) return;

    syncing.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1200));
    syncing.value = false;

    const time = timestamp();
    lastSync.value = time;
    logs.value.unshift({
        id: Date.now(),
        time,
        source,
        status: 'Berhasil',
        records: 4812,
        note: 'Sinkronisasi manual (demo)',
    });

    showToast(`Sinkronisasi ${source} selesai (demo).`, 'success');
}
</script>

<template>
    <Head title="Sinkronisasi SISTA & Sirekan · EDO v2" />

    <PageHeader
        eyebrow="Integrasi"
        title="Sinkronisasi SISTA & Sirekan"
        description="Pastikan data anggota EDO selaras dengan sistem nasional."
        icon="ph-arrows-clockwise"
    >
        <template #actions>
            <button class="btn-primary group h-11" :disabled="syncing" @click="sync('Semua')">
                <template v-if="syncing">
                    <i class="ph-light ph-circle-notch animate-spin text-base" aria-hidden="true"></i>
                    <span>Memproses…</span>
                </template>
                <template v-else>
                    <span>Sinkronkan semua</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-arrows-clockwise text-sm"></i>
                    </span>
                </template>
            </button>
        </template>
    </PageHeader>

    <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div v-reveal class="card p-4">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Total anggota</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums">4.812</p>
        </div>
        <div v-reveal class="card p-4">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Data cocok</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-success">4.749</p>
        </div>
        <div v-reveal class="card p-4">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Perlu verifikasi</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-accent">63</p>
        </div>
        <div v-reveal class="card p-4">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Terakhir sinkron</p>
            <p class="mt-1 text-sm font-semibold">{{ lastSync }}</p>
        </div>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article v-for="source in sources" :key="source.name" v-reveal class="card card-lift p-5">
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                    <span :class="['grid h-11 w-11 place-items-center rounded-2xl', source.tone]">
                        <i :class="['ph-light text-xl', source.icon]" aria-hidden="true"></i>
                    </span>
                    <div>
                        <h2 class="text-sm font-bold">{{ source.name }}</h2>
                        <p class="text-[11px] text-muted">{{ source.description }}</p>
                    </div>
                </div>
                <StatusBadge status="Tersinkron" />
            </div>

            <div class="mt-4 flex items-center justify-between text-xs">
                <span class="text-muted">Record tersinkron</span>
                <span class="font-mono font-semibold tabular-nums">{{ formatNumber(source.records) }}</span>
            </div>
            <div class="mt-1 flex items-center justify-between text-xs">
                <span class="text-muted">Terakhir</span>
                <span class="font-medium">{{ lastSync }}</span>
            </div>

            <button class="btn-secondary btn-sm mt-4 w-full" :disabled="syncing" @click="sync(source.name)">
                <i class="ph-light ph-arrows-clockwise text-base" aria-hidden="true"></i>
                Sinkronkan {{ source.name }}
            </button>
        </article>
    </div>

    <div v-reveal class="card mt-4 overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
            <div>
                <h2 class="text-sm font-bold">Riwayat Sinkronisasi</h2>
                <p class="text-xs text-muted">Log aktivitas sinkronisasi terbaru.</p>
            </div>
            <div class="flex items-center gap-2">
                <span class="badge bg-success-soft text-success">{{ logs.length }} log</span>
                <button v-if="logs.length" class="btn-ghost btn-sm" @click="clearLogs">
                    <i class="ph-light ph-trash text-base" aria-hidden="true"></i>
                    Bersihkan
                </button>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="tbl min-w-[720px]">
                <caption class="sr-only">Riwayat sinkronisasi SISTA dan Sirekan</caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th">Waktu</th>
                        <th scope="col" class="th">Sumber</th>
                        <th scope="col" class="th">Status</th>
                        <th scope="col" class="th">Record</th>
                        <th scope="col" class="th">Keterangan</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="log in logs" :key="log.id" class="transition-colors hover:bg-elevated/60">
                        <td class="td whitespace-nowrap text-muted">{{ log.time }}</td>
                        <td class="td font-semibold">{{ log.source }}</td>
                        <td class="td"><StatusBadge :status="log.status" /></td>
                        <td class="td font-mono text-xs text-muted">{{ formatNumber(log.records) }}</td>
                        <td class="td text-muted">{{ log.note }}</td>
                        <td class="td text-right">
                            <button class="icon-btn-sm hover:text-danger" :aria-label="`Hapus log ${log.source}`" title="Hapus log" @click="removeLog(log.id)">
                                <i class="ph-light ph-trash" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Sinkronisasi pada prototipe ini hanya simulasi. Hubungkan ke API SISTA & Sirekan untuk data nyata.
    </p>
</template>
