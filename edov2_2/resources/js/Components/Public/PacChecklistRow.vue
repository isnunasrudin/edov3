<script setup>
import LevelBadge from '@/Components/LevelBadge.vue';
import OrgBadge from '@/Components/OrgBadge.vue';
import StatusBadge from '@/Components/StatusBadge.vue';
import ProgressBar from '@/Components/ProgressBar.vue';

const props = defineProps({
    row: { type: Object, required: true },
    expanded: { type: Boolean, default: false },
});

defineEmits(['toggle']);
</script>

<template>
    <tr class="transition-colors hover:bg-elevated/60">
        <td class="td w-10">
            <button
                class="icon-btn-sm"
                :aria-expanded="expanded"
                :aria-label="`${expanded ? 'Tutup' : 'Buka'} rincian PR dan PK untuk ${row.nama}`"
                @click="$emit('toggle', row.id)"
            >
                <i :class="['ph-light ph-caret-right transition-transform duration-300', expanded ? 'rotate-90' : '']" aria-hidden="true"></i>
            </button>
        </td>

        <td class="td">
            <div class="flex items-center gap-2.5">
                <LevelBadge level="PAC" />
                <div class="min-w-0">
                    <p class="truncate font-semibold">{{ row.nama }}</p>
                    <p class="mt-0.5"><OrgBadge :org="row.org" /></p>
                </div>
            </div>
        </td>

        <td class="td hidden whitespace-nowrap text-muted sm:table-cell">{{ row.periode }}</td>

        <td class="td hidden lg:table-cell">{{ row.ketua }}</td>

        <td class="td">
            <div class="flex max-w-[190px] flex-wrap gap-1">
                <span
                    v-for="shortage in row.shortages"
                    :key="shortage"
                    class="badge border border-line bg-elevated text-muted"
                >
                    {{ shortage }}
                </span>
                <span v-if="!row.shortages.length" class="text-xs text-muted">—</span>
            </div>
        </td>

        <td class="td"><StatusBadge :status="row.status" /></td>

        <td class="td min-w-[170px]">
            <div class="flex items-center gap-2">
                <ProgressBar :value="row.percent" class="flex-1" />
                <span class="font-mono text-xs font-semibold tabular-nums">{{ row.percent }}%</span>
            </div>
            <p class="mt-1 text-[10px] text-muted">{{ row.complete }}/{{ row.total }} lengkap</p>
        </td>
    </tr>

    <template v-if="expanded">
        <tr v-for="child in row.children" :key="child.id" class="bg-elevated/30">
            <td class="td"></td>
            <td class="td">
                <div class="flex items-center gap-2.5 pl-5">
                    <LevelBadge :level="child.level" />
                    <p class="truncate text-sm font-medium">{{ child.nama }}</p>
                </div>
            </td>
            <td class="td hidden whitespace-nowrap text-muted sm:table-cell">{{ child.periode }}</td>
            <td class="td hidden lg:table-cell">{{ child.ketua }}</td>
            <td class="td text-xs text-muted">—</td>
            <td class="td"><StatusBadge :status="child.status" /></td>
            <td class="td min-w-[170px]">
                <div class="flex items-center gap-2">
                    <ProgressBar :value="child.percent" class="flex-1" />
                    <span class="font-mono text-xs font-semibold tabular-nums">{{ child.percent }}%</span>
                </div>
                <p class="mt-1 text-[10px] text-muted">{{ child.complete }}/{{ child.total }} lengkap</p>
            </td>
        </tr>
    </template>
</template>
