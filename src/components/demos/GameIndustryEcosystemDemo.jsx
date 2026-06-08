import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ECOSYSTEM_LAYERS,
  MONETIZATION_MODELS,
  PC_STORES,
  RELEASE_FLOW,
  STUDIO_MODELS,
} from '@/components/shared/kb/gameIndustryEngine';
import styles from '@/components/demos/GameIndustryDemo.module.css';

function EcosystemTab() {
  const [layerId, setLayerId] = useState(ECOSYSTEM_LAYERS[0].id);
  const layer = ECOSYSTEM_LAYERS.find((l) => l.id === layerId) ?? ECOSYSTEM_LAYERS[0];

  return (
    <>
      <div className={styles.layerGrid}>
        {ECOSYSTEM_LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            className={clsx(styles.layerCard, layerId === l.id && styles.layerCardActive)}
            style={{'--layer-color': l.color}}
            onClick={() => setLayerId(l.id)}
          >
            <span className={styles.layerTag}>{l.tag}</span>
            <p className={styles.layerTitle}>
              {l.icon} {l.label}
            </p>
          </button>
        ))}
      </div>
      <div className={styles.layerDetail} style={{'--layer-color': layer.color}}>
        <p className={styles.hint} style={{marginTop: 0}}>
          <strong>Участники:</strong> {layer.actors.join(' · ')}
        </p>
        <p className={styles.hint}>
          <strong>Выход уровня:</strong> {layer.output}
        </p>
      </div>
    </>
  );
}

function FlowTab() {
  const [stepId, setStepId] = useState(RELEASE_FLOW[0].id);
  const step = RELEASE_FLOW.find((s) => s.id === stepId) ?? RELEASE_FLOW[0];

  return (
    <>
      <div className={styles.flow}>
        {RELEASE_FLOW.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && <span className={styles.flowArrow} aria-hidden>→</span>}
            <button
              type="button"
              className={clsx(styles.flowStep, stepId === s.id && styles.flowStepActive)}
              onClick={() => setStepId(s.id)}
            >
              {s.label}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.layerDetail} style={{'--layer-color': 'var(--ifm-color-primary)'}}>
        <p className={styles.layerTitle} style={{margin: 0}}>
          {step.label}
        </p>
        <p className={styles.hint}>
          <strong>Кто:</strong> {step.who}
        </p>
        <p className={styles.hint}>
          <strong>Действие:</strong> {step.action}
        </p>
      </div>
    </>
  );
}

function StudiosTab() {
  const [model, setModel] = useState('aaa');
  const m = STUDIO_MODELS[model];

  return (
    <>
      <div className={styles.tabs}>
        {Object.values(STUDIO_MODELS).map((s) => (
          <button
            key={s.id}
            type="button"
            className={clsx(styles.tab, model === s.id && styles.tabActive)}
            onClick={() => setModel(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className={styles.compareGrid}>
        <div className={styles.layerDetail}>
          {[
            ['Команда', m.team],
            ['Цикл', m.cycle],
            ['Бюджет', m.budget],
            ['Движок', m.engine],
            ['Процесс', m.process],
          ].map(([k, v]) => (
            <div key={k} className={styles.statRow}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <div>
          <p className={styles.hint}>
            <strong>Риск:</strong> {m.risk}
          </p>
          <p className={styles.hint}>
            <strong>Примеры:</strong> {m.examples}
          </p>
        </div>
      </div>
    </>
  );
}

function MonetizationTab() {
  const [modelId, setModelId] = useState(MONETIZATION_MODELS[0].id);
  const model = MONETIZATION_MODELS.find((m) => m.id === modelId) ?? MONETIZATION_MODELS[0];

  return (
    <>
      <div className={styles.tabs}>
        {MONETIZATION_MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(styles.tab, modelId === m.id && styles.tabActive)}
            onClick={() => setModelId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      {MONETIZATION_MODELS.map((m) => (
        <div key={m.id} className={styles.barRow}>
          <span className={styles.barLabel}>{m.label}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                width: `${m.share}%`,
                background: modelId === m.id ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-400)',
              }}
            />
          </div>
          <span className={styles.barPct}>{m.share}%</span>
        </div>
      ))}
      <p className={styles.hint}>
        <strong>{model.label}:</strong> {model.desc}
      </p>
      <p className={styles.hint}>+ {model.pros[0]} · − {model.cons[0]}</p>
    </>
  );
}

function StoresTab() {
  const total = useMemo(() => PC_STORES.reduce((s, x) => s + x.share, 0), []);

  return (
    <>
      {PC_STORES.map((store) => (
        <div key={store.id} className={styles.barRow}>
          <span className={styles.barLabel}>{store.label}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{width: `${(store.share / total) * 100}%`, background: '#1b2838'}}
            />
          </div>
          <span className={styles.barPct}>{store.share}%</span>
        </div>
      ))}
      <p className={styles.hint}>Учебная модель долей ПК-цифры. Комиссия платформ: {PC_STORES[0].fee} (Steam).</p>
      <ul className={styles.checkList} style={{fontSize: '0.8rem'}}>
        {PC_STORES.map((s) => (
          <li key={s.id}>
            <strong>{s.label}</strong> — {s.note}
          </li>
        ))}
      </ul>
    </>
  );
}

function GameIndustryEcosystemDemoInner() {
  const [tab, setTab] = useState('ecosystem');
  const tabs = [
    {id: 'ecosystem', label: 'Уровни'},
    {id: 'flow', label: 'Путь релиза'},
    {id: 'studios', label: 'AAA vs Indie'},
    {id: 'money', label: 'Монетизация'},
    {id: 'stores', label: 'Магазины ПК'},
  ];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Экосистема игровой индустрии"
        subtitle="От студии до игрока: уровни цепочки, модели студий, монетизация и цифровая дистрибуция"
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
        {tab === 'ecosystem' && <EcosystemTab />}
        {tab === 'flow' && <FlowTab />}
        {tab === 'studios' && <StudiosTab />}
        {tab === 'money' && <MonetizationTab />}
        {tab === 'stores' && <StoresTab />}
      </DemoCard>
    </DemoShell>
  );
}

export default GameIndustryEcosystemDemoInner;
