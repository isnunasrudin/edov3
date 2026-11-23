<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    quotes: { type: Array, required: true },
});

const index = ref(0);
const quote = computed(() => props.quotes[index.value] ?? props.quotes[0]);

function previous() {
    index.value = (index.value - 1 + props.quotes.length) % props.quotes.length;
}

function next() {
    index.value = (index.value + 1) % props.quotes.length;
}
</script>

<template>
    <div v-reveal class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#06172f] via-[#0a2858] to-[#1e3a8a] p-8 text-white sm:p-12">
        <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/25 blur-3xl" aria-hidden="true"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-info/10 blur-3xl" aria-hidden="true"></div>
        <div class="pointer-events-none absolute right-10 top-10 h-48 w-48 rounded-full border border-white/10" aria-hidden="true"></div>

        <div class="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl">
                <i class="ph-light ph-quotes text-4xl text-white/25" aria-hidden="true"></i>
                <blockquote class="mt-5 text-2xl font-medium leading-snug tracking-[-0.025em] text-white/90 sm:text-3xl" aria-live="polite">
                    {{ quote.quote }}
                </blockquote>
                <div class="mt-6">
                    <p class="text-sm font-bold text-white">{{ quote.name }}</p>
                    <p class="mt-1 text-[11px] text-white/50">{{ quote.role }}</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition duration-500 hover:bg-white/10 hover:text-white"
                    aria-label="Quote sebelumnya"
                    @click="previous"
                >
                    <i class="ph-light ph-caret-left" aria-hidden="true"></i>
                </button>
                <div class="flex items-center gap-1.5 px-1">
                    <button
                        v-for="(item, dotIndex) in quotes"
                        :key="item.name"
                        type="button"
                        :class="['h-1.5 rounded-full transition-all duration-500', dotIndex === index ? 'w-5 bg-white' : 'w-1.5 bg-white/30']"
                        :aria-label="`Tampilkan quote ${dotIndex + 1}`"
                        :aria-current="dotIndex === index"
                        @click="index = dotIndex"
                    ></button>
                </div>
                <button
                    type="button"
                    class="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition duration-500 hover:bg-white/10 hover:text-white"
                    aria-label="Quote berikutnya"
                    @click="next"
                >
                    <i class="ph-light ph-caret-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>
