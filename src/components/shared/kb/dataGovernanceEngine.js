export const CLASSIFICATIONS = [
  {id: 'public', label: 'Публичные', level: 0, color: '#2e7d32'},
  {id: 'internal', label: 'Внутренние', level: 1, color: '#1565c0'},
  {id: 'confidential', label: 'Конфиденциальные', level: 2, color: '#f57f17'},
  {id: 'restricted', label: 'Строго ограниченные', level: 3, color: '#c62828'},
];

export const ROLES = [
  {id: 'owner', label: 'Data Owner', maxLevel: 3},
  {id: 'steward', label: 'Data Steward', maxLevel: 2},
  {id: 'analyst', label: 'Аналитик', maxLevel: 1},
  {id: 'guest', label: 'Гость', maxLevel: 0},
];

export const DATA_ASSETS = [
  {
    id: 'hr',
    name: 'Кадровые данные',
    category: 'Админ-управление',
    minClass: 'confidential',
    owner: 'HR Director',
  },
  {
    id: 'finance',
    name: 'Финансовая отчётность',
    category: 'Финансы',
    minClass: 'restricted',
    owner: 'CFO',
  },
  {
    id: 'crm',
    name: 'База клиентов CRM',
    category: 'Операции',
    minClass: 'internal',
    owner: 'Sales Lead',
  },
  {
    id: 'ip',
    name: 'Патенты и R&D',
    category: 'Интеллектуальная собственность',
    minClass: 'restricted',
    owner: 'CTO',
  },
  {
    id: 'marketing',
    name: 'Маркетинговые исследования',
    category: 'Маркетинг',
    minClass: 'confidential',
    owner: 'CMO',
  },
  {
    id: 'public_site',
    name: 'Контент публичного сайта',
    category: 'Коммуникации',
    minClass: 'public',
    owner: 'Content Manager',
  },
];

export const QUALITY_CHECKS = [
  {id: 'accuracy', label: 'Точность', weight: 0.3},
  {id: 'completeness', label: 'Полнота', weight: 0.25},
  {id: 'timeliness', label: 'Актуальность', weight: 0.25},
  {id: 'consistency', label: 'Согласованность', weight: 0.2},
];

export function classLevel(classId) {
  return CLASSIFICATIONS.find((c) => c.id === classId)?.level ?? 0;
}

export function accessAllowed(roleId, assetClassId) {
  const role = ROLES.find((r) => r.id === roleId);
  if (!role) return false;
  return role.maxLevel >= classLevel(assetClassId);
}

export function governanceScore(assignments, roleId) {
  let compliant = 0;
  let total = DATA_ASSETS.length;
  DATA_ASSETS.forEach((asset) => {
    const assigned = assignments[asset.id] ?? asset.minClass;
    const minOk = classLevel(assigned) >= classLevel(asset.minClass);
    const accessOk = accessAllowed(roleId, assigned);
    if (minOk && accessOk) compliant += 1;
  });
  const compliancePct = Math.round((compliant / total) * 100);
  const qualityPct = Math.min(100, compliancePct + 8);
  return {compliant, total, compliancePct, qualityPct};
}
