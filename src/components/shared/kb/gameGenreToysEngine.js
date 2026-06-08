/** Метаданные и данные для мини-игр по жанрам видеоигр. */

export const THEMES = {
  javascript: {label: 'JavaScript', accent: '#f7df1e'},
  python: {label: 'Python', accent: '#3776ab'},
  java: {label: 'Java', accent: '#f89820'},
  csharp: {label: 'C#', accent: '#68217a'},
  go: {label: 'Go', accent: '#00add8'},
  rust: {label: 'Rust', accent: '#dea584'},
};

export const GENRES = [
  'arcade',
  'platformer',
  'puzzle',
  'turnbased',
  'rpg',
  'roguelike',
];

export const GENRE_META = {
  arcade: {
    label: 'Аркада / экшен',
    subtitle: 'реакция в реальном времени, game loop, столкновения',
    skill: 'цикл update/render, координаты, коллизии',
    accent: '#ef4444',
    refs: 'Pac-Man, Space Invaders',
  },
  platformer: {
    label: 'Платформер',
    subtitle: 'гравитация, прыжок, проверка «на земле»',
    skill: 'физика состояния, ввод, победа/поражение',
    accent: '#22c55e',
    refs: 'Super Mario, Celeste',
  },
  puzzle: {
    label: 'Головоломка',
    subtitle: 'правила на сетке, детерминированные ходы',
    skill: 'массивы, инварианты, проверка победы',
    accent: '#a855f7',
    refs: 'Tetris, 2048, пятнашки',
  },
  turnbased: {
    label: 'Пошаговая стратегия',
    subtitle: 'дискретные ходы, очередь, ИИ противника',
    skill: 'очередь ходов, pathfinding по клеткам',
    accent: '#3b82f6',
    refs: 'XCOM, Civilization',
  },
  rpg: {
    label: 'RPG',
    subtitle: 'статы, инвентарь, ветвление сюжета',
    skill: 'объект персонажа, прогресс, save state',
    accent: '#f59e0b',
    refs: 'Fallout, Final Fantasy',
  },
  roguelike: {
    label: 'Roguelike',
    subtitle: 'случайные комнаты, permadeath, мета-прогресс',
    skill: 'RNG, процедурность, риск',
    accent: '#14b8a6',
    refs: 'Hades, Slay the Spire',
  },
};

/** Пятнашки 3×3: 0 — пустая клетка. */
export const SOLVED_PUZZLE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function createShuffledPuzzle() {
  const board = [...SOLVED_PUZZLE];
  for (let i = 0; i < 24; i += 1) {
    const empty = board.indexOf(0);
    const moves = neighbors(empty);
    const pick = moves[Math.floor(Math.random() * moves.length)];
    [board[empty], board[pick]] = [board[pick], board[empty]];
  }
  if (isPuzzleSolved(board)) return createShuffledPuzzle();
  return board;
}

function neighbors(idx) {
  const r = Math.floor(idx / 3);
  const c = idx % 3;
  const out = [];
  if (r > 0) out.push(idx - 3);
  if (r < 2) out.push(idx + 3);
  if (c > 0) out.push(idx - 1);
  if (c < 2) out.push(idx + 1);
  return out;
}

export function tryPuzzleMove(board, index) {
  const empty = board.indexOf(0);
  if (!neighbors(empty).includes(index)) return board;
  const next = [...board];
  [next[empty], next[index]] = [next[index], next[empty]];
  return next;
}

export function isPuzzleSolved(board) {
  return board.every((v, i) => v === SOLVED_PUZZLE[i]);
}

/** RPG — короткий квест с характеристиками. */
export const RPG_SCENES = {
  start: {
    text: 'Вы у ворот подземелья. HP: полные. В рюкзаке — факел.',
    choices: [
      {label: 'Идти в тёмный коридор', next: 'dark', effects: {}},
      {label: 'Поговорить со стражником', next: 'guard', effects: {gold: 5}},
    ],
  },
  guard: {
    text: 'Стражник дал зелье (+8 HP) за честный ответ на загадку.',
    choices: [
      {label: 'Взять зелье и войти', next: 'dark', effects: {hp: 8, item: 'potion'}},
      {label: 'Отказаться и идти с факелом', next: 'dark', effects: {xp: 10}},
    ],
  },
  dark: {
    text: 'В темноте слышен рык. Без факела или зелья больно.',
    needs: null,
    choices: [
      {label: 'Атаковать тенью', next: 'fight', effects: {hp: -6, xp: 15}},
      {label: 'Использовать факел', next: 'safe', effects: {xp: 5}, needsItem: 'torch'},
      {label: 'Выпить зелье и атаковать', next: 'win', effects: {xp: 25}, needsItem: 'potion'},
    ],
  },
  safe: {
    text: 'Факел отпугивает тень. Вы находите артефакт.',
    choices: [{label: 'Забрать артефакт', next: 'win', effects: {gold: 30, xp: 20}}],
  },
  fight: {
    text: 'Бой закончен. Вы живы, но изранены.',
    choices: [{label: 'Отдохнуть у костра', next: 'win', effects: {hp: 5, gold: 10}}],
  },
  win: {
    text: 'Уровень пройден! RPG закрепляет статы, инвентарь и ветвление.',
    end: true,
  },
};

export const ROGUE_EVENTS = [
  {id: 'trap', label: 'Ловушка', risk: 12, text: 'Стрела из стены. -12 HP.'},
  {id: 'heal', label: 'Фонтан', risk: -10, text: 'Глоток воды. +10 HP.'},
  {id: 'gold', label: 'Сундук', risk: 0, text: '+15 золота, но шум привлекает стражу.', gold: 15},
  {id: 'altar', label: 'Алтарь', risk: 6, text: 'Жертва силы ради артефакта. -6 HP, +1 артефакт.'},
  {id: 'empty', label: 'Пустая комната', risk: 0, text: 'Тишина. Следующий этаж ближе.'},
  {id: 'boss', label: 'Мини-босс', risk: 18, text: 'Жёсткий бой. -18 HP, +2 этажа.'},
];

export function rollRogueEvent(seed) {
  const idx = Math.abs(seed) % ROGUE_EVENTS.length;
  return ROGUE_EVENTS[idx];
}

/** Стартовые позиции для пошаговой мини-стратегии (5×5). */
export const TURN_START = {
  player: {r: 4, c: 1, hp: 3},
  enemy: {r: 0, c: 3, hp: 2},
};

export function manhattan(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

export function enemyTurn(player, enemy) {
  if (manhattan(player, enemy) === 1) return {attack: true, enemy};
  const dr = player.r > enemy.r ? 1 : player.r < enemy.r ? -1 : 0;
  const dc = player.c > enemy.c ? 1 : player.c < enemy.c ? -1 : 0;
  let nr = enemy.r;
  let nc = enemy.c;
  if (dr !== 0 && Math.abs(player.r - enemy.r) >= Math.abs(player.c - enemy.c)) {
    nr += dr;
  } else if (dc !== 0) {
    nc += dc;
  } else if (dr !== 0) {
    nr += dr;
  }
  nr = Math.max(0, Math.min(4, nr));
  nc = Math.max(0, Math.min(4, nc));
  if (nr === player.r && nc === player.c) return {attack: true, enemy};
  return {attack: false, enemy: {r: nr, c: nc, hp: enemy.hp}};
}
