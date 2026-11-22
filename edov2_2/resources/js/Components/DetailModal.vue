<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Detail' },
    subtitle: { type: String, default: '' },
    rows: { type: Array, default: () => [] },
});

defineEmits(['close']);
</script>

<template>
    <BaseModal
        :open="open"
        :title="title"
        :subtitle="subtitle"
        size="md"
        @close="$emit('close')"
    >
        <div class="p-5">
            <dl class="space-y-3">
                <div
                    v-for="row in rows"
                    :key="row.label"
                    class="flex items-start justify-between gap-4 border-b border-line pb-2 last:border-0 last:pb-0"
                >
                    <dt class="text-xs font-semibold text-muted">{{ row.label }}</dt>
                    <dd class="text-right text-xs font-medium">{{ row.value }}</dd>
                </div>
            </dl>

            <slot name="actions" />
        </div>

        <div class="flex justify-end border-t border-line px-5 py-4">
            <button class="btn-secondary" @click="$emit('close')">Tutup</button>
        </div>
    </BaseModal>
</template>
