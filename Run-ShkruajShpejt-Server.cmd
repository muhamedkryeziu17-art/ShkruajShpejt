@echo off
title ShkruajShpejt Server
cd /d "%~dp0frontend"
echo Duke startuar ShkruajShpejt ne http://localhost:5173/
echo.
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
echo.
echo Serveri u ndal ose pati gabim.
echo Kontrollo mesazhet me lart.
pause
