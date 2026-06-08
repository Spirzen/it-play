import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {demoSkeletonFallback} from '@/components/shared/demoFallback';
import styles from '@/components/shared/kb/articleWidgets.module.css';

const GENRE_PRESETS = [
  {id: 'all', label: 'Все', terms: []},
  {
    id: 'rpg',
    label: 'RPG',
    terms: [
      'witcher',
      'elder',
      'skyrim',
      'fallout',
      'mass effect',
      'baldur',
      'dragon',
      'diablo',
      'divinity',
      'kingdom come',
    ],
  },
  {
    id: 'strategy',
    label: 'Стратегия',
    terms: [
      'empire',
      'civilization',
      'crusader',
      'total war',
      'anno',
      'stronghold',
      'heroes',
      'europa',
      'frostpunk',
      'they are billions',
    ],
  },
  {
    id: 'shooter',
    label: 'Шутер',
    terms: [
      'doom',
      'call of duty',
      'battlefield',
      'halo',
      'counter',
      'quake',
      'wolfenstein',
      'titanfall',
      'metro',
      'borderlands',
    ],
  },
  {
    id: 'horror',
    label: 'Хоррор',
    terms: [
      'resident evil',
      'dead space',
      'evil within',
      'alien',
      'outlast',
      'phasmophobia',
      'blasphemous',
      'curse of the dead',
    ],
  },
  {
    id: 'indie',
    label: 'Инди',
    terms: [
      'hades',
      'hollow knight',
      'stardew',
      'cuphead',
      'vampire survivors',
      'dead cells',
      'celeste',
      'stray',
      'cult of the lamb',
      'brotato',
    ],
  },
  {
    id: 'coop',
    label: 'Кооп',
    terms: [
      'left 4 dead',
      'helldivers',
      'deep rock',
      'back 4 blood',
      'borderlands',
      'payday',
      'warhammer vermintide',
      'world war z',
      'among us',
    ],
  },
];

function pickRandom(items) {
  if (!items?.length) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
}

function pickRandomDifferent(items, current, isSame = (a, b) => a === b) {
  if (!items?.length) {
    return null;
  }
  if (items.length === 1) {
    return items[0];
  }
  let next = current;
  let guard = 0;
  while (isSame(next, current) && guard < 20) {
    next = pickRandom(items);
    guard += 1;
  }
  return next;
}

function titleMatchesTerms(title, terms) {
  const normalized = title.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function titleMatchesQuery(title, query) {
  const normalized = title.toLowerCase();
  const parts = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return true;
  }
  if (parts.length === 1) {
    return normalized.includes(parts[0]);
  }
  return parts.every((part) => normalized.includes(part));
}

export default function RandomGameGenerator({games: initialGames = []}) {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState('');
  const [presetId, setPresetId] = useState('all');
  const [selected, setSelected] = useState(null);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState(false);

  const activePreset = GENRE_PRESETS.find((p) => p.id === presetId) ?? GENRE_PRESETS[0];

  useEffect(() => {
    if (initialGames?.length) {
      setGames(initialGames);
      setReady(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(timer);
  }, [initialGames]);

  const filtered = useMemo(() => {
    let pool = games;
    if (activePreset.terms.length) {
      pool = pool.filter((g) => titleMatchesTerms(g.title, activePreset.terms));
    }
    if (query.trim()) {
      pool = pool.filter((g) => titleMatchesQuery(g.title, query));
    }
    return pool;
  }, [games, query, activePreset]);

  const pickGame = useCallback(() => {
    const pool = filtered.length ? filtered : games;
    if (!pool.length) {
      return;
    }
    setFading(true);
    window.setTimeout(() => {
      const next =
        selected == null
          ? pickRandom(pool)
          : pickRandomDifferent(
              pool,
              selected,
              (a, b) => a?.href === b?.href && a?.title === b?.title,
            );
      setSelected(next);
      setFading(false);
    }, 200);
  }, [filtered, games, selected]);

  const applyPreset = (id) => {
    setPresetId(id);
    setQuery('');
    setSelected(null);
  };

  if (!ready) {
    return demoSkeletonFallback();
  }

  const empty = games.length === 0;
  const filterBlocked = Boolean((query.trim() || activePreset.terms.length) && !filtered.length);

  return (
    <DemoShell>
      <DemoCard
        title="Генератор случайной игры"
        subtitle="Жанровые фильтры, поиск по названию и случайный выбор из каталога на странице"
      >
        {!empty && (
          <span className={styles.poolBadge}>
            В базе: {games.length}{' '}
            {games.length === 1 ? 'игра' : games.length < 5 ? 'игры' : 'игр'}
            {activePreset.terms.length || query.trim()
              ? ` · в фильтре: ${filtered.length}`
              : ''}
          </span>
        )}

        <div className={styles.filterChips} role="group" aria-label="Быстрый фильтр по жанру">
          {GENRE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={clsx(
                styles.filterChip,
                presetId === preset.id && styles.filterChipActive,
              )}
              onClick={() => applyPreset(preset.id)}
              disabled={empty}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder={
            activePreset.terms.length
              ? `Поиск внутри "${activePreset.label}"…`
              : 'Фильтр по названию…'
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          disabled={empty}
          aria-label="Фильтр игр"
        />

        <div
          className={clsx(styles.gameResult, fading && styles.gameResultFading)}
          aria-live="polite"
        >
          {empty ? (
            <span className={styles.gamePlaceholder}>
              Список игр не найден — добавьте ссылки на магазины в статью.
            </span>
          ) : selected ? (
            selected.href ? (
              <a href={selected.href} target="_blank" rel="noopener noreferrer">
                {selected.title}
              </a>
            ) : (
              selected.title
            )
          ) : (
            <span className={styles.gamePlaceholder}>Нажмите кнопку, чтобы выбрать игру</span>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={pickGame}
            disabled={empty || filterBlocked}
            aria-label="Случайная игра"
          >
            {selected ? 'Другая игра' : 'Случайная игра'}
          </button>
          {selected?.href && (
            <a
              href={selected.href}
              target="_blank"
              rel="noopener noreferrer"
              className="it-demo__btn"
              style={{textDecoration: 'none'}}
            >
              В магазин
            </a>
          )}
        </div>

        <p className={styles.footnote}>
          Ссылки берутся из списка ниже · Steam и Nintendo · жанровые кнопки сужают выбор по
          названию
        </p>
      </DemoCard>
    </DemoShell>
  );
}
