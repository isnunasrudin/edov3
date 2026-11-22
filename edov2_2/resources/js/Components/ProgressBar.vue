<script setup>
import { computed } from 'vue';

const props = defineProps({
    value: { type: Number, default: 0 },
    tone: { type: String, default: 'brand' },
});

const tones = {
    brand: 'bg-brand',
    accent: 'bg-accent',
    info: 'bg-info',
    success: 'bg-success',
    violet: 'bg-violet',
    muted: 'bg-brand/30',
    'brand-30': 'bg-brand/30',
    'brand-55': 'bg-brand/55',
    'brand-80': 'bg-brand/80',
};

const barClass = computed(() => tones[props.tone] ?? tones.brand);
const width = computed(() => Math.min(100, Math.max(0, props.value)));
</script>

<template>
    <div class="h-2 overflow-hidden rounded-full bg-elevated">
        <div
            :class="['h-2 rounded-full', barClass]"
            :style="{ width: `${width}%` }"
        ></div>
    </div>
</template>
