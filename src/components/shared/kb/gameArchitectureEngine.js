/** Данные для демо архитектуры игры — подсистемы, game loop, стили. */

export const GAME_LAYERS = [
  {
    id: 'environment',
    label: 'Внешняя среда',
    icon: '🖥️',
    color: '#546e7a',
    nodes: [
      {id: 'os', label: 'ОС', role: 'Окно, ввод, файлы'},
      {id: 'gpu', label: 'GPU / CPU', role: 'Аппаратные ресурсы'},
      {id: 'network', label: 'Сеть', role: 'Сервисы, мультиплеер'},
    ],
  },
  {
    id: 'engine',
    label: 'Движок',
    icon: '⚙️',
    color: '#5c6bc0',
    nodes: [
      {id: 'render', label: 'Рендеринг', role: 'Шейдеры, камера, свет'},
      {id: 'physics', label: 'Физика', role: 'Коллизии, импульсы'},
      {id: 'audio', label: 'Звук', role: 'Микшер, 3D-позиция'},
      {id: 'input', label: 'Ввод', role: 'Клавиатура, геймпад'},
      {id: 'scene', label: 'Сцена', role: 'Дерево объектов'},
      {id: 'resources', label: 'Ресурсы', role: 'Ассеты, кэш'},
      {id: 'save', label: 'Сохранения', role: 'Сериализация'},
      {id: 'net', label: 'Сеть', role: 'Репликация, предсказание'},
    ],
  },
  {
    id: 'game',
    label: 'Игровая логика',
    icon: '🎮',
    color: '#7b1fa2',
    nodes: [
      {id: 'rules', label: 'Правила', role: 'Баланс, победа/поражение'},
      {id: 'ai', label: 'ИИ', role: 'Поведение NPC'},
      {id: 'scripts', label: 'Скрипты', role: 'Lua / C# / Blueprint'},
      {id: 'ui', label: 'UI игры', role: 'HUD, меню'},
    ],
  },
];

/** Зависимости: from → to (направленные). */
export const DEPENDENCY_EDGES = [
  ['game', 'rules', 'engine', 'scene'],
  ['game', 'ai', 'engine', 'physics'],
  ['game', 'scripts', 'engine', 'scene'],
  ['game', 'ui', 'engine', 'render'],
  ['engine', 'render', 'environment', 'gpu'],
  ['engine', 'physics', 'environment', 'gpu'],
  ['engine', 'input', 'environment', 'os'],
  ['engine', 'save', 'engine', 'scene'],
  ['engine', 'net', 'environment', 'network'],
  ['engine', 'scene', 'engine', 'resources'],
  ['engine', 'audio', 'environment', 'os'],
];

export const SUBSYSTEM_DETAILS = {
  render: {
    title: 'Система рендеринга',
    body: 'Превращает состояние мира в кадр. Часто через RHI поверх Vulkan/DirectX/Metal. Архитектурный выбор: forward vs deferred shading влияет на весь конвейер.',
    forbidden: 'Не должна зависеть от UI игры напрямую.',
  },
  physics: {
    title: 'Физика и коллизии',
    body: 'Симуляция с фиксированным шагом, независимо от FPS рендера. PhysX, Bullet или своя реализация.',
    forbidden: 'Не вызывает методы рендерера.',
  },
  input: {
    title: 'Система ввода',
    body: 'На фазе Input game loop только регистрирует намерения — мир ещё не меняется.',
    forbidden: 'Не меняет игровое состояние в этой фазе.',
  },
  scene: {
    title: 'Управление сценой',
    body: 'Иерархия объектов, трансформации, жизненный цикл сущностей.',
    forbidden: 'Циклические зависимости с ресурсами недопустимы.',
  },
  resources: {
    title: 'Менеджер ресурсов',
    body: 'Загрузка, кэш, потоковая подгрузка ассетов. Нижний уровень — не зависит от рендера.',
    forbidden: 'Рендерер запрашивает текстуры у ресурсов, не наоборот.',
  },
  rules: {
    title: 'Игровая логика',
    body: 'Уникальный код игры: правила, квесты, прогресс. Отделение от движка упрощает смену геймплея.',
    forbidden: 'Прямые вызовы API движка без слоя абстракции — анти-паттерн.',
  },
  net: {
    title: 'Сетевая подсистема',
    body: 'Авторитетный сервер, client prediction, lockstep — архитектурные решения с системным влиянием.',
    forbidden: 'Недетерминизм в критичных подсистемах ломает синхронизацию.',
  },
  save: {
    title: 'Сохранения',
    body: 'Сериализация через ограниченный API, не прямой доступ к внутренностям сущностей.',
    forbidden: 'Чтение приватных полей чужих модулей.',
  },
};

export const LOOP_PHASES = [
  {id: 'input', label: 'Input', icon: '⌨️', color: '#0288d1', detail: 'Сбор ввода без изменения мира'},
  {id: 'update', label: 'Update', icon: '🧠', color: '#ed6c02', detail: 'Физика, ИИ, логика, скрипты'},
  {id: 'render', label: 'Render', icon: '🖼️', color: '#7b1fa2', detail: 'Отрисовка текущего состояния'},
];

export const ARCH_STYLES = [
  {
    id: 'monolith',
    label: 'Монолит',
    icon: '🏛️',
    summary: 'Один процесс, внутренняя декомпозиция',
    pros: ['Минимальные накладные расходы', 'Простая отладка', 'Предсказуемый FPS'],
    cons: ['Сложно переиспользовать части', 'Риск скрытых зависимостей'],
    fit: 'Инди, прототипы, средние движки',
  },
  {
    id: 'data',
    label: 'Data-driven',
    icon: '📊',
    summary: 'Код — интерпретатор данных и сценариев',
    pros: ['Дизайнеры меняют баланс без C++', 'Быстрые итерации'],
    cons: ['Нужна дисциплина схем данных', 'Сложнее отладка цепочек'],
    fit: 'Unreal Blueprints, таблицы баланса',
  },
  {
    id: 'ecs',
    label: 'ECS',
    icon: '🔷',
    summary: 'Entity + Component + System',
    pros: ['Кэш-дружественность', 'Параллелизация', 'Массовые сцены'],
    cons: ['Смена парадигмы мышления', 'Сложнее скриптовый геймплей'],
    fit: 'DOTS, Bevy, крупные симуляции',
  },
  {
    id: 'hybrid',
    label: 'Гибрид',
    icon: '🔀',
    summary: 'Разные стили по доменам',
    pros: ['Рендер — монолит, баланс — data-driven', 'Сеть — микросервисы'],
    cons: ['Нужна согласованность границ', 'Сложнее онбординг'],
    fit: 'AAA, live-service',
  },
];

/** Рисует один кадр game loop на canvas. */
export function drawGameLoopFrame(ctx, w, h, phaseIndex, frame, opts = {}) {
  const {fixedStep = true, simulatedFps = 60} = opts;
  ctx.clearRect(0, 0, w, h);

  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--ifm-background-color')
    .trim() || '#1b1b1d';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const barH = 36;
  const phaseW = w / 3;
  LOOP_PHASES.forEach((ph, i) => {
    const x = i * phaseW;
    const active = i === phaseIndex;
    ctx.fillStyle = active ? ph.color : colorMix(ph.color, bg, 0.75);
    ctx.globalAlpha = active ? 1 : 0.35;
    ctx.fillRect(x + 4, 12, phaseW - 8, barH);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${ph.icon} ${ph.label}`, x + phaseW / 2, 34);
  });

  const t = frame * 0.08;
  const baseY = h * 0.55;
  let physicsY = baseY + Math.sin(t) * 28;

  if (!fixedStep && simulatedFps < 45) {
    physicsY = baseY + Math.sin(t * (simulatedFps / 60)) * 18;
  }

  ctx.fillStyle = '#ff7043';
  ctx.beginPath();
  ctx.arc(w * 0.5, physicsY, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#78909c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(24, baseY + 20);
  ctx.lineTo(w - 24, baseY + 20);
  ctx.stroke();

  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--ifm-color-content-secondary')
    .trim() || '#999';
  ctx.font = '10px system-ui,sans-serif';
  ctx.textAlign = 'left';
  const mode = fixedStep ? 'Fixed timestep 60 Гц' : `Variable · ${simulatedFps} FPS`;
  ctx.fillText(mode, 12, h - 14);

  if (!fixedStep && simulatedFps < 50) {
    ctx.fillStyle = '#c62828';
    ctx.fillText('⚠ физика нестабильна при просадке FPS', 12, h - 28);
  }
}

function colorMix(hex, bgHex, amount) {
  const parse = (c) => {
    const h = c.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  try {
    const a = parse(hex);
    const b = parse(bgHex.startsWith('#') ? bgHex : '#1b1b1d');
    const m = (i) => Math.round(a[i] * (1 - amount) + b[i] * amount);
    return `rgb(${m(0)},${m(1)},${m(2)})`;
  } catch {
    return hex;
  }
}

export function getDependenciesForNode(layerId, nodeId) {
  const deps = [];
  const provides = [];
  DEPENDENCY_EDGES.forEach(([fl, fn, tl, tn]) => {
    if (fl === layerId && fn === nodeId) deps.push({layer: tl, node: tn});
    if (tl === layerId && tn === nodeId) provides.push({layer: fl, node: fn});
  });
  return {deps, provides};
}
