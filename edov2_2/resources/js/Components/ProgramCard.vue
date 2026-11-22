<script setup>
import { computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import ProgressBar from './ProgressBar.vue';
import { formatLongDate } from '@/utils/format';

const props = defineProps({
    program: { type: Object, required: true },
});

defineEmits(['detail', 'manage']);

const percentage = computed(() => {
    if (!props.program.kuota) return 0;
    return Math.min(100, Math.round((props.program.peserta / props.program.kuota) * 100));
});

const remaining = computed(() => Math.max(0, props.program.kuota - props.program.peserta));
</script>

<template>
    <article v-reveal class="card card-lift p-5">
        <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                    <i class="ph-light ph-graduation-cap text-xl" aria-hidden="true"></i>
                </span>
                <div class="min-w-0">
                    <h3 class="truncate text-sm font-bold">{{ program.nama }}</h3>
                    <p class="text-[11px] text-muted">
                        Jenjang {{ program.level }} · {{ formatLongDate(program.tanggal) }}
                    </p>
                </div>
            </div>
            <StatusBadge :status="program.status" />
        </div>

        <div class="mt-4 flex items-center justify-between text-xs">
            <span class="text-muted">Peserta terdaftar</span>
            <span class="font-mono font-semibold tabular-nums">
                {{ program.peserta }} / {{ program.kuota }}
            </span>
        </div>

        <div class="mt-2">
            <ProgressBar :value="percentage" />
        </div>

        <div class="mt-1 flex justify-between text-[11px] text-muted">
            <span>{{ percentage }}% terisi</span>
            <span>{{ remaining }} kursi tersisa</span>
        </div>

        <div class="mt-4 flex items-center gap-2">
            <button class="btn-secondary btn-sm flex-1" @click="$emit('detail', program)">
                Detail
            </button>
            <button class="btn-primary btn-sm flex-1" @click="$emit('manage', program)">
                Kelola
            </button>
        </div>
    </article>
</template>
