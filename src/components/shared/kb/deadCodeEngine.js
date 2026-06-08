export const DEAD_CODE_SAMPLE = `public class OrderService
{
    private readonly int _unusedField = 42;

    public void ProcessOrder(Order order)
    {
        ValidateOrder(order);
        return;

        SaveOrder(order);
        SendConfirmation(order);
    }

    private void UnusedMethod() { }
}`;

export const DEAD_ISSUES = [
  {
    id: 'field',
    line: 2,
    kind: 'unused',
    title: 'Неиспользуемое поле',
    detail: '_unusedField объявлено, но нигде не читается.',
  },
  {
    id: 'unreachable-save',
    line: 10,
    kind: 'unreachable',
    title: 'Недостижимый код',
    detail: 'После return SaveOrder никогда не выполнится.',
  },
  {
    id: 'unreachable-send',
    line: 11,
    kind: 'unreachable',
    title: 'Недостижимый код',
    detail: 'SendConfirmation тоже за return.',
  },
  {
    id: 'method',
    line: 14,
    kind: 'unused',
    title: 'Неиспользуемый метод',
    detail: 'UnusedMethod() не вызывается из проекта.',
  },
];

export const COVERAGE_LINES = [1, 3, 4, 5, 6, 7];

export function linesOfSample() {
  return DEAD_CODE_SAMPLE.split('\n');
}

export function issuesForMode(mode) {
  if (mode === 'static') return DEAD_ISSUES;
  if (mode === 'coverage') {
    return DEAD_ISSUES.filter((i) => i.kind === 'unreachable' || i.line === 14);
  }
  return [];
}
