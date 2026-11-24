@echo off
title SIPEN-GURU - Aplikasi Administrasi Supervisi Guru
echo =========================================================================
echo    SIPEN-GURU - Aplikasi 15 Poin Administrasi Supervisi Akademik Guru
echo                    (Standar Kurikulum Merdeka)
echo =========================================================================
echo.
echo Sedang menyiapkan server aplikasi lokal...
echo Buka peramban Anda di: http://localhost:3000
echo.

start "" "http://localhost:3000"
call npm.cmd run dev
pause
