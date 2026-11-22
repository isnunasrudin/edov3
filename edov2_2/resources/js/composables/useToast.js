import { reactive } from 'vue';

const items = reactive([]);
let sequence = 0;

export function showToast(message, kind = 'success') {
    const id = ++sequence;
    items.push({ id, message, kind });

    setTimeout(() => dismissToast(id), 3600);
}

export function dismissToast(id) {
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) items.splice(index, 1);
}

export function useToast() {
    return { items, showToast, dismissToast };
}
