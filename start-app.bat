@echo off
title Coco & Chiku Couple App
echo =======================================================
echo          Coco & Chiku - Romantic Couple App
echo =======================================================
echo.
echo Starting application server...
cd /d "%~dp0"
start http://localhost:5000
npm start
pause
