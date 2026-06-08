import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  GENRE_META,
  GENRES,
  RPG_SCENES,
  ROGUE_EVENTS,
  TURN_START,
  THEMES,
  createShuffledPuzzle,
  enemyTurn,
  isPuzzleSolved,
  manhattan,
  rollRogueEvent,
  tryPuzzleMove,
} from '@/components/shared/kb/gameGenreToysEngine';
import styles from '@/components/demos/GameGenreToysPlay.module.css';

const ARCADE_COLS = 9;
const ARCADE_ROWS = 11;
const ARCADE_TICK_MS = 420;

const PLATFORM_LEN = 100;
const PLATFORM_GAP = {from: 42, to: 52};
/** Высота линии земли в % от низа трека (совпадает с градиентом в CSS). */
const PLATFORM_GROUND_BOTTOM = 45;

function ArcadeToy() {
  const [playerC, setPlayerC] = useState(4);
  const [foes, setFoes] = useState([]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState('← → или кнопки. Уворачивайтесь от красных клеток.');
  const tickRef = useRef(0);

  const reset = useCallback(() => {
    setPlayerC(4);
    setFoes([]);
    setScore(0);
    setRunning(true);
    setStatus('Новая партия. Аркада = быстрый game loop.');
    tickRef.current = 0;
  }, []);

  const move = useCallback((delta) => {
    setPlayerC((c) => Math.max(0, Math.min(ARCADE_COLS - 1, c + delta)));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      tickRef.current += 1;
      setScore((s) => s + 1);
      setFoes((prev) => {
        const moved = prev
          .map((f) => ({...f, r: f.r + 1}))
          .filter((f) => f.r < ARCADE_ROWS);
        const spawn =
          tickRef.current % 3 === 0
            ? [...moved, {r: 0, c: Math.floor(Math.random() * ARCADE_COLS)}]
            : moved;
        const hit = spawn.some((f) => f.r === ARCADE_ROWS - 1 && f.c === playerC);
        if (hit) {
          setRunning(false);
          setStatus(`Поражение на ${tickRef.current} тике. Нажмите «Снова».`);
          return spawn;
        }
        return spawn;
      });
    }, ARCADE_TICK_MS);
    return () => window.clearInterval(id);
  }, [running, playerC]);

  const cells = [];
  for (let r = 0; r < ARCADE_ROWS; r += 1) {
    for (let c = 0; c < ARCADE_COLS; c += 1) {
      const isPlayer = r === ARCADE_ROWS - 1 && c === playerC;
      const isFoe = foes.some((f) => f.r === r && f.c === c);
      cells.push(
        <div
          key={`${r}-${c}`}
          className={clsx(
            styles.arcadeCell,
            isPlayer && styles.arcadePlayer,
            isFoe && styles.arcadeFoe,
          )}
        />,
      );
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.score}>Тики: {score}</p>
      <div className={styles.arcadeBoard} role="img" aria-label="Поле аркады">
        {cells}
      </div>
      <div className={styles.controlsRow}>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => move(-1)} disabled={!running}>
          ←
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => move(1)} disabled={!running}>
          →
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={reset}>
          Снова
        </button>
      </div>
      <p className={styles.status}>{status}</p>
    </div>
  );
}

function PlatformerToy() {
  const [x, setX] = useState(8);
  const [y, setY] = useState(0);
  const [vy, setVy] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const onGround = y <= 0.01;

  useEffect(() => {
    if (won || lost) return undefined;
    const id = window.setInterval(() => {
      setVy((v) => {
        const nextVy = v - 0.9;
        setY((py) => {
          const ny = Math.max(0, py + nextVy * 0.12);
          if (ny <= 0) return 0;
          return ny;
        });
        if (v - 0.9 < -2) return -2;
        return nextVy;
      });
      setX((px) => {
        const nx = Math.min(PLATFORM_LEN - 4, px + 0.55);
        const inGap = nx >= PLATFORM_GAP.from && nx <= PLATFORM_GAP.to;
        if (inGap && y < 0.2) {
          setLost(true);
        }
        if (nx >= PLATFORM_LEN - 6) setWon(true);
        return nx;
      });
    }, 50);
    return () => window.clearInterval(id);
  }, [won, lost, y]);

  const jump = () => {
    if (onGround && !won && !lost) setVy(5.5);
  };

  const reset = () => {
    setX(8);
    setY(0);
    setVy(0);
    setWon(false);
    setLost(false);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.platformTrack}>
        <div
          className={styles.platformGap}
          style={{left: `${PLATFORM_GAP.from}%`, width: `${PLATFORM_GAP.to - PLATFORM_GAP.from}%`}}
        />
        <div className={styles.platformGoal} aria-hidden />
        <div
          className={styles.platformHero}
          style={{left: `${x}%`, bottom: `${PLATFORM_GROUND_BOTTOM + y * 28}%`}}
        />
      </div>
      <div className={styles.controlsRow}>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={jump} disabled={won || lost}>
          Прыжок
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
          Снова
        </button>
      </div>
      <p className={styles.status}>
        {won && 'Флаг достигнут — платформер: гравитация + проверка земли.'}
        {lost && 'Провалились в яму. Прыгните через разрыв.'}
        {!won && !lost && 'Герой бежит сам. Прыгайте через тёмную яму.'}
      </p>
    </div>
  );
}

function PuzzleToy() {
  const [board, setBoard] = useState(() => createShuffledPuzzle());
  const [moves, setMoves] = useState(0);
  const solved = isPuzzleSolved(board);

  const click = (idx) => {
    if (solved) return;
    const next = tryPuzzleMove(board, idx);
    if (next !== board) {
      setBoard(next);
      setMoves((m) => m + 1);
    }
  };

  return (
    <div className={styles.panel}>
      <p className={styles.score}>Ходы: {moves}</p>
      <div className={styles.puzzleGrid} role="grid">
        {board.map((n, idx) => (
          <button
            key={idx}
            type="button"
            className={clsx(styles.puzzleTile, n === 0 && styles.puzzleTileEmpty)}
            onClick={() => click(idx)}
            disabled={n === 0 || solved}
          >
            {n || ''}
          </button>
        ))}
      </div>
      <p className={styles.status}>
        {solved ? 'Собрано! Головоломка = детерминированные правила на сетке.' : 'Сдвигайте плитки к пустой клетке.'}
      </p>
      <button
        type="button"
        className="it-demo__btn it-demo__btn--secondary"
        onClick={() => {
          setBoard(createShuffledPuzzle());
          setMoves(0);
        }}
      >
        Перемешать
      </button>
    </div>
  );
}

function TurnBasedToy() {
  const [player, setPlayer] = useState(TURN_START.player);
  const [enemy, setEnemy] = useState(TURN_START.enemy);
  const [phase, setPhase] = useState('player');
  const [status, setStatus] = useState('Кликните клетку рядом с зелёным юнитом — ход или атака.');

  const reset = () => {
    setPlayer(TURN_START.player);
    setEnemy(TURN_START.enemy);
    setPhase('player');
    setStatus('Ваш ход.');
  };

  const onCell = (r, c) => {
    if (phase !== 'player' || player.hp <= 0 || enemy.hp <= 0) return;
    const dist = manhattan(player, {r, c});
      if (dist === 1) {
      const attacking = r === enemy.r && c === enemy.c;
      let nextEnemy = enemy;
      let nextPlayer = player;
      if (attacking) {
        const newHp = enemy.hp - 1;
        nextEnemy = {...enemy, hp: newHp};
        setEnemy(nextEnemy);
        if (newHp <= 0) {
          setStatus('Победа! Пошаговая стратегия: очередь ходов.');
          return;
        }
        setStatus('Попадание! Ход врага.');
      } else {
        nextPlayer = {r, c, hp: player.hp};
        setPlayer(nextPlayer);
        setStatus('Вы переместились. Ход врага.');
      }
      setPhase('enemy');
      window.setTimeout(() => {
        if (nextEnemy.hp <= 0) return;
        const result = enemyTurn(nextPlayer, nextEnemy);
        if (result.attack) {
          const pHp = player.hp - 1;
          setPlayer((p) => ({...p, hp: pHp}));
          setStatus(pHp <= 0 ? 'Поражение.' : 'Враг атаковал! Ваш ход.');
          if (pHp <= 0) return;
        } else {
          setEnemy(result.enemy);
          setStatus('Враг сдвинулся. Ваш ход.');
        }
        setPhase('player');
      }, 500);
    }
  };

  const cells = [];
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      const isP = player.r === r && player.c === c && player.hp > 0;
      const isE = enemy.r === r && enemy.c === c && enemy.hp > 0;
      cells.push(
        <button
          key={`${r}-${c}`}
          type="button"
          className={clsx(
            styles.turnCell,
            isP && styles.turnPlayer,
            isE && styles.turnEnemy,
          )}
          onClick={() => onCell(r, c)}
          aria-label={`Клетка ${r + 1},${c + 1}`}
        />,
      );
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.score}>
        Вы HP {player.hp} · Враг HP {enemy.hp} · {phase === 'player' ? 'ваш ход' : 'ход врага'}
      </p>
      <div className={styles.turnGrid}>{cells}</div>
      <p className={styles.status}>{status}</p>
      <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
        Снова
      </button>
    </div>
  );
}

function RpgToy() {
  const [sceneId, setSceneId] = useState('start');
  const [hero, setHero] = useState({hp: 20, gold: 0, xp: 0, items: ['torch']});

  const scene = RPG_SCENES[sceneId];

  const choose = (choice) => {
    if (choice.needsItem && !hero.items.includes(choice.needsItem)) return;
    const effects = choice.effects ?? {};
    setHero((h) => {
      const items = [...h.items];
      if (effects.item && !items.includes(effects.item)) items.push(effects.item);
      return {
        hp: Math.min(30, Math.max(0, h.hp + (effects.hp ?? 0))),
        gold: h.gold + (effects.gold ?? 0),
        xp: h.xp + (effects.xp ?? 0),
        items,
      };
    });
    setSceneId(choice.next);
  };

  const reset = () => {
    setSceneId('start');
    setHero({hp: 20, gold: 0, xp: 0, items: ['torch']});
  };

  if (!scene) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.stats}>
        <span>HP {hero.hp}</span>
        <span>XP {hero.xp}</span>
        <span>Золото {hero.gold}</span>
        <span>Предметы: {hero.items.join(', ') || '—'}</span>
      </div>
      <p className={styles.status}>{scene.text}</p>
      {scene.end ? (
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={reset}>
          Новый герой
        </button>
      ) : (
        <div className={styles.choices}>
          {(scene.choices ?? []).map((ch) => {
            const blocked = ch.needsItem && !hero.items.includes(ch.needsItem);
            return (
              <button
                key={ch.label}
                type="button"
                className={styles.choiceBtn}
                disabled={blocked}
                onClick={() => choose(ch)}
              >
                {ch.label}
                {blocked && ' (нужен предмет)'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RoguelikeToy() {
  const [floor, setFloor] = useState(1);
  const [hp, setHp] = useState(30);
  const [gold, setGold] = useState(0);
  const [artifacts, setArtifacts] = useState(0);
  const [log, setLog] = useState(['Этаж 1. Выберите дверь — правила скрыты до входа.']);
  const [seed, setSeed] = useState(1);
  const [dead, setDead] = useState(false);

  const enter = () => {
    if (dead) return;
    const event = rollRogueEvent(seed + floor);
    const nextHp = Math.max(0, Math.min(40, hp - event.risk));
    const nextGold = gold + (event.gold ?? 0);
    const nextArt = artifacts + (event.id === 'altar' ? 1 : 0);
    const nextFloor = floor + (event.id === 'boss' ? 2 : 1);
    setHp(nextHp);
    setGold(nextGold);
    setArtifacts(nextArt);
    setFloor(nextFloor);
    setSeed((s) => s + 7);
    setLog((prev) => [`Этаж ${nextFloor}: ${event.text}`, ...prev].slice(0, 6));
    if (nextHp <= 0) setDead(true);
  };

  const reset = () => {
    setFloor(1);
    setHp(30);
    setGold(0);
    setArtifacts(0);
    setLog(['Новый забег. Permadeath включён.']);
    setSeed(1);
    setDead(false);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.stats}>
        <span>Этаж {floor}</span>
        <span>HP {hp}</span>
        <span>Золото {gold}</span>
        <span>Артефакты {artifacts}</span>
      </div>
      <div className={styles.choices}>
        {ROGUE_EVENTS.slice(0, 3).map((ev, i) => (
          <button
            key={ev.id}
            type="button"
            className={styles.choiceBtn}
            disabled={dead}
            onClick={enter}
          >
            Дверь {i + 1} — {ev.label}
          </button>
        ))}
      </div>
      <div className={styles.panel}>
        {log.map((line, i) => (
          <p key={i} className={styles.status} style={{margin: 0, fontSize: '0.82rem'}}>
            {line}
          </p>
        ))}
      </div>
      {dead ? (
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={reset}>
          Новый забег
        </button>
      ) : (
        <p className={styles.status}>Событие случайное — как procgen в roguelike.</p>
      )}
    </div>
  );
}

function GenreBody({genre}) {
  switch (genre) {
    case 'arcade':
      return <ArcadeToy />;
    case 'platformer':
      return <PlatformerToy />;
    case 'puzzle':
      return <PuzzleToy />;
    case 'turnbased':
      return <TurnBasedToy />;
    case 'rpg':
      return <RpgToy />;
    case 'roguelike':
      return <RoguelikeToy />;
    default:
      return <ArcadeToy />;
  }
}

export function GameGenreToyPlayInner({
  genre = 'arcade',
  theme = 'javascript',
  showTabs = false,
  genres: genresProp,
}) {
  const genreList = genresProp ?? GENRES;
  const [active, setActive] = useState(genreList.includes(genre) ? genre : genreList[0]);
  const current = showTabs ? active : genre;
  const meta = GENRE_META[current] ?? GENRE_META.arcade;
  const themeData = THEMES[theme] ?? THEMES.javascript;

  return (
    <DemoShell className={styles.root} style={{'--genre-accent': meta.accent ?? themeData.accent}}>
      <DemoCard
        title={`Жанр: ${meta.label}`}
        subtitle={`${meta.subtitle} · эталоны: ${meta.refs}`}
      >
        {showTabs && genreList.length > 1 && (
          <div className={styles.hubTabs} role="tablist">
            {genreList.map((g) => (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={active === g}
                className={clsx(styles.hubTab, active === g && styles.hubTabActive)}
                onClick={() => setActive(g)}
              >
                {GENRE_META[g]?.label ?? g}
              </button>
            ))}
          </div>
        )}
        <div className={styles.metaRow}>
          <span className={styles.badge}>Закрепляет: {meta.skill}</span>
          {themeData.label && <span className={styles.badge}>{themeData.label}</span>}
        </div>
        <div className={styles.layout}>
          <GenreBody genre={current} />
        </div>
      </DemoCard>
    </DemoShell>
  );
}

/** Одна мини-игра по жанру. */
export default function GameGenreToyPlay(props) {
  return <GameGenreToyPlayInner/>;
}

/** Вкладки с жанрами — для глав про классификацию и геймдев. */
export function GameGenreToysHubInner({theme = 'javascript', genres = GENRES}) {
  return (
    <GameGenreToyPlayInner theme={theme} genres={genres} genre={genres[0]} showTabs />
  );
}

export function GameGenreToysHub(props) {
  return <GameGenreToysHubInner {...props} />;
}
