<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { dashboard } from '@/stores/dashboard';

const q = ref('');
const open = ref(false);
const root = ref(null);
const input = ref(null);
const compact = ref(false);

const hasQuery = computed(() => q.value.trim().length > 0);

const results = computed(() => {
    const term = q.value.toLowerCase().trim();
    if (!term) return [];

    const items = [];

    dashboard.surat.forEach((surat) => {
        if (`${surat.nomor} ${surat.perihal} ${surat.pihak}`.toLowerCase().includes(term)) {
            items.push({
                route: '/dashboard/persuratan',
                params: { q: surat.perihal, jenis: surat.jenis },
                icon: 'ph-envelope-simple',
                type: surat.jenis === 'masuk' ? 'Surat Masuk' : 'Surat Keluar',
                title: surat.perihal,
                meta: surat.nomor,
            });
        }
    });

    dashboard.anggota.forEach((anggota) => {
        if (`${anggota.nama} ${anggota.nia} ${anggota.pac}`.toLowerCase().includes(term)) {
            items.push({
                route: '/dashboard/anggota',
                params: { q: anggota.nama },
                icon: 'ph-user',
                type: `Anggota · ${anggota.org}`,
                title: anggota.nama,
                meta: `${anggota.nia} · PAC ${anggota.pac}`,
            });
        }
    });

    dashboard.pimpinan.forEach((pimpinan) => {
        if (`${pimpinan.nama} ${pimpinan.region} ${pimpinan.ketua}`.toLowerCase().includes(term)) {
            items.push({
                route: '/dashboard/pimpinan',
                params: { q: pimpinan.nama },
                icon: 'ph-identification-card',
                type: `Pimpinan · ${pimpinan.org}`,
                title: pimpinan.nama,
                meta: `${pimpinan.level} · ${pimpinan.region}`,
            });
        }
    });

    return items.slice(0, 6);
});

const placeholder = computed(() =>
    compact.value ? 'Cari…' : 'Cari surat, anggota…',
);

function go(item) {
    q.value = '';
    open.value = false;
    router.get(item.route, item.params);
}

function onDocumentClick(event) {
    if (root.value && !root.value.contains(event.target)) {
        open.value = false;
    }
}

function onDocumentKey(event) {
    const tag = document.activeElement?.tagName;
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);

    if (event.key === '/' && !typing) {
        event.preventDefault();
        input.value?.focus();
    }

    if (event.key === 'Escape') {
        open.value = false;
        input.value?.blur();
    }
}

function syncCompact() {
    compact.value = window.innerWidth < 640;
}

onMounted(() => {
    syncCompact();
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKey);
    window.addEventListener('resize', syncCompact);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentKey);
    window.removeEventListener('resize', syncCompact);
});
</script>

<template>
    <div ref="root" class="relative ml-auto w-full min-w-0 max-w-[15rem] flex-1 sm:max-w-xs md:ml-6">
        <label for="global-search" class="sr-only">Cari surat atau anggota</label>
        <i
            class="ph-light ph-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted"
            aria-hidden="true"
        ></i>
        <input
            id="global-search"
            ref="input"
            v-model="q"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            autocomplete="off"
            :placeholder="placeholder"
            class="h-10 w-full rounded-full border border-line/70 bg-elevated/80 pl-9 pr-11 text-sm text-ink placeholder:text-muted transition duration-500 focus:border-brand focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
            :aria-expanded="open && hasQuery"
            :aria-controls="open && hasQuery ? 'search-results' : undefined"
            @input="open = true"
            @focus="open = hasQuery"
            @keydown.enter="results.length && go(results[0])"
        />
        <kbd
            class="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none items-center rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline-flex"
        >
            /
        </kbd>

        <div
            v-if="open && hasQuery"
            id="search-results"
            class="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-line/70 bg-surface p-1.5 shadow-[0_30px_70px_-34px_rgba(15,23,42,0.5)]"
            aria-live="polite"
        >
            <template v-if="results.length">
                <p class="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                    {{ results.length }} hasil
                </p>
                <button
                    v-for="item in results"
                    :key="`${item.route}-${item.meta}`"
                    class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-elevated focus:bg-elevated"
                    @click="go(item)"
                >
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-elevated text-muted">
                        <i :class="['ph-light', item.icon]" aria-hidden="true"></i>
                    </span>
                    <span class="min-w-0 flex-1">
                        <span class="block truncate text-xs font-semibold">{{ item.title }}</span>
                        <span class="block truncate text-[11px] text-muted">{{ item.meta }}</span>
                    </span>
                    <span class="shrink-0 rounded-md bg-elevated px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                        {{ item.type }}
                    </span>
                </button>
            </template>
            <p v-else class="px-3 py-4 text-center text-xs text-muted">
                Tidak ada hasil untuk “{{ q.trim() }}”.
            </p>
        </div>
    </div>
</template>
