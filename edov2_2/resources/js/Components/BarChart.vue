<script setup>
import { computed } from 'vue';
import { formatNumber } from '@/utils/format';

const props = defineProps({
    data: { type: Array, required: true },
    total: { type: Number, default: 4812 },
});

const max = computed(() => Math.max(...props.data.map((item) => item.total), 1));

const chartLabel = computed(
    () =>
        `Grafik batang jumlah anggota per PAC. ${props.data
            .map((item) => `${item.name} ${item.total}`)
            .join(', ')}.`,
);
</script>

<template>
    <article v-reveal class="card card-lift p-5 lg:col-span-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
                <h3 class="text-sm font-bold">Distribusi Anggota per PAC</h3>
                <p class="text-xs text-muted">8 PAC dengan anggota terbanyak · 2026</p>
            </div>
            <span class="badge bg-brand-soft text-brand">Total {{ formatNumber(total) }}</span>
        </div>

        <div
            class="mt-6 flex h-56 items-end gap-2 overflow-x-auto pb-1 sm:gap-3"
            role="img"
            :aria-label="chartLabel"
        >
            <div
                v-for="item in data"
                :key="item.name"
                class="flex h-full min-w-[34px] flex-1 flex-col items-center justify-end gap-2"
                :title="`${item.name}: ${item.total} anggota`"
            >
                <span class="font-mono text-[10px] font-semibold tabular-nums text-muted">
                    {{ item.total }}
                </span>
                <div class="flex w-full flex-1 items-end">
                    <div
                        class="w-full rounded-t-lg bg-gradient-to-t from-brand to-brand/55 transition-all duration-200 hover:from-brand-deep"
                        :style="{ height: `${Math.round((item.total / max) * 100)}%` }"
                    ></div>
                </div>
                <span class="w-full truncate text-center text-[10px] text-muted">
                    {{ item.name }}
                </span>
            </div>
        </div>

        <!-- Alternatif tabel untuk screen reader. Dibungkus div agar tidak
             mengganggu layout tabel (tabel tidak boleh menjadi box 1x1). -->
        <div class="sr-only pointer-events-none">
            <table>
                <caption>
                    Jumlah anggota per PAC
                </caption>
                <thead>
                    <tr>
                        <th scope="col">PAC</th>
                        <th scope="col">Jumlah anggota</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="`row-${item.name}`">
                        <td>{{ item.name }}</td>
                        <td>{{ item.total }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </article>
</template>
