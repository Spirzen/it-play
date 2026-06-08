/** Минимальный движок "три в ряд" для учебного демо. */

export const GRID_SIZE = 8;
export const GEM_KINDS = 5;

export const GEM_LABELS = ['●', '◆', '▲', '■', '★'];

function randomGem() {
  return Math.floor(Math.random() * GEM_KINDS);
}

export function createInitialGrid() {
  let grid;
  do {
    grid = Array.from({length: GRID_SIZE}, () =>
      Array.from({length: GRID_SIZE}, randomGem),
    );
  } while (findMatchCells(grid).length > 0);
  return grid;
}

/** Координаты [row, col] всех клеток в линиях из 3+ одинаковых камней. */
export function findMatchCells(grid) {
  const key = (r, c) => `${r},${c}`;
  const matched = new Set();

  for (let r = 0; r < GRID_SIZE; r++) {
    let run = 1;
    for (let c = 1; c <= GRID_SIZE; c++) {
      const same =
        c < GRID_SIZE && grid[r][c] != null && grid[r][c] === grid[r][c - 1];
      if (same) {
        run += 1;
      } else {
        if (run >= 3) {
          for (let k = 0; k < run; k++) matched.add(key(r, c - 1 - k));
        }
        run = 1;
      }
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let run = 1;
    for (let r = 1; r <= GRID_SIZE; r++) {
      const same =
        r < GRID_SIZE && grid[r][c] != null && grid[r][c] === grid[r - 1][c];
      if (same) {
        run += 1;
      } else {
        if (run >= 3) {
          for (let k = 0; k < run; k++) matched.add(key(r - 1 - k, c));
        }
        run = 1;
      }
    }
  }

  return [...matched].map((s) => s.split(',').map(Number));
}

export function swapCells(grid, r1, c1, r2, c2) {
  const next = grid.map((row) => [...row]);
  const tmp = next[r1][c1];
  next[r1][c1] = next[r2][c2];
  next[r2][c2] = tmp;
  return next;
}

export function clearCells(grid, cells) {
  const next = grid.map((row) => [...row]);
  cells.forEach(([r, c]) => {
    next[r][c] = null;
  });
  return next;
}

export function applyGravity(grid) {
  const next = grid.map((row) => [...row]);
  for (let c = 0; c < GRID_SIZE; c++) {
    const stack = [];
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      if (next[r][c] != null) stack.push(next[r][c]);
    }
    while (stack.length < GRID_SIZE) stack.push(randomGem());
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      next[r][c] = stack[GRID_SIZE - 1 - r];
    }
  }
  return next;
}

export function isAdjacent(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}
