<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import SearchSelect from './SearchSelect.vue';
import DateRangePicker from './DateRangePicker.vue';
import { FORMAL_PENGKADERAN, formalPengkaderan } from '@/data/reference';
import { dashboard, updateProgram } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { todayISO } from '@/utils/format';
import { deriveEventStatus } from '@/utils/kaderisasi';

const props = defineProps({
    item: { type: Object, required: true },
});

const emit = defineEmits(['saved']);

const errors = reactive({});
const snapshot = ref('');
const logoInput = ref(null);

const pimpinanOptions = computed(() =>
    dashboard.pimpinan.map((row) => ({
        value: row.id,
        label: row.nama,
        description: `${row.level} · ${row.org} · ${row.region}`,
    })),
);

const formalOptions = FORMAL_PENGKADERAN.map((row) => ({
    value: row.shortname,
    label: `${row.shortname} — ${row.fullname}`,
    description: row.untuk.join(' & '),
}));

const form = reactive({
    type: 'Formal',
    jenjang: 'MAKESTA',
    nama: '',
    pimpinanId: null,
    isExternal: false,
    externalPelaksana: '',
    tanggal: '',
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

const dirty = computed(() => snapshot.value !== '' && JSON.stringify(form) !== snapshot.value);
const hasErrors = computed(() => Object.keys(errors).length > 0);
const selectedFormal = computed(() => formalPengkaderan(form.jenjang));
const total = computed(() => Number(form.kuotaInternal || 0) + Number(form.kuotaExternal || 0));
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

function populate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    Object.assign(form, {
        type: props.item.type ?? 'Formal',
        jenjang: props.item.jenjang ?? 'MAKESTA',
        nama: props.item.nama ?? '',
        pimpinanId: props.item.pimpinanId ?? null,
        isExternal: props.item.isExternal ?? false,
        externalPelaksana: props.item.externalPelaksana ?? '',
        tanggal: props.item.tanggal ?? todayISO(),
        startTime: props.item.startTime ?? '',
        durasi: props.item.durasi ?? 1,
        lokasi: props.item.lokasi ?? '',
        logo: props.item.logo ?? '',
        registrationFrom: props.item.registrationFrom ?? '',
        registrationUntil: props.item.registrationUntil ?? '',
        kuotaInternal: props.item.kuotaInternal ?? 0,
        kuotaExternal: props.item.kuotaExternal ?? 0,
        registrationForced: props.item.registrationForced ?? false,
    });

    snapshot.value = JSON.stringify(form);
}

watch(
    () => props.item.id,
    () => populate(),
    { immediate: true },
);

watch(
    () => form.type,
    (value) => {
        if (value === 'Formal' && !form.jenjang) form.jenjang = 'MAKESTA';
    },
);

function validate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (form.type === 'Formal' && !form.jenjang) errors.jenjang = 'Jenjang wajib dipilih.';
    if (form.type === 'Non-Formal' && !form.nama.trim()) errors.nama = 'Nama kegiatan wajib diisi.';
    if (!form.isExternal && !form.pimpinanId) errors.pimpinanId = 'Pilih pimpinan penyelenggara.';
    if (form.isExternal && !form.externalPelaksana.trim()) errors.externalPelaksana = 'Nama pelaksana wajib diisi.';
    if (!form.tanggal) errors.tanggal = 'Tanggal mulai wajib diisi.';
    if (!form.durasi || Number(form.durasi) < 1) errors.durasi = 'Durasi minimal 1 hari.';
    if (form.registrationFrom && form.registrationUntil && form.registrationUntil < form.registrationFrom) {
        errors.registrationUntil = 'Tanggal pendaftaran ditutup harus setelah dibuka.';
    }

    return Object.keys(errors).length === 0;
}

async function submit() {
    if (!validate()) {
        await nextTick();
        const map = {
            jenjang: 'event-jenjang',
            nama: 'event-nama',
            pimpinanId: 'event-pimpinan',
            externalPelaksana: 'event-external-name',
            tanggal: 'event-tanggal',
            durasi: 'event-durasi',
            registrationUntil: 'event-registration',
        };
        const first = Object.keys(errors).map((key) => map[key]).find(Boolean);
        if (first) document.getElementById(first)?.focus();
        return;
    }

    const formal = form.type === 'Formal';
    const nextProgram = {
        ...props.item,
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
        kuota: total.value,
        registrationForced: form.registrationForced,
    };

    const saved = updateProgram(props.item.id, {
        ...nextProgram,
        status: deriveEventStatus(nextProgram),
    });

    snapshot.value = JSON.stringify(form);
    showToast(`Event “${saved.nama}” berhasil diperbarui.`);
    emit('saved', saved);
}

function reset() {
    populate();
    showToast('Perubahan event dibatalkan.', 'info');
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
    <form class="space-y-6" novalidate @submit.prevent="submit">
        <div v-if="hasErrors" role="alert" class="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-xs font-medium text-danger">
            <i class="ph-light ph-warning-circle mt-0.5 text-base" aria-hidden="true"></i>
            <span>Periksa field yang ditandai. Data event belum tersimpan.</span>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section class="space-y-4">
                <div class="flex items-center gap-2.5 border-b border-line pb-3">
                    <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                        <i class="ph-light ph-calendar-blank text-lg" aria-hidden="true"></i>
                    </span>
                    <div>
                        <h3 class="text-sm font-bold">Informasi event</h3>
                        <p class="text-[11px] text-muted">Jenis, jadwal, dan lokasi kegiatan.</p>
                    </div>
                </div>

                <fieldset>
                    <legend class="label">Tipe <span class="text-danger">*</span></legend>
                    <div class="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            :aria-pressed="form.type === 'Formal'"
                            :class="[
                                'min-h-11 cursor-pointer rounded-xl border px-3 text-sm font-semibold transition',
                                form.type === 'Formal' ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-surface text-muted hover:bg-elevated',
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
                                form.type === 'Non-Formal' ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-surface text-muted hover:bg-elevated',
                            ]"
                            @click="form.type = 'Non-Formal'"
                        >
                            Non-Formal
                        </button>
                    </div>
                </fieldset>

                <div v-if="form.type === 'Formal'">
                    <label for="event-jenjang" class="label">Jenjang <span class="text-danger">*</span></label>
                    <select id="event-jenjang" v-model="form.jenjang" class="select min-h-11" :aria-invalid="!!errors.jenjang">
                        <option v-for="option in formalOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                    </select>
                    <p v-if="selectedFormal" class="mt-1 text-[11px] text-muted">{{ selectedFormal.fullname }}</p>
                    <p v-if="errors.jenjang" class="mt-1 text-[11px] font-medium text-danger">{{ errors.jenjang }}</p>
                </div>
                <div v-else>
                    <label for="event-nama" class="label">Nama kegiatan <span class="text-danger">*</span></label>
                    <input id="event-nama" v-model="form.nama" class="input min-h-11" placeholder="Sekolah Kader Digital" :aria-invalid="!!errors.nama" />
                    <p v-if="errors.nama" class="mt-1 text-[11px] font-medium text-danger">{{ errors.nama }}</p>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div class="sm:col-span-2">
                        <DateRangePicker
                            id="event-tanggal"
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
                        <label for="event-durasi" class="label">Durasi (hari) <span class="text-danger">*</span></label>
                        <input id="event-durasi" v-model="form.durasi" type="number" min="1" max="30" class="input min-h-11 font-mono" :aria-invalid="!!errors.durasi" />
                        <p v-if="errors.durasi" class="mt-1 text-[11px] font-medium text-danger">{{ errors.durasi }}</p>
                    </div>
                </div>

                <div>
                    <label for="event-lokasi" class="label">Tempat pelaksanaan</label>
                    <input id="event-lokasi" v-model="form.lokasi" class="input min-h-11" placeholder="SMKN 1 Trenggalek" />
                </div>
            </section>

            <section class="space-y-4 lg:border-l lg:border-line lg:pl-6">
                <div class="flex items-center gap-2.5 border-b border-line pb-3">
                    <span class="grid h-9 w-9 place-items-center rounded-xl bg-info-soft text-info">
                        <i class="ph-light ph-users-three text-lg" aria-hidden="true"></i>
                    </span>
                    <div>
                        <h3 class="text-sm font-bold">Pelaksana &amp; identitas</h3>
                        <p class="text-[11px] text-muted">Pelaksana dan logo kegiatan.</p>
                    </div>
                </div>

                <div class="rounded-xl border border-line bg-elevated/40 p-3">
                    <label class="flex cursor-pointer items-start gap-3">
                        <input v-model="form.isExternal" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand focus:ring-brand/30" />
                        <span>
                            <span class="block text-sm font-semibold">Dilaksanakan di luar Trenggalek</span>
                            <span class="block text-[11px] text-muted">Isi nama pelaksana eksternal.</span>
                        </span>
                    </label>

                    <div v-if="form.isExternal" class="mt-3">
                        <label for="event-external-name" class="label">Dilaksanakan oleh <span class="text-danger">*</span></label>
                        <input id="event-external-name" v-model="form.externalPelaksana" class="input min-h-11" placeholder="PW IPNU Jawa Timur" :aria-invalid="!!errors.externalPelaksana" />
                        <p v-if="errors.externalPelaksana" class="mt-1 text-[11px] font-medium text-danger">{{ errors.externalPelaksana }}</p>
                    </div>
                    <div v-else class="mt-3">
                        <SearchSelect
                            id="event-pimpinan"
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

                <div class="rounded-xl border border-line bg-elevated/40 p-4">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Logo kegiatan</p>
                    <div class="mt-3 flex items-center gap-3">
                        <span class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-soft text-brand ring-1 ring-line/60">
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
                            <input id="event-logo" ref="logoInput" type="file" accept="image/png,image/jpeg,image/webp" class="sr-only" aria-label="Unggah logo kegiatan" @change="onLogo" />
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <section class="rounded-xl border border-line bg-elevated/30 p-4 sm:p-5">
            <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                    <h3 class="text-sm font-bold">Pendaftaran peserta</h3>
                    <p class="mt-1 text-[11px] text-muted">Atur rentang pendaftaran dan kuota peserta.</p>
                </div>
                <span class="badge bg-accent-soft text-accent">Total {{ total }} kuota</span>
            </div>

            <div class="mt-4">
                <DateRangePicker
                    id="event-registration"
                    v-model="registrationRange"
                    label="Rentang pendaftaran"
                    :error="errors.registrationUntil"
                    hint="Kosongkan rentang lalu aktifkan paksa untuk pendaftaran tanpa batas."
                    placeholder="Pilih rentang pendaftaran"
                />
            </div>

            <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="event-kuota-internal" class="label">Kuota internal</label>
                    <input id="event-kuota-internal" v-model="form.kuotaInternal" type="number" min="0" class="input min-h-11 font-mono" />
                </div>
                <div>
                    <label for="event-kuota-external" class="label">Kuota eksternal</label>
                    <input id="event-kuota-external" v-model="form.kuotaExternal" type="number" min="0" class="input min-h-11 font-mono" />
                </div>
            </div>

            <label class="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-3">
                <input v-model="form.registrationForced" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand focus:ring-brand/30" />
                <span>
                    <span class="block text-sm font-semibold">Paksa pendaftaran tetap dibuka</span>
                    <span class="block text-[11px] text-muted">Abaikan rentang tanggal pendaftaran.</span>
                </span>
            </label>
        </section>

        <div class="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="flex items-center gap-2 text-[11px] text-muted">
                <span :class="['h-1.5 w-1.5 rounded-full', dirty ? 'bg-accent' : 'bg-success']"></span>
                {{ dirty ? 'Ada perubahan yang belum disimpan.' : 'Semua perubahan tersimpan.' }}
            </p>
            <div class="flex items-center justify-end gap-2">
                <button type="button" class="btn-secondary min-h-11" :disabled="!dirty" @click="reset">Batalkan</button>
                <button type="submit" class="btn-primary min-h-11" :disabled="!dirty">
                    <i class="ph-light ph-floppy-disk" aria-hidden="true"></i>
                    Simpan Kegiatan
                </button>
            </div>
        </div>
    </form>
</template>
