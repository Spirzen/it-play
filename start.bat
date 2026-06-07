@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js не найден. Установите Node.js 20+ с https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo npm install...
  call npm install
  if errorlevel 1 pause & exit /b 1
)

echo IT Play — http://localhost:4322
call npm run dev
pause
