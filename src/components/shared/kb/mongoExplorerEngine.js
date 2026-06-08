export const SAMPLE_DOCS = [
  {
    _id: '65a1…01',
    name: 'Анна К.',
    email: 'anna@corp.ru',
    age: 28,
    hobbies: ['йога', 'SQL'],
  },
  {
    _id: '65a1…02',
    title: 'Черновик отчёта Q1',
    author: 'finance',
    tags: ['draft'],
  },
  {
    _id: '65a1…03',
    sku: 'SKU-9912',
    price: {amount: 1299, currency: 'RUB'},
    warehouse: {city: 'Москва', aisle: 4},
  },
];

export const QUERY_PRESETS = [
  {id: 'all', label: 'Все', filter: () => true},
  {id: 'has_email', label: 'email есть', filter: (d) => 'email' in d},
  {id: 'nested', label: 'вложенный price', filter: (d) => d.price?.amount != null},
  {id: 'age', label: 'age ≥ 25', filter: (d) => (d.age ?? 0) >= 25},
];

export function runFind(docs, presetId) {
  const preset = QUERY_PRESETS.find((p) => p.id === presetId) ?? QUERY_PRESETS[0];
  const matched = docs.filter(preset.filter);
  return {
    matched,
    filterText:
      presetId === 'all'
        ? 'db.products.find({})'
        : presetId === 'has_email'
          ? 'db.products.find({ email: { $exists: true } })'
          : presetId === 'nested'
            ? 'db.products.find({ "price.amount": { $exists: true } })'
            : 'db.products.find({ age: { $gte: 25 } })',
  };
}
