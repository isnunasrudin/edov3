<script setup>
import { reactive, ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import SearchSelect from './SearchSelect.vue';
import { PAC_LIST } from '@/data/dashboard';
import { addAnggota, addressOptions, updateAnggota } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
});

const emit = defineEmits(['close', 'saved']);

const pacOptions = PAC_LIST.map((pac) => ({ value: pac, label: pac, description: 'Pimpinan Anak Cabang' }));

const defaults = () => ({
    nama: '',
    nia: '',
    org: 'IPNU',
    pac: PAC_LIST[0],
    status: 'Aktif',
    jenjang: 'Anggota Muda',
    joined: new Date().getFullYear(),
    alamat: addressOptions.value[0]?.value ?? '—',
    tempatLahir: 'Trenggalek',
    tanggalLahir: '',
    nickname: '',
    gender: 'Laki-laki',
    rt: '01',
    rw: '02',
    dusun: '—',
    nik: '—',
    hobi: '—',
});

const form = reactive(defaults());
const pacError = ref('');

function populate() {
    pacError.value = '';

    if (props.item) {
        Object.assign(form, defaults(), props.item);
        return;
    }

    Object.assign(form, defaults());
}

watch(
    () => props.open,
    (open) => {
        if (open) populate();
    },
);

watch(
    () => form.org,
    (org) => {
        if (!props.item) {
            form.gender = org === 'IPNU' ? 'Laki-laki' : 'Perempuan';
        }
    },
);

function submit() {
    pacError.value = form.pac ? '' : 'PAC wajib dipilih.';
    if (pacError.value) return;

    const payload = {
        nama: form.nama.trim(),
        nia: form.nia.trim(),
        org: form.org,
        pac: form.pac,
        status: form.status,
        jenjang: form.jenjang,
        joined: Number(form.joined),
        alamat: form.alamat || '—',
        tempatLahir: form.tempatLahir.trim() || '—',
        tanggalLahir: form.tanggalLahir || '',
        nickname: form.nickname.trim() || form.nama.trim().split(' ')[0],
        gender: form.gender,
        rt: form.rt.trim() || '—',
        rw: form.rw.trim() || '—',
        dusun: form.dusun.trim() || '—',
        nik: form.nik.trim() || '—',
        hobi: form.hobi.trim() || '—',
        generalId: props.item?.generalId ?? form.nia.trim(),
        generalCard: props.item?.generalCard ?? '—',
        progress: props.item?.progress ?? 80,
    };

    const saved = props.item
        ? updateAnggota(props.item.id, payload)
        : addAnggota(payload);

    showToast(
        props.item
            ? `Anggota “${saved.nama}” berhasil diperbarui.`
            : `Anggota “${saved.nama}” berhasil ditambahkan.`,
    );

    emit('saved', saved);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? 'Ubah Anggota' : 'Tambah Anggota'"
        :subtitle="item ? 'Perbarui data keanggotaan.' : 'Daftarkan anggota baru ke basis data PC.'"
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
                    <label for="anggota-nickname" class="label">Nama panggilan</label>
                    <input id="anggota-nickname" v-model="form.nickname" class="input" placeholder="Fauzan" />
                </div>
                <div>
                    <label for="anggota-gender" class="label">Jenis kelamin</label>
                    <select id="anggota-gender" v-model="form.gender" class="select">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
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
                <SearchSelect
                    id="anggota-pac"
                    v-model="form.pac"
                    label="PAC"
                    :options="pacOptions"
                    :error="pacError"
                    required
                    :clearable="false"
                    placeholder="Pilih PAC"
                    search-placeholder="Cari PAC…"
                />
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

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="anggota-tempat-lahir" class="label">Tempat lahir</label>
                    <input
                        id="anggota-tempat-lahir"
                        v-model="form.tempatLahir"
                        class="input"
                        placeholder="Trenggalek"
                    />
                </div>
                <div>
                    <label for="anggota-tanggal-lahir" class="label">Tanggal lahir</label>
                    <input
                        id="anggota-tanggal-lahir"
                        v-model="form.tanggalLahir"
                        type="date"
                        class="input"
                    />
                </div>
            </div>

            <SearchSelect
                id="anggota-alamat"
                v-model="form.alamat"
                label="Alamat"
                :options="addressOptions"
                placeholder="Pilih alamat"
                search-placeholder="Cari kecamatan/desa…"
            />

            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label for="anggota-rt" class="label">RT</label>
                    <input id="anggota-rt" v-model="form.rt" class="input font-mono" placeholder="01" />
                </div>
                <div>
                    <label for="anggota-rw" class="label">RW</label>
                    <input id="anggota-rw" v-model="form.rw" class="input font-mono" placeholder="02" />
                </div>
                <div>
                    <label for="anggota-dusun" class="label">Dusun</label>
                    <input id="anggota-dusun" v-model="form.dusun" class="input" placeholder="Dusun" />
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="anggota-nik" class="label">NIK</label>
                    <input id="anggota-nik" v-model="form.nik" class="input font-mono" placeholder="3503xxxxxxxxxxxx" />
                </div>
                <div>
                    <label for="anggota-hobi" class="label">Hobi</label>
                    <input id="anggota-hobi" v-model="form.hobi" class="input" placeholder="Membaca" />
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Anggota' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
