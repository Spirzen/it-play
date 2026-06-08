/** Данные для JuliaEcosystemPlay — статья 5-24-julia/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'JIT и сборка'},
  {id: 'modules', label: 'Модули и пакеты'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'runtime',
    tag: 'Runtime',
    label: 'Julia · LLVM · GC',
    color: '#9558b2',
    icon: '∑',
    items: ['JIT · специализация методов', 'LLVM IR → native', 'GC · @threads · Distributed'],
    detail:
      'Интерпретатор Julia компилирует каждый метод под конкретные типы аргументов. LLVM генерирует машинный код; рантайм управляет памятью, потоками и распределёнными процессами.',
  },
  {
    id: 'stdlib',
    tag: 'Стандартная библиотека',
    label: 'Base · LinearAlgebra · Pkg',
    color: '#389826',
    icon: '📚',
    items: ['Array · Dict · Task', 'LinearAlgebra · SparseArrays', 'Dates · Random · Test'],
    detail:
      'Base поставляется с Julia: типы, коллекции, I/O, многопоточность. LinearAlgebra и SparseArrays — основа численных вычислений без установки пакетов.',
  },
  {
    id: 'packages',
    tag: 'Зависимости',
    label: 'Pkg · General · Manifest',
    color: '#10b981',
    icon: '📦',
    items: ['Project.toml', 'Manifest.toml', 'pkg> add · dev', 'JuliaHub registry'],
    detail:
      'Pkg фиксирует окружение проекта: версии пакетов в Manifest, совместимость через compat. Каждый пакет — модуль с чётким API и документацией.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'REPL · отладка · профиль',
    color: '#ec4899',
    icon: '🔧',
    items: ['@code_warntype · @time', 'Debugger.jl · Profile', 'VS Code Julia · Revise.jl'],
    detail:
      'REPL — не консоль, а платформа инспекции: @which, @code_llvm, @benchmark. Revise подхватывает изменения без перезапуска; Profile находит узкие места после JIT.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Наука · ML · веб',
    color: '#06b6d4',
    icon: '⚙',
    items: ['DifferentialEquations.jl', 'Flux · CUDA.jl', 'DataFrames · Genie.jl'],
    detail:
      'Пакеты композируются через общие абстракты: любой AbstractArray, совместимый оптимизатор, любой ODEProblem. Фреймворки редко дублируют друг друга — строительные блоки.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Модули и домен',
    color: '#6366f1',
    icon: '🏗',
    items: ['src/MySimulation.jl', 'Models · Solvers', 'GPU-ядра · REST API', 'scripts/run.jl'],
    detail:
      'Типичный HPC-проект: типы и уравнения в домене, solve!/train! в ядре, опционально CUDA для ускорения. Веб — Genie; ML — Flux поверх Zygote.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220). */
export const DEP_NODES = [
  {id: 'main', label: 'run.jl', type: 'app', x: 200, y: 24},
  {id: 'sim', label: 'Simulation', type: 'module', x: 70, y: 90},
  {id: 'models', label: 'Models', type: 'pure', x: 200, y: 90},
  {id: 'gpu', label: 'GPU', type: 'lazy', x: 330, y: 90},
  {id: 'diffeq', label: 'DifferentialEquations', type: 'pkg', x: 40, y: 168},
  {id: 'linalg', label: 'LinearAlgebra', type: 'stdlib', x: 115, y: 168},
  {id: 'cuda', label: 'CUDA.jl', type: 'pkg', x: 190, y: 168},
  {id: 'flux', label: 'Flux.jl', type: 'pkg', x: 265, y: 168},
  {id: 'zygote', label: 'Zygote', type: 'pkg', x: 340, y: 168},
];

export const DEP_EDGES = [
  ['main', 'sim'],
  ['main', 'models'],
  ['main', 'gpu'],
  ['sim', 'diffeq'],
  ['sim', 'linalg'],
  ['sim', 'models'],
  ['models', 'linalg'],
  ['gpu', 'cuda'],
  ['gpu', 'flux'],
  ['gpu', 'models'],
  ['flux', 'zygote'],
  ['flux', 'cuda'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Модуль приложения', stroke: '#10b981'},
  pure: {label: 'Домен · типы', stroke: '#9558b2'},
  lazy: {label: 'GPU / ML слой', stroke: '#f59e0b', dash: '6 4'},
  pkg: {label: 'Пакет General', stroke: '#ec4899'},
  stdlib: {label: 'Stdlib', stroke: '#389826'},
};

export const ARCH_PRESETS = [
  {
    id: 'diffeq',
    label: 'Численное моделирование',
    toolchain: 'Project.toml · DifferentialEquations · ModelingToolkit · Plots',
    tree: [
      {
        type: 'dir',
        path: 'climate-sim',
        children: [
          {type: 'file', path: 'climate-sim/Project.toml', role: 'Pkg', hint: 'name = "ClimateSim", [deps] DifferentialEquations, ModelingToolkit'},
          {type: 'file', path: 'climate-sim/Manifest.toml', role: 'Lockfile', hint: 'Точные версии после pkg> instantiate'},
          {
            type: 'dir',
            path: 'climate-sim/src',
            children: [
              {type: 'file', path: 'climate-sim/src/ClimateSim.jl', role: 'Модуль пакета', hint: 'module ClimateSim ... using .Models, .Solvers end'},
              {type: 'file', path: 'climate-sim/src/Models.jl', role: 'Домен', hint: 'struct AtmosphereParams; heat_flux!(u,p,t) — без внешних пакетов'},
              {type: 'file', path: 'climate-sim/src/Solvers.jl', role: 'ODE', hint: 'solve(prob, Tsit5(); saveat=dt) — DifferentialEquations'},
              {type: 'file', path: 'climate-sim/src/IO.jl', role: 'Результаты', hint: 'JLD2 / NetCDF — сериализация траекторий'},
            ],
          },
          {
            type: 'dir',
            path: 'climate-sim/scripts',
            children: [
              {type: 'file', path: 'climate-sim/scripts/run.jl', role: 'Запуск', hint: 'using Pkg; Pkg.activate("."); using ClimateSim; main()'},
              {type: 'file', path: 'climate-sim/scripts/benchmark.jl', role: 'Профиль', hint: '@benchmark solve(...) — BenchmarkTools'},
            ],
          },
          {
            type: 'dir',
            path: 'climate-sim/test',
            children: [
              {type: 'file', path: 'climate-sim/test/runtests.jl', role: 'Test', hint: '@test energy_conserved(sol) < 1e-6'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'flux',
    label: 'ML · Flux + GPU',
    toolchain: 'Flux · Zygote · CUDA.jl · BSON · MLflow.jl',
    tree: [
      {
        type: 'dir',
        path: 'mnist-flux',
        children: [
          {type: 'file', path: 'mnist-flux/Project.toml', role: 'Pkg', hint: 'Flux, CUDA, Zygote, BSON — compat для CUDA'},
          {
            type: 'dir',
            path: 'mnist-flux/src',
            children: [
              {type: 'file', path: 'mnist-flux/src/MnistFlux.jl', role: 'Пакет', hint: 'export train!, predict'},
              {type: 'file', path: 'mnist-flux/src/Model.jl', role: 'Сеть', hint: 'Chain(Dense(784,128,relu), Dense(128,10)) — Flux'},
              {type: 'file', path: 'mnist-flux/src/Train.jl', role: 'Обучение', hint: 'loss = crossentropy(model(x), y); grad = gradient(...)' },
              {type: 'file', path: 'mnist-flux/src/Data.jl', role: 'Данные', hint: 'MLDatasets.MNIST — загрузка батчей'},
              {type: 'file', path: 'mnist-flux/src/Gpu.jl', role: 'CUDA', hint: 'model = model |> gpu; x = x |> gpu'},
            ],
          },
          {type: 'file', path: 'mnist-flux/scripts/train.jl', role: 'CLI', hint: 'CUDA.functional() ? gpu_train() : cpu_train()'},
          {type: 'file', path: 'mnist-flux/checkpoints/model.bson', role: 'Артефакт', hint: '@save "model.bson" model — веса после эпох'},
        ],
      },
    ],
  },
  {
    id: 'genie',
    label: 'Genie REST API',
    toolchain: 'Genie · JSON3 · StructTypes · Docker',
    tree: [
      {
        type: 'dir',
        path: 'metrics-api',
        children: [
          {type: 'file', path: 'metrics-api/Project.toml', role: 'Pkg', hint: 'Genie, JSON3, MyPkg как локальная lib'},
          {
            type: 'dir',
            path: 'metrics-api/app',
            children: [
              {type: 'file', path: 'metrics-api/app/routes.jl', role: 'Маршруты', hint: 'route("/api/v1/metrics", MetricsController.index)'},
              {type: 'file', path: 'metrics-api/app/controllers/MetricsController.jl', role: 'Controller', hint: 'json(Dict(...)) — сериализация ответа'},
              {type: 'file', path: 'metrics-api/app/models/Metric.jl', role: 'Модель', hint: 'struct Metric; JSON3.@json struct'},
            ],
          },
          {type: 'file', path: 'metrics-api/bin/server.jl', role: 'Старт', hint: 'Genie.config.run_as_server = true; up(8000)'},
          {type: 'file', path: 'metrics-api/Dockerfile', role: 'Деплой', hint: 'julia:1.10 → pkg instantiate → julia bin/server.jl'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'install',
    label: 'Julia',
    cmd: '# juliaup (рекомендуется)\ncurl -fsSL https://install.julialang.org | sh\njuliaup add release\njulia --version',
    detail:
      'Один бинарник Julia включает REPL, компилятор и Pkg. Версии переключаются через juliaup; проекты изолируют пакеты через Project.toml, а не глобальный site-packages.',
  },
  {
    id: 'project',
    label: 'Проект',
    cmd: 'julia --project=.\n] activate .\n] generate MySimulation   # или вручную Project.toml',
    detail:
      'Project.toml задаёт uuid пакета, [deps] и [compat]. Manifest фиксирует дерево зависимостей после pkg> instantiate — воспроизводимая среда на кластере и в CI.',
  },
  {
    id: 'deps',
    label: 'Pkg',
    cmd: '] add DifferentialEquations\n] add CUDA\n] status\n] precompile',
    detail:
      'Pkg скачивает из General registry, проверяет compat и предкомпилирует методы. precompile снижает задержку первого вызова в продакшене и на HPC-узлах.',
  },
  {
    id: 'parse',
    label: 'Парсинг',
    cmd: 'using MySimulation\n# include / using загружает модули\nf(x::Float64) = x^2 + 1',
    detail:
      'Парсер строит AST; макросы (@time, @generated) разворачиваются до типизации. Модули и пакеты — пространства имён; export/using управляют видимостью символов.',
  },
  {
    id: 'infer',
    label: 'Типы · dispatch',
    cmd: '@which f(2.0)\n@code_typed f(2.0)\n# выбор метода по типам ВСЕХ аргументов',
    detail:
      'Инференс выводит типы; диспетчеризация выбирает метод. Нестабильные типы (Union, Any) — предупреждение @code_warntype; стабильный код → быстрый LLVM IR.',
  },
  {
    id: 'llvm',
    label: 'LLVM',
    cmd: '@code_llvm f(2.0)\n@code_native f(2.0)\n# оптимизации: inline, SIMD, escape analysis',
    detail:
      'Специализированный метод компилируется в LLVM, затем в native-код под CPU (или PTX для GPU через CUDA.jl). Первый вызов — JIT; повторные — из кэша.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: 'julia --project=. scripts/run.jl\n# кластер: julia -p 4 -t 8 distributed_run.jl',
    detail:
      'Скрипт или модуль main. Distributed.addprocs и @distributed для кластера; CUDA.@cuda для ядер на GPU. Profile.@profile — узкие места после прогрева JIT.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'repl',
    label: 'REPL · include',
    era: 'Скрипт · эксперимент',
    color: '#9558b2',
    syntax: `# в REPL или run.jl
include("src/Models.jl")
using .Models

x = simulate(params)`,
    traits: ['include относительный путь', 'using .SubModule', 'без Project.toml — глобальное env'],
    tools: 'REPL · Revise.jl · Scripts.jl',
    use: 'Прототипы, ноутбуки, одноразовые расчёты',
  },
  {
    id: 'module',
    label: 'module · using',
    era: 'Пакет · библиотека',
    color: '#389826',
    syntax: `module ClimateSim
export simulate, AtmosphereParams
include("Models.jl")
include("Solvers.jl")
end

# потребитель:
using ClimateSim
simulate(params)`,
    traits: ['export / import', 'вложенные include', 'имя пакета = имя модуля в src/'],
    tools: 'Pkg · Test · Documenter.jl',
    use: 'Библиотеки на General, внутренние модули проекта',
  },
  {
    id: 'project',
    label: 'Проект + зависимости',
    era: 'HPC · reproducible',
    color: '#6366f1',
    syntax: `# Project.toml
name = "ClimateSim"
uuid = "..."
[deps]
DifferentialEquations = "..."

# scripts/run.jl
using Pkg; Pkg.activate(@__DIR__ * "/..")
using ClimateSim`,
    traits: ['Manifest lock', 'compat bounds', 'dev path для локальных пакетов', 'precompile в CI'],
    tools: 'Pkg · JuliaHub · Docker · Slurm',
    use: 'Научные пайплайны, кластеры, продакшен-сервисы',
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
  const hasGpu = enabledNodeIds.has('gpu');
  const pkgCount = DEP_NODES.filter((n) => n.type === 'pkg' && enabledNodeIds.has(n.id)).length;
  const layers = hasGpu
    ? ['run.jl', 'Simulation · Models · GPU', `Пакеты General: ${pkgCount}`, 'CUDA · Flux · Zygote']
    : ['run.jl', 'Simulation · Models (CPU)', `Пакеты General: ${pkgCount - 2}`, 'DifferentialEquations · LinearAlgebra'];
  return {layers, hasGpu, pkgCount};
}
