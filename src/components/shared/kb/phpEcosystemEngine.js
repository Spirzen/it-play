/** Данные для PhpEcosystemPlay — статья 5-07-php/10. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Запрос и сборка'},
  {id: 'modules', label: 'Подключение кода'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'runtime',
    tag: 'Runtime',
    label: 'Ядро PHP',
    color: '#777bb4',
    icon: '🐘',
    items: ['Zend Engine · OPcache', 'SAPI (FPM, CLI, Apache)', 'Расширения ext-*'],
    detail:
      'Интерпретатор выполняет байткод; OPcache кэширует скомпилированные скрипты. SAPI определяет контекст: веб-запрос через FPM или консольная команда artisan.',
  },
  {
    id: 'server',
    tag: 'Сервер',
    label: 'Веб-сервер и FPM',
    color: '#3b82f6',
    icon: '🌐',
    items: ['Nginx · Apache', 'PHP-FPM pool', 'php -S (dev only)'],
    detail:
      'Nginx/Apache принимает HTTP и передаёт PHP-скрипты в FPM. В продакшене каждый запрос — отдельный worker-процесс; Octane/RoadRunner держат приложение в памяти.',
  },
  {
    id: 'composer',
    tag: 'Зависимости',
    label: 'Composer · Packagist',
    color: '#10b981',
    icon: '📦',
    items: ['composer.json / lock', 'vendor/', 'PSR-4 autoload', 'semver'],
    detail:
      'Composer загружает библиотеки с Packagist, разрешает версии и генерирует autoload.php. Фреймворки и пакеты подключаются как обычные зависимости.',
  },
  {
    id: 'standards',
    tag: 'Стандарты',
    label: 'PSR и PHP-FIG',
    color: '#8b5cf6',
    icon: '📋',
    items: ['PSR-4 автозагрузка', 'PSR-7 HTTP', 'PSR-11 контейнер', 'PSR-12 стиль кода'],
    detail:
      'Общие интерфейсы позволяют Guzzle, Slim, Symfony и Laravel работать вместе: один HTTP-клиент, один контейнер DI, единый стиль.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Laravel · Symfony · CMS',
    color: '#ef4444',
    icon: '⚙',
    items: ['Laravel · Symfony · Slim', 'WordPress · Drupal', 'API Platform · Spiral'],
    detail:
      'Полноценный фреймворк задаёт структуру каталогов, маршруты, ORM и CLI. CMS (WordPress) — своя модель тем и плагинов поверх PHP.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Качество и DevOps',
    color: '#ec4899',
    icon: '🔧',
    items: ['PHPUnit · Pest', 'PHPStan · Psalm', 'Sail · DDEV · Docker', 'Xdebug · Blackfire'],
    detail:
      'Статический анализ и тесты в CI; контейнеры воспроизводят окружение. Artisan и Symfony Console генерируют код и миграции.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['routes · controllers', 'services · models', 'views · API', 'jobs · events'],
    detail:
      'Прикладной слой: контроллеры принимают запрос, сервисы инкапсулируют логику, Eloquent/Doctrine — данные. Очереди выносят тяжёлые задачи из HTTP-цикла.',
  },
];

/** Узлы графа зависимостей (viewBox 400×240). */
export const DEP_NODES = [
  {id: 'index', label: 'public/index.php', type: 'app', x: 200, y: 22},
  {id: 'kernel', label: 'HTTP Kernel', type: 'module', x: 200, y: 72},
  {id: 'orders', label: 'OrderController', type: 'module', x: 85, y: 118},
  {id: 'reports', label: 'SendReportJob', type: 'lazy', x: 315, y: 118},
  {id: 'service', label: 'OrderService', type: 'module', x: 85, y: 164},
  {id: 'guzzle', label: 'guzzlehttp/guzzle', type: 'composer', x: 45, y: 210},
  {id: 'eloquent', label: 'illuminate/database', type: 'composer', x: 135, y: 210},
  {id: 'redis', label: 'predis/predis', type: 'composer', x: 225, y: 210},
  {id: 'horizon', label: 'laravel/horizon', type: 'composer', x: 315, y: 210},
];

export const DEP_EDGES = [
  ['index', 'kernel'],
  ['kernel', 'orders'],
  ['kernel', 'reports'],
  ['orders', 'service'],
  ['service', 'guzzle'],
  ['service', 'eloquent'],
  ['reports', 'redis'],
  ['reports', 'horizon'],
  ['horizon', 'redis'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Прикладной слой', stroke: '#10b981'},
  lazy: {label: 'Очередь / async', stroke: '#f59e0b', dash: '6 4'},
  composer: {label: 'Composer-пакет', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'laravel',
    label: 'Laravel',
    toolchain: 'Composer · PSR-4 · Artisan · Blade/Vite',
    tree: [
      {
        type: 'dir',
        path: 'crm-app',
        children: [
          {type: 'file', path: 'crm-app/composer.json', role: 'Зависимости', hint: 'laravel/framework, guzzle, predis — и dev: phpunit'},
          {type: 'file', path: 'crm-app/artisan', role: 'CLI', hint: 'php artisan migrate, queue:work, make:controller'},
          {type: 'file', path: 'crm-app/.env', role: 'Конфиг окружения', hint: 'DB, Redis, APP_KEY — не коммитится'},
          {
            type: 'dir',
            path: 'crm-app/public',
            role: 'Document root',
            children: [
              {type: 'file', path: 'crm-app/public/index.php', role: 'Front controller', hint: 'Единственная точка входа для HTTP'},
            ],
          },
          {
            type: 'dir',
            path: 'crm-app/app',
            role: 'Код приложения (PSR-4 App\\)',
            children: [
              {
                type: 'dir',
                path: 'crm-app/app/Http',
                children: [
                  {type: 'file', path: 'crm-app/app/Http/Controllers/OrderController.php', role: 'Контроллер', hint: 'Маршрут → валидация → сервис'},
                  {type: 'file', path: 'crm-app/app/Http/Middleware/AuthMiddleware.php', role: 'Middleware', hint: 'PSR-15 pipeline до контроллера'},
                ],
              },
              {
                type: 'dir',
                path: 'crm-app/app/Services',
                children: [
                  {type: 'file', path: 'crm-app/app/Services/OrderService.php', role: 'Бизнес-логика', hint: 'Инжектится через IoC-контейнер'},
                ],
              },
              {
                type: 'dir',
                path: 'crm-app/app/Models',
                children: [
                  {type: 'file', path: 'crm-app/app/Models/Order.php', role: 'Eloquent модель', hint: 'Active Record, связи hasMany/belongsTo'},
                ],
              },
              {
                type: 'dir',
                path: 'crm-app/app/Jobs',
                children: [
                  {type: 'file', path: 'crm-app/app/Jobs/SendReportJob.php', role: 'Очередь', hint: 'ShouldQueue — worker обрабатывает асинхронно'},
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'crm-app/routes',
            children: [
              {type: 'file', path: 'crm-app/routes/web.php', role: 'Web-маршруты', hint: 'Route::get/post → Controller@method'},
              {type: 'file', path: 'crm-app/routes/api.php', role: 'REST API', hint: 'Префикс /api, Sanctum/Passport'},
            ],
          },
          {
            type: 'dir',
            path: 'crm-app/resources',
            children: [
              {type: 'file', path: 'crm-app/resources/views/orders/index.blade.php', role: 'Blade-шаблон', hint: 'Компилируется в PHP-кэш'},
              {type: 'file', path: 'crm-app/resources/js/app.js', role: 'Frontend', hint: 'Vite собирает ассеты в public/build'},
            ],
          },
          {type: 'file', path: 'crm-app/vendor/', role: 'Composer packages', hint: 'Не редактируется; autoload через composer dump-autoload'},
        ],
      },
    ],
  },
  {
    id: 'symfony',
    label: 'Symfony',
    toolchain: 'Bundles · DI · Messenger · Doctrine',
    tree: [
      {
        type: 'dir',
        path: 'enterprise-api',
        children: [
          {type: 'file', path: 'enterprise-api/composer.json', role: 'symfony/* компоненты', hint: 'Подключаются по одному или через skeleton'},
          {type: 'file', path: 'enterprise-api/bin/console', role: 'Symfony Console', hint: 'cache:clear, messenger:consume'},
          {
            type: 'dir',
            path: 'enterprise-api/config',
            children: [
              {type: 'file', path: 'enterprise-api/config/services.yaml', role: 'DI-контейнер', hint: 'autowire: true — автосвязывание классов'},
              {type: 'file', path: 'enterprise-api/config/routes.yaml', role: 'Маршруты', hint: 'Атрибуты #[Route] или YAML'},
            ],
          },
          {
            type: 'dir',
            path: 'enterprise-api/src',
            children: [
              {
                type: 'dir',
                path: 'enterprise-api/src/Controller',
                children: [
                  {type: 'file', path: 'enterprise-api/src/Controller/OrderController.php', role: 'Controller', hint: 'extends AbstractController'},
                ],
              },
              {
                type: 'dir',
                path: 'enterprise-api/src/Entity',
                children: [
                  {type: 'file', path: 'enterprise-api/src/Entity/Order.php', role: 'Doctrine Entity', hint: 'Data Mapper, не Active Record'},
                ],
              },
              {
                type: 'dir',
                path: 'enterprise-api/src/Message',
                children: [
                  {type: 'file', path: 'enterprise-api/src/Message/ExportReportMessage.php', role: 'Messenger', hint: 'Async handler через AMQP/Redis transport'},
                ],
              },
            ],
          },
          {type: 'file', path: 'enterprise-api/templates/', role: 'Twig', hint: 'Шаблоны для HTML-ответов'},
          {type: 'file', path: 'enterprise-api/migrations/', role: 'Doctrine Migrations', hint: 'Версионирование схемы БД'},
        ],
      },
    ],
  },
  {
    id: 'wordpress',
    label: 'WordPress',
    toolchain: 'Hooks · Themes · Plugins · wp-content',
    tree: [
      {
        type: 'dir',
        path: 'blog-site',
        children: [
          {type: 'file', path: 'blog-site/wp-config.php', role: 'Конфиг', hint: 'DB credentials, salts, WP_DEBUG'},
          {type: 'file', path: 'blog-site/index.php', role: 'Bootstrap WP', hint: 'Загружает wp-load.php → wp-settings.php'},
          {
            type: 'dir',
            path: 'blog-site/wp-content',
            children: [
              {
                type: 'dir',
                path: 'blog-site/wp-content/themes/my-theme',
                children: [
                  {type: 'file', path: 'blog-site/wp-content/themes/my-theme/functions.php', role: 'Хуки темы', hint: 'add_action, add_filter — расширение ядра'},
                  {type: 'file', path: 'blog-site/wp-content/themes/my-theme/single.php', role: 'Шаблон записи', hint: 'Иерархия template files'},
                ],
              },
              {
                type: 'dir',
                path: 'blog-site/wp-content/plugins',
                children: [
                  {type: 'file', path: 'blog-site/wp-content/plugins/my-plugin/my-plugin.php', role: 'Плагин', hint: 'Plugin header, register_activation_hook'},
                ],
              },
            ],
          },
          {type: 'file', path: 'blog-site/wp-includes/', role: 'Ядро WP', hint: 'Не меняют напрямую — только хуки и фильтры'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'manifest',
    label: 'composer.json',
    cmd: '"require": { "laravel/framework": "^11.0", "guzzlehttp/guzzle": "^7.0" }',
    detail: 'Манифест фиксирует зависимости и секцию autoload (PSR-4 для App\\). Dev-зависимости — phpunit, phpstan.',
  },
  {
    id: 'install',
    label: 'composer install',
    cmd: 'vendor/  autoload.php  composer.lock',
    detail: 'Composer скачивает пакеты в vendor/, генерирует оптимизированный autoload. lock-файл фиксирует точные версии для CI и продакшена.',
  },
  {
    id: 'request',
    label: 'HTTP → FPM',
    cmd: 'GET /orders  →  nginx  →  php-fpm  →  public/index.php',
    detail: 'Веб-сервер передаёт запрос в пул FPM. index.php подключает vendor/autoload.php и bootstrap приложения.',
  },
  {
    id: 'bootstrap',
    label: 'Bootstrap',
    cmd: '$app = require bootstrap/app.php;\n$kernel = $app->make(Kernel::class);',
    detail: 'IoC-контейнер регистрирует сервис-провайдеры, конфиг, middleware. Фреймворк инициализируется один раз на запрос (или переиспользуется в Octane).',
  },
  {
    id: 'dispatch',
    label: 'Маршрут',
    cmd: 'Route::get("/orders") → OrderController@index → OrderService → Eloquent',
    detail: 'Router сопоставляет URI и HTTP-метод. Контроллер получает зависимости через constructor injection из контейнера.',
  },
  {
    id: 'response',
    label: 'Ответ',
    cmd: 'return view("orders.index", $data);  // или JsonResponse',
    detail: 'Blade/Twig рендерит HTML; API возвращает JSON. Тяжёлые задачи уходят в queue: SendReportJob::dispatch().',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'psr4',
    label: 'PSR-4 + Composer',
    era: 'Стандарт · с 2014',
    color: '#10b981',
    syntax: `// composer.json
"autoload": {
  "psr-4": {
    "App\\\\": "app/",
    "Domain\\\\Orders\\\\": "src/Orders/"
  }
}

// app/Services/OrderService.php
namespace App\\Services;
class OrderService { ... }`,
    traits: ['Автозагрузка по namespace', 'Один класс — один файл', 'composer dump-autoload', 'Стандарт для Laravel/Symfony'],
    tools: 'Composer, PHPStan, IDE navigation',
    use: 'Все современные PHP-проекты',
  },
  {
    id: 'require',
    label: 'require / include',
    era: 'Legacy · процедурный PHP',
    color: '#3b82f6',
    syntax: `require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/helpers.php';

// WordPress, старые CMS
include get_template_directory() . '/partials/header.php';`,
    traits: ['Ручное подключение файлов', 'Нет namespace из коробки', 'Риск дублирования', 'Порядок include важен'],
    tools: 'Только ядро PHP',
    use: 'WordPress partials, legacy-код, простые скрипты',
  },
  {
    id: 'extensions',
    label: 'Расширения ext-*',
    era: 'PECL · системный уровень',
    color: '#f59e0b',
    syntax: `// composer.json — только проверка наличия
"require": { "ext-pdo": "*", "ext-redis": "*" }

// php.ini
extension=pdo_mysql
extension=redis`,
    traits: ['Компилируются в PHP (C)', 'PDO, Redis, mbstring, gd', 'Не в vendor/', 'docker-php-ext-install в контейнерах'],
    tools: 'pecl, apt, docker-php-ext-*',
    use: 'Драйверы БД, кэш, изображения, Swoole/Opcache',
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
  const hasQueue = enabledNodeIds.has('reports');
  const composerCount = DEP_NODES.filter((n) => n.type === 'composer' && enabledNodeIds.has(n.id)).length;
  const autoload = ['App\\ → app/', 'vendor/autoload.php'];
  const processes = hasQueue
    ? ['php-fpm worker', 'queue:work / Horizon']
    : ['php-fpm worker'];
  return {autoload, hasQueue, composerCount, processes};
}
