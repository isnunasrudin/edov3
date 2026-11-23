<script setup>
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import EmptyState from '@/Components/EmptyState.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import AlamatFormModal from '@/Components/AlamatFormModal.vue';
import AlamatTreeNode from '@/Components/AlamatTreeNode.vue';
import { dashboard, deleteAlamat } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const query = ref('');
const formOpen = ref(false);
const editing = ref(null);
const parentId = ref('');
const deleting = ref(null);

const baseTree = computed(() => {
    const nodes = dashboard.alamat.map((item) => ({ ...item, children: [] }));
    const map = new Map(nodes.map((item) => [item.id, item]));
    const roots = [];

    nodes.forEach((node) => {
        if (node.parentId && map.has(node.parentId)) {
            map.get(node.parentId).children.push(node);
        } else {
            roots.push(node);
        }
    });

    const sort = (items) => {
        items.sort((a, b) => a.kode.localeCompare(b.kode));
        items.forEach((item) => sort(item.children));
    };

    sort(roots);
    return roots;
});

function filterTree(nodes, term) {
    return nodes
        .map((node) => {
            const children = filterTree(node.children ?? [], term);
            const match = `${node.nama} ${node.kode}`.toLowerCase().includes(term);

            if (!term || match || children.length) {
                return { ...node, children };
            }

            return null;
        })
        .filter(Boolean);
}

const displayTree = computed(() => {
    const term = query.value.toLowerCase().trim();
    return term ? filterTree(baseTree.value, term) : baseTree.value;
});

const stats = computed(() => ({
    total: dashboard.alamat.length,
    provinsi: dashboard.alamat.filter((item) => item.tingkat === 'provinsi').length,
    kabupaten: dashboard.alamat.filter((item) => item.tingkat === 'kabupaten').length,
    kecamatan: dashboard.alamat.filter((item) => item.tingkat === 'kecamatan').length,
    desa: dashboard.alamat.filter((item) => item.tingkat === 'desa').length,
}));

function openCreateRoot() {
    editing.value = null;
    parentId.value = '';
    formOpen.value = true;
}

function openAddChild(node) {
    editing.value = null;
    parentId.value = node.id;
    formOpen.value = true;
}

function openEdit(node) {
    editing.value = node;
    parentId.value = node.parentId ?? '';
    formOpen.value = true;
}

function onSaved(saved) {
    formOpen.value = false;
    editing.value = null;
    parentId.value = '';
    showToast(`Alamat ${saved.nama} berhasil disimpan.`);
}

function requestDelete(node) {
    const used =
        dashboard.anggota.some((item) => item.alamat === node.nama) ||
        dashboard.pimpinan.some((item) => item.alamat === node.nama);

    if (used) {
        showToast('Alamat masih dipakai data anggota atau pimpinan.', 'error');
        return;
    }

    deleting.value = node;
}

function confirmDelete() {
    if (!deleting.value) return;

    const deleted = deleteAlamat(deleting.value.id);

    if (!deleted) {
        showToast('Alamat yang masih memiliki turunan tidak dapat dihapus.', 'error');
        deleting.value = null;
        return;
    }

    showToast(`Alamat ${deleting.value.nama} dihapus.`);
    deleting.value = null;
}
</script>

<template>
    <Head title="Alamat · EDO v2" />

    <PageHeader
        eyebrow="Data Master"
        title="Alamat"
        description="Referensi wilayah bertingkat provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan."
        icon="ph-tree-structure"
    >
        <template #actions>
            <button class="btn-primary min-h-11" @click="openCreateRoot">
                <i class="ph-light ph-plus" aria-hidden="true"></i>
                Tambah Provinsi
            </button>
        </template>
    </PageHeader>

    <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Total</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums">{{ stats.total }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Provinsi</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-brand">{{ stats.provinsi }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Kab/Kota</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-info">{{ stats.kabupaten }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Kecamatan</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-accent">{{ stats.kecamatan }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Desa/Kel.</p>
            <p class="mt-1 font-mono text-2xl font-semibold tabular-nums text-muted">{{ stats.desa }}</p>
        </div>
    </div>

    <div v-reveal class="card mt-4 overflow-hidden">
        <div class="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div class="relative w-full sm:max-w-sm">
                <label for="alamat-search" class="sr-only">Cari alamat</label>
                <i class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
                <input id="alamat-search" v-model="query" type="search" class="input h-9 pl-9" placeholder="Cari nama atau kode wilayah…" autocomplete="off" />
            </div>
            <p class="text-[11px] text-muted sm:ml-auto">
                Gunakan tombol <b>+</b> pada baris untuk menambah turunan.
            </p>
            <button v-if="query" class="btn-ghost btn-sm min-h-11" @click="query = ''">
                <i class="ph-light ph-x text-base" aria-hidden="true"></i>
                Bersihkan
            </button>
        </div>

        <div v-if="displayTree.length" class="space-y-2 p-3 sm:p-4">
            <AlamatTreeNode
                v-for="node in displayTree"
                :key="node.id"
                :node="node"
                :force-expanded="!!query.trim()"
                @edit="openEdit"
                @delete="requestDelete"
                @add-child="openAddChild"
            />
        </div>
        <EmptyState
            v-else
            icon="ph-tree-structure"
            title="Alamat tidak ditemukan"
            description="Coba ubah kata kunci pencarian."
        />
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Alamat yang masih memiliki turunan tidak dapat dihapus. Perubahan referensi ini langsung dipakai pada pilihan alamat form anggota dan pimpinan.
    </p>

    <AlamatFormModal
        :open="formOpen"
        :item="editing"
        :parent-id="parentId"
        @close="formOpen = false; editing = null; parentId = ''"
        @saved="onSaved"
    />
    <ConfirmModal
        :open="!!deleting"
        title="Hapus Alamat"
        :message="`Hapus alamat ${deleting?.nama ?? ''}? Tindakan ini tidak dapat dibatalkan.`"
        @close="deleting = null"
        @confirm="confirmDelete"
    />
</template>
