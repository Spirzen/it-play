/** Данные для KotlinEcosystemPlay — статья 5-09-kotlin/10. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и артефакты'},
  {id: 'modules', label: 'Модули и source sets'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'language',
    tag: 'Язык',
    label: 'Kotlin · компилятор',
    color: '#7F52FF',
    icon: 'K',
    items: ['null-safety · coroutines', 'data class · sealed', 'K2 compiler · KDoc'],
    detail:
      'Исходники .kt компилируются в байткод JVM, DEX для Android, klib для Native/JS или Wasm. Один язык — несколько backend’ов через Kotlin Multiplatform.',
  },
  {
    id: 'runtime',
    tag: 'Платформы',
    label: 'JVM · Android · Native · JS',
    color: '#3b82f6',
    icon: '⚙',
    items: ['JVM / ART', 'Kotlin/Native (iOS, desktop)', 'Kotlin/JS · Wasm (эксп.)'],
    detail:
      'На JVM Kotlin совместим с Java-библиотеками. Android использует ART и Android SDK. Native — LLVM без GC (ARC). JS/Wasm — для браузера и full-stack KVision.',
  },
  {
    id: 'build',
    tag: 'Сборка',
    label: 'Gradle · Kotlin DSL',
    color: '#10b981',
    icon: '📦',
    items: ['build.gradle.kts', 'libs.versions.toml', 'KSP · kapt', 'AGP для Android'],
    detail:
      'Gradle описывает модули, зависимости и цели компиляции. Kotlin DSL даёт типобезопасную конфигурацию. KSP генерирует код для Room, kotlinx.serialization.',
  },
  {
    id: 'stdlib',
    tag: 'Библиотеки',
    label: 'kotlinx · JetBrains',
    color: '#ec4899',
    icon: '📚',
    items: ['coroutines · Flow', 'serialization', 'datetime · atomicfu'],
    detail:
      'Официальные расширения языка: асинхронность, сериализация без рефлексии, многопоточные примитивы. Подключаются как implementation в Gradle.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Клиент и сервер',
    color: '#06b6d4',
    icon: '🏗',
    items: ['Jetpack · Compose', 'Ktor · Spring Boot', 'SQLDelight · Koin', 'Compose Multiplatform'],
    detail:
      'Фреймворки задают архитектуру: MVVM на Android, модули Ktor на backend, общий shared-код в KMM. Библиотеки (Retrofit-аналог Ktor Client) подключаются точечно.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '📱',
    items: ['ui · presentation', 'domain · use cases', 'data · repositories', 'di · modules'],
    detail:
      'Прикладные слои: UI (Compose/Views), ViewModel, репозитории, локальная БД и сеть. Опциональные feature-модули подключаются отдельно и увеличивают APK.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220). */
export const DEP_NODES = [
  {id: 'app', label: 'MainActivity', type: 'app', x: 200, y: 24},
  {id: 'compose', label: 'ui/screens', type: 'module', x: 80, y: 90},
  {id: 'vm', label: 'UserViewModel', type: 'module', x: 200, y: 90},
  {id: 'analytics', label: 'features/analytics', type: 'lazy', x: 320, y: 90},
  {id: 'repo', label: 'UserRepository', type: 'module', x: 200, y: 148},
  {id: 'composeLib', label: 'compose-ui', type: 'maven', x: 40, y: 200},
  {id: 'room', label: 'room-ktx', type: 'maven', x: 120, y: 200},
  {id: 'ktor', label: 'ktor-client', type: 'maven', x: 200, y: 200},
  {id: 'koin', label: 'koin-android', type: 'maven', x: 280, y: 200},
  {id: 'serialization', label: 'kotlinx-serialization', type: 'maven', x: 360, y: 200},
];

export const DEP_EDGES = [
  ['app', 'compose'],
  ['app', 'vm'],
  ['app', 'analytics'],
  ['compose', 'composeLib'],
  ['compose', 'vm'],
  ['vm', 'repo'],
  ['vm', 'koin'],
  ['repo', 'room'],
  ['repo', 'ktor'],
  ['repo', 'serialization'],
  ['analytics', 'ktor'],
  ['analytics', 'serialization'],
  ['repo', 'koin'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Прикладной слой', stroke: '#10b981'},
  lazy: {label: 'Feature-модуль', stroke: '#f59e0b', dash: '6 4'},
  maven: {label: 'Maven-зависимость', stroke: '#7F52FF'},
};

export const ARCH_PRESETS = [
  {
    id: 'android-compose',
    label: 'Android + Compose',
    toolchain: 'AGP · Jetpack · MVVM · Room · Ktor Client',
    tree: [
      {
        type: 'dir',
        path: 'shop-android',
        children: [
          {type: 'file', path: 'shop-android/build.gradle.kts', role: 'Root Gradle', hint: 'plugins, version catalog, subprojects'},
          {type: 'file', path: 'shop-android/settings.gradle.kts', role: 'Модули', hint: 'include(":app")'},
          {type: 'file', path: 'shop-android/gradle/libs.versions.toml', role: 'Версии', hint: 'compose, ktor, room, koin'},
          {
            type: 'dir',
            path: 'shop-android/app',
            children: [
              {type: 'file', path: 'shop-android/app/build.gradle.kts', role: 'Модуль app', hint: 'androidApplication, dependencies'},
              {
                type: 'dir',
                path: 'shop-android/app/src/main/kotlin',
                children: [
                  {type: 'file', path: 'shop-android/app/src/main/kotlin/MainActivity.kt', role: 'Entry', hint: 'setContent { App() }'},
                  {
                    type: 'dir',
                    path: 'shop-android/app/src/main/kotlin/ui',
                    role: 'Presentation',
                    children: [
                      {type: 'file', path: 'shop-android/app/src/main/kotlin/ui/screens/HomeScreen.kt', role: '@Composable', hint: 'UI + state hoisting'},
                      {type: 'file', path: 'shop-android/app/src/main/kotlin/ui/theme/Theme.kt', role: 'Material3', hint: 'Цвета, типографика'},
                    ],
                  },
                  {
                    type: 'dir',
                    path: 'shop-android/app/src/main/kotlin/domain',
                    children: [
                      {type: 'file', path: 'shop-android/app/src/main/kotlin/domain/UserViewModel.kt', role: 'ViewModel', hint: 'viewModelScope, StateFlow'},
                    ],
                  },
                  {
                    type: 'dir',
                    path: 'shop-android/app/src/main/kotlin/data',
                    children: [
                      {type: 'file', path: 'shop-android/app/src/main/kotlin/data/UserRepository.kt', role: 'Repository', hint: 'Room + Ktor, единая точка данных'},
                      {type: 'file', path: 'shop-android/app/src/main/kotlin/data/local/UserDao.kt', role: 'Room DAO', hint: '@Query, Flow<List<User>>'},
                      {type: 'file', path: 'shop-android/app/src/main/kotlin/data/remote/ApiClient.kt', role: 'Ktor', hint: 'HttpClient, ContentNegotiation + json()'},
                    ],
                  },
                  {type: 'file', path: 'shop-android/app/src/main/kotlin/di/AppModule.kt', role: 'Koin', hint: 'module { single { ... } }'},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ktor-server',
    label: 'Ktor Server',
    toolchain: 'Netty/CIO · routing · plugins · kotlinx.serialization',
    tree: [
      {
        type: 'dir',
        path: 'api-ktor',
        children: [
          {type: 'file', path: 'api-ktor/build.gradle.kts', role: 'Gradle', hint: 'kotlin jvm, ktor, serialization plugin'},
          {
            type: 'dir',
            path: 'api-ktor/src/main/kotlin',
            children: [
              {type: 'file', path: 'api-ktor/src/main/kotlin/Application.kt', role: 'main()', hint: 'embeddedServer(Netty) { install(...) }'},
              {
                type: 'dir',
                path: 'api-ktor/src/main/kotlin/plugins',
                children: [
                  {type: 'file', path: 'api-ktor/src/main/kotlin/plugins/Serialization.kt', role: 'Plugin', hint: 'ContentNegotiation + json()'},
                  {type: 'file', path: 'api-ktor/src/main/kotlin/plugins/Security.kt', role: 'Auth', hint: 'JWT, sessions'},
                ],
              },
              {
                type: 'dir',
                path: 'api-ktor/src/main/kotlin/routes',
                children: [
                  {type: 'file', path: 'api-ktor/src/main/kotlin/routes/UserRoutes.kt', role: 'Routing', hint: 'get/post, call.receive<User>()'},
                ],
              },
              {type: 'file', path: 'api-ktor/src/main/kotlin/models/User.kt', role: '@Serializable', hint: 'DTO для API'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kmm',
    label: 'Kotlin Multiplatform',
    toolchain: 'shared · commonMain · androidApp · iosApp',
    tree: [
      {
        type: 'dir',
        path: 'mobile-kmm',
        children: [
          {type: 'file', path: 'mobile-kmm/settings.gradle.kts', role: 'Проект', hint: 'include(":shared", ":androidApp")'},
          {
            type: 'dir',
            path: 'mobile-kmm/shared',
            children: [
              {type: 'file', path: 'mobile-kmm/shared/build.gradle.kts', role: 'KMP target', hint: 'androidTarget(), iosArm64(), sourceSets'},
              {
                type: 'dir',
                path: 'mobile-kmm/shared/src/commonMain/kotlin',
                children: [
                  {type: 'file', path: 'mobile-kmm/shared/src/commonMain/kotlin/UserRepository.kt', role: 'Общая логика', hint: 'expect/actual, Ktor, SQLDelight'},
                  {type: 'file', path: 'mobile-kmm/shared/src/commonMain/kotlin/Platform.kt', role: 'expect', hint: 'expect class PlatformLogger'},
                ],
              },
              {type: 'file', path: 'mobile-kmm/shared/src/androidMain/kotlin/Platform.android.kt', role: 'actual', hint: 'Android-реализация'},
              {type: 'file', path: 'mobile-kmm/shared/src/iosMain/kotlin/Platform.ios.kt', role: 'actual', hint: 'iOS / Native'},
            ],
          },
          {
            type: 'dir',
            path: 'mobile-kmm/androidApp',
            children: [
              {type: 'file', path: 'mobile-kmm/androidApp/build.gradle.kts', role: 'Android shell', hint: 'implementation(project(":shared"))'},
              {type: 'file', path: 'mobile-kmm/androidApp/src/.../MainActivity.kt', role: 'UI Android', hint: 'Compose или Views, вызывает shared'},
            ],
          },
          {type: 'file', path: 'mobile-kmm/iosApp/', role: 'Xcode wrapper', hint: 'SwiftUI + framework из shared'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'source',
    label: 'Исходники',
    cmd: 'src/**/*.kt  import io.ktor.client.*',
    detail: 'Файлы Kotlin и импорты образуют граф. IDE и компилятор проверяют типы до сборки.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: 'kotlinc / K2  →  .class (JVM)  |  .klib (Native)  |  .js (JS)',
    detail: 'Компилятор выбирает backend по target: JVM для сервера, DEX через AGP для Android, klib для iOS.',
  },
  {
    id: 'resolve',
    label: 'Зависимости',
    cmd: './gradlew dependencies  →  mavenCentral / Google Maven',
    detail: 'Gradle скачивает артефакты (ktor-client, room-ktx) и связывает их с модулями проекта.',
  },
  {
    id: 'targets',
    label: 'Цели KMP',
    cmd: 'commonMain → androidMain / iosMain (expect/actual)',
    detail: 'Общий код в commonMain; платформенные реализации — в androidMain и iosMain.',
  },
  {
    id: 'package',
    label: 'Артефакты',
    cmd: 'app-debug.apk  |  api.jar  |  shared.framework',
    detail: 'Android — APK/AAB; JVM — JAR; KMM — AAR + XCFramework для Xcode.',
  },
  {
    id: 'ship',
    label: 'Публикация',
    cmd: 'Play Console  |  Docker image  |  TestFlight',
    detail: 'Подпись release-сборки, ProGuard/R8 на Android, GraalVM native-image для облака.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'gradle',
    label: 'Gradle-модули',
    era: 'Мультипроект',
    color: '#7F52FF',
    syntax: `// settings.gradle.kts
include(":app", ":shared", ":core:data")

// app/build.gradle.kts
dependencies {
    implementation(project(":shared"))
}`,
    traits: ['Изоляция кода', 'Отдельные build.gradle.kts', 'Переиспользование между app и lib'],
    tools: 'Android Studio, IntelliJ, Gradle Kotlin DSL',
    use: 'Крупные Android и backend-монорепозитории',
  },
  {
    id: 'kmp',
    label: 'KMP source sets',
    era: 'Multiplatform',
    color: '#10b981',
    syntax: `kotlin {
    androidTarget()
    iosArm64()
    sourceSets {
        commonMain.dependencies { ... }
        androidMain.dependencies { ... }
    }
}`,
    traits: ['commonMain — общий код', 'expect/actual', 'Разные зависимости на платформу'],
    tools: 'KMM Plugin, Compose Multiplatform',
    use: 'Общая бизнес-логика Android + iOS',
  },
  {
    id: 'feature',
    label: 'Dynamic features',
    era: 'Android (опц.)',
    color: '#f59e0b',
    syntax: `// settings.gradle.kts
include(":app", ":feature:analytics")

// app — implementation(project(":feature:analytics"))`,
    traits: ['Отложенная загрузка APK-модуля', 'Меньший базовый размер', 'Play Feature Delivery'],
    tools: 'AGP, bundletool',
    use: 'Аналитика, тяжёлые SDK, редко используемые экраны',
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
  const mavenCount = DEP_NODES.filter((n) => n.type === 'maven' && enabledNodeIds.has(n.id)).length;
  const chunks = hasAnalytics
    ? ['base.apk (~12 MB)', 'feature-analytics.apk (~2.1 MB)']
    : ['base.apk (~10 MB)'];
  return {chunks, hasAnalytics, mavenCount};
}
