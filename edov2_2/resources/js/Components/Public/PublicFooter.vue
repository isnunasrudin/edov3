<script setup>
import { Link } from '@inertiajs/vue3';

const logo = '/images/edo.png';
const year = new Date().getFullYear();

const navigation = [
    { label: 'Beranda', href: '/#home' },
    { label: 'Fitur', href: '/#features' },
    { label: 'Pengkaderan', href: '/#pengkaderan' },
    { label: 'Statistik Pimpinan', href: '/statistik/pimpinan', inertia: true },
];

const access = [
    { label: 'Masuk', href: '/login', inertia: true },
    { label: 'Buat Akun', href: '/register', inertia: true },
    { label: 'EDOPedia', href: 'https://wiki.pelajartrenggalek.or.id', external: true },
    { label: 'Hubungi Kami', href: 'https://wa.me/6282233441765', external: true },
];
</script>

<template>
    <footer class="mt-16 bg-[#050d1f] text-white sm:mt-24">
        <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
                <div class="lg:col-span-5">
                    <Link href="/" class="flex items-center gap-3">
                        <span class="grid h-11 w-11 place-items-center rounded-2xl bg-white/95 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
                            <img :src="logo" alt="" aria-hidden="true" class="h-7 w-auto" />
                        </span>
                        <span>
                            <span class="block text-base font-extrabold leading-none tracking-tight">
                                EDO<span class="ml-0.5 align-super text-[9px] font-bold text-sky-300">v2</span>
                            </span>
                            <span class="mt-1 block text-[10px] text-white/55">PC IPNU &amp; IPPNU Trenggalek</span>
                        </span>
                    </Link>

                    <p class="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                        Ekosistem digital organisasi untuk persuratan, keanggotaan,
                        kepemimpinan, dan kaderisasi IPNU &amp; IPPNU Trenggalek.
                    </p>

                    <div class="mt-5 inline-flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-sky-300">
                            <i class="ph-light ph-shield-check text-lg" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p class="text-xs font-bold tracking-wide">SHEDOW Security Hub</p>
                            <p class="mt-0.5 text-[10px] text-white/50">oleh PC IPNU-IPPNU Trenggalek</p>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Navigasi</p>
                    <ul class="mt-4 space-y-2.5">
                        <li v-for="item in navigation" :key="item.label">
                            <Link
                                v-if="item.inertia"
                                :href="item.href"
                                class="text-sm text-white/60 transition-colors hover:text-white"
                            >
                                {{ item.label }}
                            </Link>
                            <a
                                v-else
                                :href="item.href"
                                class="text-sm text-white/60 transition-colors hover:text-white"
                            >
                                {{ item.label }}
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="lg:col-span-2">
                    <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Akses</p>
                    <ul class="mt-4 space-y-2.5">
                        <li v-for="item in access" :key="item.label">
                            <Link
                                v-if="item.inertia"
                                :href="item.href"
                                class="text-sm text-white/60 transition-colors hover:text-white"
                            >
                                {{ item.label }}
                            </Link>
                            <a
                                v-else
                                :href="item.href"
                                :target="item.external ? '_blank' : undefined"
                                :rel="item.external ? 'noopener noreferrer' : undefined"
                                class="text-sm text-white/60 transition-colors hover:text-white"
                            >
                                {{ item.label }}
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="lg:col-span-3">
                    <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Sekretariat</p>
                    <p class="mt-4 text-sm leading-relaxed text-white/60">
                        Jl. Raya Trenggalek No. 12<br />
                        Kab. Trenggalek, Jawa Timur
                    </p>
                    <a
                        href="https://wa.me/6282233441765"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        <i class="ph-light ph-whatsapp-logo text-base" aria-hidden="true"></i>
                        Hubungi via WhatsApp
                    </a>
                </div>
            </div>

            <div class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
                <p>© {{ year }} EDO v2 · PC IPNU &amp; IPPNU Kabupaten Trenggalek</p>
                <p class="flex items-center gap-4">
                    <span>Laravel · Inertia · Vue</span>
                    <span class="inline-flex items-center gap-1">
                        <i class="ph-light ph-lock-key" aria-hidden="true"></i>
                        Data internal
                    </span>
                </p>
            </div>
        </div>
    </footer>
</template>
