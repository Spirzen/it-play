/** Данные для RubyEcosystemPlay — статья 5-11-ruby/15. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф gems'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'request', label: 'Запрос через Rack'},
  {id: 'gems', label: 'Bundler и require'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'ruby',
    tag: 'Язык',
    label: 'Ruby (MRI)',
    color: '#cc342d',
    icon: '💎',
    items: ['Matz · 1995', 'метапрограммирование', 'GVL · GC · JIT (YJIT)'],
    detail:
      'Интерпретатор исполняет .rb-файлы. Открытые классы и DSL позволяют фреймворкам "расширять" язык (5.days.ago, has_many).',
  },
  {
    id: 'stdlib',
    tag: 'stdlib',
    label: 'Стандартная библиотека',
    color: '#f59e0b',
    icon: '📚',
    items: ['JSON · Net::HTTP', 'FileUtils · Logger', 'Rake (в составе)'],
    detail:
      'Входит в поставку Ruby. Для веба чаще используют gems, но базовые сокеты, файлы и тесты (Minitest) доступны без Bundler.',
  },
  {
    id: 'gems',
    tag: 'Gems',
    label: 'RubyGems · Bundler',
    color: '#10b981',
    icon: '📦',
    items: ['Gemfile · Gemfile.lock', 'bundle install', 'gemspec · версии'],
    detail:
      'Gem — упакованная библиотека. Bundler фиксирует совместимые версии в lock-файле. require загружает код в процесс Ruby.',
  },
  {
    id: 'rack',
    tag: 'Rack',
    label: 'Rack-интерфейс',
    color: '#8b5cf6',
    icon: '🔗',
    items: ['call(env) → [status, headers, body]', 'Puma · Unicorn', 'middleware stack'],
    detail:
      'Единый контракт между веб-сервером и приложением. Rails, Sinatra, Roda — все Rack-приложения; отличаются маршрутизацией и "магией".',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Rails · Sinatra · Roda · Hanami',
    color: '#06b6d4',
    icon: '⚙',
    items: ['Active Record · Action Pack', 'микро-DSL Sinatra', 'дерево Roda', 'слои Hanami'],
    detail:
      'Фреймворк инвертирует контроль: вы пишете обработчики и модели, а каркас вызывает их в жизненном цикле запроса.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['app/models · controllers', 'config/routes.rb', 'lib/ · services', 'spec/ · test/'],
    detail:
      'Прикладная логика: MVC в Rails, routes.rb + handlers в Sinatra, interactors/repositories в Hanami. Gems подключаются в Gemfile.',
  },
];

/** Узлы графа gems (viewBox 420×240). */
export const DEP_NODES = [
  {id: 'config', label: 'config.ru', type: 'app', x: 210, y: 22},
  {id: 'routes', label: 'routes.rb', type: 'module', x: 70, y: 88},
  {id: 'controller', label: 'ArticlesController', type: 'module', x: 210, y: 88},
  {id: 'jobs', label: 'MailerJob', type: 'lazy', x: 350, y: 88},
  {id: 'rails', label: 'rails', type: 'gem', x: 55, y: 175},
  {id: 'ar', label: 'activerecord', type: 'gem', x: 145, y: 175},
  {id: 'puma', label: 'puma', type: 'gem', x: 235, y: 175},
  {id: 'sidekiq', label: 'sidekiq', type: 'gem', x: 325, y: 175},
  {id: 'pg', label: 'pg', type: 'gem', x: 395, y: 175},
];

export const DEP_EDGES = [
  ['config', 'routes'],
  ['config', 'controller'],
  ['config', 'jobs'],
  ['routes', 'rails'],
  ['controller', 'rails'],
  ['controller', 'ar'],
  ['jobs', 'sidekiq'],
  ['jobs', 'rails'],
  ['rails', 'ar'],
  ['rails', 'puma'],
  ['ar', 'pg'],
  ['sidekiq', 'pg'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа Rack', stroke: '#6366f1'},
  module: {label: 'Прикладной код', stroke: '#10b981'},
  lazy: {label: 'Фон / async', stroke: '#f59e0b', dash: '6 4'},
  gem: {label: 'Gem из Gemfile', stroke: '#cc342d'},
};

export const ARCH_PRESETS = [
  {
    id: 'rails-monolith',
    label: 'Rails (монолит)',
    toolchain: 'Bundler · Zeitwerk · Active Record · Puma',
    tree: [
      {
        type: 'dir',
        path: 'shop',
        children: [
          {type: 'file', path: 'shop/Gemfile', role: 'Зависимости', hint: 'gem "rails", "puma", "pg", "sidekiq"'},
          {type: 'file', path: 'shop/config.ru', role: 'Rack entry', hint: 'run Rails.application'},
          {type: 'file', path: 'shop/config/routes.rb', role: 'Маршруты', hint: 'resources :articles — REST по CoC'},
          {
            type: 'dir',
            path: 'shop/app',
            children: [
              {
                type: 'dir',
                path: 'shop/app/models',
                role: 'Active Record',
                children: [
                  {type: 'file', path: 'shop/app/models/article.rb', role: 'Модель', hint: 'has_many :comments, validations, scopes'},
                ],
              },
              {
                type: 'dir',
                path: 'shop/app/controllers',
                role: 'Action Controller',
                children: [
                  {type: 'file', path: 'shop/app/controllers/articles_controller.rb', role: 'Контроллер', hint: 'def show — один запрос = один экземпляр'},
                ],
              },
              {
                type: 'dir',
                path: 'shop/app/views',
                role: 'Action View',
                children: [
                  {type: 'file', path: 'shop/app/views/articles/show.html.erb', role: 'Шаблон', hint: 'layout application.html.erb'},
                ],
              },
              {
                type: 'dir',
                path: 'shop/app/jobs',
                role: 'Active Job',
                children: [
                  {type: 'file', path: 'shop/app/jobs/notify_job.rb', role: 'Фон', hint: 'perform → Sidekiq adapter'},
                ],
              },
            ],
          },
          {type: 'file', path: 'shop/db/migrate/', role: 'Миграции', hint: 'Версионирование схемы БД'},
        ],
      },
    ],
  },
  {
    id: 'sinatra-api',
    label: 'Sinatra (API)',
    toolchain: 'Rack · Sequel · RSpec · dotenv',
    tree: [
      {
        type: 'dir',
        path: 'webhook-hub',
        children: [
          {type: 'file', path: 'webhook-hub/Gemfile', role: 'Минимум gems', hint: 'sinatra, sequel, pg'},
          {type: 'file', path: 'webhook-hub/app.rb', role: 'Всё в одном файле', hint: 'get/post DSL, require sequel'},
          {type: 'file', path: 'webhook-hub/config.ru', role: 'Rack', hint: 'run Sinatra::Application'},
          {
            type: 'dir',
            path: 'webhook-hub/lib',
            role: 'По желанию',
            children: [
              {type: 'file', path: 'webhook-hub/lib/db.rb', role: 'Sequel connect', hint: 'ORM без генераторов Rails'},
              {type: 'file', path: 'webhook-hub/lib/handlers/', role: 'Обработчики', hint: 'Вынести логику из app.rb при росте'},
            ],
          },
          {type: 'file', path: 'webhook-hub/spec/app_spec.rb', role: 'Тесты', hint: 'rack-test — запросы без браузера'},
        ],
      },
    ],
  },
  {
    id: 'hanami-bookshelf',
    label: 'Hanami',
    toolchain: 'ROM/Sequel · DI container · несколько apps/',
    tree: [
      {
        type: 'dir',
        path: 'bookshelf',
        children: [
          {type: 'file', path: 'bookshelf/Gemfile', role: 'hanami', hint: 'Без monkey-patching stdlib'},
          {
            type: 'dir',
            path: 'bookshelf/apps',
            role: 'Несколько приложений',
            children: [
              {
                type: 'dir',
                path: 'bookshelf/apps/web',
                children: [
                  {type: 'file', path: 'bookshelf/apps/web/actions/articles/show.rb', role: 'Action', hint: 'Только HTTP, без бизнес-логики'},
                  {type: 'file', path: 'bookshelf/apps/web/views/articles/show.rb', role: 'View', hint: 'Подготовка данных для шаблона'},
                  {type: 'file', path: 'bookshelf/apps/web/templates/', role: 'ERB', hint: 'Без логики в шаблоне'},
                ],
              },
              {type: 'file', path: 'bookshelf/apps/api/', role: 'Отдельное API', hint: 'Свои routes и middleware'},
            ],
          },
          {
            type: 'dir',
            path: 'bookshelf/lib/bookshelf',
            role: 'Домен',
            children: [
              {type: 'file', path: 'bookshelf/lib/bookshelf/entities/article.rb', role: 'Entity', hint: 'Чистый объект данных'},
              {type: 'file', path: 'bookshelf/lib/bookshelf/repositories/article_repository.rb', role: 'Repository', hint: 'SQL/ORM изолирован здесь'},
              {type: 'file', path: 'bookshelf/lib/bookshelf/interactors/create_article.rb', role: 'Interactor', hint: 'Бизнес-правила, unit-тесты'},
            ],
          },
        ],
      },
    ],
  },
];

export const REQUEST_STEPS = [
  {
    id: 'puma',
    label: 'Puma',
    cmd: 'GET /articles/42 HTTP/1.1',
    detail: 'Веб-сервер принимает соединение и передаёт env в Rack-приложение (config.ru → Rails.application).',
    activeMw: [],
    highlight: ['puma'],
  },
  {
    id: 'ssl',
    label: 'SSL · Static',
    cmd: 'ActionDispatch::SSL · Rack::Sendfile',
    detail: 'Редирект на HTTPS, отдача статики из public/ без загрузки MVC.',
    activeMw: ['ssl', 'static'],
    highlight: ['ssl', 'static'],
  },
  {
    id: 'session',
    label: 'Cookies · Session',
    cmd: 'ActionDispatch::Cookies · Session::CookieStore',
    detail: 'Разбор кук, загрузка сессии (_shop_session), request_id для логов.',
    activeMw: ['ssl', 'static', 'logger', 'cookies'],
    highlight: ['cookies', 'logger'],
  },
  {
    id: 'router',
    label: 'RouteSet',
    cmd: "match → articles#show, params: { id: '42' }",
    detail: 'config/routes.rb: resources :articles. Определяются controller, action, params.',
    activeMw: ['ssl', 'static', 'logger', 'cookies', 'router'],
    highlight: ['router'],
  },
  {
    id: 'controller',
    label: 'Controller',
    cmd: 'ArticlesController#show → Article.find(42)',
    detail: 'before_action, работа с Active Record, @article для шаблона.',
    activeMw: ['ssl', 'static', 'logger', 'cookies', 'router', 'controller'],
    highlight: ['controller', 'ar'],
  },
  {
    id: 'view',
    label: 'View · Response',
    cmd: 'render show.html.erb → 200 OK + ETag',
    detail: 'Action View, layout, обратный проход по middleware (ETag, сжатие).',
    activeMw: ['ssl', 'static', 'logger', 'cookies', 'router', 'controller', 'view'],
    highlight: ['view'],
  },
];

export const RACK_MIDDLEWARE = [
  {id: 'ssl', label: 'SSL'},
  {id: 'static', label: 'Static'},
  {id: 'logger', label: 'Logger'},
  {id: 'cookies', label: 'Session'},
  {id: 'router', label: 'Router'},
  {id: 'controller', label: 'Controller'},
  {id: 'view', label: 'View'},
];

export const GEM_SYSTEMS = [
  {
    id: 'require',
    label: 'require',
    era: 'Встроено в Ruby',
    color: '#f59e0b',
    syntax: `# Загрузка по имени файла в $LOAD_PATH
require 'json'
require_relative './lib/helper'

# Gem после gem install добавляет путь в load path`,
    traits: ['Синхронная загрузка', 'Один раз на процесс', 'Порядок require важен', 'Без lock-файла'],
    tools: 'ruby -e "require ..."',
    use: 'Скрипты, rake-задачи, irb · одиночные .rb',
  },
  {
    id: 'bundler',
    label: 'Bundler',
    era: 'Стандарт для приложений',
    color: '#cc342d',
    syntax: `# Gemfile
source 'https://rubygems.org'
gem 'rails', '~> 7.1'
gem 'puma'
gem 'pg'

# Терминал: bundle install → Gemfile.lock`,
    traits: ['Gemfile.lock', 'bundle exec', 'группы :development', 'совместимость версий'],
    tools: 'bundle install · update · exec',
    use: 'Rails, Sinatra, Hanami — любой проект с зависимостями',
  },
  {
    id: 'gemspec',
    label: 'gemspec',
    era: 'Публикация gem',
    color: '#10b981',
    syntax: `# my_tool.gemspec
Gem::Specification.new do |s|
  s.name = 'my_tool'
  s.version = '1.0.0'
  s.files = Dir['lib/**/*.rb']
  s.add_runtime_dependency 'thor'
end

# gem build · gem push`,
    traits: ['Версия API gem', 'runtime vs dev deps', 'RubyGems.org', 'используется Bundler внутри'],
    tools: 'gem build · rake release',
    use: 'Свои библиотеки, CLI-утилиты, open source',
  },
];

export const FRAMEWORK_COMPARE = [
  {id: 'rails', label: 'Rails', color: '#cc342d', mvp: 5, maintain: 3, boot: '1–3 с', fit: 'CRUD, full-stack, MVP'},
  {id: 'sinatra', label: 'Sinatra', color: '#3b82f6', mvp: 4, maintain: 2, boot: '50–100 мс', fit: 'API, webhooks, прототипы'},
  {id: 'roda', label: 'Roda', color: '#8b5cf6', mvp: 3, maintain: 4, boot: '20–50 мс', fit: 'Вложенные маршруты, RPS'},
  {id: 'hanami', label: 'Hanami', color: '#06b6d4', mvp: 1, maintain: 5, boot: '300–800 мс', fit: 'Долгая поддержка, слои'},
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
  const hasJobs = enabledNodeIds.has('jobs');
  const gemCount = DEP_NODES.filter((n) => n.type === 'gem' && enabledNodeIds.has(n.id)).length;
  const load = hasJobs ? 'Boot ~2.1 с (Sidekiq + AR)' : 'Boot ~1.4 с (без фоновых jobs)';
  return {load, hasJobs, gemCount};
}
