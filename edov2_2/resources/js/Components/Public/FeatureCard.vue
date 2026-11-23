<script setup>
import { computed } from 'vue';

const props = defineProps({
    feature: { type: Object, required: true },
});

defineEmits(['select']);

const tones = {
    accent: 'bg-accent-soft text-accent',
    brand: 'bg-brand-soft text-brand',
    info: 'bg-info-soft text-info',
    success: 'bg-success-soft text-success',
    violet: 'bg-violet-soft text-violet',
};

const toneClass = computed(() => tones[props.feature.tone] ?? tones.brand);
const actionIcon = computed(() => {
    if (props.feature.action === 'wiki') return 'ph-arrow-up-right';
    if (props.feature.action === 'soon') return 'ph-clock';
    return 'ph-arrow-right';
});
</script>

<template>
    <button
        type="button"
        :class="[
            'card card-lift group flex h-full w-full flex-col p-5 text-left sm:p-6',
            feature.id === 'edopedia' ? 'sm:flex-row sm:items-center sm:justify-between sm:gap-8' : '',
            feature.span,
        ]"
        @click="$emit('select', feature)"
    >
        <div :class="feature.id === 'edopedia' ? 'max-w-xl' : 'flex h-full flex-col'">
            <div class="flex items-start justify-between gap-3">
                <span :class="['grid h-11 w-11 shrink-0 place-items-center rounded-2xl', toneClass]">
                    <i :class="['ph-light text-xl', feature.icon]" aria-hidden="true"></i>
                </span>
                <span v-if="feature.badge" class="badge border border-line bg-elevated text-muted">
                    {{ feature.badge }}
                </span>
            </div>

            <h3 class="mt-4 text-sm font-bold">{{ feature.title }}</h3>
            <p class="mt-1.5 max-w-md text-xs leading-relaxed text-muted">
                {{ feature.description }}
            </p>

            <span class="mt-auto inline-flex items-center gap-1 pt-5 text-[11px] font-semibold text-brand">
                {{ feature.cta }}
                <i :class="['ph-light text-xs transition-transform duration-500 group-hover:translate-x-0.5', actionIcon]" aria-hidden="true"></i>
            </span>
        </div>

        <div
            v-if="feature.id === 'edopedia'"
            class="mt-6 hidden shrink-0 items-center gap-4 rounded-2xl bg-[#071b3a] p-5 text-white sm:flex"
        >
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky-300">
                <i class="ph-light ph-book-open text-2xl" aria-hidden="true"></i>
            </span>
            <div>
                <p class="text-xs font-bold">Ensiklopedia Digital</p>
                <p class="mt-1 text-[10px] text-white/50">IPNU &amp; IPPNU</p>
            </div>
            <span class="ml-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70 transition-transform duration-500 group-hover:translate-x-0.5">
                <i class="ph-light ph-arrow-up-right" aria-hidden="true"></i>
            </span>
        </div>
    </button>
</template>
