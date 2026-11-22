<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { showToast } from '@/composables/useToast';

const open = ref(false);
const root = ref(null);

const actions = [
    { icon: 'ph-user', label: 'Profil saya', message: 'Menu Profil masih dalam prototipe.' },
    { icon: 'ph-gear', label: 'Pengaturan', message: 'Menu Pengaturan masih dalam prototipe.' },
    { icon: 'ph-sign-out', label: 'Keluar', message: 'Anda keluar dari sesi demo.', route: '/login', danger: true },
];

function run(action) {
    open.value = false;
    showToast(action.message, 'info');

    if (action.route) {
        router.visit(action.route);
    }
}

function onDocumentClick(event) {
    if (root.value && !root.value.contains(event.target)) {
        open.value = false;
    }
}

function onKeydown(event) {
    if (event.key === 'Escape') open.value = false;
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <div ref="root" class="relative shrink-0">
        <button
            class="flex cursor-pointer items-center gap-2 rounded-full border border-line/70 bg-surface py-1.5 pl-1.5 pr-2 transition duration-500 hover:bg-elevated"
            aria-label="Menu akun: Ahmad Fauzan"
            :aria-expanded="open"
            aria-controls="user-menu"
            @click="open = !open"
        >
            <span class="grid h-7 w-7 place-items-center rounded-full bg-brand-soft font-mono text-[10px] font-bold text-brand">
                AF
            </span>
            <span class="hidden text-left sm:block">
                <span class="block text-xs font-bold leading-tight">Ahmad Fauzan</span>
                <span class="block text-[10px] text-muted">Sekretaris</span>
            </span>
            <i class="ph-light ph-caret-down hidden text-xs text-muted sm:block" aria-hidden="true"></i>
        </button>

        <div
            v-if="open"
            id="user-menu"
            class="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-line/70 bg-surface p-1.5 shadow-[0_30px_70px_-34px_rgba(15,23,42,0.5)]"
        >
            <div class="border-b border-line px-3 py-2.5">
                <p class="text-sm font-bold">Ahmad Fauzan Hidayat</p>
                <p class="text-[11px] text-muted">Sekretaris PC IPNU Trenggalek</p>
            </div>
            <button
                v-for="action in actions"
                :key="action.label"
                :class="[
                    'mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-elevated',
                    action.danger ? 'text-danger hover:bg-danger-soft' : '',
                ]"
                @click="run(action)"
            >
                <i :class="['ph-light text-base', action.icon]" aria-hidden="true"></i>
                {{ action.label }}
            </button>
        </div>
    </div>
</template>
