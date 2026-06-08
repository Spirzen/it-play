/** Данные для CEcosystemPlay — статья 5-16-starye-yazyki/c-language/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура проекта'},
  {id: 'build', label: 'Сборка и линковка'},
  {id: 'modules', label: 'Модули и библиотеки'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'platform',
    tag: 'Платформа',
    label: 'ОС · ABI · железо',
    color: '#64748b',
    icon: '🖥',
    items: ['Linux · Windows · macOS', 'ELF · PE · Mach-O', 'x86-64 · ARM · RISC-V'],
    detail:
      'Исполняемый файл — формат ОС (ELF, PE). ABI задаёт соглашения о вызовах: как передаются аргументы, кто очищает стек. Код на С компилируется под конкретную платформу.',
  },
  {
    id: 'toolchain',
    tag: 'Toolchain',
    label: 'Компилятор и линковщик',
    color: '#1e6bb8',
    icon: '⚙',
    items: ['GCC · Clang · MSVC', 'cpp · cc1 · ld', 'strip · objdump · nm'],
    detail:
      'Цепочка: препроцессор (#include, #define) → компилятор (.c → .o) → линковщик (объекты + библиотеки → бинарник). Каждый .c — отдельная единица компиляции.',
  },
  {
    id: 'libc',
    tag: 'Стандартная библиотека',
    label: 'libc · POSIX',
    color: '#0ea5e9',
    icon: '📚',
    items: ['stdio · stdlib · string', 'malloc · free · fopen', 'unistd · pthread (POSIX)'],
    detail:
      'glibc / musl / MSVCRT — реализация ISO C и расширений POSIX. printf, qsort, socket — не в языке, а в libc. Линковка: -lc (часто неявно).',
  },
  {
    id: 'build',
    tag: 'Сборка',
    label: 'Make · CMake · Meson',
    color: '#10b981',
    icon: '🔧',
    items: ['Makefile · rules', 'CMakeLists.txt', 'pkg-config · vcpkg · Conan'],
    detail:
      'Make описывает зависимости файлов: foo.o зависит от foo.c и foo.h. CMake генерирует Makefile/Ninja. pkg-config выдаёт флаги -I и -L для libcurl, openssl.',
  },
  {
    id: 'libs',
    tag: 'Библиотеки',
    label: 'Статические и динамические',
    color: '#ec4899',
    icon: '📦',
    items: ['.a · .so · .dll', 'libcurl · OpenSSL · SDL', 'headers + import lib'],
    detail:
      'Статическая (.a): код вшит в exe. Динамическая (.so/.dll): загрузка ld.so при старте. Заголовок .h — контракт; .a/.so — реализация. -lssl -lcrypto при линковке.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код · .h / .c',
    color: '#6366f1',
    icon: '🏗',
    items: ['main.c · точка входа', 'api.h + api.c', 'src/ · include/ · tests/'],
    detail:
      '.h — объявления (интерфейс модуля), .c — определения (реализация). main() — точка входа. Модули связаны через #include и символы, разрешаемые линковщиком.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'main.c', type: 'app', x: 200, y: 22},
  {id: 'api', label: 'api.c / api.h', type: 'module', x: 70, y: 88},
  {id: 'db', label: 'db.c / db.h', type: 'module', x: 200, y: 88},
  {id: 'crypto', label: 'crypto.c (opt)', type: 'lazy', x: 330, y: 88},
  {id: 'libc', label: 'libc (glibc)', type: 'sys', x: 55, y: 168},
  {id: 'curl', label: 'libcurl', type: 'lib', x: 145, y: 168},
  {id: 'ssl', label: 'libssl · libcrypto', type: 'lib', x: 250, y: 168},
  {id: 'pthread', label: 'libpthread', type: 'lib', x: 345, y: 168},
];

export const DEP_EDGES = [
  ['main', 'api'],
  ['main', 'db'],
  ['main', 'crypto'],
  ['api', 'db'],
  ['api', 'curl'],
  ['db', 'libc'],
  ['crypto', 'ssl'],
  ['crypto', 'db'],
  ['curl', 'ssl'],
  ['curl', 'libc'],
  ['main', 'pthread'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Модуль .h/.c', stroke: '#10b981'},
  lazy: {label: 'Опциональный модуль', stroke: '#f59e0b', dash: '6 4'},
  sys: {label: 'Системная lib', stroke: '#64748b'},
  lib: {label: 'Сторонняя lib', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'daemon',
    label: 'Сервер / демон',
    toolchain: 'GCC · Make · libcurl · OpenSSL · systemd',
    tree: [
      {
        type: 'dir',
        path: 'ordersd',
        children: [
          {type: 'file', path: 'ordersd/Makefile', role: 'Сборка', hint: 'CC=gcc; ordersd: main.o api.o db.o; -lcurl -lssl -lpthread'},
          {type: 'file', path: 'ordersd/config.h', role: 'Конфиг', hint: '#define PORT 8080; include guard'},
          {
            type: 'dir',
            path: 'ordersd/src',
            children: [
              {type: 'file', path: 'ordersd/src/main.c', role: 'main()', hint: 'int main — event loop, signal handlers, graceful shutdown'},
              {type: 'file', path: 'ordersd/src/api.c', role: 'HTTP API', hint: 'Обработчики запросов; #include "api.h"'},
              {type: 'file', path: 'ordersd/src/db.c', role: 'Данные', hint: 'SQLite или PostgreSQL через libpq; malloc/free явно'},
            ],
          },
          {
            type: 'dir',
            path: 'ordersd/include',
            children: [
              {type: 'file', path: 'ordersd/include/api.h', role: 'Интерфейс', hint: 'void api_handle(int fd); — контракт для main.c'},
              {type: 'file', path: 'ordersd/include/db.h', role: 'Интерфейс', hint: 'struct order; int db_save(const struct order *);'},
            ],
          },
          {type: 'file', path: 'ordersd/tests/test_api.c', role: 'Тесты', hint: 'unity/check — линковка с api.o без main'},
        ],
      },
    ],
  },
  {
    id: 'embedded',
    label: 'Embedded / прошивка',
    toolchain: 'arm-none-eabi-gcc · linker script · HAL · без ОС',
    tree: [
      {
        type: 'dir',
        path: 'firmware',
        children: [
          {type: 'file', path: 'firmware/Makefile', role: 'Кросс-сборка', hint: 'arm-none-eabi-gcc -mcpu=cortex-m4 -T stm32f4.ld'},
          {type: 'file', path: 'firmware/stm32f4.ld', role: 'Linker script', hint: 'MEMORY { FLASH, RAM }; SECTIONS { .text > FLASH }'},
          {type: 'file', path: 'firmware/src/main.c', role: 'main()', hint: 'while(1) — прямой доступ к регистрам через volatile uint32_t *'},
          {type: 'file', path: 'firmware/src/uart.c', role: 'Драйвер', hint: 'uart_init(), uart_write — без malloc, статические буферы'},
          {type: 'file', path: 'firmware/include/uart.h', role: 'Заголовок', hint: 'Объявления HAL; include guard #ifndef UART_H'},
          {
            type: 'dir',
            path: 'firmware/drivers',
            children: [
              {type: 'file', path: 'firmware/drivers/spi_sensor.c', role: 'SPI', hint: 'Чтение датчика; указатели на MMIO'},
            ],
          },
          {type: 'file', path: 'firmware/build/firmware.elf', role: 'Артефакт', hint: 'objcopy → .bin для прошивки через OpenOCD'},
        ],
      },
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop (GTK / SDL)',
    toolchain: 'Meson · pkg-config · GTK4 или SDL2',
    tree: [
      {
        type: 'dir',
        path: 'editor-app',
        children: [
          {type: 'file', path: 'editor-app/meson.build', role: 'Meson', hint: 'executable(..., dependencies: [gtk4_dep, curl_dep])'},
          {type: 'file', path: 'editor-app/src/main.c', role: 'main()', hint: 'gtk_init(); g_application_run — callback на UI-потоке'},
          {type: 'file', path: 'editor-app/src/window.c', role: 'UI', hint: 'GtkWidget *; сигналы GTK — указатели на функции (callback)'},
          {type: 'file', path: 'editor-app/include/window.h', role: 'Заголовок', hint: 'GtkWidget *editor_window_new(void);'},
          {type: 'file', path: 'editor-app/src/net_sync.c', role: 'Сеть', hint: 'libcurl в фоновом pthread; mutex для UI'},
          {type: 'file', path: 'editor-app/resources/ui/main.ui', role: 'Glade UI', hint: 'Опционально: XML → gtk_builder'},
          {type: 'file', path: 'editor-app/build/editor-app', role: 'Бинарник', hint: 'Динамическая линковка libgtk-4.so, libcurl.so'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'preprocess',
    label: 'Препроцессор',
    cmd: 'gcc -E src/main.c -o main.i\n# или: cpp main.c main.i',
    detail:
      'Обрабатывает #include, #define, #ifdef. Подставляет содержимое stdio.h, api.h. Результат — один текстовый файл без директив #.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: 'gcc -c -Wall -O2 src/main.c -o main.o\ngcc -c src/api.c -o api.o\ngcc -c src/db.c -o db.o',
    detail:
      'Каждый .c компилируется отдельно в объектный файл (.o). Символы extern остаются "неразрешёнными" до линковки. Изменили api.c — пересобирается только api.o.',
  },
  {
    id: 'archive',
    label: 'Статическая lib',
    cmd: 'ar rcs libapi.a api.o db.o\n# или: gcc -c ... && ar rcs libapi.a *.o',
    detail:
      'ar упаковывает .o в .a. Другие проекты линкуют: gcc app.o -L. -lapi. Код библиотеки копируется в exe — нет зависимости от .so при запуске.',
  },
  {
    id: 'link-static',
    label: 'Статическая линковка',
    cmd: 'gcc -o ordersd main.o api.o db.o -static -lcurl -lssl -lpthread',
    detail:
      'ld объединяет .o и .a; разрешает символы (main → api_handle). -static тянет libc.a внутрь — один автономный бинарник, но больше размер.',
  },
  {
    id: 'link-dynamic',
    label: 'Динамическая линковка',
    cmd: 'gcc -o ordersd main.o api.o db.o -lcurl -lssl -lpthread\nldd ./ordersd  # проверка .so',
    detail:
      'Линковщик записывает зависимости от libcurl.so.3, libssl.so. При запуске ld-linux загружает .so. Обновление libssl — без пересборки exe (если ABI совместим).',
  },
  {
    id: 'install',
    label: 'Установка',
    cmd: 'make install PREFIX=/usr/local\n# cmake --install build --prefix /opt/ordersd',
    detail:
      'Копирование бинарника, заголовков, .so в системные пути. pkg-config файл (.pc) для потребителей: Cflags и Libs.',
  },
];

export const MODULE_MODELS = [
  {
    id: 'single',
    label: 'Один файл',
    era: 'Учебник · утилита',
    color: '#1e6bb8',
    syntax: `/* main.c — всё в одном */
#include <stdio.h>

int add(int a, int b) { return a + b; }

int main(void) {
    printf("%d\\n", add(2, 3));
    return 0;
}`,
    traits: ['Нет разделения .h/.c', 'gcc main.c -o app', 'Быстрый старт, сложно масштабировать'],
    tools: 'gcc · clang',
    use: 'Hello World, скрипты на одной странице',
  },
  {
    id: 'multi',
    label: 'Модули .h + .c',
    era: 'Классика С',
    color: '#10b981',
    syntax: `/* api.h — интерфейс */
#ifndef API_H
#define API_H
int api_compute(int x);
#endif

/* api.c — реализация */
#include "api.h"
int api_compute(int x) { return x * 2; }

/* main.c */
#include "api.h"
int main(void) { return api_compute(21); }`,
    traits: ['Include guard в .h', 'Один .c = одна единица компиляции', 'Явный граф #include'],
    tools: 'gcc -c · make',
    use: 'Драйверы, ядро Linux, большинство C-проектов',
  },
  {
    id: 'static-lib',
    label: 'Статическая библиотека',
    era: 'Переиспользование',
    color: '#8b5cf6',
    syntax: `/* Сборка библиотеки */
gcc -c util.c -o util.o
ar rcs libutil.a util.o

/* Потребитель */
gcc -c app.c -o app.o
gcc -o app app.o -L./lib -lutil`,
    traits: ['libfoo.a — архив .o', 'Код в exe, нет .so при деплое', '-lfoo ищет libfoo.a / libfoo.so'],
    tools: 'ar · nm · ranlib',
    use: 'Внутренние SDK, embedded без dynamic loader',
  },
  {
    id: 'shared-lib',
    label: 'Динамическая библиотека',
    era: 'Плагины · ОС',
    color: '#ec4899',
    syntax: `/* Сборка .so */
gcc -shared -fPIC util.c -o libutil.so

/* Линковка приложения */
gcc -o app main.c -L. -lutil
export LD_LIBRARY_PATH=.

/* Windows: .dll + .lib import library */`,
    traits: ['-fPIC для position-independent code', 'Несколько процессов — одна копия в RAM', 'Версионирование .so (libfoo.so.1)'],
    tools: 'ldd · dlopen · GetProcAddress',
    use: 'libcurl, GTK, плагины nginx/PostgreSQL',
  },
];

export function flattenArchFiles(tree, acc = []) {
  for (const node of tree) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenArchFiles(node.children, acc);
  }
  return acc;
}

export function getArchPreset(id) {
  return ARCH_PRESETS.find((p) => p.id === id) ?? ARCH_PRESETS[0];
}

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasCrypto = enabledNodeIds.has('crypto');
  const libCount = DEP_NODES.filter(
    (n) => (n.type === 'lib' || n.type === 'sys') && enabledNodeIds.has(n.id),
  ).length;
  const linkFlags = [];
  if (enabledNodeIds.has('curl')) linkFlags.push('-lcurl');
  if (enabledNodeIds.has('ssl')) linkFlags.push('-lssl -lcrypto');
  if (enabledNodeIds.has('pthread')) linkFlags.push('-lpthread');
  const artifacts = hasCrypto
    ? [`ordersd (~850 KB)`, `линковка: ${linkFlags.join(' ') || '-lc'}`, `${libCount} системных/сторонних lib`]
    : [`ordersd (~620 KB)`, 'без crypto.c', `-lcurl -lpthread`, `${libCount - 1} lib`];
  return {artifacts, hasCrypto, libCount, linkFlags};
}
