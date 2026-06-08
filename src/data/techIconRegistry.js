/**
 * Реестр технологий → SVG path/hex (Simple Icons, MIT/CC0).
 * Данные путей: src/data/techIconPaths.js (генерация: npm run docs:tech-icon-paths).
 * fallback — эмодзи или аббревиатура, если бренда нет в каталоге.
 */

import {TECH_ICON_PATHS} from './techIconPaths';

/** @typedef {{ hex: string, path: string, title?: string }} TechIconSvg */
/** @typedef {{ icon?: TechIconSvg, fallback: string, label?: string }} TechIconEntry */

/** @param {keyof typeof TECH_ICON_PATHS} key */
function svg(key) {
  return TECH_ICON_PATHS[key];
}

/** @param {string} emoji @param {string} label */
function emojiBadge(emoji, label) {
  return {monogram: emoji, fallback: emoji, label};
}

/** @type {Record<string, TechIconEntry>} */
export const TECH_ICON_REGISTRY = {
  // —— Языки и платформы ——
  python: {icon: svg('siPython'), fallback: '🐍', label: 'Python'},
  javascript: {icon: svg('siJavascript'), fallback: 'JS', label: 'JavaScript'},
  typescript: {icon: svg('siTypescript'), fallback: 'TS', label: 'TypeScript'},
  php: {icon: svg('siPhp'), fallback: 'PHP', label: 'PHP'},
  java: {fallback: 'Ja', label: 'Java'},
  kotlin: {icon: svg('siKotlin'), fallback: 'Kt', label: 'Kotlin'},
  scala: {icon: svg('siScala'), fallback: 'Sc', label: 'Scala'},
  groovy: {icon: svg('siApachegroovy'), fallback: 'Gvy', label: 'Groovy'},
  csharp: {icon: svg('siDotnet'), fallback: 'C#', label: 'C#'},
  dotnet: {icon: svg('siDotnet'), fallback: '.NET', label: '.NET'},
  cpp: {icon: svg('siCplusplus'), fallback: 'C++', label: 'C++'},
  c: {icon: svg('siC'), fallback: 'C', label: 'C'},
  go: {icon: svg('siGo'), fallback: 'Go', label: 'Go'},
  rust: {icon: svg('siRust'), fallback: '🦀', label: 'Rust'},
  swift: {icon: svg('siSwift'), fallback: '🍎', label: 'Swift'},
  dart: {icon: svg('siDart'), fallback: '🎯', label: 'Dart'},
  ruby: {icon: svg('siRuby'), fallback: '💎', label: 'Ruby'},
  lua: {icon: svg('siLua'), fallback: '🌙', label: 'Lua'},
  elixir: {icon: svg('siElixir'), fallback: '💧', label: 'Elixir'},
  haskell: {icon: svg('siHaskell'), fallback: 'λ', label: 'Haskell'},
  r: {icon: svg('siR'), fallback: '📊', label: 'R'},
  julia: {icon: svg('siJulia'), fallback: '∑', label: 'Julia'},
  zig: {icon: svg('siZig'), fallback: '⚡', label: 'Zig'},
  nim: {icon: svg('siNim'), fallback: '👑', label: 'Nim'},
  bash: {icon: svg('siGnubash'), fallback: '🐚', label: 'Bash'},
  powershell: {fallback: 'PS', label: 'PowerShell'},
  nodejs: {icon: svg('siNodedotjs'), fallback: 'Node', label: 'Node.js'},
  fortran: {icon: svg('siFortran'), fallback: 'Ftn', label: 'Fortran'},
  lisp: {icon: svg('siCommonlisp'), fallback: '(λ)', label: 'Lisp'},
  smalltalk: {fallback: 'ST', label: 'Smalltalk'},
  cobol: {fallback: 'COB', label: 'COBOL'},
  pascal: {fallback: 'Pascal', label: 'Pascal'},
  vb: {fallback: 'VB', label: 'Visual Basic'},
  assembler: {fallback: 'ASM', label: 'Ассемблер'},
  '1c': {fallback: '1С', label: '1С'},
  'legacy-hub': {fallback: 'HL', label: 'Исторические языки'},

  // —— Данные и разметка ——
  html: {icon: svg('siHtml5'), fallback: '📄', label: 'HTML'},
  css: {icon: svg('siCss3'), fallback: '🎨', label: 'CSS'},
  sql: {icon: svg('siPostgresql'), fallback: '🗃️', label: 'SQL'},
  postgresql: {icon: svg('siPostgresql'), fallback: '🐘', label: 'PostgreSQL'},
  mongodb: {icon: svg('siMongodb'), fallback: '🍃', label: 'MongoDB'},
  cassandra: {icon: svg('siApachecassandra'), fallback: 'Cas', label: 'Apache Cassandra'},
  sqlite: {icon: svg('siSqlite'), fallback: 'SQL', label: 'SQLite'},
  oracle: {fallback: 'Ora', label: 'Oracle Database'},
  sqlserver: {icon: svg('siMicrosoft'), fallback: 'MSS', label: 'Microsoft SQL Server'},
  nosql: {fallback: 'NS', label: 'NoSQL'},
  yaml: {icon: svg('siYaml'), fallback: 'YML', label: 'YAML'},
  xml: {icon: svg('siXml'), fallback: 'XML', label: 'XML'},
  json: {icon: svg('siJson'), fallback: '{ }', label: 'JSON'},
  redis: {icon: svg('siRedis'), fallback: 'Redis', label: 'Redis'},
  mysql: {icon: svg('siMysql'), fallback: 'MySQL', label: 'MySQL'},
  markdown: {icon: svg('siMarkdown'), fallback: 'MD', label: 'Markdown'},
  database: {icon: svg('siPostgresql'), fallback: '🗄️', label: 'Базы данных'},
  'data-structures': {fallback: 'SD', label: 'Структуры данных'},
  analytics: {icon: svg('siR'), fallback: 'R', label: 'Анализ данных'},
  'sys-analytics': {fallback: 'SA', label: 'Системная аналитика'},
  filesystem: emojiBadge('📁', 'Файловая система'),
  video: emojiBadge('🎞️', 'Видео и монтаж'),
  audio: emojiBadge('🔊', 'Аудио'),
  audiovideo: emojiBadge('🎞️', 'Аудио и видео'),
  biometrics: emojiBadge('🫆', 'Биометрия'),
  encryption: emojiBadge('🔐', 'Шифрование'),
  wireless: emojiBadge('🛜', 'Беспроводные сети'),
  planning: emojiBadge('📎', 'Планирование и проект'),
  email: emojiBadge('📧', 'Электронная почта'),
  battery: emojiBadge('🔋', 'Аккумуляторы'),
  'math-programming': {fallback: 'MP', label: 'Мат. программирование'},

  // —— Инфраструктура ——
  docker: {icon: svg('siDocker'), fallback: '🐳', label: 'Docker'},
  kubernetes: {icon: svg('siKubernetes'), fallback: 'K8s', label: 'Kubernetes'},
  git: {icon: svg('siGit'), fallback: 'Git', label: 'Git'},
  google: {icon: svg('siGoogle'), fallback: 'G', label: 'Google'},
  googlecloud: {icon: svg('siGooglecloud'), fallback: 'GCP', label: 'Google Cloud'},
  aws: {icon: svg('siAmazonwebservices'), fallback: 'AWS', label: 'AWS'},
  azure: {icon: svg('siMicrosoft'), fallback: 'Az', label: 'Microsoft Azure'},
  cloud: {fallback: 'CL', label: 'Облачные технологии'},
  terraform: {icon: svg('siTerraform'), fallback: 'TF', label: 'Terraform'},
  ansible: {icon: svg('siAnsible'), fallback: 'Ans', label: 'Ansible'},
  devops: {fallback: 'DV', label: 'DevOps'},
  microsoft: {icon: svg('siMicrosoft'), fallback: 'MS', label: 'Microsoft'},
  containers: {icon: svg('siDocker'), fallback: 'K8', label: 'Контейнеризация'},
  prometheus: {icon: svg('siPrometheus'), fallback: 'Prom', label: 'Prometheus'},
  grafana: {icon: svg('siGrafana'), fallback: 'Graf', label: 'Grafana'},
  monitoring: {fallback: 'MN', label: 'Мониторинг'},
  nginx: {icon: svg('siNginx'), fallback: 'ngx', label: 'NGINX'},
  microservices: {fallback: 'MC', label: 'Микросервисы'},
  security: emojiBadge('🛡️', 'Безопасность'),
  pentest: {fallback: 'PT', label: 'Пентест'},
  'bug-bounty': {fallback: 'BB', label: 'Bug Bounty'},
  'low-code': {fallback: 'LC', label: 'Low-code'},
  rest: {fallback: 'API', label: 'REST API'},

  // —— Система и сеть ——
  os: {fallback: 'OS', label: 'Операционная система'},
  linux: {icon: svg('siLinux'), fallback: '🐧', label: 'Linux'},
  ubuntu: {icon: svg('siUbuntu'), fallback: 'Ubu', label: 'Ubuntu'},
  macos: {icon: svg('siMacos'), fallback: 'mac', label: 'macOS'},
  android: {icon: svg('siAndroid'), fallback: 'And', label: 'Android'},
  apple: {icon: svg('siApple'), fallback: '🍎', label: 'Apple'},
  network: emojiBadge('🌍', 'Сеть и интернет'),
  web: emojiBadge('🌍', 'Веб-сайты'),
  sysadmin: {fallback: 'SA', label: 'Системное администрирование'},
  integration: {fallback: 'IN', label: 'Интеграция'},
  hardware: {fallback: 'HW', label: 'Железо'},
  platforms: {fallback: 'PF', label: 'Платформы'},
  support: {fallback: 'SU', label: 'Техподдержка'},
  backup: {fallback: 'BK', label: 'Резервное копирование'},

  // —— Код и разработка ——
  github: {icon: svg('siGithub'), fallback: 'GH', label: 'GitHub'},
  gitlab: {icon: svg('siGitlab'), fallback: 'GL', label: 'GitLab'},
  algorithms: {fallback: 'AL', label: 'Алгоритмы'},
  code: {fallback: 'CD', label: 'Код'},
  oop: {fallback: 'OO', label: 'ООП'},
  async: {fallback: 'AS', label: 'Асинхронность'},
  architecture: {fallback: 'AR', label: 'Архитектура'},
  paradigms: {fallback: 'PD', label: 'Парадигмы'},
  dependencies: {fallback: 'DP', label: 'Зависимости'},
  orm: {fallback: 'ORM', label: 'ORM'},
  desktop: {icon: svg('siDotnet'), fallback: 'DT', label: 'Десктоп'},
  mobile: emojiBadge('📱', 'Мобильная разработка'),
  debugging: {fallback: 'DB', label: 'Отладка'},
  gc: {fallback: 'GC', label: 'Сборка мусора'},
  parallel: {fallback: 'PR', label: 'Параллелизм'},
  project: {icon: svg('siGithub'), fallback: 'PJ', label: 'Проект'},

  // —— ИИ ——
  ai: {icon: svg('siOpenai'), fallback: '🤖', label: 'Искусственный интеллект'},
  ml: {icon: svg('siPytorch'), fallback: '📈', label: 'Машинное обучение'},
  'neural-nets': {icon: svg('siTensorflow'), fallback: '🧠', label: 'Нейросети'},
  nlp: {fallback: 'NL', label: 'NLP'},
  agentops: {fallback: 'AO', label: 'AgentOps'},
  'ai-tools': {icon: svg('siOpenai'), fallback: '🛠️', label: 'ИИ-инструменты'},

  // —— Проект ——
  business: {fallback: 'BZ', label: 'Бизнес'},
  team: {fallback: 'TM', label: 'Команда'},
  methodology: emojiBadge('📎', 'Методология'),
  testing: {fallback: 'QA', label: 'Тестирование'},
  design: {fallback: 'DS', label: 'Проектирование'},
  scrum: {icon: svg('siJira'), fallback: 'Scrum', label: 'Scrum'},
  erp: {fallback: 'ERP', label: 'ERP'},
  itsm: {fallback: 'SM', label: 'ITSM'},
  legacy: {fallback: 'LG', label: 'Legacy'},
  'code-culture': {fallback: 'CC', label: 'Культура кода'},
  'tech-writing': emojiBadge('📝', 'Техписательство'),
  ip: {fallback: 'IP', label: 'Интеллектуальная собственность'},

  // —— Основы (номера подразделов — спокойные muted-badge) ——
  welcome: {fallback: '01', label: 'Знакомство'},
  intro: {fallback: '02', label: 'Введение'},
  roadmap: {fallback: '03', label: 'Дорожная карта'},
  people: {fallback: '04', label: 'Взгляд со стороны'},
  warning: {fallback: '05', label: 'Важно'},
  slang: {fallback: '06', label: 'Сленг'},
  history: {fallback: '07', label: 'История IT'},
  computer: emojiBadge('🖥️', 'Компьютер'),
  data: {fallback: '09', label: 'Данные'},
  files: emojiBadge('📁', 'Файлы'),
  search: emojiBadge('🔎', 'Поиск информации'),
  communication: {fallback: '22', label: 'Коммуникация'},
  'web-stack': {icon: svg('siHtml5'), fallback: 'WEB', label: 'Фронтенд и бэкенд'},
  'languages-overview': {fallback: '24', label: 'Языки программирования'},
  interface: {fallback: '25', label: 'Интерфейс'},
  career: {fallback: '26', label: 'Карьера'},
  remote: {fallback: '27', label: 'Удалённая работа'},
  marketing: {fallback: '28', label: 'Маркетинг'},
  'gov-business': {fallback: '29', label: 'Государство и бизнес'},
  english: {fallback: '30', label: 'Английский'},
  informatics: {fallback: '35', label: 'Информатика'},
  graphics: {fallback: '16', label: 'Графика'},
  games: emojiBadge('⚔️', 'Игры'),
  program: {fallback: '19', label: 'Программа'},
  software: {fallback: '11', label: 'Программное обеспечение'},
  tips: {fallback: '12', label: 'Советы'},

  // —— Спин-офф ——
  pioneers: {fallback: 'PN', label: 'Великие люди'},
  'career-change': {fallback: 'CH', label: 'Смена работы'},
  'game-industry': emojiBadge('⚔️', 'Игровая индустрия'),
  'game-dev': emojiBadge('⚔️', 'Разработка игр'),
  blockchain: {icon: svg('siBitcoin'), fallback: 'BC', label: 'Блокчейн'},
  crypto: {icon: svg('siEthereum'), fallback: 'CR', label: 'Криптовалюты'},
  'industry-soft': {fallback: 'IS', label: 'Отраслевое ПО'},
  'comp-graphics': {fallback: 'CG', label: 'Компьютерная графика'},
  media: {fallback: 'MD', label: 'Медиаконтент'},
  'net-culture': {fallback: 'NC', label: 'Интернет-культура'},
  kids: {fallback: 'KD', label: 'Для детей'},
  wikipedia: {icon: svg('siWikipedia'), fallback: 'W', label: 'Wikipedia'},
};

/** @param {TechIconEntry} entry */
export function getTechMonogram(entry) {
  if (entry.monogram) return entry.monogram;
  const fb = String(entry.fallback ?? '').trim();
  if (fb && !/\p{Extended_Pictographic}/u.test(fb)) return fb;

  const words = String(entry.label ?? '')
    .split(/[\s—–\-·]+/)
    .filter(Boolean);
  if (words.length >= 2) {
    return (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase();
  }
  return String(entry.label ?? '').slice(0, 2).toUpperCase() || '?';
}

/**
 * @param {string | null | undefined} techId
 * @returns {TechIconEntry | null}
 */
export function getTechIconEntry(techId) {
  if (!techId) return null;
  const entry = TECH_ICON_REGISTRY[techId];
  if (!entry) return null;
  if (entry.icon && !entry.icon.path) return {...entry, icon: undefined};
  return entry;
}

/** @param {string | null | undefined} techId */
export function hasTechLogo(techId) {
  const entry = getTechIconEntry(techId);
  return Boolean(entry?.icon);
}
