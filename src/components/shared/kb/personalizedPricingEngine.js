export const BASE_PRICE = 2490;

export const PRICE_SIGNALS = [
  {
    id: 'rush',
    label: 'Час пик / пробки',
    markup: 12,
    hint: 'Контекст: срочность и высокий спрос',
  },
  {
    id: 'night',
    label: 'Заказ после 22:00',
    markup: 9,
    hint: 'Импульсивная покупка, низкая чувствительность к цене',
  },
  {
    id: 'loyal',
    label: 'Частый покупатель',
    markup: 6,
    hint: 'Монетизация лояльности',
  },
  {
    id: 'salary',
    label: 'Недавно пришла зарплата',
    markup: 5,
    hint: 'Финансовый профиль: "деньги есть"',
  },
  {
    id: 'iphone',
    label: 'Премиум-смартфон',
    markup: 7,
    hint: 'Прокси платёжеспособности',
  },
  {
    id: 'impulse',
    label: 'Мгновенная оплата',
    markup: 8,
    hint: 'Не сравнивал цены — выше готовность платить',
  },
];

export function calcPersonalizedPrice(activeIds) {
  const active = PRICE_SIGNALS.filter((s) => activeIds[s.id]);
  const markupPct = active.reduce((sum, s) => sum + s.markup, 0);
  const price = Math.round(BASE_PRICE * (1 + markupPct / 100));
  const delta = price - BASE_PRICE;
  return {price, markupPct, delta, active};
}

export function formatRub(n) {
  return `${n.toLocaleString('ru-RU')} ₽`;
}
