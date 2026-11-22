<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import AppSidebar from '@/Components/AppSidebar.vue';
import AppHeader from '@/Components/AppHeader.vue';
import ToastStack from '@/Components/ToastStack.vue';

defineOptions({ inheritAttrs: false });

const page = usePage();
const sidebarOpen = ref(false);

watch(
    () => page.url,
    async () => {
        sidebarOpen.value = false;
        await nextTick();

        if (typeof document !== 'undefined') {
            document.getElementById('main')?.focus({ preventScroll: true });
        }
    },
);

watch(sidebarOpen, (open) => {
    document.documentElement.classList.toggle('no-scroll', open);
});

function handleResize() {
    if (window.innerWidth >= 1024) sidebarOpen.value = false;
}

onMounted(() => window.addEventListener('resize', handleResize));

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    document.documentElement.classList.remove('no-scroll');
});
</script>

<template>
    <div class="min-h-dvh font-sans text-ink antialiased">
        <div
            class="pointer-events-none fixed inset-0 -z-10"
            aria-hidden="true"
            style="background-image: radial-gradient(56rem 38rem at 92% -12%, rgb(var(--brand) / 0.10), transparent 62%), radial-gradient(48rem 36rem at -8% 108%, rgb(var(--info) / 0.09), transparent 60%);"
        ></div>

        <a href="#main" class="skip-link">Lewati ke konten utama</a>

        <div
            v-if="sidebarOpen"
            class="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            @click="sidebarOpen = false"
        ></div>

        <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

        <div class="min-w-0 lg:pl-[18rem]">
            <AppHeader :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

            <main id="main" tabindex="-1" class="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <Transition name="page" mode="out-in">
                    <div :key="page.url">
                        <slot />
                    </div>
                </Transition>
            </main>

            <footer class="border-t border-line px-4 py-6 sm:px-6 lg:px-8">
                <div class="flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 EDO v2 · PC IPNU &amp; IPPNU Kabupaten Trenggalek</p>
                    <p class="flex items-center gap-4">
                        <span class="inline-flex items-center gap-1">
                            <i class="ph-light ph-shield-check" aria-hidden="true"></i>
                            Data internal
                        </span>
                        <span class="inline-flex items-center gap-1">
                            <i class="ph-light ph-code" aria-hidden="true"></i>
                            Laravel · Inertia · Vue
                        </span>
                    </p>
                </div>
            </footer>
        </div>

        <ToastStack />
    </div>
</template>
