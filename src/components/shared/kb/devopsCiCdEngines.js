export const DEPLOY_STRATEGIES = [
  {
    id: 'bluegreen',
    label: 'Blue/Green',
    icon: '🔵🟢',
    summary: 'Две полные среды; мгновенное переключение трафика.',
    cost: '×2 инфраструктура',
    rollback: 'Секунды (обратное переключение)',
    risk: 'Низкий при совместимой схеме БД',
  },
  {
    id: 'canary',
    label: 'Canary',
    icon: '🐤',
    summary: 'Новая версия получает долю трафика, метрики решают судьбу релиза.',
    cost: 'Умеренный (+ маршрутизация)',
    rollback: 'Снижение процента или откат',
    risk: 'Очень низкий на старте',
  },
  {
    id: 'rolling',
    label: 'Rolling',
    icon: '🔄',
    summary: 'По одному инстансу: старая и новая версии соседствуют.',
    cost: 'Без удвоения серверов',
    rollback: 'Медленнее, нужен откат по шагам',
    risk: 'Средний при изменении API/БД',
  },
];

export const CANARY_STEPS = [1, 5, 25, 50, 100];

export const ROLLING_POOL_SIZE = 6;

export const PIPELINE_LIFECYCLE = [
  {id: 'plan', icon: '📋', label: 'Планирование', ci: false, detail: 'User stories, ADR, критерии приёмки. Jira, Confluence, Azure Boards.'},
  {id: 'dev', icon: '💻', label: 'Разработка', ci: false, detail: 'Feature-ветки, PR, коммиты. GitHub, GitLab — триггер пайплайна.'},
  {id: 'build', icon: '🔨', label: 'Сборка', ci: true, detail: 'Артефакт и Docker-образ в чистом runner. Gradle, Webpack, Bazel, MSBuild.'},
  {id: 'test', icon: '🧪', label: 'Тестирование', ci: true, detail: 'JUnit, Jest, Playwright, SonarQube. Красный job блокирует merge.'},
  {id: 'release', icon: '📦', label: 'Релиз', ci: false, detail: 'SemVer, тег, registry. Jenkins, GitHub Actions, Buildkite.'},
  {id: 'deploy', icon: '🚀', label: 'Развёртывание', cd: true, detail: 'Docker push, Argo CD, Lambda, Pages. Staging → prod.'},
  {id: 'manage', icon: '⚙️', label: 'Эксплуатация', cd: true, detail: 'Kubernetes, Terraform, rolling/canary, IaC desired state.'},
  {id: 'monitor', icon: '📊', label: 'Мониторинг', cd: true, detail: 'Prometheus, Datadog, логи. Алерты → новые задачи в бэклог.'},
];

export const CICD_VALIDATION_LAYERS = [
  {id: 'lint', label: 'Lint / SAST', defaultOn: true, failRate: 0.08, log: 'ESLint, SonarQube — стиль и уязвимости'},
  {id: 'secrets', label: 'Секреты', defaultOn: true, failRate: 0.05, log: 'gitleaks — токены в diff'},
  {id: 'unit', label: 'Unit-тесты', defaultOn: true, failRate: 0.12, log: 'JUnit / pytest — 847 тестов'},
  {id: 'integration', label: 'Integration', defaultOn: true, failRate: 0.15, log: 'API + БД в testcontainers'},
  {id: 'e2e', label: 'E2E', defaultOn: false, failRate: 0.2, log: 'Playwright — критические сценарии'},
  {id: 'security', label: 'DAST / образ', defaultOn: true, failRate: 0.1, log: 'Trivy scan образа'},
  {id: 'approval', label: 'Approval gate', defaultOn: true, failRate: 0, log: 'Ручное одобрение prod (environment)'},
];

export const AZURE_REPOS_MODES = [
  {
    id: 'git',
    label: 'Git (рекомендуется)',
    traits: ['Распределённая история', 'Локальные ветки', 'Pull Request + policies', 'Стандартный git push/pull'],
  },
  {
    id: 'tfvc',
    label: 'TFVC (legacy)',
    traits: ['Центральный сервер', 'Checkout / check-in', 'Блокировки файлов', 'Shelve sets'],
  },
];

export const AZURE_PR_STEPS = [
  {id: 'branch', title: 'Feature-ветка', cmd: 'git checkout -b feature/payment-api'},
  {id: 'push', title: 'Push → origin', cmd: 'git push -u origin feature/payment-api'},
  {id: 'pr', title: 'Pull Request', cmd: 'Azure Repos: Create PR → develop'},
  {id: 'ci', title: 'CI на PR', cmd: 'Pipeline: build + test (обязательно зелёный)'},
  {id: 'review', title: 'Code review', cmd: '2 approvers + policy main'},
  {id: 'merge', title: 'Merge', cmd: 'git merge --no-ff → триггер CD staging'},
];

export const DEVOPS_TOOLS = [
  {id: 'iac', label: 'IaC', tools: ['Terraform', 'Pulumi', 'CloudFormation'], desc: 'Декларативное описание облака'},
  {id: 'config', label: 'Конфигурация', tools: ['Ansible', 'Chef', 'Puppet'], desc: 'Настройка ОС и пакетов'},
  {id: 'ci', label: 'CI/CD', tools: ['GitLab CI', 'GitHub Actions', 'Jenkins', 'Azure Pipelines'], desc: 'Сборка и доставка'},
  {id: 'observe', label: 'Наблюдаемость', tools: ['Prometheus', 'Grafana', 'ELK'], desc: 'Метрики, логи, трейсы'},
  {id: 'orchestrate', label: 'Оркестрация', tools: ['Kubernetes', 'Docker Swarm'], desc: 'Контейнеры в проде'},
];

export const DEVOPS_VS_SYSADMIN = [
  {
    id: 'change',
    topic: 'Отношение к изменениям',
    sysadmin: 'Изменение = риск; окна обслуживания, ручные процедуры.',
    devops: 'Частые безопасные изменения; IaC, пайплайны, откат за минуты.',
  },
  {
    id: 'infra',
    topic: 'Инфраструктура',
    sysadmin: 'Ручная настройка серверов, "истина" на железе.',
    devops: 'Код в Git → plan/apply; расхождение = инцидент.',
  },
  {
    id: 'metrics',
    topic: 'Метрики успеха',
    sysadmin: 'Uptime, MTTR, удовлетворённость пользователей.',
    devops: 'DORA, error budget, частота деплоев, lead time.',
  },
  {
    id: 'scope',
    topic: 'Зона ответственности',
    sysadmin: 'Стабильность текущего состояния ИТ.',
    devops: 'Сквозной путь от коммита до production.',
  },
];

export const TERRAFORM_PRESETS = [
  {
    id: 'web',
    label: 'Web + БД',
    hcl: `resource "aws_instance" "app" {
  ami           = "ami-web"
  instance_type = "t3.small"
}

resource "aws_db_instance" "db" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
}`,
    plan: [
      {action: 'create', resource: 'aws_instance.app'},
      {action: 'create', resource: 'aws_db_instance.db'},
    ],
  },
  {
    id: 'scale',
    label: 'Масштаб',
    hcl: `resource "aws_instance" "app" {
  ami           = "ami-web"
  instance_type = "t3.large"
}

resource "aws_db_instance" "db" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
}`,
    plan: [
      {action: 'update', resource: 'aws_instance.app', change: 'instance_type: t3.small → t3.large'},
      {action: 'no-op', resource: 'aws_db_instance.db'},
    ],
  },
];

export const PULUMI_LANGUAGES = [
  {id: 'ts', label: 'TypeScript', snippet: `import * as aws from "@pulumi/aws";

const bucket = new aws.s3.Bucket("assets", {
  tags: { env: "prod" },
});`},
  {id: 'py', label: 'Python', snippet: `import pulumi_aws as aws

bucket = aws.s3.Bucket("assets",
    tags={"env": "prod"})`},
  {id: 'go', label: 'Go', snippet: `bucket, err := s3.NewBucket(ctx, "assets", &s3.BucketArgs{
    Tags: pulumi.StringMap{"env": pulumi.String("prod")},
})`},
];

export const PULUMI_RESOURCES = [
  {name: 'aws:s3:Bucket', id: 'assets', status: 'created'},
  {name: 'aws:iam:Role', id: 'lambda-exec', status: 'created'},
];

export const CICD_AUTH_STEPS = [
  {id: 'trigger', title: 'Триггер пайплайна', actor: 'GitHub → OIDC', detail: 'Push в main запускает workflow без долгоживущего пароля.'},
  {id: 'authn', title: 'Аутентификация', actor: 'JWT / federated cred', detail: 'Runner доказывает идентичность workload (не "кто угодно с PAT").'},
  {id: 'authz', title: 'Авторизация', actor: 'RBAC / environment', detail: 'Роль ci-deploy может писать только в staging; prod — approval.'},
  {id: 'secrets', title: 'Секреты', actor: 'Vault / GH Secrets', detail: 'Ключи не в логах; маскирование в выводе job.'},
  {id: 'audit', title: 'Аудит', actor: 'Immutable log', detail: 'Кто, когда, какой SHA задеплоил — связь с Jira/Azure Boards.'},
];

export const SRE_SLI_PRESETS = [
  {id: 'availability', label: 'Доступность', unit: '%', defaultSli: 99.2, slo: 99.9, budgetMinutes: 43},
  {id: 'latency', label: 'Latency p99', unit: 'ms', defaultSli: 420, slo: 300, budgetMinutes: null},
];

export function rollingNodes(count, updated) {
  return Array.from({length: count}, (_, i) => ({
    id: i + 1,
    version: i < updated ? 'v2' : 'v1',
    state: i < updated ? 'new' : i === updated ? 'updating' : 'old',
  }));
}

export function simulateValidation(layers, enabled) {
  const results = layers
    .filter((l) => enabled[l.id])
    .map((l) => ({
      id: l.id,
      label: l.label,
      passed: Math.random() > l.failRate,
      log: l.log,
    }));
  return {results, ok: results.every((r) => r.passed)};
}

export function errorBudgetPercent(sli, slo) {
  if (slo >= 100) return 0;
  const allowed = 100 - slo;
  const consumed = Math.max(0, slo - sli);
  return Math.min(100, Math.round((consumed / allowed) * 100));
}

export const GHA_TRIGGERS = [
  {id: 'push', label: 'push → main', icon: '📤', yaml: 'on:\n  push:\n    branches: [main]'},
  {id: 'pr', label: 'pull_request', icon: '🔀', yaml: 'on:\n  pull_request:\n    branches: [main]'},
  {id: 'schedule', label: 'schedule (cron)', icon: '⏰', yaml: 'on:\n  schedule:\n    - cron: "0 2 * * *"'},
  {id: 'dispatch', label: 'workflow_dispatch', icon: '▶️', yaml: 'on:\n  workflow_dispatch:'},
];

export const GHA_JOBS = [
  {
    id: 'build',
    label: 'build-and-test',
    runsOn: 'ubuntu-latest',
    needs: [],
    steps: [
      {name: 'checkout', uses: 'actions/checkout@v4', status: 'ok'},
      {name: 'setup-node', uses: 'actions/setup-node@v4', status: 'ok'},
      {name: 'npm ci', run: 'npm ci', status: 'ok'},
      {name: 'npm test', run: 'npm test', status: 'ok'},
      {name: 'upload-artifact', uses: 'actions/upload-artifact@v4', status: 'ok'},
    ],
  },
  {
    id: 'deploy',
    label: 'deploy',
    runsOn: 'ubuntu-latest',
    needs: ['build'],
    if: "github.ref == 'refs/heads/main'",
    steps: [
      {name: 'download-artifact', uses: 'actions/download-artifact@v4', status: 'ok'},
      {name: 'deploy gh-pages', uses: 'peaceiris/actions-gh-pages@v4', status: 'ok'},
    ],
  },
];

export const GHA_MATRIX = [
  {os: 'ubuntu-latest', node: '20'},
  {os: 'windows-latest', node: '20'},
  {os: 'macos-latest', node: '22'},
];

export const GITLAB_STAGES = [
  {
    id: 'lint',
    jobs: [{id: 'lint_code', script: ['npm run lint'], when: 'on_success'}],
  },
  {
    id: 'test',
    jobs: [
      {id: 'unit_tests', script: ['npm run test:unit'], parallel: 1},
      {id: 'integration_tests', script: ['npm run test:integration'], needs: ['unit_tests']},
    ],
  },
  {
    id: 'build',
    jobs: [{id: 'build_app', script: ['npm run build'], artifacts: 'dist/'}],
  },
  {
    id: 'deploy',
    jobs: [
      {id: 'deploy_staging', script: ['./deploy-staging.sh'], manual: false},
      {id: 'deploy_production', script: ['./deploy-production.sh'], manual: true},
    ],
  },
];

export const GITLAB_EXECUTORS = [
  {id: 'docker', label: 'Docker', desc: 'Новый контейнер на каждую job — изоляция и воспроизводимость.'},
  {id: 'shell', label: 'Shell', desc: 'Команды на хосте runner; нужна жёсткая гигиена безопасности.'},
  {id: 'kubernetes', label: 'Kubernetes', desc: 'Job как Pod в кластере — масштаб и политики сети.'},
];

export const WEBHOOK_EVENTS = [
  {id: 'push', source: 'GitHub', payload: '{"ref":"refs/heads/main","commits":[…]}'},
  {id: 'payment', source: 'Stripe', payload: '{"type":"payment_intent.succeeded",…}'},
  {id: 'order', source: 'CRM', payload: '{"event":"contact.created","id":"c-42"}'},
];

export const DEB_LAYERS = [
  {id: 'deb', label: 'package.deb', type: 'ar', children: ['debian-binary', 'control.tar.gz', 'data.tar.xz']},
  {id: 'control', label: 'control.tar.gz', files: ['control', 'postinst', 'prerm', 'md5sums']},
  {id: 'data', label: 'data.tar.xz', paths: ['/usr/bin/app', '/etc/app/config.yml', '/usr/share/doc/']},
];

export const DEB_INSTALL_STEPS = [
  {id: 'unpack', title: 'Распаковка', cmd: 'dpkg-deb -x package.deb /'},
  {id: 'preinst', title: 'preinst', cmd: 'maintainer script — до копирования файлов'},
  {id: 'files', title: 'Файлы на диск', cmd: 'Копирование в FHS: /usr, /etc'},
  {id: 'postinst', title: 'postinst', cmd: 'systemctl enable app.service'},
  {id: 'register', title: 'Реестр dpkg', cmd: 'dpkg -l | grep package'},
];

export const IAC_STYLES = [
  {
    id: 'declarative',
    label: 'Декларативный',
    code: 'resource "aws_instance" "web" {\n  instance_type = "t3.micro"\n  ami           = var.ami\n}',
    note: 'Описываем желаемое состояние; инструмент сам вычисляет diff.',
  },
  {
    id: 'imperative',
    label: 'Императивный',
    code: '1. create vpc\n2. create subnet\n3. launch instance\n4. attach sg',
    note: 'Явная последовательность шагов — гибко, но сложнее идемпотентность.',
  },
];

export const IAC_DRIFT_RESOURCES = [
  {id: 'vm', label: 'EC2 web-01', desired: 't3.small', actual: 't3.small', drift: false},
  {id: 'sg', label: 'SG web', desired: 'port 443 only', actual: 'port 80+443 open', drift: true},
  {id: 'bucket', label: 'S3 logs', desired: 'versioning on', actual: 'versioning on', drift: false},
];

export const ANSIBLE_HOSTS = [
  {id: 'web1', group: 'web_servers', ip: '10.0.1.10'},
  {id: 'web2', group: 'web_servers', ip: '10.0.1.11'},
  {id: 'db1', group: 'db_servers', ip: '10.0.1.20'},
];

export const ANSIBLE_TASKS = [
  {id: 'pkg', name: 'Установить nginx', module: 'apt: nginx present', changedKey: 'pkg'},
  {id: 'tpl', name: 'Шаблон nginx.conf', module: 'template: nginx.conf.j2', changedKey: 'tpl', notify: 'reload'},
  {id: 'svc', name: 'Служба nginx', module: 'service: started enabled', changedKey: 'svc'},
];

export const MESH_SERVICES = [
  {id: 'catalog', label: 'catalog', version: 'v1'},
  {id: 'cart', label: 'cart', version: 'v1'},
  {id: 'checkout', label: 'checkout', version: 'v2-canary'},
];

export const MESH_POLICIES = [
  {id: 'route', label: 'Маршрутизация', detail: 'HTTP path /api → subset v2 при header x-canary'},
  {id: 'mtls', label: 'mTLS STRICT', detail: 'Sidecar проверяет SPIFFE-сертификат peer'},
  {id: 'retry', label: 'Retry + timeout', detail: '3 попытки, budget 30s на цепочку'},
];

export function simulateGhJobLog(steps) {
  const lines = [];
  steps.forEach((s) => {
    lines.push(`▶ ${s.name}`);
    if (s.uses) lines.push(`  uses: ${s.uses}`);
    if (s.run) lines.push(`  run: ${s.run}`);
    lines.push(`  ✓ ${s.name} (${(0.4 + Math.random() * 2).toFixed(1)}s)`);
  });
  return lines;
}

export function gitlabStageStatus(stageIdx, jobIdx, runningStage, runningJob) {
  if (stageIdx < runningStage) return 'done';
  if (stageIdx > runningStage) return 'pending';
  if (jobIdx < runningJob) return 'done';
  if (jobIdx === runningJob) return 'running';
  return 'pending';
}
