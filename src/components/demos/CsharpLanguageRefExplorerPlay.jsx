import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {CSHARP_LANGUAGE_REF_CATALOG} from '@/components/shared/kb/csharpLanguageRefCatalog';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const TOP_SECTIONS = [
  {id: 'all', label: 'Все'},
  {id: 'types', label: 'Типы', match: /тип|встроен|nullable|кортеж|массив|коллекц/i},
  {id: 'keywords', label: 'Ключевые слова', match: /ключев|модификатор|namespace|using/i},
  {id: 'operators', label: 'Операторы', match: /оператор|выражен|pattern|лямбда/i},
  {id: 'statements', label: 'Операторы языка', match: /инструкц|исключен|итерац|выбор|переход/i},
  {id: 'compiler', label: 'Компилятор', match: /компилятор|cs\d|предупрежд|ошибк|параметр/i},
];

function matchesSection(entry, sectionId) {
  if (sectionId === 'all') return true;
  const rule = TOP_SECTIONS.find((s) => s.id === sectionId);
  if (!rule?.match) return true;
  const blob = `${entry.trail} ${entry.title}`.toLowerCase();
  return rule.match.test(blob);
}

function CsharpLanguageRefExplorerPlayInner() {
  const [section, setSection] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(
    CSHARP_LANGUAGE_REF_CATALOG.entries.find((e) => e.title.includes('Обзор'))?.id ??
      CSHARP_LANGUAGE_REF_CATALOG.entries[0]?.id,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CSHARP_LANGUAGE_REF_CATALOG.entries.filter((entry) => {
      if (!matchesSection(entry, section)) return false;
      if (!q) return true;
      const blob = `${entry.title} ${entry.trail}`.toLowerCase();
      return blob.includes(q);
    });
  }, [section, query]);

  const item =
    CSHARP_LANGUAGE_REF_CATALOG.entries.find((e) => e.id === picked) ?? filtered[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Справочник языка C# (Microsoft Learn)"
        subtitle={`${CSHARP_LANGUAGE_REF_CATALOG.entryCount} разделов · синтаксис, операторы, компилятор`}
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
          placeholder="async, record, nullable, CS8600…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по справочнику C#"
        />
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Разделы справочника C#">
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
                  Официальное описание синтаксиса, семантики и сообщений компилятора — на странице Microsoft
                  Learn (русская локализация, где доступна).
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
                  href={CSHARP_LANGUAGE_REF_CATALOG.learnIndex}
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

export default CsharpLanguageRefExplorerPlayInner;
