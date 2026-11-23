<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import SearchSelect from './SearchSelect.vue';
import { PAC_LIST } from '@/data/dashboard';
import { addressOptions, updateAnggota } from '@/stores/dashboard';
import { initials } from '@/utils/format';
import { showToast } from '@/composables/useToast';

const props = defineProps({
    item: { type: Object, required: true },
});

const pacOptions = PAC_LIST.map((pac) => ({
    value: pac,
    label: pac,
    description: 'Pimpinan Anak Cabang',
}));

const form = reactive({
    nama: '',
    nickname: '',
    nia: '',
    nik: '',
    gender: 'Laki-laki',
    org: 'IPNU',
    pac: '',
    status: 'Aktif',
    jenjang: 'Anggota Muda',
    joined: new Date().getFullYear(),
    alamat: '',
    rt: '',
    rw: '',
    dusun: '',
    tempatLahir: '',
    tanggalLahir: '',
    hobi: '',
    picture: '',
});

const errors = reactive({});
const snapshot = ref('');
const nikVisible = ref(false);
const fileInput = ref(null);

const dirty = computed(() => snapshot.value !== '' && JSON.stringify(form) !== snapshot.value);
const hasErrors = computed(() => Object.keys(errors).length > 0);
const previewInitials = computed(() => initials(form.nama));

function populate() {
    Object.keys(errors).forEach((key) => delete errors[key]);
    nikVisible.value = false;

    Object.assign(form, {
        nama: props.item.nama ?? '',
        nickname: props.item.nickname ?? '',
        nia: props.item.nia ?? '',
        nik: props.item.nik === '—' ? '' : props.item.nik ?? '',
        gender: props.item.gender ?? 'Laki-laki',
        org: props.item.org ?? 'IPNU',
        pac: props.item.pac ?? '',
        status: props.item.status ?? 'Aktif',
        jenjang: props.item.jenjang ?? 'Anggota Muda',
        joined: props.item.joined ?? new Date().getFullYear(),
        alamat: props.item.alamat === '—' ? '' : props.item.alamat ?? '',
        rt: props.item.rt === '—' ? '' : props.item.rt ?? '',
        rw: props.item.rw === '—' ? '' : props.item.rw ?? '',
        dusun: props.item.dusun === '—' ? '' : props.item.dusun ?? '',
        tempatLahir: props.item.tempatLahir === '—' ? '' : props.item.tempatLahir ?? '',
        tanggalLahir: props.item.tanggalLahir ?? '',
        hobi: props.item.hobi === '—' ? '' : props.item.hobi ?? '',
        picture: props.item.picture ?? '',
    });

    snapshot.value = JSON.stringify(form);
}

watch(
    () => props.item.id,
    () => populate(),
    { immediate: true },
);

function validate() {
    Object.keys(errors).forEach((key) => delete errors[key]);

    if (!form.nama.trim()) errors.nama = 'Nama lengkap wajib diisi.';
    if (!form.nia.trim()) errors.nia = 'NIA wajib diisi.';
    if (!form.gender) errors.gender = 'Jenis kelamin wajib dipilih.';
    if (!form.org) errors.org = 'Organisasi wajib dipilih.';
    if (!form.pac) errors.pac = 'PAC wajib dipilih.';
    if (!form.alamat) errors.alamat = 'Alamat wajib dipilih.';
    if (!form.joined) errors.joined = 'Tahun gabung wajib diisi.';

    return Object.keys(errors).length === 0;
}

function fieldId(key) {
    return {
        nama: 'biodata-nama',
        nia: 'biodata-nia',
        pac: 'biodata-pac',
        alamat: 'biodata-alamat',
        joined: 'biodata-joined',
    }[key];
}

async function submit() {
    if (!validate()) {
        await nextTick();
        const first = Object.keys(errors).map(fieldId).find(Boolean);
        if (first) document.getElementById(first)?.focus();
        return;
    }

    const payload = {
        nama: form.nama.trim(),
        nickname: form.nickname.trim() || form.nama.trim().split(' ')[0],
        nia: form.nia.trim(),
        nik: form.nik.trim() || '—',
        gender: form.gender,
        org: form.org,
        pac: form.pac,
        status: form.status,
        jenjang: form.jenjang,
        joined: Number(form.joined),
        alamat: form.alamat,
        rt: form.rt.trim() || '—',
        rw: form.rw.trim() || '—',
        dusun: form.dusun.trim() || '—',
        tempatLahir: form.tempatLahir.trim() || '—',
        tanggalLahir: form.tanggalLahir || '',
        hobi: form.hobi.trim() || '—',
        picture: form.picture,
        generalId: props.item.generalId ?? form.nia.trim(),
        generalCard: props.item.generalCard ?? '—',
        progress: props.item.progress ?? 80,
    };

    const saved = updateAnggota(props.item.id, payload);
    snapshot.value = JSON.stringify(form);
    showToast(`Biodata “${saved.nama}” berhasil disimpan.`);
}

function reset() {
    populate();
    showToast('Perubahan biodata dibatalkan.', 'info');
}

function onPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 2 MB.', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        form.picture = String(reader.result ?? '');
    };
    reader.readAsDataURL(file);
}

function removePhoto() {
    form.picture = '';
    if (fileInput.value) fileInput.value.value = '';
}
</script>

<template>
    <form class="space-y-6" novalidate @submit.prevent="submit">
        <div
            v-if="hasErrors"
            role="alert"
            class="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-xs font-medium text-danger"
        >
            <i class="ph-light ph-warning-circle mt-0.5 text-base" aria-hidden="true"></i>
            <span>Periksa kembali field yang ditandai. Data belum tersimpan.</span>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Identitas -->
            <section class="space-y-4">
                <div class="flex items-center gap-2.5 border-b border-line pb-3">
                    <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                        <i class="ph-light ph-user text-lg" aria-hidden="true"></i>
                    </span>
                    <div>
                        <h3 class="text-sm font-bold">Identitas</h3>
                        <p class="text-[11px] text-muted">Data induk keanggotaan dan organisasi.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div class="sm:col-span-2">
                        <label for="biodata-nama" class="label">
                            Nama lengkap <span class="text-danger">*</span>
                        </label>
                        <input
                            id="biodata-nama"
                            v-model="form.nama"
                            class="input min-h-11"
                            placeholder="Nama sesuai KTA"
                            :aria-invalid="!!errors.nama"
                            :aria-describedby="errors.nama ? 'biodata-nama-error' : undefined"
                            required
                        />
                        <p v-if="errors.nama" id="biodata-nama-error" class="mt-1 text-[11px] font-medium text-danger">{{ errors.nama }}</p>
                    </div>

                    <div>
                        <label for="biodata-nickname" class="label">Nama panggilan</label>
                        <input id="biodata-nickname" v-model="form.nickname" class="input min-h-11" placeholder="Fauzan" />
                    </div>

                    <div>
                        <label for="biodata-nik" class="label">NIK</label>
                        <div class="relative">
                            <input
                                id="biodata-nik"
                                v-model="form.nik"
                                :type="nikVisible ? 'text' : 'password'"
                                inputmode="numeric"
                                autocomplete="off"
                                class="input min-h-11 pr-12 font-mono"
                                placeholder="3503xxxxxxxxxxxx"
                            />
                            <button
                                type="button"
                                class="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-xl text-muted hover:bg-elevated hover:text-ink"
                                :aria-label="nikVisible ? 'Sembunyikan NIK' : 'Tampilkan NIK'"
                                :aria-pressed="nikVisible"
                                @click="nikVisible = !nikVisible"
                            >
                                <i :class="['ph-light text-base', nikVisible ? 'ph-eye-slash' : 'ph-eye']" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div class="sm:col-span-2">
                        <fieldset>
                            <legend class="label">Jenis kelamin <span class="text-danger">*</span></legend>
                            <div class="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    :aria-pressed="form.gender === 'Laki-laki'"
                                    :class="[
                                        'min-h-11 cursor-pointer rounded-xl border px-3 text-sm font-semibold transition',
                                        form.gender === 'Laki-laki'
                                            ? 'border-brand bg-brand-soft text-brand'
                                            : 'border-line bg-surface text-muted hover:bg-elevated',
                                    ]"
                                    @click="form.gender = 'Laki-laki'"
                                >
                                    Laki-laki
                                </button>
                                <button
                                    type="button"
                                    :aria-pressed="form.gender === 'Perempuan'"
                                    :class="[
                                        'min-h-11 cursor-pointer rounded-xl border px-3 text-sm font-semibold transition',
                                        form.gender === 'Perempuan'
                                            ? 'border-brand bg-brand-soft text-brand'
                                            : 'border-line bg-surface text-muted hover:bg-elevated',
                                    ]"
                                    @click="form.gender = 'Perempuan'"
                                >
                                    Perempuan
                                </button>
                            </div>
                            <p v-if="errors.gender" class="mt-1 text-[11px] font-medium text-danger">{{ errors.gender }}</p>
                        </fieldset>
                    </div>

                    <div>
                        <label for="biodata-nia" class="label">
                            NIA <span class="text-danger">*</span>
                        </label>
                        <input
                            id="biodata-nia"
                            v-model="form.nia"
                            class="input min-h-11 font-mono"
                            placeholder="2024.01.01234"
                            :aria-invalid="!!errors.nia"
                            :aria-describedby="errors.nia ? 'biodata-nia-error' : undefined"
                            required
                        />
                        <p v-if="errors.nia" id="biodata-nia-error" class="mt-1 text-[11px] font-medium text-danger">{{ errors.nia }}</p>
                    </div>

                    <div>
                        <label for="biodata-org" class="label">Organisasi <span class="text-danger">*</span></label>
                        <select id="biodata-org" v-model="form.org" class="select min-h-11" :aria-invalid="!!errors.org">
                            <option value="IPNU">IPNU</option>
                            <option value="IPPNU">IPPNU</option>
                        </select>
                        <p v-if="errors.org" class="mt-1 text-[11px] font-medium text-danger">{{ errors.org }}</p>
                    </div>

                    <SearchSelect
                        id="biodata-pac"
                        v-model="form.pac"
                        label="PAC"
                        :options="pacOptions"
                        :error="errors.pac"
                        :clearable="false"
                        required
                        placeholder="Pilih PAC"
                        search-placeholder="Cari PAC…"
                    />

                    <div>
                        <label for="biodata-status" class="label">Status</label>
                        <select id="biodata-status" v-model="form.status" class="select min-h-11">
                            <option value="Aktif">Aktif</option>
                            <option value="Non-aktif">Non-aktif</option>
                            <option value="Cuti">Cuti</option>
                        </select>
                    </div>

                    <div>
                        <label for="biodata-jenjang" class="label">Jenjang</label>
                        <select id="biodata-jenjang" v-model="form.jenjang" class="select min-h-11">
                            <option value="Anggota Muda">Anggota Muda</option>
                            <option value="Anggota">Anggota</option>
                            <option value="Kader">Kader</option>
                            <option value="Kader Utama">Kader Utama</option>
                        </select>
                    </div>

                    <div>
                        <label for="biodata-joined" class="label">
                            Tahun gabung <span class="text-danger">*</span>
                        </label>
                        <input
                            id="biodata-joined"
                            v-model="form.joined"
                            type="number"
                            min="1980"
                            max="2026"
                            class="input min-h-11 font-mono"
                            :aria-invalid="!!errors.joined"
                            :aria-describedby="errors.joined ? 'biodata-joined-error' : undefined"
                            required
                        />
                        <p v-if="errors.joined" id="biodata-joined-error" class="mt-1 text-[11px] font-medium text-danger">{{ errors.joined }}</p>
                    </div>
                </div>
            </section>

            <!-- Domisili & foto -->
            <section class="space-y-4 lg:border-l lg:border-line lg:pl-6">
                <div class="flex items-center gap-2.5 border-b border-line pb-3">
                    <span class="grid h-9 w-9 place-items-center rounded-xl bg-info-soft text-info">
                        <i class="ph-light ph-map-pin text-lg" aria-hidden="true"></i>
                    </span>
                    <div>
                        <h3 class="text-sm font-bold">Domisili &amp; profil</h3>
                        <p class="text-[11px] text-muted">Alamat, kelahiran, minat, dan foto.</p>
                    </div>
                </div>

                <SearchSelect
                    id="biodata-alamat"
                    v-model="form.alamat"
                    label="Alamat"
                    :options="addressOptions"
                    :error="errors.alamat"
                    :clearable="false"
                    required
                    placeholder="Pilih wilayah"
                    search-placeholder="Cari wilayah…"
                />

                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label for="biodata-rt" class="label">RT</label>
                        <input id="biodata-rt" v-model="form.rt" class="input min-h-11 font-mono" placeholder="01" />
                    </div>
                    <div>
                        <label for="biodata-rw" class="label">RW</label>
                        <input id="biodata-rw" v-model="form.rw" class="input min-h-11 font-mono" placeholder="02" />
                    </div>
                    <div>
                        <label for="biodata-dusun" class="label">Dusun</label>
                        <input id="biodata-dusun" v-model="form.dusun" class="input min-h-11" placeholder="Dusun" />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label for="biodata-tempat-lahir" class="label">Tempat lahir</label>
                        <input id="biodata-tempat-lahir" v-model="form.tempatLahir" class="input min-h-11" placeholder="Trenggalek" />
                    </div>
                    <div>
                        <label for="biodata-tanggal-lahir" class="label">Tanggal lahir</label>
                        <input id="biodata-tanggal-lahir" v-model="form.tanggalLahir" type="date" class="input min-h-11" />
                    </div>
                </div>

                <div>
                    <label for="biodata-hobi" class="label">Hobi / minat</label>
                    <input id="biodata-hobi" v-model="form.hobi" class="input min-h-11" placeholder="Membaca, menulis…" />
                </div>

                <div class="rounded-xl border border-line bg-elevated/40 p-4">
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">Foto profil</p>
                    <div class="mt-3 flex items-center gap-3">
                        <span class="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-brand-soft font-mono text-lg font-bold text-brand ring-1 ring-line/60">
                            <img v-if="form.picture" :src="form.picture" :alt="`Foto profil ${form.nama}`" class="h-full w-full object-cover" />
                            <span v-else>{{ previewInitials }}</span>
                        </span>
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <button type="button" class="btn-secondary min-h-11" @click="fileInput?.click()">
                                    <i class="ph-light ph-upload-simple" aria-hidden="true"></i>
                                    {{ form.picture ? 'Ganti foto' : 'Unggah foto' }}
                                </button>
                                <button v-if="form.picture" type="button" class="btn-ghost btn-sm min-h-11" @click="removePhoto">
                                    Hapus
                                </button>
                            </div>
                            <p class="mt-1 text-[11px] text-muted">JPG/PNG, maks. 2 MB. Foto langsung tersimpan di sesi prototipe.</p>
                            <input
                                id="biodata-photo"
                                ref="fileInput"
                                type="file"
                                aria-label="Unggah foto profil"
                                accept="image/png,image/jpeg,image/webp"
                                class="sr-only"
                                @change="onPhoto"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div class="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="flex items-center gap-2 text-[11px] text-muted">
                <span :class="['h-1.5 w-1.5 rounded-full', dirty ? 'bg-accent' : 'bg-success']"></span>
                {{ dirty ? 'Ada perubahan yang belum disimpan.' : 'Semua perubahan tersimpan.' }}
            </p>
            <div class="flex items-center justify-end gap-2">
                <button type="button" class="btn-secondary min-h-11" :disabled="!dirty" @click="reset">
                    Batalkan
                </button>
                <button type="submit" class="btn-primary min-h-11" :disabled="!dirty">
                    <i class="ph-light ph-floppy-disk" aria-hidden="true"></i>
                    Simpan Biodata
                </button>
            </div>
        </div>
    </form>
</template>
