/** Сценарии автоматизации рабочего процесса для учебного демо */

export const SCAFFOLD_TEMPLATES = [
  {
    id: 'python',
    label: 'Python-пакет',
    cmd: 'cookiecutter gh:audreyr/cookiecutter-pypackage',
    tree: ['my_pkg/', 'my_pkg/__init__.py', 'tests/', 'README.md', 'pyproject.toml'],
  },
  {
    id: 'node',
    label: 'Node + TypeScript',
    cmd: 'npm create vite@latest my-app -- --template react-ts',
    tree: ['my-app/', 'src/', 'src/main.tsx', 'package.json', 'vite.config.ts'],
  },
  {
    id: 'rust',
    label: 'Rust binary',
    cmd: 'cargo new my_project',
    tree: ['my_project/', 'src/main.rs', 'Cargo.toml'],
  },
  {
    id: 'dotnet',
    label: '.NET console',
    cmd: 'dotnet new console -o MyApp',
    tree: ['MyApp/', 'Program.cs', 'MyApp.csproj'],
  },
];

export const MAKE_TARGETS = [
  {id: 'setup', label: 'setup', desc: 'venv + pip install', deps: []},
  {id: 'run', label: 'run', desc: 'запуск приложения', deps: ['setup']},
  {id: 'test', label: 'test', desc: 'pytest', deps: ['setup']},
  {id: 'clean', label: 'clean', desc: 'удалить кэш и venv', deps: []},
];

export const HOOK_STEPS = [
  {id: 'staged', label: 'git add', icon: '📁'},
  {id: 'hook', label: 'pre-commit', icon: '🔍'},
  {id: 'fmt', label: 'black --check', icon: '✨'},
  {id: 'lint', label: 'ruff / eslint', icon: '📋'},
  {id: 'commit', label: 'git commit', icon: '✅'},
];

export const WATCH_SCENARIOS = [
  {
    id: 'pytest',
    tool: 'entr',
    cmd: 'find . -name "*.py" | entr pytest',
    trigger: 'сохранение .py',
  },
  {
    id: 'reload',
    tool: 'watchexec',
    cmd: 'watchexec -e py "python app.py"',
    trigger: 'любое изменение .py',
  },
  {
    id: 'make',
    tool: 'make',
    cmd: 'make -j test',
    trigger: 'изменение Makefile',
  },
];

export const AUTOMATION_LAYERS = [
  {
    id: 'local',
    title: 'Локально',
    items: ['shell-циклы', 'Make/just', 'fzf + fd', 'direnv'],
  },
  {
    id: 'project',
    title: 'В репозитории',
    items: ['git hooks', 'pre-commit', 'cookiecutter', 'CI workflow'],
  },
  {
    id: 'system',
    title: 'На машине / сервере',
    items: ['cron / systemd', 'LaunchAgent', 'Task Scheduler'],
  },
];
