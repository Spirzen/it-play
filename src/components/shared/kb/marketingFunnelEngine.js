export const FUNNEL_STAGES = [
  {id: 'leads', label: 'Лиды', short: 'Лиды'},
  {id: 'qualify', label: 'Квалификация', short: 'Квал.'},
  {id: 'demo', label: 'Демо', short: 'Демо'},
  {id: 'proposal', label: 'КП', short: 'КП'},
  {id: 'negotiate', label: 'Переговоры', short: 'Перег.'},
  {id: 'close', label: 'Сделка', short: 'Сделка'},
];

export const FUNNEL_PRESETS = [
  {
    id: 'b2b',
    label: 'B2B SaaS',
    rates: [100, 55, 38, 28, 18, 12],
    hint: 'Длинный цикл: много отсева на квалификации и КП.',
  },
  {
    id: 'b2c',
    label: 'B2C',
    rates: [100, 72, 58, 45, 32, 24],
    hint: 'Короче цикл, выше конверсия на демо и оплате.',
  },
  {
    id: 'b2d',
    label: 'B2D',
    rates: [100, 68, 52, 40, 30, 22],
    hint: 'Разработчики: важны документация и trial → оплата.',
  },
];

const BANT_FIELDS = [
  {id: 'budget', label: 'Budget — бюджет'},
  {id: 'authority', label: 'Authority — ЛПР'},
  {id: 'need', label: 'Need — потребность'},
  {id: 'timeline', label: 'Timeline — сроки'},
];

export {BANT_FIELDS};

export function defaultRates() {
  return FUNNEL_PRESETS[0].rates.map((r) => r);
}

export function runFunnelSimulation(startCount, stageRates) {
  const stages = [];
  for (let i = 0; i < FUNNEL_STAGES.length; i += 1) {
    const pct = stageRates[i] ?? 0;
    const count =
      i === 0 ? startCount : Math.max(0, Math.round((stages[i - 1].count * pct) / 100));
    stages.push({...FUNNEL_STAGES[i], pct: i === 0 ? 100 : pct, count});
  }
  return stages;
}

export function evaluateBant(flags) {
  const score = BANT_FIELDS.filter((f) => flags[f.id]).length;
  return {
    score,
    qualified: score >= 3,
    label:
      score === 4
        ? 'Готов к передаче в продажи'
        : score === 3
          ? 'Можно передать с уточняющими вопросами'
          : 'Прогрев: лид ещё не квалифицирован',
  };
}

export function overallConversion(stages) {
  const start = stages[0]?.count ?? 0;
  const end = stages[stages.length - 1]?.count ?? 0;
  if (!start) return 0;
  return Math.round((end / start) * 1000) / 10;
}
