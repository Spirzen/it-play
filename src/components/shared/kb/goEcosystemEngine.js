/** Данные для GoEcosystemPlay — статья 5-10-go/111. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и деплой'},
  {id: 'modules', label: 'Модули и пакеты'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'toolchain',
    tag: 'Toolchain',
    label: 'Компилятор и runtime',
    color: '#00add8',
    icon: '⚙',
    items: ['go build · go run', 'GC · goroutines · channels', 'Один статический бинарник'],
    detail:
      'Компилятор собирает зависимости в один исполняемый файл без JVM/интерпретатора. Runtime вшит: планировщик горутин, сборщик мусора, netpoller для I/O.',
  },
  {
    id: 'stdlib',
    tag: 'Стандартная библиотека',
    label: 'stdlib · batteries included',
    color: '#5ac8e8',
    icon: '📚',
    items: ['net/http · context', 'encoding/json', 'database/sql · testing'],
    detail:
      'net/http — основа веб-сервисов без фреймворка. context отменяет операции по таймауту. database/sql — единый интерфейс к SQL через драйверы.',
  },
  {
    id: 'gomod',
    tag: 'Зависимости',
    label: 'Go Modules · proxy',
    color: '#10b981',
    icon: '📦',
    items: ['go.mod · go.sum', 'go get · go mod tidy', 'proxy.golang.org'],
    detail:
      'Каждый проект — модуль с путём вида github.com/org/app. go mod tidy синхронизирует зависимости; go.sum фиксирует хеши для воспроизводимых сборок.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Качество и отладка',
    color: '#ec4899',
    icon: '🔧',
    items: ['go test · -cover', 'golangci-lint · staticcheck', 'Delve · go generate'],
    detail:
      'go test — юнит-тесты и бенчмарки в _test.go. golangci-lint объединяет линтеры в CI. Delve отлаживает горутины; go generate запускает protoc, mockgen, ent.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Веб · gRPC · GUI · TUI',
    color: '#06b6d4',
    icon: '🌐',
    items: ['Gin · Echo · Fiber', 'gRPC · protobuf', 'GORM · Ent', 'Fyne · Wails · Bubble Tea'],
    detail:
      'Фреймворк задаёт маршрутизацию и middleware поверх net/http. gRPC — контракт через .proto. ORM (GORM, Ent) и брокеры (Kafka, NATS) подключаются как go get.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['cmd/ · internal/', 'handlers · services', 'repository · workers'],
    detail:
      'cmd/ — точки входа (main). internal/ — приватные пакеты модуля. Чистая/гексагональная архитектура: HTTP/gRPC → service → store, тесты с моками интерфейсов.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'cmd/api/main.go', type: 'app', x: 200, y: 24},
  {id: 'http', label: 'internal/http', type: 'module', x: 70, y: 90},
  {id: 'service', label: 'internal/service', type: 'module', x: 200, y: 90},
  {id: 'worker', label: 'internal/worker', type: 'lazy', x: 330, y: 90},
  {id: 'gin', label: 'github.com/gin-gonic/gin', type: 'mod', x: 50, y: 168},
  {id: 'grpc', label: 'google.golang.org/grpc', type: 'mod', x: 130, y: 168},
  {id: 'gorm', label: 'gorm.io/gorm', type: 'mod', x: 210, y: 168},
  {id: 'zap', label: 'go.uber.org/zap', type: 'mod', x: 290, y: 168},
  {id: 'nats', label: 'github.com/nats-io/nats.go', type: 'mod', x: 360, y: 168},
];

export const DEP_EDGES = [
  ['main', 'http'],
  ['main', 'service'],
  ['main', 'worker'],
  ['http', 'gin'],
  ['http', 'service'],
  ['service', 'gorm'],
  ['service', 'grpc'],
  ['service', 'zap'],
  ['worker', 'nats'],
  ['worker', 'service'],
  ['worker', 'zap'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Пакет internal/', stroke: '#10b981'},
  lazy: {label: 'Фоновый worker', stroke: '#f59e0b', dash: '6 4'},
  mod: {label: 'go.mod require', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'gin-clean',
    label: 'REST + Gin (clean)',
    toolchain: 'go mod · Gin · GORM · zap · Docker',
    tree: [
      {
        type: 'dir',
        path: 'orders-api',
        children: [
          {type: 'file', path: 'orders-api/go.mod', role: 'Модуль', hint: 'module github.com/acme/orders-api; require gin, gorm, zap'},
          {type: 'file', path: 'orders-api/go.sum', role: 'Целостность', hint: 'Хеши зависимостей — коммитить в git'},
          {type: 'file', path: 'orders-api/Makefile', role: 'Автоматизация', hint: 'test, lint, docker build'},
          {
            type: 'dir',
            path: 'orders-api/cmd',
            children: [
              {type: 'file', path: 'orders-api/cmd/api/main.go', role: 'main', hint: 'gin.Engine, graceful shutdown, ListenAndServe'},
            ],
          },
          {
            type: 'dir',
            path: 'orders-api/internal',
            children: [
              {
                type: 'dir',
                path: 'orders-api/internal/http',
                role: 'Транспорт',
                children: [
                  {type: 'file', path: 'orders-api/internal/http/router.go', role: 'Маршруты', hint: 'gin.GET("/orders", h.List)'},
                  {type: 'file', path: 'orders-api/internal/http/handlers.go', role: 'Handlers', hint: 'Парсинг JSON, вызов service, коды ответа'},
                ],
              },
              {
                type: 'dir',
                path: 'orders-api/internal/service',
                role: 'Бизнес-логика',
                children: [
                  {type: 'file', path: 'orders-api/internal/service/order.go', role: 'Use cases', hint: 'Интерфейс OrderRepository — мок в тестах'},
                ],
              },
              {
                type: 'dir',
                path: 'orders-api/internal/store',
                role: 'Данные',
                children: [
                  {type: 'file', path: 'orders-api/internal/store/postgres.go', role: 'GORM', hint: 'database/sql + gorm.Open, миграции'},
                ],
              },
            ],
          },
          {type: 'file', path: 'orders-api/Dockerfile', role: 'Контейнер', hint: 'multi-stage: go build → distroless/scratch'},
        ],
      },
    ],
  },
  {
    id: 'grpc',
    label: 'gRPC-микросервис',
    toolchain: 'protoc · buf · grpc · Kubernetes',
    tree: [
      {
        type: 'dir',
        path: 'billing-svc',
        children: [
          {type: 'file', path: 'billing-svc/go.mod', role: 'Модуль', hint: 'google.golang.org/grpc, protobuf runtime'},
          {
            type: 'dir',
            path: 'billing-svc/api',
            role: 'Контракт',
            children: [
              {type: 'file', path: 'billing-svc/api/billing/v1/billing.proto', role: 'Proto', hint: 'service Billing { rpc Charge(...) }'},
              {type: 'file', path: 'billing-svc/api/billing/v1/billing.pb.go', role: 'Сгенерировано', hint: '//go:generate protoc ...'},
            ],
          },
          {type: 'file', path: 'billing-svc/cmd/server/main.go', role: 'gRPC server', hint: 'grpc.NewServer(), RegisterBillingServer'},
          {
            type: 'dir',
            path: 'billing-svc/internal',
            children: [
              {type: 'file', path: 'billing-svc/internal/server/grpc.go', role: 'Реализация', hint: 'Встраивает UnimplementedBillingServer'},
              {type: 'file', path: 'billing-svc/internal/client/payment.go', role: 'Исходящий gRPC/HTTP', hint: 'context.WithTimeout, retry, otel'},
            ],
          },
          {type: 'file', path: 'billing-svc/deploy/k8s/deployment.yaml', role: 'Оркестрация', hint: 'liveness: grpc_health_probe'},
        ],
      },
    ],
  },
  {
    id: 'worker-cli',
    label: 'CLI + фоновые worker',
    toolchain: 'cobra · NATS · robfig/cron',
    tree: [
      {
        type: 'dir',
        path: 'sync-tool',
        children: [
          {type: 'file', path: 'sync-tool/go.mod', role: 'Модуль', hint: 'spf13/cobra, nats.go, robfig/cron'},
          {
            type: 'dir',
            path: 'sync-tool/cmd',
            children: [
              {type: 'file', path: 'sync-tool/cmd/sync/main.go', role: 'CLI root', hint: 'cobra.Command: sync run, sync worker'},
            ],
          },
          {
            type: 'dir',
            path: 'sync-tool/internal',
            children: [
              {type: 'file', path: 'sync-tool/internal/worker/consumer.go', role: 'NATS consumer', hint: 'Subscribe, Ack, горутина на сообщение'},
              {type: 'file', path: 'sync-tool/internal/scheduler/cron.go', role: 'Планировщик', hint: 'cron.AddFunc — очистка кэша по расписанию'},
              {type: 'file', path: 'sync-tool/internal/config/config.go', role: 'Конфиг', hint: 'env + viper, флаги cobra'},
            ],
          },
          {type: 'file', path: 'sync-tool/main_test.go', role: 'Тесты', hint: 'go test, testify/assert, table-driven'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'mod',
    label: 'go.mod',
    cmd: 'go mod init github.com/acme/orders-api\ngo get github.com/gin-gonic/gin@v1.10\ngo mod tidy',
    detail: 'init создаёт модуль; get добавляет require; tidy убирает неиспользуемые зависимости и дополняет go.sum.',
  },
  {
    id: 'compile',
    label: 'Сборка',
    cmd: 'go build -o bin/api ./cmd/api\n# CGO_ENABLED=0 GOOS=linux go build ...',
    detail: 'Компилятор статически линкует зависимости. Кросс-компиляция: GOOS/GOARCH. Один бинарник — простой деплой в контейнер.',
  },
  {
    id: 'test',
    label: 'Тесты',
    cmd: 'go test ./...\ngo test -cover -race ./internal/...',
    detail: '_test.go в том же пакете. -race ловит гонки. testify/ginkgo — поверх стандартного testing.',
  },
  {
    id: 'lint',
    label: 'Анализ',
    cmd: 'go vet ./...\ngolangci-lint run\nstaticcheck ./...',
    detail: 'go vet — встроенные проверки. golangci-lint в CI объединяет gosec, errcheck, staticcheck.',
  },
  {
    id: 'generate',
    label: 'generate',
    cmd: '//go:generate go run github.com/golang/mock/mockgen ...\ngo generate ./...',
    detail: 'Генерация gRPC, моков, Ent-схем, swagger. Код из .proto и аннотаций не пишут вручную.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: 'docker build -t orders-api .\nkubectl apply -f deploy/\n# или: scp bin/api server:/opt/',
    detail: 'Образ scratch/distroless ~10–20 MB. В K8s — Deployment + Service; health на /healthz, метрики Prometheus.',
  },
];

export const PACKAGE_MODELS = [
  {
    id: 'flat',
    label: 'Плоский main',
    era: 'Утилита · скрипт',
    color: '#00add8',
    syntax: `package main

import "fmt"

func main() {
    fmt.Println("hello")
}`,
    traits: ['Один файл или папка без internal/', 'go run .', 'Без go.mod до go mod init'],
    tools: 'go run · go build',
    use: 'Учебные примеры, маленькие CLI',
  },
  {
    id: 'standard',
    label: 'cmd + internal',
    era: 'Сервис · API',
    color: '#10b981',
    syntax: `// go.mod
module github.com/acme/orders-api

// cmd/api/main.go
package main
import "github.com/acme/orders-api/internal/http"

// internal/http — импорт только изнутри модуля`,
    traits: ['internal/ закрыт для внешних модулей', 'cmd/ — несколько бинарников', 'Интерфейсы для тестов'],
    tools: 'go test ./... · golangci-lint',
    use: 'Микросервисы, REST, gRPC',
  },
  {
    id: 'workspace',
    label: 'go.work (монорепо)',
    era: 'Несколько модулей',
    color: '#8b5cf6',
    syntax: `// go.work
go 1.22

use (
    ./services/orders
    ./services/billing
    ./pkg/shared
)

// replace в go.mod для локальной разработки`,
    traits: ['Несколько go.mod в одном репо', 'replace ./pkg/shared', 'Единый go work sync'],
    tools: 'go work init · go work use',
    use: 'Платформенные команды, shared libs',
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
  const hasWorker = enabledNodeIds.has('worker');
  const modCount = DEP_NODES.filter((n) => n.type === 'mod' && enabledNodeIds.has(n.id)).length;
  const artifacts = hasWorker
    ? ['bin/api (~12 MB)', 'worker в том же процессе', `require: ${modCount} модулей`]
    : ['bin/api (~10 MB)', 'без NATS worker', `require: ${modCount - 1} модулей`];
  return {artifacts, hasWorker, modCount};
}
