<script setup>
import { dismissToast, useToast } from '@/composables/useToast';

const { items } = useToast();

const tones = {
    success: {
        wrapper: 'border-success/40 bg-success-soft text-success',
        icon: 'ph-check-circle',
    },
    info: {
        wrapper: 'border-info/40 bg-info-soft text-info',
        icon: 'ph-info',
    },
    error: {
        wrapper: 'border-danger/40 bg-danger-soft text-danger',
        icon: 'ph-warning-circle',
    },
};

function toneFor(kind) {
    return tones[kind] ?? tones.success;
}
</script>

<template>
    <div
        class="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
    >
        <TransitionGroup name="toast">
            <div
                v-for="toast in items"
                :key="toast.id"
                :class="[
                    'toast pointer-events-auto flex cursor-pointer items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-lg',
                    toneFor(toast.kind).wrapper,
                ]"
                role="status"
                @click="dismissToast(toast.id)"
            >
                <i :class="['ph-light mt-0.5 text-lg', toneFor(toast.kind).icon]" aria-hidden="true"></i>
                <span>{{ toast.message }}</span>
            </div>
        </TransitionGroup>
    </div>
</template>
