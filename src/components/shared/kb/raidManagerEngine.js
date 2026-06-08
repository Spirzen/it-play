export const ROLES = [
  {id: 'tank', label: 'Танк', color: '#3b82f6', weight: 1.2},
  {id: 'heal', label: 'Хил', color: '#22c55e', weight: 1.1},
  {id: 'dps', label: 'DPS', color: '#ef4444', weight: 1},
];

export const DEFAULT_RAIDERS = [
  {id: '1', name: 'Артём', role: 'tank', present: true, loot: 0},
  {id: '2', name: 'Мира', role: 'heal', present: true, loot: 0},
  {id: '3', name: 'Кодекс', role: 'dps', present: true, loot: 0},
  {id: '4', name: 'Линукс', role: 'dps', present: false, loot: 0},
];

export const LOOT_ITEMS = [
  {id: 'sword', name: 'Меч рефакторинга', value: 100},
  {id: 'ring', name: 'Кольцо +5 к кофеину', value: 40},
  {id: 'chest', name: 'Сундук CI Green', value: 80},
  {id: 'shard', name: 'Осколок legacy-кода', value: 25},
];

export function roleMeta(roleId) {
  return ROLES.find((r) => r.id === roleId) ?? ROLES[2];
}

/** Распределение лута по присутствующим с учётом роли. */
export function distributeLoot(raiders, itemCount) {
  const present = raiders.filter((r) => r.present);
  if (present.length === 0) return {raiders, log: 'Никто не пришёл на рейд — лут в банке гильдии.'};

  const totalWeight = present.reduce((s, r) => s + roleMeta(r.role).weight, 0);
  const next = raiders.map((r) => ({...r}));
  const gains = [];

  for (let i = 0; i < itemCount; i++) {
    let roll = Math.random() * totalWeight;
    for (const r of present) {
      roll -= roleMeta(r.role).weight;
      if (roll <= 0) {
        const idx = next.findIndex((x) => x.id === r.id);
        next[idx] = {...next[idx], loot: next[idx].loot + 1};
        gains.push(r.name);
        break;
      }
    }
  }

  const log = `Раздано предметов: ${itemCount}. Получатели: ${[...new Set(gains)].join(', ') || '—'}`;
  return {raiders: next, log};
}

export function attendanceSummary(raiders) {
  const present = raiders.filter((r) => r.present).length;
  return `${present}/${raiders.length} на рейде`;
}
