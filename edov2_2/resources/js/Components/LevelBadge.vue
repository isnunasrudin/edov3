<script setup>
import { computed } from 'vue';
import { LEVELS } from '@/data/pimpinan';

const props = defineProps({
    level: { type: String, required: true },
});

const styles = {
    PP: 'bg-ink text-canvas',
    PW: 'bg-info-soft text-info',
    PCI: 'bg-violet-soft text-violet',
    PC: 'bg-brand-soft text-brand',
    PAC: 'bg-success-soft text-success',
    PK: 'bg-accent-soft text-accent',
    PR: 'border border-line bg-elevated text-muted',
};

const meta = computed(() => LEVELS.find((item) => item.code === props.level));
const classes = computed(() => styles[props.level] ?? styles.PR);
</script>

<template>
    <span :class="['badge', classes]" :title="meta?.label">
        {{ level }}
    </span>
</template>
