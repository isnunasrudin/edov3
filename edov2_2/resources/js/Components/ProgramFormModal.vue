<script setup>
import { reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { addProgram } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { todayISO } from '@/utils/format';

const props = defineProps({
    open: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'saved']);

const form = reactive({
    nama: '',
    level: 'Dasar',
    kuota: 40,
    tanggal: todayISO(),
    status: 'Dijadwalkan',
});

function reset() {
    Object.assign(form, {
        nama: '',
        level: 'Dasar',
        kuota: 40,
        tanggal: todayISO(),
        status: 'Dijadwalkan',
    });
}

watch(
    () => props.open,
    (open) => {
        if (open) reset();
    },
);

function submit() {
    const item = addProgram({
        nama: form.nama.trim(),
        level: form.level,
        kuota: Number(form.kuota),
        tanggal: form.tanggal,
        status: form.status,
    });

    showToast(`Program “${item.nama}” berhasil dibuat.`);
    emit('saved', item);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        title="Buat Program Kaderisasi"
        subtitle="Tambahkan agenda pelatihan kader baru."
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div>
                <label for="program-nama" class="label">
                    Nama program <span class="text-danger">*</span>
                </label>
                <input
                    id="program-nama"
                    v-model="form.nama"
                    class="input"
                    required
                    placeholder="MAKESTA Angkatan XXV"
                />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="program-level" class="label">
                        Jenjang <span class="text-danger">*</span>
                    </label>
                    <select id="program-level" v-model="form.level" class="select" required>
                        <option value="Dasar">Dasar</option>
                        <option value="Menengah">Menengah</option>
                        <option value="Lanjutan">Lanjutan</option>
                        <option value="Tinggi">Tinggi</option>
                    </select>
                </div>
                <div>
                    <label for="program-kuota" class="label">
                        Kuota peserta <span class="text-danger">*</span>
                    </label>
                    <input
                        id="program-kuota"
                        v-model="form.kuota"
                        type="number"
                        min="1"
                        max="500"
                        class="input font-mono"
                        required
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="program-tanggal" class="label">
                        Tanggal mulai <span class="text-danger">*</span>
                    </label>
                    <input
                        id="program-tanggal"
                        v-model="form.tanggal"
                        type="date"
                        class="input"
                        required
                    />
                </div>
                <div>
                    <label for="program-status" class="label">
                        Status <span class="text-danger">*</span>
                    </label>
                    <select id="program-status" v-model="form.status" class="select" required>
                        <option value="Dijadwalkan">Dijadwalkan</option>
                        <option value="Pendaftaran">Pendaftaran</option>
                        <option value="Berjalan">Berjalan</option>
                    </select>
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>Simpan Program</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
