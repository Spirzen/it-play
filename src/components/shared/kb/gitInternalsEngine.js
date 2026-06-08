export const GIT_TREE = [
  {
    id: 'git',
    name: '.git/',
    desc: 'Вся метаинформация репозитория',
    children: [
      {
        id: 'head',
        name: 'HEAD',
        desc: 'Указатель на текущую ветку (refs/heads/main) или detached commit',
        sample: 'ref: refs/heads/main',
      },
      {
        id: 'config',
        name: 'config',
        desc: 'Локальные настройки: user, remote origin, alias',
        sample: '[remote "origin"]\n  url = https://github.com/org/repo.git',
      },
      {
        id: 'index',
        name: 'index',
        desc: 'Staging area — что попадёт в следующий commit',
        sample: 'бинарный снимок индекса (SHA деревьев файлов)',
      },
      {
        id: 'objects',
        name: 'objects/',
        desc: 'Коммиты, деревья, blob-файлы — content-addressable по SHA-1',
        sample: 'objects/ab/cdef1234…  (blob)\nobjects/12/3456abcd… (commit)',
        children: [
          {id: 'blob', name: 'blob', desc: 'Содержимое файла'},
          {id: 'tree', name: 'tree', desc: 'Каталог: имена → SHA'},
          {id: 'commit', name: 'commit', desc: 'Снимок: tree + parent + author + message'},
        ],
      },
      {
        id: 'refs',
        name: 'refs/',
        desc: 'Именованные указатели на коммиты',
        children: [
          {id: 'heads', name: 'heads/', desc: 'Локальные ветки'},
          {id: 'tags', name: 'tags/', desc: 'Теги релизов v1.0.0'},
          {id: 'remotes', name: 'remotes/', desc: 'Состояние origin после fetch'},
        ],
      },
      {id: 'hooks', name: 'hooks/', desc: 'pre-commit, post-merge — автоматизация'},
      {id: 'logs', name: 'logs/', desc: 'Журнал перемещений HEAD и refs'},
    ],
  },
];

export function flattenSelectable(nodes, depth = 0, out = []) {
  for (const n of nodes) {
    out.push({...n, depth});
    if (n.children) flattenSelectable(n.children, depth + 1, out);
  }
  return out;
}
