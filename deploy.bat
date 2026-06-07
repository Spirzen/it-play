@chcp 65001 >nul
@echo off
setlocal
cd /d "%~dp0"

:: Настройки
set REPO_URL=https://github.com/Spirzen/it-play.git
set BRANCH=gh-pages
set COMMIT_MSG=Deploy to GitHub Pages: %date% %time%
set IT_PLAY_SITE=https://play.spirzen.ru
set IT_PLAY_BASE=/

where node >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Node.js не найден в PATH.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo [ОШИБКА] package.json не найден. Запустите deploy.bat из корня репозитория.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Зависимости не установлены. Выполняю npm install...
    call npm install
    if errorlevel 1 (
        echo [ОШИБКА] npm install завершился с ошибкой.
        pause
        exit /b 1
    )
)

:: Шаг 1: Сборка проекта
echo [1/5] Выполняю сборку проекта...
call npm run build
if %errorlevel% neq 0 (
    echo Ошибка при выполнении сборки.
    pause
    exit /b %errorlevel%
)

:: Шаг 2: Переход в папку dist
cd dist
if %errorlevel% neq 0 (
    echo Ошибка: не удалось перейти в папку dist.
    pause
    exit /b %errorlevel%
)

:: Шаг 3: Инициализация Git
echo [2/5] Инициализирую Git репозиторий...
git init

:: Шаг 4: Добавление удалённого репозитория
echo [3/5] Добавляю удалённый репозиторий...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

:: Шаг 5: Переключение на ветку gh-pages
echo [4/5] Переключаюсь на ветку %BRANCH%...
git checkout -b %BRANCH%

:: Шаг 6: Добавление всех файлов
git add .

:: Шаг 7: Настройка пользователя Git (локально, только в dist/)
git config user.name "Spirzen"
git config user.email "tim.tagirov@mail.ru"

:: Шаг 8: Фиксация изменений
echo [5/5] Выполняю коммит...
git commit -m "%COMMIT_MSG%"

:: Шаг 9: Принудительная отправка в gh-pages
echo Отправляю изменения в ветку %BRANCH%...
git push --force origin %BRANCH%

:: Завершение
if %errorlevel% equ 0 (
    echo.
    echo Деплой успешно завершён: https://play.spirzen.ru/
) else (
    echo Ошибка при отправке в GitHub.
)

cd ..
pause

endlocal
