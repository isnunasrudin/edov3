<script setup>
import ThemeToggle from '@/Components/ThemeToggle.vue';
import ToastStack from '@/Components/ToastStack.vue';

defineOptions({ inheritAttrs: false });
</script>

<template>
    <div class="relative min-h-dvh overflow-hidden bg-[#050d1f] font-sans antialiased">
        <!-- Atmosfer -->
        <div
            class="pointer-events-none fixed inset-0"
            aria-hidden="true"
            style="background:
                radial-gradient(48rem 32rem at 50% -8%, rgba(37, 99, 235, 0.32), transparent 62%),
                radial-gradient(36rem 28rem at 108% 108%, rgba(34, 211, 238, 0.12), transparent 60%),
                linear-gradient(160deg, #050d1f 0%, #071b3a 52%, #0b2a5e 100%);"
        ></div>

        <div
            class="pointer-events-none fixed inset-0 opacity-[0.045]"
            aria-hidden="true"
            style="background-image: linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px); background-size: 56px 56px;"
        ></div>

        <div class="pointer-events-none absolute left-1/2 top-[45%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" aria-hidden="true"></div>
        <div class="pointer-events-none absolute left-1/2 top-[45%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" aria-hidden="true"></div>
        <div class="pointer-events-none absolute left-1/2 top-[45%] h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" aria-hidden="true"></div>

        <a href="#main" class="skip-link">Lewati ke konten utama</a>

        <div class="fixed right-4 top-4 z-30">
            <ThemeToggle />
        </div>

        <main id="main" class="relative z-10 min-h-dvh">
            <slot />
        </main>

        <ToastStack />
    </div>
</template>
