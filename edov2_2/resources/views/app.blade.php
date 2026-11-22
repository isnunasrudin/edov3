<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="EDO v2 — dashboard manajemen organisasi PC IPNU & IPPNU Kabupaten Trenggalek: persuratan, data anggota, dan kaderisasi." />
        <meta name="theme-color" content="#F8FAFC" />
        <title>EDO v2 · PC IPNU &amp; IPPNU Trenggalek</title>

        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3Ccircle cx='32' cy='30' r='14' fill='none' stroke='white' stroke-width='7'/%3E%3Cpath d='M26 44h12l-6 12z' fill='white'/%3E%3C/svg%3E" />

        {{-- Terapkan tema sebelum paint untuk menghindari flash --}}
        <script>
            (function () {
                try {
                    var saved = localStorage.getItem('nu-theme');
                    var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (dark) document.documentElement.classList.add('dark');
                } catch (e) {
                    /* noop */
                }
            })();
        </script>

        <link rel="preconnect" href="https://unpkg.com" crossorigin />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/light/style.css" />

        @vite('resources/js/app.js')

        {{-- Font self-hosted dari manifest plugin bunny() --}}
        {!! Vite::fonts() !!}

        <x-inertia::head />
    </head>
    <body class="min-h-dvh font-sans text-ink antialiased">
        <x-inertia::app />
    </body>
</html>
