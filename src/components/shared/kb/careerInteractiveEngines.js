/** @typedef {{ id: string; label: string; coding: 'daily' | 'sometimes' | 'rare' }} RoleCard */
/** @typedef {{ id: string; label: string; hint: string }} SdlcPhase */

export const SDLC_PHASES = [
  {id: 'plan', label: 'Планирование', hint: 'Цели, сроки, бюджет'},
  {id: 'req', label: 'Требования', hint: 'Что нужно бизнесу и пользователю'},
  {id: 'design', label: 'Проектирование', hint: 'Архитектура, UX, модели данных'},
  {id: 'code', label: 'Разработка', hint: 'Код, интеграции, ревью'},
  {id: 'test', label: 'Тестирование', hint: 'QA, автотесты, приёмка'},
  {id: 'deploy', label: 'Внедрение', hint: 'Релиз, DevOps, миграции'},
  {id: 'ops', label: 'Эксплуатация', hint: 'Поддержка, мониторинг, инциденты'},
];

export const IT_ROLES = [
  {id: 'ba', label: 'Бизнес-аналитик', coding: 'rare'},
  {id: 'pm', label: 'Продакт / PM', coding: 'rare'},
  {id: 'ux', label: 'UX/UI дизайнер', coding: 'rare'},
  {id: 'fe', label: 'Frontend', coding: 'daily'},
  {id: 'be', label: 'Backend', coding: 'daily'},
  {id: 'qa', label: 'QA / тестировщик', coding: 'sometimes'},
  {id: 'devops', label: 'DevOps / SRE', coding: 'sometimes'},
  {id: 'sa', label: 'Системный админ', coding: 'sometimes'},
  {id: 'sec', label: 'ИБ-специалист', coding: 'sometimes'},
  {id: 'tw', label: 'Техписатель', coding: 'rare'},
  {id: 'data', label: 'Data / BI', coding: 'sometimes'},
  {id: 'support', label: 'Техподдержка', coding: 'rare'},
];

/** @type {Record<string, string[]>} */
export const ROLE_PHASE_HINTS = {
  ba: ['plan', 'req'],
  pm: ['plan', 'req', 'ops'],
  ux: ['req', 'design'],
  fe: ['design', 'code', 'test'],
  be: ['design', 'code', 'test', 'deploy'],
  qa: ['req', 'test', 'ops'],
  devops: ['deploy', 'ops'],
  sa: ['deploy', 'ops'],
  sec: ['design', 'test', 'ops'],
  tw: ['req', 'design', 'ops'],
  data: ['req', 'code', 'ops'],
  support: ['ops'],
};

export function scoreRolePlacement(roleId, phaseId) {
  const hints = ROLE_PHASE_HINTS[roleId] ?? [];
  if (hints.includes(phaseId)) return 'fit';
  if (phaseId === 'code' && IT_ROLES.find((r) => r.id === roleId)?.coding === 'daily') return 'fit';
  return 'stretch';
}

const STOP = new Set([
  'и', 'в', 'на', 'с', 'по', 'для', 'от', 'до', 'из', 'к', 'о', 'об', 'при', 'не', 'или', 'а', 'но',
  'the', 'a', 'an', 'and', 'or', 'to', 'in', 'on', 'with', 'for', 'of', 'is', 'are', 'we', 'you',
]);

export function extractKeywords(text) {
  return [...new Set(
    text
      .toLowerCase()
      .replace(/[^a-zа-яё0-9+#.\-/]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  )];
}

export function matchResumeToVacancy(vacancy, resume) {
  const vacKeys = extractKeywords(vacancy);
  const resKeys = new Set(extractKeywords(resume));
  const matched = vacKeys.filter((k) => resKeys.has(k));
  const missing = vacKeys.filter((k) => !resKeys.has(k));
  const score = vacKeys.length ? Math.round((matched.length / vacKeys.length) * 100) : 0;
  return {matched, missing, score, vacKeys};
}

export const HIRING_STAGES = [
  {id: 'publish', label: 'Публикация', tip: 'Вакансия на HH, LinkedIn, карьерном сайте'},
  {id: 'ats', label: 'ATS-фильтр', tip: 'Ключевые слова, структура, релевантность'},
  {id: 'screen', label: 'Скрининг HR', tip: 'Мотивация, зарплатные ожидания, soft skills'},
  {id: 'tech', label: 'Техинтервью', tip: 'Задачи, стек, рассуждения вслух'},
  {id: 'test', label: 'Тестовое', tip: 'Take-home или live coding'},
  {id: 'final', label: 'Финал', tip: 'Культура, менеджер, оффер'},
];

export const HIRING_DROP_RATES = [1, 0.55, 0.72, 0.6, 0.75, 0.88];

export function simulateHiringFunnel(start = 200) {
  let count = start;
  return HIRING_STAGES.map((stage, i) => {
    const kept = i === 0 ? count : Math.max(1, Math.round(count * HIRING_DROP_RATES[i]));
    count = kept;
    return {...stage, count, pct: Math.round((kept / start) * 100)};
  });
}

export const GRADE_LEVELS = [
  {
    id: 'junior',
    label: 'Junior',
    autonomy: 25,
    tasks: ['Задачи с чётким ТЗ', 'Парное программирование', 'Исправление багов по инструкции'],
  },
  {
    id: 'middle',
    label: 'Middle',
    autonomy: 60,
    tasks: ['Самостоятельные фичи', 'Код-ревью коллег', 'Оценка сроков в своей зоне'],
  },
  {
    id: 'senior',
    label: 'Senior',
    autonomy: 90,
    tasks: ['Архитектурные решения', 'Менторство', 'Согласование trade-off с бизнесом'],
  },
];

export const STAR_FIELDS = [
  {id: 'situation', label: 'Situation', hint: 'Контекст: команда, продукт, ограничения'},
  {id: 'task', label: 'Task', hint: 'Ваша конкретная ответственность'},
  {id: 'action', label: 'Action', hint: 'Что сделали лично вы (не "мы")'},
  {id: 'result', label: 'Result', hint: 'Измеримый результат или вывод'},
];

export function buildStarAnswer(fields) {
  const parts = STAR_FIELDS.map((f) => fields[f.id]?.trim()).filter(Boolean);
  return parts.join(' → ');
}

export function starCompleteness(fields) {
  const filled = STAR_FIELDS.filter((f) => (fields[f.id] ?? '').trim().length > 20).length;
  return Math.round((filled / STAR_FIELDS.length) * 100);
}

export const MARKET_SEGMENTS = [
  {id: 'junior-dev', label: 'Junior dev', applicants: 420, vacancies: 35, note: 'Перегретый вход'},
  {id: 'qa', label: 'QA manual', applicants: 180, vacancies: 48, note: 'Средняя конкуренция'},
  {id: 'devops', label: 'DevOps / SRE', applicants: 95, vacancies: 62, note: 'Спрос выше среднего'},
  {id: 'support', label: 'Support L1', applicants: 260, vacancies: 90, note: 'Много откликов, но и вакансий много'},
  {id: 'data', label: 'Data analyst', applicants: 150, vacancies: 40, note: 'Нужен портфель кейсов'},
];

export function segmentHeat(segment) {
  const ratio = segment.applicants / Math.max(segment.vacancies, 1);
  if (ratio > 8) return {level: 'hot', label: 'Высокая конкуренция'};
  if (ratio > 4) return {level: 'warm', label: 'Умеренная конкуренция'};
  return {level: 'cool', label: 'Относительный дефицит'};
}

export const EMPLOYMENT_FORMATS = [
  {
    id: 'tk',
    label: 'Трудовой договор',
    vacation: true,
    sick: true,
    pension: true,
    stability: 90,
    flexibility: 40,
    taxNote: 'НДФЛ 13–15%, взносы работодателя',
  },
  {
    id: 'gph',
    label: 'ГПХ',
    vacation: false,
    sick: false,
    pension: false,
    stability: 50,
    flexibility: 75,
    taxNote: 'НПД/ИП/самозанятость — налоги на исполнителе',
  },
  {
    id: 'sz',
    label: 'Самозанятость',
    vacation: false,
    sick: false,
    pension: false,
    stability: 35,
    flexibility: 90,
    taxNote: '4–6% с выплат, без соцгарантий ТК',
  },
];
