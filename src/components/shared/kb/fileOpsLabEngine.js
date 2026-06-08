/** Учебные файлы и сценарии для демо "работа с файлами" */

export const SAMPLE_TREE = [
  {path: 'project/README.md', type: 'file', size: '2 KB'},
  {path: 'project/src/app.py', type: 'file', size: '4 KB'},
  {path: 'project/src/utils.py', type: 'file', size: '1 KB'},
  {path: 'project/tests/test_app.py', type: 'file', size: '3 KB'},
  {path: 'project/logs/app.log', type: 'file', size: '120 KB'},
  {path: 'project/data/backup.sql', type: 'file', size: '48 MB'},
  {path: 'project/tmp/cache.tmp', type: 'file', size: '512 B'},
];

export const FILE_CONTENTS = {
  'project/src/app.py': `def main():\n    print("Hello")\n    return 0\n`,
  'project/src/utils.py': `def add(a, b):\n    return a + b\n`,
  'project/src/app_v2.py': `def main():\n    print("Hello, world!")\n    return add(1, 2)\n\ndef add(a, b):\n    return a + b\n`,
};

export const DIFF_PAIR = {
  left: {label: 'app.py (было)', key: 'project/src/app.py'},
  right: {label: 'app.py (стало)', key: 'project/src/app_v2.py'},
};

export function diffLines(left, right) {
  const a = left.split('\n');
  const b = right.split('\n');
  const max = Math.max(a.length, b.length);
  const rows = [];
  for (let i = 0; i < max; i++) {
    const l = a[i];
    const r = b[i];
    if (l === r) rows.push({type: 'same', text: l ?? ''});
    else if (l === undefined) rows.push({type: 'add', text: r});
    else if (r === undefined) rows.push({type: 'del', text: l});
    else rows.push({type: 'del', text: l}, {type: 'add', text: r});
  }
  return rows;
}

export function runSearch(pattern, flags = '') {
  const re = new RegExp(pattern, flags.includes('i') ? 'i' : '');
  return SAMPLE_TREE.filter((f) => f.type === 'file' && re.test(f.path));
}

export const SEARCH_PRESETS = [
  {id: 'py', pattern: '\\.py$', label: 'Все .py', flags: ''},
  {id: 'log', pattern: 'log', label: 'Пути с log', flags: 'i'},
  {id: 'tmp', pattern: '\\.tmp$', label: 'Временные .tmp', flags: ''},
  {id: 'test', pattern: 'test_', label: 'test_*', flags: ''},
];

export const BATCH_OPS = [
  {
    id: 'rename',
    label: 'Переименовать *.JPG → .jpg',
    cmd: 'for f in *.JPG; do mv "$f" "${f%.JPG}.jpg"; done',
    affect: ['photo.JPG', 'scan.JPG'],
  },
  {
    id: 'gzip-logs',
    label: 'Сжать логи',
    cmd: 'find . -name "*.log" -exec gzip {} \\;',
    affect: ['project/logs/app.log'],
  },
  {
    id: 'clean-tmp',
    label: 'Удалить .tmp',
    cmd: 'find . -type f -name "*.tmp" -delete',
    affect: ['project/tmp/cache.tmp'],
  },
];
