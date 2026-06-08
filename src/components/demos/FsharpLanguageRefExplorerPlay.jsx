import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {FSHARP_LANGUAGE_REF_CATALOG} from '@/components/shared/kb/fsharpLanguageRefCatalog';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const TOP_SECTIONS = [
  {id: 'all', label: 'Все'},
  {id: 'types', label: 'Типы', match: /тип|коллекц|кортеж|запис|объединен|option|массив|список/i},
  {id: 'functions', label: 'Функции', match: /функц|значен|let|лямбда|match|шаблон/i},
  {id: 'async', label: 'Async / task', match: /async|task|lazy|вычислит|query/i},
  {id: 'oop', label: 'ООП', match: /класс|интерфейс|наслед|объект|делегат|член/i},
  {id: 'compiler', label: 'Компилятор', match: /компилятор|ключев|символ|директив|атрибут/i},
];

function matchesSection(entry, sectionId) {
  if (sectionId === 'all') return true;
  const rule = TOP_SECTIONS.find((s) => s.id === sectionId);
  if (!rule?.match) return true;
  const blob = `${entry.trail} ${entry.title}`.toLowerCase();
  return rule.match.test(blob);
}

function FsharpLanguageRefExplorerPlayInner() {
  const [section, setSection] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(FSHARP_LANGUAGE_REF_CATALOG.entries[0]?.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FSHARP_LANGUAGE_REF_CATALOG.entries.filter((entry) => {
      if (!matchesSection(entry, section)) return false;
      if (!q) return true;
      const blob = `${entry.title} ${entry.trail}`.toLowerCase();
      return blob.includes(q);
    });
  }, [section, query]);

  const item =
    FSHARP_LANGUAGE_REF_CATALOG.entries.find((e) => e.id === picked) ?? filtered[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Справочник языка F# (Microsoft Learn)"
        subtitle={`${FSHARP_LANGUAGE_REF_CATALOG.entryCount} разделов · синтаксис, типы, async, компилятор`}
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem', flexWrap: 'wrap'}}>
          {TOP_SECTIONS.map((s) => (
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
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="match, async, discriminated union, type provider…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по справочнику F#"
        />
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Разделы справочника F#">
            {filtered.length === 0 ? (
              <li className={styles.detailRole}>Ничего не найдено — смените фильтр или запрос.</li>
            ) : (
              filtered.slice(0, 120).map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === entry.id && styles.treeItemActive)}
                    onClick={() => setPicked(entry.id)}
                  >
                    <span>{entry.title}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            {item ? (
              <>
                <h4 className={styles.detailTitle}>{item.title}</h4>
                {item.trail ? <p className={styles.detailRole}>{item.trail}</p> : null}
                <p>
                  Официальное описание синтаксиса и семантики F# — на странице Microsoft Learn (русская
                  локализация, где доступна).
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="it-demo__btn it-demo__btn--primary"
                  style={{display: 'inline-block', marginTop: '0.65rem', textDecoration: 'none'}}
                >
                  Открыть раздел ↗
                </a>
                <a
                  href={FSHARP_LANGUAGE_REF_CATALOG.learnIndex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="it-demo__btn"
                  style={{display: 'inline-block', marginTop: '0.5rem', marginLeft: '0.35rem', textDecoration: 'none'}}
                >
                  Весь справочник ↗
                </a>
              </>
            ) : (
              <p className={styles.detailRole}>Выберите раздел в списке.</p>
            )}
          </div>
        </div>
        {filtered.length > 120 ? (
          <p className={styles.detailRole} style={{marginTop: '0.5rem'}}>
            Показаны первые 120 из {filtered.length} совпадений — уточните поиск.
          </p>
        ) : null}
      </DemoCard>
    </DemoShell>
  );
}

export default FsharpLanguageRefExplorerPlayInner;
