<script setup>
import { computed } from 'vue';

const props = defineProps({
    percent: { type: Number, default: 0 },
    label: { type: String, default: 'kelengkapan' },
});

const value = computed(() => Math.min(100, Math.max(0, props.percent)));
</script>

<template>
    <div
        class="relative grid h-32 w-32 shrink-0 place-items-center rounded-full"
        :style="{ background: `conic-gradient(rgb(var(--brand)) ${value}%, rgb(var(--elevated)) ${value}% 100%)` }"
        role="img"
        :aria-label="`${value}% ${label}`"
    >
        <div class="grid h-[6.5rem] w-[6.5rem] place-items-center rounded-full bg-surface text-center">
            <div>
                <p class="font-mono text-2xl font-semibold tabular-nums">{{ value }}%</p>
                <p class="mt-0.5 text-[9px] uppercase tracking-wider text-muted">{{ label }}</p>
            </div>
        </div>
    </div>
</template>
