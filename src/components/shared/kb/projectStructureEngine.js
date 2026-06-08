/** Данные для демо "структура проекта" — режимы из статьи 4-04/1. */

export const MODES = [
  {
    id: 'single',
    label: 'Один файл',
    short: 'Скрипт',
    workspace: 'hello.py',
    summary:
      'Отдельный исходник без файла проекта: запуск через интерпретатор, без автосборки и полноценной отладки в IDE.',
    tree: [
      {
        type: 'file',
        path: 'hello.py',
        role: 'Исходный код',
        hint: 'Можно открыть в редакторе и запустить python hello.py, но зависимости и настройки сборки не описаны.',
      },
    ],
  },
  {
    id: 'folder',
    label: 'Папка',
    short: 'Рабочая область',
    workspace: 'my-api/',
    summary:
      'Каталог с кодом без .csproj / .sln: IDE определяет тип по package.json, go.mod, requirements.txt и открывает как workspace.',
    tree: [
      {
        type: 'dir',
        path: 'my-api',
        children: [
          {
            type: 'dir',
            path: 'my-api/src',
            role: 'Исходники',
            children: [
              {
                type: 'file',
                path: 'my-api/src/main.py',
                role: 'Точка входа',
                hint: 'Логика приложения; IDE находит файл по структуре каталогов.',
              },
              {
                type: 'file',
                path: 'my-api/src/routes.py',
                role: 'Маршруты API',
                hint: 'Модули без формального проекта — импорты по относительным путям.',
              },
            ],
          },
          {
            type: 'dir',
            path: 'my-api/tests',
            role: 'Тесты',
            children: [
              {
                type: 'file',
                path: 'my-api/tests/test_main.py',
                role: 'Тесты',
                hint: 'pytest или unittest — запуск из корня папки.',
              },
            ],
          },
          {
            type: 'file',
            path: 'my-api/requirements.txt',
            role: 'Зависимости',
            hint: 'Список пакетов pip — аналог манифеста без файла "проекта".',
          },
          {
            type: 'file',
            path: 'my-api/README.md',
            role: 'Документация',
            hint: 'Описание для людей; не участвует в сборке.',
          },
        ],
      },
    ],
  },
  {
    id: 'project',
    label: 'Проект',
    short: 'Один модуль',
    workspace: 'WebShop.Api/',
    summary:
      'Структурированная единица с файлом проекта: точка входа, зависимости, правила сборки и целевые платформы.',
    tree: [
      {
        type: 'dir',
        path: 'WebShop.Api',
        children: [
          {
            type: 'dir',
            path: 'WebShop.Api/src',
            role: 'Исходный код',
            children: [
              {
                type: 'file',
                path: 'WebShop.Api/src/Program.cs',
                role: 'Точка входа',
                hint: 'Main / top-level — с чего начинается выполнение; указано в .csproj.',
              },
              {
                type: 'file',
                path: 'WebShop.Api/src/Controllers/OrdersController.cs',
                role: 'HTTP API',
                hint: 'Контроллеры и бизнес-логика внутри одного проекта.',
              },
            ],
          },
          {
            type: 'dir',
            path: 'WebShop.Api/tests',
            role: 'Тесты',
            children: [
              {
                type: 'file',
                path: 'WebShop.Api/tests/OrdersTests.cs',
                role: 'Модульные тесты',
                hint: 'Отдельная цель сборки или ссылка из .csproj.',
              },
            ],
          },
          {
            type: 'dir',
            path: 'WebShop.Api/assets',
            role: 'Ресурсы',
            children: [
              {
                type: 'file',
                path: 'WebShop.Api/assets/appsettings.json',
                role: 'Конфигурация',
                hint: 'Параметры окружения, строки подключения.',
              },
            ],
          },
          {
            type: 'file',
            path: 'WebShop.Api/WebShop.Api.csproj',
            role: 'Файл проекта',
            hint: 'Зависимости NuGet, целевой framework, правила компиляции — читает MSBuild / dotnet.',
          },
        ],
      },
    ],
  },
  {
    id: 'solution',
    label: 'Решение',
    short: 'Несколько проектов',
    workspace: 'OnlineLearning.sln',
    summary:
      'Контейнер для связанных проектов: бэкенд, фронтенд, мобильное приложение. Решение не содержит кода — только ссылки и общие настройки сборки.',
    tree: [
      {
        type: 'file',
        path: 'OnlineLearning.sln',
        role: 'Файл решения',
        hint: 'Список проектов и конфигураций Debug/Release; в IDEA — аналог "рабочего места".',
      },
      {
        type: 'dir',
        path: 'Backend.Api',
        children: [
          {
            type: 'dir',
            path: 'Backend.Api/src',
            role: 'C# API',
            children: [
              {
                type: 'file',
                path: 'Backend.Api/src/Program.cs',
                role: 'Бэкенд',
                hint: 'REST или gRPC — один из проектов в решении.',
              },
            ],
          },
          {
            type: 'file',
            path: 'Backend.Api/Backend.Api.csproj',
            role: 'Проект C#',
            hint: 'Собирается отдельно; решение координирует порядок сборки.',
          },
        ],
      },
      {
        type: 'dir',
        path: 'Frontend.Web',
        children: [
          {
            type: 'dir',
            path: 'Frontend.Web/src',
            role: 'React',
            children: [
              {
                type: 'file',
                path: 'Frontend.Web/src/App.tsx',
                role: 'UI',
                hint: 'Другой стек и свой package.json — всё равно в одном решении.',
              },
            ],
          },
          {
            type: 'file',
            path: 'Frontend.Web/package.json',
            role: 'npm-манифест',
            hint: 'Зависимости JavaScript; сборка через npm/vite, не MSBuild.',
          },
        ],
      },
      {
        type: 'dir',
        path: 'Mobile.App',
        children: [
          {
            type: 'file',
            path: 'Mobile.App/MainActivity.kt',
            role: 'Android',
            hint: 'Третий проект — мобильный клиент той же системы.',
          },
          {
            type: 'file',
            path: 'Mobile.App/Mobile.App.csproj',
            role: 'Проект MAUI / Xamarin',
            hint: 'Может ссылаться на общую библиотеку из того же .sln.',
          },
        ],
      },
      {
        type: 'dir',
        path: 'Shared.Contracts',
        children: [
          {
            type: 'file',
            path: 'Shared.Contracts/Dto/OrderDto.cs',
            role: 'Общая библиотека',
            hint: 'Переиспользуемые типы для API и клиентов — типичный проект в решении.',
          },
          {
            type: 'file',
            path: 'Shared.Contracts/Shared.Contracts.csproj',
            role: 'Class library',
            hint: 'На него ссылаются Backend и Mobile.',
          },
        ],
      },
    ],
  },
];

export function getMode(id) {
  return MODES.find((m) => m.id === id) ?? MODES[0];
}

export function flattenFiles(nodes, acc = []) {
  for (const node of nodes) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenFiles(node.children, acc);
  }
  return acc;
}
