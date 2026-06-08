import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GAMER_TOOL_CATEGORIES, GAMER_TOOLS} from '@/components/shared/kb/toolsGamesData';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

function GamerToolsExplorerPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('obs');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMER_TOOLS.filter((t) => {
      if (cat !== 'all' && t.cat !== cat) return false;
      if (!q) return true;
      const hay = `${t.name} ${t.note} ${t.os}`.toLowerCase();
      return hay.includes(q);
    });
  }, [cat, query]);

  const tool = GAMER_TOOLS.find((t) => t.id === picked) ?? filtered[0] ?? GAMER_TOOLS[0];
  const catLabel = GAMER_TOOL_CATEGORIES.find((c) => c.id === tool?.cat)?.label ?? '';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Карта инструментов геймера"
        subtitle="Стрим, магазины, Linux, моды — выберите категорию и найдите утилиту"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="OBS, Proton, Discord…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск утилиты"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {GAMER_TOOL_CATEGORIES.map((c) => (
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
          <ul className={styles.tree} aria-label="Список утилит">
            {filtered.length === 0 ? (
              <li style={{padding: '0.5rem', fontSize: '0.8rem', opacity: 0.8}}>Ничего не найдено</li>
            ) : (
              filtered.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === t.id && styles.treeItemActive)}
                    onClick={() => setPicked(t.id)}
                  >
                    <span>{t.name}</span>
                    <span className={styles.ext}>
                      {t.free === true ? 'free' : t.free}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{tool.name}</h4>
            <p className={styles.detailRole}>
              {catLabel} · {tool.os}
            </p>
            <p>{tool.note}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GamerToolsExplorerPlayInner;
