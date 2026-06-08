export const INGREDIENTS = [
  {id: 'beans', label: 'Зёрна', max: 100, unit: 'г'},
  {id: 'water', label: 'Вода', max: 100, unit: 'мл'},
  {id: 'milk', label: 'Молоко', max: 100, unit: 'мл'},
  {id: 'syrup', label: 'Сироп', max: 50, unit: 'мл'},
];

export const RECIPES = [
  {
    id: 'espresso',
    name: 'Эспрессо',
    cost: {beans: 18, water: 30},
    desc: 'Классика. Без молока.',
  },
  {
    id: 'americano',
    name: 'Американо',
    cost: {beans: 18, water: 120},
    desc: 'Эспрессо + горячая вода.',
  },
  {
    id: 'latte',
    name: 'Латте',
    cost: {beans: 18, water: 30, milk: 150},
    desc: 'Эспрессо + много молока.',
  },
  {
    id: 'mocha',
    name: 'Мокко',
    cost: {beans: 18, water: 30, milk: 100, syrup: 15},
    desc: 'Латте + шоколадный сироп.',
  },
];

export function canBrew(stock, recipe) {
  const missing = [];
  for (const [key, need] of Object.entries(recipe.cost)) {
    if ((stock[key] ?? 0) < need) {
      const ing = INGREDIENTS.find((i) => i.id === key);
      missing.push(`${ing?.label ?? key}: нужно ${need}, есть ${stock[key] ?? 0}`);
    }
  }
  return {ok: missing.length === 0, missing};
}

export function brew(stock, recipe) {
  const check = canBrew(stock, recipe);
  if (!check.ok) {
    return {
      stock,
      ok: false,
      log: `Исключение: InsufficientResource — ${check.missing.join('; ')}`,
    };
  }
  const next = {...stock};
  for (const [key, need] of Object.entries(recipe.cost)) {
    next[key] = Math.max(0, (next[key] ?? 0) - need);
  }
  return {
    stock: next,
    ok: true,
    log: `Готово: ${recipe.name}. Приятной отладки!`,
  };
}

export const DEFAULT_STOCK = {
  beans: 80,
  water: 90,
  milk: 60,
  syrup: 30,
};
