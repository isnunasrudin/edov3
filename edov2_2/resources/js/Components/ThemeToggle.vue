<script setup>
import { useTheme } from '@/composables/useTheme';

const { isDark, toggle } = useTheme();
</script>

<template>
    <button
        class="icon-btn shrink-0"
        :aria-label="isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'"
        :aria-pressed="isDark"
        @click="toggle"
    >
        <i class="ph-light ph-moon text-lg dark:hidden" aria-hidden="true"></i>
        <i class="ph-light ph-sun hidden text-lg dark:block" aria-hidden="true"></i>
    </button>
</template>
