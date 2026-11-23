<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AuthLayout from '@/Layouts/AuthLayout.vue';
import AuthBrandHeader from '@/Components/AuthBrandHeader.vue';
import PasswordField from '@/Components/PasswordField.vue';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AuthLayout, inheritAttrs: false });

const form = reactive({
    identifier: '',
    password: '',
    remember: false,
});

const errors = reactive({
    identifier: '',
    password: '',
});

const loading = ref(false);
const showSummary = ref(false);
const summaryEl = ref(null);
const identifierInput = ref(null);

const activeErrors = computed(() => Object.values(errors).filter(Boolean));

function validIdentifier(value) {
    const term = value.trim();

    if (!term) return false;

    if (term.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term);
    }

    const digits = term.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 15;
}

function validate() {
    errors.identifier = !form.identifier.trim()
        ? 'Email / No. WhatsApp wajib diisi.'
        : !validIdentifier(form.identifier)
          ? 'Masukkan email atau nomor WhatsApp yang valid.'
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
    router.visit('/dashboard');
}

function googleLogin() {
    showToast('Google OAuth belum tersambung pada prototipe.', 'info');
}

watch(
    () => form.identifier,
    () => {
        errors.identifier = '';
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

onMounted(() => identifierInput.value?.focus());
</script>

<template>
    <Head title="Masuk · EDO v2" />

    <div class="flex min-h-dvh flex-col">
        <AuthBrandHeader />

        <div class="flex flex-1 items-center justify-center px-4 pb-10 pt-2 sm:px-6">
            <div class="w-full max-w-md">
                <div class="text-center">
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
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
                        <div
                            v-if="showSummary"
                            ref="summaryEl"
                            tabindex="-1"
                            role="alert"
                            class="rounded-xl border border-danger/30 bg-danger-soft p-3 text-xs text-danger"
                        >
                            <p class="font-semibold">Periksa kembali data Anda.</p>
                            <ul class="mt-1 list-inside list-disc space-y-0.5">
                                <li v-for="message in activeErrors" :key="message">{{ message }}</li>
                            </ul>
                        </div>

                        <div>
                            <label for="identifier" class="label">
                                Email / No. WhatsApp <span class="text-danger">*</span>
                            </label>
                            <div class="relative">
                                <i
                                    class="ph-light ph-user pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-muted"
                                    aria-hidden="true"
                                ></i>
                                <input
                                    id="identifier"
                                    ref="identifierInput"
                                    v-model="form.identifier"
                                    type="text"
                                    inputmode="email"
                                    autocomplete="username"
                                    autocapitalize="none"
                                    placeholder="Alamat Email / No. WhatsApp"
                                    :aria-invalid="!!errors.identifier"
                                    :aria-describedby="errors.identifier ? 'identifier-error' : undefined"
                                    :class="[
                                        'input h-11 pl-10',
                                        errors.identifier ? 'border-danger focus:border-danger focus:ring-danger/20' : '',
                                    ]"
                                />
                            </div>
                            <p v-if="errors.identifier" id="identifier-error" class="mt-1 text-[11px] font-medium text-danger">
                                {{ errors.identifier }}
                            </p>
                        </div>

                        <PasswordField
                            id="password"
                            v-model="form.password"
                            label="Kata sandi"
                            placeholder="Password"
                            autocomplete="current-password"
                            :error="errors.password"
                        >
                            <template #action>
                                <Link
                                    href="/reset-pass"
                                    class="inline-flex min-h-6 items-center py-1 text-[11px] font-semibold text-brand hover:underline"
                                >
                                    Lupa sandi
                                </Link>
                            </template>
                        </PasswordField>

                        <label class="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-muted">
                            <input
                                v-model="form.remember"
                                type="checkbox"
                                class="h-4 w-4 rounded border-line accent-[rgb(var(--brand))]"
                            />
                            Tetap masuk di perangkat ini
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

                    <div class="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                        <span class="h-px flex-1 bg-line"></span>
                        atau
                        <span class="h-px flex-1 bg-line"></span>
                    </div>

                    <button type="button" class="btn-secondary h-11 w-full" @click="googleLogin">
                        <i class="ph-light ph-google-logo text-base" aria-hidden="true"></i>
                        Lanjutkan dengan Google
                    </button>

                    <p class="mt-4 text-center text-xs text-muted">
                        Belum punya akun?
                        <Link href="/register" class="font-semibold text-brand hover:underline">Buat akun</Link>
                    </p>

                    <p class="mt-4 flex items-start gap-2 rounded-xl bg-elevated p-3 text-[11px] leading-relaxed text-muted">
                        <i class="ph-light ph-info mt-0.5 text-base" aria-hidden="true"></i>
                        Mode prototipe: autentikasi backend belum tersambung. Kredensial valid akan membuka dashboard.
                    </p>
                </div>

                <div class="mt-7 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-center backdrop-blur-sm">
                    <div class="px-2">
                        <p class="font-mono text-base font-semibold tabular-nums text-white">4.812</p>
                        <p class="mt-0.5 text-[10px] text-white/60">Anggota</p>
                    </div>
                    <div class="px-2">
                        <p class="font-mono text-base font-semibold tabular-nums text-white">862</p>
                        <p class="mt-0.5 text-[10px] text-white/60">Kader</p>
                    </div>
                    <div class="px-2">
                        <p class="font-mono text-base font-semibold tabular-nums text-white">21</p>
                        <p class="mt-0.5 text-[10px] text-white/60">PAC</p>
                    </div>
                </div>

                <p class="mt-6 text-center text-[10px] leading-relaxed text-white/60">
                    Butuh akses? Hubungi Sekretariat PC IPNU &amp; IPPNU Trenggalek.<br />
                    © 2026 EDO v2
                </p>
            </div>
        </div>
    </div>
</template>
