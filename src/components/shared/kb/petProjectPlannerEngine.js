export const PET_TYPES = [
  {
    id: 'learn',
    label: 'Обучающий',
    goal: 'Освоить новый стек или паттерн',
    mvpHours: '10–20 ч',
    checklist: ['Один сквозной сценарий', 'README с целью', 'Без "на будущее"'],
  },
  {
    id: 'demo',
    label: 'Демонстрационный',
    goal: 'Портфолио для собеседования',
    mvpHours: '20–40 ч',
    checklist: ['Deploy (Docker/VPS)', 'Тесты или OpenAPI', 'Скриншоты в README'],
  },
  {
    id: 'util',
    label: 'Утилитарный',
    goal: 'Решить личную задачу',
    mvpHours: '5–15 ч',
    checklist: ['Один вход — один результат', 'Логирование ошибок', 'Версия 0.1.0'],
  },
];

export const SAMPLE_PROJECTS = [
  {id: 'calc', name: 'Калькулятор', stack: 'HTML, CSS, JS', skills: ['DOM', 'события']},
  {id: 'todo', name: 'To-Do List', stack: 'JS + localStorage', skills: ['массивы', 'CRUD UI']},
  {id: 'api', name: 'REST API + БД', stack: 'Python/Node + SQL', skills: ['HTTP', 'миграции']},
  {id: 'cli', name: 'CLI-утилита', stack: 'Rust/Go/Python', skills: ['аргументы', 'файлы']},
];
