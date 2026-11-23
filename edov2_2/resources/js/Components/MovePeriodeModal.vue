<script setup>
import { computed, ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import SearchSelect from './SearchSelect.vue';

const props = defineProps({
    open: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    options: { type: Array, default: () => [] },
    defaultPeriodeId: { type: String, default: '' },
});

const emit = defineEmits(['close', 'confirm']);

const periodeId = ref('');

const selected = computed(() => props.options.find((row) => row.value === periodeId.value) ?? null);

watch(
    () => props.open,
    (open) => {
        if (!open) return;

        periodeId.value =
            props.options.find((row) => row.value === props.defaultPeriodeId)?.value ??
            props.options[0]?.value ??
            '';
    },
);

function submit() {
    if (!periodeId.value) return;
    emit('confirm', periodeId.value);
}
</script>

<template>
    <BaseModal
        :open="open"
        title="Pindah Periode"
        subtitle="Pindahkan pengurus terpilih ke masa khidmat lain."
        size="md"
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div class="rounded-xl bg-elevated px-4 py-3 text-xs text-muted">
                <span class="font-semibold text-ink">{{ count }} pengurus</span> akan dipindahkan. Tanggal mulai dan selesai mengikuti periode tujuan.
            </div>

            <SearchSelect
                v-if="options.length"
                id="pindah-periode-tujuan"
                v-model="periodeId"
                label="Periode tujuan"
                :options="options"
                :clearable="false"
                autofocus
                placeholder="Pilih periode"
                search-placeholder="Cari periode…"
                required
            />

            <div v-if="selected" class="rounded-xl border border-line bg-elevated/50 p-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Rentang tujuan</p>
                <p class="mt-1 text-sm font-semibold">{{ selected.label }}</p>
                <p class="text-[11px] text-muted">{{ selected.description }}</p>
            </div>

            <p v-if="!options.length" class="rounded-xl bg-accent-soft p-3 text-xs leading-relaxed text-accent">
                Belum ada periode tujuan. Tambahkan masa khidmat terlebih dahulu.
            </p>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group" :disabled="!periodeId || !options.length">
                    <span>Pindahkan</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-arrow-right text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
