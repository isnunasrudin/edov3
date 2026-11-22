<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AuthLayout from '@/Layouts/AuthLayout.vue';
import PasswordField from '@/Components/PasswordField.vue';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AuthLayout, inheritAttrs: false });

const logo = '/images/edo.png';

const form = reactive({
    email: '',
    password: '',
    remember: false,
});

const errors = reactive({
    email: '',
    password: '',
});

const loading = ref(false);
const showSummary = ref(false);
const summaryEl = ref(null);
const emailInput = ref(null);

const activeErrors = computed(() => Object.values(errors).filter(Boolean));

function validate() {
    errors.email = !form.email.trim()
        ? 'Email wajib diisi.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
            ? 'Format email belum valid.'
            : '';

    errors.password = !form.password
        ? 'Kata sandi wajib diisi.'
        : form.password.length < 6
            ? 'Kata sandi minimal 6 karakter.'
            : '';

    return activeErrors.value.length === 0;
}

async function submit() {
    showSummary.value = false;

    if (!validate()) {
        showSummary.value = true;
        await nextTick();
        summaryEl.value?.focus();
        return;
    }

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 900));
    loading.value = false;

    showToast('Login demo berhasil. Mengalihkan ke dashboard…', 'success');
    router.visit('/');
}

function forgotPassword() {
    showToast('Reset kata sandi belum tersedia pada prototipe.', 'info');
}

watch(
    () => form.email,
    () => {
        errors.email = '';
        if (!activeErrors.value.length) showSummary.value = false;
    },
);

watch(
    () => form.password,
    () => {
        errors.password = '';
        if (!activeErrors.value.length) showSummary.value = false;
    },
);

onMounted(() => emailInput.value?.focus());
</script>

<template>

    <Head title="Masuk · EDO v2" />

    <div class="flex min-h-dvh flex-col">
        <!-- Brand -->
        <div class="flex items-center justify-between px-5 py-5 sm:px-8">
            <Link href="/" class="flex items-center gap-3">
                <span
                    class="grid h-10 w-10 place-items-center rounded-2xl bg-white/95 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.65)]">
                    <img :src="logo" alt="" aria-hidden="true" class="h-7 w-auto" />
                </span>
                <span>
                    <span class="block text-sm font-extrabold leading-none tracking-tight text-white">
                        EDO<span class="ml-0.5 align-super text-[9px] font-bold text-sky-300">v2</span>
                    </span>
                    <span class="mt-1 block text-[10px] text-white/60">PC IPNU &amp; IPPNU Trenggalek</span>
                </span>
            </Link>
        </div>

        <!-- Konten -->
        <div class="flex flex-1 items-center justify-center px-4 pb-10 pt-2 sm:px-6">
            <div class="w-full max-w-md">
                <div class="text-center">
                    <span
                        class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        <i class="ph-light ph-sign-in" aria-hidden="true"></i>
                        Akses internal
                    </span>

                    <h1 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                        Selamat datang kembali.
                    </h1>
                    <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                        Masuk untuk mengelola persuratan, anggota, dan kaderisasi
                        PC IPNU &amp; IPPNU Kabupaten Trenggalek.
                    </p>
                </div>

                <div class="card mt-7 p-6 text-ink sm:p-8">
                    <div class="mb-5 flex items-center gap-2.5">
                        <span class="grid h-9 w-9 place-items-center rounded-2xl bg-brand-soft text-brand">
                            <i class="ph-light ph-sign-in text-base" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p class="text-sm font-bold">Masuk ke akun</p>
                            <p class="text-[11px] text-muted">Gunakan kredensial yang terdaftar.</p>
                        </div>
                    </div>

                    <form class="space-y-4" :aria-busy="loading" novalidate @submit.prevent="submit">
                        <div v-if="showSummary" ref="summaryEl" tabindex="-1" role="alert"
                            class="rounded-xl border border-danger/30 bg-danger-soft p-3 text-xs text-danger">
                            <p class="font-semibold">Periksa kembali data Anda.</p>
                            <ul class="mt-1 list-inside list-disc space-y-0.5">
                                <li v-for="message in activeErrors" :key="message">{{ message }}</li>
                            </ul>
                        </div>

                        <div>
                            <label for="email" class="label">
                                Email <span class="text-danger">*</span>
                            </label>
                            <div class="relative">
                                <i class="ph-light ph-envelope-simple pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-muted"
                                    aria-hidden="true"></i>
                                <input id="email" ref="emailInput" v-model="form.email" type="email" inputmode="email"
                                    autocomplete="username" placeholder="nama@pelajartrenggalek.or.id"
                                    :aria-invalid="!!errors.email"
                                    :aria-describedby="errors.email ? 'email-error' : undefined" :class="[
                                        'input h-11 pl-10',
                                        errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : '',
                                    ]" />
                            </div>
                            <p v-if="errors.email" id="email-error" class="mt-1 text-[11px] font-medium text-danger">
                                {{ errors.email }}
                            </p>
                        </div>

                        <PasswordField id="password" v-model="form.password" label="Kata sandi"
                            placeholder="Masukkan kata sandi" autocomplete="current-password" :error="errors.password">
                            <template #action>
                                <button type="button"
                                    class="inline-flex min-h-6 items-center py-1 text-[11px] font-semibold text-brand hover:underline"
                                    @click="forgotPassword">
                                    Lupa kata sandi?
                                </button>
                            </template>
                        </PasswordField>

                        <label class="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-muted">
                            <input v-model="form.remember" type="checkbox"
                                class="h-4 w-4 rounded border-line accent-[rgb(var(--brand))]" />
                            Ingat saya di perangkat ini
                        </label>

                        <button type="submit" class="btn-primary group h-11 w-full" :disabled="loading">
                            <template v-if="loading">
                                <i class="ph-light ph-circle-notch animate-spin text-base" aria-hidden="true"></i>
                                <span>Memproses…</span>
                            </template>
                            <template v-else>
                                <span>Masuk</span>
                                <span class="btn-trail" aria-hidden="true">
                                    <i class="ph-light ph-arrow-right text-sm"></i>
                                </span>
                            </template>
                        </button>
                    </form>

                    <div
                        class="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                        <span class="h-px flex-1 bg-line"></span>
                        atau
                        <span class="h-px flex-1 bg-line"></span>
                    </div>

                    <Link href="/" class="btn-secondary h-11 w-full">
                        <i class="ph-light ph-squares-four text-base" aria-hidden="true"></i>
                        Lihat dashboard (pratinjau)
                    </Link>

                    <p
                        class="mt-4 flex items-start gap-2 rounded-xl bg-elevated p-3 text-[11px] leading-relaxed text-muted">
                        <i class="ph-light ph-info mt-0.5 text-base" aria-hidden="true"></i>
                        Mode prototipe: autentikasi backend belum tersambung. Kredensial valid akan membuka dashboard.
                    </p>
                </div>

                <p class="mt-6 text-center text-[10px] leading-relaxed text-white/60">
                    Butuh akses? Hubungi Sekretariat PC IPNU &amp; IPPNU Trenggalek.<br />
                    © 2026 EDO v2
                </p>
            </div>
        </div>
    </div>
</template>
