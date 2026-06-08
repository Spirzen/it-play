/** Учебный подсчёт M = 1 + число точек ветвления (if, циклы, &&, ||, case, catch). */

export const COMPLEXITY_BLOCKS = [
  {id: 'if', label: 'if', points: 1, snippet: 'if (ok) { ... }'},
  {id: 'elif', label: 'else if', points: 1, snippet: 'else if (retry) { ... }'},
  {id: 'else', label: 'else', points: 0, snippet: 'else { ... }'},
  {id: 'while', label: 'while', points: 1, snippet: 'while (hasNext) { ... }'},
  {id: 'for', label: 'for', points: 1, snippet: 'for (item of list) { ... }'},
  {id: 'and', label: '&& в условии', points: 1, snippet: 'if (a && b) { ... }'},
  {id: 'or', label: '|| в условии', points: 1, snippet: 'if (a || b) { ... }'},
  {id: 'switch', label: 'switch (3 case)', points: 3, snippet: 'switch (x) { case 1: ... case 2: ... }'},
  {id: 'catch', label: 'try/catch', points: 1, snippet: 'try { ... } catch (e) { ... }'},
];

export function calcCyclomatic(activeIds) {
  const set = new Set(activeIds);
  const extra = COMPLEXITY_BLOCKS.filter((b) => set.has(b.id)).reduce((s, b) => s + b.points, 0);
  return 1 + extra;
}

export function minTestsNeeded(complexity) {
  return complexity;
}

export function complexityZone(v) {
  if (v <= 5) {
    return {
      id: 'low',
      label: '1–5: тривиальная',
      hint: 'Легко читать и тестировать.',
      className: 'zoneLow',
    };
  }
  if (v <= 10) {
    return {
      id: 'med',
      label: '6–10: умеренная',
      hint: 'Разумный предел для повседневных функций.',
      className: 'zoneMed',
    };
  }
  if (v <= 20) {
    return {
      id: 'high',
      label: '11–20: высокая',
      hint: 'Стоит разбить функцию или упростить условия.',
      className: 'zoneHigh',
    };
  }
  return {
    id: 'crit',
    label: '21+: критическая',
    hint: 'Сигнал технического долга — нужен рефакторинг.',
    className: 'zoneCrit',
  };
}

export function buildPseudoCode(activeIds) {
  const lines = ['function processOrder(order) {', '  validate(order);'];
  const set = new Set(activeIds);
  if (set.has('if')) lines.push('  if (!order.paid) return;');
  if (set.has('elif')) lines.push('  else if (order.retry) { ... }');
  if (set.has('else')) lines.push('  else { logDefault(); }');
  if (set.has('and')) lines.push('  if (order.ok && order.stock) { ... }');
  if (set.has('or')) lines.push('  if (order.vip || order.prepaid) { ... }');
  if (set.has('while')) lines.push('  while (queue.hasNext()) { ... }');
  if (set.has('for')) lines.push('  for (const line of order.lines) { ... }');
  if (set.has('switch')) lines.push('  switch (order.status) { case 1: ... case 2: ... }');
  if (set.has('catch')) lines.push('  try { charge(); } catch (e) { ... }');
  lines.push('  return order;');
  lines.push('}');
  return lines.join('\n');
}

export const REFACTOR_HINT =
  'Вынесите ветки в отдельные функции: validatePayment(), applyDiscount(), ship() — сложность суммируется по модулям, а не копится в одном методе.';
