/** Данные для ElixirEcosystemPlay — статья 5-19-elixir/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'supervision', label: 'OTP и супервизия'},
  {id: 'request', label: 'Запрос Phoenix'},
  {id: 'mix', label: 'Mix и Hex'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'beam',
    tag: 'Runtime',
    label: 'BEAM · Erlang VM',
    color: '#b8413a',
    icon: '⚡',
    items: ['процессы · mailbox', 'preemptive scheduler', 'per-process GC', 'hot code reload'],
    detail:
      'Виртуальная машина Ericsson: лёгкие изолированные процессы, сообщения вместо shared memory, распределённость через узлы и EPMD. Elixir исполняется поверх BEAM.',
  },
  {
    id: 'otp',
    tag: 'OTP',
    label: 'Behaviours · супервизия',
    color: '#f59e0b',
    icon: '🌳',
    items: ['GenServer · Supervisor', 'Application · Agent', 'Task · Registry'],
    detail:
      'Open Telecom Platform задаёт контракты: сервер с состоянием, дерево супервизии, жизненный цикл приложения. "Let it crash" + перезапуск дочерних процессов.',
  },
  {
    id: 'elixir',
    tag: 'Язык',
    label: 'Elixir · макросы',
    color: '#6e4a7e',
    icon: '💧',
    items: ['неизменяемость', 'pattern matching', 'pipe |> ', 'AST · quote/unquote'],
    detail:
      'Синтаксис и стандартная библиотека поверх Erlang/OTP. Макросы на этапе компиляции строят DSL (маршруты Phoenix, запросы Ecto) без динамики в рантайме.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Mix · Hex · IEx',
    color: '#10b981',
    icon: '🔧',
    items: ['mix new · compile · release', 'Hex.pm · mix deps', 'IEx · Observer · Dialyzer'],
    detail:
      'Mix — сборка, задачи, конфигурация per-env. Hex — реестр пакетов. IEx — REPL с инспекцией процессов; Observer визуализирует дерево процессов на живой VM.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Phoenix · Ecto · Broadway',
    color: '#06b6d4',
    icon: '⚙',
    items: ['Endpoint · LiveView', 'Ecto.Repo · changesets', 'GenStage · Broadway'],
    detail:
      'Phoenix — HTTP, WebSocket, каналы и LiveView. Ecto — схемы, запросы, миграции. Broadway — конвейеры сообщений (Kafka, SQS) с обратной связью GenStage.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш OTP-проект',
    color: '#6366f1',
    icon: '🏗',
    items: ['lib/my_app/', 'config/*.exs', 'mix.exs · releases', 'test/ · assets/'],
    detail:
      'Прикладной код — модули в lib/, супервизоры в application.ex, зависимости в mix.exs. Release упаковывает BEAM + конфиг для деплоя без установки Elixir на сервере.',
  },
];

export const FRAMEWORK_COMPARE = [
  {
    id: 'phoenix',
    label: 'Phoenix',
    color: '#ef4444',
    mvp: 5,
    scale: 5,
    fit: 'Веб, realtime, LiveView, API',
  },
  {
    id: 'broadway',
    label: 'Broadway',
    color: '#8b5cf6',
    mvp: 3,
    scale: 5,
    fit: 'Очереди, ETL, event pipelines',
  },
  {
    id: 'nerves',
    label: 'Nerves',
    color: '#10b981',
    mvp: 2,
    scale: 4,
    fit: 'Embedded, IoT, firmware',
  },
];

/** Узлы графа mix.exs (viewBox 420×250). */
export const DEP_NODES = [
  {id: 'application', label: 'Application', type: 'app', x: 210, y: 22},
  {id: 'router', label: 'Router', type: 'module', x: 70, y: 88},
  {id: 'live', label: 'LiveView', type: 'module', x: 210, y: 88},
  {id: 'workers', label: 'OrderWorker', type: 'process', x: 350, y: 88},
  {id: 'phoenix', label: 'phoenix', type: 'hex', x: 55, y: 175},
  {id: 'ecto', label: 'ecto_sql', type: 'hex', x: 145, y: 175},
  {id: 'telemetry', label: 'telemetry', type: 'hex', x: 235, y: 175},
  {id: 'oban', label: 'oban', type: 'hex', x: 325, y: 175},
  {id: 'pg', label: 'postgrex', type: 'hex', x: 395, y: 175},
];

export const DEP_EDGES = [
  ['application', 'router'],
  ['application', 'live'],
  ['application', 'workers'],
  ['router', 'phoenix'],
  ['live', 'phoenix'],
  ['live', 'ecto'],
  ['workers', 'oban'],
  ['workers', 'ecto'],
  ['application', 'telemetry'],
  ['ecto', 'pg'],
  ['oban', 'pg'],
  ['phoenix', 'telemetry'],
];

export const NODE_TYPE_META = {
  app: {label: 'OTP Application', stroke: '#6366f1'},
  module: {label: 'Модуль lib/', stroke: '#10b981'},
  process: {label: 'GenServer / worker', stroke: '#f59e0b', dash: '6 4'},
  hex: {label: 'Hex-зависимость', stroke: '#6e4a7e'},
};

export const ARCH_PRESETS = [
  {
    id: 'phoenix',
    label: 'Phoenix (монолит)',
    toolchain: 'Mix · Phoenix · Ecto · LiveView · Bandit/Cowboy',
    tree: [
      {
        type: 'dir',
        path: 'shop',
        children: [
          {
            type: 'file',
            path: 'shop/mix.exs',
            role: 'Манифест',
            hint: 'def application, deps: [:phoenix, :ecto_sql, :postgrex, :telemetry]',
          },
          {
            type: 'file',
            path: 'shop/config/config.exs',
            role: 'Конфиг',
            hint: 'import_config "#{config_env()}.exs" — dev/test/prod',
          },
          {
            type: 'file',
            path: 'shop/lib/shop/application.ex',
            role: 'OTP Application',
            hint: 'children: [ShopWeb.Endpoint, Shop.Repo, Shop.PubSub, ShopWeb.Telemetry]',
          },
          {
            type: 'dir',
            path: 'shop/lib/shop_web',
            role: 'Веб-слой',
            children: [
              {
                type: 'file',
                path: 'shop/lib/shop_web/router.ex',
                role: 'Router',
                hint: 'live "/orders", OrderLive.Index — макросы Phoenix',
              },
              {
                type: 'file',
                path: 'shop/lib/shop_web/endpoint.ex',
                role: 'Endpoint',
                hint: 'plug Pipeline → socket "/live" → LiveView',
              },
              {
                type: 'dir',
                path: 'shop/lib/shop_web/live',
                children: [
                  {
                    type: 'file',
                    path: 'shop/lib/shop_web/live/order_live/index.ex',
                    role: 'LiveView',
                    hint: 'mount · handle_event · render — один процесс на сессию',
                  },
                ],
              },
              {
                type: 'file',
                path: 'shop/lib/shop_web/controllers/order_controller.ex',
                role: 'Controller',
                hint: 'REST JSON — conn |> render(json: ...)',
              },
            ],
          },
          {
            type: 'dir',
            path: 'shop/lib/shop',
            role: 'Домен',
            children: [
              {
                type: 'file',
                path: 'shop/lib/shop/repo.ex',
                role: 'Ecto.Repo',
                hint: 'use Ecto.Repo — пул соединений под Supervisor',
              },
              {
                type: 'file',
                path: 'shop/lib/shop/orders.ex',
                role: 'Context',
                hint: 'def list_orders, create_order — бизнес-логика без HTTP',
              },
              {
                type: 'file',
                path: 'shop/lib/shop/orders/order.ex',
                role: 'Schema',
                hint: 'schema "orders" · changeset/2',
              },
            ],
          },
          {
            type: 'dir',
            path: 'shop/priv/repo/migrations',
            children: [
              {
                type: 'file',
                path: 'shop/priv/repo/migrations/20240101000000_create_orders.exs',
                role: 'Миграция',
                hint: 'mix ecto.migrate — версионирование схемы БД',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'umbrella',
    label: 'Umbrella-проект',
    toolchain: 'apps/web · apps/core · apps/billing · общий _build',
    tree: [
      {
        type: 'dir',
        path: 'platform',
        children: [
          {
            type: 'file',
            path: 'platform/mix.exs',
            role: 'Umbrella root',
            hint: 'apps_path: "apps" — несколько OTP-приложений в одном репо',
          },
          {
            type: 'dir',
            path: 'platform/apps/core',
            children: [
              {
                type: 'file',
                path: 'platform/apps/core/mix.exs',
                role: 'core',
                hint: 'in_umbrella — зависимость без публикации в Hex',
              },
              {
                type: 'file',
                path: 'platform/apps/core/lib/core/accounts.ex',
                role: 'Shared domain',
                hint: 'Общие контексты для web и billing',
              },
            ],
          },
          {
            type: 'dir',
            path: 'platform/apps/web',
            children: [
              {
                type: 'file',
                path: 'platform/apps/web/mix.exs',
                role: 'web',
                hint: '{:core, in_umbrella: true} · {:phoenix, "~> 1.7"}',
              },
              {
                type: 'file',
                path: 'platform/apps/web/lib/web/application.ex',
                role: 'Web app',
                hint: 'Запускает Endpoint; зависит от Core.Repo через in_umbrella',
              },
            ],
          },
          {
            type: 'dir',
            path: 'platform/apps/billing',
            children: [
              {
                type: 'file',
                path: 'platform/apps/billing/lib/billing/worker.ex',
                role: 'GenServer',
                hint: 'Отдельное OTP-приложение — фоновые списания, Oban',
              },
            ],
          },
          {
            type: 'file',
            path: 'platform/config/runtime.exs',
            role: 'Release config',
            hint: 'DATABASE_URL · SECRET_KEY_BASE — env при mix release',
          },
        ],
      },
    ],
  },
  {
    id: 'distributed',
    label: 'Распределённый узел',
    toolchain: 'libcluster · Horde · DNS · cookie · EPMD',
    tree: [
      {
        type: 'dir',
        path: 'chat',
        children: [
          {
            type: 'file',
            path: 'chat/mix.exs',
            role: 'Deps',
            hint: 'libcluster, horde — обнаружение узлов и репликация Registry',
          },
          {
            type: 'file',
            path: 'chat/lib/chat/application.ex',
            role: 'Supervision',
            hint: 'Cluster.Supervisor → Horde.Registry → Presence / RoomSupervisor',
          },
          {
            type: 'file',
            path: 'chat/lib/chat/cluster.ex',
            role: 'libcluster',
            hint: 'topologies: [strategy: Cluster.Strategy.Kubernetes.DNS]',
          },
          {
            type: 'file',
            path: 'chat/lib/chat/room.ex',
            role: 'GenServer',
            hint: 'Process.whereis({:global, room_id}) — сообщения между узлами',
          },
          {
            type: 'file',
            path: 'chat/rel/env.sh.eex',
            role: 'Release',
            hint: 'RELEASE_DISTRIBUTION=name@host · RELEASE_COOKIE',
          },
        ],
      },
    ],
  },
];

export const SUPERVISION_PRESETS = [
  {
    id: 'phoenix',
    label: 'Phoenix-приложение',
    rootStrategy: ':one_for_one',
    root: 'MyApp.Application',
    nodes: [
      {id: 'endpoint_sup', label: 'Endpoint Supervisor', parent: 'root', type: 'supervisor', strategy: ':one_for_one'},
      {id: 'endpoint', label: 'MyAppWeb.Endpoint', parent: 'endpoint_sup', type: 'worker'},
      {id: 'pubsub', label: 'Phoenix.PubSub', parent: 'endpoint_sup', type: 'worker'},
      {id: 'repo_sup', label: 'Repo Supervisor', parent: 'root', type: 'supervisor', strategy: ':one_for_one'},
      {id: 'repo', label: 'MyApp.Repo', parent: 'repo_sup', type: 'worker'},
      {id: 'domain_sup', label: 'Domain Supervisor', parent: 'root', type: 'supervisor', strategy: ':rest_for_one'},
      {id: 'cache', label: 'CacheServer', parent: 'domain_sup', type: 'worker'},
      {id: 'processor', label: 'OrderProcessor', parent: 'domain_sup', type: 'worker'},
    ],
    crashHint:
      'Падение OrderProcessor перезапускает его и процессы, запущенные после него (:rest_for_one). Endpoint и Repo изолированы (:one_for_one).',
  },
  {
    id: 'broadway',
    label: 'Broadway pipeline',
    rootStrategy: ':one_for_one',
    root: 'Ingest.Application',
    nodes: [
      {id: 'broadway_sup', label: 'Broadway Supervisor', parent: 'root', type: 'supervisor', strategy: ':one_for_one'},
      {id: 'producer', label: 'Kafka.Producer', parent: 'broadway_sup', type: 'worker'},
      {id: 'broadway', label: 'MyPipeline (Broadway)', parent: 'broadway_sup', type: 'worker'},
      {id: 'batchers', label: 'Batchers / Processors', parent: 'broadway', type: 'worker'},
      {id: 'telemetry', label: 'Telemetry handlers', parent: 'root', type: 'worker'},
    ],
    crashHint:
      'Сбой в batcher — Broadway перезапускает стадию; GenStage контролирует demand. Внешний брокер хранит offset — at-least-once доставка.',
  },
  {
    id: 'simple',
    label: 'Минимальный GenServer',
    rootStrategy: ':one_for_one',
    root: 'Counter.Application',
    nodes: [
      {id: 'sup', label: 'Counter.Supervisor', parent: 'root', type: 'supervisor', strategy: ':one_for_one'},
      {id: 'counter', label: 'Counter.Server', parent: 'sup', type: 'worker'},
    ],
    crashHint:
      'Единственный worker: любой crash → Supervisor вызывает start_link заново. Состояние теряется, если не восстановить из внешнего хранилища.',
  },
];

export const RESTART_STRATEGIES = [
  {
    id: 'one_for_one',
    label: ':one_for_one',
    desc: 'Перезапускается только упавший дочерний процесс.',
    when: 'Независимые воркеры: Endpoint, Repo, отдельные GenServer.',
  },
  {
    id: 'one_for_all',
    label: ':one_for_all',
    desc: 'Перезапускается вся группа дочерних процессов.',
    when: 'Общее состояние: кластер воркеров с shared ETS.',
  },
  {
    id: 'rest_for_one',
    label: ':rest_for_one',
    desc: 'Перезапуск упавшего и всех запущенных после него.',
    when: 'Цепочка инициализации: Cache → Processor → Consumer.',
  },
  {
    id: 'simple_one_for_one',
    label: ':simple_one_for_one',
    desc: 'Динамическое добавление однотипных детей.',
    when: 'Пул соединений, тысячи Room-процессов по требованию.',
  },
];

export const REQUEST_STEPS = [
  {
    id: 'tcp',
    label: 'TCP',
    cmd: '# Bandit принимает соединение\n# MyAppWeb.Endpoint — первый plug в цепочке',
    detail: 'HTTP-сервер (Bandit/Cowboy) передаёт conn в Endpoint. Каждый plug — функция conn → conn.',
    activePlugs: ['endpoint'],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    cmd: 'plug :accepts, ["html", "json"]\nplug :fetch_session\nplug :protect_from_forgery',
    detail: 'Общие plug-и: сессия, CSRF, static assets. Ошибка на этом этапе не роняет VM — только этот запрос.',
    activePlugs: ['endpoint', 'pipeline', 'router'],
  },
  {
    id: 'router',
    label: 'Router',
    cmd: 'get "/orders", OrderController, :index\nlive "/orders/:id", OrderLive.Show',
    detail: 'Макросы compile-time строят match на path. Controller — stateless; LiveView — долгоживущий процесс + WebSocket.',
    activePlugs: ['endpoint', 'pipeline', 'router', 'dispatch'],
  },
  {
    id: 'context',
    label: 'Context',
    cmd: 'def index(conn, _) do\n  orders = Orders.list_orders()\n  render(conn, :index, orders: orders)\nend',
    detail: 'Контекст (Orders) вызывает Repo/Ecto. Запрос к БД — через пул под Supervisor; таймауты и reconnect автоматические.',
    activePlugs: ['endpoint', 'pipeline', 'router', 'dispatch', 'ecto'],
  },
  {
    id: 'liveview',
    label: 'LiveView',
    cmd: 'def mount(_params, _session, socket) do\n  {:ok, assign(socket, :orders, Orders.list_orders())}\nend',
    detail:
      'После mount — процесс LiveView получает events по WebSocket. Изменение assign → diff HTML → push клиенту. PubSub синхронизирует несколько вкладок.',
    activePlugs: ['endpoint', 'pipeline', 'router', 'live', 'pubsub'],
  },
];

export const PHOENIX_PLUGS = [
  {id: 'endpoint', label: 'Endpoint'},
  {id: 'pipeline', label: 'Browser pipeline'},
  {id: 'router', label: 'Router'},
  {id: 'dispatch', label: 'Controller / LiveView'},
  {id: 'ecto', label: 'Ecto.Repo'},
  {id: 'live', label: 'LiveView process'},
  {id: 'pubsub', label: 'PubSub broadcast'},
];

export const MIX_SYSTEMS = [
  {
    id: 'hex',
    label: 'Hex.pm',
    era: 'Зависимости',
    color: '#6e4a7e',
    syntax: `# mix.exs
defp deps do
  [
    {:phoenix, "~> 1.7"},
    {:ecto_sql, "~> 3.11"},
    {:postgrex, ">= 0.0.0"}
  ]
end

# mix deps.get  →  _build + deps/
# mix hex.outdated`,
    traits: ['Семантические версии', 'lock в mix.lock', 'транзитивные deps', 'private Hex org'],
    tools: 'mix deps · mix hex.publish · dependabot',
    use: 'Любой Phoenix/Ecto-проект',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    era: 'Mix · BEAM',
    color: '#b8413a',
    syntax: `$ mix compile
# .ex → .beam в _build/dev/lib/my_app/ebin/
# макросы раскрываются на compile-time

$ mix test
$ mix format`,
    traits: ['Параллельная сборка apps', 'warnings as errors в CI', 'protocol consolidation'],
    tools: 'mix compile · mix test · mix format · Credo',
    use: 'Локальная разработка и CI',
  },
  {
    id: 'release',
    label: 'Release',
    era: 'Деплой',
    color: '#10b981',
    syntax: `$ mix release
# _build/prod/rel/my_app/
#   bin/my_app start
#   releases/0.1.0/my_app-0.1.0.tar.gz

# runtime.exs — DATABASE_URL из env`,
    traits: ['Встроенный BEAM', 'hot upgrade опционально', 'remote console', 'rolling deploy в K8s'],
    tools: 'mix release · Docker · Fly.io · Gigalixir',
    use: 'Production без asdf на сервере',
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

export function getSupervisionPreset(id) {
  return SUPERVISION_PRESETS.find((p) => p.id === id) ?? SUPERVISION_PRESETS[0];
}

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasWorkers = enabledNodeIds.has('workers');
  const hexCount = DEP_NODES.filter((n) => n.type === 'hex' && enabledNodeIds.has(n.id)).length;
  const layers = hasWorkers
    ? ['Application → Router · LiveView · OrderWorker', `Hex в графе: ${hexCount}`]
    : ['Application → Router · LiveView', `Hex в графе: ${hexCount - 1}`];
  return {layers, hasWorkers, hexCount};
}

/** Дерево супервизии для визуализации (плоский → вложенный). */
export function buildSupervisionTree(preset) {
  const byParent = new Map();
  for (const n of preset.nodes) {
    const p = n.parent;
    if (!byParent.has(p)) byParent.set(p, []);
    byParent.get(p).push(n);
  }
  function branch(parentId) {
    return (byParent.get(parentId) ?? []).map((n) => ({
      ...n,
      children: branch(n.id),
    }));
  }
  return {
    id: 'root',
    label: preset.root,
    type: 'application',
    strategy: preset.rootStrategy,
    children: branch('root'),
  };
}
