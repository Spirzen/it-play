import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {BROWSER_ENGINE_FILTERS, BROWSERS} from '@/components/shared/kb/toolsNetworkData';
import {WebBrowserSimulatorInner} from '@/components/demos/WebBrowserSimulator';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

function BrowserCatalogPlayInner() {
  const [engine, setEngine] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('chrome');
  const [showSim, setShowSim] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BROWSERS.filter((b) => {
      if (engine !== 'all' && b.engine !== engine) return false;
      if (!q) return true;
      const hay = `${b.name} ${b.focus} ${b.os}`.toLowerCase();
      return hay.includes(q);
    });
  }, [engine, query]);

  const tool = BROWSERS.find((b) => b.id === picked) ?? filtered[0] ?? BROWSERS[0];
  const engineLabel =
    BROWSER_ENGINE_FILTERS.find((e) => e.id === tool?.engine)?.label ?? tool?.engine;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Каталог браузеров"
        subtitle="Движок, платформы и фокус — затем откройте симулятор окна браузера"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="Chrome, Tor, WebKit…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск браузера"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {BROWSER_ENGINE_FILTERS.map((e) => (
            <button
              key={e.id}
              type="button"
              className={clsx(toolStyles.chip, engine === e.id && toolStyles.chipActive)}
              onClick={() => setEngine(e.id)}
            >
              {e.label}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Список браузеров">
            {filtered.length === 0 ? (
              <li style={{padding: '0.5rem', fontSize: '0.8rem', opacity: 0.8}}>Ничего не найдено</li>
            ) : (
              filtered.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === b.id && styles.treeItemActive)}
                    onClick={() => setPicked(b.id)}
                  >
                    <span>{b.name}</span>
                    <span className={styles.ext}>{b.engine}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{tool.name}</h4>
            <p className={styles.detailRole}>
              {engineLabel} · {tool.os}
            </p>
            <p>{tool.focus}</p>
            <p className={styles.detailRole} style={{marginTop: '0.5rem'}}>
              Установка: {tool.install}
            </p>
          </div>
        </div>
        <div style={{marginTop: '0.75rem', textAlign: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => setShowSim((v) => !v)}
          >
            {showSim ? 'Скрыть симулятор' : 'Открыть симулятор браузера'}
          </button>
        </div>
        {showSim && (
          <div style={{marginTop: '0.85rem'}}>
            <WebBrowserSimulatorInner compact />
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default BrowserCatalogPlayInner;
