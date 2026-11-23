<script setup>
defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'ph-sparkle' },
    align: { type: String, default: 'left' },
});
</script>

<template>
    <div
        v-reveal
        :class="[
            'flex flex-col gap-4',
            align === 'center'
                ? 'items-center text-center'
                : 'sm:flex-row sm:items-end sm:justify-between',
        ]"
    >
        <div :class="align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'">
            <span
                v-if="eyebrow"
                class="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand"
            >
                <i :class="['ph-light', icon]" aria-hidden="true"></i>
                {{ eyebrow }}
            </span>
            <h2 class="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {{ title }}
            </h2>
            <p v-if="description" class="mt-3 text-sm leading-relaxed text-muted">
                {{ description }}
            </p>
        </div>

        <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
            <slot name="actions" />
        </div>
    </div>
</template>
