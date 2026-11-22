import '../css/app.css';
import { createInertiaApp } from '@inertiajs/vue3';

/**
 * Scroll reveal directive.
 * Menambahkan `data-reveal` sebelum elemen masuk DOM agar tidak ada flash,
 * lalu mengamati dengan IntersectionObserver. Stagger 55ms per sibling.
 */
const reveal = {
    created(el) {
        el.setAttribute('data-reveal', '');
    },
    mounted(el) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            el.classList.add('is-in');
            return;
        }

        const siblings = Array.from(el.parentElement?.children ?? []).filter((node) =>
            node.hasAttribute('data-reveal'),
        );
        const index = siblings.indexOf(el);
        el.style.transitionDelay = index > 0 ? `${Math.min(index * 55, 330)}ms` : '0ms';

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.classList.add('is-in');
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -48px 0px' },
        );

        observer.observe(el);
        el.__revealObserver = observer;
    },
    unmounted(el) {
        el.__revealObserver?.disconnect();
        delete el.__revealObserver;
    },
};

createInertiaApp({
    progress: { color: '#2563EB' },
    withApp(app) {
        app.directive('reveal', reveal);
    },
});
