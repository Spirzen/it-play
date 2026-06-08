import React, {useMemo, useState} from 'react';

import Link from '@/components/shared/KbLink';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';
import {
  LEARN_FILTERS,
  LEARN_LEVELS,
  MICROSOFT_LEARN_ITEMS,
  TYPE_LABELS,
  formatDuration,
} from '@/components/shared/kb/microsoftLearnCatalog';

function MicrosoftLearnExplorerPlayInner() {
  const [section, setSection] = useState('all');
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(MICROSOFT_LEARN_ITEMS[0]?.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MICROSOFT_LEARN_ITEMS.filter((item) => {
      if (section !== 'all' && item.section !== section) return false;
      if (level !== 'all' && item.level !== level) return false;
      if (!q) return true;
      const blob = `${item.title} ${item.summary} ${item.product} ${item.role} ${TYPE_LABELS[item.type]}`.toLowerCase();
      return blob.includes(q);
    });
  }, [section, level, query]);

  const item =
    MICROSOFT_LEARN_ITEMS.find((i) => i.id === picked) ?? filtered[0] ?? MICROSOFT_LEARN_ITEMS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Навигатор Microsoft Learn"
        subtitle="Курируемые схемы и модули с привязкой к разделам Вселенной IT"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="Azure, C#, Power BI, Playwright…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по каталогу Learn"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {LEARN_FILTERS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, section === s.id && toolStyles.chipActive)}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {LEARN_LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(toolStyles.chip, level === l.id && toolStyles.chipActive)}
              onClick={() => setLevel(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Список материалов Learn">
            {filtered.length === 0 ? (
              <li className={styles.detailRole}>Ничего не найдено — смените фильтр или запрос.</li>
            ) : (
              filtered.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === r.id && styles.treeItemActive)}
                    onClick={() => setPicked(r.id)}
                  >
                    <span>{r.title}</span>
                    <span className={styles.ext}>{formatDuration(r.durationMin)}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          {item && (
            <div className={styles.detail}>
              <h4 className={styles.detailTitle}>{item.title}</h4>
              <p className={styles.detailRole}>
                {TYPE_LABELS[item.type]} · {item.product} · {item.role} ·{' '}
                {LEARN_LEVELS.find((l) => l.id === item.level)?.label ?? item.level}
              </p>
              <p>{item.summary}</p>
              <p className={styles.detailRole}>
                В энциклопедии:{' '}
                <Link to={item.encyclopedia}>открыть связанную главу</Link>
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="it-demo__btn it-demo__btn--primary"
                style={{display: 'inline-block', marginTop: '0.65rem', textDecoration: 'none'}}
              >
                Открыть на Microsoft Learn ↗
              </a>
            </div>
          )}
        </div>
        <p className={styles.detailRole} style={{marginTop: '0.75rem'}}>
          Полный каталог (~4 600 элементов):{' '}
          <a href="https://learn.microsoft.com/ru-ru/training/browse/" target="_blank" rel="noopener noreferrer">
            learn.microsoft.com/training/browse
          </a>
          . Метаданные для интеграций: Catalog API.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MicrosoftLearnExplorerPlayInner;
