export const CAREER_ROLES = [
  {id: 'dev', label: 'Разработчик', skills: {code: 80, systems: 50, people: 30, product: 40}},
  {id: 'lead', label: 'Tech Lead', skills: {code: 70, systems: 65, people: 60, product: 55}},
  {id: 'arch', label: 'Архитектор', skills: {code: 55, systems: 85, people: 45, product: 60}},
  {id: 'pm', label: 'Product / PM', skills: {code: 25, systems: 35, people: 75, product: 90}},
  {id: 'devops', label: 'DevOps / SRE', skills: {code: 50, systems: 90, people: 40, product: 35}},
  {id: 'data', label: 'Data / ML', skills: {code: 60, systems: 55, people: 35, product: 50}},
];

export const SKILL_AXES = [
  {id: 'code', label: 'Код и инженерия', hint: 'Языки, алгоритмы, качество кода'},
  {id: 'systems', label: 'Системы', hint: 'ОС, сети, БД, архитектура'},
  {id: 'people', label: 'Люди', hint: 'Коммуникация, менторство, лидерство'},
  {id: 'product', label: 'Продукт', hint: 'Бизнес-ценность, метрики, приоритеты'},
];

export const HORIZONS = [
  {id: 'short', label: '6–12 мес', months: 12},
  {id: 'mid', label: '1–3 года', months: 36},
  {id: 'long', label: '3+ лет', months: 60},
];

export const MARKET_SIGNALS = [
  {id: 'remote', label: 'Удалёнка', weight: 1},
  {id: 'ai', label: 'ИИ-инструменты', weight: 1.2},
  {id: 'security', label: 'Безопасность', weight: 1.1},
  {id: 'cloud', label: 'Облака', weight: 1.15},
];

export function defaultSkills() {
  return {code: 40, systems: 35, people: 30, product: 25};
}

export function roleFitScore(skills, roleId) {
  const role = CAREER_ROLES.find((r) => r.id === roleId) ?? CAREER_ROLES[0];
  const axes = SKILL_AXES.map((a) => a.id);
  let sum = 0;
  for (const axis of axes) {
    const diff = Math.abs((skills[axis] ?? 0) - (role.skills[axis] ?? 0));
    sum += Math.max(0, 100 - diff);
  }
  return Math.round(sum / axes.length);
}

export function rankedRoles(skills) {
  return [...CAREER_ROLES]
    .map((r) => ({...r, fit: roleFitScore(skills, r.id)}))
    .sort((a, b) => b.fit - a.fit);
}

export function gapAnalysis(skills, targetRoleId) {
  const role = CAREER_ROLES.find((r) => r.id === targetRoleId);
  if (!role) return [];
  return SKILL_AXES.map((axis) => {
    const current = skills[axis.id] ?? 0;
    const target = role.skills[axis.id] ?? 0;
    const gap = Math.max(0, target - current);
    return {axis: axis.label, current, target, gap, priority: gap > 25 ? 'высокий' : gap > 10 ? 'средний' : 'низкий'};
  })
    .filter((g) => g.gap > 0)
    .sort((a, b) => b.gap - a.gap);
}

export function buildActionPlan(gaps, horizonMonths) {
  const steps = [];
  const top = gaps.slice(0, 3);
  top.forEach((g, i) => {
    const weeks = Math.max(4, Math.round((horizonMonths * 4) / (top.length + 1)));
    steps.push({
      id: `step-${i}`,
      title: `Подтянуть "${g.axis}" (+${g.gap} п.п.)`,
      detail:
        g.priority === 'высокий'
          ? 'Курс + pet-проект + ревью у ментора'
          : 'Практика на рабочих задачах и 1 внешний проект',
      weeks,
    });
  });
  if (horizonMonths >= 24) {
    steps.push({
      id: 'network',
      title: 'Сеть и видимость',
      detail: '2 доклада, 5 статей или постов, участие в сообществе',
      weeks: 8,
    });
  }
  return steps;
}

export function marketModifier(selectedSignals) {
  if (!selectedSignals.length) return 1;
  const w = selectedSignals.reduce((s, id) => {
    const sig = MARKET_SIGNALS.find((m) => m.id === id);
    return s + (sig?.weight ?? 1);
  }, 0);
  return Math.min(1.35, w / selectedSignals.length);
}
