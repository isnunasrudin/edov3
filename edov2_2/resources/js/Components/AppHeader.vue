<script setup>
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import SearchPalette from './SearchPalette.vue';
import ThemeToggle from './ThemeToggle.vue';
import NotificationMenu from './NotificationMenu.vue';
import UserMenu from './UserMenu.vue';

defineProps({
    sidebarOpen: { type: Boolean, default: false },
});

defineEmits(['toggle-sidebar']);

const page = usePage();

const titles = {
    '/': 'Ringkasan Organisasi',
    '/persuratan': 'Persuratan',
    '/anggota': 'Data Anggota',
    '/pimpinan': 'Manajemen Pimpinan',
    '/kaderisasi': 'Kaderisasi',
};

const currentPath = computed(() => (page.url || '/').split('?')[0]);
const pageTitle = computed(() => titles[currentPath.value] ?? 'EDO v2');
</script>

<template>
    <header class="sticky top-0 z-30 px-3 pt-3 sm:px-5 lg:px-6">
        <div
            class="flex h-16 items-center gap-2 rounded-full border border-line/70 bg-surface/75 px-2.5 shadow-[0_20px_44px_-30px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:gap-3 sm:px-3.5"
        >
            <button
                class="icon-btn shrink-0 lg:hidden"
                aria-label="Buka menu navigasi"
                :aria-expanded="sidebarOpen"
                aria-controls="sidebar"
                @click="$emit('toggle-sidebar')"
            >
                <i class="ph-light ph-list text-lg" aria-hidden="true"></i>
            </button>

            <div class="hidden min-w-0 md:block">
                <p class="truncate text-[11px] text-muted">EDO v2 · PC IPNU &amp; IPPNU Trenggalek</p>
                <h1 class="truncate text-sm font-bold">{{ pageTitle }}</h1>
            </div>

            <SearchPalette />

            <ThemeToggle />

            <NotificationMenu />

            <UserMenu />
        </div>
    </header>
</template>
