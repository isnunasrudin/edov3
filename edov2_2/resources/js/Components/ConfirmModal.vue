<script setup>
import BaseModal from './BaseModal.vue';

defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Konfirmasi' },
    message: { type: String, default: '' },
    confirmLabel: { type: String, default: 'Hapus' },
    danger: { type: Boolean, default: true },
});

defineEmits(['close', 'confirm']);
</script>

<template>
    <BaseModal :open="open" :title="title" subtitle="Tindakan ini tidak dapat dibatalkan." size="md" @close="$emit('close')">
        <div class="p-5">
            <div class="flex items-start gap-3">
                <span
                    :class="[
                        'grid h-10 w-10 shrink-0 place-items-center rounded-2xl',
                        danger ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-brand',
                    ]"
                >
                    <i :class="['ph-light text-xl', danger ? 'ph-warning' : 'ph-info']" aria-hidden="true"></i>
                </span>
                <p class="pt-1 text-sm leading-relaxed text-muted">{{ message }}</p>
            </div>

            <div class="mt-5 flex justify-end gap-2">
                <button class="btn-secondary" @click="$emit('close')">Batal</button>
                <button
                    :class="[
                        'btn-primary',
                        danger ? 'bg-danger text-white hover:bg-danger/90' : '',
                    ]"
                    @click="$emit('confirm')"
                >
                    {{ confirmLabel }}
                </button>
            </div>
        </div>
    </BaseModal>
</template>
