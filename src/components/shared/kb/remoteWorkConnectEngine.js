export const CONNECTION_SCENARIOS = [
  {
    id: 'standard',
    short: 'VPN + RDP',
    title: 'Классическая удалёнка',
    subtitle: 'Сотрудник подключается через VPN к корпоративной сети, затем к рабочим серверам',
    steps: [
      {
        label: 'Домашний ПК',
        detail: 'Сотрудник запускает корпоративный VPN-клиент и вводит учётные данные (MFA).',
        spotlight: ['worker', 'home-net'],
      },
      {
        label: 'VPN-туннель',
        detail: 'Трафик шифруется и попадает в периметр компании — как будто ноутбук в офисной LAN.',
        spotlight: ['vpn', 'firewall'],
      },
      {
        label: 'Внутренние сервисы',
        detail: 'Доступны Git, Jira, внутренние API; RDP/SSH к dev-серверам и CI.',
        spotlight: ['corp-lan', 'servers'],
      },
      {
        label: 'Синхронизация',
        detail: 'Чаты и видеозвонки (Slack, Teams) часто идут напрямую в интернет, не через VPN.',
        spotlight: ['saas', 'worker'],
      },
    ],
  },
  {
    id: 'vdi',
    short: 'VDI',
    title: 'Виртуальный рабочий стол',
    subtitle: 'Вся работа ведётся в удалённой Windows/Linux-сессии в дата-центре компании',
    steps: [
      {
        label: 'Браузер / клиент VDI',
        detail: 'Сотрудник открывает Citrix, VMware Horizon или аналог.',
        spotlight: ['worker', 'vdi-gw'],
      },
      {
        label: 'Шлюз VDI',
        detail: 'Аутентификация, политики DLP, выдача виртуальной машины из пула.',
        spotlight: ['vdi-gw', 'firewall'],
      },
      {
        label: 'Виртуальный ПК',
        detail: 'IDE, документы и секреты остаются в ЦОД; на домашний ПК не копируются.',
        spotlight: ['vdi-vm', 'corp-lan'],
      },
      {
        label: 'Доступ к prod',
        detail: 'К продуктивным серверам — только из сегмента VDI, с журналированием.',
        spotlight: ['servers', 'vdi-vm'],
      },
    ],
  },
  {
    id: 'zero',
    short: 'Zero Trust',
    title: 'Без "плоской" VPN-сети',
    subtitle: 'Каждое приложение проверяет пользователя и устройство отдельно',
    steps: [
      {
        label: 'Идентичность',
        detail: 'SSO (Okta, Azure AD): логин + MFA, оценка риска устройства.',
        spotlight: ['worker', 'idp'],
      },
      {
        label: 'Политика доступа',
        detail: 'Разрешён только нужный сервис (Git, Confluence), не вся сеть.',
        spotlight: ['zt-proxy', 'policy'],
      },
      {
        label: 'Сегменты',
        detail: 'Dev/stage/prod изолированы; между ними — отдельные правила.',
        spotlight: ['corp-lan', 'servers'],
      },
      {
        label: 'Аудит',
        detail: 'Все сессии логируются; аномалии блокируются автоматически.',
        spotlight: ['siem', 'firewall'],
      },
    ],
  },
];

export function getScenario(id) {
  return CONNECTION_SCENARIOS.find((s) => s.id === id) ?? CONNECTION_SCENARIOS[0];
}
