<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { formatDate } from '@/utils/format';

const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: Object, default: () => ({ start: '', end: '', startTime: '', endTime: '' }) },
    mode: { type: String, default: 'range' },
    withTime: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Pilih tanggal' },
    hint: { type: String, default: '' },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const trigger = ref(null);
const panel = ref(null);
const view = ref(startOfMonth(new Date()));
const selecting = ref('start');
const hovered = ref('');
const position = reactive({ top: 0, left: 0, width: 360 });
const draft = reactive({ start: '', end: '', startTime: '', endTime: '' });

const labelId = `${props.id}-label`;
const panelId = `${props.id}-panel`;
const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const isSingle = computed(() => props.mode === 'single');
const display = computed(() => {
    const start = props.modelValue?.start;
    const end = props.modelValue?.end;

    if (!start) return '';

    const startText = `${formatDate(start)}${props.withTime && props.modelValue?.startTime ? ` ${props.modelValue.startTime}` : ''}`;
    if (isSingle.value || !end) return startText;

    const endText = `${formatDate(end)}${props.withTime && props.modelValue?.endTime ? ` ${props.modelValue.endTime}` : ''}`;
    return `${startText} – ${endText}`;
});

const describedBy = computed(() => {
    const ids = [];
    if (props.hint) ids.push(`${props.id}-hint`);
    if (props.error) ids.push(`${props.id}-error`);
    return ids.length ? ids.join(' ') : undefined;
});

const monthLabel = computed(() =>
    view.value.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
);

const days = computed(() => {
    const year = view.value.getFullYear();
    const month = view.value.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - offset);
    const result = [];

    for (let index = 0; index < 42; index += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        result.push({
            iso: isoDate(date),
            day: date.getDate(),
            inMonth: date.getMonth() === month,
        });
    }

    return result;
});

const rangeEnd = computed(() => draft.end || (draft.start ? hovered.value : ''));

const canApply = computed(() =>
    isSingle.value ? !!draft.start : !!draft.start && !!draft.end,
);

function isoDate(date) {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDate(iso) {
    return iso ? new Date(`${iso}T00:00:00`) : null;
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function copyValue() {
    draft.start = props.modelValue?.start ?? '';
    draft.end = props.modelValue?.end ?? draft.start;
    draft.startTime = props.modelValue?.startTime ?? '';
    draft.endTime = props.modelValue?.endTime ?? '';
}

function measure() {
    if (!trigger.value || typeof window === 'undefined') return;

    const rect = trigger.value.getBoundingClientRect();
    const width = Math.min(380, window.innerWidth - 24);
    const height = 430;
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
    const below = rect.bottom + 8;
    const above = rect.top - height - 8;

    position.width = width;
    position.left = left;
    const fallback = Math.min(below, window.innerHeight - height - 12);
    position.top = Math.max(12, below + height > window.innerHeight - 12 && above > 12 ? above : fallback);
}

async function openPanel() {
    if (props.disabled) return;

    copyValue();
    selecting.value = draft.start && !draft.end ? 'end' : 'start';
    hovered.value = '';

    const basis = parseDate(draft.start || draft.end);
    view.value = startOfMonth(basis && !Number.isNaN(basis.getTime()) ? basis : new Date());

    measure();
    open.value = true;
    await nextTick();
    adjustPanel();
    panel.value?.focus();
}

function adjustPanel() {
    if (!panel.value || typeof window === 'undefined') return;

    const rect = panel.value.getBoundingClientRect();

    if (rect.bottom > window.innerHeight - 12) {
        position.top = Math.max(12, window.innerHeight - panel.value.offsetHeight - 12);
    }

    if (rect.right > window.innerWidth - 12) {
        position.left = Math.max(12, window.innerWidth - panel.value.offsetWidth - 12);
    }
}

function closePanel() {
    open.value = false;
    hovered.value = '';
}

function togglePanel() {
    if (open.value) closePanel();
    else openPanel();
}

function dayClick(day) {
    if (isSingle.value) {
        draft.start = day.iso;
        draft.end = day.iso;
        selecting.value = 'start';
        return;
    }

    if (!draft.start || (draft.start && draft.end)) {
        draft.start = day.iso;
        draft.end = '';
        selecting.value = 'end';
        return;
    }

    if (day.iso < draft.start) {
        draft.end = draft.start;
        draft.start = day.iso;
    } else {
        draft.end = day.iso;
    }

    selecting.value = 'start';
}

function dayClasses(day) {
    const start = draft.start;
    const end = rangeEnd.value;
    const inRange = start && end && day.iso >= start && day.iso <= end;

    return {
        'is-outside': !day.inMonth,
        'is-start': day.iso === draft.start,
        'is-end': day.iso === (isSingle.value ? draft.start : draft.end),
        'is-in-range': !isSingle.value && inRange && day.iso !== draft.start && day.iso !== draft.end,
        'is-today': day.iso === isoDate(new Date()),
    };
}

function moveMonth(step) {
    view.value = new Date(view.value.getFullYear(), view.value.getMonth() + step, 1);
}

function preset(type) {
    const today = new Date();
    const end = isoDate(today);
    let start = end;

    if (type === 'last7') {
        const date = new Date(today);
        date.setDate(date.getDate() - 6);
        start = isoDate(date);
    } else if (type === 'last30') {
        const date = new Date(today);
        date.setDate(date.getDate() - 29);
        start = isoDate(date);
    } else if (type === 'month') {
        start = isoDate(new Date(today.getFullYear(), today.getMonth(), 1));
        end = isoDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    }

    draft.start = start;
    draft.end = end;
    selecting.value = 'start';
    view.value = startOfMonth(parseDate(start));
}

function apply() {
    if (!canApply.value) return;

    emit('update:modelValue', {
        start: draft.start,
        end: isSingle.value ? draft.start : draft.end,
        startTime: draft.startTime,
        endTime: isSingle.value ? '' : draft.endTime,
    });

    closePanel();
    nextTick(() => trigger.value?.focus());
}

function clear() {
    emit('update:modelValue', { start: '', end: '', startTime: '', endTime: '' });
    closePanel();
    nextTick(() => trigger.value?.focus());
}

function cancel() {
    closePanel();
    nextTick(() => trigger.value?.focus());
}

function onDocumentClick(event) {
    if (!open.value) return;
    if (trigger.value?.contains(event.target) || panel.value?.contains(event.target)) return;
    closePanel();
}

function onKeydown(event) {
    if (event.key === 'Escape' && open.value) {
        event.preventDefault();
        closePanel();
        trigger.value?.focus();
    }
}

function onWindowChange() {
    if (open.value) measure();
}

watch(
    () => props.modelValue,
    () => {
        if (!open.value) copyValue();
    },
    { deep: true },
);

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onWindowChange);
    window.addEventListener('scroll', onWindowChange, true);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onWindowChange);
    window.removeEventListener('scroll', onWindowChange, true);
});
</script>

<template>
    <div>
        <p :id="labelId" class="label">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </p>

        <div class="relative">
            <button
                :id="id"
                ref="trigger"
                type="button"
                class="input flex min-h-11 w-full items-center justify-between gap-2 pr-10 text-left"
                :class="error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''"
                :disabled="disabled"
                :aria-labelledby="labelId"
                aria-haspopup="dialog"
                :aria-expanded="open"
                :aria-controls="open ? panelId : undefined"
                :aria-describedby="describedBy"
                :aria-invalid="!!error"
                @click="togglePanel"
            >
                <span :class="['truncate', !display ? 'text-muted' : '']">{{ display || placeholder }}</span>
                <i class="ph-light ph-calendar-blank text-base text-muted" aria-hidden="true"></i>
            </button>

            <button
                v-if="display && !disabled"
                type="button"
                class="absolute right-9 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-elevated hover:text-ink"
                :aria-label="`Hapus ${label.toLowerCase()}`"
                @click.stop="clear"
            >
                <i class="ph-light ph-x text-xs" aria-hidden="true"></i>
            </button>
        </div>

        <p v-if="hint" :id="`${id}-hint`" class="mt-1 text-[11px] text-muted">{{ hint }}</p>
        <p v-if="error" :id="`${id}-error`" class="mt-1 text-[11px] font-medium text-danger">{{ error }}</p>

        <Teleport to="body">
            <div
                v-if="open"
                :id="panelId"
                ref="panel"
                role="dialog"
                :aria-label="label"
                tabindex="-1"
                class="fixed z-[70] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-line/70 bg-surface p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.55)]"
                :style="{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }"
                @keydown.esc.prevent="closePanel"
            >
                <div class="flex items-center justify-between">
                    <button type="button" class="icon-btn-sm h-11 w-11" aria-label="Bulan sebelumnya" @click="moveMonth(-1)">
                        <i class="ph-light ph-caret-left" aria-hidden="true"></i>
                    </button>
                    <p class="text-sm font-bold capitalize" aria-live="polite">{{ monthLabel }}</p>
                    <button type="button" class="icon-btn-sm h-11 w-11" aria-label="Bulan berikutnya" @click="moveMonth(1)">
                        <i class="ph-light ph-caret-right" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="mt-3 flex flex-wrap gap-1.5">
                    <button type="button" class="chip min-h-11" @click="preset('today')">Hari ini</button>
                    <button v-if="!isSingle" type="button" class="chip min-h-11" @click="preset('last7')">7 hari</button>
                    <button v-if="!isSingle" type="button" class="chip min-h-11" @click="preset('last30')">30 hari</button>
                    <button v-if="!isSingle" type="button" class="chip min-h-11" @click="preset('month')">Bulan ini</button>
                </div>

                <div class="mt-4 grid grid-cols-7 gap-1 text-center">
                    <span v-for="day in weekdays" :key="day" class="pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{{ day }}</span>
                    <button
                        v-for="day in days"
                        :key="day.iso"
                        type="button"
                        :class="[
                            'grid h-11 cursor-pointer place-items-center rounded-lg text-xs font-semibold transition',
                            dayClasses(day),
                        ]"
                        :aria-label="formatDate(day.iso)"
                        :aria-pressed="day.iso === draft.start || day.iso === (isSingle ? draft.start : draft.end)"
                        @click="dayClick(day)"
                        @mouseenter="hovered = day.iso"
                    >
                        {{ day.day }}
                    </button>
                </div>

                <div v-if="withTime" class="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
                    <div>
                        <label :for="`${id}-start-time`" class="label">Waktu mulai</label>
                        <input :id="`${id}-start-time`" v-model="draft.startTime" type="time" class="input h-11" />
                    </div>
                    <div v-if="!isSingle">
                        <label :for="`${id}-end-time`" class="label">Waktu selesai</label>
                        <input :id="`${id}-end-time`" v-model="draft.endTime" type="time" class="input h-11" />
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-between border-t border-line pt-3">
                    <button type="button" class="btn-ghost btn-sm min-h-11" @click="clear">Bersihkan</button>
                    <div class="flex items-center gap-2">
                        <button type="button" class="btn-secondary min-h-11" @click="cancel">Batal</button>
                        <button type="button" class="btn-primary min-h-11" :disabled="!canApply" @click="apply">Terapkan</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.is-outside {
    color: rgb(var(--muted));
}

.is-in-range {
    border-radius: 0;
    background: rgb(var(--brand) / 0.12);
    color: rgb(var(--ink));
}

.is-start,
.is-end {
    background: rgb(var(--brand));
    color: rgb(var(--brand-fg));
}

.is-today:not(.is-start):not(.is-end) {
    box-shadow: inset 0 0 0 1px rgb(var(--brand) / 0.45);
}
</style>
