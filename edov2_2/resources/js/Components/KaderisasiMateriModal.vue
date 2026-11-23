<script setup>
import BaseModal from './BaseModal.vue';
import KaderisasiMateriForm from './KaderisasiMateriForm.vue';

defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, required: true },
});

const emit = defineEmits(['close', 'saved']);

function onSaved(payload) {
    emit('saved', payload);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        title="Atur Materi"
        subtitle="Tambah, ubah, atau hapus materi kegiatan. Nilai peserta mengikuti materi aktif."
        size="xl"
        @close="emit('close')"
    >
        <div class="p-5 sm:p-6">
            <KaderisasiMateriForm :item="item" @saved="onSaved" />
        </div>
    </BaseModal>
</template>
