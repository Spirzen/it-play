export const TABS = [
  {id: 'home', label: 'Главная', icon: '🏠'},
  {id: 'tasks', label: 'Задачи', icon: '✓'},
  {id: 'learn', label: 'Учёба', icon: '📚'},
  {id: 'about', label: 'О приложении', icon: 'ℹ️'},
];

export const DEFAULT_TODOS = [
  {id: '1', text: 'Изучить жизненный цикл Activity', done: true},
  {id: '2', text: 'Сохранить состояние в localStorage', done: false},
  {id: '3', text: 'Собрать релиз APK', done: false},
];

export const LEARN_CARDS = [
  {
    title: 'State (состояние)',
    body: 'Счётчик и список задач хранятся в React state и перерисовывают UI при изменении.',
  },
  {
    title: 'Props vs State',
    body: 'Вкладки и тема передаются вниз как props; интерактивные данные живут в state экрана.',
  },
  {
    title: 'Персистентность',
    body: 'Значения сохраняются в localStorage — при перезагрузке страницы "приложение" помнит данные.',
  },
];

export function loadStored(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStored(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}
