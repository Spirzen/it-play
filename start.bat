@echo off
setlocal
chcp 65001 >nul 2>&1
cd /d "%~dp0"

title IT Play — dev-сервер

where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ОШИБКА] Node.js не найден в PATH.
    echo Установите Node.js 20 LTS или новее: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo.
    echo [ОШИБКА] package.json не найден. Запустите start.bat из корня репозитория.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo.
    echo Зависимости не установлены. Выполняю npm install...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ОШИБКА] npm install завершился с ошибкой.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   IT Play — локальный dev-сервер
echo ========================================
echo   URL:  http://localhost:4322/
echo   Остановка: Ctrl+C
echo   После остановки окно останется открытым.
echo.

call npm run dev

echo.
echo Dev-сервер остановлен.
pause
endlocal
