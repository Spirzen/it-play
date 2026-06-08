/** Данные для раздела tools/games (справочник инструментов). */

export const TOOL_GAME_ENGINES = [
  {
    id: 'unity',
    name: 'Unity',
    lang: 'C#',
    dim: '2D / 3D',
    license: 'Подписка',
    tier: 'universal',
    strength: 'Кроссплатформа, Asset Store, огромное комьюнити',
    link: 'https://unity.com/download',
  },
  {
    id: 'unreal',
    name: 'Unreal Engine',
    lang: 'C++ / Blueprint',
    dim: '3D AAA',
    license: '5% после $1M',
    tier: 'aaa',
    strength: 'Nanite, Lumen, кинематографичная графика',
    link: 'https://www.unrealengine.com/',
  },
  {
    id: 'godot',
    name: 'Godot',
    lang: 'GDScript / C#',
    dim: '2D / 3D',
    license: 'MIT',
    tier: 'indie',
    strength: 'Бесплатный, лёгкий, открытый исходник',
    link: 'https://godotengine.org/download/',
  },
  {
    id: 'gamemaker',
    name: 'GameMaker',
    lang: 'GML',
    dim: '2D',
    license: 'Платная',
    tier: 'indie',
    strength: 'Быстрый 2D, drag-and-drop для новичков',
    link: 'https://gamemaker.io/',
  },
  {
    id: 'construct',
    name: 'Construct',
    lang: 'Events / JS',
    dim: '2D',
    license: 'Подписка',
    tier: 'beginner',
    strength: 'Без кода, экспорт в Web',
    link: 'https://www.construct.net/',
  },
  {
    id: 'defold',
    name: 'Defold',
    lang: 'Lua',
    dim: '2D',
    license: 'Apache 2.0',
    tier: 'indie',
    strength: 'Лёгкий рантайм, облачная сборка',
    link: 'https://defold.com/',
  },
  {
    id: 'love2d',
    name: 'LÖVE',
    lang: 'Lua',
    dim: '2D',
    license: 'MIT',
    tier: 'beginner',
    strength: 'Минимализм, обучение и прототипы',
    link: 'https://love2d.org/',
  },
  {
    id: 'phaser',
    name: 'Phaser',
    lang: 'JavaScript',
    dim: '2D Web',
    license: 'MIT',
    tier: 'web',
    strength: 'Браузерные игры, npm/CDN',
    link: 'https://phaser.io/',
  },
  {
    id: 'bevy',
    name: 'Bevy',
    lang: 'Rust',
    dim: '2D / 3D',
    license: 'MIT / Apache',
    tier: 'code',
    strength: 'ECS, data-driven, современный Rust',
    link: 'https://bevyengine.org/',
  },
  {
    id: 'monogame',
    name: 'MonoGame',
    lang: 'C#',
    dim: '2D / 3D',
    license: 'Open source',
    tier: 'code',
    strength: 'Наследник XNA, Celeste, Stardew Valley',
    link: 'https://www.monogame.net/',
  },
];

export const ENGINE_TIER_LABEL = {
  all: 'Все',
  universal: 'Универсальные',
  aaa: 'AAA / 3D',
  indie: 'Инди / 2D',
  beginner: 'Для новичков',
  web: 'Веб',
  code: 'Код без редактора',
};

export const XBOX_GEN_OPTIONS = [
  {id: 'scarlett', label: 'Scarlett (Series X|S)', hint: 'Нативные игры нового поколения'},
  {id: 'durango', label: 'Durango (Xbox One)', hint: 'Поколение Xbox One'},
  {id: 'other', label: 'Другое / неизвестно', hint: 'Старые порты и редкие метки'},
];

export const XBOX_CONSOLE_TYPE_OPTIONS = [
  {id: 'gen9', label: 'XboxGen9', hint: 'Создана под Series X|S'},
  {id: 'aware', label: 'XboxOneGen9Aware', hint: 'Порт One с совместимостью Series'},
  {id: 'one', label: 'XboxOne', hint: 'Только Xbox One'},
  {id: 'unknown', label: 'Не указано', hint: 'Проверьте вручную в сведениях о файле'},
];

/** Правило совместимости с внешним USB (упрощённая модель из статьи). */
export function xboxExternalDriveVerdict(gen, consoleType) {
  if (gen === 'scarlett' && consoleType === 'gen9') {
    return {
      ok: false,
      title: 'Только внутренний SSD или карта расширения',
      detail:
        'Игра использует DirectStorage и скорость встроенного NVMe. USB-HDD/SSD не подходят для запуска.',
      storage: 'internal',
    };
  }
  if (consoleType === 'aware' || gen === 'durango' || consoleType === 'one') {
    return {
      ok: true,
      title: 'Можно запускать с внешнего USB',
      detail:
        'Режим совместимости или порт с Xbox One — игра не требует полного набора возможностей Series.',
      storage: 'external',
    };
  }
  return {
    ok: null,
    title: 'Уточните в "Сведения о файле"',
    detail: 'Откройте управление игрой → Сведения о файле и сверьте поля Gen и ConsoleType.',
    storage: 'unknown',
  };
}

export const XBOX_EXTERNAL_OK_GAMES = [
  "Assassin's Creed Odyssey",
  "Assassin's Creed Origins",
  'Far Cry 4',
  'Far Cry 5',
  'Far Cry New Dawn',
  'Halo: The Master Chief Collection',
  'Mass Effect Legendary Edition',
  'Minecraft Dungeons',
  'Ori and the Will of the Wisps',
  'Shadow of the Tomb Raider',
  'State of Decay 2',
  'The Elder Scrolls V: Skyrim',
  "Tom Clancy's The Division 2",
  'Warhammer: End Times – Vermintide 2',
];

export const GAMER_TOOL_CATEGORIES = [
  {id: 'all', label: 'Все'},
  {id: 'stream', label: 'Стрим и запись'},
  {id: 'social', label: 'Общение'},
  {id: 'store', label: 'Магазины'},
  {id: 'perf', label: 'Производительность'},
  {id: 'linux', label: 'Linux / Proton'},
  {id: 'dev', label: 'Создание игр'},
  {id: 'mod', label: 'Моды'},
];

export const GAMER_TOOLS = [
  {id: 'obs', name: 'OBS Studio', cat: 'stream', os: 'Win / macOS / Linux', note: 'Запись и стрим, сцены, FFmpeg', free: true},
  {id: 'streamlabs', name: 'Streamlabs Desktop', cat: 'stream', os: 'Win / macOS', note: 'OBS-надстройка, алерты, виджеты', free: 'freemium'},
  {id: 'shadowplay', name: 'NVIDIA ShadowPlay', cat: 'stream', os: 'Windows', note: 'Instant Replay, NVENC', free: true},
  {id: 'relive', name: 'AMD ReLive', cat: 'stream', os: 'Win / Linux', note: 'Запись в драйвере Radeon', free: true},
  {id: 'gamebar', name: 'Xbox Game Bar', cat: 'stream', os: 'Windows 10/11', note: 'Клипы, оверлей, Win+G', free: true},
  {id: 'discord', name: 'Discord', cat: 'social', os: 'Кроссплатформа', note: 'Голос, экран, серверы', free: true},
  {id: 'parsec', name: 'Parsec', cat: 'social', os: 'Кроссплатформа', note: 'Удалённый доступ с низкой задержкой', free: true},
  {id: 'moonlight', name: 'Moonlight', cat: 'social', os: 'Мульти', note: 'GameStream с ПК NVIDIA', free: true},
  {id: 'steam', name: 'Steam', cat: 'store', os: 'Win / macOS / Linux', note: 'Магазин, Workshop, Proton', free: true},
  {id: 'epic', name: 'Epic Games Store', cat: 'store', os: 'Win / macOS', note: 'Бесплатные игры, Unreal', free: true},
  {id: 'gog', name: 'GOG Galaxy', cat: 'store', os: 'Win / macOS', note: 'DRM-free, объединение библиотек', free: true},
  {id: 'heroic', name: 'Heroic Games Launcher', cat: 'store', os: 'Win / Linux', note: 'Epic/GOG на Linux', free: true},
  {id: 'playnite', name: 'Playnite', cat: 'store', os: 'Windows', note: 'Единая библиотека лаунчеров', free: true},
  {id: 'afterburner', name: 'MSI Afterburner', cat: 'perf', os: 'Windows', note: 'Разгон, оверлей FPS', free: true},
  {id: 'cortex', name: 'Razer Cortex', cat: 'perf', os: 'Windows', note: 'Очистка RAM перед игрой', free: true},
  {id: 'geforce-exp', name: 'GeForce Experience', cat: 'perf', os: 'Windows', note: 'Драйверы, оптимизация настроек', free: true},
  {id: 'lutris', name: 'Lutris', cat: 'linux', os: 'Linux', note: 'Установка игр через Wine/Proton', free: true},
  {id: 'proton', name: 'Proton (Steam)', cat: 'linux', os: 'Linux', note: 'Windows-игры в Steam Linux', free: true},
  {id: 'gamemode', name: 'GameMode', cat: 'linux', os: 'Linux', note: 'Приоритет CPU/Governor для игры', free: true},
  {id: 'mangohud', name: 'MangoHud', cat: 'linux', os: 'Linux', note: 'Оверлей FPS и температур', free: true},
  {id: 'unity-hub', name: 'Unity Hub', cat: 'dev', os: 'Кроссплатформа', note: 'Версии Unity и проекты', free: true},
  {id: 'godot', name: 'Godot Engine', cat: 'dev', os: 'Кроссплатформа', note: '2D/3D движок open source', free: true},
  {id: 'blender', name: 'Blender', cat: 'dev', os: 'Кроссплатформа', note: '3D, анимация, ассеты', free: true},
  {id: 'aseprite', name: 'Aseprite', cat: 'dev', os: 'Кроссплатформа', note: 'Пиксель-арт и спрайты', free: 'paid'},
  {id: 'tiled', name: 'Tiled', cat: 'dev', os: 'Кроссплатформа', note: 'Тайловые карты для 2D', free: true},
  {id: 'mo2', name: 'Mod Organizer 2', cat: 'mod', os: 'Windows', note: 'Моды Bethesda изолированно', free: true},
  {id: 'vortex', name: 'Vortex', cat: 'mod', os: 'Windows', note: 'Моды Nexus Mods', free: true},
  {id: 'reshade', name: 'ReShade', cat: 'mod', os: 'Windows', note: 'Постобработка в играх', free: true},
  {id: 'voicemeeter', name: 'VoiceMeeter', cat: 'stream', os: 'Windows', note: 'Виртуальный микшер для стрима', free: true},
];

export const GAME_STORE_CATEGORIES = [
  {id: 'all', label: 'Все'},
  {id: 'launcher', label: 'Лаунчеры'},
  {id: 'console', label: 'Консоли'},
  {id: 'indie', label: 'Инди / открытые'},
  {id: 'keys', label: 'Ключи и скидки'},
  {id: 'cloud', label: 'Облачный гейминг'},
];

export const GAME_STORES = [
  {id: 'steam', name: 'Steam', cat: 'launcher', drm: 'Steam', region: 'Глобально', note: 'Крупнейший PC-магазин, сообщества, Workshop'},
  {id: 'epic', name: 'Epic Games Store', cat: 'launcher', drm: 'Epic', region: 'Глобально', note: 'Еженедельные бесплатные игры'},
  {id: 'gog', name: 'GOG', cat: 'launcher', drm: 'Нет (DRM-free)', region: 'Глобально', note: 'Классика и политика без DRM'},
  {id: 'ea', name: 'EA App', cat: 'launcher', drm: 'EA', region: 'Глобально', note: 'Подписка EA Play'},
  {id: 'ubisoft', name: 'Ubisoft Connect', cat: 'launcher', drm: 'Ubisoft', region: 'Глобально', note: 'Franchise Ubisoft'},
  {id: 'bnet', name: 'Battle.net', cat: 'launcher', drm: 'Blizzard', region: 'Глобально', note: 'Diablo, WoW, Overwatch'},
  {id: 'ms', name: 'Microsoft Store', cat: 'launcher', drm: 'Microsoft', region: 'Глобально', note: 'Game Pass, Xbox на PC'},
  {id: 'itch', name: 'itch.io', cat: 'indie', drm: 'Опционально', region: 'Глобально', note: 'Инди, pay-what-you-want'},
  {id: 'humble', name: 'Humble Store', cat: 'indie', drm: 'Ключи', region: 'Глобально', note: 'Бандлы и благотворительность'},
  {id: 'ps', name: 'PlayStation Store', cat: 'console', drm: 'PSN', region: 'По региону PSN', note: 'PS4 / PS5'},
  {id: 'xbox', name: 'Xbox Store', cat: 'console', drm: 'Microsoft', region: 'По региону', note: 'Консоль и PC'},
  {id: 'nintendo', name: 'Nintendo eShop', cat: 'console', drm: 'Привязка к консоли', region: 'По региону', note: 'Switch / legacy'},
  {id: 'gmg', name: 'Green Man Gaming', cat: 'keys', drm: 'Ключи', region: 'Глобально', note: 'Ритейл ключей'},
  {id: 'fanatical', name: 'Fanatical', cat: 'keys', drm: 'Ключи', region: 'Глобально', note: 'Бандлы и акции'},
  {id: 'cdkeys', name: 'CDKeys', cat: 'keys', drm: 'Ключи', region: 'Глобально', note: 'Сторонний ритейл — проверяйте продавца'},
  {id: 'isthereanydeal', name: 'IsThereAnyDeal', cat: 'keys', drm: 'Агрегатор', region: '—', note: 'История цен, без продаж'},
  {id: 'geforce-now', name: 'GeForce NOW', cat: 'cloud', drm: 'Ваши аккаунты', region: 'По плану', note: 'Стрим с библиотеки Steam/Epic'},
  {id: 'xcloud', name: 'Xbox Cloud Gaming', cat: 'cloud', drm: 'Game Pass', region: 'По подписке', note: 'Облако Microsoft'},
  {id: 'ps-plus-stream', name: 'PS Plus Streaming', cat: 'cloud', drm: 'PS Plus Premium', region: 'Ограничено', note: 'Стрим классики и PS4'},
  {id: 'amazon-luna', name: 'Amazon Luna', cat: 'cloud', drm: 'Подписка', region: 'US/EU частично', note: 'Облачная библиотека Amazon'},
];
