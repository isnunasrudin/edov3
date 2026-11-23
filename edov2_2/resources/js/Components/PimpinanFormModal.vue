<script setup>
import { computed, reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import SearchSelect from './SearchSelect.vue';
import { LEVELS } from '@/data/pimpinan';
import { addressOptions, dashboard, addPimpinan, updatePimpinan } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
});

const emit = defineEmits(['close', 'saved']);

const parentOptions = computed(() =>
    dashboard.pimpinan
        .filter((item) => item.id !== props.item?.id)
        .map((item) => ({
            value: item.nama,
            label: item.nama,
            description: `${item.level} · ${item.org} · ${item.region}`,
        })),
);

const defaults = () => ({
    org: 'IPNU',
    level: 'PAC',
    nama: '',
    region: '',
    parent: '',
    ketua: '',
    sekretaris: '',
    periode: '2025–2027',
    members: 15,
    status: 'Aktif',
    sk: '',
    alamat: '',
});

const form = reactive(defaults());

function populate() {
    Object.assign(form, defaults(), props.item ?? {});
}

watch(
    () => props.open,
    (open) => {
        if (open) populate();
    },
);

function submit() {
    const payload = {
        org: form.org,
        level: form.level,
        nama: form.nama.trim(),
        region: form.region.trim(),
        parent: form.parent || '—',
        ketua: form.ketua.trim(),
        sekretaris: form.sekretaris.trim() || '—',
        periode: form.periode.trim(),
        members: Number(form.members),
        status: form.status,
        sk: form.sk.trim() || '—',
        alamat: form.alamat || '—',
    };

    const saved = props.item
        ? updatePimpinan(props.item.id, payload)
        : addPimpinan(payload);

    showToast(
        props.item
            ? `Pimpinan “${saved.nama}” berhasil diperbarui.`
            : `Pimpinan “${saved.nama}” berhasil ditambahkan.`,
    );

    emit('saved', saved);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? 'Ubah Pimpinan' : 'Tambah Pimpinan'"
        :subtitle="item ? 'Perbarui data kepengurusan.' : 'Catat kepengurusan baru pada struktur organisasi.'"
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="pimpinan-org" class="label">
                        Organisasi <span class="text-danger">*</span>
                    </label>
                    <select id="pimpinan-org" v-model="form.org" class="select" required>
                        <option value="IPNU">IPNU</option>
                        <option value="IPPNU">IPPNU</option>
                    </select>
                </div>
                <div>
                    <label for="pimpinan-level" class="label">
                        Level <span class="text-danger">*</span>
                    </label>
                    <select id="pimpinan-level" v-model="form.level" class="select" required>
                        <option v-for="level in LEVELS" :key="level.code" :value="level.code">
                            {{ level.code }} — {{ level.label }}
                        </option>
                    </select>
                </div>
            </div>

            <div>
                <label for="pimpinan-nama" class="label">
                    Nama pimpinan <span class="text-danger">*</span>
                </label>
                <input
                    id="pimpinan-nama"
                    v-model="form.nama"
                    class="input"
                    required
                    placeholder="Contoh: PAC IPNU Pogalan"
                />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="pimpinan-region" class="label">
                        Wilayah <span class="text-danger">*</span>
                    </label>
                    <input
                        id="pimpinan-region"
                        v-model="form.region"
                        class="input"
                        required
                        placeholder="Kec. Pogalan"
                    />
                </div>
                <SearchSelect
                    id="pimpinan-parent"
                    v-model="form.parent"
                    label="Induk kepengurusan"
                    :options="parentOptions"
                    placeholder="Tidak ada induk"
                    search-placeholder="Cari pimpinan induk…"
                />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="pimpinan-ketua" class="label">
                        Ketua <span class="text-danger">*</span>
                    </label>
                    <input
                        id="pimpinan-ketua"
                        v-model="form.ketua"
                        class="input"
                        required
                        placeholder="Nama ketua"
                    />
                </div>
                <div>
                    <label for="pimpinan-sekretaris" class="label">Sekretaris</label>
                    <input
                        id="pimpinan-sekretaris"
                        v-model="form.sekretaris"
                        class="input"
                        placeholder="Nama sekretaris"
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="pimpinan-periode" class="label">
                        Periode <span class="text-danger">*</span>
                    </label>
                    <input
                        id="pimpinan-periode"
                        v-model="form.periode"
                        class="input"
                        required
                        placeholder="2025–2027"
                    />
                </div>
                <div>
                    <label for="pimpinan-members" class="label">
                        Jumlah pengurus <span class="text-danger">*</span>
                    </label>
                    <input
                        id="pimpinan-members"
                        v-model="form.members"
                        type="number"
                        min="1"
                        max="200"
                        class="input font-mono"
                        required
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="pimpinan-status" class="label">
                        Status <span class="text-danger">*</span>
                    </label>
                    <select id="pimpinan-status" v-model="form.status" class="select" required>
                        <option value="Aktif">Aktif</option>
                        <option value="Menunggu Pelantikan">Menunggu Pelantikan</option>
                        <option value="Periode Berakhir">Periode Berakhir</option>
                    </select>
                </div>
                <div>
                    <label for="pimpinan-sk" class="label">Nomor SK</label>
                    <input
                        id="pimpinan-sk"
                        v-model="form.sk"
                        class="input font-mono"
                        placeholder="SK/24/PAC/IPNU/PGL/2025"
                    />
                </div>
            </div>

            <SearchSelect
                id="pimpinan-alamat"
                v-model="form.alamat"
                label="Alamat sekretariat"
                :options="addressOptions"
                placeholder="Pilih alamat"
                search-placeholder="Cari kecamatan/desa…"
            />

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Pimpinan' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
