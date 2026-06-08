import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GAME_STORE_CATEGORIES, GAME_STORES} from '@/components/shared/kb/toolsGamesData';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

function GameStoreExplorerPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('steam');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAME_STORES.filter((s) => {
      if (cat !== 'all' && s.cat !== cat) return false;
      if (!q) return true;
      const hay = `${s.name} ${s.note} ${s.drm}`.toLowerCase();
      return hay.includes(q);
    });
  }, [cat, query]);

  const store = GAME_STORES.find((s) => s.id === picked) ?? filtered[0] ?? GAME_STORES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Ландшафт игровых магазинов"
        subtitle="Лаунчеры, консоли, ключи и облако — сравните DRM и назначение"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="Steam, Game Pass, itch…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск магазина"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {GAME_STORE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(toolStyles.chip, cat === c.id && toolStyles.chipActive)}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Список магазинов">
            {filtered.length === 0 ? (
              <li style={{padding: '0.5rem', fontSize: '0.8rem', opacity: 0.8}}>Ничего не найдено</li>
            ) : (
              filtered.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === s.id && styles.treeItemActive)}
                    onClick={() => setPicked(s.id)}
                  >
                    <span>{s.name}</span>
                    <span className={styles.ext}>{s.drm}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{store.name}</h4>
            <p className={styles.detailRole}>
              DRM: {store.drm} · регион: {store.region}
            </p>
            <p>{store.note}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameStoreExplorerPlayInner;
