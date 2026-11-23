<script setup>
import { computed } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import SectionHeading from '@/Components/Public/SectionHeading.vue';
import FeatureCard from '@/Components/Public/FeatureCard.vue';
import HeroPreview from '@/Components/Public/HeroPreview.vue';
import QuoteCard from '@/Components/Public/QuoteCard.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import ProgressBar from '@/Components/ProgressBar.vue';
import { publicFeatures, publicQuotes, publicStats } from '@/data/public';
import { dashboard } from '@/stores/dashboard';
import { showToast } from '@/composables/useToast';
import { formatLongDate } from '@/utils/format';

defineOptions({ layout: PublicLayout, inheritAttrs: false });

const programs = computed(() => dashboard.programs.slice(0, 3));

function handleFeature(feature) {
    if (feature.action === 'login') {
        router.visit('/login');
        return;
    }

    if (feature.action === 'wiki') {
        window.open(feature.href, '_blank', 'noopener,noreferrer');
        return;
    }

    showToast(feature.message ?? 'Fitur ini segera hadir.', 'info');
}

function handleProgram(program) {
    showToast(`Masuk untuk melihat detail ${program.nama}.`, 'info');
    setTimeout(() => router.visit('/login'), 500);
}

function percentage(program) {
    if (!program.kuota) return 0;
    return Math.min(100, Math.round((program.peserta / program.kuota) * 100));
}
</script>

<template>
    <Head title="EDO v2 · Ekosistem Digital Organisasi" />

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- HERO -->
        <section id="home" class="scroll-mt-24 pt-10 sm:pt-16 lg:pt-20">
            <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
                <div v-reveal class="lg:col-span-7">
                    <a
                        href="https://wiki.pelajartrenggalek.or.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group flex w-full max-w-2xl items-center gap-3 rounded-2xl bg-brand px-4 py-3 text-brand-fg shadow-[0_18px_40px_-24px_rgb(var(--brand)/0.8)]"
                    >
                        <i class="ph-light ph-book-open text-lg" aria-hidden="true"></i>
                        <span class="min-w-0 text-xs leading-snug">
                            <span class="font-bold">EDOPedia</span>
                            <span class="text-brand-fg/70"> · </span>
                            Ensiklopedia Digital IPNU &amp; IPPNU Pertama
                        </span>
                        <span class="ml-auto hidden shrink-0 items-center gap-1 rounded-full bg-brand-fg/15 px-3 py-1.5 text-[11px] font-semibold sm:inline-flex">
                            Eksplorasi
                            <i class="ph-light ph-arrow-up-right" aria-hidden="true"></i>
                        </span>
                    </a>

                    <p class="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Pengalaman Baru
                    </p>

                    <h1 class="mt-3 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl xl:text-6xl">
                        Ekosistem Digital
                        <span class="text-muted">Organisasi</span>{{ ' ' }}<span class="text-brand">(EDO)</span>
                    </h1>

                    <p class="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted">
                        <span class="h-1.5 w-1.5 rounded-full bg-brand"></span>
                        PC IPNU-IPPNU Trenggalek
                    </p>

                    <p class="mt-5 max-w-xl text-base leading-relaxed text-muted">
                        Satu ruang terpadu untuk persuratan, keanggotaan, kepemimpinan,
                        dan kaderisasi — dibangun untuk pengurus PC, PAC, PK, hingga PR.
                    </p>

                    <div class="mt-7 flex flex-wrap items-center gap-3">
                        <Link href="/register" class="btn-primary group h-12 px-6">
                            <span>Buat Akun</span>
                            <span class="btn-trail h-7 w-7" aria-hidden="true">
                                <i class="ph-light ph-arrow-right text-sm"></i>
                            </span>
                        </Link>
                        <Link href="/login" class="btn-secondary h-12 px-6">Masuk</Link>
                    </div>

                    <ul class="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted">
                        <li v-for="item in ['Persuratan', 'Keanggotaan', 'Kepemimpinan', 'Kaderisasi']" :key="item" class="inline-flex items-center gap-1.5">
                            <i class="ph-light ph-check-circle text-sm text-brand" aria-hidden="true"></i>
                            {{ item }}
                        </li>
                    </ul>
                </div>

                <div v-reveal class="lg:col-span-5">
                    <HeroPreview />
                </div>
            </div>

            <div v-reveal class="card mt-12 grid grid-cols-2 gap-px overflow-hidden bg-line sm:grid-cols-4">
                <div v-for="stat in publicStats" :key="stat.label" class="flex items-center gap-3 bg-surface p-5">
                    <span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                        <i :class="['ph-light text-lg', stat.icon]" aria-hidden="true"></i>
                    </span>
                    <div>
                        <p class="text-[10px] font-semibold uppercase tracking-wider text-muted">{{ stat.label }}</p>
                        <p class="font-mono text-xl font-semibold tabular-nums">{{ stat.value }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- PENGKADERAN -->
        <section id="pengkaderan" class="scroll-mt-24 py-16 sm:py-24">
            <SectionHeading
                eyebrow="Pengkaderan"
                title="Program kaderisasi terdekat"
                description="Ikuti jenjang pendidikan dan pelatihan kader PC IPNU & IPPNU Trenggalek."
                icon="ph-graduation-cap"
            >
                <template #actions>
                    <Link href="/login" class="btn-secondary">
                        Masuk untuk detail
                        <i class="ph-light ph-arrow-right text-base" aria-hidden="true"></i>
                    </Link>
                </template>
            </SectionHeading>

            <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <article
                    v-for="program in programs"
                    :key="program.id"
                    class="card card-lift flex flex-col p-5"
                >
                    <div class="flex items-start justify-between gap-3">
                        <span class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                            <i class="ph-light ph-graduation-cap text-xl" aria-hidden="true"></i>
                        </span>
                        <StatusBadge :status="program.status" />
                    </div>
                    <h3 class="mt-4 text-sm font-bold">{{ program.nama }}</h3>
                    <p class="mt-1 text-xs leading-relaxed text-muted">
                        {{ program.fullName || program.jenjang || 'Program kaderisasi' }} · {{ formatLongDate(program.tanggal) }}
                    </p>
                    <div class="mt-auto pt-5">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-muted">Peserta</span>
                            <span class="font-mono font-semibold tabular-nums">{{ program.peserta }}/{{ program.kuota }}</span>
                        </div>
                        <div class="mt-2">
                            <ProgressBar :value="percentage(program)" />
                        </div>
                        <button
                            type="button"
                            class="mt-4 inline-flex min-h-6 items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                            @click="handleProgram(program)"
                        >
                            Masuk untuk detail
                            <i class="ph-light ph-arrow-right text-xs" aria-hidden="true"></i>
                        </button>
                    </div>
                </article>
            </div>
        </section>

        <!-- FITUR -->
        <section id="features" class="scroll-mt-24 pb-16 sm:pb-24">
            <SectionHeading
                eyebrow="Fitur"
                title="Fitur Baru Tersedia"
                description="Dan akan terus bertambah — dibangun mengikuti kebutuhan organisasi."
                icon="ph-sparkle"
                align="center"
            />

            <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
                <FeatureCard
                    v-for="feature in publicFeatures"
                    :key="feature.id"
                    v-reveal
                    :feature="feature"
                    @select="handleFeature"
                />
            </div>
        </section>

        <!-- QUOTE -->
        <section class="pb-16 sm:pb-24">
            <QuoteCard :quotes="publicQuotes" />
        </section>

        <!-- CTA -->
        <section class="pb-20 sm:pb-28">
            <div v-reveal class="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-8 sm:p-12">
                <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" aria-hidden="true"></div>
                <div class="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                            Mulai sekarang
                        </span>
                        <h2 class="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                            Siap membangun organisasi yang lebih rapi?
                        </h2>
                        <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                            Satu akun untuk mengelola persuratan, anggota, pimpinan, dan kaderisasi.
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <Link href="/register" class="btn-primary h-12 px-6">
                            Buat Akun
                            <i class="ph-light ph-arrow-right text-base" aria-hidden="true"></i>
                        </Link>
                        <Link href="/login" class="btn-secondary h-12 px-6">Masuk</Link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
