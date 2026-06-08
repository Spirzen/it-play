import {
  COMMAND_LIST,
  INITIAL_CWD,
  VFS,
  executeCommand,
  formatPromptPath,
  getCompletions,
  getWelcomeLines,
  normalizePath,
} from './terminalEngine';

export {INITIAL_CWD, formatPromptPath, getWelcomeLines, getCompletions};

/** @typedef {{ cwd: string, commandHistory: string[], vars?: Record<string,string> }} BashState */

export const BASH_LESSONS = {
  intro: {
    id: 'intro',
    label: 'Знакомство',
    title: 'Первые команды',
    goal: 'Выполните help и pwd — узнайте, где вы находитесь.',
    checks: [(cmd) => /^\s*help\s*$/i.test(cmd), (cmd) => /^\s*pwd\s*$/i.test(cmd)],
    hints: ['help', 'pwd'],
  },
  basics: {
    id: 'basics',
    label: 'Основы',
    title: 'Файлы и каталоги',
    goal: 'Выведите список файлов (ls) и прочитайте readme.txt (cat).',
    checks: [(cmd) => /^\s*ls\b/i.test(cmd), (cmd) => /^\s*cat\s+readme/i.test(cmd)],
    hints: ['ls', 'cat readme.txt'],
  },
  navigation: {
    id: 'navigation',
    label: 'Навигация',
    title: 'Переход по каталогам',
    goal: 'Перейдите в projects (cd) и посмотрите дерево (tree).',
    checks: [
      (cmd, state) => /^\s*cd\s+projects/i.test(cmd) || state.cwd.includes('projects'),
      (cmd) => /^\s*tree\b/i.test(cmd),
    ],
    hints: ['cd projects', 'tree'],
  },
  syntax: {
    id: 'syntax',
    label: 'Синтаксис',
    title: 'Перенаправление и кавычки',
    goal: 'Выведите текст через echo с пробелами в кавычках.',
    checks: [(cmd) => /^\s*echo\s+["'].*\s+.*["']/i.test(cmd) || /^\s*echo\s+\S+\s+\S+/i.test(cmd)],
    hints: ['echo "Hello Bash"'],
  },
  variables: {
    id: 'variables',
    label: 'Переменные',
    title: 'Переменные окружения',
    goal: 'Посмотрите env и задайте переменную: export NAME=value.',
    checks: [(cmd) => /^\s*env\b/i.test(cmd), (cmd) => /^\s*export\s+\w+=/i.test(cmd)],
    hints: ['env', 'export COURSE=bash'],
  },
  control: {
    id: 'control',
    label: 'Циклы',
    title: 'Цикл for',
    goal: 'Запустите встроенный пример: for i in 1 2 3; do echo $i; done',
    checks: [(cmd) => /for\s+.+\s+in\s+.+\s*;\s*do/i.test(cmd)],
    hints: ['for i in 1 2 3; do echo $i; done'],
  },
  functions: {
    id: 'functions',
    label: 'Функции',
    title: 'Определение функции',
    goal: 'Объявите функцию greet() { echo "hi"; } и вызовите greet.',
    checks: [
      (cmd) => /^\s*\w+\s*\(\s*\)\s*\{/.test(cmd) || /function\s+\w+/i.test(cmd),
      (cmd) => /^\s*greet\b/i.test(cmd),
    ],
    hints: ['greet() { echo "Привет"; }', 'greet'],
  },
  files: {
    id: 'files',
    label: 'Файлы',
    title: 'Поиск и фильтр',
    goal: 'Найдите строку в файле: grep CLI notes/cli.txt',
    checks: [(cmd) => /^\s*grep\s+/i.test(cmd)],
    hints: ['grep CLI notes/cli.txt'],
  },
  utilities: {
    id: 'utilities',
    label: 'Утилиты',
    title: 'head и wc',
    goal: 'Покажите первые строки readme и посчитайте слова.',
    checks: [(cmd) => /^\s*head\b/i.test(cmd), (cmd) => /^\s*wc\b/i.test(cmd)],
    hints: ['head -n 2 readme.txt', 'wc -w readme.txt'],
  },
  'first-script': {
    id: 'first-script',
    label: 'Скрипт',
    title: 'Первый скрипт',
    goal: 'Запустите bash projects/demo.sh',
    checks: [(cmd) => /bash\s+.*demo\.sh/i.test(cmd)],
    hints: ['bash projects/demo.sh'],
  },
  errors: {
    id: 'errors',
    label: 'Ошибки',
    title: 'Код возврата',
    goal: 'Выполните true и false — посмотрите коды $?',
    checks: [(cmd) => /^\s*true\b/i.test(cmd), (cmd) => /^\s*false\b/i.test(cmd)],
    hints: ['true', 'false', 'echo $?'],
  },
  automation: {
    id: 'automation',
    label: 'Автоматизация',
    title: 'Цепочка команд',
    goal: 'Свяжите команды: ls | wc -l (подсчёт элементов).',
    checks: [(cmd) => /\|\s*wc/i.test(cmd)],
    hints: ['ls | wc -l'],
  },
  reference: {
    id: 'reference',
    label: 'Справка',
    title: 'man и history',
    goal: 'Откройте man ls и выведите history.',
    checks: [(cmd) => /^\s*man\s+ls/i.test(cmd), (cmd) => /^\s*history\b/i.test(cmd)],
    hints: ['man ls', 'history'],
  },
};

const EXTRA_COMMANDS = ['grep', 'head', 'tail', 'wc', 'export', 'true', 'false', 'bash', 'for'];

export function getBashCommandList() {
  return [...new Set([...COMMAND_LIST, ...EXTRA_COMMANDS])];
}

function resolveNode(path) {
  return VFS[path] ?? null;
}

function readFile(cwd, arg) {
  const path = normalizePath(cwd, arg);
  const node = resolveNode(path);
  if (!node) return {error: `нет файла: ${arg}`};
  if (node.type !== 'file') return {error: `${arg}: это каталог`};
  return {content: node.content};
}

function runForLoop(cmd) {
  const m = cmd.match(/for\s+(\w+)\s+in\s+([^;]+);\s*do\s+(.+?)\s*;\s*done/i);
  if (!m) return null;
  const [, , listRaw, body] = m;
  const items = listRaw.trim().split(/\s+/);
  const lines = [];
  for (const item of items) {
    const line = body.replace(/\$(\w+)/g, (_, v) => (v === m[1] ? item : `$${v}`));
    lines.push(line.replace(/^echo\s+/i, '').replace(/^["']|["']$/g, '') || item);
  }
  return lines.join('\n');
}

function runPipeline(cmd, state) {
  const parts = cmd.split('|').map((p) => p.trim());
  if (parts.length < 2) return null;
  let text = '';
  for (let i = 0; i < parts.length - 1; i += 1) {
    const sub = executeBashCommand(parts[i], state, {skipHistory: true});
    const last = sub.lines?.filter((l) => l.type === 'output' || l.type === 'success').pop();
    text = last?.text ?? '';
    if (sub.state) state = sub.state;
  }
  const lastCmd = parts[parts.length - 1];
  if (/^wc\s+-l/i.test(lastCmd)) {
    const count = text ? text.split(/\s{2,}|\n/).filter(Boolean).length : 0;
    return String(count);
  }
  if (/^wc\s+-w/i.test(lastCmd)) {
    return String(text.split(/\s+/).filter(Boolean).length);
  }
  return text;
}

function tryExtended(rawCmd, state) {
  const cmd = rawCmd.trim();
  const parts = cmd.split(/\s+/);
  const name = parts[0]?.toLowerCase();
  const args = parts.slice(1);
  const {cwd, commandHistory} = state;
  const vars = state.vars ?? {};

  const record = (output, tone = 'output') => ({
    state: {
      ...state,
      commandHistory: [...commandHistory, cmd],
    },
    lines: [{type: 'command', command: cmd, cwd}, {type: tone, text: output}],
  });

  if (/^for\s+/i.test(cmd)) {
    const out = runForLoop(cmd);
    if (out !== null) return record(out, 'success');
  }

  if (cmd.includes('|')) {
    const out = runPipeline(cmd, {...state});
    if (out !== null) return record(out, 'success');
  }

  if (/^\w+\s*\(\s*\)\s*\{/.test(cmd)) {
    return record('Функция сохранена в учебной сессии (демо).', 'success');
  }

  switch (name) {
    case 'export': {
      const eq = args.join(' ').indexOf('=');
      if (eq < 0) return record('export: используйте NAME=value', 'error');
      const key = args.join(' ').slice(0, eq);
      const val = args.join(' ').slice(eq + 1);
      return {
        state: {
          ...state,
          vars: {...vars, [key]: val},
          commandHistory: [...commandHistory, cmd],
        },
        lines: [{type: 'command', command: cmd, cwd}],
      };
    }
    case 'grep': {
      if (!args[0]) return record('grep: укажите шаблон и файл', 'error');
      const pattern = args[0];
      const fileArg = args[1];
      if (!fileArg) return record('grep: укажите файл', 'error');
      const file = readFile(cwd, fileArg);
      if (file.error) return record(`grep: ${file.error}`, 'error');
      const hits = file.content
        .split('\n')
        .filter((line) => line.includes(pattern))
        .map((line) => line);
      return record(hits.length ? hits.join('\n') : '(совпадений нет)', hits.length ? 'success' : 'muted');
    }
    case 'head': {
      const n = args[0] === '-n' ? Number(args[1]) : 5;
      const fileArg = args[0] === '-n' ? args[2] : args[0];
      const file = readFile(cwd, fileArg ?? 'readme.txt');
      if (file.error) return record(`head: ${file.error}`, 'error');
      return record(file.content.split('\n').slice(0, n).join('\n'));
    }
    case 'tail': {
      const file = readFile(cwd, args[args.length - 1] ?? 'readme.txt');
      if (file.error) return record(`tail: ${file.error}`, 'error');
      const lines = file.content.split('\n');
      return record(lines.slice(-3).join('\n'));
    }
    case 'wc': {
      const file = readFile(cwd, args[args.length - 1] ?? 'readme.txt');
      if (file.error) return record(`wc: ${file.error}`, 'error');
      const words = file.content.split(/\s+/).filter(Boolean).length;
      const lines = file.content.split('\n').length;
      if (args.includes('-w')) return record(String(words));
      if (args.includes('-l')) return record(String(lines));
      return record(`${lines} ${words} ${file.content.length}`);
    }
    case 'true':
      return {...record('', 'success'), exitCode: 0};
    case 'false':
      return {...record('', 'error'), exitCode: 1};
    case 'bash': {
      const script = args[0];
      if (script?.includes('demo.sh')) {
        return record('Hello from demo script', 'success');
      }
      return record(`bash: ${script ?? '?'}: учебный скрипт не найден`, 'error');
    }
    default:
      return null;
  }
}

/**
 * @param {string} rawCmd
 * @param {BashState} state
 * @param {{ skipHistory?: boolean }} [opts]
 */
export function executeBashCommand(rawCmd, state, opts = {}) {
  const cmd = rawCmd.trim();
  if (!cmd) return {state, lines: []};

  const extended = tryExtended(cmd, state);
  if (extended) {
    if (opts.skipHistory) {
      return {...extended, state: {...extended.state, commandHistory: state.commandHistory}};
    }
    return extended;
  }

  if (/^\s*greet\b/i.test(cmd)) {
    return {
      state: {...state, commandHistory: [...state.commandHistory, cmd]},
      lines: [
        {type: 'command', command: cmd, cwd: state.cwd},
        {type: 'success', text: 'Привет'},
      ],
    };
  }

  if (/^\s*echo\s+\$\?/i.test(cmd)) {
    return {
      state: {...state, commandHistory: [...state.commandHistory, cmd]},
      lines: [
        {type: 'command', command: cmd, cwd: state.cwd},
        {type: 'output', text: '0'},
      ],
    };
  }

  return executeCommand(cmd, state);
}

export function getLesson(id) {
  return BASH_LESSONS[id] ?? BASH_LESSONS.intro;
}

export function evaluateLessonProgress(lessonId, commandHistory, lastState) {
  const lesson = getLesson(lessonId);
  if (!lesson?.checks?.length) return {done: 0, total: 0, complete: true};
  const done = lesson.checks.filter((check, i) => {
    const relevant = commandHistory.filter((c) => check(c, lastState));
    return relevant.length > 0;
  }).length;
  return {done, total: lesson.checks.length, complete: done >= lesson.checks.length};
}
