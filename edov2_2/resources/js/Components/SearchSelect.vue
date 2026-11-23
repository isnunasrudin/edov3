<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const model = defineModel({ type: [String, Number], default: null });

const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Pilih…' },
    searchPlaceholder: { type: String, default: 'Cari…' },
    error: { type: String, default: '' },
    hint: { type: String, default: '' },
    clearable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    hideLabel: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
});

const open = ref(false);
const query = ref('');
const activeIndex = ref(0);
const triggerRef = ref(null);
const dropdownRef = ref(null);
const searchRef = ref(null);
const position = ref({ top: 0, left: 0, width: 0 });

const labelId = `${props.id}-label`;
const listboxId = `${props.id}-listbox`;

const normalizedOptions = computed(() =>
    props.options.map((option) =>
        typeof option === 'string' ? { value: option, label: option } : option,
    ),
);

const selected = computed(() => {
    const match = normalizedOptions.value.find((option) => option.value === model.value);
    if (match) return match;
    if (model.value !== null && model.value !== undefined && model.value !== '') {
        return { value: model.value, label: String(model.value) };
    }
    return null;
});

const filtered = computed(() => {
    const term = query.value.toLowerCase().trim();

    if (!term) return normalizedOptions.value;

    return normalizedOptions.value.filter((option) =>
        `${option.label} ${option.description ?? ''}`.toLowerCase().includes(term),
    );
});

const activeOptionId = computed(() =>
    open.value && filtered.value[activeIndex.value]
        ? `${props.id}-option-${activeIndex.value}`
        : undefined,
);

const describedBy = computed(() => {
    const ids = [];
    if (props.hint) ids.push(`${props.id}-hint`);
    if (props.error) ids.push(`${props.id}-error`);
    return ids.length ? ids.join(' ') : undefined;
});

function measure() {
    if (!triggerRef.value || typeof window === 'undefined') return;

    const rect = triggerRef.value.getBoundingClientRect();
    const width = Math.min(rect.width, window.innerWidth - rect.left - 12);
    const height = 300;
    const openUp = window.innerHeight - rect.bottom < height && rect.top > height;

    position.value = {
        top: openUp ? Math.max(12, rect.top - height - 6) : Math.min(window.innerHeight - 12 - 280, rect.bottom + 6),
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
        width,
    };
}

async function openPanel() {
    if (props.disabled) return;

    measure();
    open.value = true;
    query.value = '';
    activeIndex.value = Math.max(
        0,
        filtered.value.findIndex((option) => option.value === model.value),
    );

    await nextTick();
    searchRef.value?.focus();
}

function closePanel() {
    open.value = false;
    query.value = '';
}

function togglePanel() {
    if (open.value) closePanel();
    else openPanel();
}

function selectOption(option) {
    model.value = option.value;
    closePanel();
    triggerRef.value?.focus();
}

function clearValue() {
    model.value = null;
    closePanel();
}

function onSearchKey(event) {
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!filtered.value.length) return;
        activeIndex.value = (activeIndex.value + 1) % filtered.value.length;
        nextTick(() => {
            document.getElementById(activeOptionId.value)?.scrollIntoView({ block: 'nearest' });
        });
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!filtered.value.length) return;
        activeIndex.value = (activeIndex.value - 1 + filtered.value.length) % filtered.value.length;
        nextTick(() => {
            document.getElementById(activeOptionId.value)?.scrollIntoView({ block: 'nearest' });
        });
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();
        const option = filtered.value[activeIndex.value];
        if (option) selectOption(option);
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
        triggerRef.value?.focus();
        return;
    }

    if (event.key === 'Tab') {
        closePanel();
    }
}

function onDocumentClick(event) {
    if (!open.value) return;
    if (triggerRef.value?.contains(event.target) || dropdownRef.value?.contains(event.target)) return;
    closePanel();
}

function onWindowChange() {
    if (open.value) measure();
}

watch(query, () => {
    activeIndex.value = 0;
});

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    window.addEventListener('resize', onWindowChange);
    window.addEventListener('scroll', onWindowChange, true);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    window.removeEventListener('resize', onWindowChange);
    window.removeEventListener('scroll', onWindowChange, true);
});
</script>

<template>
    <div>
        <p v-if="!hideLabel" :id="labelId" class="label">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </p>
        <span v-else :id="labelId" class="sr-only">{{ label }}</span>

        <div class="relative">
            <button
                :id="id"
                ref="triggerRef"
                type="button"
                class="input flex h-11 w-full items-center justify-between gap-2 pr-12 text-left"
                :class="error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''"
                :disabled="disabled"
                :aria-labelledby="labelId"
                :aria-expanded="open"
                aria-haspopup="listbox"
                :aria-controls="open ? listboxId : undefined"
                :aria-describedby="describedBy"
                :aria-invalid="!!error"
                :data-autofocus="autofocus ? '' : undefined"
                @click="togglePanel"
            >
                <span :class="['truncate', !selected ? 'text-muted' : '']">
                    {{ selected?.label ?? placeholder }}
                </span>
                <i class="ph-light ph-caret-down text-sm text-muted" aria-hidden="true"></i>
            </button>

            <button
                v-if="selected && clearable && !disabled"
                type="button"
                class="absolute right-8 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-elevated hover:text-ink"
                aria-label="Hapus pilihan"
                @click.stop="clearValue"
            >
                <i class="ph-light ph-x text-xs" aria-hidden="true"></i>
            </button>
        </div>

        <p v-if="hint" :id="`${id}-hint`" class="mt-1 text-[11px] text-muted">{{ hint }}</p>
        <p v-if="error" :id="`${id}-error`" class="mt-1 text-[11px] font-medium text-danger">{{ error }}</p>

        <Teleport to="body">
            <div
                v-if="open"
                ref="dropdownRef"
                class="fixed z-[60] overflow-hidden rounded-xl border border-line/70 bg-surface shadow-[0_30px_70px_-30px_rgba(15,23,42,0.5)]"
                :style="{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }"
            >
                <div class="border-b border-line p-2">
                    <input
                        ref="searchRef"
                        v-model="query"
                        type="text"
                        class="input h-9"
                        :placeholder="searchPlaceholder"
                        role="combobox"
                        aria-autocomplete="list"
                        :aria-expanded="true"
                        :aria-controls="listboxId"
                        :aria-activedescendant="activeOptionId"
                        @keydown="onSearchKey"
                    />
                </div>

                <div
                    :id="listboxId"
                    role="listbox"
                    :aria-labelledby="labelId"
                    class="max-h-60 overflow-y-auto p-1.5"
                >
                    <button
                        v-for="(option, index) in filtered"
                        :id="`${id}-option-${index}`"
                        :key="option.value"
                        type="button"
                        role="option"
                        :aria-selected="option.value === model"
                        :class="[
                            'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors',
                            index === activeIndex ? 'bg-elevated' : 'hover:bg-elevated',
                        ]"
                        @mouseenter="activeIndex = index"
                        @click="selectOption(option)"
                    >
                        <span class="min-w-0 flex-1">
                            <span class="block truncate text-sm font-medium text-ink">{{ option.label }}</span>
                            <span v-if="option.description" class="block truncate text-[11px] text-muted">
                                {{ option.description }}
                            </span>
                        </span>
                        <i
                            v-if="option.value === model"
                            class="ph-light ph-check mt-1 text-sm text-brand"
                            aria-hidden="true"
                        ></i>
                    </button>

                    <p v-if="!filtered.length" class="px-3 py-4 text-center text-xs text-muted">
                        Tidak ada hasil.
                    </p>
                </div>
            </div>
        </Teleport>
    </div>
</template>
