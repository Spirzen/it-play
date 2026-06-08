import React, {useCallback, useMemo, useState} from 'react';

import Link from '@/components/shared/KbLink';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {FRANCHISES, GENRES} from '@/components/shared/kb/gameFranchiseData';
import styles from '@/components/demos/gameStudiesPlays.module.css';

function pickRandomFranchise(list, current) {
  if (list.length <= 1) return list[0] ?? null;
  let next = list[Math.floor(Math.random() * list.length)];
  let guard = 0;
  while (current && next.id === current.id && guard < 12) {
    next = list[Math.floor(Math.random() * list.length)];
    guard += 1;
  }
  return next;
}

function GameStudiesHubInner() {
  const [genre, setGenre] = useState('all');
  const [randomPick, setRandomPick] = useState(null);

  const filtered = useMemo(
    () =>
      genre === 'all' ? FRANCHISES : FRANCHISES.filter((f) => f.genre === genre),
    [genre],
  );

  const onRandom = useCallback(() => {
    setRandomPick(pickRandomFranchise(filtered, randomPick));
  }, [filtered, randomPick]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Игроведение — каталог серий"
        subtitle="25 франшиз раздела: фильтр по жанру, случайная серия, переход к статье"
      >
        <div className={styles.hubFilters}>
          {GENRES.map((g) => (
            <button
              key={g.id}
              type="button"
              className={clsx(styles.tab, genre === g.id && styles.tabActive)}
              onClick={() => setGenre(g.id)}
            >
              {g.label}
            </button>
          ))}
          <span className={styles.hint} style={{margin: 0}}>
            {filtered.length} {filtered.length === 1 ? 'серия' : filtered.length < 5 ? 'серии' : 'серий'}
          </span>
        </div>

        <div className={styles.randomRow}>
          <div>
            <p className={styles.randomTitle}>
              {randomPick ? (
                <>
                  {randomPick.icon} {randomPick.title}
                </>
              ) : (
                'Случайная серия'
              )}
            </p>
            {randomPick && (
              <span className={styles.hint}>
                {randomPick.studio} · с {randomPick.yearStart}
              </span>
            )}
          </div>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={onRandom}>
            Бросить кубик
          </button>
          {randomPick && (
            <Link className="it-demo__btn" to={randomPick.doc}>
              Открыть статью →
            </Link>
          )}
        </div>

        <div className={styles.hubGrid}>
          {filtered.map((f) => (
            <Link key={f.id} to={f.doc} className={styles.franchiseCard}>
              <span className={styles.franchiseIcon}>{f.icon}</span>
              <p className={styles.franchiseTitle}>{f.title}</p>
              <span className={styles.franchiseMeta}>
                {f.studio} · {f.yearStart}
              </span>
            </Link>
          ))}
        </div>

        <p className={styles.hint}>
          В каждой статье серии — интерактив: хронология релизов, механики и (у части франшиз)
          уникальный режим.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GameStudiesHubInner;
