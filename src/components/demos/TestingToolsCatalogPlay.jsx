import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {TEST_TOOL_FILTERS, TEST_TOOLS} from '@/components/shared/kb/toolsTestingData';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

function TestingToolsCatalogPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('pytest');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEST_TOOLS.filter((t) => {
      if (cat !== 'all' && t.cat !== cat) return false;
      if (!q) return true;
      return `${t.name} ${t.note} ${t.lang}`.toLowerCase().includes(q);
    });
  }, [cat, query]);

  const tool = TEST_TOOLS.find((t) => t.id === picked) ?? filtered[0] ?? TEST_TOOLS[0];
  const catLabel = TEST_TOOL_FILTERS.find((c) => c.id === tool?.cat)?.label ?? '';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Карта инструментов тестирования"
        subtitle="Unit → integration → E2E, статика, нагрузка и моки"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="pytest, Playwright, k6…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск инструмента"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {TEST_TOOL_FILTERS.map((c) => (
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
          <ul className={styles.tree} aria-label="Инструменты">
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
                    <span className={styles.ext}>{t.lang}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{tool.name}</h4>
            <p className={styles.detailRole}>
              {catLabel} · {tool.lang}
            </p>
            <p>{tool.note}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default TestingToolsCatalogPlayInner;
