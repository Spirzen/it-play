import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  GEM_LABELS,
  applyGravity,
  clearCells,
  createInitialGrid,
  findMatchCells,
  isAdjacent,
  swapCells,
} from '@/components/shared/kb/matchThreeEngine';
import styles from '@/components/demos/MatchThreePlay.module.css';

const LOOP_STEPS = [
  {id: 'input', label: '1. Ввод', hint: 'клик по клетке'},
  {id: 'logic', label: '2. Логика', hint: 'правила и совпадения'},
  {id: 'render', label: '3. Отрисовка', hint: 'обновление поля'},
];

const PHASE_IDLE = 'idle';
const ANIM_SWAP_MS = 220;
const ANIM_MATCH_MS = 380;
const ANIM_FALL_MS = 320;

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function MatchThreePlayInner() {
  const [grid, setGrid] = useState(() => createInitialGrid());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(PHASE_IDLE);
  const [matchCells, setMatchCells] = useState([]);
  const [status, setStatus] = useState('Выберите камень, затем соседний — поменяйте их местами.');
  const runId = useRef(0);

  const setLoopPhase = useCallback((next) => {
    setPhase(next);
  }, []);

  useEffect(() => {
    if (phase === PHASE_IDLE) return undefined;
    const id = window.setTimeout(() => setPhase(PHASE_IDLE), 900);
    return () => window.clearTimeout(id);
  }, [phase]);

  const resolveMatches = useCallback(async (currentGrid, token) => {
    let board = currentGrid;
    let total = 0;

    for (;;) {
      const cells = findMatchCells(board);
      if (!cells.length) break;

      total += cells.length;
      setMatchCells(cells);
      setLoopPhase('logic');
      setStatus(`Логика: ${cells.length} клеток в ряд — убираем и считаем очки.`);
      await delay(ANIM_MATCH_MS);
      if (runId.current !== token) return board;

      board = clearCells(board, cells);
      setGrid(board);
      setMatchCells([]);
      setLoopPhase('render');
      await delay(ANIM_FALL_MS);
      if (runId.current !== token) return board;

      board = applyGravity(board);
      setGrid(board);
      setStatus('Отрисовка: камни падают, пустоты заполняются.');
      await delay(ANIM_FALL_MS);
      if (runId.current !== token) return board;
    }

    if (total > 0) {
      setScore((s) => s + total);
      setStatus(`Серия завершена: +${total} очков.`);
    }
    return board;
  }, [setLoopPhase]);

  const trySwap = useCallback(
    async (from, to) => {
      const token = ++runId.current;
      setBusy(true);
      setSelected(null);
      setLoopPhase('logic');
      setStatus('Логика: проверяем, есть ли три в ряд после обмена.');

      let board = swapCells(grid, from.r, from.c, to.r, to.c);
      setGrid(board);
      await delay(ANIM_SWAP_MS);
      if (runId.current !== token) return;

      const matches = findMatchCells(board);
      if (!matches.length) {
        setStatus('Хода нет — возвращаем камни на место.');
        board = swapCells(board, from.r, from.c, to.r, to.c);
        setGrid(board);
        await delay(ANIM_SWAP_MS);
        setBusy(false);
        setLoopPhase('render');
        return;
      }

      await resolveMatches(board, token);
      if (runId.current === token) {
        setBusy(false);
        setLoopPhase('render');
      }
    },
    [grid, resolveMatches, setLoopPhase],
  );

  const onCellClick = (r, c) => {
    if (busy) return;

    if (!selected) {
      setLoopPhase('input');
      setSelected({r, c});
      setStatus('Ввод: выбрана клетка — укажите соседнюю для обмена.');
      return;
    }

    if (selected.r === r && selected.c === c) {
      setSelected(null);
      setStatus('Выбор снят.');
      return;
    }

    if (!isAdjacent(selected.r, selected.c, r, c)) {
      setLoopPhase('input');
      setSelected({r, c});
      setStatus('Ввод: выберите соседнюю клетку (вверх, вниз, влево или вправо).');
      return;
    }

    trySwap(selected, {r, c});
  };

  const resetGame = () => {
    runId.current += 1;
    setGrid(createInitialGrid());
    setSelected(null);
    setScore(0);
    setBusy(false);
    setMatchCells([]);
    setStatus('Новая партия. Соберите три одинаковых камня в ряд.');
    setLoopPhase('render');
  };

  const matchSet = new Set(matchCells.map(([mr, mc]) => `${mr},${mc}`));

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Мини-игра &quot;три в ряд&quot;"
        subtitle="Простой пример видеоигры: клик — ввод, проверка совпадений — логика, сетка на экране — отрисовка. Так крутится игровой цикл."
      >
        <div className={styles.layout}>
          <div>
            <div className={styles.stats}>
              <span className={styles.stat}>
                Очки: <strong>{score}</strong>
              </span>
            </div>

            <div className={styles.boardWrap}>
              <div
                className={styles.board}
                role="grid"
                aria-label="Поле три в ряд, 8 на 8"
              >
                {grid.map((row, r) =>
                  row.map((kind, c) => {
                    const key = `${r}-${c}`;
                    const isSelected = selected?.r === r && selected?.c === c;
                    const isMatch = matchSet.has(`${r},${c}`);
                    return (
                      <button
                        key={key}
                        type="button"
                        className={clsx(
                          styles.cell,
                          styles[`kind${kind}`],
                          isSelected && styles.cellSelected,
                          isMatch && styles.cellMatch,
                        )}
                        disabled={busy}
                        aria-label={`Клетка ${r + 1}, ${c + 1}`}
                        aria-pressed={isSelected}
                        onClick={() => onCellClick(r, c)}
                      >
                        {GEM_LABELS[kind]}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>

            <p className={styles.hint}>
              Обменивайте только соседние камни. Если линии из трёх не получилось — ход отменяется.
            </p>
            <p className={styles.status} aria-live="polite">
              {status}
            </p>

            <div className="it-demo__actions" style={{marginTop: '0.75rem'}}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary"
                onClick={resetGame}
                disabled={busy}
              >
                Новая партия
              </button>
            </div>
          </div>

          <aside className={styles.loopPanel} aria-label="Фазы игрового цикла">
            <p className={styles.loopTitle}>Игровой цикл</p>
            {LOOP_STEPS.map((step, i) => (
              <React.Fragment key={step.id}>
                {i > 0 && <div className={styles.loopArrow}>↓</div>}
                <div
                  className={clsx(styles.loopStep, phase === step.id && styles.loopStepActive)}
                  title={step.hint}
                >
                  <span>{step.label}</span>
                </div>
              </React.Fragment>
            ))}
            <div className={styles.loopArrow}>↻ снова</div>
          </aside>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MatchThreePlayInner;
