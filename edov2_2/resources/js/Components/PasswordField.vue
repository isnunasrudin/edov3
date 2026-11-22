<script setup>
import { computed, ref } from 'vue';

const model = defineModel({ type: String, default: '' });

const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    error: { type: String, default: '' },
    hint: { type: String, default: '' },
    autocomplete: { type: String, default: 'current-password' },
    placeholder: { type: String, default: '' },
});

const show = ref(false);
const caps = ref(false);

const type = computed(() => (show.value ? 'text' : 'password'));

const describedBy = computed(() => {
    const ids = [];
    if (props.hint) ids.push(`${props.id}-hint`);
    if (props.error) ids.push(`${props.id}-error`);
    return ids.length ? ids.join(' ') : undefined;
});

function checkCaps(event) {
    caps.value = event.getModifierState?.('CapsLock') ?? false;
}
</script>

<template>
    <div>
        <div class="flex items-center justify-between gap-2">
            <label :for="id" class="label">
                {{ label }} <span class="text-danger">*</span>
            </label>
            <slot name="action" />
        </div>

        <div class="relative">
            <i
                class="ph-light ph-lock-simple pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-muted"
                aria-hidden="true"
            ></i>

            <input
                :id="id"
                v-model="model"
                :type="type"
                :autocomplete="autocomplete"
                :placeholder="placeholder"
                :aria-invalid="!!error"
                :aria-describedby="describedBy"
                :class="[
                    'input h-11 pl-10 pr-12',
                    error ? 'border-danger focus:border-danger focus:ring-danger/20' : '',
                ]"
                @keydown="checkCaps"
                @keyup="checkCaps"
                @blur="caps = false"
            />

            <button
                type="button"
                class="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted transition duration-500 hover:bg-elevated hover:text-ink"
                :aria-label="show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                :aria-pressed="show"
                @click="show = !show"
            >
                <i :class="['ph-light text-lg', show ? 'ph-eye-slash' : 'ph-eye']" aria-hidden="true"></i>
            </button>
        </div>

        <p v-if="caps" class="mt-1 text-[11px] font-medium text-accent" aria-live="polite">
            Caps Lock aktif
        </p>
        <p v-if="hint" :id="`${id}-hint`" class="mt-1 text-[11px] text-muted">{{ hint }}</p>
        <p v-if="error" :id="`${id}-error`" class="mt-1 text-[11px] font-medium text-danger">
            {{ error }}
        </p>
    </div>
</template>
