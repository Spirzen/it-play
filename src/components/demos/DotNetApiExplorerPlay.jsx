import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {DOTNET_API_CATALOG} from '@/components/shared/kb/dotnetApiCatalog';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const FRAMEWORK_ORDER = ['net-10.0', 'netframework-4.8', 'netframework-4.8.1'];

function DotNetApiExplorerPlayInner() {
  const [frameworkId, setFrameworkId] = useState('net-10.0');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('System');

  const framework = DOTNET_API_CATALOG.frameworks[frameworkId];
  const namespaces = framework?.namespaces ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return namespaces;
    return namespaces.filter((ns) => ns.name.toLowerCase().includes(q));
  }, [namespaces, query]);

  const item =
    filtered.find((ns) => ns.name === picked) ??
    filtered[0] ??
    namespaces.find((ns) => ns.name === 'System') ??
    namespaces[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Навигатор .NET API"
        subtitle={`${framework?.namespaceCount ?? 0} пространств имён · ${framework?.typeCount ?? 0} типов · источник Microsoft Learn`}
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {FRAMEWORK_ORDER.map((id) => {
            const fw = DOTNET_API_CATALOG.frameworks[id];
            if (!fw) return null;
            return (
              <button
                key={id}
                type="button"
                className={clsx(toolStyles.chip, frameworkId === id && toolStyles.chipActive)}
                onClick={() => {
                  setFrameworkId(id);
                  setPicked('System');
                  setQuery('');
                }}
              >
                {fw.label}
              </button>
            );
          })}
        </div>
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="System.Collections, HttpClient, Task…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по пространству имён"
        />
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Пространства имён .NET API">
            {filtered.length === 0 ? (
              <li className={styles.detailRole}>Ничего не найдено — измените запрос.</li>
            ) : (
              filtered.map((ns) => (
                <li key={ns.name}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === ns.name && styles.treeItemActive)}
                    onClick={() => setPicked(ns.name)}
                  >
                    <span>{ns.name}</span>
                    <span className={styles.ext}>{ns.types}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            {item ? (
              <>
                <h4 className={styles.detailTitle}>{item.name}</h4>
                <p className={styles.detailRole}>
                  Типов в каталоге: {item.types} · платформа: {framework?.label}
                </p>
                <p>
                  Полные сигнатуры, члены, примеры и заметки о совместимости — на официальной странице
                  пространства имён.
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="it-demo__btn it-demo__btn--primary"
                  style={{display: 'inline-block', marginTop: '0.65rem', textDecoration: 'none'}}
                >
                  Открыть на Learn ↗
                </a>
                <a
                  href={framework?.learnIndex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="it-demo__btn"
                  style={{display: 'inline-block', marginTop: '0.5rem', marginLeft: '0.35rem', textDecoration: 'none'}}
                >
                  Весь API-браузер ↗
                </a>
              </>
            ) : (
              <p className={styles.detailRole}>Выберите пространство имён в списке.</p>
            )}
          </div>
        </div>
        <p className={styles.detailRole} style={{marginTop: '0.65rem', marginBottom: 0}}>
          Каталог обновляется скриптом{' '}
          <code>scripts/generate-dotnet-reference-catalog.mjs</code> из репозитория{' '}
          <code>dotnet/dotnet-api-docs</code>. Тексты API сюда не копируются.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DotNetApiExplorerPlayInner;
