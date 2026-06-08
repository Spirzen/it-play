/** Данные для ScalaEcosystemPlay — статья 5-18-scala/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и артефакты'},
  {id: 'modules', label: 'Модули sbt'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'language',
    tag: 'Язык',
    label: 'Scala · компилятор',
    color: '#DE3423',
    icon: 'λ',
    items: ['Scala 3 · Dotty', 'трейты · ADT · given', 'макросы · inline'],
    detail:
      'Исходники .scala компилируются в байткод JVM, JavaScript (Scala.js) или нативный код (Scala Native). Одна модель типов — несколько целевых платформ.',
  },
  {
    id: 'runtime',
    tag: 'Платформы',
    label: 'JVM · JS · Native',
    color: '#3b82f6',
    icon: '⚙',
    items: ['JVM 17+ · GraalVM', 'Scala.js · bundler', 'Scala Native · LLVM'],
    detail:
      'На JVM Scala бесшовно использует Java-библиотеки и инструменты мониторинга. Scala.js — общий код с фронтом. Native — системные и встраиваемые сценарии без GC JVM.',
  },
  {
    id: 'build',
    tag: 'Сборка',
    label: 'sbt · Mill · Bazel',
    color: '#10b981',
    icon: '📦',
    items: ['build.sbt · project/', 'crossScalaVersions', 'assembly · docker', 'scalafmt · scalafix'],
    detail:
      'sbt описывает модули, зависимости Ivy/Maven и цели compile/test/package. Mill и Bazel — альтернативы для крупных монорепозиториев с воспроизводимыми сборками.',
  },
  {
    id: 'libs',
    tag: 'Библиотеки',
    label: 'Cats · ZIO · Circe',
    color: '#ec4899',
    icon: '📚',
    items: ['cats-effect · fs2', 'zio · zio-http', 'circe · play-json', 'slick · doobie'],
    detail:
      'Экосистема Typelevel и коммерческие стеки: функциональные эффекты, потоки, JSON, доступ к БД. Подключаются как libraryDependencies в sbt.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Play · Akka · Spark',
    color: '#06b6d4',
    icon: '🏗',
    items: ['Play Framework', 'Akka · Pekko', 'Apache Spark', 'http4s · tapir'],
    detail:
      'Фреймворки задают каркас: Play — MVC/REST на JVM, Akka/Pekko — акторы и стриминг, Spark — распределённая аналитика. http4s/tapir — "чистый" FP-стек поверх Cats Effect.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '📱',
    items: ['controllers · routes', 'domain · services', 'actors · streams', 'repositories'],
    detail:
      'Прикладные слои: HTTP-маршруты, доменная логика на чистых функциях, изоляция эффектов (ZIO/Cats), репозитории к БД. Мультимодульный sbt делит api, domain и infra.',
  },
];

/** Узлы графа зависимостей (viewBox 400×260). */
export const DEP_NODES = [
  {id: 'main', label: 'Main.scala', type: 'app', x: 200, y: 24},
  {id: 'routes', label: 'controllers/', type: 'module', x: 80, y: 90},
  {id: 'domain', label: 'domain/', type: 'module', x: 200, y: 90},
  {id: 'actors', label: 'actors/', type: 'lazy', x: 320, y: 90},
  {id: 'infra', label: 'infrastructure/', type: 'module', x: 200, y: 148},
  {id: 'play', label: 'play-*', type: 'maven', x: 40, y: 210},
  {id: 'akka', label: 'pekko-*', type: 'maven', x: 120, y: 210},
  {id: 'zio', label: 'zio-*', type: 'maven', x: 220, y: 210},
  {id: 'slick', label: 'slick', type: 'maven', x: 300, y: 210},
  {id: 'circe', label: 'circe', type: 'maven', x: 360, y: 210},
];

export const DEP_EDGES = [
  ['main', 'routes'],
  ['main', 'domain'],
  ['main', 'actors'],
  ['routes', 'play'],
  ['routes', 'domain'],
  ['domain', 'infra'],
  ['domain', 'circe'],
  ['infra', 'slick'],
  ['infra', 'zio'],
  ['actors', 'akka'],
  ['actors', 'zio'],
  ['actors', 'circe'],
  ['infra', 'akka'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Прикладной слой', stroke: '#10b981'},
  lazy: {label: 'Акторы / стримы', stroke: '#f59e0b', dash: '6 4'},
  maven: {label: 'Maven / Ivy', stroke: '#DE3423'},
};

export const ARCH_PRESETS = [
  {
    id: 'play-service',
    label: 'Play + Slick',
    toolchain: 'sbt · Play 3 · Guice · Slick · Circe',
    tree: [
      {
        type: 'dir',
        path: 'crm-play',
        children: [
          {type: 'file', path: 'crm-play/build.sbt', role: 'Корень sbt', hint: 'lazy val root = project.in(file(".")).enablePlugins(PlayScala)'},
          {type: 'file', path: 'crm-play/project/plugins.sbt', role: 'Плагины', hint: 'addSbtPlugin("org.playframework" % "sbt-plugin" % "...")'},
          {type: 'file', path: 'crm-play/conf/application.conf', role: 'Конфиг', hint: 'db.url, play.http.secret.key'},
          {type: 'file', path: 'crm-play/conf/routes', role: 'Маршруты', hint: 'GET /api/orders  controllers.OrderController.list'},
          {
            type: 'dir',
            path: 'crm-play/app',
            children: [
              {
                type: 'dir',
                path: 'crm-play/app/controllers',
                children: [
                  {type: 'file', path: 'crm-play/app/controllers/OrderController.scala', role: 'Action', hint: 'def list = Action.async { ... }'},
                ],
              },
              {
                type: 'dir',
                path: 'crm-play/app/domain',
                children: [
                  {type: 'file', path: 'crm-play/app/domain/OrderService.scala', role: 'Сервис', hint: 'case class Order, sealed trait OrderStatus'},
                ],
              },
              {
                type: 'dir',
                path: 'crm-play/app/infrastructure',
                children: [
                  {type: 'file', path: 'crm-play/app/infrastructure/OrderRepository.scala', role: 'Slick', hint: 'TableQuery[Orders], DBIO'},
                  {type: 'file', path: 'crm-play/app/infrastructure/DatabaseModule.scala', role: 'Guice', hint: '@Provides def db: Database'},
                ],
              },
              {type: 'file', path: 'crm-play/app/Main.scala', role: 'Bootstrap', hint: 'Play auto-loads Application loader'},
            ],
          },
          {type: 'file', path: 'crm-play/target/universal/stage/bin/crm-play', role: 'Dist', hint: 'sbt dist → fat layout для Docker'},
        ],
      },
    ],
  },
  {
    id: 'zio-http',
    label: 'ZIO HTTP + Doobie',
    toolchain: 'ZLayer · http4s-стиль · HikariCP · Flyway',
    tree: [
      {
        type: 'dir',
        path: 'api-zio',
        children: [
          {type: 'file', path: 'api-zio/build.sbt', role: 'sbt', hint: 'libraryDependencies ++= Seq(zio, zio-http, doobie, circe)'},
          {
            type: 'dir',
            path: 'api-zio/src/main/scala',
            children: [
              {type: 'file', path: 'api-zio/src/main/scala/Main.scala', role: 'Entry', hint: 'ZIOAppDefault, Server.serve(routes)'},
              {
                type: 'dir',
                path: 'api-zio/src/main/scala/http',
                children: [
                  {type: 'file', path: 'api-zio/src/main/scala/http/Routes.scala', role: 'Routes', hint: 'Method.GET /orders -> handler'},
                ],
              },
              {
                type: 'dir',
                path: 'api-zio/src/main/scala/domain',
                children: [
                  {type: 'file', path: 'api-zio/src/main/scala/domain/OrderService.scala', role: 'Pure logic', hint: 'ZIO[R, E, A], Either для ошибок'},
                ],
              },
              {
                type: 'dir',
                path: 'api-zio/src/main/scala/infrastructure',
                children: [
                  {type: 'file', path: 'api-zio/src/main/scala/infrastructure/OrderRepo.scala', role: 'Doobie', hint: 'transactor, sql"select ..."'},
                  {type: 'file', path: 'api-zio/src/main/scala/infrastructure/AppLayers.scala', role: 'ZLayer', hint: 'val live = OrderRepo.live >>> OrderService.live'},
                ],
              },
            ],
          },
          {type: 'file', path: 'api-zio/src/main/resources/application.conf', role: 'Config', hint: 'Typesafe Config → ZLayer.fromZIO'},
        ],
      },
    ],
  },
  {
    id: 'akka-cluster',
    label: 'Pekko Cluster',
    toolchain: 'sharding · persistence · HTTP API',
    tree: [
      {
        type: 'dir',
        path: 'stream-akka',
        children: [
          {type: 'file', path: 'stream-akka/build.sbt', role: 'sbt', hint: 'pekko-actor-typed, pekko-cluster-sharding, pekko-http'},
          {
            type: 'dir',
            path: 'stream-akka/src/main/scala',
            children: [
              {type: 'file', path: 'stream-akka/src/main/scala/Main.scala', role: 'ActorSystem', hint: 'ActorSystem[RootBehavior]'},
              {
                type: 'dir',
                path: 'stream-akka/src/main/scala/actors',
                children: [
                  {type: 'file', path: 'stream-akka/src/main/scala/actors/OrderActor.scala', role: 'Behavior', hint: 'receiveMessage, stash, supervisor'},
                  {type: 'file', path: 'stream-akka/src/main/scala/actors/Sharding.scala', role: 'Cluster', hint: 'EntityTypeKey, sharding region'},
                ],
              },
              {type: 'file', path: 'stream-akka/src/main/scala/HttpRoutes.scala', role: 'Pekko HTTP', hint: 'path("orders") { complete(...) }'},
              {type: 'file', path: 'stream-akka/src/main/resources/application.conf', role: 'Cluster', hint: 'pekko.remote, seed-nodes'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sbt-multimodule',
    label: 'sbt мультимодуль',
    toolchain: 'api · domain · infra · shared JVM/JS',
    tree: [
      {
        type: 'dir',
        path: 'platform-scala',
        children: [
          {type: 'file', path: 'platform-scala/build.sbt', role: 'Агрегатор', hint: 'lazy val root = (api / domain / infra).aggregate(...)'},
          {type: 'file', path: 'platform-scala/project/Dependencies.scala', role: 'Версии', hint: 'object V { val zio, val circe }'},
          {
            type: 'dir',
            path: 'platform-scala/modules/domain',
            children: [
              {type: 'file', path: 'platform-scala/modules/domain/build.sbt', role: 'Чистый модуль', hint: 'без Play/Akka — только Scala + cats-core'},
              {type: 'file', path: 'platform-scala/modules/domain/src/main/scala/Order.scala', role: 'ADT', hint: 'sealed trait Order; case class Placed(...)'},
            ],
          },
          {
            type: 'dir',
            path: 'platform-scala/modules/api',
            children: [
              {type: 'file', path: 'platform-scala/modules/api/build.sbt', role: 'HTTP', hint: 'dependsOn(domain, infra)'},
              {type: 'file', path: 'platform-scala/modules/api/src/main/scala/Main.scala', role: 'Сборка слоёв', hint: 'api подключает domain + infra в runtime'},
            ],
          },
          {
            type: 'dir',
            path: 'platform-scala/modules/infra',
            children: [
              {type: 'file', path: 'platform-scala/modules/infra/build.sbt', role: 'IO', hint: 'slick, redis client'},
              {type: 'file', path: 'platform-scala/modules/infra/src/main/scala/OrderRepoLive.scala', role: 'Реализация', hint: 'trait OrderRepo в domain, impl здесь'},
            ],
          },
          {type: 'file', path: 'platform-scala/modules/shared-js/', role: 'Scala.js', hint: 'crossProject(JSPlatform, JVMPlatform)'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'source',
    label: 'Исходники',
    cmd: 'src/main/scala/**/*.scala\nimport zio._\nimport play.api.mvc._',
    detail: 'Пакеты и импорты образуют граф. scalac и IDE проверяют типы, implicits/given и exhaustiveness match.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: 'scalac (Dotty)  →  .class (JVM)\nScala.js  →  .js\nScala Native  →  объектный файл',
    detail: 'Компилятор выбирает backend по настройке проекта: JVM для сервисов, JS для фронта, Native для бинарников без JVM.',
  },
  {
    id: 'resolve',
    label: 'Зависимости',
    cmd: 'sbt update  →  Coursier / Ivy  →  ~/.ivy2 / cache\nlibraryDependencies += "org.typelevel" %% "cats-effect" % "3.x"',
    detail: '%% подставляет версию Scala (_2.13 / _3). Конфликты версий решаются в eviction rules; lockfile — через sbt-dependency-lock или Bazel.',
  },
  {
    id: 'link',
    label: 'Сборка JAR',
    cmd: 'sbt compile test package\nsbt assembly  # fat JAR\nsbt docker:publish',
    detail: 'package — модульный JAR; assembly — uber-jar со всеми зависимостями; docker-плагин упаковывает dist в образ.',
  },
  {
    id: 'interop',
    label: 'Java interop',
    cmd: '// Scala вызывает Java\nimport java.util.Optional\n// Java вызывает Scala — static forwarders',
    detail: 'Scala-классы компилируются в bytecode, совместимый с Java. Трейты → интерфейсы + синтетические классы.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: 'java -jar api-assembly.jar\n# или\nkubectl apply -f deployment.yaml',
    detail: 'На JVM — контейнер с JRE/GraalVM. Spark — submit в кластер. Play dist — staged каталог + reverse proxy.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'sbt-single',
    label: 'Один проект sbt',
    era: 'Сервис · MVP',
    color: '#DE3423',
    syntax: `// build.sbt
lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    scalaVersion := "3.3.4",
    libraryDependencies ++= Seq(
      "org.playframework" %% "play" % "3.0.0",
      "com.typesafe.slick" %% "slick" % "3.5.0"
    )
  )`,
    traits: ['Один build.sbt', 'app/ или src/main/scala', 'Быстрый старт Play/ZIO'],
    tools: 'sbt run · sbt test · Metals (VS Code)',
    use: 'REST-сервис, прототип, учебный проект',
  },
  {
    id: 'sbt-multi',
    label: 'Мультимодульный sbt',
    era: 'Монорепозиторий',
    color: '#10b981',
    syntax: `// build.sbt
lazy val domain = project.in(file("modules/domain"))
lazy val infra  = project.in(file("modules/infra")).dependsOn(domain)
lazy val api    = project.in(file("modules/api")).dependsOn(domain, infra)
  .enablePlugins(JavaAppPackaging)`,
    traits: ['Границы domain/infra/api', 'dependsOn без циклов', 'Общий код в shared'],
    tools: 'sbt project api / compile · scalafix --check',
    use: 'Крупные JVM-системы, DDD-слои, переиспользование domain',
  },
  {
    id: 'cross',
    label: 'Cross-build JVM + JS',
    era: 'Scala.js · full-stack',
    color: '#3b82f6',
    syntax: `lazy val shared = crossProject(JSPlatform, JVMPlatform)
  .in(file("modules/shared"))
  .jvmSettings(/* Play backend */)
  .jsSettings(/* Laminar / React wrapper */)`,
    traits: ['Общие ADT и валидация', 'Разные зависимости на платформу', 'Сборка через sbt + bundler'],
    tools: 'scala-js · vite/esbuild · sbt ~fastOptJS',
    use: 'Единые модели данных backend + frontend',
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
  const hasActors = enabledNodeIds.has('actors');
  const mavenCount = DEP_NODES.filter((n) => n.type === 'maven' && enabledNodeIds.has(n.id)).length;
  const chunks = hasActors
    ? ['api.jar (~18 MB)', 'pekko-cluster (~4 MB)', 'actors/ в classpath']
    : ['api.jar (~14 MB)', 'без pekko-cluster'];
  return {chunks, hasActors, mavenCount};
}
