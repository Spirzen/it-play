/** Данные для DotNetEcosystemPlay — стек, runtime, NuGet, экосистема приложений */

export const MODES = [
  {id: 'stack', label: 'Стек платформы'},
  {id: 'runtime', label: 'Среда выполнения'},
  {id: 'packages', label: 'Пакеты и сборка'},
  {id: 'nuget', label: 'NuGet'},
  {id: 'apps', label: 'Приложения'},
];

export const STACK_LAYERS = [
  {
    id: 'dev',
    label: 'Разработка',
    short: 'IDE · SDK',
    icon: '🛠️',
    nodes: [
      {id: 'csharp', label: 'C# / F# / VB', role: 'Языки CLI'},
      {id: 'sdk', label: '.NET SDK', role: 'dotnet CLI · MSBuild'},
      {id: 'ide', label: 'VS / Rider', role: 'Отладка · шаблоны'},
    ],
  },
  {
    id: 'build',
    label: 'Сборка',
    short: 'Компиляция',
    icon: '⚙️',
    nodes: [
      {id: 'roslyn', label: 'Roslyn', role: 'Компилятор C#'},
      {id: 'project', label: '.csproj / .sln', role: 'Метаданные проекта'},
      {id: 'assembly', label: 'Сборка (.dll)', role: 'IL + метаданные'},
    ],
  },
  {
    id: 'runtime',
    label: 'Выполнение',
    short: 'CLR',
    icon: '▶️',
    nodes: [
      {id: 'host', label: 'Host / dotnet', role: 'Загрузчик'},
      {id: 'clr', label: 'CoreCLR', role: 'JIT · GC · типы'},
      {id: 'bcl', label: 'BCL', role: 'System.* библиотеки'},
    ],
  },
  {
    id: 'frameworks',
    label: 'Фреймворки',
    short: 'Прикладной слой',
    icon: '🧩',
    nodes: [
      {id: 'aspnet', label: 'ASP.NET Core', role: 'Web · API · SignalR'},
      {id: 'ef', label: 'EF Core', role: 'ORM · миграции'},
      {id: 'desktop', label: 'WPF / MAUI', role: 'UI-приложения'},
    ],
  },
  {
    id: 'os',
    label: 'Платформа',
    short: 'ОС',
    icon: '🖥️',
    nodes: [
      {id: 'pal', label: 'PAL', role: 'Кроссплатформенный слой'},
      {id: 'os', label: 'Windows · Linux · macOS', role: 'Файлы · сеть · GPU'},
    ],
  },
];

export const STACK_SCENARIOS = [
  {
    id: 'build-run',
    title: 'От кода к запуску',
    subtitle: 'Компиляция, сборка и старт приложения',
    steps: [
      {
        spotlight: ['csharp', 'sdk'],
        label: 'Пишем код и собираем',
        detail: 'dotnet build — Roslyn → IL в MyApp.dll',
      },
      {
        spotlight: ['project', 'assembly'],
        label: 'Сборка и метаданные',
        detail: 'В .dll — CIL, манифест, ссылки на зависимости',
      },
      {
        spotlight: ['host', 'clr'],
        label: 'dotnet run загружает CLR',
        detail: 'CoreCLR: загрузчик → верификация → JIT',
        packet: 'down',
      },
      {
        spotlight: ['bcl', 'aspnet'],
        label: 'BCL и фреймворк',
        detail: 'System.* + ASP.NET Core pipeline',
        packet: 'down',
      },
      {
        spotlight: ['pal', 'os'],
        label: 'Вызовы ОС',
        detail: 'Сокеты, файлы, потоки через PAL',
        packet: 'response',
      },
    ],
  },
  {
    id: 'multi-lang',
    title: 'Несколько языков — одна среда',
    subtitle: 'CLI и CTS объединяют C#, F# и VB',
    steps: [
      {
        spotlight: ['csharp'],
        label: 'Разные компиляторы',
        detail: 'csc, fsc, vbc — один формат сборок',
      },
      {
        spotlight: ['assembly', 'clr'],
        label: 'Общий IL и CLR',
        detail: 'Класс из F# вызывается из C# без потери типов',
        packet: 'down',
      },
      {
        spotlight: ['bcl'],
        label: 'Общая BCL',
        detail: 'System.Collections, IO, LINQ — для всех языков',
      },
    ],
  },
];

export const RUNTIME_NODES = [
  {id: 'load', label: 'Загрузчик сборок', role: 'Проверка метаданных и подписей'},
  {id: 'verify', label: 'Верификатор IL', role: 'Типобезопасность CIL'},
  {id: 'jit', label: 'JIT / AOT', role: 'CIL → нативный код CPU'},
  {id: 'exec', label: 'Выполнение', role: 'Потоки · async/await'},
  {id: 'heap', label: 'Управляемая куча', role: 'Объекты reference types'},
  {id: 'gc', label: 'Сборщик мусора', role: 'Gen0/1/2 · compact'},
  {id: 'bcl', label: 'BCL + NuGet DLL', role: 'Загруженные зависимости'},
  {id: 'pal', label: 'PAL / P/Invoke', role: 'Нативные библиотеки ОС'},
];

export const RUNTIME_SCENARIOS = [
  {
    id: 'jit',
    title: 'JIT при первом вызове',
    subtitle: 'Tiered compilation и кэш нативного кода',
    steps: [
      {spotlight: ['load'], label: 'Загрузка MyApp.dll', detail: 'Dependency graph из deps.json'},
      {spotlight: ['verify'], label: 'Верификация IL', detail: 'Запрет небезопасных операций'},
      {spotlight: ['jit'], label: 'JIT компилирует метод', detail: 'Tier 0 — быстрый код; Tier 1 — оптимизации'},
      {spotlight: ['exec'], label: 'Нативный код на CPU', detail: 'Повторные вызовы — из кэша JIT'},
      {spotlight: ['heap', 'gc'], label: 'Объекты в куче', detail: 'GC освобождает недостижимые объекты'},
    ],
  },
  {
    id: 'aot',
    title: 'Native AOT',
    subtitle: 'Компиляция до запуска — меньше JIT-задержек',
    steps: [
      {spotlight: ['load'], label: 'Publish с NativeAOT', detail: 'IL анализируется на этапе сборки'},
      {spotlight: ['jit'], label: 'AOT вместо JIT', detail: 'Готовый машинный код в образе'},
      {spotlight: ['exec'], label: 'Быстрый cold start', detail: 'Подходит для контейнеров и CLI'},
    ],
  },
];

export const PACKAGE_GRAPH = {
  project: {id: 'project', label: 'WebApp.csproj', type: 'project'},
  packages: [
    {id: 'aspnet', label: 'Microsoft.AspNetCore', version: '8.0.*', deps: ['extensions', 'json']},
    {id: 'ef', label: 'Microsoft.EntityFrameworkCore', version: '8.0.2', deps: ['extensions']},
    {id: 'extensions', label: 'Microsoft.Extensions.*', version: '8.0.0', deps: []},
    {id: 'json', label: 'System.Text.Json', version: '8.0.0', deps: []},
    {id: 'serilog', label: 'Serilog.AspNetCore', version: '8.0.0', deps: ['extensions']},
  ],
};

export const PACKAGE_SCENARIOS = [
  {
    id: 'add',
    title: 'dotnet add package',
    subtitle: 'Декларативная зависимость в .csproj',
    steps: [
      {highlight: ['project'], label: 'Команда в терминале', detail: 'dotnet add package Serilog.AspNetCore'},
      {highlight: ['project'], label: 'Запись PackageReference', detail: '<PackageReference Include="Serilog..." Version="8.0.0" />'},
      {highlight: ['serilog', 'extensions'], label: 'dotnet restore', detail: 'Резолвер строит граф; загрузка с nuget.org'},
      {highlight: ['project'], label: 'dotnet build', detail: 'DLL из ~/.nuget/packages → bin/Release/'},
    ],
  },
  {
    id: 'conflict',
    title: 'Разрешение версий',
    subtitle: 'Транзитивные зависимости и единая версия',
    steps: [
      {highlight: ['ef', 'aspnet'], label: 'Два пакета тянут Extensions', detail: 'NuGet выбирает совместимую версию 8.0.x'},
      {highlight: ['extensions'], label: 'Центральная версия', detail: 'PackageReference с Update или Directory.Packages.props'},
      {highlight: ['project'], label: 'Воспроизводимая сборка', detail: 'project.assets.json фиксирует дерево'},
    ],
  },
];

export const NUGET_STRUCTURE = [
  {id: 'nuspec', label: 'manifest (.nuspec)', folder: 'корень', desc: 'id, version, authors, dependencies'},
  {id: 'lib', label: 'lib/', folder: 'TFM', desc: 'net8.0/MyLib.dll — сборки по платформам'},
  {id: 'ref', label: 'ref/', folder: 'compile', desc: 'Reference assemblies для IDE'},
  {id: 'build', label: 'build/', folder: 'MSBuild', desc: '.props / .targets в пайплайн'},
  {id: 'content', label: 'contentFiles/', folder: 'проект', desc: 'Файлы в потребителя с действием compile'},
  {id: 'tools', label: 'tools/', folder: 'dev', desc: 'dotnet-утилиты; не в runtime'},
];

export const NUGET_FLOW_SCENARIOS = [
  {
    id: 'install',
    title: 'Установка пакета',
    subtitle: 'Клиент → feed → кэш → проект',
    steps: [
      {nodes: ['client'], label: 'NuGet client / dotnet restore', detail: 'Читает PackageReference из csproj'},
      {nodes: ['feed'], label: 'Запрос к feed', detail: 'nuget.org или Azure Artifacts (V3 API)'},
      {nodes: ['cache'], label: 'Глобальный кэш', detail: '~/.nuget/packages — одна копия версии'},
      {nodes: ['build'], label: 'MSBuild подключает DLL', detail: 'Только совместимые TFM из lib/'},
    ],
  },
  {
    id: 'publish',
    title: 'Публикация пакета',
    subtitle: 'dotnet pack → feed',
    steps: [
      {nodes: ['project'], label: 'dotnet pack', detail: 'Сборка + nuspec → MyLib.1.2.0.nupkg'},
      {nodes: ['feed'], label: 'dotnet nuget push', detail: 'Подпись, модерация на nuget.org'},
      {nodes: ['client'], label: 'Потребители restore', detail: 'Семантическое версионирование 1.2.0'},
    ],
  },
];

export const NUGET_FLOW_NODES = [
  {id: 'client', label: 'Клиент', role: 'CLI · VS · Rider'},
  {id: 'feed', label: 'Feed', role: 'nuget.org · private'},
  {id: 'cache', label: 'Кэш', role: 'global-packages'},
  {id: 'project', label: 'Проект', role: '.csproj · assets.json'},
  {id: 'build', label: 'Сборка', role: 'bin/ · publish/'},
];

export const APP_CATEGORIES = [
  {
    id: 'ui',
    label: 'UI и клиент',
    icon: '🖼️',
    items: [
      {id: 'wpf', name: 'WPF', stack: 'Windows · XAML', note: 'Корпоративные desktop, богатый UI'},
      {id: 'winforms', name: 'WinForms', stack: 'Windows · Win32', note: 'Быстрые внутренние утилиты'},
      {id: 'maui', name: '.NET MAUI', stack: 'Win · macOS · iOS · Android', note: 'Единый код мобильный + desktop'},
      {id: 'winui', name: 'WinUI 3', stack: 'Windows 10/11', note: 'Fluent Design, Windows App SDK'},
      {id: 'avalonia', name: 'Avalonia', stack: 'Кроссплатформа · Skia', note: 'Open-source альтернатива WPF'},
      {id: 'blazor-server', name: 'Blazor Server', stack: 'Web · SignalR', note: 'C# на сервере, UI в браузере'},
      {id: 'blazor-wasm', name: 'Blazor WASM', stack: 'WebAssembly', note: 'Клиентский runtime .NET в браузере'},
    ],
  },
  {
    id: 'server',
    label: 'Сервер и фон',
    icon: '☁️',
    items: [
      {id: 'aspnet', name: 'ASP.NET Core', stack: 'Kestrel · MVC · Minimal API', note: 'REST, gRPC, Razor Pages'},
      {id: 'worker', name: 'Worker Service', stack: 'IHostedService', note: 'Очереди, cron, мониторинг'},
      {id: 'grpc', name: 'gRPC', stack: 'HTTP/2 · Protobuf', note: 'Микросервисы, строгие контракты'},
      {id: 'aspire', name: '.NET Aspire', stack: 'App Host', note: 'Оркестрация облачной топологии'},
      {id: 'wcf', name: 'CoreWCF', stack: 'SOAP · legacy', note: 'Миграция с .NET Framework'},
    ],
  },
  {
    id: 'data',
    label: 'Данные',
    icon: '🗄️',
    items: [
      {id: 'ef', name: 'Entity Framework Core', stack: 'ORM', note: 'Миграции, LINQ, провайдеры SQL'},
      {id: 'ado', name: 'ADO.NET', stack: 'SqlConnection', note: 'Прямой SQL, DataReader'},
      {id: 'dapper', name: 'Dapper', stack: 'Micro-ORM', note: 'Лёгкий маппинг поверх ADO'},
    ],
  },
  {
    id: 'quality',
    label: 'Тесты и инструменты',
    icon: '🧪',
    items: [
      {id: 'mstest', name: 'MSTest', stack: 'xUnit-стиль MS', note: 'Интеграция с Visual Studio'},
      {id: 'nunit', name: 'NUnit', stack: 'Open source', note: 'Гибкая параметризация'},
      {id: 'playwright', name: 'Playwright + MSTest', stack: 'E2E', note: 'Автоматизация браузера на C#'},
      {id: 'vsix', name: 'VSIX / Roslyn', stack: 'Расширения IDE', note: 'Анализаторы, генераторы'},
    ],
  },
];

export const VARIANT_META = {
  platform: {
    title: 'Платформа .NET — интерактивная карта',
    subtitle: 'Стек, среда выполнения, пакеты и типы приложений',
    defaultMode: 'stack',
    footer:
      'Платформа задаёт правила компиляции, выполнения и совместимости — фреймворки (ASP.NET, MAUI) строятся поверх CLR и BCL.',
  },
  architecture: {
    title: 'Архитектура .NET',
    subtitle: 'CLI, CLR, JIT, GC и кроссплатформенный слой PAL',
    defaultMode: 'runtime',
    footer:
      'CoreCLR скрывает различия ОС через PAL; CIL остаётся переносимым, а JIT адаптирует код под процессор.',
  },
  packages: {
    title: 'Пакеты и зависимости',
    subtitle: 'PackageReference, restore и граф транзитивных пакетов',
    defaultMode: 'packages',
    footer:
      'Пакет — формат доставки; сборка — единица выполнения. Restore не копирует код в репозиторий, а фиксирует дерево в assets.json.',
  },
  nuget: {
    title: 'NuGet — поток поставки',
    subtitle: 'Структура .nupkg, feeds и интеграция с MSBuild',
    defaultMode: 'nuget',
    footer:
      'NuGet — технология и клиент; nuget.org — лишь публичный feed. Корпоративные среды добавляют приватные источники.',
  },
  ecosystem: {
    title: 'Экосистема .NET-приложений',
    subtitle: 'Шаблоны Visual Studio и прикладные фреймворки',
    defaultMode: 'apps',
    footer:
      'Выбор шаблона — выбор точки в экосистеме: UI, сервер, данные или инфраструктура качества.',
  },
};

export function getVariantMeta(variant) {
  return VARIANT_META[variant] ?? VARIANT_META.platform;
}
