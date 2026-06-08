export const PNL_PRESETS = [
  {
    id: 'saas',
    label: 'SaaS',
    revenue: 12_000_000,
    cogs: 1_800_000,
    opex: 7_200_000,
    hint: 'Низкая себестоимость, высокие расходы на команду и маркетинг.',
  },
  {
    id: 'outsourcing',
    label: 'Аутсорс разработки',
    revenue: 8_500_000,
    cogs: 5_100_000,
    opex: 1_700_000,
    hint: 'Основные затраты — оплата разработчиков (COGS).',
  },
  {
    id: 'product',
    label: 'Коробочный продукт',
    revenue: 4_200_000,
    cogs: 900_000,
    opex: 2_400_000,
    hint: 'Лицензии + поддержка, маржа зависит от масштаба.',
  },
];

export function formatRub(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export function calcPnL({revenue, cogs, opex}) {
  const rev = Math.max(0, Number(revenue) || 0);
  const cost = Math.max(0, Number(cogs) || 0);
  const oper = Math.max(0, Number(opex) || 0);
  const gross = rev - cost;
  const net = gross - oper;
  const grossMargin = rev ? (gross / rev) * 100 : 0;
  const netMargin = rev ? (net / rev) * 100 : 0;
  const markup = cost ? ((rev - cost) / cost) * 100 : 0;

  return {
    revenue: rev,
    cogs: cost,
    opex: oper,
    gross,
    net,
    grossMargin,
    netMargin,
    markup,
    profitable: net > 0,
  };
}
