export const VACATION_STEPS = [
  {id: 'request', label: 'Заявка сотрудника', actor: 'Сотрудник', manualMin: 15, autoMin: 2},
  {id: 'balance', label: 'Проверка баланса отпуска', actor: 'Система', manualMin: 20, autoMin: 0},
  {id: 'manager', label: 'Согласование руководителя', actor: 'Руководитель', manualMin: 480, autoMin: 5},
  {id: 'order', label: 'Приказ в кадрах', actor: 'HR', manualMin: 120, autoMin: 3},
  {id: 'payroll', label: 'Расчёт отпускных', actor: 'Бухгалтерия', manualMin: 90, autoMin: 2},
  {id: 'notify', label: 'Уведомление сотрудника', actor: 'Система', manualMin: 10, autoMin: 0},
];

export const BPM_PRESETS = [
  {id: 'manual', label: 'Вручную (email, Excel)', mode: 'manual'},
  {id: 'bpm', label: 'BPM / ECM', mode: 'auto'},
  {id: 'crm', label: 'CRM + интеграция', mode: 'auto', integration: true},
];

export function totalMinutes(steps, mode) {
  return steps.reduce((sum, s) => sum + (mode === 'manual' ? s.manualMin : s.autoMin), 0);
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} мин`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}
