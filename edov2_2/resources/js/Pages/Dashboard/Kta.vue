<script setup>
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageHeader from '@/Components/PageHeader.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import EmptyState from '@/Components/EmptyState.vue';
import { dashboard } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { initials } from '@/utils/format';

defineOptions({ layout: AppLayout, inheritAttrs: false });

const logo = '/images/edo.png';

const query = ref('');
const org = ref('semua');
const selected = ref(dashboard.anggota[0] ?? null);

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    return dashboard.anggota
        .filter((item) => org.value === 'semua' || item.org === org.value)
        .filter(
            (item) =>
                !term ||
                `${item.nama} ${item.nia} ${item.pac}`
                    .toLowerCase()
                    .includes(term),
        );
});

function printKta() {
    showToast('Mode prototipe: KTA siap dicetak (demo).', 'info');
}

function downloadKta() {
    showToast('KTA digital berhasil disiapkan (demo).', 'success');
}
</script>

<template>
    <Head title="Kartu Tanda Anggota · EDO v2" />

    <PageHeader
        eyebrow="Keanggotaan"
        title="Kartu Tanda Anggota"
        description="KTA digital dengan nomor induk anggota dari PC IPNU & IPPNU Trenggalek."
        icon="ph-identification-badge"
    >
        <template #actions>
            <span class="badge bg-brand-soft text-brand">{{ filtered.length }} anggota</span>
        </template>
    </PageHeader>

    <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <!-- Pilih anggota -->
        <div v-reveal class="card overflow-hidden">
            <div class="border-b border-line p-4 sm:p-5">
                <div class="flex items-center justify-between gap-2">
                    <div>
                        <h2 class="text-sm font-bold">Pilih anggota</h2>
                        <p class="text-xs text-muted">Cari berdasarkan nama, NIA, atau PAC.</p>
                    </div>
                </div>

                <div class="mt-3 space-y-2">
                    <div class="relative w-full">
                        <label for="kta-search" class="sr-only">Cari anggota</label>
                        <i class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
                        <input
                            id="kta-search"
                            v-model="query"
                            type="search"
                            class="input h-10 pl-9"
                            placeholder="Cari anggota…"
                            autocomplete="off"
                        />
                    </div>
                    <div class="flex flex-wrap gap-2">
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
            </div>

            <div v-if="filtered.length" class="max-h-[560px] space-y-2 overflow-y-auto p-3 sm:p-4">
                <button
                    v-for="item in filtered"
                    :key="item.id"
                    :class="[
                        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition duration-300',
                        selected?.id === item.id
                            ? 'border-brand/40 bg-brand-soft'
                            : 'border-line hover:bg-elevated',
                    ]"
                    :aria-pressed="selected?.id === item.id"
                    @click="selected = item"
                >
                    <span
                        :class="[
                            'grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-[10px] font-bold',
                            item.org === 'IPNU' ? 'bg-brand-soft text-brand' : 'bg-info-soft text-info',
                        ]"
                    >
                        {{ initials(item.nama) }}
                    </span>
                    <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-semibold">{{ item.nama }}</span>
                        <span class="block truncate text-[11px] text-muted">{{ item.nia }} · {{ item.pac }}</span>
                    </span>
                    <OrgBadge :org="item.org" />
                    <i class="ph-light ph-caret-right text-sm text-muted" aria-hidden="true"></i>
                </button>
            </div>
            <EmptyState
                v-else
                icon="ph-users"
                title="Anggota tidak ditemukan"
                description="Coba kata kunci lain atau filter organisasi."
            />
        </div>

        <!-- Preview KTA -->
        <div class="lg:sticky lg:top-24 lg:self-start">
            <div
                v-if="selected"
                v-reveal
                class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#06172f] via-[#0a2858] to-[#1e3a8a] p-6 text-white shadow-[0_40px_90px_-45px_rgba(2,6,23,0.85)]"
            >
                <div class="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand/25 blur-3xl" aria-hidden="true"></div>
                <div class="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-info/10 blur-3xl" aria-hidden="true"></div>
                <div class="pointer-events-none absolute right-6 top-16 h-40 w-40 rounded-full border border-white/10" aria-hidden="true"></div>

                <div class="relative z-10">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-2.5">
                            <span class="grid h-9 w-9 place-items-center rounded-xl bg-white/95">
                                <img :src="logo" alt="" aria-hidden="true" class="h-6 w-auto" />
                            </span>
                            <div>
                                <p class="text-[11px] font-extrabold leading-none tracking-tight">
                                    EDO<span class="ml-0.5 align-super text-[8px] font-bold text-sky-300">v2</span>
                                </p>
                                <p class="mt-1 text-[9px] text-white/50">KTA Digital</p>
                            </div>
                        </div>
                        <span class="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/70">
                            Anggota Aktif
                        </span>
                    </div>

                    <p class="mt-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                        Kartu Tanda Anggota
                    </p>

                    <div class="mt-3 flex items-center gap-3">
                        <span class="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 font-mono text-lg font-bold text-white ring-1 ring-white/15">
                            {{ initials(selected.nama) }}
                        </span>
                        <div class="min-w-0">
                            <p class="truncate text-lg font-bold leading-tight">{{ selected.nama }}</p>
                            <p class="mt-1 font-mono text-[11px] text-white/60">{{ selected.nia }}</p>
                        </div>
                    </div>

                    <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-[10px]">
                        <div>
                            <p class="text-white/40">Organisasi</p>
                            <p class="mt-0.5 font-semibold">{{ selected.org }}</p>
                        </div>
                        <div>
                            <p class="text-white/40">PAC</p>
                            <p class="mt-0.5 font-semibold">{{ selected.pac }}</p>
                        </div>
                        <div>
                            <p class="text-white/40">Jenjang</p>
                            <p class="mt-0.5 font-semibold">{{ selected.jenjang }}</p>
                        </div>
                        <div>
                            <p class="text-white/40">Berlaku s.d.</p>
                            <p class="mt-0.5 font-semibold">31 Des 2027</p>
                        </div>
                    </div>

                    <div class="mt-6 flex items-end justify-between gap-3">
                        <div class="grid h-20 w-20 place-items-center rounded-xl bg-white p-2 text-slate-900">
                            <i class="ph-light ph-qr-code text-5xl" style="color:#071b3a" aria-hidden="true"></i>
                        </div>
                        <div class="min-w-0 text-right">
                            <i class="ph-light ph-barcode text-4xl text-white/60" aria-hidden="true"></i>
                            <p class="mt-1 text-[8px] text-white/40">PC IPNU &amp; IPPNU<br />Kab. Trenggalek</p>
                        </div>
                    </div>

                    <p class="mt-4 border-t border-white/10 pt-3 text-[8px] leading-relaxed text-white/35">
                        Kartu ini diterbitkan secara digital. Penggunaan di luar ketentuan organisasi tidak diperkenankan.
                    </p>
                </div>
            </div>

            <div v-if="selected" class="mt-3 flex gap-2">
                <button class="btn-primary h-11 flex-1" @click="printKta">
                    <i class="ph-light ph-printer text-base" aria-hidden="true"></i>
                    Cetak KTA
                </button>
                <button class="btn-secondary h-11 flex-1" @click="downloadKta">
                    <i class="ph-light ph-download-simple text-base" aria-hidden="true"></i>
                    Unduh
                </button>
            </div>

            <p class="mt-3 text-[11px] leading-relaxed text-muted">
                <i class="ph-light ph-info mr-1" aria-hidden="true"></i>
                KTA pada prototipe ini hanya contoh. Penerbitan resmi memerlukan verifikasi PC.
            </p>
        </div>
    </div>
</template>
