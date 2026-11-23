<script setup>
import { computed, reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { PERIODE_STATUS } from '@/data/master';
import {
    attachPeriode,
    dashboard,
    pimpinanById,
    updateJabatan,
    updatePeriode,
    updatePimpinan,
} from '@/stores/dashboard';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
    pimpinanId: { type: String, required: true },
    label: { type: String, default: 'Masa Khidmat' },
});

const emit = defineEmits(['close', 'saved']);

const errors = reactive({});
const form = reactive({
    mulai: '',
    selesai: '',
    status: 'Aktif',
    catatan: '',
});

const pimpinan = computed(() => pimpinanById(props.pimpinanId));

const yearRange = computed(() => {
    const from = form.mulai ? new Date(`${form.mulai}T00:00:00`).getFullYear() : '';
    const until = form.selesai ? new Date(`${form.selesai}T00:00:00`).getFullYear() : '';

    if (!from && !until) return '—';
    return `${from || '…'}–${until || '…'}`;
});

function populate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (props.item) {
        Object.assign(form, {
            mulai: props.item.mulai ?? '',
            selesai: props.item.selesai ?? '',
            status: props.item.status ?? 'Aktif',
            catatan: props.item.catatan ?? '',
        });
        return;
    }

    const active = dashboard.periode.find(
        (row) => row.pimpinanId === props.pimpinanId && row.status === 'Aktif',
    );
    const year = new Date().getFullYear();
    const from = active?.selesai ? new Date(`${active.selesai}T00:00:00`) : new Date(year, 0, 1);
    if (active?.selesai) from.setDate(from.getDate() + 1);
    const until = new Date(from);
    until.setFullYear(until.getFullYear() + 2);
    until.setDate(until.getDate() - 1);
    const iso = (date) => {
        const pad = (value) => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    Object.assign(form, {
        mulai: iso(from),
        selesai: iso(until),
        status: 'Dijadwalkan',
        catatan: '',
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
    () => form.mulai,
    (value) => {
        if (!value || props.item) return;

        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) return;
        date.setFullYear(date.getFullYear() + 2);
        date.setDate(date.getDate() - 1);
        const pad = (value) => String(value).padStart(2, '0');
        form.selesai = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    },
);

function submit() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (!form.mulai) errors.mulai = 'Tanggal mulai wajib diisi.';
    if (!form.selesai) errors.selesai = 'Tanggal selesai wajib diisi.';
    if (form.mulai && form.selesai && form.selesai <= form.mulai) {
        errors.selesai = 'Tanggal selesai harus setelah tanggal mulai.';
    }

    if (Object.keys(errors).length) return;

    const payload = {
        pimpinanId: props.pimpinanId,
        nama: yearRange.value,
        mulai: form.mulai,
        selesai: form.selesai,
        status: form.status,
        catatan: form.catatan.trim() || '—',
    };

    const saved = props.item
        ? updatePeriode(props.item.id, payload)
        : attachPeriode(payload);

    dashboard.jabatan
        .filter((row) => row.periodeId === saved.id)
        .forEach((row) => updateJabatan(row.id, { mulai: saved.mulai, selesai: saved.selesai }));

    if (form.status === 'Aktif') {
        dashboard.periode
            .filter((row) => row.pimpinanId === props.pimpinanId && row.id !== saved.id)
            .forEach((row) => updatePeriode(row.id, { status: 'Berakhir' }));
        updatePimpinan(props.pimpinanId, { periode: saved.nama });
    }

    emit('saved', saved);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? `Ubah ${label}` : `Tambah ${label}`"
        :subtitle="pimpinan ? `Periode kepengurusan ${pimpinan.nama}.` : 'Periode kepengurusan.'"
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div class="rounded-xl bg-elevated px-4 py-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Nama periode</p>
                <p class="mt-1 font-mono text-sm font-semibold">{{ yearRange }}</p>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="masa-mulai" class="label">
                        Terhitung mulai <span class="text-danger">*</span>
                    </label>
                    <input id="masa-mulai" v-model="form.mulai" type="date" class="input" required />
                    <p v-if="errors.mulai" class="mt-1 text-[11px] font-medium text-danger">{{ errors.mulai }}</p>
                </div>
                <div>
                    <label for="masa-selesai" class="label">
                        Sampai <span class="text-danger">*</span>
                    </label>
                    <input id="masa-selesai" v-model="form.selesai" type="date" class="input" required />
                    <p v-if="errors.selesai" class="mt-1 text-[11px] font-medium text-danger">{{ errors.selesai }}</p>
                </div>
            </div>

            <div>
                <label for="masa-status" class="label">Status periode</label>
                <select id="masa-status" v-model="form.status" class="select">
                    <option v-for="status in PERIODE_STATUS" :key="status" :value="status">{{ status }}</option>
                </select>
                <p class="mt-1 text-[11px] text-muted">
                    Periode aktif lain pada pimpinan ini akan otomatis berstatus Berakhir.
                </p>
            </div>

            <div>
                <label for="masa-catatan" class="label">Catatan</label>
                <textarea
                    id="masa-catatan"
                    v-model="form.catatan"
                    class="input min-h-20 py-2.5"
                    placeholder="Catatan singkat masa khidmat…"
                ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Periode' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
