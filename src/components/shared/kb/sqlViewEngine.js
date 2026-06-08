/** Модель обычного и материализованного представления */

export const SALES_RAW = [
  {id: 1, product_id: 10, region: 'Москва', amount: 12000, changed: 0},
  {id: 2, product_id: 11, region: 'СПб', amount: 8500, changed: 0},
  {id: 3, product_id: 10, region: 'Москва', amount: 4300, changed: 0},
  {id: 4, product_id: 12, region: 'Казань', amount: 2100, changed: 0},
];

export const PRODUCTS = [
  {id: 10, category: 'Софт'},
  {id: 11, category: 'Железо'},
  {id: 12, category: 'Софт'},
];

export function computeSalesSummary(sales) {
  const map = new Map();
  for (const s of sales) {
    const p = PRODUCTS.find((x) => x.id === s.product_id);
    const key = `${s.region}|${p?.category ?? '?'}`;
    const prev = map.get(key) ?? {region: s.region, product_category: p?.category, total_sales: 0, order_count: 0};
    prev.total_sales += s.amount;
    prev.order_count += 1;
    map.set(key, prev);
  }
  return [...map.values()].sort((a, b) => b.total_sales - a.total_sales);
}

export function bumpSourceSales(sales) {
  return sales.map((r) => ({
    ...r,
    amount: Math.round(r.amount * 1.08),
    changed: (r.changed ?? 0) + 1,
  }));
}
