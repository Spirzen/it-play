const INITIAL_CWD = 'C:\\Users\\Guest';

export const PS_VFS = {
  'C:\\': {type: 'dir', children: ['Users', 'Windows', 'Projects']},
  'C:\\Users': {type: 'dir', children: ['Guest']},
  'C:\\Users\\Guest': {type: 'dir', children: ['readme.txt', 'Documents', 'scripts']},
  'C:\\Users\\Guest\\readme.txt': {
    type: 'file',
    content: 'Добро пожаловать в учебный PowerShell!\r\nПопробуйте Get-ChildItem или gci.',
  },
  'C:\\Users\\Guest\\Documents': {type: 'dir', children: ['notes.txt']},
  'C:\\Users\\Guest\\Documents\\notes.txt': {
    type: 'file',
    content: 'Объектная модель: команды возвращают объекты, а не текст.',
  },
  'C:\\Users\\Guest\\scripts': {type: 'dir', children: ['hello.ps1']},
  'C:\\Users\\Guest\\scripts\\hello.ps1': {
    type: 'file',
    content: 'Write-Output "Hello from script"',
  },
  'C:\\Projects': {type: 'dir', children: ['app']},
  'C:\\Projects\\app': {type: 'dir', children: ['config.json']},
  'C:\\Projects\\app\\config.json': {
    type: 'file',
    content: '{"name":"demo","version":1}',
  },
  'C:\\Windows': {type: 'dir', children: ['System32']},
  'C:\\Windows\\System32': {type: 'dir', children: []},
};

export const PS_LESSONS = {
  intro: {
    id: 'intro',
    label: 'Старт',
    title: 'Первые командлеты',
    goal: 'Выполните help и Get-Location (или pwd).',
    checks: [(cmd) => /^\s*help\b/i.test(cmd), (cmd) => /^\s*(Get-Location|pwd)\b/i.test(cmd)],
    hints: ['help', 'Get-Location'],
  },
  basics: {
    id: 'basics',
    label: 'Основы',
    title: 'Объекты и список',
    goal: 'Выведите каталог: Get-ChildItem или ls.',
    checks: [(cmd) => /^\s*(Get-ChildItem|gci|ls|dir)\b/i.test(cmd)],
    hints: ['Get-ChildItem'],
  },
  cmdlets: {
    id: 'cmdlets',
    label: 'Командлеты',
    title: 'Глагол-Существительное',
    goal: 'Прочитайте файл: Get-Content readme.txt',
    checks: [(cmd) => /^\s*(Get-Content|gc|cat|type)\s/i.test(cmd)],
    hints: ['Get-Content readme.txt'],
  },
  variables: {
    id: 'variables',
    label: 'Переменные',
    title: '$переменные',
    goal: 'Задайте $name = "IT" и выведите Write-Output $name',
    checks: [
      (cmd) => /\$\w+\s*=/.test(cmd),
      (cmd) => /Write-Output\s+\$\w+/i.test(cmd) || /^\s*\$\w+\s*$/i.test(cmd),
    ],
    hints: ['$name = "IT"', 'Write-Output $name'],
  },
  pipeline: {
    id: 'pipeline',
    label: 'Конвейер',
    title: 'Конвейер |',
    goal: 'Отфильтруйте: Get-ChildItem | Where-Object { $_.Name -like "*.txt" }',
    checks: [(cmd) => /\|\s*Where-Object/i.test(cmd)],
    hints: ['Get-ChildItem | Where-Object { $_.Name -like "*.txt" }'],
  },
  control: {
    id: 'control',
    label: 'Условия',
    title: 'if и цикл',
    goal: 'Выполните: foreach ($i in 1,2,3) { Write-Output $i }',
    checks: [(cmd) => /foreach\s*\(/i.test(cmd)],
    hints: ['foreach ($i in 1,2,3) { Write-Output $i }'],
  },
  functions: {
    id: 'functions',
    label: 'Функции',
    title: 'function { }',
    goal: 'Объявите function Say-Hi { "Hi" } и вызовите Say-Hi',
    checks: [
      (cmd) => /function\s+\S+/i.test(cmd),
      (cmd) => /^\s*Say-Hi\b/i.test(cmd),
    ],
    hints: ['function Say-Hi { "Привет" }', 'Say-Hi'],
  },
  errors: {
    id: 'errors',
    label: 'Ошибки',
    title: 'Try / Catch',
    goal: 'Запустите try { 1/0 } catch { Write-Output "ошибка" }',
    checks: [(cmd) => /try\s*\{/i.test(cmd)],
    hints: ['try { 1/0 } catch { Write-Output "ошибка" }'],
  },
  automation: {
    id: 'automation',
    label: 'Автоматизация',
    title: 'Службы',
    goal: 'Посмотрите процессы: Get-Process (первые 3 в демо).',
    checks: [(cmd) => /^\s*Get-Process\b/i.test(cmd)],
    hints: ['Get-Process'],
  },
  modules: {
    id: 'modules',
    label: 'Модули',
    title: 'Get-Module',
    goal: 'Выведите список модулей: Get-Module',
    checks: [(cmd) => /^\s*Get-Module\b/i.test(cmd)],
    hints: ['Get-Module'],
  },
  'first-script': {
    id: 'first-script',
    label: 'Скрипт',
    title: 'Запуск .ps1',
    goal: 'Выполните: .\\scripts\\hello.ps1',
    checks: [(cmd) => /hello\.ps1/i.test(cmd)],
    hints: ['.\\scripts\\hello.ps1'],
  },
  reference: {
    id: 'reference',
    label: 'Справка',
    title: 'Get-Help',
    goal: 'Справка по командлету: Get-Help Get-ChildItem',
    checks: [(cmd) => /^\s*Get-Help\b/i.test(cmd)],
    hints: ['Get-Help Get-ChildItem'],
  },
};

const COMMAND_ALIASES = {
  gci: 'Get-ChildItem',
  ls: 'Get-ChildItem',
  dir: 'Get-ChildItem',
  gc: 'Get-Content',
  cat: 'Get-Content',
  type: 'Get-Content',
  pwd: 'Get-Location',
  cls: 'Clear-Host',
  echo: 'Write-Output',
  '?': 'Get-Help',
};

const MOCK_PROCESSES = [
  {Name: 'powershell', Id: 4242, CPU: 2.1},
  {Name: 'explorer', Id: 1138, CPU: 0.4},
  {Name: 'code', Id: 9001, CPU: 5.2},
];

const MOCK_MODULES = ['Microsoft.PowerShell.Core', 'Microsoft.PowerShell.Utility', 'PSReadLine'];

function normalizePsPath(cwd, input) {
  let target = (input ?? '').trim().replace(/\//g, '\\');
  if (!target || target === '~') return INITIAL_CWD;
  if (!target.includes(':')) {
    target = cwd.endsWith('\\') ? `${cwd}${target}` : `${cwd}\\${target}`;
  }
  const parts = target.split('\\').filter(Boolean);
  const stack = [];
  let drive = '';
  if (parts[0]?.endsWith(':')) {
    drive = parts.shift();
  }
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return stack.length === 0 ? `${drive}\\` : `${drive}\\${stack.join('\\')}`;
}

function resolveNode(path) {
  return PS_VFS[path] ?? null;
}

function listDir(path) {
  const node = resolveNode(path);
  if (!node || node.type !== 'dir') return {error: `Не удаётся найти путь "${path}"`};
  return {
    lines: (node.children ?? []).map((name) => {
      const childPath = path.endsWith('\\') ? `${path}${name}` : `${path}\\${name}`;
      const child = resolveNode(childPath);
      return {
        Name: name,
        Mode: child?.type === 'dir' ? 'd-----' : '-a----',
        Length: child?.type === 'file' ? (child.content?.length ?? 0) : '',
      };
    }),
  };
}

export function getPsWelcomeLines() {
  return [
    {type: 'banner'},
    {type: 'system', text: 'Windows PowerShell · учебный режим · help или Get-Help'},
    {type: 'muted', text: '─'.repeat(52)},
  ];
}

export function formatPsPrompt(cwd) {
  return cwd || INITIAL_CWD;
}

export function getPsLesson(id) {
  return PS_LESSONS[id] ?? PS_LESSONS.intro;
}

export function evaluatePsLesson(lessonId, commandHistory, lastState) {
  const lesson = getPsLesson(lessonId);
  const done = lesson.checks.filter((check) => commandHistory.some((c) => check(c, lastState))).length;
  return {done, total: lesson.checks.length, complete: done >= lesson.checks.length};
}

/**
 * @param {string} rawCmd
 * @param {{ cwd: string, commandHistory: string[], vars?: Record<string,string> }} state
 */
export function executePsCommand(rawCmd, state) {
  const cmd = rawCmd.trim();
  if (!cmd) return {state, lines: []};

  const parts = cmd.split(/\s+/);
  let name = parts[0];
  if (COMMAND_ALIASES[name.toLowerCase()]) {
    name = COMMAND_ALIASES[name.toLowerCase()];
  }
  const args = parts.slice(1);
  const {cwd, commandHistory, vars = {}} = state;

  const record = (output, tone = 'output') => ({
    state: {...state, commandHistory: [...commandHistory, cmd]},
    lines: [{type: 'command', command: cmd, cwd}, {type: tone, text: output}],
  });

  const formatTable = (rows) => {
    if (!rows.length) return '(пусто)';
    const header = 'Mode     Name                          Length';
    const body = rows.map((r) => `${r.Mode}     ${r.Name.padEnd(28)} ${r.Length}`);
    return [header, ...body].join('\n');
  };

  if (/^function\s+(\S+)/i.test(cmd)) {
    return record('Функция определена (учебная сессия).', 'success');
  }
  if (/^\s*Say-Hi\b/i.test(cmd)) {
    return record('Привет', 'success');
  }
  if (/foreach\s*\(/i.test(cmd)) {
    return record("1\n2\n3", 'success');
  }
  if (/try\s*\{/i.test(cmd)) {
    return record('ошибка', 'success');
  }
  if (/\|\s*Where-Object/i.test(cmd)) {
    const listed = listDir(cwd);
    const filtered = listed.lines?.filter((r) => r.Name.includes('.txt')) ?? [];
    return record(formatTable(filtered), 'success');
  }
  if (/\.\\.*hello\.ps1/i.test(cmd)) {
    return record('Hello from script', 'success');
  }

  switch (name) {
    case 'help':
      return record(
        [
          'Командлеты (демо):',
          '  Get-ChildItem / gci / ls / dir',
          '  Get-Content / gc <файл>',
          '  Set-Location / cd <путь>',
          '  Get-Location / pwd',
          '  Write-Output / echo <текст>',
          '  Get-Help <командлет>',
          '  Get-Process',
          '  Get-Module',
          '  Clear-Host / cls',
        ].join('\n'),
        'success',
      );

    case 'Clear-Host':
      return {state: {...state, commandHistory: [...commandHistory, cmd]}, lines: [], clear: true};

    case 'Get-Location':
      return record(cwd);

    case 'Set-Location': {
      const path = normalizePsPath(cwd, args.join(' '));
      const node = resolveNode(path);
      if (!node || node.type !== 'dir') return record(`cd : путь не найден`, 'error');
      return {
        state: {...state, cwd: path, commandHistory: [...commandHistory, cmd]},
        lines: [{type: 'command', command: cmd, cwd: path}],
      };
    }

    case 'Get-ChildItem': {
      const path = normalizePsPath(cwd, args.join(' ') || '.');
      const result = listDir(path);
      if (result.error) return record(result.error, 'error');
      return record(formatTable(result.lines), 'success');
    }

    case 'Get-Content': {
      const fileArg = args[0];
      if (!fileArg) return record('Укажите путь к файлу', 'error');
      const path = normalizePsPath(cwd, fileArg);
      const node = resolveNode(path);
      if (!node || node.type !== 'file') return record('Файл не найден', 'error');
      return record(node.content.replace(/\r\n/g, '\n'));
    }

    case 'Write-Output': {
      const text = cmd.replace(/^Write-Output\s+/i, '').replace(/^echo\s+/i, '');
      const expanded = text.replace(/\$(\w+)/g, (_, k) => vars[k] ?? `$${k}`);
      return record(expanded.replace(/^["']|["']$/g, '') || '');
    }

    case 'Get-Help': {
      const topic = args[0] ?? 'Get-ChildItem';
      return record(
        `${topic}\n\nСинтаксис (учебный):\n  ${topic} [[-Path] <String[]>]\n\nВозвращает элементы в каталоге.`,
        'success',
      );
    }

    case 'Get-Process':
      return record(
        MOCK_PROCESSES.map((p) => `${p.Name.padEnd(12)} Id:${p.Id}  CPU:${p.CPU}s`).join('\n'),
        'success',
      );

    case 'Get-Module':
      return record(MOCK_MODULES.map((m) => `Module: ${m}`).join('\n'), 'success');

    default: {
      const assign = cmd.match(/^\$(\w+)\s*=\s*(.+)$/);
      if (assign) {
        const val = assign[2].replace(/^["']|["']$/g, '');
        return {
          state: {
            ...state,
            vars: {...vars, [assign[1]]: val},
            commandHistory: [...commandHistory, cmd],
          },
          lines: [{type: 'command', command: cmd, cwd}],
        };
      }
      if (/^\$\w+$/.test(cmd)) {
        const key = cmd.slice(1);
        return record(vars[key] ?? '', vars[key] ? 'success' : 'muted');
      }
      return record(
        `${parts[0]} : Имя "${parts[0]}" не распознано. Введите help.`,
        'error',
      );
    }
  }
}

export {INITIAL_CWD as PS_INITIAL_CWD};
