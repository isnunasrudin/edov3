<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { notifications } from '@/data/dashboard';
import { showToast } from '@/composables/useToast';

const open = ref(false);
const unread = ref(true);
const root = ref(null);

const tones = {
    brand: 'bg-brand-soft text-brand',
    accent: 'bg-accent-soft text-accent',
    info: 'bg-info-soft text-info',
};

function markAllRead() {
    unread.value = false;
    showToast('Semua notifikasi ditandai sudah dibaca.', 'info');
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
            class="icon-btn relative"
            :aria-label="unread ? 'Notifikasi, 3 belum dibaca' : 'Notifikasi'"
            :aria-expanded="open"
            aria-controls="notif-menu"
            @click="open = !open"
        >
            <i class="ph-light ph-bell text-lg" aria-hidden="true"></i>
            <span
                v-if="unread"
                class="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface"
            ></span>
        </button>

        <div
            v-if="open"
            id="notif-menu"
            class="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-[0_30px_70px_-34px_rgba(15,23,42,0.5)]"
        >
            <div class="flex items-center justify-between border-b border-line px-4 py-3">
                <p class="text-sm font-bold">Notifikasi</p>
                <button
                    class="cursor-pointer text-xs font-semibold text-brand hover:underline"
                    @click="markAllRead"
                >
                    Tandai dibaca
                </button>
            </div>
            <ul class="max-h-80 divide-y divide-line overflow-y-auto">
                <li
                    v-for="item in notifications"
                    :key="item.title"
                    class="flex gap-3 px-4 py-3 hover:bg-elevated"
                >
                    <span
                        :class="[
                            'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg',
                            tones[item.tone] ?? tones.brand,
                        ]"
                    >
                        <i :class="['ph-light', item.icon]" aria-hidden="true"></i>
                    </span>
                    <div class="min-w-0">
                        <p class="text-xs font-semibold leading-snug">{{ item.title }}</p>
                        <p class="mt-0.5 text-[11px] text-muted">{{ item.meta }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
