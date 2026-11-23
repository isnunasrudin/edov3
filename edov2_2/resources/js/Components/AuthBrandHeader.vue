<script setup>
import { Link } from '@inertiajs/vue3';

const logo = '/images/edo.png';
</script>

<template>
    <div class="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-2xl bg-white/95 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.65)]">
                <img :src="logo" alt="" aria-hidden="true" class="h-7 w-auto" />
            </span>
            <span>
                <span class="block text-sm font-extrabold leading-none tracking-tight text-white">
                    EDO<span class="ml-0.5 align-super text-[9px] font-bold text-sky-300">v2</span>
                </span>
                <span class="mt-1 block text-[10px] text-white/55">PC IPNU &amp; IPPNU Trenggalek</span>
            </span>
        </Link>

    </div>
</template>
