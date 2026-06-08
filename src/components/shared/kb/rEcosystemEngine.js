/** Данные для REcosystemPlay — статья 5-23-r/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и запуск'},
  {id: 'modules', label: 'Пакеты и импорты'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'runtime',
    tag: 'Runtime',
    label: 'Интерпретатор R · окружения',
    color: '#276DC7',
    icon: 'R',
    items: ['bytecode · .Call', 'environments · замыкания', 'GC · copy-on-modify'],
    detail:
      'Код выполняется интерпретатором на C: выражения, окружения (лексическая область видимости), автоматическая память. Повторные вызовы ускоряются байт-кодом без смены семантики.',
  },
  {
    id: 'base',
    tag: 'Базовый слой',
    label: 'base · recommended · stats',
    color: '#1d5a9e',
    icon: '📚',
    items: ['S3/S4 методы', 'data.frame · matrix', 'graphics · grDevices'],
    detail:
      'Поставляется с дистрибутивом R. S3 — соглашения об именах методов; S4/R6 — формальные классы. Большинство пакетов на CRAN опираются на эти примитивы.',
  },
  {
    id: 'packages',
    tag: 'Пакеты',
    label: 'CRAN · Bioconductor · GitHub',
    color: '#10b981',
    icon: '📦',
    items: ['DESCRIPTION · NAMESPACE', 'R/ · man/ · data/', 'renv.lock · remotes'],
    detail:
      'Пакет — модуль с кодом, документацией Rd, данными и тестами. CRAN проверяет качество; Bioconductor — биоинформатика; remotes::install_github — экспериментальные версии.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Posit · devtools · качество',
    color: '#ec4899',
    icon: '🔧',
    items: ['RStudio / Posit', 'usethis · roxygen2', 'testthat · lintr · renv'],
    detail:
      'usethis создаёт скелет пакета; roxygen2 генерирует NAMESPACE и man/. renv фиксирует версии в проекте; targets строит граф аналитического конвейера.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Shiny · plumber · tidyverse',
    color: '#06b6d4',
    icon: '⚙',
    items: ['Shiny · bslib', 'plumber · httr2', 'dplyr · tidymodels · arrow'],
    detail:
      'Shiny — интерактивные веб-приложения; plumber — REST API из аннотаций R. tidyverse — согласованный стиль обработки данных; arrow — большие Parquet вне RAM.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Аналитика · отчёты · API',
    color: '#6366f1',
    icon: '🏗',
    items: ['ETL · модели', 'дашборды · Rmd', 'деплой Connect / Docker'],
    detail:
      'Типичная архитектура: подготовка данных (targets/скрипты), слой бизнес-логики, UI (Shiny) или API (plumber), воспроизводимость через renv и отчёты Quarto/Rmd.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220). */
export const DEP_NODES = [
  {id: 'main', label: 'app.R', type: 'app', x: 200, y: 24},
  {id: 'global', label: 'global.R', type: 'module', x: 70, y: 90},
  {id: 'mod_ui', label: 'mod_dashboard.R', type: 'module', x: 200, y: 90},
  {id: 'prepare', label: 'prepare_data.R', type: 'lazy', x: 330, y: 90},
  {id: 'shiny', label: 'shiny', type: 'cran', x: 40, y: 168},
  {id: 'dplyr', label: 'dplyr', type: 'cran', x: 115, y: 168},
  {id: 'dbi', label: 'DBI/odbc', type: 'cran', x: 190, y: 168},
  {id: 'targets', label: 'targets', type: 'cran', x: 265, y: 168},
  {id: 'arrow', label: 'arrow', type: 'cran', x: 340, y: 168},
];

export const DEP_EDGES = [
  ['main', 'global'],
  ['main', 'mod_ui'],
  ['main', 'prepare'],
  ['global', 'shiny'],
  ['global', 'dplyr'],
  ['mod_ui', 'shiny'],
  ['mod_ui', 'dplyr'],
  ['prepare', 'dplyr'],
  ['prepare', 'dbi'],
  ['prepare', 'targets'],
  ['prepare', 'arrow'],
  ['targets', 'arrow'],
  ['targets', 'dplyr'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа Shiny', stroke: '#6366f1'},
  module: {label: 'R-скрипт проекта', stroke: '#10b981'},
  lazy: {label: 'Подготовка данных', stroke: '#f59e0b', dash: '6 4'},
  cran: {label: 'CRAN-пакет', stroke: '#276DC7'},
};

export const ARCH_PRESETS = [
  {
    id: 'shiny',
    label: 'Shiny-дашборд',
    toolchain: 'renv · Shiny · bslib · dplyr · DBI · optional targets',
    tree: [
      {
        type: 'dir',
        path: 'sales-dashboard',
        children: [
          {type: 'file', path: 'sales-dashboard/renv.lock', role: 'renv', hint: 'Фиксированные версии пакетов — воспроизводимая среда'},
          {type: 'file', path: 'sales-dashboard/app.R', role: 'Точка входа', hint: 'shinyApp(ui, server) или bslib::page_fillable(...)'},
          {type: 'file', path: 'sales-dashboard/global.R', role: 'Общее', hint: 'library(dplyr); con <- dbConnect(...) — source при старте'},
          {
            type: 'dir',
            path: 'sales-dashboard/R',
            children: [
              {type: 'file', path: 'sales-dashboard/R/mod_dashboard.R', role: 'Shiny module', hint: 'mod_dashboard_ui / mod_dashboard_server — переиспользуемый UI'},
              {type: 'file', path: 'sales-dashboard/R/prepare_data.R', role: 'Данные', hint: 'read_sales() — dplyr + DBI; кэш через reactive/cache'},
              {type: 'file', path: 'sales-dashboard/R/utils.R', role: 'Утилиты', hint: 'format_currency(), валидация фильтров'},
            ],
          },
          {type: 'file', path: 'sales-dashboard/www/styles.css', role: 'Статика', hint: 'Дополнительные стили для Shiny'},
          {
            type: 'dir',
            path: 'sales-dashboard/tests',
            children: [
              {type: 'file', path: 'sales-dashboard/tests/testthat/test-prepare.R', role: 'testthat', hint: 'expect_equal(nrow(df), ...) после prepare'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'package',
    label: 'R-пакет (usethis)',
    toolchain: 'DESCRIPTION · NAMESPACE · roxygen2 · R CMD check · devtools',
    tree: [
      {
        type: 'dir',
        path: 'analyticskit',
        children: [
          {type: 'file', path: 'analyticskit/DESCRIPTION', role: 'Манифест', hint: 'Package, Imports, Suggests, Version — зависимости для CRAN'},
          {type: 'file', path: 'analyticskit/NAMESPACE', role: 'Экспорт', hint: 'export(), importFrom() — генерируется roxygen2'},
          {
            type: 'dir',
            path: 'analyticskit/R',
            children: [
              {type: 'file', path: 'analyticskit/R/metrics.R', role: 'Публичный API', hint: "#' @export compute_cohort — документация → man/metrics.Rd"},
              {type: 'file', path: 'analyticskit/R/internal.R', role: 'Внутреннее', hint: 'Без @export — доступно только внутри пакета'},
            ],
          },
          {
            type: 'dir',
            path: 'analyticskit/man',
            children: [
              {type: 'file', path: 'analyticskit/man/metrics.Rd', role: 'Справка', hint: 'Страница ?compute_cohort в R'},
            ],
          },
          {
            type: 'dir',
            path: 'analyticskit/tests',
            children: [
              {type: 'file', path: 'analyticskit/tests/testthat/test-metrics.R', role: 'testthat', hint: 'devtools::test() / R CMD check'},
            ],
          },
          {
            type: 'dir',
            path: 'analyticskit/vignettes',
            children: [
              {type: 'file', path: 'analyticskit/vignettes/intro.Rmd', role: 'Vignette', hint: 'Длинное руководство — devtools::build_vignettes()'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'targets',
    label: 'Конвейер targets',
    toolchain: 'targets · tarchetypes · arrow/Parquet · renv · Quarto отчёт',
    tree: [
      {
        type: 'dir',
        path: 'churn-pipeline',
        children: [
          {type: 'file', path: 'churn-pipeline/_targets.R', role: 'Граф', hint: 'tar_option_set(); list(tar_target(raw, ...), tar_target(clean, ...))'},
          {type: 'file', path: 'churn-pipeline/renv.lock', role: 'renv', hint: 'Версии targets, arrow, tidymodels'},
          {
            type: 'dir',
            path: 'churn-pipeline/R',
            children: [
              {type: 'file', path: 'churn-pipeline/R/tar_wrappers.R', role: 'Функции', hint: 'Логика шагов: ingest(), train_model() — вызываются из tar_target'},
            ],
          },
          {type: 'file', path: 'churn-pipeline/data/raw/.gitkeep', role: 'Вход', hint: 'Исходные CSV/Parquet — не в git при больших объёмах'},
          {type: 'file', path: 'churn-pipeline/_targets/meta/meta', role: 'Кэш', hint: 'tar_make() пересчитывает только изменённые ветки графа'},
          {type: 'file', path: 'churn-pipeline/reports/summary.qmd', role: 'Quarto', hint: 'tar_read(model) в отчёте — связь пайплайна и публикации'},
        ],
      },
    ],
  },
  {
    id: 'plumber',
    label: 'plumber API',
    toolchain: 'plumber · httr2 · DBI · Docker · Posit Connect',
    tree: [
      {
        type: 'dir',
        path: 'metrics-api',
        children: [
          {type: 'file', path: 'metrics-api/plumber.R', role: 'API', hint: "#' @get /metrics — аннотации → маршруты"},
          {type: 'file', path: 'metrics-api/R/db.R', role: 'DBI', hint: 'pool::dbPool() — соединения для запросов'},
          {type: 'file', path: 'metrics-api/R/schemas.R', role: 'Валидация', hint: 'Проверка query-параметров перед dplyr'},
          {type: 'file', path: 'metrics-api/Dockerfile', role: 'Контейнер', hint: 'Rocker image + renv::restore() + ENTRYPOINT R -e "plumber::..."'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'renv',
    label: 'renv',
    cmd: 'install.packages("renv")\nrenv::init()\nrenv::install("shiny")\nrenv::snapshot()',
    detail:
      'renv создаёт локальную библиотеку пакетов и lock-файл. Коллега выполняет renv::restore() — те же версии, что у вас, без "у меня работает".',
  },
  {
    id: 'install',
    label: 'Установка',
    cmd: 'install.packages(c("dplyr", "DBI", "odbc"))\n# или\nrenv::install("dplyr@1.1.4")',
    detail:
      'Пакеты попадают в library/ проекта (renv) или системную библиотеку. Bioconductor: BiocManager::install(); GitHub: remotes::install_github().',
  },
  {
    id: 'load',
    label: 'Подключение',
    cmd: 'library(shiny)\nrequireNamespace("dplyr", quietly = TRUE)\ndplyr::filter(df, status == "ok")',
    detail:
      'library() загружает пакет в search path и может конфликтовать по именам (filter). В пакетах и скриптах предпочтительнее pkg::fun() и Imports в DESCRIPTION.',
  },
  {
    id: 'check',
    label: 'Проверка',
    cmd: 'devtools::document()\ndevtools::check()\n# R CMD build . && R CMD check analyticskit_0.1.0.tar.gz',
    detail:
      'roxygen2 обновляет NAMESPACE и man/. R CMD check — CRAN-подобные тесты: примеры, vignettes, зависимости, экспорт.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: 'shiny::runApp("sales-dashboard")\n# plumber::pr("plumber.R") %>% pr_run(port = 8000)\n# targets::tar_make()',
    detail:
      'Shiny поднимает UI+server; plumber — HTTP API. targets::tar_make() проходит граф _targets.R и кэширует артефакты.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: 'rsconnect::deployApp("sales-dashboard")\n# docker build -t metrics-api .\n# Posit Connect / Kubernetes',
    detail:
      'Posit Connect публикует Shiny/plumber с renv. Docker фиксирует образ R + системные libs (odbc, libpq). Quarto-отчёты — отдельный артефакт из targets.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'script',
    label: 'Скрипт · source',
    era: 'Аналитика · прототип',
    color: '#276DC7',
    syntax: `# analysis.R
source("R/prepare_data.R")
library(dplyr)

sales <- read_sales(con)
summary <- sales |> group_by(region) |> summarise(n = n())

saveRDS(summary, "output/summary.rds")`,
    traits: ['Один или несколько .R файлов', 'source() без NAMESPACE', 'library() в начале'],
    tools: 'Rscript analysis.R · RStudio Run',
    use: 'Разовые отчёты, EDA, учебные примеры',
  },
  {
    id: 'package',
    label: 'Пакет CRAN',
    era: 'Библиотека · reproducible API',
    color: '#10b981',
    syntax: `# DESCRIPTION
Imports: dplyr (>= 1.1.0), rlang

# R/metrics.R
#' @export
compute_cohort <- function(x) { ... }

# использование
analyticskit::compute_cohort(df)`,
    traits: ['NAMESPACE · экспорт/импорт', 'R CMD check', 'Версионирование SemVer'],
    tools: 'usethis · devtools · roxygen2 · testthat',
    use: 'Внутренние библиотеки компании, публикация на CRAN',
  },
  {
    id: 'targets',
    label: 'targets + renv',
    era: 'Пайплайн · MLOps-lite',
    color: '#6366f1',
    syntax: `# _targets.R
library(targets)
tar_option_set(packages = c("dplyr", "arrow"))

list(
  tar_target(raw, ingest_raw("data/raw/")),
  tar_target(clean, clean_sales(raw), format = "qs"),
  tar_target(model, train(clean))
)

# tar_make() — только изменённые узлы`,
    traits: ['Граф зависимостей', 'Инкрементальная пересборка', 'Связь с Quarto/Rmd'],
    tools: 'targets · tarchetypes · renv · Posit Workbench',
    use: 'Регулярная аналитика, модели, большие данные (arrow)',
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
  const hasPipeline = enabledNodeIds.has('targets');
  const cranCount = DEP_NODES.filter((n) => n.type === 'cran' && enabledNodeIds.has(n.id)).length;
  const layers = hasPipeline
    ? ['app.R', 'global.R · mod_dashboard · prepare_data', `CRAN: ${cranCount} пакетов (с targets/arrow)`]
    : ['app.R', 'global.R · mod_dashboard · prepare_data', `CRAN: ${cranCount - 2} пакетов (без конвейера)`];
  return {layers, hasPipeline, cranCount};
}
