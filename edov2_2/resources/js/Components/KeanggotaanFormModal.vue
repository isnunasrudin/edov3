<script setup>
import { computed, reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import SearchSelect from './SearchSelect.vue';
import { JABATAN_STATUS } from '@/data/master';
import {
    anggotaById,
    attachJabatan,
    dashboard,
    periodeById,
    pimpinanById,
    updateJabatan,
} from '@/stores/dashboard';
import { formatDate } from '@/utils/format';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
    pimpinanId: { type: String, default: '' },
    anggotaId: { type: String, default: '' },
});

const emit = defineEmits(['close', 'saved']);

const errors = reactive({});
const form = reactive({
    anggotaId: '',
    pimpinanId: '',
    periodeId: '',
    nama: '',
    status: 'Menunggu Pelantikan',
    isAnggota: false,
});

const fixedPimpinan = computed(() => pimpinanById(props.pimpinanId) ?? null);
const fixedAnggota = computed(() => anggotaById(props.anggotaId) ?? null);
const selectedPimpinan = computed(() => pimpinanById(form.pimpinanId) ?? null);
const selectedAnggota = computed(() => anggotaById(form.anggotaId) ?? null);

const allowAnggota = computed(() => ['PK', 'PR'].includes(selectedPimpinan.value?.level));

const anggotaOptions = computed(() => {
    const org = fixedPimpinan.value?.org ?? selectedPimpinan.value?.org;

    return dashboard.anggota
        .filter((row) => !org || row.org === org || row.id === form.anggotaId)
        .map((row) => ({
            value: row.id,
            label: row.nama,
            description: `${row.nia} · ${row.org} · PAC ${row.pac}`,
        }));
});

const pimpinanOptions = computed(() => {
    const org = fixedAnggota.value?.org ?? selectedAnggota.value?.org;

    return dashboard.pimpinan
        .filter((row) => !org || row.org === org || row.id === form.pimpinanId)
        .map((row) => ({
            value: row.id,
            label: row.nama,
            description: `${row.level} · ${row.org} · ${row.region}`,
        }));
});

const periodeOptions = computed(() =>
    dashboard.periode
        .filter((row) => row.pimpinanId === form.pimpinanId)
        .map((row) => ({
            value: row.id,
            label: row.nama,
            description: `${formatDate(row.mulai)} – ${formatDate(row.selesai)}${row.status === 'Aktif' ? ' · Aktif' : ''}`,
        })),
);

const jabatanOptions = computed(() => {
    const org = selectedPimpinan.value?.org ?? fixedPimpinan.value?.org;
    const level = selectedPimpinan.value?.level;

    const options = dashboard.jenisJabatan
        .filter((row) => row.aktif && (!org || row.org === org))
        .filter((row) => !row.hanyaPrPk || ['PK', 'PR'].includes(level))
        .sort((a, b) => a.urutan - b.urutan || a.nama.localeCompare(b.nama, 'id'))
        .map((row) => ({
            value: row.nama,
            label: row.nama,
            description: `${row.tipe} · ${row.grup}`,
        }));

    if (form.nama && !options.some((option) => option.value === form.nama)) {
        options.push({ value: form.nama, label: form.nama, description: 'Jabatan lama' });
    }

    return options;
});

function resetErrors() {
    Object.keys(errors).forEach((key) => delete errors[key]);
}

function activePeriode(pimpinanId) {
    const periods = dashboard.periode.filter((row) => row.pimpinanId === pimpinanId);

    return periods.find((row) => row.status === 'Aktif') ?? periods[0] ?? null;
}

function populate() {
    resetErrors();

    if (props.item) {
        Object.assign(form, {
            anggotaId: props.item.anggotaId ?? props.anggotaId ?? '',
            pimpinanId: props.item.pimpinanId ?? props.pimpinanId ?? '',
            periodeId: props.item.periodeId ?? '',
            nama: props.item.nama ?? '',
            status: props.item.status ?? 'Aktif',
            isAnggota:
                props.item.nama === 'Anggota' &&
                ['PK', 'PR'].includes(pimpinanById(props.item.pimpinanId)?.level),
        });
        return;
    }

    const pimpinanId = props.pimpinanId || '';
    const period = activePeriode(pimpinanId);

    Object.assign(form, {
        anggotaId: props.anggotaId || '',
        pimpinanId,
        periodeId: period?.id ?? '',
        nama: '',
        status: 'Menunggu Pelantikan',
        isAnggota: false,
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
    () => form.pimpinanId,
    (pimpinanId) => {
        if (!pimpinanId) {
            form.periodeId = '';
            form.isAnggota = false;
            return;
        }

        if (!['PK', 'PR'].includes(pimpinanById(pimpinanId)?.level)) {
            form.isAnggota = false;
        }

        const period = activePeriode(pimpinanId);

        if (!periodeOptions.value.some((row) => row.value === form.periodeId)) {
            form.periodeId = period?.id ?? '';
        }
    },
);

watch(
    () => form.isAnggota,
    (value) => {
        if (value) form.nama = 'Anggota';
        else if (form.nama === 'Anggota') form.nama = '';
    },
);

function submit() {
    resetErrors();

    if (!form.anggotaId) errors.anggotaId = 'Pilih anggota.';
    if (!form.pimpinanId) errors.pimpinanId = 'Pilih pimpinan.';
    if (!form.periodeId) errors.periodeId = 'Pilih periode keanggotaan.';
    if (!form.isAnggota && !form.nama) errors.nama = 'Pilih jabatan.';

    const selectedJenis = dashboard.jenisJabatan.find(
        (row) =>
            row.org === selectedPimpinan.value?.org &&
            row.nama === (form.isAnggota ? 'Anggota' : form.nama),
    );

    if (selectedJenis?.hanyaPrPk && !['PK', 'PR'].includes(selectedPimpinan.value?.level)) {
        errors.nama = 'Jenis jabatan ini hanya dapat dipakai pada PR/PK.';
    }

    const periode = periodeById(form.periodeId);
    if (!periode) errors.periodeId = 'Periode tidak ditemukan.';

    const exists = dashboard.jabatan.filter(
        (row) =>
            row.id !== props.item?.id &&
            row.anggotaId === form.anggotaId &&
            row.pimpinanId === form.pimpinanId &&
            row.periodeId === form.periodeId,
    );

    if (exists.some((row) => row.nama === (form.isAnggota ? 'Anggota' : form.nama))) {
        errors.nama = 'Jabatan ini sudah tercatat pada periode yang sama.';
    }

    if (Object.keys(errors).length) return;

    const payload = {
        anggotaId: form.anggotaId,
        pimpinanId: form.pimpinanId,
        periodeId: form.periodeId,
        nama: form.isAnggota ? 'Anggota' : form.nama,
        status: form.status,
        mulai: periode?.mulai ?? '',
        selesai: periode?.selesai ?? '',
    };

    const saved = props.item
        ? updateJabatan(props.item.id, payload)
        : attachJabatan(payload);

    emit('saved', { item: saved, mode: props.item ? 'updated' : 'attached' });
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? 'Ubah Keanggotaan' : 'Tambah Keanggotaan'"
        :subtitle="
            fixedPimpinan
                ? `Atur keanggotaan pada ${fixedPimpinan.nama}.`
                : fixedAnggota
                  ? `Hubungkan ${fixedAnggota.nama} ke kepengurusan.`
                  : 'Hubungkan anggota dengan pimpinan dan periode.'
        "
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div v-if="fixedAnggota" class="rounded-xl border border-line bg-elevated/60 p-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Anggota</p>
                <p class="mt-1 text-sm font-semibold">{{ fixedAnggota.nama }}</p>
                <p class="text-[11px] text-muted">{{ fixedAnggota.nia }} · {{ fixedAnggota.org }} · PAC {{ fixedAnggota.pac }}</p>
            </div>

            <SearchSelect
                v-else
                id="keanggotaan-anggota"
                v-model="form.anggotaId"
                label="Anggota"
                :options="anggotaOptions"
                :error="errors.anggotaId"
                :clearable="false"
                :autofocus="!fixedAnggota"
                placeholder="Pilih anggota"
                search-placeholder="Cari nama atau NIA…"
                required
            />

            <div v-if="fixedPimpinan" class="rounded-xl border border-line bg-elevated/60 p-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Pimpinan</p>
                <p class="mt-1 text-sm font-semibold">{{ fixedPimpinan.nama }}</p>
                <p class="text-[11px] text-muted">{{ fixedPimpinan.level }} · {{ fixedPimpinan.org }} · {{ fixedPimpinan.region }}</p>
            </div>

            <SearchSelect
                v-else
                id="keanggotaan-pimpinan"
                v-model="form.pimpinanId"
                label="Pimpinan"
                :options="pimpinanOptions"
                :error="errors.pimpinanId"
                :clearable="false"
                :autofocus="!!fixedAnggota"
                placeholder="Pilih pimpinan"
                search-placeholder="Cari pimpinan…"
                required
            />

            <SearchSelect
                id="keanggotaan-periode"
                v-model="form.periodeId"
                label="Masa khidmat / bakti"
                :options="periodeOptions"
                :error="errors.periodeId"
                :clearable="false"
                :disabled="!form.pimpinanId"
                placeholder="Pilih periode"
                search-placeholder="Cari periode…"
                hint="Periode mengikuti data masa khidmat pimpinan."
                required
            />
            <p v-if="form.pimpinanId && !periodeOptions.length" class="rounded-xl bg-accent-soft p-3 text-[11px] leading-relaxed text-accent">
                Pimpinan ini belum memiliki periode. Tambahkan masa khidmat di detail pimpinan terlebih dahulu.
            </p>

            <label
                v-if="allowAnggota"
                class="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-elevated/50 p-3"
            >
                <input
                    id="keanggotaan-anggota-only"
                    v-model="form.isAnggota"
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand focus:ring-brand/30"
                />
                <span>
                    <span class="block text-sm font-semibold">Sebagai anggota</span>
                    <span class="block text-[11px] text-muted">Khusus PK &amp; PR. Jabatan pengurus tidak dipilih.</span>
                </span>
            </label>

            <SearchSelect
                v-if="!form.isAnggota"
                id="keanggotaan-jabatan"
                v-model="form.nama"
                label="Jabatan"
                :options="jabatanOptions"
                :error="errors.nama"
                :clearable="false"
                placeholder="Pilih jabatan"
                search-placeholder="Cari jabatan…"
                required
            />
            <div v-else class="rounded-xl border border-line bg-brand-soft/60 p-3">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-brand">Jabatan</p>
                <p class="mt-1 text-sm font-semibold text-brand">Anggota</p>
                <p v-if="errors.nama" class="mt-1 text-[11px] font-medium text-danger">{{ errors.nama }}</p>
            </div>

            <div>
                <label for="keanggotaan-status" class="label">Status keanggotaan</label>
                <select id="keanggotaan-status" v-model="form.status" class="select">
                    <option v-for="status in JABATAN_STATUS" :key="status" :value="status">{{ status }}</option>
                </select>
                <p class="mt-1 text-[11px] text-muted">
                    Keanggotaan baru dapat masuk sebagai Menunggu Pelantikan sebelum dikonfirmasi pimpinan.
                </p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Keanggotaan' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
