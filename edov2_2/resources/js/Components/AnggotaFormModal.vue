<script setup>
import { reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { PAC_LIST } from '@/data/dashboard';
import { addAnggota } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

const props = defineProps({
    open: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'saved']);

const form = reactive({
    nama: '',
    nia: '',
    org: 'IPNU',
    pac: PAC_LIST[0],
    status: 'Aktif',
    jenjang: 'Anggota Muda',
    joined: new Date().getFullYear(),
});

function reset() {
    Object.assign(form, {
        nama: '',
        nia: '',
        org: 'IPNU',
        pac: PAC_LIST[0],
        status: 'Aktif',
        jenjang: 'Anggota Muda',
        joined: new Date().getFullYear(),
    });
}

watch(
    () => props.open,
    (open) => {
        if (open) reset();
    },
);

function submit() {
    const item = addAnggota({
        nama: form.nama.trim(),
        nia: form.nia.trim(),
        org: form.org,
        pac: form.pac,
        status: form.status,
        jenjang: form.jenjang,
        joined: Number(form.joined),
    });

    showToast(`Anggota “${item.nama}” berhasil ditambahkan.`);
    emit('saved', item);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        title="Tambah Anggota"
        subtitle="Daftarkan anggota baru ke basis data PC."
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div>
                <label for="anggota-nama" class="label">
                    Nama lengkap <span class="text-danger">*</span>
                </label>
                <input
                    id="anggota-nama"
                    v-model="form.nama"
                    class="input"
                    required
                    placeholder="Nama sesuai KTA"
                />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="anggota-nia" class="label">
                        NIA <span class="text-danger">*</span>
                    </label>
                    <input
                        id="anggota-nia"
                        v-model="form.nia"
                        class="input font-mono"
                        required
                        placeholder="2024.01.01234"
                    />
                </div>
                <div>
                    <label for="anggota-org" class="label">
                        Organisasi <span class="text-danger">*</span>
                    </label>
                    <select id="anggota-org" v-model="form.org" class="select" required>
                        <option value="IPNU">IPNU</option>
                        <option value="IPPNU">IPPNU</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="anggota-pac" class="label">
                        PAC <span class="text-danger">*</span>
                    </label>
                    <select id="anggota-pac" v-model="form.pac" class="select" required>
                        <option v-for="pac in PAC_LIST" :key="pac" :value="pac">{{ pac }}</option>
                    </select>
                </div>
                <div>
                    <label for="anggota-status" class="label">
                        Status <span class="text-danger">*</span>
                    </label>
                    <select id="anggota-status" v-model="form.status" class="select" required>
                        <option value="Aktif">Aktif</option>
                        <option value="Non-aktif">Non-aktif</option>
                        <option value="Cuti">Cuti</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="anggota-jenjang" class="label">
                        Jenjang <span class="text-danger">*</span>
                    </label>
                    <select id="anggota-jenjang" v-model="form.jenjang" class="select" required>
                        <option value="Anggota Muda">Anggota Muda</option>
                        <option value="Anggota">Anggota</option>
                        <option value="Kader">Kader</option>
                        <option value="Kader Utama">Kader Utama</option>
                    </select>
                </div>
                <div>
                    <label for="anggota-joined" class="label">
                        Tahun gabung <span class="text-danger">*</span>
                    </label>
                    <input
                        id="anggota-joined"
                        v-model="form.joined"
                        type="number"
                        min="1980"
                        max="2026"
                        class="input font-mono"
                        required
                    />
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>Simpan Anggota</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
