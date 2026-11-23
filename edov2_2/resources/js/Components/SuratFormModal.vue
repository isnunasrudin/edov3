<script setup>
import { computed, reactive, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import SearchSelect from './SearchSelect.vue';
import { dashboard, addSurat, updateSurat } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { todayISO } from '@/utils/format';

const props = defineProps({
    open: { type: Boolean, default: false },
    item: { type: Object, default: null },
});

const emit = defineEmits(['close', 'saved']);

const pimpinanOptions = computed(() =>
    dashboard.pimpinan.map((item) => ({
        value: item.id,
        label: item.nama,
        description: `${item.level} · ${item.org} · ${item.region}`,
    })),
);

const defaults = () => ({
    jenis: 'masuk',
    status: 'Menunggu',
    nomor: '',
    perihal: '',
    pihak: '',
    tanggal: todayISO(),
    pimpinanId: null,
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
        jenis: form.jenis,
        status: form.status,
        nomor: form.nomor.trim(),
        perihal: form.perihal.trim(),
        pihak: form.pihak.trim(),
        tanggal: form.tanggal,
        pimpinanId: form.pimpinanId,
    };

    const saved = props.item
        ? updateSurat(props.item.id, payload)
        : addSurat(payload);

    showToast(
        props.item
            ? `Surat “${saved.perihal}” berhasil diperbarui.`
            : `Surat “${saved.perihal}” berhasil disimpan.`,
    );

    emit('saved', saved);
    emit('close');
}
</script>

<template>
    <BaseModal
        :open="open"
        :title="item ? 'Ubah Surat' : 'Buat Surat Baru'"
        :subtitle="item ? 'Perbarui data arsip surat.' : 'Catat surat masuk atau keluar ke arsip digital.'"
        @close="$emit('close')"
    >
        <form class="space-y-4 p-5" @submit.prevent="submit">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="surat-jenis" class="label">
                        Jenis surat <span class="text-danger">*</span>
                    </label>
                    <select id="surat-jenis" v-model="form.jenis" class="select" required>
                        <option value="masuk">Surat Masuk</option>
                        <option value="keluar">Surat Keluar</option>
                    </select>
                </div>
                <div>
                    <label for="surat-status" class="label">
                        Status <span class="text-danger">*</span>
                    </label>
                    <select id="surat-status" v-model="form.status" class="select" required>
                        <option value="Menunggu">Menunggu</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
            </div>

            <div>
                <label for="surat-nomor" class="label">
                    Nomor surat <span class="text-danger">*</span>
                </label>
                <input
                    id="surat-nomor"
                    v-model="form.nomor"
                    class="input font-mono"
                    required
                    placeholder="129/PC-A/IPNU-TGL/XI/2026"
                />
            </div>

            <div>
                <label for="surat-perihal" class="label">
                    Perihal <span class="text-danger">*</span>
                </label>
                <input
                    id="surat-perihal"
                    v-model="form.perihal"
                    class="input"
                    required
                    placeholder="Contoh: Undangan Rapat Kerja Cabang"
                />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label for="surat-pihak" class="label">
                        Asal / Tujuan <span class="text-danger">*</span>
                    </label>
                    <input
                        id="surat-pihak"
                        v-model="form.pihak"
                        class="input"
                        required
                        placeholder="PC IPNU Kab. Tulungagung"
                    />
                </div>
                <div>
                    <label for="surat-tanggal" class="label">
                        Tanggal <span class="text-danger">*</span>
                    </label>
                    <input
                        id="surat-tanggal"
                        v-model="form.tanggal"
                        type="date"
                        class="input"
                        required
                    />
                </div>
            </div>

            <SearchSelect
                id="surat-pimpinan"
                v-model="form.pimpinanId"
                label="Pimpinan terkait"
                :options="pimpinanOptions"
                placeholder="Tidak terkait pimpinan"
                search-placeholder="Cari pimpinan…"
            />

            <p class="flex items-start gap-2 rounded-xl bg-elevated p-3 text-[11px] leading-relaxed text-muted">
                <i class="ph-light ph-info mt-0.5 text-base" aria-hidden="true"></i>
                Data akan tersimpan di sesi prototipe ini dan langsung muncul pada tabel persuratan.
            </p>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="btn-secondary" @click="$emit('close')">Batal</button>
                <button type="submit" class="btn-primary group">
                    <span>{{ item ? 'Simpan Perubahan' : 'Simpan Surat' }}</span>
                    <span class="btn-trail" aria-hidden="true">
                        <i class="ph-light ph-check text-sm"></i>
                    </span>
                </button>
            </div>
        </form>
    </BaseModal>
</template>
