@echo off
title WealthLens Startup
color 0A

echo ========================================
echo       WealthLens AI Financial Assistant
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "WealthLens Backend" cmd /k "cd /d %~dp0 && echo [Backend] Starting server on http://localhost:8000 && python start_server.py"

echo.
echo [2/2] Starting Frontend Development Server...
start "WealthLens Frontend" cmd /k "cd /d %~dp0\..\Frontend && echo [Frontend] Installing dependencies... && npm install && echo [Frontend] Starting Expo development server... && npx expo start"

echo.
echo ========================================
echo [Status] Both services are starting...
echo - Backend: http://localhost:8000
echo - Frontend: Expo development server (scan QR code with Expo Go app)
echo.
echo Note: Make sure you have Python 3.8+ and Node.js 16+ installed.
echo ========================================
echo.
echo This window can be closed after services have started.
timeout /t 5 >nul
