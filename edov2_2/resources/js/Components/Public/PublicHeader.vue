<script setup>
import { computed, ref, watch } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import ThemeToggle from '@/Components/ThemeToggle.vue';

const logo = '/images/edo.png';
const page = usePage();
const open = ref(false);

const currentPath = computed(() => (page.url || '/').split('?')[0].split('#')[0]);

const navLinks = [
    { label: 'Beranda', href: '/#home', type: 'anchor' },
    { label: 'Fitur', href: '/#features', type: 'anchor' },
    { label: 'Pengkaderan', href: '/#pengkaderan', type: 'anchor' },
    { label: 'Statistik Pimpinan', href: '/statistik/pimpinan', type: 'link' },
    { label: 'Hubungi Kami', href: 'https://wa.me/6282233441765', type: 'external' },
];

function close() {
    open.value = false;
}

watch(
    () => page.url,
    () => close(),
);
</script>

<template>
    <header class="sticky top-0 z-30 px-3 pt-3 sm:px-5 lg:px-8">
        <div
            class="mx-auto flex h-16 max-w-7xl items-center gap-2 rounded-full border border-line/70 bg-surface/80 px-2.5 shadow-[0_20px_44px_-30px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:gap-3 sm:px-4"
        >
            <Link href="/" class="flex min-w-0 items-center gap-2.5" aria-label="EDO v2 — Beranda">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-elevated ring-1 ring-line">
                    <img :src="logo" alt="" aria-hidden="true" class="h-6 w-auto" />
                </span>
                <span class="min-w-0">
                    <span class="block text-sm font-extrabold leading-none tracking-tight text-ink">
                        EDO<span class="ml-0.5 align-super text-[9px] font-bold text-brand">v2</span>
                    </span>
                    <span class="mt-0.5 hidden text-[10px] text-muted sm:block">PC IPNU &amp; IPPNU Trenggalek</span>
                </span>
            </Link>

            <nav class="ml-5 hidden items-center gap-0.5 lg:flex" aria-label="Navigasi publik">
                <template v-for="link in navLinks" :key="link.label">
                    <Link
                        v-if="link.type === 'link'"
                        :href="link.href"
                        :class="[
                            'rounded-full px-3 py-2 text-sm font-medium transition duration-500',
                            currentPath === link.href
                                ? 'bg-brand-soft text-brand'
                                : 'text-muted hover:bg-elevated hover:text-ink',
                        ]"
                    >
                        {{ link.label }}
                    </Link>
                    <a
                        v-else
                        :href="link.href"
                        :target="link.type === 'external' ? '_blank' : undefined"
                        :rel="link.type === 'external' ? 'noopener noreferrer' : undefined"
                        class="rounded-full px-3 py-2 text-sm font-medium text-muted transition duration-500 hover:bg-elevated hover:text-ink"
                    >
                        {{ link.label }}
                    </a>
                </template>
            </nav>

            <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
                <ThemeToggle />
                <Link href="/login" class="btn-ghost hidden h-10 px-3 sm:inline-flex">Masuk</Link>
                <Link href="/register" class="btn-primary hidden h-10 px-4 sm:inline-flex">
                    Buat Akun
                </Link>
                <button
                    class="icon-btn lg:hidden"
                    aria-label="Buka menu navigasi"
                    :aria-expanded="open"
                    aria-controls="public-mobile-menu"
                    @click="open = !open"
                >
                    <i :class="['ph-light text-lg', open ? 'ph-x' : 'ph-list']" aria-hidden="true"></i>
                </button>
            </div>
        </div>

        <Transition
            enter-active-class="transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            enter-from-class="opacity-0 -translate-y-2"
            leave-active-class="transition duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
            leave-to-class="opacity-0 -translate-y-2"
        >
            <div
                v-if="open"
                id="public-mobile-menu"
                class="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-line/70 bg-surface p-3 shadow-[0_30px_70px_-34px_rgba(15,23,42,0.5)] lg:hidden"
            >
                <nav class="space-y-1" aria-label="Navigasi publik mobile">
                    <template v-for="link in navLinks" :key="link.label">
                        <Link
                            v-if="link.type === 'link'"
                            :href="link.href"
                            class="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-muted hover:bg-elevated hover:text-ink"
                            @click="close"
                        >
                            {{ link.label }}
                        </Link>
                        <a
                            v-else
                            :href="link.href"
                            :target="link.type === 'external' ? '_blank' : undefined"
                            :rel="link.type === 'external' ? 'noopener noreferrer' : undefined"
                            class="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-muted hover:bg-elevated hover:text-ink"
                            @click="close"
                        >
                            {{ link.label }}
                        </a>
                    </template>
                </nav>
                <div class="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
                    <Link href="/login" class="btn-secondary h-11" @click="close">Masuk</Link>
                    <Link href="/register" class="btn-primary h-11" @click="close">Buat Akun</Link>
                </div>
            </div>
        </Transition>
    </header>
</template>
