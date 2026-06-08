export const LAYERS = [
  {
    id: 'domain',
    label: 'Domain',
    dirs: ['entity', 'value-objects'],
    desc: 'Сущности и инварианты бизнеса. Без зависимостей от фреймворка.',
    color: '#2e7d32',
    allowedDeps: [],
  },
  {
    id: 'usecase',
    label: 'Use cases',
    dirs: ['use-cases'],
    desc: 'Сценарии приложения: оркестрация домена.',
    color: '#1565c0',
    allowedDeps: ['domain'],
  },
  {
    id: 'ports',
    label: 'Ports (interface)',
    dirs: ['interface', 'ports'],
    desc: 'Абстракции: IUserRepository, IEmailSender.',
    color: '#6a1b9a',
    allowedDeps: ['domain', 'usecase'],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    dirs: ['infrastructure'],
    desc: 'Реализации: SQL, HTTP, файловая система.',
    color: '#c62828',
    allowedDeps: ['domain', 'usecase', 'ports'],
  },
  {
    id: 'presentation',
    label: 'Presentation',
    dirs: ['handlers', 'filters', 'dtos'],
    desc: 'HTTP/API, DTO, middleware — без бизнес-логики.',
    color: '#ed6c02',
    allowedDeps: ['usecase', 'ports', 'dtos'],
  },
];

export function isDependencyAllowed(fromId, toId) {
  const from = LAYERS.find((l) => l.id === fromId);
  const to = LAYERS.find((l) => l.id === toId);
  if (!from || !to) return false;
  if (fromId === toId) return true;
  return from.allowedDeps.includes(toId);
}
