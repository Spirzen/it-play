/** Данные для DartEcosystemPlay — статья 5-22-dart/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и артефакты'},
  {id: 'modules', label: 'Пакеты и модули'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'language',
    tag: 'Язык',
    label: 'Dart · типы · async',
    color: '#0175C2',
    icon: 'D',
    items: ['null safety · sound types', 'async/await · Stream', 'records · patterns (Dart 3)'],
    detail:
      'Исходники .dart компилируются в нативный код (AOT), байткод VM (JIT) или JavaScript/Wasm для веба. Звуковая типизация гарантирует отсутствие ошибок типов после успешного dart analyze.',
  },
  {
    id: 'runtime',
    tag: 'Runtime',
    label: 'Dart VM · isolates',
    color: '#3b82f6',
    icon: '⚙',
    items: ['JIT (dev) · AOT (release)', 'event loop · microtasks', 'generational GC'],
    detail:
      'Один isolate — один поток без разделяемой памяти. Асинхронность через Future/Stream и event loop. Тяжёлые вычисления — в фоновых isolates через Isolate.run или compute.',
  },
  {
    id: 'sdk',
    tag: 'SDK',
    label: 'dart:* · pub',
    color: '#10b981',
    icon: '📚',
    items: ['dart:core · dart:async', 'dart:io · dart:convert', 'pubspec.yaml · pub.dev'],
    detail:
      'Стандартная библиотека встроена в SDK. pub управляет зависимостями и версиями (SemVer). Пакеты с pub.dev подключаются одной строкой в pubspec.yaml.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'CLI · IDE · DevTools',
    color: '#ec4899',
    icon: '🔧',
    items: ['dart analyze · format', 'dart test · dart doc', 'Flutter DevTools · hot reload'],
    detail:
      'dart analyze проверяет типы и стиль. VS Code / Android Studio дают навигацию и отладку. Flutter DevTools профилирует UI, память и сеть в работающем приложении.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Flutter · shelf · server',
    color: '#06b6d4',
    icon: '🏗',
    items: ['Flutter · Material/Cupertino', 'shelf · serverpod', 'riverpod · bloc · provider'],
    detail:
      'Flutter — UI на Dart с собственным движком Skia. shelf — минимальный HTTP-сервер. State management (riverpod, bloc) и DI подключаются как pub-пакеты поверх вашего кода.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '📱',
    items: ['lib/ · widgets', 'data · repositories', 'domain · services', 'platform channels'],
    detail:
      'lib/ — основной код. Слои UI → state → repository → API/DB. Platform channels связывают Dart с нативным Kotlin/Swift/C++ для камеры, Bluetooth и системных API.',
  },
];

/** Узлы графа зависимостей (viewBox 400×260). */
export const DEP_NODES = [
  {id: 'main', label: 'main.dart', type: 'app', x: 200, y: 24},
  {id: 'ui', label: 'lib/ui/', type: 'module', x: 70, y: 90},
  {id: 'state', label: 'lib/providers/', type: 'module', x: 200, y: 90},
  {id: 'analytics', label: 'features/analytics', type: 'lazy', x: 330, y: 90},
  {id: 'repo', label: 'UserRepository', type: 'module', x: 200, y: 148},
  {id: 'flutter', label: 'flutter (SDK)', type: 'pub', x: 40, y: 210},
  {id: 'http', label: 'package:http', type: 'pub', x: 120, y: 210},
  {id: 'riverpod', label: 'flutter_riverpod', type: 'pub', x: 200, y: 210},
  {id: 'prefs', label: 'shared_preferences', type: 'pub', x: 280, y: 210},
  {id: 'firebase', label: 'firebase_analytics', type: 'pub', x: 360, y: 210},
];

export const DEP_EDGES = [
  ['main', 'ui'],
  ['main', 'state'],
  ['main', 'analytics'],
  ['ui', 'flutter'],
  ['ui', 'state'],
  ['state', 'repo'],
  ['state', 'riverpod'],
  ['repo', 'http'],
  ['repo', 'prefs'],
  ['repo', 'riverpod'],
  ['analytics', 'firebase'],
  ['analytics', 'http'],
  ['analytics', 'riverpod'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Прикладной слой', stroke: '#10b981'},
  lazy: {label: 'Feature-модуль', stroke: '#f59e0b', dash: '6 4'},
  pub: {label: 'pub.dev пакет', stroke: '#0175C2'},
};

export const ARCH_PRESETS = [
  {
    id: 'flutter-mobile',
    label: 'Flutter (mobile)',
    toolchain: 'Flutter SDK · Material 3 · Riverpod · http · AOT release',
    tree: [
      {
        type: 'dir',
        path: 'shop_app',
        children: [
          {type: 'file', path: 'shop_app/pubspec.yaml', role: 'Манифест', hint: 'name, dependencies, flutter: assets, sdk constraints'},
          {type: 'file', path: 'shop_app/analysis_options.yaml', role: 'Lint', hint: 'flutter_lints, правила dart analyze'},
          {type: 'file', path: 'shop_app/pubspec.lock', role: 'Lockfile', hint: 'Точные версии после pub get — коммитить'},
          {
            type: 'dir',
            path: 'shop_app/lib',
            children: [
              {type: 'file', path: 'shop_app/lib/main.dart', role: 'Entry', hint: 'runApp(ProviderScope(child: MyApp()))'},
              {
                type: 'dir',
                path: 'shop_app/lib/ui',
                children: [
                  {type: 'file', path: 'shop_app/lib/ui/screens/home_screen.dart', role: 'Widget', hint: 'StatelessWidget / ConsumerWidget'},
                  {type: 'file', path: 'shop_app/lib/ui/theme/app_theme.dart', role: 'ThemeData', hint: 'Material 3, цвета, типографика'},
                ],
              },
              {
                type: 'dir',
                path: 'shop_app/lib/providers',
                children: [
                  {type: 'file', path: 'shop_app/lib/providers/user_provider.dart', role: 'Riverpod', hint: '@riverpod class UserNotifier extends _$UserNotifier'},
                ],
              },
              {
                type: 'dir',
                path: 'shop_app/lib/data',
                children: [
                  {type: 'file', path: 'shop_app/lib/data/user_repository.dart', role: 'Repository', hint: 'http.get + shared_preferences, единая точка данных'},
                  {type: 'file', path: 'shop_app/lib/data/api_client.dart', role: 'HTTP', hint: 'package:http, baseUrl, headers'},
                ],
              },
              {
                type: 'dir',
                path: 'shop_app/lib/features/analytics',
                children: [
                  {type: 'file', path: 'shop_app/lib/features/analytics/analytics_service.dart', role: 'Feature', hint: 'firebase_analytics — опциональный модуль'},
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'shop_app/android',
            children: [
              {type: 'file', path: 'shop_app/android/app/build.gradle', role: 'Embedder', hint: 'Gradle, signing, minSdk — платформенная оболочка'},
            ],
          },
          {
            type: 'dir',
            path: 'shop_app/ios',
            children: [
              {type: 'file', path: 'shop_app/ios/Runner/AppDelegate.swift', role: 'Embedder', hint: 'Platform channels, Firebase init'},
            ],
          },
          {type: 'file', path: 'shop_app/test/widget_test.dart', role: 'Тесты', hint: 'flutter_test, pumpWidget, find.byType'},
        ],
      },
    ],
  },
  {
    id: 'dart-cli',
    label: 'Dart CLI',
    toolchain: 'dart:io · args · pub run · AOT snapshot',
    tree: [
      {
        type: 'dir',
        path: 'report-cli',
        children: [
          {type: 'file', path: 'report-cli/pubspec.yaml', role: 'Манифест', hint: 'executables: report — точка входа bin/'},
          {type: 'file', path: 'report-cli/analysis_options.yaml', role: 'Lint', hint: 'linter rules для CI'},
          {
            type: 'dir',
            path: 'report-cli/bin',
            children: [
              {type: 'file', path: 'report-cli/bin/report.dart', role: 'main()', hint: 'void main(List<String> args) async { ... }'},
            ],
          },
          {
            type: 'dir',
            path: 'report-cli/lib',
            children: [
              {type: 'file', path: 'report-cli/lib/report_generator.dart', role: 'Логика', hint: 'Чтение CSV, агрегация, вывод в stdout'},
              {type: 'file', path: 'report-cli/lib/file_reader.dart', role: 'dart:io', hint: 'File, Directory — только не для web target'},
            ],
          },
          {type: 'file', path: 'report-cli/test/report_test.dart', role: 'dart test', hint: 'expect(actual, equals(expected))'},
        ],
      },
    ],
  },
  {
    id: 'shelf-server',
    label: 'shelf Server',
    toolchain: 'shelf · shelf_router · dart:io HttpServer',
    tree: [
      {
        type: 'dir',
        path: 'api-shelf',
        children: [
          {type: 'file', path: 'api-shelf/pubspec.yaml', role: 'Зависимости', hint: 'shelf, shelf_router, http_parser'},
          {
            type: 'dir',
            path: 'api-shelf/bin',
            children: [
              {type: 'file', path: 'api-shelf/bin/server.dart', role: 'main()', hint: 'serve(handler, InternetAddress.anyIPv4, 8080)'},
            ],
          },
          {
            type: 'dir',
            path: 'api-shelf/lib',
            children: [
              {type: 'file', path: 'api-shelf/lib/router.dart', role: 'shelf_router', hint: 'Router()..get("/users", _listUsers)'},
              {
                type: 'dir',
                path: 'api-shelf/lib/handlers',
                children: [
                  {type: 'file', path: 'api-shelf/lib/handlers/user_handlers.dart', role: 'Handlers', hint: 'Request → Response, jsonEncode'},
                ],
              },
              {type: 'file', path: 'api-shelf/lib/models/user.dart', role: 'DTO', hint: 'fromJson / toJson без code generation или с json_serializable'},
            ],
          },
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'source',
    label: 'Исходники',
    cmd: 'lib/**/*.dart  import "package:http/http.dart" as http;',
    detail: 'Файлы Dart и import-граф. IDE и dart analyze проверяют типы до запуска. pubspec.yaml задаёт SDK и зависимости.',
  },
  {
    id: 'analyze',
    label: 'Анализ',
    cmd: 'dart analyze  →  0 issues',
    detail: 'Статический анализ: типы, null safety, flutter_lints. В CI — обязательный gate перед merge.',
  },
  {
    id: 'resolve',
    label: 'pub get',
    cmd: 'dart pub get  →  .dart_tool/package_config.json',
    detail: 'pub скачивает пакеты с pub.dev, строит граф версий по SemVer и записывает lockfile.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: 'JIT: flutter run (dev)  |  AOT: flutter build apk --release',
    detail: 'JIT — hot reload, профилирование. AOT — нативный код ARM64/x64 без VM-оверхеда в production.',
  },
  {
    id: 'targets',
    label: 'Цели',
    cmd: 'mobile: lib/main.dart  |  web: dart2js/dart2wasm  |  server: dart run bin/server.dart',
    detail: 'Один pubspec — разные entry points. dart:io недоступен в web; для браузера — package:web и другой набор API.',
  },
  {
    id: 'ship',
    label: 'Артефакты',
    cmd: 'app-release.apk  |  app.ipa  |  server snapshot  |  main.dart.js',
    detail: 'Мобильные — подпись и store. Сервер — dart compile exe или Docker. Web — статический бандл за nginx/CDN.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'pub',
    label: 'pub-пакет',
    era: 'Стандарт',
    color: '#0175C2',
    syntax: `# pubspec.yaml
name: shop_app
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  flutter_riverpod: ^2.5.0

dev_dependencies:
  flutter_test:
    sdk: flutter`,
    traits: ['SemVer на pub.dev', 'pub get / pub upgrade', 'lib/ — публичный API пакета'],
    tools: 'dart pub, VS Code, Android Studio',
    use: 'Любой Dart/Flutter проект — от CLI до mobile',
  },
  {
    id: 'layout',
    label: 'Структура lib/',
    era: 'Feature-first',
    color: '#10b981',
    syntax: `lib/
  main.dart
  ui/screens/
  providers/      # state
  data/           # repositories
  features/
    analytics/    # опциональный модуль`,
    traits: ['UI отделён от data', 'features/ — изолируемые модули', 'test/ зеркалит lib/'],
    tools: 'flutter create, very_good_cli',
    use: 'Средние и крупные Flutter-приложения',
  },
  {
    id: 'melos',
    label: 'Melos monorepo',
    era: 'Мультипакет',
    color: '#f59e0b',
    syntax: `# melos.yaml
packages:
  - apps/shop_app
  - packages/core
  - packages/ui_kit

# apps/shop_app/pubspec.yaml
dependencies:
  core:
    path: ../../packages/core`,
    traits: ['Несколько pub-пакетов в одном git', 'path: зависимости', 'melos bootstrap для link'],
    tools: 'melos, CI matrix по пакетам',
    use: 'Общий UI-kit + несколько приложений на одной кодовой базе',
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
  const hasAnalytics = enabledNodeIds.has('analytics');
  const pubCount = DEP_NODES.filter((n) => n.type === 'pub' && enabledNodeIds.has(n.id)).length;
  const chunks = hasAnalytics
    ? ['release.apk (~18 MB)', '+ firebase_analytics (~2.4 MB)']
    : ['release.apk (~15 MB)'];
  return {chunks, hasAnalytics, pubCount};
}
