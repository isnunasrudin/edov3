<script setup>
import { nextTick, reactive, ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import AuthLayout from '@/Layouts/AuthLayout.vue';
import AuthBrandHeader from '@/Components/AuthBrandHeader.vue';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AuthLayout, inheritAttrs: false });

const form = reactive({ identifier: '' });
const error = ref('');
const loading = ref(false);
const sent = ref(false);
const input = ref(null);

function validIdentifier(value) {
    const term = value.trim();

    if (!term) return false;

    if (term.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term);
    }

    const digits = term.replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 15;
}

async function submit() {
    error.value = !form.identifier.trim()
        ? 'Email / No. WhatsApp wajib diisi.'
        : !validIdentifier(form.identifier)
          ? 'Masukkan email atau nomor WhatsApp yang valid.'
          : '';

    if (error.value) {
        await nextTick();
        input.value?.focus();
        return;
    }

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 900));
    loading.value = false;
    sent.value = true;
    showToast('Tautan reset disiapkan (mode prototipe).', 'info');
}
</script>

<template>
    <Head title="Lupa Sandi · EDO v2" />

    <div class="flex min-h-dvh flex-col">
        <AuthBrandHeader />

        <div class="flex flex-1 items-center justify-center px-4 pb-10 pt-2 sm:px-6">
            <div class="w-full max-w-md">
                <div class="text-center">
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        <i class="ph-light ph-lock-key" aria-hidden="true"></i>
                        Pemulihan akun
                    </span>
                    <h1 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                        Lupa kata sandi?
                    </h1>
                    <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                        Masukkan email atau nomor WhatsApp yang terdaftar.
                    </p>
                </div>

                <div class="card mt-7 p-6 text-ink sm:p-8">
                    <div v-if="!sent">
                        <div class="mb-5 flex items-center gap-2.5">
                            <span class="grid h-9 w-9 place-items-center rounded-2xl bg-brand-soft text-brand">
                                <i class="ph-light ph-lock-key text-base" aria-hidden="true"></i>
                            </span>
                            <div>
                                <p class="text-sm font-bold">Reset kata sandi</p>
                                <p class="text-[11px] text-muted">Kami akan mengirim tautan pemulihan.</p>
                            </div>
                        </div>

                        <form class="space-y-4" novalidate @submit.prevent="submit">
                            <div>
                                <label for="reset-identifier" class="label">
                                    Email / No. WhatsApp <span class="text-danger">*</span>
                                </label>
                                <div class="relative">
                                    <i class="ph-light ph-user pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
                                    <input
                                        id="reset-identifier"
                                        ref="input"
                                        v-model="form.identifier"
                                        type="text"
                                        inputmode="email"
                                        autocomplete="username"
                                        autocapitalize="none"
                                        class="input h-11 pl-10"
                                        placeholder="Alamat Email / No. WhatsApp"
                                        :aria-invalid="!!error"
                                        :aria-describedby="error ? 'reset-error' : undefined"
                                        :class="error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''"
                                    />
                                </div>
                                <p v-if="error" id="reset-error" class="mt-1 text-[11px] font-medium text-danger">{{ error }}</p>
                            </div>

                            <button type="submit" class="btn-primary group h-11 w-full" :disabled="loading">
                                <template v-if="loading">
                                    <i class="ph-light ph-circle-notch animate-spin text-base" aria-hidden="true"></i>
                                    <span>Memproses…</span>
                                </template>
                                <template v-else>
                                    <span>Kirim tautan reset</span>
                                    <span class="btn-trail" aria-hidden="true">
                                        <i class="ph-light ph-arrow-right text-sm"></i>
                                    </span>
                                </template>
                            </button>
                        </form>
                    </div>

                    <div v-else class="text-center">
                        <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
                            <i class="ph-light ph-check-circle text-2xl" aria-hidden="true"></i>
                        </span>
                        <h2 class="mt-4 text-lg font-bold">Tautan reset disiapkan</h2>
                        <p class="mt-2 text-sm leading-relaxed text-muted">
                            Pada implementasi nyata, tautan pemulihan akan dikirim ke
                            <span class="font-semibold text-ink">{{ form.identifier }}</span>.
                        </p>
                        <Link href="/login" class="btn-primary mt-5 h-11 w-full">
                            Kembali ke halaman masuk
                        </Link>
                    </div>

                    <p class="mt-5 text-center text-xs">
                        <Link href="/login" class="inline-flex min-h-6 items-center gap-1 font-semibold text-brand hover:underline">
                            <i class="ph-light ph-arrow-left text-sm" aria-hidden="true"></i>
                            Kembali ke masuk
                        </Link>
                    </p>

                    <p class="mt-4 flex items-start gap-2 rounded-xl bg-elevated p-3 text-[11px] leading-relaxed text-muted">
                        <i class="ph-light ph-info mt-0.5 text-base" aria-hidden="true"></i>
                        Mode prototipe: tautan reset belum dikirim melalui backend.
                    </p>
                </div>

                <p class="mt-6 text-center text-[10px] leading-relaxed text-white/60">
                    Butuh bantuan? Hubungi Sekretariat PC IPNU &amp; IPPNU Trenggalek.<br />
                    © 2026 EDO v2
                </p>
            </div>
        </div>
    </div>
</template>
