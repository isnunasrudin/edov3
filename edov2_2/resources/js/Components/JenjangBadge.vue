<script setup>
import { computed } from 'vue';

const props = defineProps({
    jenjang: { type: String, required: true },
});

const styles = {
    'Kader Utama': 'bg-accent-soft text-accent',
    Kader: 'bg-brand-soft text-brand',
    Anggota: 'bg-info-soft text-info',
    'Anggota Muda': 'bg-violet-soft text-violet',
};

const classes = computed(
    () => styles[props.jenjang] ?? 'border border-line bg-elevated text-muted',
);
</script>

<template>
    <span :class="['badge', classes]">{{ jenjang }}</span>
</template>
