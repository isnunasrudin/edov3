<script setup>
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import StatCard from '@/Components/StatCard.vue';
import BarChart from '@/Components/BarChart.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import ProgressBar from '@/Components/ProgressBar.vue';
import { agenda } from '@/data/dashboard';
import { dashboard, totalAnggota } from '@/stores/dashboard';
import { downloadCSV } from '@/utils/export';
import { showToast } from '@/composables/useToast';
import { formatDate, formatNumber } from '@/utils/format';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const kpis = [
    {
        label: 'Surat Masuk',
        value: 128,
        hint: 'Nov 2026 · 2 menunggu',
        icon: 'ph-envelope-simple',
        tone: 'brand',
        delta: '12%',
        spark: 'M0 26 L15 23 L30 25 L45 17 L60 19 L75 11 L90 13 L105 7 L120 9',
    },
    {
        label: 'Surat Keluar',
        value: 96,
        hint: 'Nov 2026 · 1 draf',
        icon: 'ph-paper-plane-tilt',
        tone: 'info',
        delta: '8%',
        spark: 'M0 24 L15 25 L30 19 L45 21 L60 14 L75 16 L90 9 L105 11 L120 5',
    },
    {
        label: 'Anggota Aktif',
        value: formatNumber(totalAnggota),
        hint: 'IPNU 2.746 · IPPNU 2.066',
        icon: 'ph-users-three',
        tone: 'violet',
        delta: '3,4%',
        spark: 'M0 27 L15 24 L30 25 L45 20 L60 18 L75 15 L90 12 L105 10 L120 7',
    },
    {
        label: 'Kader Aktif',
        value: 862,
        hint: '3 program berjalan',
        icon: 'ph-graduation-cap',
        tone: 'accent',
        delta: '5,1%',
        spark: 'M0 28 L15 26 L30 22 L45 23 L60 17 L75 19 L90 13 L105 14 L120 8',
    },
];

const funnel = [
    { label: 'Anggota Muda', value: 1284, pct: 27, tone: 'brand-30' },
    { label: 'Anggota', value: 2518, pct: 52, tone: 'brand-55' },
    { label: 'Kader', value: 862, pct: 18, tone: 'brand-80' },
    { label: 'Kader Utama', value: 148, pct: 6, tone: 'brand' },
];

const recentSurat = computed(() =>
    [...dashboard.surat]
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
        .slice(0, 5),
);

const agendaTones = {
    brand: 'bg-brand-soft text-brand',
    accent: 'bg-accent-soft text-accent',
    info: 'bg-info-soft text-info',
};

function exportOverview() {
    downloadCSV('ringkasan-pc-ipnu-ippnu-trenggalek.csv', [
        ['Metrik', 'Nilai'],
        ['Surat Masuk (Nov 2026)', 128],
        ['Surat Keluar (Nov 2026)', 96],
        ['Anggota Aktif', totalAnggota],
        ['Kader Aktif', 862],
        ['Program Kaderisasi Berjalan', 3],
    ]);

    showToast('Ringkasan diekspor sebagai CSV.');
}
</script>

<template>
    <Head title="Ringkasan Organisasi · EDO v2" />

    <PageHeader
        eyebrow="EDO v2 · Dashboard"
        title="Ringkasan Organisasi"
        description="Pantau persuratan, keanggotaan, dan kaderisasi PC IPNU & IPPNU Kabupaten Trenggalek dalam satu tampilan."
        icon="ph-sparkle"
        glow
    >
        <template #actions>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2.5 text-xs font-medium text-muted">
                <i class="ph-light ph-calendar-blank text-base" aria-hidden="true"></i>
                Kamis, 19 November 2026
            </span>
            <button class="btn-secondary" @click="exportOverview">
                <i class="ph-light ph-download-simple text-base" aria-hidden="true"></i>
                Ekspor
            </button>
        </template>
    </PageHeader>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
            v-for="kpi in kpis"
            :key="kpi.label"
            :label="kpi.label"
            :value="kpi.value"
            :hint="kpi.hint"
            :icon="kpi.icon"
            :tone="kpi.tone"
            :delta="kpi.delta"
            :spark="kpi.spark"
        />
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BarChart :data="dashboard.pacData" :total="totalAnggota" />

        <article v-reveal class="card card-lift p-5">
            <h3 class="text-sm font-bold">Jenjang Kaderisasi</h3>
            <p class="text-xs text-muted">Komposisi anggota menurut jenjang</p>

            <div class="mt-5 space-y-4">
                <div v-for="row in funnel" :key="row.label">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-medium">{{ row.label }}</span>
                        <span class="font-mono font-semibold tabular-nums">{{ formatNumber(row.value) }}</span>
                    </div>
                    <div class="mt-1.5">
                        <ProgressBar :value="row.pct" :tone="row.tone" />
                    </div>
                </div>
            </div>

            <Link
                href="/dashboard/kaderisasi"
                class="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
            >
                Lihat detail kaderisasi
                <i class="ph-light ph-arrow-right" aria-hidden="true"></i>
            </Link>
        </article>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article v-reveal class="card overflow-hidden lg:col-span-2">
            <div class="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                    <h3 class="text-sm font-bold">Surat Terbaru</h3>
                    <p class="text-xs text-muted">5 aktivitas terakhir</p>
                </div>
                <Link href="/dashboard/persuratan" class="text-xs font-bold text-brand hover:underline">
                    Lihat semua
                </Link>
            </div>

            <ul class="divide-y divide-line">
                <li
                    v-for="surat in recentSurat"
                    :key="surat.id"
                    class="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-elevated/60"
                >
                    <span
                        :class="[
                            'grid h-9 w-9 shrink-0 place-items-center rounded-full',
                            surat.jenis === 'masuk' ? 'bg-brand-soft text-brand' : 'bg-info-soft text-info',
                        ]"
                    >
                        <i
                            :class="[
                                'ph-light text-lg',
                                surat.jenis === 'masuk' ? 'ph-tray' : 'ph-paper-plane-tilt',
                            ]"
                            aria-hidden="true"
                        ></i>
                    </span>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-semibold">{{ surat.perihal }}</p>
                        <p class="truncate text-[11px] text-muted">
                            {{ surat.pihak }} ·
                            <span class="font-mono">{{ surat.nomor }}</span>
                        </p>
                    </div>
                    <div class="flex shrink-0 items-center gap-3">
                        <span class="hidden text-[11px] text-muted sm:block">{{ formatDate(surat.tanggal) }}</span>
                        <StatusBadge :status="surat.status" />
                    </div>
                </li>
            </ul>
        </article>

        <article v-reveal class="card card-lift p-5">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold">Agenda Mendatang</h3>
                <span class="badge bg-accent-soft text-accent">4 kegiatan</span>
            </div>

            <ol class="mt-4 space-y-3">
                <li
                    v-for="item in agenda"
                    :key="`${item.day}-${item.title}`"
                    class="flex gap-3 rounded-xl border border-line p-3"
                >
                    <div
                        :class="[
                            'grid h-11 w-11 shrink-0 place-items-center rounded-lg text-center leading-none',
                            agendaTones[item.tone] ?? agendaTones.brand,
                        ]"
                    >
                        <span class="block font-mono text-sm font-bold">{{ item.day }}</span>
                        <span class="mt-0.5 block text-[9px] font-bold uppercase">{{ item.month }}</span>
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs font-bold leading-snug">{{ item.title }}</p>
                        <p class="mt-0.5 text-[11px] text-muted">{{ item.meta }}</p>
                    </div>
                </li>
            </ol>
        </article>
    </div>

    <p class="mt-6 text-center text-[11px] text-muted">
        Data pada dashboard ini adalah contoh (dummy) untuk keperluan prototipe.
    </p>
</template>
