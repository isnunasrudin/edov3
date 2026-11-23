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
    'Menunggu Pelantikan': 'bg-info-soft text-info',
    'Periode Berakhir': 'bg-danger-soft text-danger',
    Lengkap: 'bg-success-soft text-success',
    'Perlu dilengkapi': 'bg-accent-soft text-accent',
    'Masa Tenggang': 'bg-info-soft text-info',
    Expired: 'bg-danger-soft text-danger',
    Duplikat: 'bg-violet-soft text-violet',
    Beririsan: 'border border-line bg-elevated text-muted',
    Berakhir: 'border border-line bg-elevated text-muted',
    Lulus: 'bg-success-soft text-success',
    Berhenti: 'bg-danger-soft text-danger',
    Tersinkron: 'bg-success-soft text-success',
    Berhasil: 'bg-success-soft text-success',
    Sebagian: 'bg-accent-soft text-accent',
    Gagal: 'bg-danger-soft text-danger',
};

const classes = computed(
    () => styles[props.status] ?? 'border border-line bg-elevated text-muted',
);
</script>

<template>
    <span :class="['badge', classes]">{{ status }}</span>
</template>
