<script setup>
import { computed } from 'vue';

const props = defineProps({
    org: { type: String, required: true },
});

const classes = computed(() =>
    props.org === 'IPNU' ? 'bg-brand-soft text-brand' : 'bg-info-soft text-info',
);
</script>

<template>
    <span :class="['badge', classes]">{{ org }}</span>
</template>
