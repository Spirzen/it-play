/** Данные для LuaEcosystemPlay — статья 5-15-lua-i-luau/11. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и запуск'},
  {id: 'modules', label: 'Модули и require'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'vm',
    tag: 'Runtime',
    label: 'Lua 5.4 · Luau VM',
    color: '#2c6ebb',
    icon: '🌙',
    items: ['.lua · .luac · .luau', 'coroutines · GC', 'embed в C/C++'],
    detail:
      'Интерпретатор читает исходник, компилирует в байткод и выполняет на VM. Luau — диалект Roblox (типы, task.*). LuaJIT ускоряет OpenResty и игры через JIT.',
  },
  {
    id: 'capi',
    tag: 'Расширения',
    label: 'C API · FFI · встраивание',
    color: '#64748b',
    icon: '🔌',
    items: ['lua.h · stack API', 'LuaJIT FFI', 'Neovim · Redis · WoW'],
    detail:
      'Хост-приложение создаёт lua_State, регистрирует нативные функции и загружает скрипты. Библиотеки на C (socket, lpeg) подключаются как модуль или через luarocks.',
  },
  {
    id: 'packages',
    tag: 'Зависимости',
    label: 'LuaRocks · rockspec',
    color: '#10b981',
    icon: '📦',
    items: ['luarocks install', 'rockspec · manifest', 'luarocks path', 'LuaDist (legacy)'],
    detail:
      'Аналог pip для Lua: пакеты из luarocks.org, локальные rockspec, дерево в luarocks tree. package.path и package.cpath расширяются автоматически.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Редакторы и качество',
    color: '#ec4899',
    icon: '🔧',
    items: ['VS Code + Lua LSP', 'ZeroBrane Studio', 'StyLua · Selene', 'Busted · luacheck'],
    detail:
      'Lua Language Server даёт переход к определению и диагностику. ZeroBrane — IDE с отладкой LÖVE/Defold. Roblox Studio — закрытая среда с live-reload Luau.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Игры · веб · embed',
    color: '#06b6d4',
    icon: '⚙',
    items: ['LÖVE · Defold · Solar2D', 'OpenResty · ngx_lua', 'Roblox · Neovim'],
    detail:
      'Движок задаёт цикл (love.load/update/draw), API и упаковку. OpenResty вшивает Lua в Nginx. Roblox предоставляет сервисы и клиент-сервер без "голого" lua на диске.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['main.lua · conf.lua', 'lib/ · src/', 'ModuleScript · init.lua'],
    detail:
      'Скрипты организуются через require и каталоги. В LÖVE точка входа — main.lua в корне проекта. В Roblox — дерево ServerScriptService и ReplicatedStorage.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220) — пример LÖVE + LuaRocks. */
export const DEP_NODES = [
  {id: 'main', label: 'main.lua', type: 'app', x: 200, y: 24},
  {id: 'game', label: 'game.lua', type: 'module', x: 90, y: 90},
  {id: 'player', label: 'lib/player', type: 'module', x: 200, y: 90},
  {id: 'net', label: 'lib/net', type: 'lazy', x: 310, y: 90},
  {id: 'love', label: 'love.*', type: 'engine', x: 70, y: 168},
  {id: 'socket', label: 'luasocket', type: 'rock', x: 175, y: 168},
  {id: 'json', label: 'dkjson', type: 'rock', x: 265, y: 168},
  {id: 'busted', label: 'busted', type: 'rock', x: 355, y: 168},
];

export const DEP_EDGES = [
  ['main', 'game'],
  ['main', 'player'],
  ['main', 'net'],
  ['game', 'love'],
  ['player', 'love'],
  ['player', 'game'],
  ['net', 'socket'],
  ['net', 'json'],
  ['main', 'busted'],
  ['game', 'busted'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Прикладной модуль', stroke: '#10b981'},
  lazy: {label: 'Сеть (опционально)', stroke: '#f59e0b', dash: '6 4'},
  engine: {label: 'API движка', stroke: '#06b6d4'},
  rock: {label: 'LuaRocks-пакет', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'love',
    label: 'LÖVE 2D',
    toolchain: 'love.load · love.update · love.draw · conf.lua',
    tree: [
      {
        type: 'dir',
        path: 'space-game',
        children: [
          {type: 'file', path: 'space-game/main.lua', role: 'Точка входа', hint: 'love.load — инициализация; require("game")'},
          {type: 'file', path: 'space-game/conf.lua', role: 'Конфиг движка', hint: 't.title, t.window.width — настройки LÖVE'},
          {type: 'file', path: 'space-game/game.lua', role: 'Игровая логика', hint: 'update(dt), draw() — состояние мира'},
          {
            type: 'dir',
            path: 'space-game/lib',
            role: 'Модули',
            children: [
              {type: 'file', path: 'space-game/lib/player.lua', role: 'Сущность', hint: 'return { x, y, update = function(dt) ... } }'},
              {type: 'file', path: 'space-game/lib/collision.lua', role: 'Утилита', hint: 'AABB, require из player и game'},
              {type: 'file', path: 'space-game/lib/net.lua', role: 'Сеть (опц.)', hint: 'require("socket.http") после luarocks install luasocket'},
            ],
          },
          {type: 'file', path: 'space-game/assets/', role: 'Ресурсы', hint: 'love.graphics.newImage — спрайты, шрифты'},
          {type: 'file', path: 'space-game/spec/player_spec.lua', role: 'Busted', hint: 'describe("player") — luarocks install busted'},
        ],
      },
    ],
  },
  {
    id: 'roblox',
    label: 'Roblox · Luau',
    toolchain: 'ServerScriptService · ReplicatedStorage · ModuleScript',
    tree: [
      {
        type: 'dir',
        path: 'obby-game',
        children: [
          {
            type: 'dir',
            path: 'obby-game/ServerScriptService',
            role: 'Сервер',
            children: [
              {type: 'file', path: 'obby-game/ServerScriptService/GameServer.server.lua', role: 'Script', hint: '--!strict; инициализация мира, DataStore'},
              {
                type: 'dir',
                path: 'obby-game/ServerScriptService/Services',
                children: [
                  {type: 'file', path: 'obby-game/ServerScriptService/Services/PlayerService.lua', role: 'ModuleScript', hint: 'return {} — require(ReplicatedStorage.Shared...)'},
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'obby-game/ReplicatedStorage',
            role: 'Общее клиент/сервер',
            children: [
              {
                type: 'dir',
                path: 'obby-game/ReplicatedStorage/Shared',
                children: [
                  {type: 'file', path: 'obby-game/ReplicatedStorage/Shared/Config.lua', role: 'ModuleScript', hint: 'Константы уровня, типы Luau'},
                  {type: 'file', path: 'obby-game/ReplicatedStorage/Shared/Remotes.lua', role: 'RemoteEvent', hint: 'FireClient / OnServerEvent — сеть Roblox'},
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'obby-game/StarterPlayer/StarterPlayerScripts',
            role: 'Клиент',
            children: [
              {type: 'file', path: 'obby-game/StarterPlayer/StarterPlayerScripts/Client.client.lua', role: 'LocalScript', hint: 'UI, ввод; не доверять клиенту для экономики'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'openresty',
    label: 'OpenResty',
    toolchain: 'Nginx · ngx_lua · LuaJIT · access_by_lua',
    tree: [
      {
        type: 'dir',
        path: 'api-gateway',
        children: [
          {type: 'file', path: 'api-gateway/nginx.conf', role: 'Nginx', hint: 'lua_package_path; init_by_lua_file'},
          {type: 'file', path: 'api-gateway/lua/init.lua', role: 'init', hint: 'Глобальные модули, shared dict, redis connect'},
          {
            type: 'dir',
            path: 'api-gateway/lua',
            children: [
              {type: 'file', path: 'api-gateway/lua/access.lua', role: 'access_by_lua', hint: 'JWT, rate limit до proxy_pass'},
              {type: 'file', path: 'api-gateway/lua/router.lua', role: 'Маршрутизация', hint: 'ngx.var.uri — выбор upstream'},
              {type: 'file', path: 'api-gateway/lua/handlers/orders.lua', role: 'Handler', hint: 'require("handlers.orders") — бизнес-логика'},
            ],
          },
          {type: 'file', path: 'api-gateway/rockspec/api-gateway-1.0-1.rockspec', role: 'LuaRocks', hint: 'dependencies = { "lua-resty-redis", "lua-cjson" }'},
          {type: 'file', path: 'api-gateway/Dockerfile', role: 'Деплой', hint: 'openresty/openresty — образ с LuaJIT'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'install',
    label: 'Lua',
    cmd: '# Windows (scoop/choco) или apt\nsudo apt install lua5.4 luarocks\nlua -v\nluarocks --version',
    detail: 'Официальный Lua с lua.org или пакет ОС. Luau в Roblox уже в Studio. Для LÖVE часто ставят бандл love + встроенный Lua.',
  },
  {
    id: 'rocks',
    label: 'LuaRocks',
    cmd: 'luarocks install luasocket\nluarocks install dkjson\nluarocks install busted',
    detail: 'Пакеты попадают в tree luarocks. eval `luarocks path` добавляет пути в package.path и package.cpath для текущей сессии.',
  },
  {
    id: 'local',
    label: 'Локальный rock',
    cmd: 'luarocks make\n# или в dev-режиме\nluarocks make --local',
    detail: 'rockspec описывает модуль библиотеки: имя, версия, зависимости. make собирает C-часть и устанавливает .lua в tree.',
  },
  {
    id: 'require',
    label: 'require',
    cmd: 'local Player = require("lib.player")\nlocal json = require("dkjson")',
    detail: 'require ищет модуль по package.path (?.lua). Кэш в package.loaded. Относительные пути задаются через love.filesystem или cwd.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: 'love .                    # LÖVE из каталога проекта\nlua main.lua              # чистый Lua\nopenresty -p . -c nginx.conf',
    detail: 'LÖVE запускает main.lua и цикл событий. OpenResty — master/worker Nginx с ngx_lua. Roblox — Play в Studio без отдельного lua.exe.',
  },
  {
    id: 'bytecode',
    label: 'Байткод',
    cmd: 'luac -o main.luac main.lua\nlua main.luac',
    detail: '.luac скрывает исходник частично и пропускает парсинг при загрузке. Не заменяет обфускацию; в продакшене игр чаще пакуют .love-архив.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'require',
    label: 'require + package.path',
    era: 'Классика · LÖVE',
    color: '#2c6ebb',
    syntax: `-- lib/player.lua
local Player = {}
function Player.new(x, y) ... end
return Player

-- main.lua
local Player = require("lib.player")`,
    traits: ['Один return на файл', 'Кэш package.loaded', 'Пути через ?.lua в package.path'],
    tools: 'lua main.lua · love . · luarocks path',
    use: 'LÖVE, Neovim config, скрипты утилит',
  },
  {
    id: 'luarocks',
    label: 'LuaRocks · rockspec',
    era: 'Библиотека · сервер',
    color: '#10b981',
    syntax: `-- mylib-1.0-1.rockspec
package = "mylib"
dependencies = { "lua >= 5.1", "luasocket" }

-- после luarocks make:
local http = require("socket.http")`,
    traits: ['Версии и зависимости', 'C-модули в cpath', 'Публикация на luarocks.org'],
    tools: 'luarocks install · luarocks pack · luarocks upload',
    use: 'OpenResty, shared libs, CI-пакеты',
  },
  {
    id: 'roblox',
    label: 'ModuleScript · Luau',
    era: 'Roblox Studio',
    color: '#e11d48',
    syntax: `-- ReplicatedStorage.Shared.Config (ModuleScript)
export type LevelConfig = { id: number, name: string }
return { MaxLives = 3 }

-- ServerScriptService/GameServer.server.lua
local Config = require(game.ReplicatedStorage.Shared.Config)`,
    traits: ['--!strict · типы', 'game:GetService', 'Нет файловой FS как на диске'],
    tools: 'Rojo · Argon · Studio Explorer',
    use: 'Игры Roblox, live-reload в тестовой сессии',
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
  const hasNet = enabledNodeIds.has('net');
  const rockCount = DEP_NODES.filter((n) => n.type === 'rock' && enabledNodeIds.has(n.id)).length;
  const layers = hasNet
    ? ['main.lua', 'game.lua · lib/player · lib/net', `LuaRocks: ${rockCount} пакетов`]
    : ['main.lua', 'game.lua · lib/player', `LuaRocks: ${rockCount - 2} (без сети)`];
  return {layers, hasNet, rockCount};
}
