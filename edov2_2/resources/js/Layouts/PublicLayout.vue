<script setup>
import PublicHeader from '@/Components/Public/PublicHeader.vue';
import PublicFooter from '@/Components/Public/PublicFooter.vue';
import ToastStack from '@/Components/ToastStack.vue';

defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="min-h-dvh overflow-x-hidden bg-canvas font-sans text-ink antialiased">
        <div
            class="pointer-events-none fixed inset-0 -z-10"
            aria-hidden="true"
            style="background-image: radial-gradient(52rem 36rem at 88% -8%, rgb(var(--brand) / 0.10), transparent 62%), radial-gradient(42rem 32rem at 0% 105%, rgb(var(--info) / 0.08), transparent 60%);"
        ></div>

        <a href="#main" class="skip-link">Lewati ke konten utama</a>

        <PublicHeader />

        <main id="main" class="relative z-10">
            <slot />
        </main>

        <PublicFooter />
        <ToastStack />
    </div>
</template>
