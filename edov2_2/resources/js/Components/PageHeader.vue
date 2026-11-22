<script setup>
defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'ph-sparkle' },
    glow: { type: Boolean, default: false },
});
</script>

<template>
    <div class="relative isolate flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div
            v-if="glow"
            class="pointer-events-none absolute -right-4 -top-16 -z-10 h-48 w-48 rounded-full bg-brand/10 blur-3xl"
            aria-hidden="true"
        ></div>

        <div>
            <span
                v-if="eyebrow"
                class="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-brand-fg"
            >
                <i :class="['ph-light', icon]" aria-hidden="true"></i>
                {{ eyebrow }}
            </span>
            <h2 class="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {{ title }}
            </h2>
            <p v-if="description" class="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {{ description }}
            </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <slot name="actions" />
        </div>
    </div>
</template>
