import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ENGINE_TIER_LABEL,
  TOOL_GAME_ENGINES,
} from '@/components/shared/kb/toolsGamesData';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const TIERS = Object.keys(ENGINE_TIER_LABEL);

function GameEnginePickerPlayInner() {
  const [tier, setTier] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('unity');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOL_GAME_ENGINES.filter((e) => {
      if (tier !== 'all' && e.tier !== tier) return false;
      if (!q) return true;
      const hay = `${e.name} ${e.lang} ${e.dim} ${e.strength}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tier, query]);

  const engine =
    TOOL_GAME_ENGINES.find((e) => e.id === picked) ?? filtered[0] ?? TOOL_GAME_ENGINES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Подбор игрового движка"
        subtitle="Фильтр по типу проекта — краткие карточки из справочника ниже"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="Название, язык, 2D/3D…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск движка"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {TIERS.map((id) => (
            <button
              key={id}
              type="button"
              className={clsx(toolStyles.chip, tier === id && toolStyles.chipActive)}
              onClick={() => setTier(id)}
            >
              {ENGINE_TIER_LABEL[id]}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Список движков">
            {filtered.length === 0 ? (
              <li style={{padding: '0.5rem', fontSize: '0.8rem', opacity: 0.8}}>
                Нет совпадений — смените фильтр
              </li>
            ) : (
              filtered.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === e.id && styles.treeItemActive)}
                    onClick={() => setPicked(e.id)}
                  >
                    <span>{e.name}</span>
                    <span className={styles.ext}>{e.lang}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{engine.name}</h4>
            <p className={styles.detailRole}>
              {engine.dim} · {engine.lang} · {engine.license}
            </p>
            <p>{engine.strength}</p>
            <a
              href={engine.link}
              target="_blank"
              rel="noopener noreferrer"
              className="it-demo__btn it-demo__btn--primary"
              style={{display: 'inline-block', marginTop: '0.5rem', textDecoration: 'none'}}
            >
              Официальный сайт
            </a>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameEnginePickerPlayInner;
