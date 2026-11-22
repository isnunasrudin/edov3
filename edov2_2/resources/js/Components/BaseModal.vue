<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';

const props = defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    size: { type: String, default: 'lg' },
});

const emit = defineEmits(['close']);

const panel = ref(null);
const titleId = useId();
const sizes = { md: 'max-w-md', lg: 'max-w-lg' };
const sizeClass = computed(() => sizes[props.size] ?? sizes.lg);

let lastFocused = null;

watch(
    () => props.open,
    async (open) => {
        if (typeof document === 'undefined') return;

        if (open) {
            lastFocused = document.activeElement;
            document.body.style.overflow = 'hidden';
            await nextTick();

            const first =
                panel.value?.querySelector(
                    'form input:not([type="hidden"]), form select, form textarea',
                ) ??
                panel.value?.querySelector(
                    'input:not([type="hidden"]), select, textarea, button',
                );

            first?.focus();
            return;
        }

        document.body.style.overflow = '';
        lastFocused?.focus?.();
        lastFocused = null;
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
    }
});

function onKeydown(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        emit('close');
        return;
    }

    if (event.key !== 'Tab' || !panel.value) return;

    const focusables = Array.from(
        panel.value.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])',
        ),
    ).filter((element) => element.offsetParent !== null);

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="open"
                class="fixed inset-0 z-50"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="titleId"
            >
                <div
                    class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                    @click="$emit('close')"
                ></div>

                <div
                    class="relative flex min-h-full items-end justify-center p-3 sm:items-center sm:p-6"
                    @click.self="$emit('close')"
                >
                    <div
                        ref="panel"
                        :class="[
                            'modal-panel max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-[1.75rem] border border-line/70 bg-surface shadow-[0_50px_100px_-40px_rgba(15,23,42,0.6)]',
                            sizeClass,
                        ]"
                        tabindex="-1"
                        @keydown="onKeydown"
                    >
                        <div class="flex items-start justify-between border-b border-line px-5 py-4">
                            <div>
                                <h2 :id="titleId" class="text-base font-bold">{{ title }}</h2>
                                <p v-if="subtitle" class="text-xs text-muted">{{ subtitle }}</p>
                            </div>
                            <button
                                class="icon-btn-sm"
                                aria-label="Tutup dialog"
                                @click="$emit('close')"
                            >
                                <i class="ph-light ph-x text-lg" aria-hidden="true"></i>
                            </button>
                        </div>

                        <slot />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
