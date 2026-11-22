<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: { type: String, required: true },
});

const styles = {
    Selesai: 'bg-success-soft text-success',
    Aktif: 'bg-success-soft text-success',
    Berjalan: 'bg-success-soft text-success',
    Diproses: 'bg-accent-soft text-accent',
    Cuti: 'bg-accent-soft text-accent',
    Menunggu: 'border border-line bg-elevated text-muted',
    'Non-aktif': 'border border-line bg-elevated text-muted',
    Dijadwalkan: 'border border-line bg-elevated text-muted',
    Pendaftaran: 'bg-info-soft text-info',
};

const classes = computed(
    () => styles[props.status] ?? 'border border-line bg-elevated text-muted',
);
</script>

<template>
    <span :class="['badge', classes]">{{ status }}</span>
</template>
