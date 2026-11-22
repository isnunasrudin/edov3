<script setup>
defineProps({
    icon: { type: String, default: 'ph-envelope-simple' },
    title: { type: String, default: 'Tidak ada data' },
    description: { type: String, default: 'Coba ubah kata kunci atau filter.' },
});
</script>

<template>
    <div class="px-4 py-12 text-center">
        <i :class="['ph-light mx-auto block text-3xl text-muted', icon]" aria-hidden="true"></i>
        <p class="mt-2 text-sm font-semibold">{{ title }}</p>
        <p class="text-xs text-muted">{{ description }}</p>
    </div>
</template>
