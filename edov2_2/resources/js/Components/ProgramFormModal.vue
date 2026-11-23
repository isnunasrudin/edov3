<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import SearchSelect from './SearchSelect.vue';
import DateRangePicker from './DateRangePicker.vue';
import { FORMAL_PENGKADERAN, formalPengkaderan } from '@/data/reference';
import { addProgram, dashboard, updateProgram } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { todayISO } from '@/utils/format';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
});

const emit = defineEmits(['close', 'saved']);

const errors = reactive({});
const logoInput = ref(null);

const pimpinanOptions = computed(() =>
    dashboard.pimpinan.map((item) => ({
        value: item.id,
        label: item.nama,
        description: `${item.level} · ${item.org} · ${item.region}`,
    })),
);

const formalOptions = FORMAL_PENGKADERAN.map((item) => ({
    value: item.shortname,
    label: `${item.shortname} — ${item.fullname}`,
    description: item.untuk.join(' & '),
}));

const defaults = () => ({
    type: 'Formal',
    nama: '',
    jenjang: 'MAKESTA',
    pimpinanId: null,
    isExternal: false,
    externalPelaksana: '',
    tanggal: todayISO(),
    startTime: '',
    durasi: 1,
    lokasi: '',
    logo: '',
    registrationFrom: '',
    registrationUntil: '',
    kuotaInternal: 0,
    kuotaExternal: 0,
    registrationForced: false,
});

const form = reactive(defaults());

const selectedFormal = computed(() => formalPengkaderan(form.jenjang));
const totalKuota = computed(
    () => Number(form.kuotaInternal || 0) + Number(form.kuotaExternal || 0),
);
const eventDate = computed({
    get: () => ({ start: form.tanggal, end: form.tanggal, startTime: form.startTime, endTime: '' }),
    set: (value) => {
        form.tanggal = value.start;
        form.startTime = value.startTime;
    },
});
const registrationRange = computed({
    get: () => ({ start: form.registrationFrom, end: form.registrationUntil, startTime: '', endTime: '' }),
    set: (value) => {
        form.registrationFrom = value.start;
        form.registrationUntil = value.end;
    },
});
const hasErrors = computed(() => Object.keys(errors).length > 0);

function populate() {
    Object.keys(errors).forEach((key) => delete errors[key]);
    const item = props.item ?? {};

    Object.assign(form, defaults(), {
        type: item.type ?? 'Formal',
        nama: item.nama ?? '',
        jenjang: item.jenjang ?? (item.type === 'Non-Formal' ? '' : 'MAKESTA'),
        pimpinanId: item.pimpinanId ?? null,
        isExternal: item.isExternal ?? false,
        externalPelaksana: item.externalPelaksana ?? '',
        tanggal: item.tanggal ?? todayISO(),
        startTime: item.startTime ?? '',
        durasi: item.durasi ?? 1,
        lokasi: item.lokasi ?? '',
        logo: item.logo ?? '',
        registrationFrom: item.registrationFrom ?? '',
        registrationUntil: item.registrationUntil ?? '',
        kuotaInternal: item.kuotaInternal ?? 0,
        kuotaExternal: item.kuotaExternal ?? 0,
        registrationForced: item.registrationForced ?? false,
    });

    if (!props.item && form.type === 'Formal' && form.jenjang === 'MAKESTA') {
        form.durasi = 2;
    }
}

watch(
    () => props.open,
    (open) => {
        if (open) populate();
    },
    { immediate: true },
);

watch(
    () => form.type,
    (type) => {
        if (type === 'Formal' && !form.jenjang) form.jenjang = 'MAKESTA';
    },
);

watch(
    () => form.jenjang,
    (value) => {
        if (!props.item && value === 'MAKESTA') form.durasi = 2;
    },
);

function validate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (form.type === 'Formal' && !form.jenjang) errors.jenjang = 'Jenjang wajib dipilih.';
    if (form.type === 'Non-Formal' && !form.nama.trim()) errors.nama = 'Nama kegiatan wajib diisi.';
    if (form.isExternal && !form.externalPelaksana.trim()) errors.externalPelaksana = 'Nama pelaksana wajib diisi.';
    if (!form.isExternal && !form.pimpinanId) errors.pimpinanId = 'Pilih pimpinan penyelenggara.';
    if (!form.tanggal) errors.tanggal = 'Tanggal mulai wajib diisi.';
    if (!form.durasi || Number(form.durasi) < 1) errors.durasi = 'Durasi minimal 1 hari.';
    if (form.registrationFrom && form.registrationUntil && form.registrationUntil < form.registrationFrom) {
        errors.registrationUntil = 'Tanggal ditutup harus setelah tanggal dibuka.';
    }

    return Object.keys(errors).length === 0;
}

function derivedStatus() {
    const today = todayISO();
    const from = form.registrationFrom;
    const until = form.registrationUntil;

    if (form.registrationForced || (from && from <= today && (!until || until >= today))) {
        return 'Pendaftaran';
    }

    if (form.tanggal > today) return 'Dijadwalkan';

    const end = new Date(`${form.tanggal}T00:00:00`);
    end.setDate(end.getDate() + Math.max(1, Number(form.durasi || 1)) - 1);

    return end < new Date(`${today}T00:00:00`) ? 'Selesai' : 'Berjalan';
}

async function submit() {
    if (!validate()) {
        await nextTick();
        const fieldMap = {
            jenjang: 'program-jenjang',
            nama: 'program-nama',
            pimpinanId: 'program-pimpinan',
            externalPelaksana: 'program-external-name',
            tanggal: 'program-tanggal',
            durasi: 'program-durasi',
            registrationUntil: 'program-registration',
        };
        const first = Object.keys(errors).map((key) => fieldMap[key]).find(Boolean);
        if (first) document.getElementById(first)?.focus();
        return;
    }

    const formal = form.type === 'Formal';
    const payload = {
        type: form.type,
        nama: formal ? form.jenjang : form.nama.trim(),
        jenjang: formal ? form.jenjang : '',
        fullName: formal ? selectedFormal.value?.fullname ?? form.jenjang : '',
        pimpinanId: form.isExternal ? null : form.pimpinanId,
        isExternal: form.isExternal,
        externalPelaksana: form.isExternal ? form.externalPelaksana.trim() : '',
        tanggal: form.tanggal,
        startTime: form.startTime || '',
        durasi: Math.max(1, Number(form.durasi)),
        lokasi: form.lokasi.trim() || '—',
        logo: form.logo,
        registrationFrom: form.registrationFrom || null,
        registrationUntil: form.registrationUntil || null,
        kuotaInternal: Math.max(0, Number(form.kuotaInternal || 0)),
        kuotaExternal: Math.max(0, Number(form.kuotaExternal || 0)),
        kuota: totalKuota.value,
        registrationForced: form.registrationForced,
        peserta: props.item?.peserta ?? 0,
        status: derivedStatus(),
    };

    const saved = props.item
        ? updateProgram(props.item.id, payload)
        : addProgram(payload);

    showToast(
        props.item
            ? `Event “${saved.nama}” berhasil diperbarui.`
            : `Event “${saved.nama}” berhasil dibuat.`,
    );

    emit('saved', saved);
    emit('close');
}

function onLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran logo maksimal 2 MB.', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        form.logo = String(reader.result ?? '');
    };
    reader.readAsDataURL(file);
}

function removeLogo() {
    form.logo = '';
    if (logoInput.value) logoInput.value.value = '';
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? 'Ubah Event Pengkaderan' : 'Buat Event Pengkaderan'"
        subtitle="Sesuaikan data event, pelaksana, dan pendaftaran peserta."
        size="lg"
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" novalidate @submit.prevent="submit">
            <div
                v-if="hasErrors"
                role="alert"
                class="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft px-3 py-2.5 text-xs font-medium text-danger"
            >
                <i class="ph-light ph-warning-circle mt-0.5 text-base" aria-hidden="true"></i>
                <span>Periksa field yang ditandai. Data belum tersimpan.</span>
            </div>

            <fieldset>
                <legend class="label">Tipe <span class="text-danger">*</span></legend>
                <div class="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        :aria-pressed="form.type === 'Formal'"
                        :class="[
                            'min-h-11 cursor-pointer rounded-xl border px-3 text-sm font-semibold transition',
                            form.type === 'Formal'
                                ? 'border-brand bg-brand-soft text-brand'
                                : 'border-line bg-surface text-muted hover:bg-elevated',
                        ]"
                        @click="form.type = 'Formal'"
                    >
                        Formal
                    </button>
                    <button
                        type="button"
                        :aria-pressed="form.type === 'Non-Formal'"
                        :class="[
                            'min-h-11 cursor-pointer rounded-xl border px-3 text-sm font-semibold transition',
                            form.type === 'Non-Formal'
                                ? 'border-brand bg-brand-soft text-brand'
                                : 'border-line bg-surface text-muted hover:bg-elevated',
                        ]"
                        @click="form.type = 'Non-Formal'"
                    >
                        Non-Formal
                    </button>
                </div>
            </fieldset>

            <div v-if="form.type === 'Formal'">
                <label for="program-jenjang" class="label">
                    Jenjang <span class="text-danger">*</span>
                </label>
                <select id="program-jenjang" v-model="form.jenjang" class="select min-h-11" :aria-invalid="!!errors.jenjang">
                    <option v-for="option in formalOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
                <p v-if="selectedFormal" class="mt-1 text-[11px] text-muted">{{ selectedFormal.fullname }}</p>
                <p v-if="errors.jenjang" class="mt-1 text-[11px] font-medium text-danger">{{ errors.jenjang }}</p>
            </div>

            <div v-else>
                <label for="program-nama" class="label">
                    Nama kegiatan <span class="text-danger">*</span>
                </label>
                <input
                    id="program-nama"
                    v-model="form.nama"
                    class="input min-h-11"
                    placeholder="Sekolah Kader Digital"
                    :aria-invalid="!!errors.nama"
                />
                <p v-if="errors.nama" class="mt-1 text-[11px] font-medium text-danger">{{ errors.nama }}</p>
            </div>

            <div class="rounded-xl border border-line bg-elevated/40 p-3">
                <label class="flex cursor-pointer items-start gap-3">
                    <input
                        id="program-external"
                        v-model="form.isExternal"
                        type="checkbox"
                        class="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand focus:ring-brand/30"
                    />
                    <span>
                        <span class="block text-sm font-semibold">Dilaksanakan di luar Trenggalek</span>
                        <span class="block text-[11px] text-muted">Aktifkan untuk mengisi nama pelaksana eksternal.</span>
                    </span>
                </label>

                <div v-if="form.isExternal" class="mt-3">
                    <label for="program-external-name" class="label">
                        Dilaksanakan oleh <span class="text-danger">*</span>
                    </label>
                    <input
                        id="program-external-name"
                        v-model="form.externalPelaksana"
                        class="input min-h-11"
                        placeholder="PW IPNU Jawa Timur"
                        :aria-invalid="!!errors.externalPelaksana"
                    />
                    <p v-if="errors.externalPelaksana" class="mt-1 text-[11px] font-medium text-danger">{{ errors.externalPelaksana }}</p>
                </div>

                <div v-else class="mt-3">
                    <SearchSelect
                        id="program-pimpinan"
                        v-model="form.pimpinanId"
                        label="Dilaksanakan oleh"
                        :options="pimpinanOptions"
                        :error="errors.pimpinanId"
                        :clearable="false"
                        placeholder="Pilih pimpinan"
                        search-placeholder="Cari pimpinan…"
                        required
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div class="sm:col-span-2">
                    <DateRangePicker
                        id="program-tanggal"
                        v-model="eventDate"
                        label="Tanggal & waktu mulai"
                        mode="single"
                        with-time
                        required
                        :error="errors.tanggal"
                        placeholder="Pilih tanggal"
                    />
                </div>
                <div>
                    <label for="program-durasi" class="label">
                        Durasi (hari) <span class="text-danger">*</span>
                    </label>
                    <input
                        id="program-durasi"
                        v-model="form.durasi"
                        type="number"
                        min="1"
                        max="30"
                        class="input min-h-11 font-mono"
                        :aria-invalid="!!errors.durasi"
                    />
                    <p v-if="errors.durasi" class="mt-1 text-[11px] font-medium text-danger">{{ errors.durasi }}</p>
                </div>
            </div>

            <div>
                <label for="program-lokasi" class="label">Tempat pelaksanaan</label>
                <input id="program-lokasi" v-model="form.lokasi" class="input min-h-11" placeholder="SMKN 1 Trenggalek" />
            </div>

            <div class="rounded-xl border border-line bg-elevated/40 p-4">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Logo kegiatan</p>
                <div class="mt-3 flex items-center gap-3">
                    <span class="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-soft text-brand ring-1 ring-line/60">
                        <img v-if="form.logo" :src="form.logo" alt="" class="h-full w-full object-cover" />
                        <i v-else class="ph-light ph-image text-xl" aria-hidden="true"></i>
                    </span>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" class="btn-secondary min-h-11" @click="logoInput?.click()">
                                <i class="ph-light ph-upload-simple" aria-hidden="true"></i>
                                {{ form.logo ? 'Ganti logo' : 'Unggah logo' }}
                            </button>
                            <button v-if="form.logo" type="button" class="btn-ghost btn-sm min-h-11" @click="removeLogo">Hapus</button>
                        </div>
                        <p class="mt-1 text-[11px] text-muted">JPG/PNG, maks. 2 MB.</p>
                        <input
                            id="program-logo"
                            ref="logoInput"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            class="sr-only"
                            aria-label="Unggah logo kegiatan"
                            @change="onLogo"
                        />
                    </div>
                </div>
            </div>

            <fieldset class="rounded-xl border border-line p-4">
                <legend class="label px-1">Pendaftaran peserta</legend>
                <p class="mb-3 text-[11px] leading-relaxed text-muted">
                    Isi rentang tanggal pendaftaran, aktifkan paksa untuk membukanya tanpa rentang, atau kosongkan keduanya untuk menutup pendaftaran.
                </p>

                <DateRangePicker
                    id="program-registration"
                    v-model="registrationRange"
                    label="Rentang pendaftaran"
                    :error="errors.registrationUntil"
                    hint="Kosongkan rentang lalu aktifkan paksa untuk pendaftaran tanpa batas."
                    placeholder="Pilih rentang pendaftaran"
                />

                <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label for="program-kuota-internal" class="label">Kuota internal</label>
                        <input id="program-kuota-internal" v-model="form.kuotaInternal" type="number" min="0" class="input min-h-11 font-mono" />
                    </div>
                    <div>
                        <label for="program-kuota-external" class="label">Kuota eksternal</label>
                        <input id="program-kuota-external" v-model="form.kuotaExternal" type="number" min="0" class="input min-h-11 font-mono" />
                    </div>
                </div>

                <div class="mt-3 flex items-center justify-between gap-3 rounded-lg bg-elevated px-3 py-2.5">
                    <span class="text-[11px] font-medium text-muted">Total kuota</span>
                    <span class="font-mono text-sm font-semibold tabular-nums">{{ totalKuota }}</span>
                </div>

                <label class="mt-3 flex cursor-pointer items-start gap-3">
                    <input
                        id="program-registration-forced"
                        v-model="form.registrationForced"
                        type="checkbox"
                        class="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand focus:ring-brand/30"
                    />
                    <span>
                        <span class="block text-sm font-semibold">Paksa pendaftaran tetap dibuka</span>
                        <span class="block text-[11px] text-muted">Abaikan rentang tanggal pendaftaran.</span>
                    </span>
                </label>
            </fieldset>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary min-h-11" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary min-h-11 group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Event' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
