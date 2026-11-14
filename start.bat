@echo off
title papercup Blog
cd /d "%~dp0"
echo Starting Backend Server on port 5005...
start /b node server/index.js
echo Starting papercup on http://localhost:5173 ...
timeout /t 2 >nul
cd client
call npm run dev
pause
