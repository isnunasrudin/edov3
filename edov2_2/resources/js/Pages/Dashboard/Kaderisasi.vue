<script setup>
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import ProgramCard from '@/Components/ProgramCard.vue';
import ProgramFormModal from '@/Components/ProgramFormModal.vue';
import DetailModal from '@/Components/DetailModal.vue';
import { dashboard } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { formatLongDate } from '@/utils/format';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const programModalOpen = ref(false);
const selectedProgram = ref(null);

const stats = [
    { label: 'Kader Aktif', value: '862', note: '+42 tahun ini', icon: 'ph-users-three', tone: 'text-brand' },
    { label: 'Lulus 2026', value: '214', note: 'dari 5 angkatan', icon: 'ph-seal-check', tone: 'text-muted' },
    { label: 'Program Berjalan', value: '3', note: '1 dijadwalkan', icon: 'ph-chalkboard-teacher', tone: 'text-muted' },
    { label: 'Rasio Kader', value: '17,9%', note: 'dari total anggota', icon: 'ph-chart-line-up', tone: 'text-muted' },
];

const pipeline = [
    { no: '01', label: 'Anggota Muda', value: '1.284', pct: 27, icon: 'ph-user', tone: 'brand-30', iconClass: 'text-muted' },
    { no: '02', label: 'Anggota', value: '2.518', pct: 52, icon: 'ph-user-check', tone: 'brand-55', iconClass: 'text-info' },
    { no: '03', label: 'Kader', value: '862', pct: 18, icon: 'ph-medal', tone: 'brand-80', iconClass: 'text-brand' },
    { no: '04', label: 'Kader Utama', value: '148', pct: 6, icon: 'ph-crown-simple', tone: 'brand', iconClass: 'text-accent' },
];

const detailRows = computed(() => {
    if (!selectedProgram.value) return [];

    const program = selectedProgram.value;
    const pct = program.kuota
        ? Math.min(100, Math.round((program.peserta / program.kuota) * 100))
        : 0;

    return [
        { label: 'Jenjang', value: program.level },
        { label: 'Tanggal', value: formatLongDate(program.tanggal) },
        { label: 'Peserta', value: `${program.peserta} / ${program.kuota} (${pct}%)` },
        { label: 'Sisa kursi', value: String(Math.max(0, program.kuota - program.peserta)) },
        { label: 'Status', value: program.status },
    ];
});

function manage(program) {
    showToast(`Kelola peserta “${program.nama}” belum tersedia pada prototipe.`, 'info');
}
</script>

<template>
    <Head title="Kaderisasi · EDO v2" />

    <PageHeader
        eyebrow="Pengembangan"
        title="Kaderisasi"
        description="Pantau jenjang kader dan program pelatihan yang berjalan."
        icon="ph-graduation-cap"
    >
        <template #actions>
            <button class="btn-primary group" @click="programModalOpen = true">
                <span>Buat Program</span>
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

    <div class="mt-6 flex items-center justify-between">
        <h3 class="text-sm font-bold">Program Kaderisasi</h3>
        <span class="text-xs text-muted">{{ dashboard.programs.length }} program · 2026/2027</span>
    </div>

    <div class="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ProgramCard
            v-for="program in dashboard.programs"
            :key="program.id"
            :program="program"
            @detail="selectedProgram = $event"
            @manage="manage"
        />
    </div>

    <p class="mt-6 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Kuota dan progres bersifat ilustratif. Hubungkan ke API kaderisasi untuk data real-time.
    </p>

    <ProgramFormModal
        :open="programModalOpen"
        @close="programModalOpen = false"
        @saved="programModalOpen = false"
    />

    <DetailModal
        :open="!!selectedProgram"
        :title="selectedProgram?.nama ?? 'Detail Program'"
        subtitle="Program kaderisasi"
        :rows="detailRows"
        @close="selectedProgram = null"
    />
</template>
