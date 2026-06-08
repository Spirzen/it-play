export const PIPELINE_STEPS = [
  {id: 'checkout', label: 'Checkout', short: 'Код'},
  {id: 'install', label: 'Install', short: 'Deps'},
  {id: 'lint', label: 'Lint', short: 'Lint'},
  {id: 'test', label: 'Test', short: 'Test'},
  {id: 'build', label: 'Build', short: 'Build'},
  {id: 'security', label: 'Security', short: 'Scan'},
  {id: 'staging', label: 'Staging', short: 'Stage'},
  {id: 'smoke', label: 'Smoke', short: 'Smoke'},
  {id: 'production', label: 'Production', short: 'Prod'},
];

export const DEMO_COMMITS = [
  {hash: 'a7f3e8d', message: 'Fix: исправление бага с авторизацией', author: 'ivanov', time: '5 мин назад'},
  {hash: 'b9c2d4f', message: 'Feat: добавлен новый API эндпоинт', author: 'petrov', time: '2 часа назад'},
  {hash: 'e5f6g7h', message: 'Docs: обновление документации', author: 'sidorov', time: 'вчера'},
  {hash: 'i8j9k0l', message: 'Test: добавлены unit-тесты', author: 'ivanov', time: '2 дня назад'},
];

export const INITIAL_ENVIRONMENTS = {
  development: {
    version: 'v1.0.0',
    status: 'stable',
    lastDeploy: '2024-01-15 10:30:00',
    url: 'dev.myapp.com',
  },
  staging: {
    version: 'v1.1.0-beta',
    status: 'testing',
    lastDeploy: '2024-01-20 14:20:00',
    url: 'staging.myapp.com',
  },
  production: {
    version: 'v1.0.5',
    status: 'live',
    lastDeploy: '2024-01-18 09:15:00',
    url: 'myapp.com',
  },
};

export const ENV_LABELS = {
  development: 'Development',
  staging: 'Staging',
  production: 'Production',
};

export function createLog(message, type = 'info') {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toLocaleTimeString(),
    message,
    type,
  };
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateTestSuite() {
  return [
    {name: 'Unit тесты', passed: Math.random() > 0.2, time: '0.5s'},
    {name: 'Интеграционные тесты', passed: Math.random() > 0.3, time: '1.2s'},
    {name: 'E2E тесты', passed: Math.random() > 0.1, time: '3.5s'},
    {name: 'Тесты производительности', passed: Math.random() > 0.4, time: '2.1s'},
    {name: 'Тесты безопасности', passed: Math.random() > 0.15, time: '1.8s'},
  ];
}

export const BUILD_SUBSTEPS = [
  'Установка зависимостей (npm install)',
  'Линтинг кода (ESLint)',
  'Транспиляция TypeScript',
  'Минификация (Webpack)',
  'Оптимизация ассетов',
  'Генерация source maps',
  'Создание Docker образа',
];

export const DEPLOY_SUBSTEPS = (env) => [
  `Подключение к ${env} серверу`,
  'Загрузка артефактов',
  'Остановка текущего сервиса',
  'Распаковка архива',
  'Применение миграций БД',
  'Обновление конфигураций',
  'Запуск сервиса',
  'Проверка health-check',
];

export function createDeployment(environment, buildNumber) {
  const now = new Date().toLocaleString('ru-RU');
  return {
    id: Date.now(),
    environment,
    version: `v${buildNumber}.${Date.now() % 1000}`,
    timestamp: now,
    status: 'success',
    buildNumber,
  };
}

export function applyDeploymentToEnvironments(environments, deployment) {
  const env = deployment.environment;
  return {
    ...environments,
    [env]: {
      ...environments[env],
      version: deployment.version,
      lastDeploy: deployment.timestamp,
      status: env === 'production' ? 'live' : env === 'staging' ? 'testing' : 'deployed',
    },
  };
}

export function envStatusLabel(status) {
  if (status === 'live') return 'Live';
  if (status === 'testing') return 'Тестирование';
  if (status === 'deployed') return 'Развёрнуто';
  return 'Стабильно';
}
