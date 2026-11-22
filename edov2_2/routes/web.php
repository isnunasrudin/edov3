<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/login', 'Auth/Login')->name('login');
Route::inertia('/', 'Dashboard/Ringkasan')->name('dashboard');
Route::inertia('/persuratan', 'Dashboard/Persuratan')->name('persuratan');
Route::inertia('/anggota', 'Dashboard/Anggota')->name('anggota');
Route::inertia('/pimpinan', 'Dashboard/Pimpinan')->name('pimpinan');
Route::inertia('/kaderisasi', 'Dashboard/Kaderisasi')->name('kaderisasi');
