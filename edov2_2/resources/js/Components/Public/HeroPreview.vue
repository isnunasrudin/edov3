<script setup>
const logo = '/images/edo.png';

const bars = [62, 48, 40, 36, 28, 22, 18, 14];

const rows = [
    { icon: 'ph-envelope-simple', label: 'Surat masuk', status: 'Menunggu', tone: 'bg-accent-soft text-accent' },
    { icon: 'ph-users-three', label: 'Anggota aktif', status: 'Terbarui', tone: 'bg-success-soft text-success' },
];
</script>

<template>
    <div class="relative mx-auto w-full max-w-[30rem] lg:max-w-none" aria-hidden="true">
        <div class="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-info/10 to-transparent blur-2xl"></div>

        <div class="relative rounded-[2rem] border border-white/15 bg-[#071b3a] p-2 shadow-[0_45px_90px_-45px_rgba(2,6,23,0.8)] transition-transform duration-700 lg:-rotate-1 lg:hover:rotate-0">
            <div class="rounded-[1.6rem] bg-surface p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full bg-success"></span>
                        <span class="text-[10px] font-semibold text-muted">EDO v2 · Live</span>
                    </div>
                    <span class="badge bg-brand-soft text-brand">2026</span>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-2">
                    <div class="rounded-xl border border-line bg-elevated/60 p-3">
                        <p class="text-[9px] font-semibold uppercase tracking-wider text-muted">Anggota</p>
                        <p class="mt-1 font-mono text-xl font-semibold tabular-nums">4.812</p>
                    </div>
                    <div class="rounded-xl border border-line bg-elevated/60 p-3">
                        <p class="text-[9px] font-semibold uppercase tracking-wider text-muted">Kader</p>
                        <p class="mt-1 font-mono text-xl font-semibold tabular-nums">862</p>
                    </div>
                </div>

                <div class="mt-3 rounded-xl border border-line p-3">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-semibold text-muted">Distribusi PAC</span>
                        <span class="font-mono text-[9px] text-muted">2026</span>
                    </div>
                    <div class="mt-3 flex h-24 items-end gap-1.5">
                        <div
                            v-for="(bar, index) in bars"
                            :key="index"
                            class="w-full rounded-t bg-gradient-to-t from-brand to-brand/45"
                            :style="{ height: `${bar}%` }"
                        ></div>
                    </div>
                </div>

                <div class="mt-3 space-y-2">
                    <div v-for="row in rows" :key="row.label" class="flex items-center gap-2 rounded-xl border border-line p-2.5">
                        <span class="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-brand">
                            <i :class="['ph-light text-sm', row.icon]"></i>
                        </span>
                        <span class="truncate text-[10px] font-semibold">{{ row.label }}</span>
                        <span :class="['badge ml-auto', row.tone]">{{ row.status }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute -bottom-5 -right-3 z-10 hidden h-16 w-16 place-items-center rounded-2xl bg-white shadow-[0_20px_45px_-20px_rgba(2,6,23,0.65)] sm:grid">
            <img :src="logo" alt="" class="h-11 w-auto" />
        </div>

        <div class="absolute -bottom-5 -left-3 hidden w-40 items-center gap-2 rounded-2xl border border-line bg-surface p-3 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.45)] sm:flex">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-brand">
                <i class="ph-light ph-chart-line-up text-base"></i>
            </span>
            <div>
                <p class="text-[9px] text-muted">Kelengkapan</p>
                <p class="font-mono text-sm font-semibold">17%</p>
            </div>
        </div>
    </div>
</template>
