<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AuthLayout from '@/Layouts/AuthLayout.vue';
import AuthBrandHeader from '@/Components/AuthBrandHeader.vue';
import PasswordField from '@/Components/PasswordField.vue';
import { showToast } from '@/composables/useToast';

defineOptions({ layout: AuthLayout, inheritAttrs: false });

const form = reactive({
    name: '',
    identifier: '',
    gender: '',
    password: '',
    agreement: false,
});

const errors = reactive({
    name: '',
    identifier: '',
    gender: '',
    password: '',
    agreement: '',
});

const loading = ref(false);
const showSummary = ref(false);
const summaryEl = ref(null);
const nameInput = ref(null);

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
    errors.name = form.name.trim() ? '' : 'Nama lengkap wajib diisi.';
    errors.identifier = !form.identifier.trim()
        ? 'Email / No. WhatsApp wajib diisi.'
        : !validIdentifier(form.identifier)
          ? 'Masukkan email atau nomor WhatsApp yang valid.'
          : '';
    errors.gender = form.gender ? '' : 'Pilih jenis kelamin.';
    errors.password = !form.password
        ? 'Kata sandi wajib diisi.'
        : form.password.length < 8
          ? 'Kata sandi minimal 8 karakter.'
          : '';
    errors.agreement = form.agreement ? '' : 'Anda harus menyetujui PD & PRT.';

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

    showToast('Akun demo berhasil dibuat. Silakan masuk.', 'success');
    router.visit('/login');
}

function chooseGender(gender) {
    form.gender = gender;
    errors.gender = '';
}

function agreementInfo() {
    showToast('Dokumen PD & PRT belum tersedia pada prototipe.', 'info');
}

function clearOnInput(key) {
    errors[key] = '';
    if (!activeErrors.value.length) showSummary.value = false;
}

watch(() => form.name, () => clearOnInput('name'));
watch(() => form.identifier, () => clearOnInput('identifier'));
watch(() => form.password, () => clearOnInput('password'));
watch(() => form.agreement, () => clearOnInput('agreement'));

onMounted(() => nameInput.value?.focus());
</script>

<template>
    <Head title="Buat Akun · EDO v2" />

    <div class="flex min-h-dvh flex-col">
        <AuthBrandHeader />

        <div class="flex flex-1 items-center justify-center px-4 pb-10 pt-2 sm:px-6">
            <div class="w-full max-w-md">
                <div class="text-center">
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        <i class="ph-light ph-user-plus" aria-hidden="true"></i>
                        Bergabung
                    </span>
                    <h1 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                        Buat akun EDO v2.
                    </h1>
                    <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                        Satu akun untuk mengelola persuratan, anggota, pimpinan, dan kaderisasi.
                    </p>
                </div>

                <div class="card mt-7 p-6 text-ink sm:p-8">
                    <div class="mb-5 flex items-center gap-2.5">
                        <span class="grid h-9 w-9 place-items-center rounded-2xl bg-brand-soft text-brand">
                            <i class="ph-light ph-user-plus text-base" aria-hidden="true"></i>
                        </span>
                        <div>
                            <p class="text-sm font-bold">Buat akun baru</p>
                            <p class="text-[11px] text-muted">Lengkapi data keanggotaan Anda.</p>
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
                            <label for="register-name" class="label">
                                Nama lengkap <span class="text-danger">*</span>
                            </label>
                            <input
                                id="register-name"
                                ref="nameInput"
                                v-model="form.name"
                                class="input h-11"
                                autocomplete="name"
                                placeholder="Nama sesuai KTA"
                                :aria-invalid="!!errors.name"
                                :aria-describedby="errors.name ? 'register-name-error' : undefined"
                                :class="errors.name ? 'border-danger focus:border-danger focus:ring-danger/20' : ''"
                            />
                            <p v-if="errors.name" id="register-name-error" class="mt-1 text-[11px] font-medium text-danger">
                                {{ errors.name }}
                            </p>
                        </div>

                        <div>
                            <label for="register-identifier" class="label">
                                Email / No. WhatsApp <span class="text-danger">*</span>
                            </label>
                            <div class="relative">
                                <i class="ph-light ph-user pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-muted" aria-hidden="true"></i>
                                <input
                                    id="register-identifier"
                                    v-model="form.identifier"
                                    type="text"
                                    inputmode="email"
                                    autocomplete="username"
                                    autocapitalize="none"
                                    class="input h-11 pl-10"
                                    placeholder="Alamat Email / No. WhatsApp"
                                    :aria-invalid="!!errors.identifier"
                                    :aria-describedby="errors.identifier ? 'register-identifier-error' : undefined"
                                    :class="errors.identifier ? 'border-danger focus:border-danger focus:ring-danger/20' : ''"
                                />
                            </div>
                            <p v-if="errors.identifier" id="register-identifier-error" class="mt-1 text-[11px] font-medium text-danger">
                                {{ errors.identifier }}
                            </p>
                        </div>

                        <div>
                            <p class="label">Jenis kelamin <span class="text-danger">*</span></p>
                            <div class="grid grid-cols-2 gap-2 rounded-xl bg-elevated p-1" role="group" aria-label="Jenis kelamin">
                                <button
                                    type="button"
                                    :class="[
                                        'min-h-10 cursor-pointer rounded-lg text-xs font-semibold transition duration-500',
                                        form.gender === 'Laki-laki' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
                                    ]"
                                    :aria-pressed="form.gender === 'Laki-laki'"
                                    @click="chooseGender('Laki-laki')"
                                >
                                    Laki-laki
                                </button>
                                <button
                                    type="button"
                                    :class="[
                                        'min-h-10 cursor-pointer rounded-lg text-xs font-semibold transition duration-500',
                                        form.gender === 'Perempuan' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
                                    ]"
                                    :aria-pressed="form.gender === 'Perempuan'"
                                    @click="chooseGender('Perempuan')"
                                >
                                    Perempuan
                                </button>
                            </div>
                            <p v-if="errors.gender" class="mt-1 text-[11px] font-medium text-danger">{{ errors.gender }}</p>
                        </div>

                        <PasswordField
                            id="register-password"
                            v-model="form.password"
                            label="Kata sandi"
                            hint="Minimal 8 karakter."
                            placeholder="Buat kata sandi"
                            autocomplete="new-password"
                            :error="errors.password"
                        />

                        <div>
                            <label class="flex min-h-11 cursor-pointer items-start gap-2 text-xs leading-relaxed text-muted">
                                <input
                                    v-model="form.agreement"
                                    type="checkbox"
                                    class="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[rgb(var(--brand))]"
                                    :aria-invalid="!!errors.agreement"
                                />
                                <span>
                                    Dengan ini, saya menyatakan tunduk dan patuh terhadap
                                    <button
                                        type="button"
                                        class="font-semibold text-brand hover:underline"
                                        @click.stop.prevent="agreementInfo"
                                    >
                                        Peraturan Dasar &amp; Peraturan Rumah Tangga IPNU/IPPNU
                                    </button>.
                                </span>
                            </label>
                            <p v-if="errors.agreement" class="mt-1 text-[11px] font-medium text-danger">{{ errors.agreement }}</p>
                        </div>

                        <button type="submit" class="btn-primary group h-11 w-full" :disabled="loading">
                            <template v-if="loading">
                                <i class="ph-light ph-circle-notch animate-spin text-base" aria-hidden="true"></i>
                                <span>Memproses…</span>
                            </template>
                            <template v-else>
                                <span>Buat Akun</span>
                                <span class="btn-trail" aria-hidden="true">
                                    <i class="ph-light ph-arrow-right text-sm"></i>
                                </span>
                            </template>
                        </button>
                    </form>

                    <p class="mt-4 text-center text-xs text-muted">
                        Sudah punya akun?
                        <Link href="/login" class="font-semibold text-brand hover:underline">Masuk</Link>
                    </p>

                    <p class="mt-4 flex items-start gap-2 rounded-xl bg-elevated p-3 text-[11px] leading-relaxed text-muted">
                        <i class="ph-light ph-shield-check mt-0.5 text-base" aria-hidden="true"></i>
                        Mode prototipe: pendaftaran belum tersambung ke backend. Data tidak dikirim ke mana pun.
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
                    Butuh bantuan? Hubungi Sekretariat PC IPNU &amp; IPPNU Trenggalek.<br />
                    © 2026 EDO v2
                </p>
            </div>
        </div>
    </div>
</template>
