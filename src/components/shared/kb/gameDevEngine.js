/** Данные для демо раздела "Разработка игр". */

export const PIPELINE_STAGES = [
  {
    id: 'concept',
    label: 'Идея',
    phase: 'Pre-production',
    weeks: '2–8',
    deliverables: ['Питч и референсы', 'Жанр и ЦА', 'Core loop на бумаге'],
    roles: ['Гейм-дизайнер', 'Продюсер'],
    risk: 'Размытая фантазия без проверяемой механики',
  },
  {
    id: 'preprod',
    label: 'Препродакшн',
    phase: 'Pre-production',
    weeks: '8–20',
    deliverables: ['GDD и техспека', 'Вертикальный срез', 'План команды и бюджета'],
    roles: ['Lead design', 'Техдир', 'Арт-директор'],
    risk: 'Переоценка объёма до прототипа',
  },
  {
    id: 'production',
    label: 'Продакшн',
    phase: 'Production',
    weeks: '40–200+',
    deliverables: ['Код механик', 'Уровни и контент', 'Арт, звук, UI'],
    roles: ['Программисты', 'Level design', 'QA'],
    risk: 'Feature creep и технический долг',
  },
  {
    id: 'qa',
    label: 'Тестирование',
    phase: 'Alpha / Beta',
    weeks: '8–24',
    deliverables: ['Баг-репорты', 'Баланс и перф', 'Сертификация TRC'],
    roles: ['QA', 'Сертификация платформ'],
    risk: 'Критические баги на финишной прямой',
  },
  {
    id: 'launch',
    label: 'Релиз',
    phase: 'Gold master',
    weeks: '2–6',
    deliverables: ['Day-1 патч', 'Маркетинг', 'Метрики воронки'],
    roles: ['Продюсер', 'Community', 'DevOps'],
    risk: 'Провал маркетинга при сильной игре',
  },
  {
    id: 'live',
    label: 'Live-ops',
    phase: 'Post-release',
    weeks: '∞',
    deliverables: ['Патчи и сезоны', 'Аналитика retention', 'Античит и модерация'],
    roles: ['Live team', 'Аналитики', 'Поддержка'],
    risk: 'Выгорание команды без плана контента',
  },
];

export const GAME_ENGINES = [
  {
    id: 'unity',
    name: 'Unity',
    lang: 'C#',
    dim: '2D / 3D',
    license: 'Подписка + роялти',
    strength: 'Инди, мобайл, кроссплатформа',
    weakness: 'Runtime overhead, большие AAA реже',
    platforms: 20,
    color: '#1a1a2e',
  },
  {
    id: 'unreal',
    name: 'Unreal Engine',
    lang: 'C++ / Blueprint',
    dim: '3D AAA',
    license: '5% после $1M',
    strength: 'Графика, Nanite, MetaHuman',
    weakness: 'Порог входа, размер билда',
    platforms: 15,
    color: '#0e7490',
  },
  {
    id: 'godot',
    name: 'Godot',
    lang: 'GDScript / C#',
    dim: '2D сильнее 3D',
    license: 'MIT, open source',
    strength: 'Лёгкий, бесплатный, сцены-дерево',
    weakness: 'Меньше ассет-стор и AAA-кейсов',
    platforms: 8,
    color: '#478cbf',
  },
  {
    id: 'roblox',
    name: 'Roblox Studio',
    lang: 'Luau',
    dim: 'UGC-платформа',
    license: 'Rev-share Roblox',
    strength: 'Соц. мультиплеер из коробки',
    weakness: 'Ограничения платформы, нет файловой системы',
    platforms: 1,
    color: '#e11d48',
  },
];

export const UNITY_DEMO_OBJECT = {
  name: 'PlayerShip',
  components: [
    {id: 'transform', label: 'Transform', desc: 'Позиция, поворот, масштаб'},
    {id: 'rigidbody', label: 'Rigidbody2D', desc: 'Физика и гравитация'},
    {id: 'collider', label: 'BoxCollider2D', desc: 'Столкновения'},
    {id: 'sprite', label: 'SpriteRenderer', desc: 'Отрисовка спрайта'},
    {id: 'input', label: 'PlayerController', desc: 'Скрипт: ввод и стрельба'},
    {id: 'audio', label: 'AudioSource', desc: 'Звук двигателя'},
  ],
};

export const ROBLOX_FLOW = [
  {from: 'client', to: 'server', msg: 'RemoteEvent: FireServer("BuySword")', secure: false},
  {from: 'server', to: 'client', msg: 'Проверка баланса в DataStore', secure: true},
  {from: 'server', to: 'client', msg: 'Replicate: Tool экипирован', secure: true},
];

export const MDA_LOOP = [
  {id: 'mechanics', label: 'Механики', desc: 'Правила: прыжок, инвентарь, урон', color: '#7c3aed'},
  {id: 'dynamics', label: 'Динамика', desc: 'Поведение системы: риск, темп, мета', color: '#2563eb'},
  {id: 'aesthetics', label: 'Эстетика', desc: 'Что чувствует игрок: вызов, фантазия, fellowship', color: '#059669'},
];

export const DEV_ROLES = [
  {id: 'design', label: 'Гейм-дизайн', focus: 'GDD, баланс, уровни'},
  {id: 'code', label: 'Программирование', focus: 'Геймплей, ИИ, сеть'},
  {id: 'art', label: 'Арт и анимация', focus: 'Модели, VFX, UI'},
  {id: 'audio', label: 'Звук', focus: 'SFX, музыка, микш'},
  {id: 'qa', label: 'QA', focus: 'Регрессия, перф, TRC'},
  {id: 'prod', label: 'Продюсирование', focus: 'Сроки, риски, релиз'},
];

export const HUB_TOPICS = [
  {title: 'Процесс', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/1', icon: '📋'},
  {title: 'Roblox', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/2', icon: '🧱'},
  {title: 'Roblox: экономика', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/202', icon: '💰'},
  {title: 'Unity', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/3', icon: '⚙'},
  {title: 'Unreal', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/4', icon: '🔥'},
  {title: 'Движки', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/113', icon: '🏗'},
  {title: 'Гейм-дизайн', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/117', icon: '🎯'},
  {title: 'Команда', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/111', icon: '👥'},
  {title: 'Тестирование', doc: '/encyclopedia/9-spinoff/9-04-razrabotka-igr/124', icon: '🐛'},
];

export const PROJECT_CONTEXTS = [
  {
    id: 'aaa',
    label: 'AAA',
    team: '200–800+',
    horizon: '3–7 лет',
    trait: 'Узкая специализация, жёсткие стандарты',
    depth: 95,
    breadth: 35,
    risk: 'Коммуникация между отделами и scope creep',
    color: '#dc2626',
  },
  {
    id: 'indie',
    label: 'Indie',
    team: '1–15',
    horizon: '6–36 мес',
    trait: 'Полифункциональность, сетевая структура',
    depth: 55,
    breadth: 85,
    risk: 'Выгорание и нехватка экспертизы в узких зонах',
    color: '#2563eb',
  },
  {
    id: 'experimental',
    label: 'Art / Edu',
    team: '1–5',
    horizon: 'Гибкий',
    trait: 'Авторская модель, процесс как результат',
    depth: 40,
    breadth: 70,
    risk: 'Нет коммерческой обратной связи до дедлайна',
    color: '#7c3aed',
  },
];

export const GAMEDEV_DISCIPLINES = [
  {
    id: 'code',
    label: 'Программирование',
    icon: '⌨',
    layers: ['Движок', 'Системы', 'Геймплей'],
    mustKnow: ['Game loop 16.6 ms', 'ECS / компоненты', 'Профилирование GPU/CPU'],
  },
  {
    id: 'design',
    label: 'Гейм-дизайн',
    icon: '🎯',
    layers: ['Механики', 'Баланс', 'Уровни'],
    mustKnow: ['Core loop', 'MDA', 'Метрики retention'],
  },
  {
    id: 'art',
    label: 'Арт и анимация',
    icon: '🎨',
    layers: ['Концепт', '3D/2D', 'VFX'],
    mustKnow: ['PBR-набор карт', 'LOD и бюджет полигонов', 'Пайплайн в движок'],
  },
  {
    id: 'audio',
    label: 'Звук',
    icon: '🔊',
    layers: ['SFX', 'Музыка', 'Микш'],
    mustKnow: ['3D-аудио', 'Адаптивные шины', 'Компрессия под платформу'],
  },
  {
    id: 'prod',
    label: 'Продюсирование',
    icon: '📋',
    layers: ['План', 'Риски', 'Релиз'],
    mustKnow: ['Воронка этапов', 'Сертификация TRC', 'Live-ops'],
  },
  {
    id: 'qa',
    label: 'QA',
    icon: '🐛',
    layers: ['Функция', 'Перф', 'Совместимость'],
    mustKnow: ['Регрессия', 'Автотесты', 'Чеклисты платформ'],
  },
  {
    id: 'biz',
    label: 'Маркетинг / аналитика',
    icon: '📈',
    layers: ['UA', 'Монетизация', 'Сообщество'],
    mustKnow: ['LTV / CPI', 'A/B в live', 'Store-страница'],
  },
];

export const TEAM_HANDOFFS = [
  {from: 'design', to: 'code', artifact: 'GDD → прототип механики', risk: 'Нереализуемая механика без tech review'},
  {from: 'code', to: 'art', artifact: 'Лимиты полигонов / шейдеров', risk: 'Ассеты не влезают в memory budget'},
  {from: 'art', to: 'code', artifact: 'FBX + PBR-набор', risk: 'Сломанные UV или неверный scale'},
  {from: 'design', to: 'qa', artifact: 'Acceptance criteria уровня', risk: 'Субъективный "фан" вместо проверяемых кейсов'},
  {from: 'qa', to: 'prod', artifact: 'Severity-отчёт перед gold', risk: 'Блокеры спрятаны в "minor"'},
  {from: 'audio', to: 'design', artifact: 'Адаптивные стемы под состояния', risk: 'Звук не читается в геймплее'},
];

export const ENGINE_SUBSYSTEMS = [
  {id: 'render', label: 'Рендеринг', ms: 6.2, unit: 'GPU', desc: 'Сцена → кадр: culling, материалы, постобработка'},
  {id: 'physics', label: 'Физика', ms: 1.4, unit: 'CPU', desc: 'Rigidbody, коллайдеры, constraints'},
  {id: 'anim', label: 'Анимации', ms: 1.1, unit: 'CPU', desc: 'Скелет, blend trees, IK'},
  {id: 'audio', label: 'Аудио', ms: 0.6, unit: 'CPU', desc: '3D-звук, микш, стриминг банков'},
  {id: 'ai', label: 'ИИ / навигация', ms: 1.8, unit: 'CPU', desc: 'NavMesh, behavior trees, perception'},
  {id: 'script', label: 'Геймплей-логика', ms: 2.4, unit: 'CPU', desc: 'Скрипты, UI, сохранения, сеть'},
  {id: 'input', label: 'Ввод / UI', ms: 0.5, unit: 'CPU', desc: 'Периферия, меню, HUD'},
];

export const FRAME_BUDGET_MS = 16.6;

export const GAME_LANGS = [
  {
    id: 'c',
    name: 'C',
    era: '1980–90-е',
    perf: 98,
    productivity: 35,
    safety: 30,
    engines: 'id Tech, ранние консоли',
    note: 'Минимальные накладные расходы, ABI для middleware',
  },
  {
    id: 'cpp',
    name: 'C++',
    era: 'AAA с 1996',
    perf: 96,
    productivity: 45,
    safety: 40,
    engines: 'Unreal, Frostbite, CryEngine',
    note: 'Контроль памяти, шаблоны без runtime-cost',
  },
  {
    id: 'csharp',
    name: 'C#',
    era: 'Unity с 2005',
    perf: 72,
    productivity: 88,
    safety: 82,
    engines: 'Unity (+ IL2CPP)',
    note: 'GC и продуктивность; критичное — в native плагинах',
  },
  {
    id: 'lua',
    name: 'Lua / Luau',
    era: 'Скриптинг',
    perf: 55,
    productivity: 80,
    safety: 65,
    engines: 'Roblox, WoW mods, движковые VM',
    note: 'Горячая перезагрузка логики без пересборки C++',
  },
  {
    id: 'gdscript',
    name: 'GDScript',
    era: 'Godot',
    perf: 58,
    productivity: 85,
    safety: 70,
    engines: 'Godot 4',
    note: 'Лёгкий вход, 2D и инди; меньше AAA-кейсов',
  },
];

export const TEXTURE_MAPS = [
  {id: 'albedo', label: 'Albedo', role: 'Базовый цвет без освещения', tint: '#b45309'},
  {id: 'normal', label: 'Normal', role: 'Имитация микрорельефа в шейдере', tint: '#6366f1'},
  {id: 'rough', label: 'Roughness', role: 'Матовость / блеск (PBR)', tint: '#64748b'},
  {id: 'metal', label: 'Metallic', role: 'Металл vs диэлектрик', tint: '#94a3b8'},
  {id: 'ao', label: 'Ambient Occlusion', role: 'Затенение в щелях', tint: '#1e293b'},
];

export const MDA_EXAMPLES = {
  mechanics: [
    'Двойной прыжок с ограничением выносливости',
    'Крафт: рецепт = N ресурсов + время',
    'Roguelike: permadeath + мета-прогресс',
  ],
  dynamics: [
    'Риск vs награда при входе в "красную зону"',
    'Экономика дефицита на аукционе',
    'Социальное давление в кооперативе',
  ],
  aesthetics: [
    'Fellowship — совместное прохождение босса',
    'Challenge — обучение через поражение',
    'Discovery — секреты без маркеров на карте',
  ],
};

export const GAME_PLATFORMS = {
  pc: {
    label: 'PC',
    icon: '🖥',
    os: ['Windows 10/11', 'Linux (Proton)', 'macOS'],
    apis: ['DirectX 12', 'Vulkan', 'OpenGL (legacy)'],
    distro: ['Steam', 'Epic', 'GOG', 'собственный лаунчер'],
    constraint: 'Разброс железа — от iGPU до RTX; настройки графики обязательны',
    cert: 'Нет TRC, зато античит и DRM по выбору издателя',
    color: '#0ea5e9',
  },
  ps: {
    label: 'PlayStation',
    icon: '🎮',
    os: ['PlayStation OS'],
    apis: ['GNM/GNMX', 'Vulkan subset'],
    distro: ['PlayStation Store'],
    constraint: 'Фиксированный профиль железа; строгие лимиты RAM и SSD IO',
    cert: 'TRC Sony — сейвы, трофеи, отсутствие крашей на gold',
    color: '#003791',
  },
  nintendo: {
    label: 'Nintendo',
    icon: '🔴',
    os: ['Nintendo OS (Switch)'],
    apis: ['NVN'],
    distro: ['Nintendo eShop'],
    constraint: 'Портатив + док: два режима производительности',
    cert: 'Lotcheck — контроллеры, suspend, размер картриджа',
    color: '#e60012',
  },
  xbox: {
    label: 'Xbox',
    icon: '🟢',
    os: ['Xbox OS'],
    apis: ['DirectX 12 (Xbox)'],
    distro: ['Microsoft Store', 'Game Pass'],
    constraint: 'Семейство Series S/X — разные GPU и storage',
    cert: 'XR — достижения, Quick Resume, accessibility',
    color: '#107c10',
  },
};

export const MOBILE_OS = [
  {
    id: 'android',
    label: 'Android',
    langs: ['Kotlin', 'Java'],
    ide: 'Android Studio',
    fragment: 'Высокая',
    store: 'Google Play',
    note: 'Открытый SDK, тысячи конфигураций устройств',
  },
  {
    id: 'ios',
    label: 'iOS',
    langs: ['Swift', 'Objective-C'],
    ide: 'Xcode (macOS)',
    fragment: 'Низкая',
    store: 'App Store',
    note: 'Metal, строгая модерация, единообразные экраны',
  },
];

export const OPT_TECHNIQUES = [
  {id: 'lod', label: 'LOD-модели', saveMs: 2.1, desc: 'Дальние объекты — меньше полигонов'},
  {id: 'pool', label: 'Object pooling', saveMs: 1.4, desc: 'Без Instantiate/Destroy в бою'},
  {id: 'tex', label: 'Сжатие ASTC/ETC2', saveMs: 0.8, desc: 'Меньше VRAM и bandwidth'},
  {id: 'batch', label: 'Батчинг draw calls', saveMs: 1.6, desc: 'Instancing и атласы'},
  {id: 'async', label: 'Фоновые потоки', saveMs: 1.2, desc: 'ИИ и IO вне game loop'},
  {id: 'gc', label: 'Без аллокаций в Update', saveMs: 0.9, desc: 'Кэш компонентов, struct-буферы'},
];

export const QA_TYPES = [
  {
    id: 'functional',
    label: 'Функциональное',
    checks: ['Сохранения', 'Мультиплеер', 'IAP и валюта'],
    severity: 'Блокер при потере прогресса',
  },
  {
    id: 'perf',
    label: 'Производительность',
    checks: ['FPS min/avg', 'Утечки RAM', 'Нагрев на мобайле'],
    severity: 'Major при просадке < 30 FPS',
  },
  {
    id: 'compat',
    label: 'Совместимость',
    checks: ['Минимальное железо', 'Разрешения', 'Локализация'],
    severity: 'Major при краше на 10% девайсов',
  },
  {
    id: 'ux',
    label: 'UX / баланс',
    checks: ['Туториал', 'Читаемость UI', 'Справедливость'],
    severity: 'Только ручная сессия',
  },
];

export const QA_SAMPLE_BUGS = [
  {id: 'b1', title: 'Сейв не пишется после сна консоли', type: 'functional', sev: 'blocker'},
  {id: 'b2', title: 'FPS падает до 18 в городе на Series S', type: 'perf', sev: 'major'},
  {id: 'b3', title: 'Кнопка "Купить" дублирует списание', type: 'functional', sev: 'blocker'},
  {id: 'b4', title: 'Немецкий текст вылезает за кнопку', type: 'compat', sev: 'minor'},
  {id: 'b5', title: 'Босс слишком лёгкий на Hard', type: 'ux', sev: 'tuning'},
];

export function frameBudgetUsed(enabledSubsystemIds, enabledOptIds = []) {
  const subMs = ENGINE_SUBSYSTEMS.filter((s) => enabledSubsystemIds.includes(s.id)).reduce(
    (sum, s) => sum + s.ms,
    0,
  );
  const optSave = OPT_TECHNIQUES.filter((o) => enabledOptIds.includes(o.id)).reduce(
    (sum, o) => sum + o.saveMs,
    0,
  );
  return Math.max(4, subMs - optSave);
}

export function langScore(lang, key) {
  return lang[key] ?? 0;
}
