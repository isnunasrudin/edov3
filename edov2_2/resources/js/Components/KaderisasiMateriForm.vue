<script setup>
import { computed, ref, watch } from 'vue';
import { updateProgram } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

const props = defineProps({
    item: { type: Object, required: true },
});

const emit = defineEmits(['saved']);

const items = ref([]);
const snapshot = ref('');

const dirty = computed(() => snapshot.value !== '' && JSON.stringify(items.value) !== snapshot.value);

function populate() {
    items.value = (props.item.materials ?? []).map((row) => ({ ...row }));
    snapshot.value = JSON.stringify(items.value);
}

watch(
    () => props.item.id,
    () => populate(),
    { immediate: true },
);

watch(
    () => props.item.materials,
    () => {
        if (!dirty.value) populate();
    },
    { deep: true },
);

function addItem() {
    items.value.push({
        id: `mat-${Date.now()}`,
        kode: '',
        nama: '',
        status: 'Aktif',
        urutan: items.value.length + 1,
    });
}

function removeItem(index) {
    items.value.splice(index, 1);
}

function reset() {
    populate();
    showToast('Perubahan materi dibatalkan.', 'info');
}

function save() {
    const invalid = items.value.some((row) => !row.kode.trim() || !row.nama.trim());
    if (invalid) {
        showToast('Lengkapi kode dan nama setiap materi.', 'error');
        return;
    }

    const payload = items.value
        .map((row, index) => ({
            id: row.id,
            kode: row.kode.trim(),
            nama: row.nama.trim(),
            status: row.status,
            urutan: Number(row.urutan) || index + 1,
        }))
        .sort((a, b) => a.urutan - b.urutan);

    updateProgram(props.item.id, { materials: payload });
    items.value = payload;
    snapshot.value = JSON.stringify(items.value);
    showToast('Materi kegiatan berhasil disimpan.', 'success');
    emit('saved', payload);
}
</script>

<template>
    <form class="space-y-5" novalidate @submit.prevent="save">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-sm font-bold">Materi Kegiatan</h2>
                <p class="mt-1 text-xs text-muted">Atur kode, nama, status, dan urutan materi.</p>
            </div>
            <button type="button" class="btn-secondary min-h-11" @click="addItem">
                <i class="ph-light ph-plus" aria-hidden="true"></i>
                Tambah materi
            </button>
        </div>

        <div v-if="items.length" class="overflow-x-auto">
            <table class="tbl min-w-[760px]">
                <caption class="sr-only">Materi kegiatan pengkaderan</caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th">Kode</th>
                        <th scope="col" class="th">Nama materi</th>
                        <th scope="col" class="th">Status</th>
                        <th scope="col" class="th">Urutan</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="(row, index) in items" :key="row.id">
                        <td class="td">
                            <label :for="`materi-kode-${row.id}`" class="sr-only">Kode materi {{ index + 1 }}</label>
                            <input :id="`materi-kode-${row.id}`" v-model="row.kode" class="input h-11 min-w-[7rem] font-mono text-xs" placeholder="MAT-01" />
                        </td>
                        <td class="td">
                            <label :for="`materi-nama-${row.id}`" class="sr-only">Nama materi {{ index + 1 }}</label>
                            <input :id="`materi-nama-${row.id}`" v-model="row.nama" class="input h-11 min-w-[14rem]" placeholder="Nama materi" />
                        </td>
                        <td class="td">
                            <label :for="`materi-status-${row.id}`" class="sr-only">Status materi {{ index + 1 }}</label>
                            <select :id="`materi-status-${row.id}`" v-model="row.status" class="select h-11 min-w-[8rem] text-xs">
                                <option value="Aktif">Aktif</option>
                                <option value="Non-aktif">Non-aktif</option>
                            </select>
                        </td>
                        <td class="td">
                            <label :for="`materi-urutan-${row.id}`" class="sr-only">Urutan materi {{ index + 1 }}</label>
                            <input :id="`materi-urutan-${row.id}`" v-model="row.urutan" type="number" min="1" class="input h-11 w-20 font-mono text-xs" />
                        </td>
                        <td class="td text-right">
                            <button type="button" class="icon-btn-sm hover:text-danger" :aria-label="`Hapus materi ${row.nama || index + 1}`" title="Hapus materi" @click="removeItem(index)">
                                <i class="ph-light ph-trash" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="rounded-xl border border-dashed border-line bg-elevated/30 p-6 text-center">
            <i class="ph-light ph-book-open mx-auto block text-3xl text-muted" aria-hidden="true"></i>
            <p class="mt-2 text-sm font-semibold">Belum ada materi</p>
            <p class="text-xs text-muted">Tambahkan materi pertama untuk event ini.</p>
        </div>

        <div class="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="flex items-center gap-2 text-[11px] text-muted">
                <span :class="['h-1.5 w-1.5 rounded-full', dirty ? 'bg-accent' : 'bg-success']"></span>
                {{ dirty ? 'Ada perubahan materi yang belum disimpan.' : 'Semua perubahan materi tersimpan.' }}
            </p>
            <div class="flex justify-end gap-2">
                <button type="button" class="btn-secondary min-h-11" :disabled="!dirty" @click="reset">Batalkan</button>
                <button type="submit" class="btn-primary min-h-11" :disabled="!dirty">
                    <i class="ph-light ph-floppy-disk" aria-hidden="true"></i>
                    Simpan Materi
                </button>
            </div>
        </div>
    </form>
</template>
