/** Данные для AspNetArchitecturePlay — экосистема, pipeline, решение, пакеты, модели */

export const MODES = [
  {id: 'evolution', label: 'Эволюция'},
  {id: 'request', label: 'Путь запроса'},
  {id: 'solution', label: 'Сборка решения'},
  {id: 'packages', label: 'Пакеты NuGet'},
  {id: 'models', label: 'Модели UI/API'},
];

export const EVOLUTION_ERAS = [
  {
    id: 'webforms',
    year: '2002',
    name: 'ASP.NET Web Forms',
    tag: 'Page-centric',
    traits: ['PostBack', 'ViewState', 'Server Controls'],
    note: 'Событийная модель как WinForms; сложно тестировать и масштабировать.',
    legacy: true,
  },
  {
    id: 'mvc',
    year: '2009',
    name: 'ASP.NET MVC',
    tag: 'MVC',
    traits: ['Controller + View', 'REST-friendly', 'Unit-тесты'],
    note: 'Явное разделение; полный контроль над HTML.',
    legacy: true,
  },
  {
    id: 'webapi',
    year: '2012',
    name: 'ASP.NET Web API',
    tag: 'HTTP API',
    traits: ['ApiController', 'JSON/XML', 'DI + routing'],
    note: 'Отдельный стек для SPA и мобильных клиентов.',
    legacy: true,
  },
  {
    id: 'core',
    year: '2016+',
    name: 'ASP.NET Core',
    tag: 'Единая платформа',
    traits: ['Kestrel', 'Middleware', 'Кроссплатформа', 'Open Source'],
    note: 'MVC, Web API и Razor Pages в одной модели; без System.Web.dll.',
    legacy: false,
  },
];

export const TOOL_ITEMS = [
  {id: 'sdk', label: '.NET SDK', role: 'dotnet new · build · run'},
  {id: 'vs', label: 'Visual Studio', role: 'Шаблоны · отладка · publish'},
  {id: 'rider', label: 'JetBrains Rider', role: 'Кроссплатформенная IDE'},
  {id: 'cli', label: 'dotnet CLI', role: 'CI/CD · Docker · тесты'},
  {id: 'nuget', label: 'NuGet', role: 'Пакеты Microsoft.AspNetCore.*'},
  {id: 'docker', label: 'Docker', role: 'aspnet/runtime образы'},
  {id: 'iis', label: 'IIS + ANCM', role: 'In-Process / Out-of-Process'},
  {id: 'swash', label: 'OpenAPI', role: 'Swagger · Scalar · Postman'},
];

export const REQUEST_LAYERS = [
  {
    id: 'edge',
    label: 'Периметр',
    short: 'Клиент · proxy',
    icon: '🌐',
    nodes: [
      {id: 'client', label: 'Клиент', role: 'Браузер · MAUI · curl'},
      {id: 'proxy', label: 'Reverse proxy', role: 'Nginx · IIS · CDN'},
    ],
  },
  {
    id: 'host',
    label: 'Хост',
    short: 'Kestrel',
    icon: '⚡',
    nodes: [
      {id: 'kestrel', label: 'Kestrel', role: 'HTTP/1.1 · HTTP/2'},
      {id: 'httpctx', label: 'HttpContext', role: 'Request · Response · Features'},
    ],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    short: 'Middleware',
    icon: '🔗',
    nodes: [
      {id: 'exception', label: 'Exception', role: 'Ошибки · dev page'},
      {id: 'routing', label: 'Routing', role: 'Endpoint selection'},
      {id: 'auth', label: 'AuthN / AuthZ', role: 'JWT · Cookie'},
      {id: 'endpoints', label: 'Endpoints', role: 'MapControllers · MapGet'},
    ],
  },
  {
    id: 'app',
    label: 'Приложение',
    short: 'Код',
    icon: '🧩',
    nodes: [
      {id: 'controller', label: 'Controller / Page', role: 'MVC · Razor · Minimal'},
      {id: 'services', label: 'Сервисы (DI)', role: 'Scoped · Transient'},
      {id: 'data', label: 'Данные', role: 'EF Core · Dapper'},
    ],
  },
];

export const REQUEST_SCENARIOS = [
  {
    id: 'api-get',
    title: 'GET /api/notes',
    subtitle: 'REST API — от прокси до JSON-ответа',
    steps: [
      {spotlight: ['client', 'proxy'], label: 'HTTPS-запрос', detail: 'TLS на proxy; дальше — локальный сокет к Kestrel'},
      {spotlight: ['kestrel', 'httpctx'], label: 'Kestrel создаёт HttpContext', detail: 'Парсинг заголовков и маршрута'},
      {spotlight: ['exception', 'routing'], label: 'Middleware до endpoint', detail: 'Routing находит NotesController.Get'},
      {spotlight: ['auth', 'endpoints'], label: 'Авторизация и вызов', detail: '[Authorize] → action method'},
      {spotlight: ['controller', 'services', 'data'], label: 'Сервис и БД', detail: 'INotesService → EF Core → JSON', packet: 'down'},
      {spotlight: ['httpctx', 'client'], label: 'Ответ 200 OK', detail: 'System.Text.Json; middleware "after"', packet: 'response'},
    ],
  },
  {
    id: 'razor-page',
    title: 'Razor Page',
    subtitle: 'HTML с сервера — без SPA',
    steps: [
      {spotlight: ['client'], label: 'GET /Notes/Index', detail: 'Cookie-сессия в заголовках'},
      {spotlight: ['kestrel', 'routing'], label: 'Сопоставление страницы', detail: 'Pages/Notes/Index.cshtml + PageModel'},
      {spotlight: ['endpoints', 'controller'], label: 'OnGetAsync()', detail: 'Model binding из query'},
      {spotlight: ['services', 'data'], label: 'Загрузка данных', detail: 'DbContext (scoped) → список заметок', packet: 'down'},
      {spotlight: ['controller', 'client'], label: 'Razor → HTML', detail: 'View Engine компилирует .cshtml', packet: 'response'},
    ],
  },
  {
    id: 'static',
    title: 'Статический файл',
    subtitle: 'Short-circuit в UseStaticFiles',
    steps: [
      {spotlight: ['client', 'proxy'], label: 'GET /css/site.css', detail: 'Кэш браузера · CDN'},
      {spotlight: ['kestrel'], label: 'Запрос в pipeline', detail: 'Exception → HTTPS redirect'},
      {spotlight: ['routing'], label: 'UseStaticFiles', detail: 'Файл из wwwroot — pipeline завершается', packet: 'down'},
      {spotlight: ['client'], label: '304 / 200 + файл', detail: 'Без контроллеров и DI', packet: 'response'},
    ],
  },
];

export const SOLUTION_TREE = [
  {id: 'sln', label: 'MyApp.sln', type: 'root', children: ['src', 'tests', 'docker']},
  {
    id: 'src',
    label: 'src/MyApp.Web/',
    type: 'folder',
    children: ['program', 'controllers', 'pages', 'services', 'config'],
  },
  {id: 'program', label: 'Program.cs', type: 'file', role: 'WebApplication.CreateBuilder · pipeline'},
  {id: 'controllers', label: 'Controllers/', type: 'file', role: 'Web API · MVC'},
  {id: 'pages', label: 'Pages/ или Views/', type: 'file', role: 'Razor Pages · .cshtml'},
  {id: 'services', label: 'Services/', type: 'file', role: 'Бизнес-логика · DI'},
  {id: 'config', label: 'appsettings.json', type: 'file', role: 'IConfiguration · Options'},
  {id: 'tests', label: 'MyApp.Tests/', type: 'folder', role: 'WebApplicationFactory'},
  {id: 'docker', label: 'Dockerfile', type: 'file', role: 'SDK build → aspnet runtime'},
];

export const SOLUTION_SCENARIOS = [
  {
    id: 'new',
    title: 'dotnet new webapi',
    subtitle: 'Шаблон → первый запуск',
    steps: [
      {highlight: ['sln', 'src'], label: 'Создание проекта', detail: 'SDK + Microsoft.NET.Sdk.Web'},
      {highlight: ['program'], label: 'Program.cs', detail: 'builder.Services + app.MapControllers()'},
      {highlight: ['config'], label: 'appsettings + User Secrets', detail: 'ConnectionString в dev'},
      {highlight: ['controllers'], label: 'WeatherForecastController', detail: 'Пример [ApiController]'},
      {highlight: ['docker'], label: 'dotnet run', detail: 'Kestrel слушает :5000 / :5001'},
    ],
  },
  {
    id: 'grow',
    title: 'Рост решения',
    subtitle: 'Слои и зависимости',
    steps: [
      {highlight: ['services'], label: 'Вынос логики в Services/', detail: 'Интерфейсы + AddScoped в DI'},
      {highlight: ['controllers', 'pages'], label: 'Тонкие контроллеры', detail: 'Только HTTP и DTO'},
      {highlight: ['tests'], label: 'Интеграционные тесты', detail: 'Microsoft.AspNetCore.Mvc.Testing'},
      {highlight: ['docker'], label: 'Publish + контейнер', detail: 'framework-dependent или self-contained'},
    ],
  },
];

export const ASPNET_PACKAGE_GRAPH = {
  project: {id: 'project', label: 'MyWeb.csproj'},
  packages: [
    {id: 'sdk-web', label: 'Microsoft.NET.Sdk.Web', version: 'SDK', deps: ['shared']},
    {id: 'aspnetcore', label: 'Microsoft.AspNetCore.App', version: '10.0', deps: ['extensions', 'mvc']},
    {id: 'mvc', label: 'Microsoft.AspNetCore.Mvc', version: '10.0', deps: ['extensions', 'routing']},
    {id: 'extensions', label: 'Microsoft.Extensions.*', version: '10.0', deps: ['di', 'config']},
    {id: 'di', label: 'DependencyInjection', version: '10.0', deps: []},
    {id: 'config', label: 'Configuration', version: '10.0', deps: []},
    {id: 'routing', label: 'Routing', version: '10.0', deps: []},
    {id: 'ef', label: 'Microsoft.EntityFrameworkCore.SqlServer', version: '10.0', deps: ['extensions']},
    {id: 'identity', label: 'Microsoft.AspNetCore.Identity.EntityFrameworkCore', version: '10.0', deps: ['ef', 'mvc']},
    {id: 'jwt', label: 'Microsoft.AspNetCore.Authentication.JwtBearer', version: '10.0', deps: ['aspnetcore']},
    {id: 'openapi', label: 'Swashbuckle.AspNetCore', version: '7.x', deps: ['mvc']},
    {id: 'shared', label: 'FrameworkReference', version: '—', deps: []},
  ],
};

export const ASPNET_PACKAGE_SCENARIOS = [
  {
    id: 'web',
    title: 'Базовый Web API',
    subtitle: 'Sdk.Web тянет shared framework',
    steps: [
      {highlight: ['project', 'sdk-web'], label: 'Sdk="Microsoft.NET.Sdk.Web"', detail: 'FrameworkReference на Microsoft.AspNetCore.App'},
      {highlight: ['aspnetcore', 'mvc'], label: 'Metapackage в runtime', detail: 'Не копируется в publish — shared framework'},
      {highlight: ['extensions', 'di'], label: 'DI из коробки', detail: 'builder.Services.AddControllers()'},
      {highlight: ['project'], label: 'dotnet build', detail: 'IL + deps.json → bin/'},
    ],
  },
  {
    id: 'full',
    title: 'API + auth + OpenAPI',
    subtitle: 'Добавление пакетов вручную',
    steps: [
      {highlight: ['ef'], label: 'dotnet add package EF Core', detail: 'DbContext в scoped'},
      {highlight: ['identity', 'jwt'], label: 'Identity + JWT Bearer', detail: 'Cookie для Razor, JWT для API'},
      {highlight: ['openapi'], label: 'Swashbuckle', detail: 'Swagger UI в Development'},
      {highlight: ['project'], label: 'Restore → граф', detail: 'Транзитивные Microsoft.Extensions.*'},
    ],
  },
];

export const APP_MODELS = [
  {
    id: 'minimal',
    name: 'Minimal API',
    stack: 'MapGet · MapGroup',
    flow: ['Program.cs', 'Endpoint delegate', 'JSON'],
    when: 'Микросервисы, мало эндпоинтов, OpenAPI',
    link: '/encyclopedia/5-languages/5-05-csharp/4517',
  },
  {
    id: 'webapi',
    name: 'Web API',
    stack: 'ControllerBase · [ApiController]',
    flow: ['Controller', 'Action', 'IActionResult / DTO'],
    when: 'REST для SPA, мобильных клиентов, B2B',
    link: '/encyclopedia/5-languages/5-05-csharp/4511',
  },
  {
    id: 'mvc',
    name: 'MVC',
    stack: 'Controller + Views',
    flow: ['Route', 'Controller', 'View (.cshtml)'],
    when: 'Сайты с HTML, View Components, SEO',
    link: '/encyclopedia/5-languages/5-05-csharp/451',
  },
  {
    id: 'razor',
    name: 'Razor Pages',
    stack: 'PageModel · @page',
    flow: ['URL → .cshtml', 'OnGet/OnPost', 'Page()'],
    when: 'Админки, CRUD, одна страница = один файл',
    link: '/encyclopedia/5-languages/5-05-csharp/4514',
  },
  {
    id: 'blazor-server',
    name: 'Blazor Server',
    stack: 'SignalR · компоненты .razor',
    flow: ['Circuit', 'Server render', 'EventCallback'],
    when: 'Внутренние инструменты, C# вместо JS',
    link: '/encyclopedia/5-languages/5-05-csharp/4512',
  },
  {
    id: 'blazor-wasm',
    name: 'Blazor WASM',
    stack: 'WebAssembly · HttpClient',
    flow: ['WASM runtime', 'API calls', 'UI в браузере'],
    when: 'SPA на .NET, offline после загрузки',
    link: '/encyclopedia/5-languages/5-05-csharp/4512',
  },
];

export const MIDDLEWARE_CHAIN = [
  {id: 'exception', label: 'ExceptionHandler', order: 1},
  {id: 'https', label: 'HttpsRedirection', order: 2},
  {id: 'static', label: 'StaticFiles', order: 3},
  {id: 'routing', label: 'UseRouting', order: 4},
  {id: 'cors', label: 'CORS', order: 5},
  {id: 'authn', label: 'Authentication', order: 6},
  {id: 'authz', label: 'Authorization', order: 7},
  {id: 'session', label: 'Session', order: 8},
  {id: 'endpoints', label: 'Map* / Endpoints', order: 9},
];

export const META = {
  title: 'ASP.NET Core — архитектура и экосистема',
  subtitle:
    'Эволюция стека, путь HTTP-запроса, структура решения, NuGet-пакеты и модели разработки',
  footer:
    'ASP.NET Core — не отдельный "веб-сервер", а хост + middleware + выбранная модель (API, Razor, Blazor). Пакеты Microsoft.AspNetCore.* и Extensions.* связывают всё через DI и конфигурацию.',
};
