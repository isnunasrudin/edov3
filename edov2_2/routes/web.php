<?php

use Illuminate\Support\Facades\Route;

// Public
Route::inertia('/', 'Public/Home')->name('home');
Route::inertia('/statistik/pimpinan', 'Public/StatistikPimpinan')->name('statistik.pimpinan');

// Auth
Route::inertia('/login', 'Auth/Login')->name('login');
Route::inertia('/register', 'Auth/Register')->name('register');
Route::inertia('/reset-pass', 'Auth/ResetPassword')->name('password.request');

// Dashboard
Route::inertia('/dashboard', 'Dashboard/Ringkasan')->name('dashboard');
Route::inertia('/dashboard/persuratan', 'Dashboard/Persuratan')->name('persuratan');
Route::inertia('/dashboard/anggota', 'Dashboard/Anggota')->name('anggota');
Route::inertia('/dashboard/anggota/{id}', 'Dashboard/AnggotaDetail')->name('anggota.detail');
Route::inertia('/dashboard/pimpinan', 'Dashboard/Pimpinan')->name('pimpinan');
Route::inertia('/dashboard/pimpinan/{id}', 'Dashboard/PimpinanDetail')->name('pimpinan.detail');
Route::inertia('/dashboard/kaderisasi', 'Dashboard/Kaderisasi')->name('kaderisasi');
Route::inertia('/dashboard/kaderisasi/{id}', 'Dashboard/KaderisasiDetail')->name('kaderisasi.detail');
Route::inertia('/dashboard/impersonate', 'Dashboard/Impersonate')->name('impersonate');
Route::inertia('/dashboard/sinkronisasi', 'Dashboard/Sinkronisasi')->name('sinkronisasi');
Route::inertia('/dashboard/kta', 'Dashboard/Kta')->name('kta');
Route::inertia('/dashboard/jenis-jabatan', 'Dashboard/JenisJabatan')->name('jenis-jabatan');
Route::inertia('/dashboard/alamat', 'Dashboard/Alamat')->name('alamat');
