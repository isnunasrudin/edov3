import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import inertia from '@inertiajs/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.js'],
            refresh: true,
            fonts: [
                bunny('Plus Jakarta Sans', {
                    weights: [300, 400, 500, 600, 700, 800],
                    preload: [{ weight: 400 }, { weight: 600 }, { weight: 700 }],
                    optimizedFallbacks: false,
                }),
                bunny('JetBrains Mono', {
                    weights: [400, 500, 600],
                    preload: [{ weight: 400 }],
                    optimizedFallbacks: false,
                }),
            ],
        }),
        tailwindcss(),
        vue(),
        inertia({ ssr: false }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
