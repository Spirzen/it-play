/** Данные для SwiftEcosystemPlay — статья 5-14-swift/10. */

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
    label: 'Swift · компилятор',
    color: '#F05138',
    icon: 'S',
    items: ['value types · protocols', 'async/await · actors', 'SPM в компиляторе'],
    detail:
      'Исходники .swift компилируются в машинный код для Apple Silicon/Intel, в IR для сервера на Linux и в Wasm (экспериментально). Один язык — клиент Apple, backend и общие библиотеки через SPM.',
  },
  {
    id: 'platforms',
    tag: 'Платформы',
    label: 'iOS · macOS · watchOS · tvOS · Linux',
    color: '#3b82f6',
    icon: '🍎',
    items: ['UIKit · AppKit', 'SwiftUI на всех ОС', 'Vapor на Linux', 'Background Tasks API'],
    detail:
      'Клиентские приложения собираются под SDK Apple и подписываются для App Store. Серверный Swift — без UIKit: только Foundation, SwiftNIO и фреймворки вроде Vapor в Docker/Kubernetes.',
  },
  {
    id: 'build',
    tag: 'Сборка',
    label: 'Xcode · SPM · Tuist',
    color: '#10b981',
    icon: '📦',
    items: ['Package.swift', '.xcodeproj / workspace', 'Tuist Project.swift', 'SwiftLint · Sourcery'],
    detail:
      'Xcode управляет схемами, симуляторами, подписью и архивацией. SPM описывает зависимости декларативно. Tuist генерирует проекты из Swift-описания, чтобы избежать конфликтов в .pbxproj.',
  },
  {
    id: 'apple',
    tag: 'Apple SDK',
    label: 'Системные фреймворки',
    color: '#6366f1',
    icon: '🏗',
    items: ['SwiftUI · UIKit', 'Combine · URLSession', 'Core Data · Vision · Core ML'],
    detail:
      'Официальные фреймворки линкуются как system frameworks. SwiftUI — декларативный UI; UIKit/AppKit — императивные стеки для legacy и тонкой настройки.',
  },
  {
    id: 'community',
    tag: 'Сообщество',
    label: 'Сторонние библиотеки',
    color: '#ec4899',
    icon: '📚',
    items: ['Alamofire · GRDB', 'Vapor · Fluent', 'TCA · SnapshotTesting'],
    detail:
      'Подключаются через SPM (URL в Package.swift) или CocoaPods/Carthage в старых проектах. Vapor и Fluent — сервер; TCA — архитектура на клиенте; Alamofire — обёртка над URLSession.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#06b6d4',
    icon: '📱',
    items: ['Views · ViewModels', 'domain · services', 'data · persistence', 'extensions'],
    detail:
      'Прикладные слои: SwiftUI-экраны, ObservableObject/@Observable, репозитории, Core Data/GRDB. App Extensions (Widget, Share) — отдельные targets с общим SPM-пакетом.',
  },
];

/** Узлы графа зависимостей (viewBox 400×260). */
export const DEP_NODES = [
  {id: 'app', label: '@main App', type: 'app', x: 200, y: 24},
  {id: 'views', label: 'Features/HomeView', type: 'module', x: 80, y: 90},
  {id: 'vm', label: 'HomeViewModel', type: 'module', x: 200, y: 90},
  {id: 'widget', label: 'WidgetExtension', type: 'lazy', x: 320, y: 90},
  {id: 'repo', label: 'ItemRepository', type: 'module', x: 200, y: 148},
  {id: 'swiftui', label: 'SwiftUI', type: 'sdk', x: 40, y: 200},
  {id: 'combine', label: 'Combine', type: 'sdk', x: 120, y: 200},
  {id: 'alamofire', label: 'Alamofire', type: 'spm', x: 200, y: 200},
  {id: 'coredata', label: 'CoreData', type: 'sdk', x: 280, y: 200},
  {id: 'tca', label: 'ComposableArchitecture', type: 'spm', x: 360, y: 200},
];

export const DEP_EDGES = [
  ['app', 'views'],
  ['app', 'vm'],
  ['app', 'widget'],
  ['views', 'swiftui'],
  ['views', 'vm'],
  ['vm', 'repo'],
  ['vm', 'combine'],
  ['vm', 'tca'],
  ['repo', 'coredata'],
  ['repo', 'alamofire'],
  ['repo', 'combine'],
  ['widget', 'swiftui'],
  ['widget', 'repo'],
  ['views', 'tca'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#06b6d4'},
  module: {label: 'Прикладной слой', stroke: '#10b981'},
  lazy: {label: 'Extension target', stroke: '#f59e0b', dash: '6 4'},
  sdk: {label: 'System framework', stroke: '#6366f1'},
  spm: {label: 'SPM-зависимость', stroke: '#F05138'},
};

export const ARCH_PRESETS = [
  {
    id: 'swiftui-ios',
    label: 'iOS + SwiftUI',
    toolchain: 'Xcode · SwiftUI · MVVM · Core Data · SPM (Alamofire)',
    tree: [
      {
        type: 'dir',
        path: 'ShopApp',
        children: [
          {type: 'file', path: 'ShopApp/ShopApp.xcodeproj', role: 'Проект Xcode', hint: 'Targets: App, WidgetExtension, Tests'},
          {type: 'file', path: 'ShopApp/Package.swift', role: 'Локальный SPM', hint: 'dependencies: Alamofire, TCA (опц.)'},
          {
            type: 'dir',
            path: 'ShopApp/Sources/App',
            children: [
              {type: 'file', path: 'ShopApp/Sources/App/ShopApp.swift', role: '@main', hint: 'WindowGroup { ContentView() }'},
              {
                type: 'dir',
                path: 'ShopApp/Sources/App/Features',
                children: [
                  {type: 'file', path: 'ShopApp/Sources/App/Features/HomeView.swift', role: 'SwiftUI View', hint: '@StateObject var vm, body: some View'},
                  {type: 'file', path: 'ShopApp/Sources/App/Features/HomeViewModel.swift', role: 'ObservableObject', hint: '@Published, async loadItems()'},
                ],
              },
              {
                type: 'dir',
                path: 'ShopApp/Sources/App/Data',
                children: [
                  {type: 'file', path: 'ShopApp/Sources/App/Data/ItemRepository.swift', role: 'Repository', hint: 'Core Data + URLSession/Alamofire'},
                  {type: 'file', path: 'ShopApp/Sources/App/Data/PersistenceController.swift', role: 'Core Data', hint: 'NSPersistentContainer, @FetchRequest'},
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'ShopApp/WidgetExtension',
            children: [
              {type: 'file', path: 'ShopApp/WidgetExtension/ShopWidget.swift', role: 'WidgetKit', hint: 'TimelineProvider, shared App Group'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'vapor-server',
    label: 'Vapor Server',
    toolchain: 'SwiftNIO · routing · Fluent · Docker',
    tree: [
      {
        type: 'dir',
        path: 'api-vapor',
        children: [
          {type: 'file', path: 'api-vapor/Package.swift', role: 'SPM манифест', hint: '.package(url: vapor, from: "4.0")'},
          {
            type: 'dir',
            path: 'api-vapor/Sources/App',
            children: [
              {type: 'file', path: 'api-vapor/Sources/App/entrypoint.swift', role: '@main', hint: 'try await configure(app)'},
              {type: 'file', path: 'api-vapor/Sources/App/configure.swift', role: 'Bootstrap', hint: 'routes, migrations, middleware'},
              {
                type: 'dir',
                path: 'api-vapor/Sources/App/Controllers',
                children: [
                  {type: 'file', path: 'api-vapor/Sources/App/Controllers/UserController.swift', role: 'Routes', hint: 'app.get("users") { req in ... }'},
                ],
              },
              {
                type: 'dir',
                path: 'api-vapor/Sources/App/Models',
                children: [
                  {type: 'file', path: 'api-vapor/Sources/App/Models/User.swift', role: 'Fluent Model', hint: 'final class User: Model, Content'},
                ],
              },
            ],
          },
          {type: 'file', path: 'api-vapor/Dockerfile', role: 'Deploy', hint: 'swift:5.10 builder → ubuntu runtime'},
        ],
      },
    ],
  },
  {
    id: 'spm-workspace',
    label: 'SPM + модули',
    toolchain: 'Package.swift · targets · products · shared CoreKit',
    tree: [
      {
        type: 'dir',
        path: 'mobile-spm',
        children: [
          {type: 'file', path: 'mobile-spm/Package.swift', role: 'Корневой пакет', hint: 'products: .library CoreKit, .executable AppCLI'},
          {
            type: 'dir',
            path: 'mobile-spm/Sources/CoreKit',
            children: [
              {type: 'file', path: 'mobile-spm/Sources/CoreKit/Models/Item.swift', role: 'Domain', hint: 'struct Item: Codable, Sendable'},
              {type: 'file', path: 'mobile-spm/Sources/CoreKit/Services/ItemService.swift', role: 'Сервис', hint: 'public API для app и extension'},
            ],
          },
          {
            type: 'dir',
            path: 'mobile-spm/Sources/NetworkingKit',
            children: [
              {type: 'file', path: 'mobile-spm/Sources/NetworkingKit/APIClient.swift', role: 'Target', hint: 'depends on CoreKit + Alamofire'},
            ],
          },
          {type: 'file', path: 'mobile-spm/ShopApp.xcworkspace', role: 'Xcode workspace', hint: 'App target + local package path'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'source',
    label: 'Исходники',
    cmd: 'Sources/**/*.swift  import SwiftUI  import Alamofire',
    detail: 'Файлы Swift и import образуют граф модулей. SourceKit-LSP и компилятор проверяют типы до линковки.',
  },
  {
    id: 'resolve',
    label: 'SPM resolve',
    cmd: 'swift package resolve  →  .build/checkouts',
    detail: 'Package.swift задаёт URL и версии зависимостей. Xcode и CLI скачивают пакеты в DerivedData или .build.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: 'swift build  |  xcodebuild -scheme ShopApp',
    detail: 'Компилятор строит модули по target: iOS — arm64 + SDK; macOS — x86_64/arm64; Linux — только Foundation/Vapor.',
  },
  {
    id: 'link',
    label: 'Линковка',
    cmd: 'link SwiftUI.framework · Alamofire.o · App.o → ShopApp',
    detail: 'System frameworks подключаются из SDK; SPM-продукты — как статические или динамические библиотеки в бандле.',
  },
  {
    id: 'package',
    label: 'Артефакты',
    cmd: 'ShopApp.app  |  ShopApp.ipa  |  api-vapor (executable)',
    detail: 'Симулятор — .app; устройство/TestFlight — подписанный .ipa; сервер — бинарник или Docker-образ.',
  },
  {
    id: 'ship',
    label: 'Публикация',
    cmd: 'App Store Connect  |  TestFlight  |  kubectl apply',
    detail: 'Archive в Xcode, notarization на macOS, загрузка через Transporter. Backend — CI с swift test && docker push.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'spm',
    label: 'Swift Package Manager',
    era: 'Официальный',
    color: '#F05138',
    syntax: `// Package.swift
let package = Package(
    name: "CoreKit",
    products: [.library(name: "CoreKit", targets: ["CoreKit"])],
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0")
    ],
    targets: [
        .target(name: "CoreKit", dependencies: ["Alamofire"])
    ]
)`,
    traits: ['Package.swift как манифест', 'Версии from/upToNextMajor', 'Работает в Xcode и CLI'],
    tools: 'Xcode, swift build, CI на Linux',
    use: 'Библиотеки, CLI, Vapor, общий код app + extension',
  },
  {
    id: 'xcode',
    label: 'Xcode targets',
    era: 'Проект Apple',
    color: '#6366f1',
    syntax: `// Target: ShopApp (Application)
//   → Link: SwiftUI, CoreData
//   → Embed: WidgetExtension.appex
// Framework Search Paths + Signing`,
    traits: ['Несколько targets в одном проекте', 'Capabilities, entitlements', 'Симулятор и устройство'],
    tools: 'Xcode, xcodebuild, Instruments',
    use: 'iOS/macOS приложения, extensions, UIKit legacy',
  },
  {
    id: 'tuist',
    label: 'Tuist (генератор)',
    era: 'Проект как код',
    color: '#10b981',
    syntax: `// Project.swift
let project = Project(
    name: "Shop",
    targets: [
        .target(name: "Shop", destinations: [.iPhone], product: .app, ...)
    ]
)`,
    traits: ['Генерация .xcodeproj', 'Нет merge-конфликтов в pbxproj', 'Кэш и graph команд Tuist'],
    tools: 'tuist generate, tuist cache',
    use: 'Крупные монорепозитории с десятками модулей',
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
  const hasWidget = enabledNodeIds.has('widget');
  const spmCount = DEP_NODES.filter((n) => n.type === 'spm' && enabledNodeIds.has(n.id)).length;
  const sdkCount = DEP_NODES.filter((n) => n.type === 'sdk' && enabledNodeIds.has(n.id)).length;
  const chunks = hasWidget
    ? ['ShopApp.ipa (~18 MB)', 'WidgetExtension.appex (~1.2 MB)']
    : ['ShopApp.ipa (~16 MB)'];
  return {chunks, hasWidget, spmCount, sdkCount};
}
