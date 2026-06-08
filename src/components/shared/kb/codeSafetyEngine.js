export const DISASTER_SCENARIOS = [
  {
    id: 'unsaved',
    label: 'Несохранённые правки',
    desc: 'IDE закрылась без Ctrl+S — буфер потерян.',
    recoveries: {autosave: true, localHistory: true, vcs: false},
  },
  {
    id: 'crash',
    label: 'Сбой ОС / BSOD',
    desc: 'Питание пропало — RAM обнулилась.',
    recoveries: {autosave: true, localHistory: true, vcs: false},
  },
  {
    id: 'overwrite',
    label: 'Перезапись файла',
    desc: 'Сохранили старую версию поверх новой.',
    recoveries: {autosave: false, localHistory: true, vcs: true},
  },
  {
    id: 'delete',
    label: 'Удаление без корзины',
    desc: 'Папку удалили окончательно.',
    recoveries: {autosave: false, localHistory: false, vcs: true},
  },
  {
    id: 'conflict',
    label: 'Конфликт двух разработчиков',
    desc: 'Второй push перезаписал работу первого.',
    recoveries: {autosave: false, localHistory: false, vcs: true},
  },
];

export const RECOVERY_TOOLS = [
  {key: 'autosave', label: 'Автосохранение IDE', icon: '💾'},
  {key: 'localHistory', label: 'Локальная история', icon: '🕐'},
  {key: 'vcs', label: 'Git / VCS', icon: '🔀'},
];
