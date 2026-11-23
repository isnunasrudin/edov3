<script setup>
import { computed, ref, watch } from 'vue';
import { anggotaById, updateProgram } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { initials } from '@/utils/format';

const props = defineProps({
    item: { type: Object, required: true },
    hideHeading: { type: Boolean, default: false },
});

const scores = ref([]);
const snapshot = ref('');

const materials = computed(() => props.item.materials ?? []);
const participants = computed(() =>
    (props.item.pesertaIds ?? []).map((id) => anggotaById(id)).filter(Boolean),
);
const dirty = computed(() => snapshot.value !== '' && JSON.stringify(scores.value) !== snapshot.value);

function populate() {
    scores.value = (props.item.scores ?? []).map((row) => ({ ...row }));
    snapshot.value = JSON.stringify(scores.value);
}

watch(
    () => props.item.id,
    () => populate(),
    { immediate: true },
);

function scoreFor(anggotaId, materiId) {
    return scores.value.find((row) => row.anggotaId === anggotaId && row.materiId === materiId)?.nilai ?? '';
}

function setScore(anggotaId, materiId, value) {
    const existing = scores.value.find((row) => row.anggotaId === anggotaId && row.materiId === materiId);

    if (value === '') {
        if (existing) scores.value = scores.value.filter((row) => row !== existing);
        return;
    }

    const numeric = Math.min(100, Math.max(0, Number(value)));

    if (existing) existing.nilai = numeric;
    else scores.value.push({ anggotaId, materiId, nilai: numeric });
}

function averageFor(anggotaId) {
    const values = materials.value
        .map((material) => scores.value.find((row) => row.anggotaId === anggotaId && row.materiId === material.id)?.nilai)
        .filter((value) => typeof value === 'number');

    if (!values.length) return '—';
    return (values.reduce((total, value) => total + value, 0) / values.length).toFixed(1);
}

function reset() {
    populate();
    showToast('Perubahan nilai dibatalkan.', 'info');
}

function save() {
    updateProgram(props.item.id, { scores: scores.value.map((row) => ({ ...row })) });
    snapshot.value = JSON.stringify(scores.value);
    showToast('Nilai peserta berhasil disimpan.', 'success');
}
</script>

<template>
    <form class="space-y-5" novalidate @submit.prevent="save">
        <div v-if="!hideHeading" class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 class="text-sm font-bold">Penilaian Peserta</h2>
                <p class="mt-1 text-xs text-muted">Isi nilai 0–100 untuk setiap peserta dan materi.</p>
            </div>
            <span class="badge bg-brand-soft text-brand">{{ participants.length }} peserta</span>
        </div>

        <div v-if="!materials.length" class="rounded-xl border border-dashed border-line bg-elevated/30 p-6 text-center">
            <i class="ph-light ph-book-open mx-auto block text-3xl text-muted" aria-hidden="true"></i>
            <p class="mt-2 text-sm font-semibold">Materi belum tersedia</p>
            <p class="text-xs text-muted">Tambahkan materi terlebih dahulu pada tab Materi.</p>
        </div>
        <div v-else-if="!participants.length" class="rounded-xl border border-dashed border-line bg-elevated/30 p-6 text-center">
            <i class="ph-light ph-users-three mx-auto block text-3xl text-muted" aria-hidden="true"></i>
            <p class="mt-2 text-sm font-semibold">Peserta belum tersedia</p>
            <p class="text-xs text-muted">Event ini belum memiliki daftar peserta.</p>
        </div>
        <div v-else class="overflow-x-auto">
            <table class="tbl" :style="{ minWidth: `${320 + materials.length * 130}px` }">
                <caption class="sr-only">Matriks nilai peserta per materi</caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th sticky left-0 z-10 bg-elevated">Peserta</th>
                        <th v-for="material in materials" :key="material.id" scope="col" class="th">{{ material.kode }} · {{ material.nama }}</th>
                        <th scope="col" class="th">Rata-rata</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <tr v-for="member in participants" :key="member.id">
                        <td class="td sticky left-0 z-10 bg-surface">
                            <div class="flex items-center gap-2.5">
                                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[10px] font-bold text-brand">
                                    {{ initials(member.nama) }}
                                </span>
                                <div class="min-w-0">
                                    <p class="truncate text-sm font-semibold">{{ member.nama }}</p>
                                    <p class="text-[10px] text-muted">{{ member.nia }}</p>
                                </div>
                            </div>
                        </td>
                        <td v-for="material in materials" :key="material.id" class="td">
                            <label :for="`nilai-${member.id}-${material.id}`" class="sr-only">Nilai {{ member.nama }} untuk {{ material.nama }}</label>
                            <input
                                :id="`nilai-${member.id}-${material.id}`"
                                :value="scoreFor(member.id, material.id)"
                                type="number"
                                min="0"
                                max="100"
                                class="input h-11 w-24 font-mono text-xs"
                                placeholder="—"
                                @input="setScore(member.id, material.id, $event.target.value)"
                            />
                        </td>
                        <td class="td font-mono text-sm font-semibold tabular-nums">{{ averageFor(member.id) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="flex items-center gap-2 text-[11px] text-muted">
                <span :class="['h-1.5 w-1.5 rounded-full', dirty ? 'bg-accent' : 'bg-success']"></span>
                {{ dirty ? 'Ada perubahan nilai yang belum disimpan.' : 'Semua perubahan nilai tersimpan.' }}
            </p>
            <div class="flex justify-end gap-2">
                <button type="button" class="btn-secondary min-h-11" :disabled="!dirty" @click="reset">Batalkan</button>
                <button type="submit" class="btn-primary min-h-11" :disabled="!dirty || !participants.length || !materials.length">
                    <i class="ph-light ph-floppy-disk" aria-hidden="true"></i>
                    Simpan Nilai
                </button>
            </div>
        </div>
    </form>
</template>
