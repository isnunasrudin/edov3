<script setup>
const props = defineProps({
    page: { type: Number, required: true },
    pages: { type: Number, required: true },
});

defineEmits(['update:page']);
</script>

<template>
    <div class="flex items-center gap-1">
        <button
            class="icon-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page <= 1"
            aria-label="Halaman sebelumnya"
            @click="$emit('update:page', page - 1)"
        >
            <i class="ph-light ph-caret-left" aria-hidden="true"></i>
        </button>
        <span class="px-2 font-mono text-xs text-muted">{{ page }} / {{ pages }}</span>
        <button
            class="icon-btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page >= pages"
            aria-label="Halaman berikutnya"
            @click="$emit('update:page', page + 1)"
        >
            <i class="ph-light ph-caret-right" aria-hidden="true"></i>
        </button>
    </div>
</template>
