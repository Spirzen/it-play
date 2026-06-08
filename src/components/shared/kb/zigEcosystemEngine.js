/** Данные для ZigEcosystemPlay — статья 5-20-zig/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и кросс-компиляция'},
  {id: 'modules', label: 'Пакеты и модули'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'targets',
    tag: 'Цели',
    label: 'Платформы · ABI',
    color: '#64748b',
    icon: '🖥',
    items: ['x86_64 · aarch64 · wasm32', 'Linux · Windows · macOS', 'UEFI · freestanding · bare metal'],
    detail:
      'Один компилятор собирает под десятки target без установки SDK. zig build -Dtarget=… подставляет libc и линковщик из дистрибутива zig.',
  },
  {
    id: 'toolchain',
    tag: 'Toolchain',
    label: 'zig · LLVM · линковщик',
    color: '#f7a41d',
    icon: '⚙',
    items: ['zig build · zig run', 'zig cc · @cImport', 'comptime · error union'],
    detail:
      'Исполняемый zig — компилятор, линковщик и менеджер пакетов в одном файле. C-код компилируется тем же toolchain; Zig-функции экспортируются в C через export.',
  },
  {
    id: 'stdlib',
    tag: 'std',
    label: 'Стандартная библиотека',
    color: '#eab308',
    icon: '📚',
    items: ['std.heap · ArenaAllocator', 'std.net · std.fs · std.Thread', 'std.json · std.http'],
    detail:
      'std написан на Zig, без внешних lib. Аллокатор передаётся явно. comptime и @typeInfo — метапрограммирование без макросов. В ReleaseFast часть runtime-проверок отключается.',
  },
  {
    id: 'buildsys',
    tag: 'Сборка',
    label: 'build.zig · build.zig.zon',
    color: '#10b981',
    icon: '🔧',
    items: ['addExecutable · addLibrary', 'zig fetch · dependencies', 'build steps · install'],
    detail:
      'build.zig — обычная Zig-программа: b.addExecutable, linkSystemLibrary, addIncludePath. build.zig.zon фиксирует URL/hash зависимостей. Подпроекты — path или git.',
  },
  {
    id: 'ecosystem',
    tag: 'Экосистема',
    label: 'Пакеты · C · игры',
    color: '#06b6d4',
    icon: '📦',
    items: ['zap · httpz · mach', 'zig-sqlite · bearlib', 'TigerBeetle-style libs'],
    detail:
      'Зависимости — исходники в vendor/ или zig fetch. @cImport("openssl/ssl.h") подключает C без обёрток. Фреймворки (zap, mach) — отдельные репозитории с собственным build.zig.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш проект',
    color: '#6366f1',
    icon: '🏗',
    items: ['src/main.zig', '@import("routes")', 'build.zig · src/root.zig', 'tests в .zig файлах'],
    detail:
      'Точка входа pub fn main() !void. Модули — файлы и pub const в одном пакете. Тесты test "name" {} рядом с кодом; zig build test гоняет всё дерево.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'src/main.zig', type: 'app', x: 200, y: 22},
  {id: 'http', label: 'http/', type: 'module', x: 70, y: 88},
  {id: 'domain', label: 'domain/', type: 'module', x: 200, y: 88},
  {id: 'comptime_job', label: 'build/gen.zig', type: 'lazy', x: 330, y: 88},
  {id: 'stdhttp', label: 'std.http', type: 'std', x: 55, y: 168},
  {id: 'zap', label: 'zap (dep)', type: 'pkg', x: 145, y: 168},
  {id: 'sqlite', label: 'zig-sqlite', type: 'pkg', x: 250, y: 168},
  {id: 'cssl', label: '@cImport ssl', type: 'c', x: 345, y: 168},
];

export const DEP_EDGES = [
  ['main', 'http'],
  ['main', 'domain'],
  ['main', 'comptime_job'],
  ['http', 'stdhttp'],
  ['http', 'zap'],
  ['http', 'domain'],
  ['domain', 'sqlite'],
  ['domain', 'cssl'],
  ['comptime_job', 'domain'],
  ['comptime_job', 'sqlite'],
  ['main', 'stdhttp'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Модуль src/', stroke: '#10b981'},
  lazy: {label: 'comptime / build step', stroke: '#f59e0b', dash: '6 4'},
  std: {label: 'std', stroke: '#eab308'},
  pkg: {label: 'build.zig.zon', stroke: '#06b6d4'},
  c: {label: 'C через @cImport', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'http-server',
    label: 'HTTP-сервер',
    toolchain: 'zig build · std.http · zap (опц.) · zig-sqlite',
    tree: [
      {
        type: 'dir',
        path: 'orders-api',
        children: [
          {
            type: 'file',
            path: 'orders-api/build.zig',
            role: 'Сборка',
            hint: 'addExecutable, linkLibC(), addPackage(zap), installArtifact',
          },
          {
            type: 'file',
            path: 'orders-api/build.zig.zon',
            role: 'Зависимости',
            hint: '.dependencies.zap = .{ .url = ..., .hash = ... }',
          },
          {
            type: 'dir',
            path: 'orders-api/src',
            children: [
              {
                type: 'file',
                path: 'orders-api/src/main.zig',
                role: 'main',
                hint: 'pub fn main() !void — Server.listen, defer allocator.free',
              },
              {
                type: 'dir',
                path: 'orders-api/src/http',
                children: [
                  {
                    type: 'file',
                    path: 'orders-api/src/http/routes.zig',
                    role: 'Маршруты',
                    hint: 'std.http.Server — handler на каждый path',
                  },
                ],
              },
              {
                type: 'dir',
                path: 'orders-api/src/domain',
                children: [
                  {
                    type: 'file',
                    path: 'orders-api/src/domain/order.zig',
                    role: 'Домен',
                    hint: 'const Order = struct { id: u64, ... }; error union для БД',
                  },
                  {
                    type: 'file',
                    path: 'orders-api/src/domain/store.zig',
                    role: 'sqlite',
                    hint: 'zig-sqlite или in-memory; allocator в каждый вызов',
                  },
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'orders-api/vendor',
            children: [
              {
                type: 'file',
                path: 'orders-api/vendor/zap/build.zig',
                role: 'Подпроект',
                hint: 'b.dependency("zap", ...) — рекурсивная сборка',
              },
            ],
          },
          {
            type: 'file',
            path: 'orders-api/zig-out/bin/orders-api',
            role: 'Артефакт',
            hint: 'Статический бинарник ~3–8 MB; без JVM/VM',
          },
        ],
      },
    ],
  },
  {
    id: 'c-lib',
    label: 'Библиотека + C FFI',
    toolchain: 'zig build · @cImport · export · zig cc',
    tree: [
      {
        type: 'dir',
        path: 'zig-crypto-bridge',
        children: [
          {
            type: 'file',
            path: 'zig-crypto-bridge/build.zig',
            role: 'Сборка',
            hint: 'addStaticLibrary + addSharedLibrary; linkSystemLibrary("ssl")',
          },
          {
            type: 'file',
            path: 'zig-crypto-bridge/src/root.zig',
            role: 'lib root',
            hint: 'pub export fn zig_hash(...) callconv(.C)',
          },
          {
            type: 'file',
            path: 'zig-crypto-bridge/src/c_bindings.zig',
            role: '@cImport',
            hint: 'const c = @cImport(@cInclude("openssl/evp.h"));',
          },
          {
            type: 'file',
            path: 'zig-crypto-bridge/include/bridge.h',
            role: 'C header',
            hint: 'Для потребителей на C: объявления export-функций',
          },
          {
            type: 'file',
            path: 'zig-crypto-bridge/zig-out/lib/libzig-crypto-bridge.a',
            role: 'Статическая lib',
            hint: 'Линкуется в C-проект: zig cc -lcrypto main.c lib.a',
          },
        ],
      },
    ],
  },
  {
    id: 'workspace',
    label: 'Несколько артефактов',
    toolchain: 'build steps · addInstallArtifact · run',
    tree: [
      {
        type: 'dir',
        path: 'platform',
        children: [
          {
            type: 'file',
            path: 'platform/build.zig',
            role: 'Workspace',
            hint: 'const api = b.addExecutable(...); const worker = b.addExecutable(...);',
          },
          {
            type: 'dir',
            path: 'platform/libs/domain',
            children: [
              {
                type: 'file',
                path: 'platform/libs/domain/src/lib.zig',
                role: 'Общая lib',
                hint: 'addStaticLibrary("domain"); api.linkLibrary(domain)',
              },
            ],
          },
          {
            type: 'dir',
            path: 'platform/apps/api',
            children: [
              {
                type: 'file',
                path: 'platform/apps/api/src/main.zig',
                role: 'HTTP bin',
                hint: 'Зависит от domain через b.addModule или path',
              },
            ],
          },
          {
            type: 'dir',
            path: 'platform/apps/worker',
            children: [
              {
                type: 'file',
                path: 'platform/apps/worker/src/main.zig',
                role: 'Worker bin',
                hint: 'Отдельный zig-out/bin/worker — фоновые задачи',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'embedded',
    label: 'Embedded / freestanding',
    toolchain: 'freestanding · linker script · no std',
    tree: [
      {
        type: 'dir',
        path: 'firmware',
        children: [
          {
            type: 'file',
            path: 'firmware/build.zig',
            role: 'Target',
            hint: 'std.Target.parse(.{ .cpu_arch = .thumb, .os_tag = .freestanding })',
          },
          {
            type: 'file',
            path: 'firmware/linker.ld',
            role: 'Память',
            hint: 'ORIGIN / LENGTH FLASH и RAM — линковщик zig ld',
          },
          {
            type: 'file',
            path: 'firmware/src/main.zig',
            role: 'main',
            hint: 'pub export fn _start() noreturn — volatile MMIO, без allocator',
          },
          {
            type: 'file',
            path: 'firmware/src/uart.zig',
            role: 'Драйвер',
            hint: 'comptime pin = 5; регистры как packed struct',
          },
          {
            type: 'file',
            path: 'firmware/zig-out/bin/firmware.elf',
            role: 'Прошивка',
            hint: 'objcopy → .bin; размер предсказуем, без libc',
          },
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'init',
    label: 'Инициализация',
    cmd: 'zig init\n# или: zig init-exe / zig init-lib\n# правка build.zig.zon — url + hash пакетов',
    detail:
      'Создаёт build.zig, build.zig.zon, src/main.zig. zig fetch скачивает зависимости по hash — воспроизводимая сборка без глобального registry как у npm.',
  },
  {
    id: 'build',
    label: 'Сборка',
    cmd: 'zig build\nzig build -Doptimize=ReleaseFast\nzig build -Dtarget=x86_64-windows-gnu',
    detail:
      'build.zig описывает артефакты. Кросс-компиляция — только флаг target; zig поставляет libc и заголовки. ReleaseSafe сохраняет больше проверок, чем ReleaseFast.',
  },
  {
    id: 'test',
    label: 'Тесты',
    cmd: 'zig build test\nzig test src/main.zig',
    detail:
      'test "api returns 200" {} в том же файле. comptime test проверяет типы на этапе компиляции. zig build test — все шаги test в build.zig.',
  },
  {
    id: 'fmt',
    label: 'Формат и анализ',
    cmd: 'zig fmt src/\nzig build --verbose',
    detail:
      'zig fmt — единый стиль без настроек. zls — LSP для VS Code. Компилятор в -O Debug добавляет bounds check и integer overflow.',
  },
  {
    id: 'doc',
    label: 'Документация',
    cmd: 'zig build doc\n# Autodoc: /// комментарии → HTML в zig-out/doc',
    detail:
      'Документация из /// над pub fn и типами. В отличие от rustdoc, встроена в zig build doc при настройке install step.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: 'zig build -Dtarget=aarch64-linux-gnu install\n# один статический бинарник в zig-out/bin',
    detail:
      'Можно собрать musl/gnu static binary без Docker с кросс-тулчейном. Wasm: wasm32-wasi target. Для C-потребителей — .a/.so из addSharedLibrary.',
  },
];

export const MODULE_MODELS = [
  {
    id: 'single',
    label: 'Один файл',
    era: 'Скрипт · утилита',
    color: '#f7a41d',
    syntax: `// main.zig
const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, Zig!\\n", .{});
}`,
    traits: ['zig build-exe main.zig', 'Без build.zig для экспериментов', 'Всё в одном модуле'],
    tools: 'zig run · zig build-exe',
    use: 'Учебные примеры, маленькие CLI',
  },
  {
    id: 'multi',
    label: 'Модули @import',
    era: 'Типичный сервис',
    color: '#10b981',
    syntax: `// src/main.zig
const routes = @import("http/routes.zig");
const domain = @import("domain/order.zig");

pub fn main() !void {
    try routes.serve();
}

// src/http/routes.zig
pub fn serve() !void { /* ... */ }`,
    traits: ['Файл = модуль', 'pub export видимость', 'comptime @import только константы'],
    tools: 'zig build · zig test',
    use: 'HTTP API, утилиты с разделением по папкам',
  },
  {
    id: 'build-zig',
    label: 'build.zig + пакеты',
    era: 'Продакшен',
    color: '#8b5cf6',
    syntax: `// build.zig
const zap = b.dependency("zap", .{ .target = target, .optimize = optimize });
exe.root_module.addImport("zap", zap.module("zap"));

// build.zig.zon
.dependencies = .{
    .zap = .{ .url = "https://...", .hash = "1220..." },
},`,
    traits: ['Зависимости с hash', 'Подпроекты рекурсивно', 'linkSystemLibrary для C'],
    tools: 'zig fetch · zig build',
    use: 'Сервисы с zap/httpz, sqlite, OpenSSL',
  },
  {
    id: 'cimport',
    label: '@cImport + export',
    era: 'Миграция с C',
    color: '#ec4899',
    syntax: `const c = @cImport({
    @cInclude("api.h");
});

pub export fn zig_entry() callconv(.C) c_int {
    return c.legacy_init();
}`,
    traits: ['C headers → Zig типы', 'export для символов C ABI', 'zig cc заменяет gcc/clang'],
    tools: 'zig build · zig cc',
    use: 'Постепенная замена C, обёртки над SDK',
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
  const hasComptime = enabledNodeIds.has('comptime_job');
  const pkgCount = DEP_NODES.filter(
    (n) => (n.type === 'pkg' || n.type === 'c') && enabledNodeIds.has(n.id),
  ).length;
  const artifacts = hasComptime
    ? [
        'zig-out/bin/orders-api (~4 MB static)',
        'comptime генерирует lookup tables',
        `${pkgCount} внешних пакетов / C lib`,
      ]
    : ['zig-out/bin/orders-api (~3 MB)', 'без build/gen.zig step', `${pkgCount} dep`];
  return {artifacts, hasComptime, pkgCount};
}
