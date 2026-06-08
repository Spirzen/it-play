/** Данные интерактивных хронологий подборки "История" */

import {SECTION_HISTORIES} from './techHistorySections';

export const EVENT_TYPES = {
  origin: {label: 'Зарождение', color: '#6366f1'},
  release: {label: 'Релиз', color: '#0ea5e9'},
  standard: {label: 'Стандарт', color: '#8b5cf6'},
  ecosystem: {label: 'Экосистема', color: '#10b981'},
  milestone: {label: 'Веха', color: '#f59e0b'},
};

export const HISTORY_COLLECTION = [
  {topic: 'network', doc: 'encyclopedia/2-system-network/2-03-set-i-internet/2', icon: '🌐'},
  {topic: 'data-structures', doc: 'encyclopedia/3-data-markup/3-02-struktury-dannyh/11', icon: '🧩'},
  {topic: 'nosql', doc: 'encyclopedia/3-data-markup/3-06-nosql/1', icon: '🗄️'},
  {topic: 'javascript', doc: 'encyclopedia/5-languages/5-01-javascript/11', icon: 'JS'},
  {topic: 'python', doc: 'encyclopedia/5-languages/5-02-python/14', icon: '🐍'},
  {topic: 'java', doc: 'encyclopedia/5-languages/5-03-java/11', icon: '☕'},
  {topic: 'dotnet', doc: 'encyclopedia/5-languages/5-04-platforma-dotnet/11', icon: '.NET'},
  {topic: 'php', doc: 'encyclopedia/5-languages/5-07-php/11', icon: 'PHP'},
  {topic: 'smalltalk', doc: 'encyclopedia/5-languages/5-08-smalltalk/2', icon: '💬'},
  {topic: 'kotlin', doc: 'encyclopedia/5-languages/5-09-kotlin/1', icon: 'Kt'},
  {topic: 'go', doc: 'encyclopedia/5-languages/5-10-go/11', icon: 'Go'},
  {topic: 'ruby', doc: 'encyclopedia/5-languages/5-11-ruby/11', icon: '💎'},
  {topic: 'groovy', doc: 'encyclopedia/5-languages/5-12-groovy/1', icon: 'Gvy'},
  {topic: 'rust', doc: 'encyclopedia/5-languages/5-13-rust/1', icon: '🦀'},
  {topic: 'swift', doc: 'encyclopedia/5-languages/5-14-swift/1', icon: '🍎'},
  {topic: 'lua', doc: 'encyclopedia/5-languages/5-15-lua-i-luau/12', icon: '🌙'},
  {topic: 'cobol', doc: 'encyclopedia/5-languages/5-16-starye-yazyki/Cobol/1', icon: 'COBOL'},
  {topic: 'fortran', doc: 'encyclopedia/5-languages/5-16-starye-yazyki/Fortran/1', icon: 'Ftn'},
  {topic: 'lisp', doc: 'encyclopedia/5-languages/5-16-starye-yazyki/Lisp/1', icon: '(λ)'},
  {topic: 'pascal', doc: 'encyclopedia/5-languages/5-16-starye-yazyki/Pascal/1', icon: 'Pascal'},
  {topic: 'vb', doc: 'encyclopedia/5-languages/5-16-starye-yazyki/visual-basic/1', icon: 'VB'},
  {topic: 'assembler', doc: 'encyclopedia/5-languages/5-16-starye-yazyki/assembler/1', icon: 'ASM'},
  {topic: 'c', doc: 'encyclopedia/5-languages/5-16-starye-yazyki/c-language/1', icon: 'C'},
  {topic: 'dev-methodologies', doc: 'encyclopedia/1-basics/1-07-nemnogo-o-proshlom/6', icon: '📋'},
  {topic: 'it-analytics', doc: 'encyclopedia/7-project/7-04-analitika/1', icon: '📊'},
  {topic: 'computing-pioneers', doc: 'encyclopedia/9-spinoff/9-01-velikie-lyudi/1', icon: '👤'},
  {topic: 'ai-history', doc: 'encyclopedia/6-ai/6-01-vvedenie-v-ii/11', icon: '🤖'},
  {topic: 'integration', doc: 'encyclopedia/2-system-network/2-09-osnovy-integratsionnogo-vzaimodeystviya/114', icon: '🔗'},
  {topic: 'it-overview', doc: 'encyclopedia/1-basics/1-07-nemnogo-o-proshlom/1', icon: '📜'},
  {topic: 'pre-it-era', doc: 'encyclopedia/1-basics/1-07-nemnogo-o-proshlom/2', icon: '🏛️'},
  {topic: 'computing-stack', doc: 'encyclopedia/1-basics/1-07-nemnogo-o-proshlom/3', icon: '🖥️'},
  {topic: 'internet', doc: 'encyclopedia/1-basics/1-07-nemnogo-o-proshlom/4', icon: '🌍'},
  {topic: 'lang-evolution', doc: 'encyclopedia/1-basics/1-07-nemnogo-o-proshlom/5', icon: '⌨️'},
];

const HISTORIES = {
  network: {
    title: 'Сетевые технологии',
    tagline: 'От телеграфа и телефона к Ethernet и глобальному интернету',
    accentColor: '#2563eb',
    events: [
      {year: 1858, title: 'Трансатлантический кабель', detail: 'Первое соединение континентов проводной линией для телеграфа Морзе.', type: 'origin'},
      {year: 1876, title: 'Телефон', detail: 'Голос как аналоговый сигнал в медном проводе; ручные, затем автоматические АТС.', type: 'origin'},
      {year: 1960, title: 'Модемы', detail: 'Преобразование цифровых данных в тоны для телефонной линии (Dial-up).', type: 'release'},
      {year: 1973, title: 'Ethernet', detail: 'Роберт Меткалф и Xerox PARC: общая шина, CSMA/CD, коаксиал.', type: 'release'},
      {year: 1983, title: 'TCP/IP', detail: 'Стандартизация стека протоколов — основа глобального интернета.', type: 'standard'},
      {year: 1990, title: 'Витая пара UTP', detail: 'Дешёвый гибкий кабель вытесняет коаксиал; основа офисных LAN.', type: 'ecosystem'},
      {year: 1995, title: 'DSL', detail: 'Цифровой канал по телефонной линии без занятия голосового разговора.', type: 'release'},
      {year: 1998, title: 'Коммутаторы', detail: 'Switch с MAC-таблицей заменяет хабы и устраняет коллизии.', type: 'milestone'},
      {year: 1990, title: 'Интранет', detail: 'Корпоративные сети с внутренними сервисами — "закрытый интернет" организации.', type: 'ecosystem'},
      {year: null, title: 'Интернет сегодня', detail: 'TCP/IP, оптика, Wi‑Fi, CDN — глобальная инфраструктура сервисов.', type: 'milestone'},
    ],
  },
  nosql: {
    title: 'NoSQL-системы',
    tagline: 'Альтернативы реляционной модели для масштаба и гибкости',
    accentColor: '#059669',
    events: [
      {year: 1998, title: 'Термин NoSQL', detail: 'Карло Строzzi называет лёгкую реляционную СУБД без SQL — раннее употребление термина.', type: 'origin'},
      {year: 2003, title: 'Memcached', detail: 'Brad Fitzpatrick (LiveJournal): распределённый кэш ключ–значение в RAM.', type: 'release'},
      {year: 2006, title: 'Bigtable', detail: 'Google публикует wide-column модель для структурированных данных в кластере.', type: 'release'},
      {year: 2007, title: 'MongoDB и Cassandra', detail: '10gen начинает MongoDB; Facebook проектирует Cassandra для Inbox.', type: 'origin'},
      {year: 2009, title: '#nosql', detail: 'Хэштег на конференции в Сан-Франциско закрепляет класс нереляционных систем.', type: 'milestone'},
      {year: 2009, title: 'Redis', detail: 'Salvatore Sanfilippo: структуры данных в памяти с персистентностью.', type: 'release'},
      {year: 2009, title: 'MongoDB 0.1', detail: 'Публичный релиз документ-ориентированной СУБД под AGPL.', type: 'release'},
      {year: 2000, title: 'Neo4j', detail: 'Основание native graph storage; Cypher и промышленный граф позже.', type: 'origin'},
      {year: 2010, title: 'Neo4j 1.0', detail: 'Графовые БД выходят на production-сценарии рекомендаций и фрода.', type: 'release'},
      {year: null, title: 'NoSQL сегодня', detail: 'Документные, KV, колоночные и графовые системы дополняют SQL в гибридных архитектурах.', type: 'milestone'},
    ],
  },
  javascript: {
    title: 'JavaScript',
    tagline: 'От скрипта в Navigator до платформы full-stack',
    accentColor: '#f7df1e',
    events: [
      {year: 1995, title: 'Mocha / LiveScript', detail: 'Брендан Айк за 10 дней — прототип в Netscape с Scheme-подобной семантикой.', type: 'origin'},
      {year: 1995, title: 'JavaScript в Navigator', detail: 'Переименование под маркетинг Java; встраивание в HTML через <script>.', type: 'release'},
      {year: 1997, title: 'ECMAScript 1', detail: 'Стандартизация ядра языка в Ecma International.', type: 'standard'},
      {year: 2005, title: 'AJAX', detail: 'Асинхронный обмен данными — основа SPA без перезагрузки страницы.', type: 'milestone'},
      {year: 2006, title: 'jQuery', detail: 'Унификация DOM и AJAX в кросс-браузерной библиотеке.', type: 'ecosystem'},
      {year: 2008, title: 'V8 и Chrome', detail: 'JIT-компиляция и DevTools меняют ожидания от клиентского кода.', type: 'release'},
      {year: 2009, title: 'Node.js', detail: 'Ryan Dahl выводит JS на сервер: event loop, npm, неблокирующий I/O.', type: 'release'},
      {year: 2015, title: 'ES2015', detail: 'Классы, модули, стрелочные функции, Promise — модернизация ядра.', type: 'standard'},
      {year: 2012, title: 'TypeScript', detail: 'Статическая типизация как слой над JS для крупных проектов.', type: 'ecosystem'},
      {year: null, title: 'JS сегодня', detail: 'Браузер, Node, Deno, WebAssembly — язык инфраструктуры веба и инструментов.', type: 'milestone'},
    ],
  },
  python: {
    title: 'Python',
    tagline: 'От хобби-проекта к языку данных и автоматизации',
    accentColor: '#3776ab',
    events: [
      {year: 1989, title: 'Прототип', detail: 'Гвидо ван Россум в CWI: отступы, списки, словари, модули.', type: 'origin'},
      {year: 1991, title: 'Python 0.9.0', detail: 'Публикация в comp.lang.python; open-source развитие.', type: 'release'},
      {year: 1994, title: 'Python 1.0', detail: 'Модули, исключения, lambda, map/filter/reduce.', type: 'release'},
      {year: 2000, title: 'Python 2.0', detail: 'List comprehensions, GC, Unicode — расширение экосистемы.', type: 'release'},
      {year: 2001, title: 'PSF', detail: 'Python Software Foundation координирует язык и сообщество.', type: 'ecosystem'},
      {year: 2008, title: 'Python 3.0', detail: 'Несовместимая чистка языка; долгая миграция с Python 2.', type: 'release'},
      {year: 2018, title: 'Конец BDFL', detail: 'Гвидо передаёт управление совету; PEP-процесс без "диктатора".', type: 'milestone'},
      {year: 2023, title: 'Python 3.12', detail: 'Улучшения perf, typing, f-строк; async ecosystem зрелый.', type: 'release'},
      {year: 2025, title: 'Free-threaded 3.14', detail: 'Опциональный режим без GIL — параллелизм на нескольких ядрах.', type: 'release'},
      {year: null, title: 'Python сегодня', detail: 'ML, DevOps, веб, автоматизация — универсальный "клей" индустрии.', type: 'milestone'},
    ],
  },
  go: {
    title: 'Go',
    tagline: 'Простота, компиляция и встроенный параллелизм',
    accentColor: '#00add8',
    events: [
      {year: 2007, title: 'Старт в Google', detail: 'Pike, Griesemer, Thompson — прототип компилятора за месяцы.', type: 'origin'},
      {year: 2009, title: 'Публичный релиз', detail: 'Открытый код под BSD; горутины, каналы, go tool.', type: 'release'},
      {year: 2012, title: 'Go 1.0', detail: 'Гарантия совместимости 1.x — доверие enterprise.', type: 'release'},
      {year: 2013, title: 'Docker', detail: 'Контейнеры на Go меняют деплой и облачную инженерию.', type: 'ecosystem'},
      {year: 2014, title: 'Kubernetes', detail: 'Оркестрация контейнеров — Go как язык инфраструктуры.', type: 'ecosystem'},
      {year: 2015, title: 'Самохостинг', detail: 'Компилятор и runtime переписаны на Go (Go 1.5).', type: 'milestone'},
      {year: 2019, title: 'Go modules', detail: 'go mod заменяет GOPATH — воспроизводимые зависимости.', type: 'ecosystem'},
      {year: 2022, title: 'Go 1.18 generics', detail: 'Ограниченные обобщения без C++-шаблонной сложности.', type: 'release'},
      {year: null, title: 'Go сегодня', detail: 'Микросервисы, CLI, облако — ниша надёжных сетевых утилит.', type: 'milestone'},
    ],
  },
  java: {
    title: 'Java',
    tagline: 'Платформа JVM и эволюция языка',
    accentColor: '#ED8B00',
    events: [
      {year: 1991, title: 'Green / Oak', detail: 'Джеймс Гослинг — встраиваемые устройства, байт-код, GC.', type: 'origin'},
      {year: 1996, title: 'Java 1.0', detail: '"Write Once, Run Anywhere"; апплеты и JDK.', type: 'release'},
      {year: 1998, title: 'Java 2', detail: 'J2SE/J2EE/J2ME, Collections, HotSpot JIT.', type: 'release'},
      {year: 2004, title: 'Java 5', detail: 'Generics, аннотации, enum, java.util.concurrent.', type: 'release'},
      {year: 2006, title: 'OpenJDK', detail: 'Открытые исходники под GPL.', type: 'ecosystem'},
      {year: 2014, title: 'Java 8', detail: 'Lambda, Stream API, java.time.', type: 'release'},
      {year: 2017, title: 'Модули Java 9', detail: 'JPMS и шестимесячный цикл релизов.', type: 'release'},
      {year: 2021, title: 'Virtual threads', detail: 'Project Loom в Java 21 — масштабируемый I/O.', type: 'release'},
      {year: null, title: 'Java сегодня', detail: 'Spring, Android (Kotlin), Kafka — зрелая JVM-экосистема.', type: 'milestone'},
    ],
  },
  dotnet: {
    title: '.NET',
    tagline: 'CLR, C# и единая кроссплатформенная платформа',
    accentColor: '#512BD4',
    events: [
      {year: 2000, title: 'C# и .NET 1.0', detail: 'Microsoft представляет managed runtime и язык C#.', type: 'release'},
      {year: 2005, title: '.NET 2.0', detail: 'Generics в CLR, LINQ готовится в языке.', type: 'release'},
      {year: 2007, title: 'LINQ', detail: 'C# 3.0: декларативные запросы к коллекциям и БД.', type: 'release'},
      {year: 2012, title: 'async/await', detail: 'C# 5 меняет модель асинхронного серверного кода.', type: 'release'},
      {year: 2014, title: 'Open source', detail: 'CoreCLR, Roslyn под MIT.', type: 'ecosystem'},
      {year: 2016, title: '.NET Core 1.0', detail: 'Linux и macOS; модульность NuGet.', type: 'release'},
      {year: 2020, title: '.NET 5', detail: 'Единый бренд вместо Framework vs Core.', type: 'release'},
      {year: 2023, title: '.NET 8 LTS', detail: 'Native AOT, minimal APIs, зрелый cloud stack.', type: 'release'},
      {year: null, title: '.NET сегодня', detail: 'ASP.NET, MAUI, Blazor — enterprise и cloud на одной платформе.', type: 'milestone'},
    ],
  },
  php: {
    title: 'PHP',
    tagline: 'Серверный скрипт для веба',
    accentColor: '#777BB4',
    events: [
      {year: 1994, title: 'PHP/FI', detail: 'Расмус Лёрдфорд — встраивание логики в HTML.', type: 'origin'},
      {year: 1998, title: 'PHP 3', detail: 'Полноценный язык, расширения, MySQL.', type: 'release'},
      {year: 2000, title: 'Zend Engine', detail: 'PHP 4: байт-код, сессии, улучшенный ООП.', type: 'release'},
      {year: 2004, title: 'PHP 5', detail: 'Объекты, PDO, исключения.', type: 'release'},
      {year: 2012, title: 'Composer', detail: 'Стандарт зависимостей и PSR-4 autoload.', type: 'ecosystem'},
      {year: 2015, title: 'PHP 7', detail: 'Скачок производительности Zend Engine 3.', type: 'release'},
      {year: 2020, title: 'PHP 8', detail: 'JIT, attributes, union types.', type: 'release'},
      {year: null, title: 'PHP сегодня', detail: 'WordPress, Laravel — доминирующая ниша веб-бэкенда.', type: 'milestone'},
    ],
  },
  smalltalk: {
    title: 'Smalltalk',
    tagline: 'Живые объекты и среда разработки',
    accentColor: '#17a2b8',
    events: [
      {year: 1971, title: 'Smalltalk-71', detail: 'PARC: сообщения между объектами, интерактивная среда.', type: 'origin'},
      {year: 1980, title: 'Smalltalk-80', detail: 'VM, браузер классов, коммерциализация.', type: 'release'},
      {year: 1996, title: 'Squeak', detail: 'Открытая реинкарнация для образования и исследований.', type: 'ecosystem'},
      {year: 2008, title: 'Pharo', detail: 'Форк с фокусом на live-инструменты и чистоту образа.', type: 'ecosystem'},
      {year: null, title: 'Наследие', detail: 'MVC, IDE, message-passing — влияние на Ruby и Objective-C.', type: 'milestone'},
    ],
  },
  kotlin: {
    title: 'Kotlin',
    tagline: 'Современный JVM-язык от JetBrains',
    accentColor: '#7F52FF',
    events: [
      {year: 2010, title: 'Старт проекта', detail: 'JetBrains: null-safety и совместимость с Java.', type: 'origin'},
      {year: 2016, title: 'Kotlin 1.0', detail: 'Стабильный API и официальная поддержка.', type: 'release'},
      {year: 2017, title: 'Android', detail: 'Google I/O: Kotlin как язык Android.', type: 'ecosystem'},
      {year: 2017, title: 'Coroutines', detail: 'Structured concurrency для async кода.', type: 'release'},
      {year: 2022, title: 'Kotlin Foundation', detail: 'Некоммерческое управление с участием индустрии.', type: 'ecosystem'},
      {year: 2024, title: 'Kotlin 2.0', detail: 'K2-компилятор, ускорение сборки.', type: 'release'},
      {year: null, title: 'Kotlin сегодня', detail: 'Android, KMM, server — альтернатива и катализатор для Java.', type: 'milestone'},
    ],
  },
  ruby: {
    title: 'Ruby',
    tagline: 'Выразительность и счастье программиста',
    accentColor: '#CC342D',
    events: [
      {year: 1993, title: 'Создание Ruby', detail: 'Юкихиро Мацумото (Matz) — чистая ООП-модель.', type: 'origin'},
      {year: 1995, title: 'Ruby 0.95', detail: 'Первый публичный релиз.', type: 'release'},
      {year: 2004, title: 'Ruby on Rails', detail: 'CoC и ActiveRecord меняют веб-разработку.', type: 'ecosystem'},
      {year: 2007, title: 'YARV', detail: 'Ruby 1.9: байт-код VM, рост производительности.', type: 'release'},
      {year: 2010, title: 'Bundler', detail: 'Gemfile.lock — воспроизводимые сборки.', type: 'ecosystem'},
      {year: 2020, title: 'Ruby 3.0', detail: 'Ractors, RBS, YJIT — стратегия 3x3.', type: 'release'},
      {year: null, title: 'Ruby сегодня', detail: 'Rails 7+, Hanami — ниша с сильной культурой кода.', type: 'milestone'},
    ],
  },
  groovy: {
    title: 'Groovy',
    tagline: 'Динамический DSL на JVM',
    accentColor: '#4298B8',
    events: [
      {year: 2003, title: 'JGG', detail: 'James Strachan: скриптовый синтаксис для Java-мира.', type: 'origin'},
      {year: 2007, title: 'Groovy 1.0', detail: 'Production-ready на JVM.', type: 'release'},
      {year: 2008, title: 'Grails', detail: 'Веб-фреймворк ускоряет RAD на JVM.', type: 'ecosystem'},
      {year: 2012, title: 'Groovy 2.0', detail: '@CompileStatic и invokedynamic.', type: 'release'},
      {year: 2019, title: 'Gradle / Jenkins', detail: 'Groovy DSL в сборках Android и CI.', type: 'ecosystem'},
      {year: 2022, title: 'Groovy 4.0', detail: 'ASM 9+, GraalVM, современный JDK.', type: 'release'},
      {year: null, title: 'Groovy сегодня', detail: 'Скрытый массовый DSL инфраструктуры JVM.', type: 'milestone'},
    ],
  },
  rust: {
    title: 'Rust',
    tagline: 'Безопасность памяти без GC',
    accentColor: '#DEA584',
    events: [
      {year: 2006, title: 'Прототип', detail: 'Graydon Hoare; с 2010 — Mozilla.', type: 'origin'},
      {year: 2015, title: 'Rust 1.0', detail: 'Ownership, borrow checker, стабильный API.', type: 'release'},
      {year: 2016, title: 'Cargo', detail: 'crates.io — стандарт пакетов.', type: 'ecosystem'},
      {year: 2018, title: 'async/await', detail: 'Стабильный async и экосистема Tokio.', type: 'release'},
      {year: 2021, title: 'Rust Foundation', detail: 'Некоммерческое управление; Linux kernel, Android.', type: 'ecosystem'},
      {year: 2023, title: 'Rust в Linux', detail: 'Драйверы и подсистемы на Rust в mainline.', type: 'milestone'},
      {year: null, title: 'Rust сегодня', detail: 'Системы, WASM, CLI — safety-by-default.', type: 'milestone'},
    ],
  },
  swift: {
    title: 'Swift',
    tagline: 'Язык Apple с открытой эволюцией',
    accentColor: '#FA7343',
    events: [
      {year: 2010, title: 'Проект Shiny', detail: 'Chris Lattner в Apple на базе LLVM.', type: 'origin'},
      {year: 2014, title: 'Swift 1.0', detail: 'WWDC: опционалы, Playgrounds, Obj-C interop.', type: 'release'},
      {year: 2019, title: 'SwiftUI', detail: 'Декларативный UI и Combine.', type: 'release'},
      {year: 2020, title: 'Open source', detail: 'Swift.org и Swift Evolution (SEPs).', type: 'ecosystem'},
      {year: 2024, title: 'Swift 6', detail: 'Strict concurrency и data-race safety.', type: 'release'},
      {year: null, title: 'Swift сегодня', detail: 'iOS/macOS, server-side, embedded.', type: 'milestone'},
    ],
  },
  lua: {
    title: 'Lua',
    tagline: 'Встраиваемый скриптовый язык',
    accentColor: '#000080',
    events: [
      {year: 1993, title: 'Lua 1.0', detail: 'PUC-Rio: таблицы, метатаблицы, лёгкий C API.', type: 'origin'},
      {year: 2006, title: 'Lua 5.1', detail: 'Версия для WoW, Nginx, игровых движков.', type: 'release'},
      {year: 2020, title: 'Lua 5.4', detail: 'Generational GC, to-be-closed.', type: 'release'},
      {year: 2016, title: 'Luau', detail: 'Roblox: типизация и оптимизации поверх Lua 5.1.', type: 'ecosystem'},
      {year: null, title: 'Lua сегодня', detail: 'Игры, конфиги, встраивание в движки.', type: 'milestone'},
    ],
  },
  cobol: {
    title: 'COBOL',
    tagline: 'Бизнес-данные на мейнфреймах',
    accentColor: '#005C84',
    events: [
      {year: 1959, title: 'CODASYL', detail: 'Требования к читаемому бизнес-языку.', type: 'origin'},
      {year: 1960, title: 'COBOL-60', detail: 'Первые компиляции на мейнфреймах.', type: 'release'},
      {year: 1968, title: 'ANSI COBOL-68', detail: 'Стандартизация иерархии данных.', type: 'standard'},
      {year: 1985, title: 'COBOL-85', detail: 'Структурное программирование, EVALUATE.', type: 'standard'},
      {year: 2014, title: 'ISO 1989:2014', detail: 'Актуализация стандарта legacy-систем.', type: 'standard'},
      {year: 2020, title: 'COBOL crisis', detail: 'Пандемия подчёркивает дефицит специалистов.', type: 'milestone'},
      {year: null, title: 'COBOL сегодня', detail: 'Банки и госсектор — эволюционное сопровождение.', type: 'milestone'},
    ],
  },
  fortran: {
    title: 'Fortran',
    tagline: 'Научные вычисления с 1950-х',
    accentColor: '#734F96',
    events: [
      {year: 1954, title: 'Formula Translation', detail: 'IBM 704 — проект языка для науки.', type: 'origin'},
      {year: 1957, title: 'FORTRAN I', detail: 'Первый компилятор с оптимизацией.', type: 'release'},
      {year: 1991, title: 'Fortran 90', detail: 'Модули, массивы, ООП-элементы.', type: 'standard'},
      {year: 2003, title: 'Fortran 2003', detail: 'Coarrays, C interop.', type: 'standard'},
      {year: 2023, title: 'Fortran 2023', detail: 'Generics, DO CONCURRENT — актуальный HPC.', type: 'release'},
      {year: null, title: 'Fortran сегодня', detail: 'Метеорология, физика, legacy HPC.', type: 'milestone'},
    ],
  },
  lisp: {
    title: 'Lisp',
    tagline: 'Символы, λ и метапрограммирование',
    accentColor: '#9B59B6',
    events: [
      {year: 1958, title: 'Lisp', detail: 'Маккарти: интерпретатор на IBM 704.', type: 'origin'},
      {year: 1975, title: 'Scheme', detail: 'Лексическая область видимости, минимализм.', type: 'release'},
      {year: 1984, title: 'Common Lisp', detail: 'CLOS, макросы, ANSI-стандарт позже.', type: 'standard'},
      {year: 2007, title: 'Clojure', detail: 'Функциональный Lisp на JVM.', type: 'ecosystem'},
      {year: null, title: 'Наследие Lisp', detail: 'REPL, макросы — влияние на Python, Ruby, Rust.', type: 'milestone'},
    ],
  },
  pascal: {
    title: 'Pascal',
    tagline: 'Обучение и переносимость',
    accentColor: '#E3A857',
    events: [
      {year: 1968, title: 'Никлаус Вирт', detail: 'ETH: строгая типизация для обучения.', type: 'origin'},
      {year: 1983, title: 'Turbo Pascal', detail: 'Borland: IDE и массовый PC.', type: 'ecosystem'},
      {year: 1994, title: 'Delphi', detail: 'RAD и VCL на Windows.', type: 'ecosystem'},
      {year: 2004, title: 'Free Pascal / Lazarus', detail: 'Open-source наследник Delphi.', type: 'ecosystem'},
      {year: null, title: 'Pascal сегодня', detail: 'Образование и embedded (Free Pascal).', type: 'milestone'},
    ],
  },
  vb: {
    title: 'Visual Basic',
    tagline: 'RAD и автоматизация Windows',
    accentColor: '#68217A',
    events: [
      {year: 1975, title: 'Altair BASIC', detail: 'Первый коммерческий продукт Microsoft.', type: 'origin'},
      {year: 1991, title: 'Visual Basic 1.0', detail: 'Формы drag-and-drop, событийная модель.', type: 'release'},
      {year: 1998, title: 'VB 6.0', detail: 'Пик Win32-разработки и COM.', type: 'release'},
      {year: 2002, title: 'VB.NET', detail: 'Переход на CLR и полноценный OOP.', type: 'release'},
      {year: null, title: 'VB сегодня', detail: 'VBA, VB.NET maintenance, Power Platform.', type: 'milestone'},
    ],
  },
  assembler: {
    title: 'Ассемблер',
    tagline: 'Мнемоники вместо машинного кода',
    accentColor: '#5C6BC0',
    events: [
      {year: 1952, title: 'Autocode', detail: 'Ранние мнемоники на EDSAC.', type: 'origin'},
      {year: 1979, title: 'Unix на C', detail: 'Ассемблер остаётся в boot и драйверах.', type: 'milestone'},
      {year: 2010, title: 'JIT codegen', detail: 'V8, LLVM MC генерируют asm из IR.', type: 'ecosystem'},
      {year: null, title: 'Ассемблер сегодня', detail: 'Ядра, embedded, hot paths с intrinsics.', type: 'milestone'},
    ],
  },
  c: {
    title: 'Язык C',
    tagline: 'Системное программирование и переносимость',
    accentColor: '#555555',
    events: [
      {year: 1971, title: 'Язык C', detail: 'Деннис Ритчи в Bell Labs.', type: 'origin'},
      {year: 1973, title: 'Unix на C', detail: 'Переносимое ядро — доказательство силы C.', type: 'release'},
      {year: 1978, title: 'K&R C', detail: 'Книга как де-факто стандарт.', type: 'standard'},
      {year: 1989, title: 'ANSI C', detail: 'C89/C90: прототипы, stdlib.', type: 'standard'},
      {year: 1999, title: 'C99', detail: 'stdint, restrict, inline.', type: 'standard'},
      {year: 2023, title: 'C23', detail: 'typeof, улучшенная безопасность.', type: 'release'},
      {year: null, title: 'C сегодня', detail: 'ОС, embedded, основа C++ и Rust interop.', type: 'milestone'},
    ],
  },
  'data-structures': {
    title: 'Структуры данных',
    tagline: 'От списков Lisp до B-деревьев и lock-free',
    accentColor: '#2E86AB',
    events: [
      {year: 1958, title: 'Связные списки', detail: 'Lisp: cons/cdr — динамические структуры.', type: 'origin'},
      {year: 1962, title: 'Стек и очередь', detail: 'Фундаментальные ADT для алгоритмов и ОС.', type: 'origin'},
      {year: 1968, title: 'AVL-деревья', detail: 'Сбалансированный поиск O(log n).', type: 'release'},
      {year: 1970, title: 'Хеш-таблицы', detail: 'O(1) в среднем случае при хорошей хеш-функции.', type: 'release'},
      {year: 1990, title: 'B-деревья и LSM', detail: 'Дисковые индексы и write-heavy хранилища.', type: 'release'},
      {year: 2010, title: 'Конкурентные структуры', detail: 'Lock-free, cache-aware layout.', type: 'ecosystem'},
      {year: null, title: 'Сегодня', detail: 'Выбор структуры по latency, объёму и персистентности.', type: 'milestone'},
    ],
  },
  'dev-methodologies': {
    title: 'Методологии разработки',
    tagline: 'От каскада к Agile и DevOps',
    accentColor: '#3498DB',
    events: [
      {year: 1959, title: 'Waterfall', detail: 'Каскадная модель для крупных госпроектов.', type: 'origin'},
      {year: 1968, title: 'Структурное программирование', detail: 'Дейкстра: отказ от goto.', type: 'milestone'},
      {year: 1986, title: 'Спиральная модель', detail: 'Барри Бём: циклы рисков и прототипов.', type: 'release'},
      {year: 2001, title: 'Agile Manifesto', detail: 'Люди, софт, сотрудничество, изменения.', type: 'milestone'},
      {year: 2010, title: 'Scrum и Kanban', detail: 'Спринты и визуализация потока.', type: 'standard'},
      {year: null, title: 'Сегодня', detail: 'Product-centric, remote-first, MLOps.', type: 'milestone'},
    ],
  },
  'it-analytics': {
    title: 'Аналитика в IT',
    tagline: 'От системного аналитика к продуктовым ролям',
    accentColor: '#0066CC',
    events: [
      {year: 1950, title: 'Системный аналитик', detail: 'Посредник между бизнесом и программистами на мейнфреймах.', type: 'origin'},
      {year: 1980, title: 'Бизнес-аналитик', detail: 'Требования, процессы, документация.', type: 'release'},
      {year: 1998, title: 'UML', detail: 'Унифицированное моделирование use case и классов.', type: 'standard'},
      {year: 2004, title: 'BPMN', detail: 'Визуальные модели бизнес-процессов.', type: 'standard'},
      {year: 2010, title: 'Product analytics', detail: 'A/B, метрики, гипотезы в продукте.', type: 'ecosystem'},
      {year: null, title: 'Сегодня', detail: 'BA, SA, PO, Data Analyst; SQL, BI, AI-assisted requirements.', type: 'milestone'},
    ],
  },
  'computing-pioneers': {
    title: 'Великие люди IT',
    tagline: 'Фигуры, сформировавшие вычисления',
    accentColor: '#2C3E50',
    events: [
      {year: 1837, title: 'Ада Лавлейс', detail: 'Первый алгоритм для аналитической машины.', type: 'origin'},
      {year: 1936, title: 'Алан Тьюринг', detail: 'Машина Тьюринга и теория вычислимости.', type: 'origin'},
      {year: 1948, title: 'Клод Шеннон', detail: 'Математическая теория связи.', type: 'origin'},
      {year: 1970, title: 'Unix и C', detail: 'Томпсон и Ритчи — переносимая ОС.', type: 'release'},
      {year: 1983, title: 'TCP/IP и WWW', detail: 'Серф, Кан, Бернерс-Ли — сеть и гипертекст.', type: 'release'},
      {year: 1991, title: 'Linux', detail: 'Торвальдс и движение open source.', type: 'ecosystem'},
      {year: 2012, title: 'Deep learning', detail: 'Hinton, LeCun, Bengio — возрождение нейросетей.', type: 'milestone'},
      {year: null, title: 'Наследие', detail: 'Идеи Turing, von Neumann, Knuth живут в современных системах.', type: 'milestone'},
    ],
  },
  'ai-history': {
    title: 'История ИИ',
    tagline: 'От перцептрона к большим языковым моделям',
    accentColor: '#8E44AD',
    events: [
      {year: 1956, title: 'Dartmouth', detail: 'Термин "искусственный интеллект".', type: 'origin'},
      {year: 1958, title: 'Перцептрон', detail: 'Розенблатт — обучаемый классификатор.', type: 'release'},
      {year: 1969, title: 'Зима ИИ', detail: 'Критика Minsky & Papert снижает финансирование.', type: 'milestone'},
      {year: 1980, title: 'Экспертные системы', detail: 'Правила и базы знаний в промышленности.', type: 'release'},
      {year: 1997, title: 'Deep Blue', detail: 'Победа над Каспаровым в шахматах.', type: 'milestone'},
      {year: 2012, title: 'AlexNet', detail: 'ImageNet возрождает глубокое обучение.', type: 'release'},
      {year: 2016, title: 'AlphaGo', detail: 'DeepMind побеждает в го.', type: 'milestone'},
      {year: 2022, title: 'ChatGPT', detail: 'Массовый доступ к LLM.', type: 'release'},
      {year: null, title: 'ИИ сегодня', detail: 'Агенты, мультимодальность, регулирование.', type: 'milestone'},
    ],
  },
  ...SECTION_HISTORIES,
  integration: {
    title: 'Интеграционные технологии',
    tagline: 'От файлового обмена к event-driven API',
    accentColor: '#16A085',
    events: [
      {year: 1980, title: 'RPC и CORBA', detail: 'Удалённые вызовы в корпоративных сетях.', type: 'origin'},
      {year: 2000, title: 'SOAP и SOA', detail: 'XML, WSDL, ESB — централизованная шина.', type: 'release'},
      {year: 2006, title: 'REST', detail: 'HTTP + JSON; stateless API как контракт.', type: 'release'},
      {year: 2010, title: 'Kafka', detail: 'Event-driven architecture и слабая связанность.', type: 'ecosystem'},
      {year: 2020, title: 'iPaaS', detail: 'Zapier, Make — интеграция без кода.', type: 'ecosystem'},
      {year: null, title: 'Сегодня', detail: 'OpenAPI, mTLS, OpenTelemetry, event mesh.', type: 'milestone'},
    ],
  },
};

export function getHistory(topicId) {
  return HISTORIES[topicId] ?? null;
}

/** События темы: плоский список или активная секция многосекционной хронологии */
export function getHistoryEvents(history, sectionId) {
  if (!history) return [];
  if (history.sections?.length) {
    const sec =
      history.sections.find((s) => s.id === sectionId) ?? history.sections[0];
    return sec.events;
  }
  return history.events ?? [];
}

export function sortEvents(events) {
  return [...events].sort((a, b) => {
    if (a.year == null && b.year == null) return 0;
    if (a.year == null) return 1;
    if (b.year == null) return -1;
    return a.year - b.year;
  });
}

export function yearSpan(events) {
  const years = events.map((e) => e.year).filter((y) => y != null);
  if (!years.length) return {min: 0, max: 1};
  return {min: Math.min(...years), max: Math.max(...years)};
}
