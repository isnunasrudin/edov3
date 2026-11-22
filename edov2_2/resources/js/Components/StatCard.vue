<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    hint: { type: String, default: '' },
    icon: { type: String, required: true },
    tone: { type: String, default: 'brand' },
    delta: { type: String, default: '' },
    spark: { type: String, default: '' },
});

const tones = {
    brand: {
        tile: 'bg-brand-soft text-brand',
        spark: 'text-brand/35',
    },
    info: {
        tile: 'bg-info-soft text-info',
        spark: 'text-info/35',
    },
    violet: {
        tile: 'bg-violet-soft text-violet',
        spark: 'text-violet/35',
    },
    accent: {
        tile: 'bg-accent-soft text-accent',
        spark: 'text-accent/35',
    },
};

const theme = computed(() => tones[props.tone] ?? tones.brand);
</script>

<template>
    <article v-reveal class="card card-lift relative overflow-hidden p-5">
        <div class="flex items-start justify-between">
            <span :class="['grid h-10 w-10 place-items-center rounded-2xl', theme.tile]">
                <i :class="['ph-light text-xl', icon]" aria-hidden="true"></i>
            </span>
            <span v-if="delta" class="badge bg-brand-soft text-brand">
                <i class="ph-light ph-trend-up" aria-hidden="true"></i>
                {{ delta }}
            </span>
        </div>

        <p class="mt-4 text-sm font-medium text-muted">{{ label }}</p>
        <p class="mt-1 text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
            {{ value }}
        </p>
        <p v-if="hint" class="mt-1 text-xs text-muted">{{ hint }}</p>

        <div v-if="spark" class="mt-4 -mb-5 -mx-5 h-9">
            <svg
                viewBox="0 0 120 32"
                preserveAspectRatio="none"
                :class="['h-9 w-full', theme.spark]"
                fill="none"
                aria-hidden="true"
            >
                <path
                    :d="spark"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    vector-effect="non-scaling-stroke"
                />
            </svg>
        </div>
    </article>
</template>
