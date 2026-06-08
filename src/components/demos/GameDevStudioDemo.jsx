import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  GAME_ENGINES,
  MDA_LOOP,
  ROBLOX_FLOW,
  UNITY_DEMO_OBJECT,
} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function EnginesTab() {
  const [engId, setEngId] = useState('unity');
  const eng = GAME_ENGINES.find((e) => e.id === engId) ?? GAME_ENGINES[0];

  return (
    <>
      <div className={styles.engineGrid}>
        {GAME_ENGINES.map((e) => (
          <button
            key={e.id}
            type="button"
            className={clsx(styles.engineCard, engId === e.id && styles.engineCardActive)}
            style={{'--eng-color': e.color}}
            onClick={() => setEngId(e.id)}
          >
            <strong>{e.name}</strong>
            <p className={styles.hint} style={{margin: '0.2rem 0 0'}}>
              {e.lang} · {e.dim}
            </p>
          </button>
        ))}
      </div>
      <div className={styles.panel}>
        <p className={styles.panelTitle}>{eng.name}</p>
        <div className={styles.chipRow}>
          <span className={styles.chip}>{eng.license}</span>
          <span className={styles.chip}>{eng.platforms}+ платформ</span>
        </div>
        <p className={styles.hint}>
          <strong>Сила:</strong> {eng.strength}
        </p>
        <p className={styles.hint}>
          <strong>Ограничение:</strong> {eng.weakness}
        </p>
      </div>
    </>
  );
}

function UnityTab() {
  const [active, setActive] = useState(new Set(['transform', 'input']));

  const toggle = (id) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <p className={styles.hint}>
        GameObject "{UNITY_DEMO_OBJECT.name}" — включите компоненты и посмотрите, что даёт каждый.
      </p>
      <div className={styles.compList}>
        {UNITY_DEMO_OBJECT.components.map((c) => {
          const on = active.has(c.id);
          return (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.compItem, on && styles.compItemOn)}
              onClick={() => toggle(c.id)}
            >
              <span className={clsx(styles.compDot, on && styles.compDotOn)} />
              <div style={{textAlign: 'left'}}>
                <strong style={{fontSize: '0.82rem'}}>{c.label}</strong>
                <p className={styles.hint} style={{margin: '0.15rem 0 0'}}>
                  {c.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <p className={styles.hint}>
        Активно: {active.size} компонент(ов). Без Transform объект не существует в сцене; без скрипта — не
        реагирует на ввод.
      </p>
    </>
  );
}

function RobloxTab() {
  const [step, setStep] = useState(0);
  const flow = ROBLOX_FLOW[step];

  return (
    <>
      <svg className={styles.archSvg} viewBox="0 0 320 120" aria-label="Клиент и сервер Roblox">
        <rect
          x="20"
          y="30"
          width="90"
          height="60"
          rx="8"
          className={clsx(styles.archNode, flow.from === 'client' && styles.archNodeActive)}
        />
        <text x="65" y="55" textAnchor="middle" className={styles.archLabel}>
          Client
        </text>
        <text x="65" y="68" textAnchor="middle" className={styles.archLabel}>
          LocalScript
        </text>
        <rect
          x="210"
          y="30"
          width="90"
          height="60"
          rx="8"
          className={clsx(styles.archNode, flow.from === 'server' && styles.archNodeActive)}
        />
        <text x="255" y="55" textAnchor="middle" className={styles.archLabel}>
          Server
        </text>
        <text x="255" y="68" textAnchor="middle" className={styles.archLabel}>
          ScriptService
        </text>
        <path
          d={flow.from === 'client' ? 'M 110 50 L 210 50' : 'M 210 70 L 110 70'}
          className={clsx(styles.archEdge, styles.archEdgeActive)}
          markerEnd="url(#arrow)"
        />
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--ifm-color-primary)" />
          </marker>
        </defs>
      </svg>
      <div className={styles.tabs}>
        {ROBLOX_FLOW.map((_, i) => (
          <button
            key={i}
            type="button"
            className={clsx(styles.tab, step === i && styles.tabActive)}
            onClick={() => setStep(i)}
          >
            Шаг {i + 1}
          </button>
        ))}
      </div>
      <div className={styles.panel}>
        <p className={styles.hint} style={{marginTop: 0}}>
          {flow.msg}
        </p>
        <p className={styles.hint}>
          {flow.secure ? (
            <strong style={{color: 'var(--ifm-color-success)'}}>✓ Авторитетная логика на сервере</strong>
          ) : (
            <strong style={{color: 'var(--ifm-color-danger)'}}>⚠ Только запрос — проверка на сервере обязательна</strong>
          )}
        </p>
      </div>
    </>
  );
}

function MdaTab() {
  const [mdaId, setMdaId] = useState('mechanics');
  const item = MDA_LOOP.find((m) => m.id === mdaId) ?? MDA_LOOP[0];

  return (
    <>
      <div className={styles.mdaRing}>
        {MDA_LOOP.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(styles.mdaCard, mdaId === m.id && styles.mdaCardActive)}
            style={{'--mda-color': m.color}}
            onClick={() => setMdaId(m.id)}
          >
            <strong>{m.label}</strong>
          </button>
        ))}
      </div>
      <p className={styles.hint}>
        <strong>{item.label}:</strong> {item.desc}
      </p>
      <p className={styles.hint}>
        Петля MDA: механики порождают динамику → игрок переживает эстетику (MDA Framework, Hunicke et al.).
      </p>
    </>
  );
}

function GameDevStudioDemoInner() {
  const [tab, setTab] = useState('engines');
  const tabs = [
    {id: 'engines', label: 'Движки'},
    {id: 'unity', label: 'Unity'},
    {id: 'roblox', label: 'Roblox'},
    {id: 'mda', label: 'MDA'},
  ];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Студия геймдева: движки и архитектура"
        subtitle="Сравнение движков, компонентная модель Unity и авторитетный сервер Roblox"
      >
        <div className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'engines' && <EnginesTab />}
        {tab === 'unity' && <UnityTab />}
        {tab === 'roblox' && <RobloxTab />}
        {tab === 'mda' && <MdaTab />}
      </DemoCard>
    </DemoShell>
  );
}

export default GameDevStudioDemoInner;
