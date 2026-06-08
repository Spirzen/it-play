/** Слои ИТ-инфраструктуры */

export const INFRA_LAYERS = [
  {
    id: 'hardware',
    label: 'Железо',
    icon: '🖥',
    color: '#5c6bc0',
    items: ['Серверы', 'ПК', 'СХД', 'Сеть (кабели)'],
    detail: 'Физические ресурсы: вычисления, память, диски, порты.',
  },
  {
    id: 'software',
    label: 'ПО',
    icon: '💾',
    color: '#26a69a',
    items: ['ОС', 'Гипервизор', 'СУБД', 'Приложения'],
    detail: 'ОС и стек программ превращают железо в сервисы.',
  },
  {
    id: 'network',
    label: 'Сеть',
    icon: '🌐',
    color: '#42a5f5',
    items: ['LAN', 'WAN', 'VPN', 'DNS/DHCP'],
    detail: 'Связность узлов, маршрутизация, балансировка, firewall.',
  },
  {
    id: 'people',
    label: 'Люди',
    icon: '👥',
    color: '#ffa726',
    items: ['Пользователи', 'Админы', 'DevOps', 'ИБ'],
    detail: 'Роли, доступы, процессы эксплуатации и поддержки.',
  },
  {
    id: 'rules',
    label: 'Правила',
    icon: '📋',
    color: '#ab47bc',
    items: ['SLA', 'Политики', 'Регламенты', 'Compliance'],
    detail: 'Как компоненты работают вместе: backup, patch, incident.',
  },
];

export const INFRA_LINKS = [
  ['hardware', 'software'],
  ['software', 'network'],
  ['network', 'people'],
  ['people', 'rules'],
  ['rules', 'hardware'],
];

export function describeLayer(id) {
  return INFRA_LAYERS.find((l) => l.id === id)?.detail ?? '';
}
