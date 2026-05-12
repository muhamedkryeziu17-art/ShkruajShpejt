@echo off
cd /d "%~dp0frontend"
start "ShkruajShpejt Server" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort"
timeout /t 5 /nobreak >nul
start "" "http://localhost:5173/"
