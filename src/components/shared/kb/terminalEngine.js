const INITIAL_CWD = '/home/guest';

export const VFS = {
  '/': {type: 'dir', children: ['home', 'etc', 'var']},
  '/home': {type: 'dir', children: ['guest']},
  '/home/guest': {
    type: 'dir',
    children: ['readme.txt', 'projects', 'notes'],
  },
  '/home/guest/readme.txt': {
    type: 'file',
    content:
      'Добро пожаловать в universe-it!\nЭто учебный терминал — экспериментируйте с ls, cd, cat.',
  },
  '/home/guest/projects': {type: 'dir', children: ['demo.sh']},
  '/home/guest/projects/demo.sh': {
    type: 'file',
    content: '#!/bin/bash\necho "Hello from demo script"',
  },
  '/home/guest/notes': {type: 'dir', children: ['cli.txt']},
  '/home/guest/notes/cli.txt': {
    type: 'file',
    content: 'CLI = Command Line Interface\nОболочка читает команды и передаёт их ядру ОС.',
  },
  '/etc': {type: 'dir', children: ['hostname']},
  '/etc/hostname': {type: 'file', content: 'universe-it-demo'},
  '/var': {type: 'dir', children: ['log']},
  '/var/log': {type: 'dir', children: ['boot.log']},
  '/var/log/boot.log': {
    type: 'file',
    content: '[OK] Started terminal emulator\n[OK] Mounted virtual filesystem',
  },
};

export const COMMAND_LIST = [
  'help',
  'clear',
  'exit',
  'echo',
  'date',
  'whoami',
  'pwd',
  'ls',
  'cd',
  'cat',
  'hostname',
  'uname',
  'history',
  'env',
  'man',
  'tree',
  'ping',
  'cowsay',
];

const MAN_PAGES = {
  help: 'help — список всех команд',
  ls: 'ls [путь] — содержимое каталога',
  cd: 'cd [путь] — сменить каталог (~, .., абсолютный путь)',
  cat: 'cat <файл> — показать содержимое файла',
  pwd: 'pwd — текущий каталог',
  echo: 'echo <текст> — вывести аргументы',
  clear: 'clear — очистить экран',
  exit: 'exit — перезапустить сессию',
  history: 'history — последние команды',
  man: 'man <команда> — краткая справка по команде',
};

function normalizePath(cwd, input) {
  let target = input.trim();
  if (!target || target === '~') {
    return INITIAL_CWD;
  }
  if (target.startsWith('~/')) {
    target = `${INITIAL_CWD}${target.slice(1)}`;
  } else if (!target.startsWith('/')) {
    target = cwd === '/' ? `/${target}` : `${cwd}/${target}`;
  }
  const parts = target.split('/').filter(Boolean);
  const stack = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return stack.length === 0 ? '/' : `/${stack.join('/')}`;
}

function resolveNode(path) {
  return VFS[path] ?? null;
}

function listDir(path) {
  const node = resolveNode(path);
  if (!node || node.type !== 'dir') {
    return {error: `ls: нет доступа к '${path}': Нет такого файла или каталога`};
  }
  const entries = (node.children ?? []).map((name) => {
    const childPath = path === '/' ? `/${name}` : `${path}/${name}`;
    const child = resolveNode(childPath);
    const suffix = child?.type === 'dir' ? '/' : '';
    return `${name}${suffix}`;
  });
  return {lines: entries.length ? entries : ['(пусто)']};
}

function renderTree(path, prefix = '', isLast = true) {
  const node = resolveNode(path);
  if (!node) return [];
  const base = path.split('/').pop() || '/';
  const lines = [`${prefix}${isLast ? '└── ' : '├── '}${base}${node.type === 'dir' ? '/' : ''}`];
  if (node.type !== 'dir' || !node.children?.length) {
    return lines;
  }
  const childPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
  node.children.forEach((child, i) => {
    const childPath = path === '/' ? `/${child}` : `${path}/${child}`;
    const last = i === node.children.length - 1;
    lines.push(...renderTree(childPath, childPrefix, last));
  });
  return lines;
}

function cowsay(text) {
  const msg = text || 'moo';
  const inner = Math.max(msg.length, 5);
  const border = '-'.repeat(inner + 2);
  return [
    ` ${border}`,
    `< ${msg.padEnd(inner)} >`,
    ` ${border}`,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ].join('\n');
}

function simulatePing(host) {
  const target = host || 'localhost';
  const lines = [`PING ${target} (127.0.0.1) 56(84) bytes of data.`];
  for (let i = 1; i <= 3; i += 1) {
    const ms = 12 + i * 7;
    lines.push(`64 bytes from ${target}: icmp_seq=${i} ttl=64 time=${ms}.${i} ms`);
  }
  lines.push(`--- ${target} ping statistics ---`);
  lines.push('3 packets transmitted, 3 received, 0% packet loss');
  return lines.join('\n');
}

export function getWelcomeLines() {
  return [
    {type: 'banner'},
    {type: 'system', text: 'universe-it · учебный терминал · введите help или нажмите подсказку ниже'},
    {type: 'muted', text: '─'.repeat(48)},
  ];
}

export function executeCommand(rawCmd, state) {
  const cmd = rawCmd.trim();
  if (!cmd) {
    return {state, lines: []};
  }

  const parts = cmd.split(/\s+/);
  const name = parts[0].toLowerCase();
  const args = parts.slice(1);
  const {cwd, commandHistory} = state;

  const record = (output, tone = 'output') => ({
    state: {
      ...state,
      commandHistory: [...commandHistory, cmd],
    },
    lines: [{type: 'command', command: cmd, cwd}, {type: tone, text: output}],
  });

  switch (name) {
    case 'help':
      return record(
        [
          'Команды:',
          '  help          список команд',
          '  clear         очистить экран',
          '  ls [путь]     каталог',
          '  cd [путь]     сменить каталог',
          '  pwd           где я',
          '  cat <файл>    прочитать файл',
          '  echo <текст>  вывод',
          '  date          дата и время',
          '  whoami        пользователь',
          '  hostname      имя хоста',
          '  uname         ОС',
          '  history       история',
          '  env           переменные',
          '  man <cmd>     справка',
          '  tree          дерево от текущего каталога',
          '  ping [хост]   имитация ping',
          '  cowsay <текст> ASCII-арт',
          '  exit          перезапуск сессии',
        ].join('\n'),
        'success',
      );

    case 'clear':
      return {
        state: {...state, commandHistory: [...commandHistory, cmd]},
        lines: [],
        clear: true,
      };

    case 'exit':
      return {
        state: {
          cwd: INITIAL_CWD,
          commandHistory: [],
          rebooting: true,
        },
        lines: [
          {type: 'command', command: cmd, cwd},
          {type: 'system', text: 'Сессия завершена. Перезагрузка…'},
        ],
        reboot: true,
      };

    case 'date':
      return record(new Date().toLocaleString('ru-RU'));

    case 'whoami':
      return record('guest');

    case 'pwd':
      return record(cwd);

    case 'hostname':
      return record('universe-it-demo');

    case 'uname':
      return record('Linux universe-it-demo 6.1.0-demo x86_64 GNU/Linux');

    case 'echo':
      return record(args.join(' ') || '');

    case 'env':
      return record(
        [
          'SHELL=/bin/bash',
          'USER=guest',
          `HOME=${INITIAL_CWD}`,
          `PWD=${cwd}`,
          'TERM=xterm-256color',
          'LANG=ru_RU.UTF-8',
        ].join('\n'),
      );

    case 'history': {
      const list =
        commandHistory.length === 0
          ? '(история пуста)'
          : commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n');
      return record(list);
    }

    case 'man': {
      const key = args[0]?.toLowerCase();
      if (!key) {
        return record('man: укажите команду, например: man ls', 'error');
      }
      const page = MAN_PAGES[key];
      return record(page ?? `man: справка для "${key}" не найдена`, page ? 'success' : 'error');
    }

    case 'ls': {
      const path = normalizePath(cwd, args[0] ?? '.');
      const result = listDir(path);
      if (result.error) {
        return record(result.error, 'error');
      }
      return record(result.lines.join('  '));
    }

    case 'cd': {
      const path = normalizePath(cwd, args[0] ?? INITIAL_CWD);
      const node = resolveNode(path);
      if (!node) {
        return record(`cd: ${args[0] ?? ''}: Нет такого файла или каталога`, 'error');
      }
      if (node.type !== 'dir') {
        return record(`cd: ${args[0]}: Не каталог`, 'error');
      }
      return {
        state: {
          ...state,
          cwd: path,
          commandHistory: [...commandHistory, cmd],
        },
        lines: [{type: 'command', command: cmd, cwd}],
      };
    }

    case 'cat': {
      if (!args[0]) {
        return record('cat: не указан файл', 'error');
      }
      const path = normalizePath(cwd, args[0]);
      const node = resolveNode(path);
      if (!node) {
        return record(`cat: ${args[0]}: Нет такого файла`, 'error');
      }
      if (node.type !== 'file') {
        return record(`cat: ${args[0]}: Это каталог`, 'error');
      }
      return record(node.content);
    }

    case 'tree': {
      const treeLines = renderTree(cwd);
      return record(treeLines.join('\n'));
    }

    case 'ping':
      return record(simulatePing(args[0]));

    case 'cowsay':
      return record(cowsay(args.join(' ')));

    default:
      return record(`bash: ${name}: command not found. Введите help.`, 'error');
  }
}

export function getCompletions(input, cwd) {
  const trimmed = input.trimStart();
  const parts = trimmed.split(/\s+/);
  const hasTrailingSpace = /\s$/.test(input);

  if (parts.length === 0 || (parts.length === 1 && !hasTrailingSpace)) {
    const prefix = (parts[0] ?? '').toLowerCase();
    return COMMAND_LIST.filter((c) => c.startsWith(prefix));
  }

  const cmd = parts[0].toLowerCase();
  if (!['ls', 'cd', 'cat'].includes(cmd)) {
    return [];
  }

  const argPrefix = hasTrailingSpace ? '' : (parts[parts.length - 1] ?? '');
  const basePath = parts.length > 2 && !hasTrailingSpace ? parts.slice(1, -1).join(' ') : '';
  const resolvedBase = basePath ? normalizePath(cwd, basePath) : cwd;
  const node = resolveNode(resolvedBase);
  if (!node || node.type !== 'dir') {
    return [];
  }

  return (node.children ?? [])
    .filter((name) => name.startsWith(argPrefix))
    .map((name) => {
      const childPath = resolvedBase === '/' ? `/${name}` : `${resolvedBase}/${name}`;
      const child = resolveNode(childPath);
      const suffix = cmd === 'cd' && child?.type === 'dir' ? '/' : child?.type === 'dir' ? '/' : '';
      const prefixPath = basePath ? `${basePath}/` : '';
      return `${prefixPath}${name}${suffix}`;
    });
}

export function formatPromptPath(cwd) {
  if (cwd === INITIAL_CWD) {
    return '~';
  }
  if (cwd.startsWith(`${INITIAL_CWD}/`)) {
    return `~${cwd.slice(INITIAL_CWD.length)}`;
  }
  return cwd;
}

export {INITIAL_CWD, normalizePath};
