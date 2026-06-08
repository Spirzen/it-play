/** Классы алгоритмической сложности для демо Big-O */

export const COMPLEXITY_CLASSES = [
  {
    id: 'const',
    notation: 'O(1)',
    label: 'Константная',
    fn: () => 1,
    color: '#2e7d32',
    example: 'доступ по индексу в массиве',
    code: 'arr[i];',
  },
  {
    id: 'log',
    notation: 'O(log n)',
    label: 'Логарифмическая',
    fn: (n) => Math.log2(Math.max(n, 2)),
    color: '#00897b',
    example: 'бинарный поиск',
    code: 'while (lo < hi) { mid = … }',
  },
  {
    id: 'linear',
    notation: 'O(n)',
    label: 'Линейная',
    fn: (n) => n,
    color: '#1976d2',
    example: 'линейный проход по массиву',
    code: 'for (i = 0; i < n; i++) { … }',
  },
  {
    id: 'nlogn',
    notation: 'O(n log n)',
    label: 'Линейно-логарифмическая',
    fn: (n) => n * Math.log2(Math.max(n, 2)),
    color: '#7b1fa2',
    example: 'mergesort, heapsort',
    code: 'sort(arr); // эффективные сортировки',
  },
  {
    id: 'quad',
    notation: 'O(n²)',
    label: 'Квадратичная',
    fn: (n) => n * n,
    color: '#ed6c02',
    example: 'вложенные циклы по n',
    code: 'for (i) for (j) { … }',
  },
  {
    id: 'exp',
    notation: 'O(2ⁿ)',
    label: 'Экспоненциальная',
    fn: (n) => 2 ** n,
    color: '#c62828',
    example: 'полный перебор подмножеств',
    code: 'recurse(остаток); // 2 ветки',
    maxN: 28,
  },
];

export const N_MIN = 10;
export const N_MAX = 500;
export const N_DEFAULT = 100;

export function formatOps(value) {
  if (!Number.isFinite(value)) return '—';
  if (value >= 1e15) return '≫ 10¹⁵';
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)} трлн`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)} млрд`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)} млн`;
  if (value >= 1e4) return `${(value / 1e3).toFixed(1)} тыс`;
  return Math.round(value).toLocaleString('ru-RU');
}

export function growthFactor(fn, n) {
  const base = fn(n);
  const scaled = fn(n * 10);
  if (base <= 0 || !Number.isFinite(base) || !Number.isFinite(scaled)) return null;
  if (base < 1e-6) return scaled;
  return scaled / base;
}

export function formatGrowth(factor) {
  if (factor == null || !Number.isFinite(factor)) return '—';
  if (factor >= 1e6) return `×${factor.toExponential(1)}`;
  if (factor >= 100) return `×${Math.round(factor)}`;
  if (factor >= 10) return `×${factor.toFixed(1)}`;
  return `×${factor.toFixed(2)}`;
}

/** Точки кривой для SVG (логарифм по Y) */
export function buildCurvePoints(fn, nMax, steps = 48, maxN) {
  const cap = maxN != null ? Math.min(nMax, maxN) : nMax;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const n = N_MIN + ((cap - N_MIN) * i) / steps;
    const y = fn(n);
    if (!Number.isFinite(y) || y <= 0) continue;
    pts.push({n, y: Math.log10(y + 1)});
  }
  return pts;
}
