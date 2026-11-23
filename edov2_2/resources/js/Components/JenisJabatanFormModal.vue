<script setup>
import { computed, reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { JENIS_JABATAN_GROUPS, JENIS_JABATAN_TIPE } from '@/data/reference';
import { addJenisJabatan, dashboard, updateJenisJabatan } from '@/stores/dashboard';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
});

const emit = defineEmits(['close', 'saved']);

const errors = reactive({});
const form = reactive({
    org: 'IPNU',
    kode: '',
    nama: '',
    grup: 'Pengurus Harian',
    tipe: 'Pengurus',
    hanyaPrPk: false,
    aktif: true,
    urutan: 10,
});

const isDefault = computed(() => !!props.item?.default);

function populate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (props.item) {
        Object.assign(form, {
            org: props.item.org,
            kode: props.item.kode,
            nama: props.item.nama,
            grup: props.item.grup,
            tipe: props.item.tipe,
            hanyaPrPk: props.item.hanyaPrPk,
            aktif: props.item.aktif,
            urutan: props.item.urutan,
        });
        return;
    }

    Object.assign(form, {
        org: 'IPNU',
        kode: '',
        nama: '',
        grup: 'Pengurus Harian',
        tipe: 'Pengurus',
        hanyaPrPk: false,
        aktif: true,
        urutan: 10,
    });
}

watch(
    () => props.open,
    (open) => {
        if (open) populate();
    },
    { immediate: true },
);

watch(
    () => form.tipe,
    (tipe) => {
        if (tipe === 'Anggota') form.hanyaPrPk = true;
    },
);

function submit() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (!form.org) errors.org = 'Organisasi wajib dipilih.';
    if (!form.kode.trim()) errors.kode = 'Kode wajib diisi.';
    if (!form.nama.trim()) errors.nama = 'Nama wajib diisi.';

    const duplicateCode = dashboard.jenisJabatan.some(
        (row) =>
            row.id !== props.item?.id &&
            row.org === form.org &&
            row.kode.toLowerCase() === form.kode.trim().toLowerCase(),
    );
    const duplicateName = dashboard.jenisJabatan.some(
        (row) =>
            row.id !== props.item?.id &&
            row.org === form.org &&
            row.nama.toLowerCase() === form.nama.trim().toLowerCase(),
    );

    if (duplicateCode) errors.kode = 'Kode sudah dipakai pada organisasi ini.';
    if (duplicateName) errors.nama = 'Nama sudah dipakai pada organisasi ini.';

    if (Object.keys(errors).length) return;

    const payload = {
        org: form.org,
        kode: form.kode.trim().toLowerCase(),
        nama: form.nama.trim(),
        grup: form.grup,
        tipe: form.tipe,
        hanyaPrPk: form.tipe === 'Anggota' ? true : form.hanyaPrPk,
        default: props.item?.default ?? false,
        aktif: isDefault.value ? true : form.aktif,
        urutan: Number(form.urutan) || 10,
    };

    const saved = props.item
        ? updateJenisJabatan(props.item.id, payload)
        : addJenisJabatan(payload);

    emit('saved', saved);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? 'Ubah Jenis Jabatan' : 'Tambah Jenis Jabatan'"
        subtitle="Referensi jenis jabatan dan aturan penggunaannya."
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div v-if="isDefault" class="rounded-xl border border-line bg-elevated/60 p-3 text-[11px] leading-relaxed text-muted">
                <span class="badge bg-brand-soft text-brand">Default</span>
                <p class="mt-2">
                    Jenis jabatan default <b>Anggota</b> wajib ada, tidak dapat dihapus, dan hanya dapat dipakai oleh PR/PK.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="jenis-org" class="label">
                        Organisasi <span class="text-danger">*</span>
                    </label>
                    <select id="jenis-org" v-model="form.org" class="select" :disabled="isDefault" required>
                        <option value="IPNU">IPNU</option>
                        <option value="IPPNU">IPPNU</option>
                    </select>
                    <p v-if="errors.org" class="mt-1 text-[11px] font-medium text-danger">{{ errors.org }}</p>
                </div>
                <div>
                    <label for="jenis-kode" class="label">
                        Kode <span class="text-danger">*</span>
                    </label>
                    <input
                        id="jenis-kode"
                        v-model="form.kode"
                        class="input font-mono"
                        placeholder="ipnu.ph.ketua"
                        :disabled="isDefault"
                        required
                    />
                    <p v-if="errors.kode" class="mt-1 text-[11px] font-medium text-danger">{{ errors.kode }}</p>
                </div>
            </div>

            <div>
                <label for="jenis-nama" class="label">
                    Nama jenis jabatan <span class="text-danger">*</span>
                </label>
                <input
                    id="jenis-nama"
                    v-model="form.nama"
                    class="input"
                    placeholder="Contoh: Ketua"
                    :disabled="isDefault"
                    required
                />
                <p v-if="errors.nama" class="mt-1 text-[11px] font-medium text-danger">{{ errors.nama }}</p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="jenis-grup" class="label">Grup</label>
                    <select id="jenis-grup" v-model="form.grup" class="select">
                        <option v-for="grup in JENIS_JABATAN_GROUPS" :key="grup" :value="grup">{{ grup }}</option>
                    </select>
                </div>
                <div>
                    <label for="jenis-tipe" class="label">Tipe</label>
                    <select id="jenis-tipe" v-model="form.tipe" class="select" :disabled="isDefault">
                        <option v-for="tipe in JENIS_JABATAN_TIPE" :key="tipe" :value="tipe">{{ tipe }}</option>
                    </select>
                </div>
            </div>

            <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-elevated/50 p-3">
                <input
                    id="jenis-hanya-pr-pk"
                    v-model="form.hanyaPrPk"
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand focus:ring-brand/30"
                    :disabled="isDefault || form.tipe === 'Anggota'"
                />
                <span>
                    <span class="block text-sm font-semibold">Hanya untuk PR/PK</span>
                    <span class="block text-[11px] text-muted">
                        Tipe Anggota otomatis dibatasi untuk PR/PK. Jabatan pengurus dapat dipakai di semua level.
                    </span>
                </span>
            </label>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="jenis-urutan" class="label">Urutan</label>
                    <input id="jenis-urutan" v-model="form.urutan" type="number" min="1" class="input font-mono" />
                </div>
                <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-elevated/50 p-3">
                    <input
                        id="jenis-aktif"
                        v-model="form.aktif"
                        type="checkbox"
                        class="h-4 w-4 shrink-0 rounded border-line text-brand focus:ring-brand/30"
                        :disabled="isDefault"
                    />
                    <span class="text-sm font-semibold">Aktif</span>
                </label>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Jenis' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
