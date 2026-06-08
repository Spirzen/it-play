/** Данные профиля автора для интерактива на /about/author. */

export const AUTHOR_ROLES = [
  {id: 'author', label: 'Автор', group: 'content'},
  {id: 'editor', label: 'Редактор', group: 'content'},
  {id: 'teacher', label: 'Преподаватель', group: 'content'},
  {id: 'dev', label: 'Разработчик', group: 'tech'},
  {id: 'analyst', label: 'Аналитик', group: 'tech'},
  {id: 'architect', label: 'Архитектор', group: 'tech'},
  {id: 'tester', label: 'Тестировщик', group: 'tech'},
  {id: 'lawyer', label: 'Юрист', group: 'other'},
];

export const ROLE_GROUPS = {
  content: {label: 'Контент и обучение', color: '#4a6cf7'},
  tech: {label: 'Инженерия', color: '#2e8b57'},
  other: {label: 'Другое', color: '#9370db'},
};

export const SKILL_AXES = [
  {id: 'writing', label: 'Техписьмо', value: 92},
  {id: 'teaching', label: 'Преподавание', value: 88},
  {id: 'analysis', label: 'Анализ', value: 85},
  {id: 'dev', label: 'Разработка', value: 78},
  {id: 'law', label: 'Право в IT', value: 72},
  {id: 'system', label: 'Систематизация', value: 95},
];

export const INTERESTS = [
  {id: 'it', label: 'IT и энциклопедии', emoji: '💻'},
  {id: 'fantasy', label: 'Фэнтези (кино, книги)', emoji: '🐉'},
  {id: 'games', label: 'Игры и лор', emoji: '🎮'},
  {id: 'music', label: 'Саундтреки и рок', emoji: '🎵'},
  {id: 'langs', label: 'Языки (RU, BA, EN C2)', emoji: '🌍'},
];

export const PROJECT_STATS = [
  {value: '3000+', label: 'материалов'},
  {value: '9', label: 'разделов энциклопедии'},
  {value: '15+', label: 'языков в базе'},
  {value: '0 ₽', label: 'плата за доступ'},
];

export const SUPPORT_CHANNELS = [
  {id: 'yoomoney', label: 'ЮMoney', value: '4100119386983244', copy: true},
  {id: 'card', label: 'Карта', value: '5469060010806112', copy: true},
  {
    id: 'tg',
    label: 'Telegram',
    value: 'https://t.me/spirzenverse',
    copy: false,
    href: 'https://t.me/spirzenverse',
  },
  {
    id: 'dzen',
    label: 'Дзен',
    value: 'https://dzen.ru/itus',
    copy: false,
    href: 'https://dzen.ru/itus',
  },
];

export const CONTACTS = [
  {label: 'Email', href: 'mailto:tim.tagirov@mail.ru', text: 'tim.tagirov@mail.ru'},
  {label: 'GitHub', href: 'https://github.com/spirzen', text: 'spirzen'},
  {label: 'Сайт', href: 'https://spirzen.github.io/', text: 'spirzen.github.io'},
];

export {SPIRZEN_ONLINE_TOOLS_LIST as AUTHOR_ONLINE_TOOLS} from './spirzenOnlineTools';
