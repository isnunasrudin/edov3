<script setup>
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import LevelBadge from '@/Components/LevelBadge.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import BaseModal from '@/Components/BaseModal.vue';
import { dashboard } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const allowedLevels = ['PC', 'PAC', 'PK', 'PR'];
const query = ref('');
const org = ref('semua');
const selected = ref(null);
const active = ref(null);

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    return dashboard.pimpinan
        .filter((item) => allowedLevels.includes(item.level))
        .filter((item) => org.value === 'semua' || item.org === org.value)
        .filter(
            (item) =>
                !term ||
                `${item.nama} ${item.region} ${item.ketua}`
                    .toLowerCase()
                    .includes(term),
        );
});

function confirmImpersonate() {
    if (!selected.value) return;

    active.value = selected.value;
    showToast(`Mode impersonate demo: ${selected.value.nama}.`, 'success');
    selected.value = null;
}

function exitImpersonate() {
    active.value = null;
    showToast('Kembali ke akun Anda.', 'info');
}
</script>

<template>
    <Head title="Impersonate · EDO v2" />

    <PageHeader
        eyebrow="Layanan"
        title="Impersonate"
        description="Gunakan akun Anda untuk mewakili pimpinan Anda."
        icon="ph-user-switch"
    >
        <template #actions>
            <span class="badge bg-brand-soft text-brand">{{ filtered.length }} pimpinan</span>
        </template>
    </PageHeader>

    <div
        v-if="active"
        class="card mt-6 border-brand/30 bg-brand-soft/50 p-5"
    >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface text-brand">
                <i class="ph-light ph-user-switch text-xl" aria-hidden="true"></i>
            </span>
            <div class="min-w-0">
                <p class="text-sm font-bold">Anda mewakili {{ active.nama }}</p>
                <p class="mt-0.5 text-xs text-muted">
                    Mode demo aktif. Tampilan data tetap menggunakan akses akun Anda.
                </p>
            </div>
            <button class="btn-secondary btn-sm sm:ml-auto" @click="exitImpersonate">
                Keluar dari impersonate
            </button>
        </div>
    </div>

    <div v-else class="card mt-6 border-accent/30 bg-accent-soft/40 p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface text-accent">
                <i class="ph-light ph-shield-check text-xl" aria-hidden="true"></i>
            </span>
            <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-bold">Mode impersonate (prototipe)</p>
                    <span class="badge bg-surface text-accent">Demo</span>
                </div>
                <p class="mt-1 text-xs leading-relaxed text-muted">
                    Pilih pimpinan untuk melihat dashboard dari sudut pandangnya.
                    Tidak ada perubahan sesi autentikasi nyata pada prototipe ini.
                </p>
            </div>
        </div>
    </div>

    <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative w-full sm:max-w-xs">
            <label for="impersonate-search" class="sr-only">Cari pimpinan</label>
            <i class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
            <input
                id="impersonate-search"
                v-model="query"
                type="search"
                class="input h-10 pl-9"
                placeholder="Cari pimpinan, wilayah, ketua…"
                autocomplete="off"
            />
        </div>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filter organisasi">
            <button
                v-for="option in ['semua', 'IPNU', 'IPPNU']"
                :key="option"
                :class="['chip', { 'is-active': org === option }]"
                :aria-pressed="org === option"
                @click="org = option"
            >
                {{ option === 'semua' ? 'Semua' : option }}
            </button>
        </div>
    </div>

    <div v-if="filtered.length" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="item in filtered" :key="item.id" v-reveal class="card card-lift flex flex-col p-5">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <LevelBadge :level="item.level" />
                    <OrgBadge :org="item.org" />
                </div>
                <StatusBadge :status="item.status" />
            </div>

            <h2 class="mt-4 text-sm font-bold">{{ item.nama }}</h2>
            <p class="mt-1 text-[11px] text-muted">{{ item.region }} · {{ item.periode }}</p>

            <div class="mt-3 flex items-center gap-2 text-xs">
                <span class="text-muted">Ketua</span>
                <span class="font-semibold">{{ item.ketua }}</span>
            </div>

            <button class="btn-secondary btn-sm mt-4 w-full" @click="selected = item">
                Pilih pimpinan
            </button>
        </article>
    </div>

    <div v-else class="card mt-4">
        <EmptyState
            icon="ph-user-switch"
            title="Pimpinan tidak ditemukan"
            description="Coba ubah kata kunci atau filter organisasi."
        />
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        Hanya pimpinan tingkat PC, PAC, PK, dan PR yang dapat dipilih pada prototipe ini.
    </p>

    <BaseModal
        :open="!!selected"
        title="Masuk sebagai pimpinan?"
        subtitle="Mode impersonate demo"
        size="md"
        @close="selected = null"
    >
        <div class="p-5">
            <p class="text-sm leading-relaxed text-muted">
                Anda akan melihat dashboard sebagai:
            </p>

            <div class="mt-3 rounded-xl border border-line bg-elevated p-3">
                <div class="flex flex-wrap items-center gap-2">
                    <LevelBadge v-if="selected" :level="selected.level" />
                    <OrgBadge v-if="selected" :org="selected.org" />
                </div>
                <p class="mt-2 text-sm font-bold">{{ selected?.nama }}</p>
                <p class="text-[11px] text-muted">{{ selected?.region }} · {{ selected?.periode }}</p>
            </div>

            <p class="mt-3 flex items-start gap-2 rounded-xl bg-accent-soft p-3 text-[11px] leading-relaxed text-accent">
                <i class="ph-light ph-info mt-0.5 text-base" aria-hidden="true"></i>
                Ini hanya simulasi tampilan. Sesi autentikasi dan hak akses tidak berubah.
            </p>

            <div class="mt-5 flex justify-end gap-2">
                <button class="btn-secondary" @click="selected = null">Batal</button>
                <button class="btn-primary" @click="confirmImpersonate">
                    Masuk sebagai
                </button>
            </div>
        </div>
    </BaseModal>
</template>
