/** Краткие обзоры языков — по материалу "Основные языки" (1-24-osnovnye-yazyki/1) */

export const OVERVIEW_ARTICLE = '/encyclopedia/1-basics/1-24-osnovnye-yazyki/1';

/** @typedef {'programming'|'markup'|'style'|'query'|'platform'|'shell'} LangKind */

/**
 * @typedef {Object} LanguageIntro
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {number|null} year
 * @property {string} category
 * @property {LangKind} kind
 * @property {string} summary
 * @property {string[]} traits
 * @property {string[]} uses
 * @property {string[]} ecosystem
 * @property {string} [note]
 * @property {string[]} [related]
 */

/** @type {Record<string, LanguageIntro>} */
export const LANGUAGE_INTROS = {
  python: {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    year: 1991,
    category: 'Скриптовые и веб-языки',
    kind: 'programming',
    summary:
      'Высокоуровневый язык общего назначения: структура задаётся отступами, без фигурных скобок. Огромная стандартная библиотека и экосистема пакетов — от веба и автоматизации до ML и науки.',
    traits: ['Интерпретируемый', 'Динамическая типизация', 'Мультипарадигменный'],
    uses: ['веб-backend', 'анализ данных', 'машинное обучение', 'скрипты и DevOps'],
    ecosystem: ['Django', 'Flask', 'FastAPI', 'NumPy', 'pandas', 'PyTorch'],
    note: 'Лаконичный синтаксис не отменяет GIL, изменяемые значения по умолчанию и тонкости CPython.',
    related: ['ruby', 'javascript'],
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'JS',
    year: 1995,
    category: 'Скриптовые и веб-языки',
    kind: 'programming',
    summary:
      'Изначально — интерактивность в браузере; сегодня "король веба": клиент, сервер (Node.js), мобильные и встроенные среды. Гибкий синтаксис, богатая экосистема фреймворков и инструментов.',
    traits: ['Интерпретируемый + JIT', 'Динамическая типизация', 'Событийная модель'],
    uses: ['фронтенд', 'Node.js backend', 'мобильные (React Native)', 'инструменты сборки'],
    ecosystem: ['React', 'Vue', 'Angular', 'Node.js', 'npm'],
    note: 'Не связан с Java — разные языки и экосистемы, несмотря на похожее имя.',
    related: ['typescript', 'html', 'css'],
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'TS',
    year: 2012,
    category: 'Скриптовые и веб-языки',
    kind: 'programming',
    summary:
      'Надстройка Microsoft над JavaScript со статической типизацией. Комилируется в JS; в крупных проектах помогает ловить ошибки на этапе разработки.',
    traits: ['Статическая типизация', 'Компиляция в JS', 'Структурная типизация'],
    uses: ['крупные веб-приложения', 'Angular', 'NestJS', 'full-stack на Node'],
    ecosystem: ['Angular', 'NestJS', 'tsc', 'DefinitelyTyped'],
    related: ['javascript'],
  },
  php: {
    id: 'php',
    name: 'PHP',
    icon: 'PHP',
    year: 1995,
    category: 'Скриптовые и веб-языки',
    kind: 'programming',
    summary:
      'Серверный скриптовый язык веб-разработки. Работает на стороне сервера: WordPress, Wikipedia и миллионы сайтов. Современные версии — строгая типизация, ООП, асинхронность.',
    traits: ['Серверное исполнение', 'Встраивание в HTML', 'Динамическая типизация'],
    uses: ['CMS', 'веб-приложения', 'REST API', 'legacy-сайты'],
    ecosystem: ['Laravel', 'Symfony', 'WordPress', 'Composer'],
    related: ['javascript', 'sql'],
  },
  lua: {
    id: 'lua',
    name: 'Lua',
    icon: '🌙',
    year: 1993,
    category: 'Скриптовые и веб-языки',
    kind: 'programming',
    summary:
      'Лёгкий встраиваемый скриптовый язык из Бразилии. Компактность и скорость — стандарт для игровых движков и конфигурации (Nginx, Redis).',
    traits: ['Встраиваемый', 'Компактный', 'Быстрый интерпретатор'],
    uses: ['игровые скрипты', 'встроенные системы', 'конфигурация серверов'],
    ecosystem: ['Roblox', 'World of Warcraft', 'Luau', 'OpenResty'],
    related: ['python', 'javascript'],
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    icon: '💎',
    year: 1995,
    category: 'Скриптовые и веб-языки',
    kind: 'programming',
    summary:
      'Динамический язык с акцентом на удобство разработчика. Широкая популярность через Ruby on Rails — повлиял на Django, Laravel и ASP.NET MVC.',
    traits: ['Динамическая типизация', 'ООП', 'Выразительный синтаксис'],
    uses: ['веб-приложения', 'скрипты', 'прототипирование'],
    ecosystem: ['Ruby on Rails', 'Sinatra', 'Bundler'],
    related: ['python', 'php'],
  },
  bash: {
    id: 'bash',
    name: 'Bash',
    icon: '🐚',
    year: 1989,
    category: 'Скриптовые и веб-языки',
    kind: 'shell',
    summary:
      'Язык сценариев оболочки Unix: стандарт в Linux и macOS. Автоматизация файлов, процессов, деплоя и рутинного администрирования.',
    traits: ['CLI', 'Пайплайны', 'Скрипты без компиляции'],
    uses: ['DevOps', 'CI/CD', 'администрирование Linux'],
    ecosystem: ['GNU coreutils', 'ssh', 'cron'],
    related: ['powershell', 'c'],
  },
  powershell: {
    id: 'powershell',
    name: 'PowerShell',
    icon: '⚡',
    year: 2006,
    category: 'Скриптовые и веб-языки',
    kind: 'shell',
    summary:
      'Сценарный язык Microsoft: Windows, кроссплатформенный PowerShell Core. Объекты в конвейере, автоматизация AD, Azure и десктопа.',
    traits: ['Объектный конвейер', 'Кроссплатформенный', 'Интеграция с .NET'],
    uses: ['Windows-администрирование', 'Azure', 'автоматизация офиса'],
    ecosystem: ['pwsh', 'Azure CLI', 'DSC'],
    related: ['bash', 'csharp'],
  },
  html: {
    id: 'html',
    name: 'HTML',
    icon: '📄',
    year: 1991,
    category: 'Разметка и запросы',
    kind: 'markup',
    summary:
      'Язык разметки гипертекста: структура страницы — заголовки, абзацы, таблицы, формы, ссылки. Вместе с CSS и JS — основа веба; сам по себе не "программирует".',
    traits: ['Декларативная разметка', 'DOM-дерево', 'Семантические теги'],
    uses: ['веб-страницы', 'email-шаблоны', 'основа для CSS/JS'],
    ecosystem: ['WHATWG', 'accessibility', 'Web Components'],
    related: ['css', 'javascript'],
  },
  css: {
    id: 'css',
    name: 'CSS',
    icon: '🎨',
    year: 1996,
    category: 'Разметка и запросы',
    kind: 'style',
    summary:
      'Каскадные таблицы стилей: внешний вид HTML — цвета, шрифты, сетки, анимации, адаптивность. В связке с HTML и JS образует Тьюринг-полную клиентскую систему.',
    traits: ['Каскад и специфичность', 'Селекторы', 'Адаптивные макеты'],
    uses: ['вёрстка', 'UI/UX', 'анимации', 'печатные стили'],
    ecosystem: ['Flexbox', 'Grid', 'Sass', 'Tailwind'],
    related: ['html', 'javascript'],
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    icon: '🗃️',
    year: 1974,
    category: 'Разметка и запросы',
    kind: 'query',
    summary:
      'Декларативный язык структурированных запросов к реляционным БД: чтение, изменение, схема, индексы, представления. Стандарт поддерживают PostgreSQL, MySQL, Oracle, SQL Server, SQLite.',
    traits: ['Декларативный', 'Реляционная модель', 'Транзакции'],
    uses: ['аналитика', 'backend', 'отчёты', 'администрирование БД'],
    ecosystem: ['PostgreSQL', 'MySQL', 'SQLite', 'T-SQL', 'PL/pgSQL'],
    note: 'Изначально SEQUEL (1970), позже сокращено до SQL из-за торговой марки.',
    related: ['python', 'java', 'csharp'],
  },
  java: {
    id: 'java',
    name: 'Java',
    icon: '☕',
    year: 1995,
    category: 'JVM-платформа',
    kind: 'programming',
    summary:
      'ООП-язык Sun Microsystems: байт-код на JVM — "написал один раз — запускай где угодно". Стандарт корпоративной разработки, Android, big data, микросервисы.',
    traits: ['Статическая типизация', 'JVM', 'Сборка мусора'],
    uses: ['enterprise', 'Android', 'микросервисы', 'big data'],
    ecosystem: ['Spring', 'Hibernate', 'Maven', 'Kafka'],
    related: ['kotlin', 'scala', 'csharp'],
  },
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    icon: 'Kt',
    year: 2011,
    category: 'JVM-платформа',
    kind: 'programming',
    summary:
      'Современный язык JetBrains, официальный для Android. Совместим с Java, лаконичный синтаксис, безопасная работа с null, функциональные возможности.',
    traits: ['JVM / Native / JS', 'Null-safety', 'Корутины'],
    uses: ['Android', 'backend на JVM', 'мультиплатформа'],
    ecosystem: ['Android SDK', 'Ktor', 'Gradle'],
    related: ['java', 'scala'],
  },
  scala: {
    id: 'scala',
    name: 'Scala',
    icon: 'Sc',
    year: 2004,
    category: 'JVM-платформа',
    kind: 'programming',
    summary:
      'Гибрид ООП и функционального стиля на JVM. Высоконагруженные системы (Twitter, LinkedIn), обработка данных через Apache Spark.',
    traits: ['JVM', 'ФП + ООП', 'Выразительная типизация'],
    uses: ['big data', 'высоконагруженные сервисы', 'финтех'],
    ecosystem: ['Apache Spark', 'Akka', 'sbt'],
    related: ['java', 'kotlin'],
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    icon: 'C#',
    year: 2000,
    category: 'Платформа .NET',
    kind: 'programming',
    summary:
      'ООП-язык Microsoft как ответ Java: основной язык .NET — корпоративные приложения, ASP.NET, десктоп, игры на Unity. LINQ, async/await, pattern matching.',
    traits: ['Статическая типизация', '.NET CLR', 'Сборка мусора'],
    uses: ['enterprise', 'веб ASP.NET', 'Unity-игры', 'десктоп WPF/MAUI'],
    ecosystem: ['.NET', 'Entity Framework', 'Blazor', 'Unity'],
    related: ['java', 'fsharp', 'dotnet'],
  },
  dotnet: {
    id: 'dotnet',
    name: 'Платформа .NET',
    icon: '.NET',
    year: 2002,
    category: 'Платформа .NET',
    kind: 'platform',
    summary:
      'Кроссплатформенная среда Microsoft: C#, F#, VB.NET, единая BCL, ASP.NET, MAUI. Открытый runtime и SDK для Windows, Linux, macOS и облака.',
    traits: ['CLR', 'Мультиязычность', 'NuGet'],
    uses: ['веб', 'десктоп', 'облако', 'игры'],
    ecosystem: ['ASP.NET Core', 'Entity Framework', 'Azure SDK'],
    related: ['csharp', 'fsharp'],
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    icon: 'C++',
    year: 1983,
    category: 'Классические императивные',
    kind: 'programming',
    summary:
      'Расширение C: ООП, шаблоны, исключения, STL. Игровые движки, HPC, системное ПО, браузеры. Максимальный контроль — цена в сложности и ручном управлении памятью.',
    traits: ['Компилируемый', 'Нулевая стоимость абстракций', 'Шаблоны'],
    uses: ['игры', 'системное ПО', 'встраиваемые', 'финансы'],
    ecosystem: ['Unreal', 'Qt', 'STL', 'Boost'],
    related: ['c', 'rust'],
  },
  c: {
    id: 'c',
    name: 'C',
    icon: 'C',
    year: 1972,
    category: 'Классические императивные',
    kind: 'programming',
    summary:
      'Базовый системный язык Bell Labs. Ядра Windows, macOS, Linux, драйверы, компиляторы. Прямой доступ к памяти; основа для C++, Java, C# и многих других.',
    traits: ['Компилируемый', 'Низкоуровневый контроль', 'Ручное управление памятью'],
    uses: ['ОС', 'встраиваемые', 'драйверы', 'runtime других языков'],
    ecosystem: ['POSIX', 'libc', 'gcc', 'LLVM'],
    related: ['cpp', 'rust', 'assembler'],
  },
  go: {
    id: 'go',
    name: 'Go',
    icon: 'Go',
    year: 2009,
    category: 'Системные нового поколения',
    kind: 'programming',
    summary:
      'Язык Google (Grizzard, Pike, Thompson): простой синтаксис, быстрая компиляция, горутины, GC. Стандарт облачной инфраструктуры — Docker, Kubernetes, Terraform.',
    traits: ['Компилируемый', 'Горутины', 'Статическая типизация'],
    uses: ['микросервисы', 'DevOps-инструменты', 'сетевые сервисы'],
    ecosystem: ['Docker', 'Kubernetes', 'Prometheus', 'Terraform'],
    related: ['rust', 'c'],
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    year: 2010,
    category: 'Системные нового поколения',
    kind: 'programming',
    summary:
      'Системный язык Mozilla: безопасность памяти через borrow checker на этапе компиляции, без GC. ОС, браузеры, блокчейн, высокопроизводительные сервисы.',
    traits: ['Компилируемый', 'Ownership', 'Нулевая стоимость абстракций'],
    uses: ['системное ПО', 'WebAssembly', 'инфраструктура', 'встраиваемые'],
    ecosystem: ['cargo', 'tokio', 'wasm-bindgen'],
    related: ['cpp', 'c', 'zig'],
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    icon: '🍎',
    year: 2014,
    category: 'Мобильная разработка',
    kind: 'programming',
    summary:
      'Язык Apple для iOS, macOS, watchOS, tvOS. Заменил Objective-C: современный синтаксис, безопасная память, высокая производительность.',
    traits: ['Компилируемый', 'ARC', 'Protocol-oriented'],
    uses: ['iOS/macOS приложения', 'серверный Swift', 'UI (SwiftUI)'],
    ecosystem: ['Xcode', 'SwiftUI', 'UIKit'],
    related: ['kotlin', 'dart'],
  },
  dart: {
    id: 'dart',
    name: 'Dart',
    icon: '🎯',
    year: 2011,
    category: 'Мобильная разработка',
    kind: 'programming',
    summary:
      'Язык Google — основа Flutter. Один код для мобильных, веба и десктопа; компиляция в native или JS.',
    traits: ['JIT/AOT', 'Sound null safety', 'Flutter-first'],
    uses: ['кроссплатформенные приложения', 'веб (Flutter web)'],
    ecosystem: ['Flutter', 'pub.dev'],
    related: ['kotlin', 'swift', 'javascript'],
  },
  haskell: {
    id: 'haskell',
    name: 'Haskell',
    icon: 'λ',
    year: 1990,
    category: 'Функциональные',
    kind: 'programming',
    summary:
      'Чисто функциональный язык: ленивые вычисления, строгая типизация, монады. Сложен в освоении, но сильно повлиял на Scala, Rust, TypeScript и др.',
    traits: ['Чистое ФП', 'Ленивость', 'Система типов HM'],
    uses: ['компиляторы', 'финансы', 'исследования', 'формальные методы'],
    ecosystem: ['GHC', 'Cabal', 'Stack'],
    related: ['scala', 'elixir', 'ocaml'],
  },
  elixir: {
    id: 'elixir',
    name: 'Elixir',
    icon: '💧',
    year: 2011,
    category: 'Функциональные',
    kind: 'programming',
    summary:
      'Функциональный язык на виртуальной машине BEAM (Erlang). Высоконагруженные распределённые системы и веб (Phoenix).',
    traits: ['BEAM', 'Акторная модель', 'Неизменяемость'],
    uses: ['телеком', 'real-time', 'веб с низкой латентностью'],
    ecosystem: ['Phoenix', 'LiveView', 'OTP'],
    related: ['erlang', 'ruby'],
  },
  r: {
    id: 'r',
    name: 'R',
    icon: '📊',
    year: 1993,
    category: 'Статистика и наука',
    kind: 'programming',
    summary:
      'Язык для статистики и визуализации данных. Богатые пакеты (ggplot2), биоинформатика, экономика, медицинские исследования.',
    traits: ['Векторизация', 'Статистика', 'REPL-ориентированность'],
    uses: ['анализ данных', 'научные публикации', 'ML (частично)'],
    ecosystem: ['ggplot2', 'dplyr', 'CRAN', 'RStudio'],
    related: ['python', 'julia'],
  },
  julia: {
    id: 'julia',
    name: 'Julia',
    icon: '∑',
    year: 2012,
    category: 'Статистика и наука',
    kind: 'programming',
    summary:
      'Современный язык научных вычислений: скорость близка к C, синтаксис — к Python. Моделирование, физика, ML, финансы.',
    traits: ['JIT', 'Множественная диспетчеризация', 'Научные типы'],
    uses: ['численные расчёты', 'симуляции', 'исследования'],
    ecosystem: ['Pluto.jl', 'Flux.jl', 'DataFrames.jl'],
    related: ['python', 'r', 'matlab'],
  },
  zig: {
    id: 'zig',
    name: 'Zig',
    icon: '⚡',
    year: 2016,
    category: 'Системные нового поколения',
    kind: 'programming',
    summary:
      'Современный аналог C: без скрытых потоков, макросов и неявных преобразований. Кросс-компиляция C/C++ из коробки.',
    traits: ['Компилируемый', 'comptime', 'Явный контроль'],
    uses: ['системное ПО', 'замена C', 'встраиваемые'],
    ecosystem: ['zig build', 'libc interop'],
    related: ['c', 'rust', 'nim'],
  },
  nim: {
    id: 'nim',
    name: 'Nim',
    icon: '👑',
    year: 2008,
    category: 'Системные нового поколения',
    kind: 'programming',
    summary:
      'Скорость C с синтаксисом, напоминающим Python. Компиляция в C, C++ или JavaScript — производительность без потери читаемости.',
    traits: ['Компилируемый', 'Метапрограммирование', 'GC (опционально)'],
    uses: ['утилиты', 'игры', 'скрипты с нативной скоростью'],
    ecosystem: ['nimble', 'JS backend'],
    related: ['python', 'zig', 'c'],
  },
  groovy: {
    id: 'groovy',
    name: 'Groovy',
    icon: 'Gvy',
    year: 2003,
    category: 'JVM-платформа',
    kind: 'programming',
    summary:
      'Динамический язык для JVM: скрипты, Gradle, Jenkins pipeline. Синтаксис близок к Java, но с лаконичностью скриптовых языков.',
    traits: ['JVM', 'Динамическая типизация', 'Совместимость с Java'],
    uses: ['сборка (Gradle)', 'автоматизация CI', 'скрипты на JVM'],
    ecosystem: ['Gradle', 'Grails', 'Spock'],
    related: ['java', 'kotlin'],
  },
  smalltalk: {
    id: 'smalltalk',
    name: 'Smalltalk',
    icon: '💬',
    year: 1972,
    category: 'Историческая база',
    kind: 'programming',
    summary:
      'Пионер ООП и live-программирования. Всё — объекты, сообщения вместо вызовов; повлиял на Java, Objective-C, Ruby и IDE.',
    traits: ['Чистое ООП', 'Live image', 'Рефлексия'],
    uses: ['обучение ООП', 'исследования UI', 'исторический контекст'],
    ecosystem: ['Pharo', 'Squeak'],
    related: ['java', 'ruby'],
  },
  fortran: {
    id: 'fortran',
    name: 'Fortran',
    icon: 'Ftn',
    year: 1957,
    category: 'Историческая база',
    kind: 'programming',
    summary:
      'Первый высокоуровневый язык (IBM): научные и инженерные расчёты. До сих пор в физике, метеорологии и численных методах.',
    traits: ['Компилируемый', 'Массивы', 'HPC'],
    uses: ['суперкомпьютеры', 'климат-модели', 'линейная алгебра'],
    ecosystem: ['LAPACK', 'MPI', 'gfortran'],
    related: ['c', 'julia'],
  },
  lisp: {
    id: 'lisp',
    name: 'Lisp',
    icon: '(λ)',
    year: 1958,
    category: 'Историческая база',
    kind: 'programming',
    summary:
      'Один из старейших языков: динамическая типизация, рекурсия, ФП, GC, гомоиконичность. Повлиял на Clojure, Scheme, Emacs Lisp.',
    traits: ['S-выражения', 'Макросы', 'Интерактивная среда'],
    uses: ['ИИ (исторически)', 'исследования', 'Emacs'],
    ecosystem: ['Common Lisp', 'Clojure', 'SBCL'],
    related: ['clojure', 'haskell'],
  },
  cobol: {
    id: 'cobol',
    name: 'COBOL',
    icon: 'COB',
    year: 1959,
    category: 'Историческая база',
    kind: 'programming',
    summary:
      'Язык бизнес-данных: банки, транзакции, многословный синтаксис, близкий к английскому. Огромный объём legacy-кода в финансах.',
    traits: ['Императивный', 'Фиксированные форматы', 'Надёжность'],
    uses: ['банки', 'государственные системы', 'mainframe'],
    ecosystem: ['IBM z/OS', 'GnuCOBOL'],
    related: ['java', 'sql'],
  },
  pascal: {
    id: 'pascal',
    name: 'Pascal',
    icon: 'Pascal',
    year: 1970,
    category: 'Историческая база',
    kind: 'programming',
    summary:
      'Учебный язык Вирта для структурного программирования. Строгая типизация; на его основе — Delphi и Object Pascal.',
    traits: ['Структурное программирование', 'Строгая типизация'],
    uses: ['обучение', 'Delphi/Lazarus', 'legacy ПО'],
    ecosystem: ['Free Pascal', 'Lazarus', 'Delphi'],
    related: ['c', 'modula'],
  },
  vb: {
    id: 'vb',
    name: 'Visual Basic',
    icon: 'VB',
    year: 1991,
    category: 'Историческая база',
    kind: 'programming',
    summary:
      'Язык быстрой разработки под Windows и .NET. Миллионы LOB-приложений; эволюция в VB.NET на платформе .NET.',
    traits: ['RAD', 'ООП (VB.NET)', 'Интеграция с Windows'],
    uses: ['десктоп Windows', 'макросы Office', 'legacy бизнес-системы'],
    ecosystem: ['.NET', 'VBA', 'WinForms'],
    related: ['csharp', 'dotnet'],
  },
  assembler: {
    id: 'assembler',
    name: 'Ассемблер',
    icon: 'ASM',
    year: 1947,
    category: 'Низкоуровневое представление',
    kind: 'programming',
    summary:
      'Мнемоники машинных команд: одна инструкция ассемблера ≈ одна машинная. Драйверы, загрузчики, критичная по скорости логика.',
    traits: ['Привязка к ISA', 'Регистры', 'Без абстракций'],
    uses: ['ядра ОС', 'драйверы', 'bootloader', 'RE и отладка'],
    ecosystem: ['NASM', 'GAS', 'x86/ARM ISA'],
    related: ['c'],
  },
  '1c': {
    id: '1c',
    name: '1С:Предприятие',
    icon: '1С',
    year: 1991,
    category: 'Специализированные платформы',
    kind: 'platform',
    summary:
      'Российская платформа автоматизации учёта и бизнеса: встроенный язык, метаданные, конфигурации (Бухгалтерия, УТ, ERP). Среда исполнения + прикладные решения.',
    traits: ['Конфигурируемость', 'Клиент–сервер', 'Управляемые формы'],
    uses: ['бухгалтерия', 'склад', 'зарплата', 'отраслевые ERP'],
    ecosystem: ['1С:ERP', 'УТ', 'EDT', 'типовые конфигурации'],
    related: ['sql', 'csharp'],
  },
  'legacy-hub': {
    id: 'legacy-hub',
    name: 'Исторические языки',
    icon: '📜',
    year: null,
    category: 'Историческая база',
    kind: 'platform',
    summary:
      'Fortran, Lisp, COBOL, Pascal, Basic и др. заложили фундамент: структурное и ООП-программирование, типизация, бизнес-системы. Многие до сих пор в критической инфраструктуре.',
    traits: ['Legacy в продакшене', 'Влияние на современные языки'],
    uses: ['банки', 'mainframe', 'наука', 'обучение истории IT'],
    ecosystem: ['Fortran', 'COBOL', 'Lisp', 'Pascal', 'APL', 'Ada'],
    related: ['c', 'java', 'cobol'],
  },
};

export function getLanguageIntro(topic) {
  return LANGUAGE_INTROS[topic] ?? null;
}

/** Нормализация для сравнения подписи и названия */
function normalizeLabel(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[.\s:#]+/g, '');
}

/** Эмодзи или символ-значок, а не текстовая аббревиатура (JS, 1С, Kt) */
export function isDecorativeIcon(icon) {
  const t = String(icon ?? '').trim();
  if (!t) return false;
  if (t === '(λ)' || t === 'λ' || t === '∑') return true;
  // Метки с буквами/цифрами (1С, JS, C++) — не декор, даже если начинаются с цифры
  if (/[\p{L}\p{N}]/u.test(t)) return false;
  if (/^[\p{Extended_Pictographic}\p{Emoji}]/u.test(t)) return true;
  return t.length <= 3;
}

/** Короткая текстовая метка (JS, Kt, 1С, Gvy) — не дублируем рядом с полным именем */
function isTextBadge(icon) {
  const t = String(icon ?? '').trim();
  if (!t || isDecorativeIcon(t)) return false;
  return /^[\p{L}\p{N}+#.]{1,10}$/u.test(t);
}

/** Иконка повторяет название (C / C, Go / Go, 1С / 1С:Предприятие) */
export function isIconRedundant(icon, name) {
  const iRaw = String(icon ?? '').trim();
  const nRaw = String(name ?? '').trim();
  if (!iRaw) return true;
  if (isDecorativeIcon(iRaw)) return false;

  if (isTextBadge(iRaw)) return true;

  if (iRaw === nRaw) return true;
  if (iRaw.toLowerCase() === nRaw.toLowerCase()) return true;
  if (nRaw.toLowerCase().startsWith(iRaw.toLowerCase())) return true;

  const i = normalizeLabel(iRaw);
  const n = normalizeLabel(nRaw);
  if (i && n && (i === n || n.startsWith(i))) return true;

  return false;
}

/** Подпись кнопки / ссылки без дубля "Go Go" */
export function formatLanguageLabel(entry) {
  const {icon, name} = entry;
  if (!icon || isIconRedundant(icon, name)) return name;
  return `${icon} ${name}`;
}

/** Показывать ли цветной бейдж с иконкой в шапке карточки */
export function getHeaderIcon(entry) {
  const {icon, name} = entry;
  if (!icon || isIconRedundant(icon, name)) return null;
  return icon;
}

export const KIND_LABELS = {
  programming: 'Язык программирования',
  markup: 'Язык разметки',
  style: 'Язык стилей',
  query: 'Язык запросов',
  platform: 'Платформа / среда',
  shell: 'Язык сценариев оболочки',
};
