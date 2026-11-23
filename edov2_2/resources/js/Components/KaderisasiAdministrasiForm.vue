<script setup>
import { computed, ref, watch } from 'vue';
import { updateProgram } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

const props = defineProps({
    item: { type: Object, required: true },
});

const items = ref([]);
const snapshot = ref('');

const dirty = computed(() => snapshot.value !== '' && JSON.stringify(items.value) !== snapshot.value);
const completed = computed(() => items.value.filter((row) => row.status === 'Sudah diunggah').length);

function populate() {
    items.value = (props.item.administration ?? []).map((row) => ({ ...row }));
    snapshot.value = JSON.stringify(items.value);
}

watch(
    () => props.item.id,
    () => populate(),
    { immediate: true },
);

function addItem() {
    items.value.push({
        id: `adm-${Date.now()}`,
        nama: '',
        status: 'Belum diunggah',
        catatan: '',
    });
}

function removeItem(index) {
    items.value.splice(index, 1);
}

function reset() {
    populate();
    showToast('Perubahan administrasi dibatalkan.', 'info');
}

function save() {
    const invalid = items.value.some((row) => !row.nama.trim());
    if (invalid) {
        showToast('Nama berkas administrasi wajib diisi.', 'error');
        return;
    }

    const payload = items.value.map((row) => ({
        id: row.id,
        nama: row.nama.trim(),
        status: row.status,
        catatan: row.catatan.trim(),
    }));

    updateProgram(props.item.id, { administration: payload });
    items.value = payload;
    snapshot.value = JSON.stringify(items.value);
    showToast('Administrasi kegiatan berhasil disimpan.', 'success');
}
</script>

<template>
    <form class="space-y-5" novalidate @submit.prevent="save">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-sm font-bold">Administrasi Kegiatan</h2>
                <p class="mt-1 text-xs text-muted">Kelola daftar berkas dan status kelengkapannya.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <span class="badge bg-brand-soft text-brand">{{ completed }} / {{ items.length }} lengkap</span>
                <button type="button" class="btn-secondary min-h-11" @click="addItem">
                    <i class="ph-light ph-plus" aria-hidden="true"></i>
                    Tambah berkas
                </button>
            </div>
        </div>

        <div v-if="items.length" class="overflow-x-auto">
            <table class="tbl min-w-[820px]">
                <caption class="sr-only">Daftar administrasi event pengkaderan</caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th">Nama berkas</th>
                        <th scope="col" class="th">Status</th>
                        <th scope="col" class="th">Catatan</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="(row, index) in items" :key="row.id">
                        <td class="td">
                            <label :for="`admin-nama-${row.id}`" class="sr-only">Nama berkas {{ index + 1 }}</label>
                            <input :id="`admin-nama-${row.id}`" v-model="row.nama" class="input h-11 min-w-[12rem]" placeholder="TOR" />
                        </td>
                        <td class="td">
                            <label :for="`admin-status-${row.id}`" class="sr-only">Status berkas {{ index + 1 }}</label>
                            <select :id="`admin-status-${row.id}`" v-model="row.status" class="select h-11 min-w-[10rem] text-xs">
                                <option value="Belum diunggah">Belum diunggah</option>
                                <option value="Sudah diunggah">Sudah diunggah</option>
                                <option value="Tidak diperlukan">Tidak diperlukan</option>
                            </select>
                        </td>
                        <td class="td">
                            <label :for="`admin-catatan-${row.id}`" class="sr-only">Catatan berkas {{ index + 1 }}</label>
                            <input :id="`admin-catatan-${row.id}`" v-model="row.catatan" class="input h-11 min-w-[14rem]" placeholder="Keterangan berkas" />
                        </td>
                        <td class="td text-right">
                            <button type="button" class="icon-btn-sm hover:text-danger" :aria-label="`Hapus berkas ${row.nama || index + 1}`" title="Hapus berkas" @click="removeItem(index)">
                                <i class="ph-light ph-trash" aria-hidden="true"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="rounded-xl border border-dashed border-line bg-elevated/30 p-6 text-center">
            <i class="ph-light ph-folder-open mx-auto block text-3xl text-muted" aria-hidden="true"></i>
            <p class="mt-2 text-sm font-semibold">Belum ada berkas administrasi</p>
            <p class="text-xs text-muted">Tambahkan TOR, LPJ, dokumentasi, atau surat pengesahan.</p>
        </div>

        <div class="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="flex items-center gap-2 text-[11px] text-muted">
                <span :class="['h-1.5 w-1.5 rounded-full', dirty ? 'bg-accent' : 'bg-success']"></span>
                {{ dirty ? 'Ada perubahan administrasi yang belum disimpan.' : 'Semua perubahan administrasi tersimpan.' }}
            </p>
            <div class="flex justify-end gap-2">
                <button type="button" class="btn-secondary min-h-11" :disabled="!dirty" @click="reset">Batalkan</button>
                <button type="submit" class="btn-primary min-h-11" :disabled="!dirty">
                    <i class="ph-light ph-floppy-disk" aria-hidden="true"></i>
                    Simpan Administrasi
                </button>
            </div>
        </div>
    </form>
</template>
