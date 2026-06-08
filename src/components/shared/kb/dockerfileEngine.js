export const INSTRUCTION_TYPES = [
  'FROM',
  'WORKDIR',
  'COPY',
  'RUN',
  'ENV',
  'EXPOSE',
  'CMD',
  'ARG',
  'LABEL',
  'USER',
  'HEALTHCHECK',
  'ENTRYPOINT',
  'VOLUME',
];

export const INSTRUCTION_COLORS = {
  FROM: '#2196f3',
  WORKDIR: '#4caf50',
  COPY: '#ff9800',
  RUN: '#f44336',
  EXPOSE: '#9c27b0',
  ENV: '#00bcd4',
  CMD: '#e91e63',
  ARG: '#795548',
  LABEL: '#607d8b',
  USER: '#8bc34a',
  HEALTHCHECK: '#ff5722',
  ENTRYPOINT: '#673ab7',
  VOLUME: '#009688',
};

export const INSTRUCTION_TEMPLATES = {
  FROM: {
    syntax: 'FROM image[:tag] [AS name]',
    description: 'Базовый образ для всех последующих слоёв',
    example: 'node:20-alpine',
    validate: (v) => (!v.trim() ? 'Укажите базовый образ' : null),
  },
  WORKDIR: {
    syntax: 'WORKDIR <path>',
    description: 'Рабочая директория для RUN, COPY, CMD',
    example: '/app',
    validate: (v) => (!v.trim() ? 'Укажите путь' : null),
  },
  COPY: {
    syntax: 'COPY <src> <dest>',
    description: 'Копирует файлы из контекста сборки в образ',
    example: 'package*.json ./',
    validate: (v) => (!v.trim() ? 'Укажите source и destination' : null),
  },
  RUN: {
    syntax: 'RUN <command>',
    description: 'Выполняет команду и фиксирует результат в новом слое',
    example: 'npm ci --omit=dev',
    validate: (v) => (!v.trim() ? 'Укажите команду' : null),
  },
  EXPOSE: {
    syntax: 'EXPOSE <port>',
    description: 'Документирует порты, которые слушает приложение',
    example: '3000',
    validate: (v) => (!v.trim() ? 'Укажите порт' : null),
  },
  ENV: {
    syntax: 'ENV key=value',
    description: 'Переменные окружения внутри контейнера',
    example: 'NODE_ENV=production',
    validate: (v) => (!v.trim() ? 'Укажите key=value' : null),
  },
  CMD: {
    syntax: 'CMD ["command", "param"]',
    description: 'Команда по умолчанию при запуске контейнера',
    example: '["node", "server.js"]',
    validate: (v) => (!v.trim() ? 'Укажите команду' : null),
  },
  ARG: {
    syntax: 'ARG name=default',
    description: 'Аргумент только на этапе сборки',
    example: 'VERSION=1.0.0',
    validate: (v) => (!v.trim() ? 'Укажите аргумент' : null),
  },
  LABEL: {
    syntax: 'LABEL key=value',
    description: 'Метаданные образа (автор, версия)',
    example: 'maintainer="team@example.com"',
    validate: (v) => (!v.trim() ? 'Укажите метку' : null),
  },
  USER: {
    syntax: 'USER user[:group]',
    description: 'От какого пользователя выполняются следующие инструкции',
    example: 'node',
    validate: (v) => (!v.trim() ? 'Укажите пользователя' : null),
  },
  HEALTHCHECK: {
    syntax: 'HEALTHCHECK CMD command',
    description: 'Периодическая проверка "живости" контейнера',
    example: 'CMD curl -f http://localhost/ || exit 1',
    validate: (v) => (!v.trim() ? 'Укажите команду проверки' : null),
  },
  ENTRYPOINT: {
    syntax: 'ENTRYPOINT ["command"]',
    description: 'Точка входа — не переопределяется CMD из docker run',
    example: '["docker-entrypoint.sh"]',
    validate: (v) => (!v.trim() ? 'Укажите entrypoint' : null),
  },
  VOLUME: {
    syntax: 'VOLUME ["/path"]',
    description: 'Точка монтирования для данных вне образа',
    example: '["/data"]',
    validate: (v) => (!v.trim() ? 'Укажите путь тома' : null),
  },
};

export const DEFAULT_INSTRUCTIONS = [
  {type: 'FROM', value: 'node:20-alpine', description: 'Базовый образ'},
  {type: 'WORKDIR', value: '/app', description: 'Рабочая директория'},
  {type: 'COPY', value: 'package*.json ./', description: 'Манифест зависимостей'},
  {type: 'RUN', value: 'npm ci --omit=dev', description: 'Установка зависимостей'},
  {type: 'COPY', value: '. .', description: 'Исходный код'},
  {type: 'ENV', value: 'NODE_ENV=production', description: 'Режим production'},
  {type: 'EXPOSE', value: '3000', description: 'Порт HTTP'},
  {type: 'CMD', value: '["node", "server.js"]', description: 'Запуск приложения'},
];

export const EXAMPLES = {
  node: [
    {type: 'FROM', value: 'node:20-alpine', description: 'Базовый образ'},
    {type: 'WORKDIR', value: '/app', description: 'Рабочая директория'},
    {type: 'COPY', value: 'package*.json ./', description: 'package.json'},
    {type: 'RUN', value: 'npm ci --omit=dev', description: 'Зависимости'},
    {type: 'COPY', value: '. .', description: 'Исходники'},
    {type: 'ENV', value: 'NODE_ENV=production', description: 'Production'},
    {type: 'EXPOSE', value: '3000', description: 'Порт'},
    {type: 'CMD', value: '["node", "server.js"]', description: 'Старт'},
  ],
  python: [
    {type: 'FROM', value: 'python:3.12-slim', description: 'Базовый образ'},
    {type: 'WORKDIR', value: '/app', description: 'Рабочая директория'},
    {type: 'COPY', value: 'requirements.txt .', description: 'Зависимости'},
    {type: 'RUN', value: 'pip install --no-cache-dir -r requirements.txt', description: 'pip install'},
    {type: 'COPY', value: '. .', description: 'Код'},
    {type: 'EXPOSE', value: '8000', description: 'Порт'},
    {type: 'CMD', value: '["python", "app.py"]', description: 'Старт'},
  ],
  nginx: [
    {type: 'FROM', value: 'nginx:alpine', description: 'Базовый образ'},
    {type: 'COPY', value: './html /usr/share/nginx/html', description: 'Статика'},
    {type: 'EXPOSE', value: '80', description: 'HTTP'},
    {type: 'CMD', value: '["nginx", "-g", "daemon off;"]', description: 'Nginx foreground'},
  ],
  multistage: [
    {type: 'FROM', value: 'node:20-alpine AS builder', description: 'Стадия сборки'},
    {type: 'WORKDIR', value: '/app', description: 'Рабочая директория'},
    {type: 'COPY', value: 'package*.json ./', description: 'Манифест'},
    {type: 'RUN', value: 'npm ci && npm run build', description: 'Сборка'},
    {type: 'FROM', value: 'nginx:alpine', description: 'Финальный образ'},
    {type: 'COPY', value: '--from=builder /app/dist /usr/share/nginx/html', description: 'Артефакт'},
    {type: 'EXPOSE', value: '80', description: 'HTTP'},
  ],
};

export function createInstructionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function instructionsFromTemplate(list) {
  return list.map((inst, idx) => ({
    id: createInstructionId() + idx,
    ...inst,
  }));
}

export function getInstructionColor(type) {
  return INSTRUCTION_COLORS[type] || '#757575';
}

export function generateDockerfile(instructions) {
  return instructions
    .map((inst) => {
      let line = `${inst.type} ${inst.value}`;
      const defaultDesc = INSTRUCTION_TEMPLATES[inst.type]?.description;
      if (inst.description && inst.description !== defaultDesc) {
        line += ` # ${inst.description}`;
      }
      return line;
    })
    .join('\n');
}

export function analyzeDockerfile(instructions) {
  const warnings = [];
  const types = instructions.map((i) => i.type);
  const fromCount = types.filter((t) => t === 'FROM').length;
  const cmdCount = types.filter((t) => t === 'CMD' || t === 'ENTRYPOINT').length;

  if (!types.includes('FROM')) {
    warnings.push('Нет инструкции FROM — образ не определён.');
  }
  if (fromCount > 1) {
    warnings.push(`Несколько FROM (${fromCount}) — вероятно multi-stage сборка.`);
  }
  if (cmdCount === 0) {
    warnings.push('Нет CMD/ENTRYPOINT — контейнер может сразу завершиться.');
  }
  if (cmdCount > 1) {
    warnings.push('Несколько CMD/ENTRYPOINT — сработает только последняя.');
  }
  const firstCopy = types.indexOf('COPY');
  const firstRun = types.indexOf('RUN');
  if (firstCopy >= 0 && firstRun >= 0 && firstRun < firstCopy) {
    warnings.push('RUN до COPY — слой зависимостей не кэшируется при изменении кода.');
  }
  if (types.includes('RUN') && !types.includes('COPY')) {
    warnings.push('Есть RUN без COPY — проверьте контекст сборки.');
  }

  return warnings;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Пошаговая симуляция docker build; onStep(message) после каждой строки */
export async function simulateDockerBuild(instructions, onStep) {
  const steps = [
    {message: '▶ docker build -t myapp:latest .', delay: 400},
    {message: '✓ Загружен build context', delay: 280},
    {message: '✓ Dockerfile: синтаксис OK', delay: 320},
  ];

  for (const s of steps) {
    await wait(s.delay);
    onStep(s.message);
  }

  for (let i = 0; i < instructions.length; i++) {
    const inst = instructions[i];
    await wait(520);
    onStep(`▶ [${i + 1}/${instructions.length}] ${inst.type} ${inst.value}`);
    onStep(`  → слой sha256:${Math.random().toString(16).slice(2, 10)}…`);

    if (inst.type === 'RUN') {
      await wait(650);
      onStep(`  → RUN ${inst.value}`);
      onStep('  → ✓ команда завершена');
    }
    if (inst.type === 'COPY') {
      await wait(380);
      onStep('  → ✓ файлы скопированы (кэш слоя применим при неизменном src)');
    }
  }

  await wait(700);
  onStep('✓ Successfully built myapp:latest');
  onStep(`  Image ID: sha256:${Math.random().toString(16).slice(2, 14)}`);
}
