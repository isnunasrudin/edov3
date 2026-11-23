<script setup>
import { computed, ref, watch } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import JenjangBadge from '@/Components/JenjangBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import Pagination from '@/Components/Pagination.vue';
import AnggotaFormModal from '@/Components/AnggotaFormModal.vue';
import ConfirmModal from '@/Components/ConfirmModal.vue';
import { PAC_LIST } from '@/data/dashboard';
import { dashboard, totalAnggota, deleteAnggota } from '@/stores/dashboard';
import { downloadCSV } from '@/utils/export';
import { showToast } from '@/composables/useToast';
import { formatNumber, initials, readQuery } from '@/utils/format';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const page = usePage();
const query = ref(readQuery(page.url));
const pac = ref('semua');
const status = ref('semua');
const org = ref('semua');
const currentPage = ref(1);
const pageSize = 8;

const anggotaModalOpen = ref(false);
const deletingAnggota = ref(null);
const selectedIds = ref([]);

watch(
    () => page.url,
    (url) => {
        query.value = readQuery(url);
        pac.value = 'semua';
        status.value = 'semua';
        org.value = 'semua';
        currentPage.value = 1;
    },
);

watch([query, pac, status, org], () => {
    currentPage.value = 1;
});

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    return dashboard.anggota
        .filter((item) => org.value === 'semua' || item.org === org.value)
        .filter((item) => pac.value === 'semua' || item.pac === pac.value)
        .filter((item) => status.value === 'semua' || item.status === status.value)
        .filter(
            (item) =>
                !term ||
                `${item.nama} ${item.nia} ${item.pac}`.toLowerCase().includes(term),
        );
});

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));

watch(pages, (value) => {
    if (currentPage.value > value) currentPage.value = value;
});

const rows = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filtered.value.slice(start, start + pageSize);
});

const allSelected = computed({
    get: () => rows.value.length > 0 && rows.value.every((row) => selectedIds.value.includes(row.id)),
    set: (checked) => {
        if (checked) {
            const ids = new Set([...selectedIds.value, ...rows.value.map((row) => row.id)]);
            selectedIds.value = [...ids];
        } else {
            selectedIds.value = selectedIds.value.filter(
                (id) => !rows.value.some((row) => row.id === id),
            );
        }
    },
});

const showingFrom = computed(() =>
    filtered.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1,
);

const showingTo = computed(() =>
    Math.min(currentPage.value * pageSize, filtered.value.length),
);

function resetFilters() {
    query.value = '';
    pac.value = 'semua';
    status.value = 'semua';
    org.value = 'semua';
    currentPage.value = 1;
    showToast('Filter anggota direset.', 'info');
}

function exportAnggota() {
    const data = [['Nama', 'NIA', 'Organisasi', 'PAC', 'Jenjang', 'Status', 'Tahun Gabung']];
    filtered.value.forEach((item) =>
        data.push([item.nama, item.nia, item.org, item.pac, item.jenjang, item.status, item.joined]),
    );

    downloadCSV('data-anggota.csv', data);
    showToast('Data anggota diekspor sebagai CSV.');
}

function openCreate() {
    anggotaModalOpen.value = true;
}

function confirmDelete() {
    if (!deletingAnggota.value) return;

    deleteAnggota(deletingAnggota.value.id);
    deletingAnggota.value = null;
    showToast('Anggota dan relasinya berhasil dihapus.', 'success');
}

function onSaved() {
    query.value = '';
    pac.value = 'semua';
    status.value = 'semua';
    org.value = 'semua';
    currentPage.value = 1;
    anggotaModalOpen.value = false;
}
</script>

<template>
    <Head title="Data Anggota · EDO v2" />

    <PageHeader
        eyebrow="Keanggotaan"
        title="Data Anggota"
        description="Basis data anggota IPNU & IPPNU se-Kabupaten Trenggalek."
        icon="ph-users-three"
    >
        <template #actions>
            <button class="btn-secondary" @click="exportAnggota">
                <i class="ph-light ph-download-simple text-base" aria-hidden="true"></i>
                Ekspor CSV
            </button>
            <button class="btn-primary group" @click="openCreate">
                <span>Tambah Anggota</span>
                <span class="btn-trail" aria-hidden="true">
                    <i class="ph-light ph-user-plus text-sm"></i>
                </span>
            </button>
        </template>
    </PageHeader>

    <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div v-reveal class="stat-tile">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">Total</p>
            <p class="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{{ formatNumber(totalAnggota) }}</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">IPNU</p>
            <p class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-brand">2.746</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">IPPNU</p>
            <p class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-info">2.066</p>
        </div>
        <div v-reveal class="stat-tile">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">Non-aktif</p>
            <p class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-muted">184</p>
        </div>
    </div>

    <div v-reveal class="card mt-4 overflow-hidden">
        <div class="flex flex-col gap-2 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div class="relative w-full sm:max-w-xs">
                <label for="filter-anggota-q" class="sr-only">Cari anggota</label>
                <i
                    class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted"
                    aria-hidden="true"
                ></i>
                <input
                    id="filter-anggota-q"
                    v-model="query"
                    type="search"
                    class="input h-9 pl-9"
                    placeholder="Cari nama, NIA, atau PAC…"
                    autocomplete="off"
                />
            </div>

            <label for="filter-anggota-pac" class="sr-only">Filter PAC</label>
            <select id="filter-anggota-pac" v-model="pac" class="select h-9 w-full sm:w-40">
                <option value="semua">Semua PAC</option>
                <option v-for="item in PAC_LIST" :key="item" :value="item">{{ item }}</option>
            </select>

            <label for="filter-anggota-status" class="sr-only">Filter status</label>
            <select id="filter-anggota-status" v-model="status" class="select h-9 w-full sm:w-36">
                <option value="semua">Semua status</option>
                <option value="Aktif">Aktif</option>
                <option value="Non-aktif">Non-aktif</option>
                <option value="Cuti">Cuti</option>
            </select>

            <button class="btn-ghost btn-sm sm:ml-auto" @click="resetFilters">
                <i class="ph-light ph-arrow-counter-clockwise text-base" aria-hidden="true"></i>
                Reset
            </button>
        </div>

        <div class="flex items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
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
            <span class="ml-auto hidden text-xs text-muted sm:block" aria-live="polite">
                {{ filtered.length }} anggota
            </span>
        </div>

        <div class="overflow-x-auto">
            <table class="tbl min-w-[760px]">
                <caption class="sr-only">
                    Daftar anggota IPNU dan IPPNU Kabupaten Trenggalek
                </caption>
                <thead class="bg-elevated/70">
                    <tr>
                        <th scope="col" class="th w-10">
                            <input
                                v-model="allSelected"
                                type="checkbox"
                                class="h-4 w-4 cursor-pointer rounded border-line accent-[rgb(var(--brand))]"
                                aria-label="Pilih semua anggota"
                            />
                        </th>
                        <th scope="col" class="th">Nama Anggota</th>
                        <th scope="col" class="th">NIA</th>
                        <th scope="col" class="th hidden md:table-cell">PAC</th>
                        <th scope="col" class="th hidden sm:table-cell">Jenjang</th>
                        <th scope="col" class="th">Status</th>
                        <th scope="col" class="th text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-line">
                    <template v-if="rows.length">
                        <tr
                            v-for="item in rows"
                            :key="item.id"
                            class="transition-colors hover:bg-elevated/60"
                        >
                            <td class="td w-10">
                                <input
                                    v-model="selectedIds"
                                    :value="item.id"
                                    type="checkbox"
                                    class="h-4 w-4 cursor-pointer rounded border-line accent-[rgb(var(--brand))]"
                                    :aria-label="`Pilih ${item.nama}`"
                                />
                            </td>
                            <td class="td">
                                <div class="flex items-center gap-3">
                                    <span
                                        :class="[
                                            'grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[10px] font-bold',
                                            item.org === 'IPNU' ? 'bg-brand-soft text-brand' : 'bg-info-soft text-info',
                                        ]"
                                    >
                                        {{ initials(item.nama) }}
                                    </span>
                                    <div class="min-w-0">
                                        <Link :href="`/dashboard/anggota/${item.id}`" class="truncate font-semibold hover:text-brand">{{ item.nama }}</Link>
                                        <p class="text-[11px] text-muted">
                                            <OrgBadge :org="item.org" />
                                            <span class="md:hidden"> · {{ item.pac }}</span>
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="td">
                                <span class="font-mono text-xs text-muted">{{ item.nia }}</span>
                            </td>
                            <td class="td hidden text-muted md:table-cell">{{ item.pac }}</td>
                            <td class="td hidden sm:table-cell">
                                <JenjangBadge :jenjang="item.jenjang" />
                            </td>
                            <td class="td"><StatusBadge :status="item.status" /></td>
                            <td class="td text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Link
                                        :href="`/dashboard/anggota/${item.id}`"
                                        class="icon-btn-sm"
                                        :aria-label="`Lihat detail ${item.nama}`"
                                        title="Lihat detail"
                                    >
                                        <i class="ph-light ph-eye" aria-hidden="true"></i>
                                    </Link>
                                    <button
                                        class="icon-btn-sm hover:text-danger"
                                        :aria-label="`Hapus ${item.nama}`"
                                        title="Hapus anggota"
                                        @click="deletingAnggota = item"
                                    >
                                        <i class="ph-light ph-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="7">
                            <EmptyState
                                icon="ph-users"
                                title="Anggota tidak ditemukan"
                                description="Coba kata kunci lain atau reset filter."
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-col gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p class="text-xs text-muted" aria-live="polite">
                <template v-if="filtered.length">
                    Menampilkan {{ showingFrom }}–{{ showingTo }} dari {{ filtered.length }} anggota
                </template>
                <template v-else>Tidak ada hasil</template>
            </p>
            <Pagination v-model:page="currentPage" :pages="pages" />
        </div>
    </div>

    <p class="mt-4 text-[11px] text-muted">
        <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
        NIA adalah Nomor Induk Anggota yang diterbitkan oleh PC. Gunakan pencarian untuk verifikasi cepat.
    </p>

    <AnggotaFormModal
        :open="anggotaModalOpen"
        :item="null"
        @close="anggotaModalOpen = false"
        @saved="onSaved"
    />

    <ConfirmModal
        :open="!!deletingAnggota"
        title="Hapus anggota?"
        :message="`Anggota “${deletingAnggota?.nama ?? ''}” beserta pendidikan dan jabatannya akan dihapus.`"
        confirm-label="Hapus anggota"
        @close="deletingAnggota = null"
        @confirm="confirmDelete"
    />

</template>
