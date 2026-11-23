<script setup>
import { computed, ref, watch } from 'vue';
import { ADDRESS_LEVELS } from '@/data/reference';

defineOptions({ name: 'AlamatTreeNode' });

const props = defineProps({
    node: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    forceExpanded: { type: Boolean, default: false },
});

const emit = defineEmits(['edit', 'delete', 'add-child']);

const open = ref(props.depth < 2 || props.forceExpanded);

watch(
    () => props.forceExpanded,
    (value) => {
        if (value) open.value = true;
    },
);

const children = computed(() => props.node.children ?? []);
const hasChildren = computed(() => children.value.length > 0);
const canAddChild = computed(() => props.node.tingkat !== 'desa');

const levelLabel = computed(
    () => ADDRESS_LEVELS.find((level) => level.value === props.node.tingkat)?.label ?? props.node.tingkat,
);

const levelClass = computed(() => {
    if (props.node.tingkat === 'provinsi') return 'bg-brand-soft text-brand';
    if (props.node.tingkat === 'kabupaten') return 'bg-info-soft text-info';
    if (props.node.tingkat === 'kecamatan') return 'bg-accent-soft text-accent';
    return 'border border-line bg-elevated text-muted';
});
</script>

<template>
    <div>
        <div class="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 transition-colors hover:bg-elevated/40">
            <button
                v-if="hasChildren"
                class="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg text-muted transition hover:bg-elevated hover:text-ink"
                :aria-label="`${open ? 'Tutup' : 'Buka'} turunan ${node.nama}`"
                :aria-expanded="open"
                @click="open = !open"
            >
                <i :class="['ph-light text-base', open ? 'ph-caret-down' : 'ph-caret-right']" aria-hidden="true"></i>
            </button>
            <span v-else class="h-11 w-11 shrink-0"></span>

            <span :class="['badge shrink-0', levelClass]">{{ levelLabel }}</span>
            <span class="min-w-0 flex-1 truncate text-sm font-semibold">{{ node.nama }}</span>
            <span class="hidden font-mono text-[10px] text-muted sm:inline">{{ node.kode }}</span>
            <span v-if="hasChildren" class="badge hidden border border-line bg-elevated text-muted sm:inline-flex">{{ children.length }} turunan</span>

            <div class="flex basis-full items-center justify-end gap-1 sm:ml-auto sm:basis-auto">
                <button
                    v-if="canAddChild"
                    class="icon-btn-sm h-11 w-11"
                    :aria-label="`Tambah turunan ${node.nama}`"
                    title="Tambah turunan"
                    @click="emit('add-child', node)"
                >
                    <i class="ph-light ph-plus" aria-hidden="true"></i>
                </button>
                <button class="icon-btn-sm h-11 w-11" :aria-label="`Ubah ${node.nama}`" title="Ubah" @click="emit('edit', node)">
                    <i class="ph-light ph-pencil-simple" aria-hidden="true"></i>
                </button>
                <button
                    class="icon-btn-sm h-11 w-11 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                    :aria-label="`Hapus ${node.nama}`"
                    :title="hasChildren ? 'Masih memiliki turunan' : 'Hapus'"
                    :disabled="hasChildren"
                    @click="emit('delete', node)"
                >
                    <i class="ph-light ph-trash" aria-hidden="true"></i>
                </button>
            </div>
        </div>

        <div v-if="open && hasChildren" class="ml-3 mt-2 space-y-2 border-l border-line/70 pl-2 sm:ml-5 sm:pl-3">
            <AlamatTreeNode
                v-for="child in children"
                :key="child.id"
                :node="child"
                :depth="depth + 1"
                :force-expanded="forceExpanded"
                @edit="emit('edit', $event)"
                @delete="emit('delete', $event)"
                @add-child="emit('add-child', $event)"
            />
        </div>
    </div>
</template>
