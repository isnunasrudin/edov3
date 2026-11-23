<script setup>
import { computed, reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { ADDRESS_LEVELS } from '@/data/reference';
import {
    addAlamat,
    alamatById,
    alamatPath,
    dashboard,
    updateAlamat,
} from '@/stores/dashboard';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
    parentId: { type: String, default: '' },
});

const emit = defineEmits(['close', 'saved']);

const errors = reactive({});
const form = reactive({ nama: '', kode: '' });

const parent = computed(() => (props.parentId ? alamatById(props.parentId) : null));

const currentLevel = computed(() => {
    if (props.item) return props.item.tingkat;
    if (!parent.value) return 'provinsi';
    if (parent.value.tingkat === 'provinsi') return 'kabupaten';
    if (parent.value.tingkat === 'kabupaten') return 'kecamatan';
    if (parent.value.tingkat === 'kecamatan') return 'desa';
    return 'desa';
});

const levelLabel = computed(
    () => ADDRESS_LEVELS.find((level) => level.value === currentLevel.value)?.label ?? currentLevel.value,
);

const parentPath = computed(() => {
    if (props.item?.parentId) return alamatPath(props.item.parentId).join(' › ');
    if (parent.value) return alamatPath(parent.value.id).join(' › ');
    return 'Tidak ada induk (tingkat provinsi)';
});

function populate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (props.item) {
        form.nama = props.item.nama;
        form.kode = props.item.kode;
        return;
    }

    form.nama = '';
    form.kode = '';
}

watch(
    () => props.open,
    (open) => {
        if (open) populate();
    },
    { immediate: true },
);

function submit() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (!form.nama.trim()) errors.nama = 'Nama wilayah wajib diisi.';
    if (!form.kode.trim()) errors.kode = 'Kode wilayah wajib diisi.';

    const duplicateCode = dashboard.alamat.some(
        (row) => row.id !== props.item?.id && row.kode === form.kode.trim(),
    );
    if (duplicateCode) errors.kode = 'Kode wilayah sudah dipakai.';

    const parentKey = props.item ? props.item.parentId : parent.value?.id ?? null;
    const duplicateName = dashboard.alamat.some(
        (row) =>
            row.id !== props.item?.id &&
            row.parentId === parentKey &&
            row.nama.toLowerCase() === form.nama.trim().toLowerCase(),
    );
    if (duplicateName) errors.nama = 'Nama wilayah sudah ada pada induk ini.';

    if (Object.keys(errors).length) return;

    const payload = {
        parentId: props.item ? props.item.parentId : parent.value?.id ?? null,
        kode: form.kode.trim(),
        tingkat: currentLevel.value,
        nama: form.nama.trim(),
    };

    const saved = props.item
        ? updateAlamat(props.item.id, payload)
        : addAlamat(payload);

    emit('saved', saved);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? 'Ubah Alamat' : `Tambah ${levelLabel}`"
        subtitle="Struktur wilayah mengikuti hierarki provinsi → kabupaten/kota → kecamatan → desa/kelurahan."
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div class="rounded-xl border border-line bg-elevated/60 p-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Tingkat</p>
                <div class="mt-1 flex flex-wrap items-center gap-2">
                    <span class="badge bg-brand-soft text-brand">{{ levelLabel }}</span>
                    <span class="text-xs text-muted">{{ parentPath }}</span>
                </div>
            </div>

            <div>
                <label for="alamat-nama" class="label">
                    Nama wilayah <span class="text-danger">*</span>
                </label>
                <input
                    id="alamat-nama"
                    v-model="form.nama"
                    class="input"
                    :placeholder="currentLevel === 'provinsi' ? 'Contoh: Jawa Timur' : 'Nama wilayah'"
                    required
                />
                <p v-if="errors.nama" class="mt-1 text-[11px] font-medium text-danger">{{ errors.nama }}</p>
            </div>

            <div>
                <label for="alamat-kode" class="label">
                    Kode wilayah <span class="text-danger">*</span>
                </label>
                <input
                    id="alamat-kode"
                    v-model="form.kode"
                    class="input font-mono"
                    placeholder="Contoh: 3503"
                    required
                />
                <p class="mt-1 text-[11px] text-muted">Kode mengikuti referensi wilayah; wajib unik.</p>
                <p v-if="errors.kode" class="mt-1 text-[11px] font-medium text-danger">{{ errors.kode }}</p>
            </div>

            <p class="rounded-xl bg-elevated p-3 text-[11px] leading-relaxed text-muted">
                <i class="ph-light ph-tree-structure mr-1" aria-hidden="true"></i>
                Alamat bertingkat. Tambah turunan dari tombol <b>+</b> pada baris pohon, bukan dari form ini.
            </p>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Wilayah' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
