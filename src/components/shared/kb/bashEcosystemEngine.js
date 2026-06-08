/** Данные для BashEcosystemPlay — статья 5-25-bash/11. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура проекта'},
  {id: 'build', label: 'Сборка и деплой'},
  {id: 'modules', label: 'Подключение модулей'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'os',
    tag: 'Платформа',
    label: 'ОС · ядро · WSL',
    color: '#546e7a',
    icon: '🖥',
    items: ['Linux · macOS · WSL2', 'Git Bash (Windows)', 'systemd · launchd', 'файлы · процессы · сеть'],
    detail:
      'Bash — пользовательская программа поверх ядра, не часть ОС. На серверах — GNU/Linux; на macOS с Catalina оболочкой входа часто zsh, но /bin/bash остаётся. В Windows — WSL или Git Bash.',
  },
  {
    id: 'shell',
    tag: 'Runtime',
    label: 'Bash · POSIX sh',
    color: '#4eaa25',
    icon: '$',
    items: ['#!/bin/bash · shebang', 'переменные · массивы', 'функции · [[ ]] · set -euo', 'history · completion'],
    detail:
      'Интерпретатор читает скрипт построчно или выполняет команды интерактивно. POSIX sh — минимальный стандарт; Bash добавляет расширения, удобные для автоматизации.',
  },
  {
    id: 'coreutils',
    tag: 'Утилиты',
    label: 'GNU coreutils · CLI',
    color: '#3b82f6',
    icon: '🔧',
    items: ['grep · sed · awk · find', 'curl · wget · jq', 'ssh · scp · rsync', 'ps · systemctl · cron'],
    detail:
      'Философия Unix: одна утилита — одна задача. Скрипт оркестрирует вызовы через конвейеры `|` и перенаправления `>`, `>>`, `2>&1`.',
  },
  {
    id: 'packages',
    tag: 'Зависимости',
    label: 'Менеджеры пакетов',
    color: '#10b981',
    icon: '📦',
    items: ['apt · dnf · pacman', 'Homebrew · asdf · mise', 'snap · flatpak', 'pip/npm для CLI-обёрток'],
    detail:
      'Внешние бинарники (jq, aws-cli, docker) ставятся пакетным менеджером или скачиваются в ~/bin. PATH определяет, где shell ищет исполняемые файлы.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Качество и CI',
    color: '#ec4899',
    icon: '✓',
    items: ['ShellCheck · shfmt', 'bats-core · shunit2', 'Make · GitHub Actions', 'pre-commit hooks'],
    detail:
      'ShellCheck ловит типичные ошибки до продакшена. Bats тестирует функции как unit-тесты. В CI скрипт запускается в чистом контейнере с фиксированным PATH.',
  },
  {
    id: 'automation',
    tag: 'Оркестрация',
    label: 'Cron · systemd · Ansible',
    color: '#f59e0b',
    icon: '⏱',
    items: ['crontab · systemd timers', 'Ansible playbooks', 'Docker entrypoint', 'Terraform local-exec'],
    detail:
      'Скрипт редко живёт изолированно: его планируют cron/systemd, вызывают из Makefile, Ansible или CI pipeline. Переменные окружения задают секреты и конфиг.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваши скрипты',
    color: '#6366f1',
    icon: '🏗',
    items: ['bin/ · lib/ · config/', 'deploy.sh · backup.sh', 'Jenkinsfile · .github/workflows', 'dotfiles · hooks'],
    detail:
      'Типичная структура: точка входа в bin/, общие функции в lib/ (source), конфиг в config/ или .env. Крупные проекты делят роли по каталогам tasks/ и roles/.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220). */
export const DEP_NODES = [
  {id: 'app', label: 'deploy.sh', type: 'app', x: 200, y: 24},
  {id: 'config', label: 'lib/config.sh', type: 'module', x: 80, y: 88},
  {id: 'common', label: 'lib/common.sh', type: 'module', x: 200, y: 88},
  {id: 'backup', label: 'tasks/backup.sh', type: 'lazy', x: 320, y: 88},
  {id: 'curl', label: 'curl', type: 'bin', x: 50, y: 168},
  {id: 'jq', label: 'jq', type: 'bin', x: 130, y: 168},
  {id: 'docker', label: 'docker', type: 'bin', x: 220, y: 168},
  {id: 'aws', label: 'aws-cli', type: 'bin', x: 310, y: 168},
  {id: 'systemd', label: 'systemd unit', type: 'bin', x: 370, y: 168},
];

export const DEP_EDGES = [
  ['app', 'config'],
  ['app', 'common'],
  ['app', 'backup'],
  ['app', 'docker'],
  ['app', 'systemd'],
  ['config', 'common'],
  ['common', 'curl'],
  ['common', 'jq'],
  ['backup', 'common'],
  ['backup', 'aws'],
  ['backup', 'docker'],
  ['app', 'curl'],
  ['app', 'jq'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Библиотека (source)', stroke: '#10b981'},
  lazy: {label: 'Опциональная задача', stroke: '#f59e0b', dash: '6 4'},
  bin: {label: 'Внешняя утилита / unit', stroke: '#4eaa25'},
};

export const ARCH_PRESETS = [
  {
    id: 'ops',
    label: 'Ops-скрипты',
    toolchain: 'bin/ · lib/ · config/ · Makefile',
    tree: [
      {
        type: 'dir',
        path: 'server-ops',
        children: [
          {
            type: 'file',
            path: 'server-ops/Makefile',
            role: 'Оркестратор',
            hint: 'deploy: ./bin/deploy.sh · test: bats tests/',
          },
          {
            type: 'dir',
            path: 'server-ops/bin',
            role: 'Исполняемые точки входа',
            children: [
              {
                type: 'file',
                path: 'server-ops/bin/deploy.sh',
                role: 'Деплой',
                hint: '#!/bin/bash · set -euo pipefail · source lib/common.sh',
              },
              {
                type: 'file',
                path: 'server-ops/bin/healthcheck.sh',
                role: 'Мониторинг',
                hint: 'curl + jq; exit 1 при сбое — для systemd/cron',
              },
            ],
          },
          {
            type: 'dir',
            path: 'server-ops/lib',
            role: 'Подключаемые модули',
            children: [
              {
                type: 'file',
                path: 'server-ops/lib/common.sh',
                role: 'Общие функции',
                hint: 'log(), die(), require_cmd jq',
              },
              {
                type: 'file',
                path: 'server-ops/lib/config.sh',
                role: 'Конфиг',
                hint: 'source .env или чтение /etc/app/config',
              },
            ],
          },
          {
            type: 'dir',
            path: 'server-ops/tasks',
            role: 'Подзадачи',
            children: [
              {
                type: 'file',
                path: 'server-ops/tasks/backup.sh',
                role: 'Бэкап',
                hint: 'Вызывается из deploy или cron; aws s3 cp',
              },
            ],
          },
          {
            type: 'dir',
            path: 'server-ops/config',
            children: [
              {
                type: 'file',
                path: 'server-ops/config/cron.example',
                role: 'Расписание',
                hint: '0 3 * * * /opt/server-ops/bin/backup.sh',
              },
              {
                type: 'file',
                path: 'server-ops/config/app.service',
                role: 'systemd unit',
                hint: 'ExecStart=/opt/server-ops/bin/healthcheck.sh',
              },
            ],
          },
          {
            type: 'dir',
            path: 'server-ops/tests',
            children: [
              {
                type: 'file',
                path: 'server-ops/tests/deploy.bats',
                role: 'Bats-тесты',
                hint: '@test "deploy fails without API_URL" { ... }',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ci',
    label: 'CI/CD pipeline',
    toolchain: 'GitHub Actions · scripts/ · reusable workflow',
    tree: [
      {
        type: 'dir',
        path: 'web-app',
        children: [
          {
            type: 'dir',
            path: 'web-app/.github/workflows',
            children: [
              {
                type: 'file',
                path: 'web-app/.github/workflows/deploy.yml',
                role: 'Workflow',
                hint: 'runs-on: ubuntu-latest · ./scripts/ci/deploy.sh',
              },
            ],
          },
          {
            type: 'dir',
            path: 'web-app/scripts/ci',
            children: [
              {
                type: 'file',
                path: 'web-app/scripts/ci/deploy.sh',
                role: 'CI-скрипт',
                hint: 'docker build · kubectl apply · curl health endpoint',
              },
              {
                type: 'file',
                path: 'web-app/scripts/ci/lib.sh',
                role: 'Shared CI lib',
                hint: 'source из deploy.sh; логирование в GITHUB_STEP_SUMMARY',
              },
            ],
          },
          {
            type: 'file',
            path: 'web-app/Dockerfile',
            role: 'Образ',
            hint: 'ENTRYPOINT ["/app/entrypoint.sh"] — bash внутри контейнера',
          },
          {
            type: 'file',
            path: 'web-app/entrypoint.sh',
            role: 'Entrypoint',
            hint: 'wait-for-it postgres · migrate · exec node server.js',
          },
        ],
      },
    ],
  },
  {
    id: 'dotfiles',
    label: 'Dotfiles · PATH',
    toolchain: '~/.bashrc · ~/bin · asdf/mise',
    tree: [
      {
        type: 'dir',
        path: 'dotfiles',
        children: [
          {
            type: 'file',
            path: 'dotfiles/.bashrc',
            role: 'Интерактивная оболочка',
            hint: 'source ~/.bashrc.d/*.sh · PS1 · alias',
          },
          {
            type: 'dir',
            path: 'dotfiles/.bashrc.d',
            children: [
              {
                type: 'file',
                path: 'dotfiles/.bashrc.d/path.sh',
                role: 'PATH',
                hint: 'export PATH="$HOME/bin:$PATH"',
              },
              {
                type: 'file',
                path: 'dotfiles/.bashrc.d/completion.sh',
                role: 'Completion',
                hint: 'source /usr/share/bash-completion/bash_completion',
              },
            ],
          },
          {
            type: 'dir',
            path: 'dotfiles/bin',
            role: 'Личные утилиты',
            children: [
              {
                type: 'file',
                path: 'dotfiles/bin/gclone',
                role: 'Обёртка',
                hint: 'git clone "$@" && cd "$(basename "$1" .git)"',
              },
            ],
          },
          {
            type: 'file',
            path: 'dotfiles/install.sh',
            role: 'Bootstrap',
            hint: 'stow dotfiles · chmod +x bin/* · shellcheck',
          },
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'author',
    label: 'Написание',
    cmd: '#!/bin/bash\nset -euo pipefail\nSCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"\nsource "$SCRIPT_DIR/../lib/common.sh"',
    detail:
      'Shebang выбирает интерпретатор. set -euo pipefail останавливает скрипт при ошибке, необъявленной переменной и ошибке в pipe. SCRIPT_DIR — надёжный путь к lib/.',
  },
  {
    id: 'lint',
    label: 'Проверка',
    cmd: 'shellcheck bin/deploy.sh lib/*.sh\nshfmt -i 2 -w bin/ lib/',
    detail:
      'ShellCheck находит кавычки, subshell и типичные ловушки. shfmt выравнивает стиль. В pre-commit hook проверка запускается до коммита.',
  },
  {
    id: 'test',
    label: 'Тесты',
    cmd: 'bats tests/deploy.bats\n# или\n./lib/common.sh && assert_equal "$(log_level)" "info"',
    detail:
      'Bats запускает функции в изолированных subshell. Можно мокать curl через функцию-обёртку. CI падает, если любой @test не прошёл.',
  },
  {
    id: 'install',
    label: 'Установка',
    cmd: 'chmod +x bin/*\nsudo ln -sf "$(pwd)/bin/deploy.sh" /usr/local/bin/deploy\n# или\nmake install PREFIX=/opt/server-ops',
    detail:
      'Исполняемый бит + каталог в PATH. Альтернатива — симлинк в /usr/local/bin или копирование в PREFIX при make install.',
  },
  {
    id: 'schedule',
    label: 'Планирование',
    cmd: '# crontab -e\n0 3 * * * /opt/server-ops/bin/backup.sh >> /var/log/backup.log 2>&1\n\n# systemd timer\nsystemctl enable --now backup.timer',
    detail:
      'Cron не наследует ~/.bashrc — PATH и переменные задают в crontab или внутри скрипта. systemd timers дают журналирование и зависимости между unit.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: './bin/deploy.sh staging\n# CI:\n./scripts/ci/deploy.sh production\n# API:\ncurl -sf https://api.example.com/health | jq .status',
    detail:
      'Ручной запуск, вызов из CI или webhook. Конвейеры curl | jq обрабатывают JSON-ответы API. Логи и exit code — контракт для мониторинга.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'source',
    label: 'source · .',
    era: 'Библиотеки в lib/',
    color: '#10b981',
    syntax: `#!/bin/bash
ROOT="$(cd "$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=lib/common.sh
source "$ROOT/lib/common.sh"
source "$ROOT/lib/config.sh"

main() {
  require_cmd jq curl
  backup_to_s3 "$BACKUP_BUCKET"
}
main "$@"`,
    traits: ['Функции в текущей оболочке', 'Общий state с вызывающим', 'shellcheck source= для путей'],
    tools: 'source · . · BASH_SOURCE · set -a для export из .env',
    use: 'lib/common.sh, config, переиспользуемые функции в bin/ и tasks/',
  },
  {
    id: 'path',
    label: 'PATH · ~/bin',
    era: 'Отдельные исполняемые файлы',
    color: '#4eaa25',
    syntax: `# ~/.bashrc
export PATH="$HOME/bin:/usr/local/sbin:/usr/local/bin:$PATH"

# ~/bin/my-tool — самостоятельный скрипт
#!/bin/bash
exec jq -r '.items[] | .name' "$@"`,
    traits: ['Один файл = одна команда', 'Без source — изоляция', 'chmod +x обязателен'],
    tools: 'which · type · hash · install -m 755',
    use: 'Личные утилиты, обёртки над jq/curl, legacy /usr/local/bin',
  },
  {
    id: 'package',
    label: 'apt · brew · asdf',
    era: 'Внешние бинарники',
    color: '#3b82f6',
    syntax: `# Debian/Ubuntu
sudo apt install jq curl awscli

# macOS
brew install jq awscli

# Версии CLI в проекте
asdf install awscli 2.15.0
asdf local awscli 2.15.0`,
    traits: ['Зависимость от пакетного менеджера ОС', 'В CI — apt-get в Dockerfile', 'asdf/mise фиксируют версии'],
    tools: 'apt · dnf · brew · snap · asdf · mise',
    use: 'jq, docker, kubectl, cloud CLI — не пишут на Bash, а вызывают из скрипта',
  },
  {
    id: 'subshell',
    label: 'bash -c · eval',
    era: 'Legacy · CI one-liner',
    color: '#f59e0b',
    syntax: `# Безопаснее — явный файл
bash ./tasks/backup.sh "$ENV"

# CI one-liner (осторожно с кавычками)
bash -c 'set -e; source lib/common.sh; deploy "$1"' _ staging

# eval — только доверенный ввод
eval "$(ssh-agent -s)"`,
    traits: ['Новый процесс / subshell', 'eval — риск injection', 'Предпочитайте файлы и source'],
    tools: 'bash -c · env · xargs · parallel',
    use: 'Makefile recipes, Docker CMD, Ansible script module',
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
  const hasBackup = enabledNodeIds.has('backup');
  const binCount = DEP_NODES.filter((n) => n.type === 'bin' && enabledNodeIds.has(n.id)).length;
  const layers = hasBackup
    ? ['deploy.sh', 'lib/config.sh · lib/common.sh · tasks/backup.sh', `CLI/units: ${binCount}`]
    : ['deploy.sh', 'lib/config.sh · lib/common.sh', `CLI/units: ${binCount - 1} (без backup-цепочки)`];
  return {layers, hasBackup, binCount};
}
