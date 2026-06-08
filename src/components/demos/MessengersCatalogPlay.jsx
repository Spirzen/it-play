import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {MESSENGER_FILTERS, MESSENGERS} from '@/components/shared/kb/toolsNetworkData';
import {MessengerSimulatorInner} from '@/components/demos/MessengerSimulator';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

function MessengersCatalogPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('telegram');
  const [showSim, setShowSim] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MESSENGERS.filter((m) => {
      if (cat !== 'all' && m.cat !== cat) return false;
      if (!q) return true;
      return `${m.name} ${m.note} ${m.e2ee}`.toLowerCase().includes(q);
    });
  }, [cat, query]);

  const tool = MESSENGERS.find((m) => m.id === picked) ?? filtered[0] ?? MESSENGERS[0];
  const catLabel = MESSENGER_FILTERS.find((c) => c.id === tool?.cat)?.label ?? '';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Каталог мессенджеров"
        subtitle="Сравните шифрование и сценарий — затем попробуйте упрощённый чат"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="Telegram, Matrix, Signal…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск мессенджера"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {MESSENGER_FILTERS.map((c) => (
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
          <ul className={styles.tree} aria-label="Список мессенджеров">
            {filtered.length === 0 ? (
              <li style={{padding: '0.5rem', fontSize: '0.8rem', opacity: 0.8}}>Ничего не найдено</li>
            ) : (
              filtered.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === m.id && styles.treeItemActive)}
                    onClick={() => setPicked(m.id)}
                  >
                    <span>{m.name}</span>
                    <span className={styles.ext}>{m.cat}</span>
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
            <p style={{margin: '0.5rem 0 0', fontSize: '0.82rem'}}>
              <strong>E2EE / приватность:</strong> {tool.e2ee}
            </p>
            <p className={styles.detailRole}>Установка: {tool.install}</p>
          </div>
        </div>
        <div style={{marginTop: '0.75rem', textAlign: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => setShowSim((v) => !v)}
          >
            {showSim ? 'Скрыть симулятор чата' : 'Симулятор мессенджера'}
          </button>
        </div>
        {showSim && (
          <div style={{marginTop: '0.85rem'}}>
            <MessengerSimulatorInner compact />
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default MessengersCatalogPlayInner;
