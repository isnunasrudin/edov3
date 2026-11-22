import { onMounted, ref } from 'vue';

const isDark = ref(false);

export function useTheme() {
    function apply(dark, persist = true) {
        isDark.value = dark;
        document.documentElement.classList.toggle('dark', dark);

        if (persist) {
            try {
                localStorage.setItem('nu-theme', dark ? 'dark' : 'light');
            } catch {
                /* noop */
            }
        }
    }

    function toggle() {
        apply(!isDark.value);
    }

    onMounted(() => {
        isDark.value = document.documentElement.classList.contains('dark');
    });

    return { isDark, apply, toggle };
}
