<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { pendingSurat, totalAnggota, totalPimpinan } from '@/stores/dashboard';
import { formatNumber } from '@/utils/format';

defineProps({
    open: { type: Boolean, default: false },
});

defineEmits(['close']);

const page = usePage();
const logo = '/images/edo.png';
const currentPath = computed(() => (page.url || '/').split('?')[0]);

const links = [
    { href: '/dashboard', label: 'Ringkasan', icon: 'ph-squares-four', route: 'ringkasan' },
    { href: '/dashboard/persuratan', label: 'Persuratan', icon: 'ph-envelope-simple', route: 'persuratan' },
    { href: '/dashboard/anggota', label: 'Data Anggota', icon: 'ph-users-three', route: 'anggota' },
    { href: '/dashboard/pimpinan', label: 'Manajemen Pimpinan', icon: 'ph-identification-card', route: 'pimpinan' },
    { href: '/dashboard/kaderisasi', label: 'Kaderisasi', icon: 'ph-graduation-cap', route: 'kaderisasi' },
];

const masterLinks = [
    { href: '/dashboard/jenis-jabatan', label: 'Jenis Jabatan', icon: 'ph-list-dashes' },
    { href: '/dashboard/alamat', label: 'Alamat', icon: 'ph-tree-structure' },
];

const serviceLinks = [
    { href: '/dashboard/impersonate', label: 'Impersonate', icon: 'ph-user-switch' },
    { href: '/dashboard/sinkronisasi', label: 'Sinkronisasi', icon: 'ph-arrows-clockwise' },
    { href: '/dashboard/kta', label: 'Kartu Anggota', icon: 'ph-identification-badge' },
];

function isActive(href) {
    if (href === '/dashboard') return currentPath.value === href;
    return currentPath.value === href || currentPath.value.startsWith(`${href}/`);
}
</script>

<template>
    <aside
        id="sidebar"
        :class="[
            'fixed inset-y-0 left-0 z-50 flex w-[16.5rem] -translate-x-full flex-col overflow-hidden border-r border-line/70 bg-surface/90 backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:inset-y-3 lg:left-3 lg:rounded-[1.75rem] lg:border lg:shadow-[0_36px_80px_-48px_rgba(15,23,42,0.6)] lg:translate-x-0',
            open ? 'translate-x-0' : '',
        ]"
        aria-label="Navigasi samping"
    >
        <div class="flex items-center gap-3 px-5 py-5">
            <img
                :src="logo"
                alt=""
                aria-hidden="true"
                class="h-10 w-auto shrink-0"
            />
            <div class="min-w-0">
                <p class="text-[15px] font-extrabold leading-none tracking-tight text-ink">
                    EDO<span class="ml-0.5 align-super text-[9px] font-bold text-brand">v2</span>
                </p>
                <p class="mt-1 truncate text-[10px] text-muted">PC IPNU &amp; IPPNU Trenggalek</p>
            </div>
            <button
                class="icon-btn-sm ml-auto lg:hidden"
                aria-label="Tutup menu"
                @click="$emit('close')"
            >
                <i class="ph-light ph-x text-lg" aria-hidden="true"></i>
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 pb-4" aria-label="Navigasi utama">
            <p class="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Utama
            </p>
            <Link
                href="/dashboard"
                :class="['nav-link', { 'is-active': isActive('/dashboard') }]"
                :aria-current="isActive('/dashboard') ? 'page' : undefined"
                @click="$emit('close')"
            >
                <i class="ph-light ph-squares-four text-lg" aria-hidden="true"></i>
                <span>Ringkasan</span>
            </Link>

            <p class="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Manajemen
            </p>
            <Link
                v-for="link in links.slice(1)"
                :key="link.href"
                :href="link.href"
                :class="['nav-link', { 'is-active': isActive(link.href) }]"
                :aria-current="isActive(link.href) ? 'page' : undefined"
                @click="$emit('close')"
            >
                <i :class="['ph-light text-lg', link.icon]" aria-hidden="true"></i>
                <span>{{ link.label }}</span>
                <span
                    v-if="link.route === 'persuratan'"
                    class="ml-auto rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted"
                >
                    {{ pendingSurat }}
                </span>
                <span
                    v-else-if="link.route === 'anggota'"
                    class="ml-auto rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted"
                >
                    {{ formatNumber(totalAnggota) }}
                </span>
                <span
                    v-else-if="link.route === 'pimpinan'"
                    class="ml-auto rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted"
                >
                    {{ totalPimpinan }}
                </span>
            </Link>

            <p class="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Data Master
            </p>
            <Link
                v-for="link in masterLinks"
                :key="link.href"
                :href="link.href"
                :class="['nav-link', { 'is-active': isActive(link.href) }]"
                :aria-current="isActive(link.href) ? 'page' : undefined"
                @click="$emit('close')"
            >
                <i :class="['ph-light text-lg', link.icon]" aria-hidden="true"></i>
                <span>{{ link.label }}</span>
            </Link>

            <p class="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Layanan
            </p>
            <Link
                v-for="link in serviceLinks"
                :key="link.href"
                :href="link.href"
                :class="['nav-link', { 'is-active': isActive(link.href) }]"
                :aria-current="isActive(link.href) ? 'page' : undefined"
                @click="$emit('close')"
            >
                <i :class="['ph-light text-lg', link.icon]" aria-hidden="true"></i>
                <span>{{ link.label }}</span>
            </Link>
            <a
                href="https://wiki.pelajartrenggalek.or.id"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-link"
                @click="$emit('close')"
            >
                <i class="ph-light ph-book-open text-lg" aria-hidden="true"></i>
                <span>EDOPedia</span>
                <i class="ph-light ph-arrow-up-right ml-auto text-sm" aria-hidden="true"></i>
            </a>
        </nav>

        <div class="border-t border-line p-3">
            <div class="rounded-2xl border border-line/60 bg-elevated/70 p-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Sekretariat
                </p>
                <p class="mt-2 text-xs leading-relaxed text-ink/80">
                    Jl. Raya Trenggalek No. 12<br />
                    Kab. Trenggalek, Jawa Timur
                </p>
                <p class="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                    <i class="ph-light ph-clock" aria-hidden="true"></i>
                    Senin–Sabtu · 08.00–16.00
                </p>
            </div>
            <p class="mt-3 px-1 text-[10px] text-muted">Periode 2025–2027 · EDO v2</p>
        </div>
    </aside>
</template>
