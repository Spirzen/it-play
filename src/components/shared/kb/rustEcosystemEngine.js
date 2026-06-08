/** Данные для RustEcosystemPlay — статья 5-13-rust/110. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и деплой'},
  {id: 'crates', label: 'Crates и модули'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'toolchain',
    tag: 'Toolchain',
    label: 'rustc · rustup · LLVM',
    color: '#de6e30',
    icon: '⚙',
    items: ['cargo build · cargo run', 'borrow checker · zero-cost', 'кросс-компиляция · cross'],
    detail:
      'rustc компилирует в нативный код через LLVM. rustup переключает stable/nightly и targets. Один бинарник без GC; unsafe — явный выход из гарантий.',
  },
  {
    id: 'stdlib',
    tag: 'Стандартная библиотека',
    label: 'std · core · alloc',
    color: '#f59e0b',
    icon: '📚',
    items: ['std::net · std::fs', 'std::thread · sync', 'no_std + embedded'],
    detail:
      'std — полная ОС: файлы, сокеты, потоки. core/alloc — для embedded и Wasm без ОС. Future и async живут в экосистеме (Tokio), не в std.',
  },
  {
    id: 'cratesio',
    tag: 'Зависимости',
    label: 'Cargo · crates.io',
    color: '#10b981',
    icon: '📦',
    items: ['Cargo.toml · Cargo.lock', 'features · workspaces', 'docs.rs'],
    detail:
      'Каждый crate — пакет с версией semver. features включают опциональный код (serde/json). Workspace объединяет несколько crate в одном репозитории.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Качество и IDE',
    color: '#ec4899',
    icon: '🔧',
    items: ['cargo test · nextest', 'clippy · rustfmt', 'rust-analyzer · miri'],
    detail:
      'cargo test — unit в mod tests, integration в tests/. Clippy — сотни линтов. rust-analyzer — LSP в VS Code. Miri ловит UB в unsafe на nightly.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Веб · GUI · Wasm · embedded',
    color: '#06b6d4',
    icon: '🌐',
    items: ['Axum · Actix · Rocket', 'Tokio · sqlx · Serde', 'Tauri · Iced · Leptos', 'Embassy · wgpu'],
    detail:
      'Сервер: Axum на Tower/Hyper, async Tokio. Данные: sqlx (compile-time SQL), Diesel, SeaORM. UI: Tauri (WebView+Rust), Iced, Dioxus. Wasm: wasm-bindgen, Yew, Leptos.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш crate',
    color: '#6366f1',
    icon: '🏗',
    items: ['src/ · bin/', 'lib.rs · mod', 'handlers · domain', 'workers · CLI'],
    detail:
      'src/main.rs или src/bin/api.rs — точка входа. lib.rs экспортирует API crate. Модули mod routes; — дерево файлов. Слои: HTTP → service → store, тесты с mockall.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'src/main.rs', type: 'app', x: 200, y: 24},
  {id: 'routes', label: 'routes/', type: 'module', x: 70, y: 90},
  {id: 'service', label: 'service/', type: 'module', x: 200, y: 90},
  {id: 'worker', label: 'worker/', type: 'lazy', x: 330, y: 90},
  {id: 'axum', label: 'axum', type: 'crate', x: 50, y: 168},
  {id: 'tokio', label: 'tokio', type: 'crate', x: 130, y: 168},
  {id: 'sqlx', label: 'sqlx', type: 'crate', x: 210, y: 168},
  {id: 'serde', label: 'serde', type: 'crate', x: 290, y: 168},
  {id: 'tracing', label: 'tracing', type: 'crate', x: 360, y: 168},
];

export const DEP_EDGES = [
  ['main', 'routes'],
  ['main', 'service'],
  ['main', 'worker'],
  ['routes', 'axum'],
  ['routes', 'service'],
  ['routes', 'serde'],
  ['service', 'sqlx'],
  ['service', 'tokio'],
  ['service', 'tracing'],
  ['worker', 'tokio'],
  ['worker', 'sqlx'],
  ['worker', 'service'],
  ['main', 'tokio'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Модуль src/', stroke: '#10b981'},
  lazy: {label: 'Фоновый worker', stroke: '#f59e0b', dash: '6 4'},
  crate: {label: 'Cargo.toml dep', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'axum-api',
    label: 'REST API (Axum)',
    toolchain: 'Cargo · Tokio · Axum · sqlx · Serde · Docker',
    tree: [
      {
        type: 'dir',
        path: 'orders-api',
        children: [
          {
            type: 'file',
            path: 'orders-api/Cargo.toml',
            role: 'Манифест',
            hint: '[dependencies] axum, tokio, sqlx, serde — features = ["full"]',
          },
          {type: 'file', path: 'orders-api/Cargo.lock', role: 'Фиксация', hint: 'Точные версии — коммитить для приложений'},
          {type: 'file', path: 'orders-api/build.rs', role: 'Build script', hint: 'Опционально: OUT_DIR, protobuf, sqlx offline'},
          {
            type: 'dir',
            path: 'orders-api/src',
            children: [
              {type: 'file', path: 'orders-api/src/main.rs', role: 'main', hint: '#[tokio::main] async fn main — Router, serve'},
              {
                type: 'dir',
                path: 'orders-api/src/routes',
                role: 'HTTP',
                children: [
                  {type: 'file', path: 'orders-api/src/routes/mod.rs', role: 'Маршруты', hint: 'Router::new().route("/orders", get(list))'},
                  {type: 'file', path: 'orders-api/src/routes/orders.rs', role: 'Handlers', hint: 'Json, Path, State<AppState>'},
                ],
              },
              {
                type: 'dir',
                path: 'orders-api/src/service',
                role: 'Домен',
                children: [
                  {type: 'file', path: 'orders-api/src/service/order.rs', role: 'Use cases', hint: 'trait OrderRepo — mockall в тестах'},
                ],
              },
              {
                type: 'dir',
                path: 'orders-api/src/db',
                role: 'Данные',
                children: [
                  {type: 'file', path: 'orders-api/src/db/pool.rs', role: 'sqlx', hint: 'PgPool::connect, query_as!'},
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'orders-api/tests',
            children: [
              {type: 'file', path: 'orders-api/tests/api_integration.rs', role: 'Integration', hint: 'reqwest + wiremock, полный HTTP'},
            ],
          },
          {type: 'file', path: 'orders-api/Dockerfile', role: 'Контейнер', hint: 'cargo-chef или multi-stage: cargo build --release'},
        ],
      },
    ],
  },
  {
    id: 'tauri',
    label: 'Tauri (desktop)',
    toolchain: 'npm/Vite · src-tauri · invoke',
    tree: [
      {
        type: 'dir',
        path: 'notes-app',
        children: [
          {type: 'file', path: 'notes-app/package.json', role: 'Frontend', hint: 'React/Vue/Svelte — UI в WebView'},
          {type: 'file', path: 'notes-app/src/App.tsx', role: 'UI', hint: 'invoke("save_note", { ... }) из @tauri-apps/api'},
          {
            type: 'dir',
            path: 'notes-app/src-tauri',
            children: [
              {type: 'file', path: 'notes-app/src-tauri/Cargo.toml', role: 'Rust crate', hint: 'tauri, serde — отдельный crate приложения'},
              {type: 'file', path: 'notes-app/src-tauri/tauri.conf.json', role: 'Конфиг', hint: 'allowlist, bundle, window'},
              {
                type: 'dir',
                path: 'notes-app/src-tauri/src',
                children: [
                  {type: 'file', path: 'notes-app/src-tauri/src/main.rs', role: 'Backend', hint: '#[tauri::command] fn save_note — invoke_handler'},
                  {type: 'file', path: 'notes-app/src-tauri/src/lib.rs', role: 'Логика', hint: 'Файлы, SQLite rusqlite, безопасные capabilities'},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'workspace',
    label: 'Cargo workspace',
    toolchain: 'lib + bin + shared · axum + worker',
    tree: [
      {
        type: 'dir',
        path: 'platform',
        children: [
          {type: 'file', path: 'platform/Cargo.toml', role: 'Workspace', hint: '[workspace] members = ["crates/*"]'},
          {
            type: 'dir',
            path: 'platform/crates',
            children: [
              {
                type: 'dir',
                path: 'platform/crates/domain',
                children: [
                  {type: 'file', path: 'platform/crates/domain/Cargo.toml', role: 'lib', hint: 'Чистая логика без axum/tokio'},
                  {type: 'file', path: 'platform/crates/domain/src/lib.rs', role: 'Типы', hint: 'pub mod order; — переиспользуется api и worker'},
                ],
              },
              {
                type: 'dir',
                path: 'platform/crates/api',
                children: [
                  {type: 'file', path: 'platform/crates/api/Cargo.toml', role: 'bin', hint: 'depends: domain, axum, tokio'},
                  {type: 'file', path: 'platform/crates/api/src/main.rs', role: 'HTTP', hint: '[[bin]] — REST сервис'},
                ],
              },
              {
                type: 'dir',
                path: 'platform/crates/worker',
                children: [
                  {type: 'file', path: 'platform/crates/worker/Cargo.toml', role: 'bin', hint: 'tokio-cron-scheduler, sqlx'},
                  {type: 'file', path: 'platform/crates/worker/src/main.rs', role: 'Worker', hint: 'Отдельный бинарник — фоновые задачи'},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'manifest',
    label: 'Cargo.toml',
    cmd: 'cargo new orders-api\ncd orders-api\ncargo add axum tokio --features full\ncargo add sqlx --features runtime-tokio-rustls,postgres',
    detail: 'new создаёт crate; add пишет в [dependencies]. Версии из crates.io; lock фиксирует дерево при первой сборке.',
  },
  {
    id: 'compile',
    label: 'Сборка',
    cmd: 'cargo build --release\n# cross build --target aarch64-unknown-linux-gnu',
    detail: 'dev — быстрая отладка; release — LTO и оптимизации. cross/docker — кросс-компиляция для ARM и embedded.',
  },
  {
    id: 'test',
    label: 'Тесты',
    cmd: 'cargo test\ncargo nextest run\ncargo bench  # criterion',
    detail: '#[cfg(test)] mod tests в файле; tests/*.rs — интеграция. nextest — параллельный CI-раннер. Criterion — бенчмарки.',
  },
  {
    id: 'lint',
    label: 'Анализ',
    cmd: 'cargo fmt\ncargo clippy -- -D warnings\ncargo +nightly miri test',
    detail: 'rustfmt — единый стиль. clippy — идиомы и ошибки. miri — undefined behavior в unsafe (медленно, но точно).',
  },
  {
    id: 'doc',
    label: 'Документация',
    cmd: 'cargo doc --open\n# docs.rs публикует при cargo publish',
    detail: '/// комментарии → rustdoc. docs.rs собирает все публичные crate на crates.io с примерами и поиском.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: 'docker build -t orders-api .\n# wasm32-wasi: cargo build --target wasm32-wasi',
    detail: 'Статический бинарник ~5–15 MB в slim-образе. Wasm+WASI — serverless и плагины. Tauri — MSI/dmg из cargo tauri build.',
  },
];

export const CRATE_MODELS = [
  {
    id: 'binary',
    label: 'Один бинарник',
    era: 'Утилита · CLI',
    color: '#de6e30',
    syntax: `// Cargo.toml
[package]
name = "hello"
version = "0.1.0"

// src/main.rs
fn main() {
    println!("Hello, Rust!");
}`,
    traits: ['Только src/main.rs', 'cargo run', 'Без lib.rs'],
    tools: 'cargo run · cargo build',
    use: 'Скрипты, учебные примеры, маленькие CLI (clap)',
  },
  {
    id: 'lib-bin',
    label: 'lib + bin',
    era: 'Сервис · библиотека',
    color: '#10b981',
    syntax: `// src/lib.rs
pub mod routes;
pub mod service;

// src/main.rs
use orders_api::routes::app;

#[tokio::main]
async fn main() { /* ... */ }`,
    traits: ['lib.rs — публичный API crate', 'main.rs тонкий', 'mod в подпапках src/'],
    tools: 'cargo test · cargo clippy',
    use: 'REST API, shared логика в lib',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    era: 'Монорепо',
    color: '#8b5cf6',
    syntax: `# Cargo.toml (корень)
[workspace]
members = ["crates/api", "crates/domain", "crates/worker"]
resolver = "2"

# crates/api/Cargo.toml
[dependencies]
domain = { path = "../domain" }`,
    traits: ['Несколько crate, один Cargo.lock', 'path = зависимости', 'Общие [workspace.dependencies]'],
    tools: 'cargo build -p api · cargo test --workspace',
    use: 'Платформа: API + worker + shared domain',
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
  const crateCount = DEP_NODES.filter((n) => n.type === 'crate' && enabledNodeIds.has(n.id)).length;
  const artifacts = hasWorker
    ? ['target/release/orders-api (~8 MB)', 'worker — отдельный bin или task', `deps: ${crateCount} прямых crate`]
    : ['target/release/orders-api (~6 MB)', 'без worker/', `deps: ${crateCount} crate`];
  return {artifacts, hasWorker, crateCount};
}
