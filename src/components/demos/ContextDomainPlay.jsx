import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {DOMAIN_CONFIG} from '@/components/demos/ContextDomains';
import styles from './contextPlay.module.css';

function Tags({items, it}) {
  return (
    <div className={styles.tags}>
      {items.map((t) => (
        <span key={t} className={clsx(styles.tag, it && styles.tagIt)}>
          {t}
        </span>
      ))}
    </div>
  );
}

function PipelinePlay({config}) {
  const [idx, setIdx] = useState(0);
  const step = config.steps[idx];
  const it = step.it || [];

  return (
    <>
      <div className={styles.pipeline}>
        {config.steps.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && <span className={styles.arrow}>→</span>}
            <button
              type="button"
              className={clsx(
                styles.step,
                i === idx && styles.stepActive,
                i < idx && styles.stepDone,
              )}
              onClick={() => setIdx(i)}
            >
              {s.label}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.panel}>
        <h5>{step.label}</h5>
        <p>{step.detail}</p>
        {it.length > 0 && <Tags items={it} it />}
      </div>
    </>
  );
}

function LayersPlay({config}) {
  const [active, setActive] = useState(config.layers[0].id);
  const layer = config.layers.find((l) => l.id === active);

  return (
    <>
      <div className={styles.layers}>
        {config.layers.map((l, i) => (
          <button
            key={l.id}
            type="button"
            className={clsx(styles.layer, active === l.id && styles.layerActive)}
            onClick={() => setActive(l.id)}
          >
            <span className={styles.layerNum}>{i + 1}</span>
            <span className={styles.layerBody}>
              <strong>{l.label}</strong>
              <span>{l.short}</span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.panel}>
        <p>{layer.detail}</p>
        <Tags items={layer.it} it />
      </div>
    </>
  );
}

function TabsPlay({config}) {
  const [tab, setTab] = useState(config.tabs[0].id);
  const current = config.tabs.find((t) => t.id === tab);

  return (
    <>
      <div className={styles.tabs}>
        {config.tabs.map((t) => (
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
      <div className={styles.panel}>
        <p>{current.body}</p>
        <Tags items={current.it} it />
      </div>
    </>
  );
}

function FlowPlay({config}) {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = config.steps;
  const current = steps[stepIdx];
  const done = stepIdx >= steps.length - 1;

  const advance = () => {
    if (!done) setStepIdx((i) => i + 1);
  };

  const reset = () => setStepIdx(0);

  return (
    <>
      <div className={styles.flowRow}>
        {steps.map((s, i) => {
          let chipClass = styles.flowChipPending;
          if (i <= stepIdx && stepIdx > 0) chipClass = styles.flowChipOk;
          if (i === 0 && stepIdx === 0) chipClass = styles.flowChipOk;
          return (
            <span key={s.id} className={clsx(styles.flowChip, chipClass)}>
              {s.label}
            </span>
          );
        })}
      </div>
      <div className={styles.panel}>
        <h5>{current.label}</h5>
        {current.check ? (
          <p>
            {stepIdx > 0 ? '✓ ' : ''}
            {current.check}
          </p>
        ) : (
          <p>Клиент инициирует перевод. Далее — цепочка регуляторных и технических проверок.</p>
        )}
        <Tags
          items={
            stepIdx === 0
              ? ['PCI DSS', 'логирование аудита']
              : ['PSD2', '152-ФЗ', 'ПОД/ФТ', 'HSM']
          }
          it
        />
      </div>
      <div>
        <button type="button" className={styles.btn} onClick={advance} disabled={done}>
          {done ? 'Платёж проведён' : stepIdx === 0 ? 'Запустить платёж' : 'Следующий этап'}
        </button>
        {stepIdx > 0 && (
          <button type="button" className={styles.btn} onClick={reset} style={{marginLeft: '0.35rem', background: 'var(--ifm-color-emphasis-400)'}}>
            Сброс
          </button>
        )}
      </div>
    </>
  );
}

function BuilderPlay({config}) {
  const [checked, setChecked] = useState(() => new Set(['roles', 'start']));
  const toggle = (key) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const complete = config.rules.every((r) => checked.has(r.key));
  const summary = useMemo(() => {
    const parts = config.rules.filter((r) => checked.has(r.key)).map((r) => r.example);
    return parts.length
      ? `Игра определена: ${parts.join('; ')}.`
      : 'Отметьте элементы, чтобы собрать каркас игры.';
  }, [checked, config.rules]);

  return (
    <>
      <p style={{fontSize: '0.8rem', margin: '0 0 0.5rem', color: 'var(--ifm-color-content-secondary)'}}>
        Роли: {config.roles.join(' · ')}
      </p>
      <div className={styles.grid2}>
        {config.rules.map((r) => (
          <label key={r.key} className={styles.layer} style={{cursor: 'pointer'}}>
            <input
              type="checkbox"
              checked={checked.has(r.key)}
              onChange={() => toggle(r.key)}
              style={{marginRight: '0.4rem'}}
            />
            <span className={styles.layerBody}>
              <strong>{r.label}</strong>
              <span>{r.example}</span>
            </span>
          </label>
        ))}
      </div>
      <div className={styles.panel} style={{marginTop: '0.5rem'}}>
        <p>{summary}</p>
        {complete && <Tags items={config.it} it />}
      </div>
    </>
  );
}

function ContextDomainPlayInner({domain}) {
  const config = DOMAIN_CONFIG[domain];
  if (!config) {
    return (
      <DemoShell>
        <DemoCard title="Демо недоступно" subtitle={`Неизвестный домен: ${domain}`} />
      </DemoShell>
    );
  }

  let body;
  switch (config.type) {
    case 'pipeline':
      body = <PipelinePlay config={config} />;
      break;
    case 'layers':
      body = <LayersPlay config={config} />;
      break;
    case 'tabs':
      body = <TabsPlay config={config} />;
      break;
    case 'flow':
      body = <FlowPlay config={config} />;
      break;
    case 'builder':
      body = <BuilderPlay config={config} />;
      break;
    default:
      body = null;
  }

  return (
    <DemoShell>
      <DemoCard title={config.title} subtitle={config.subtitle}>
        {body}
      </DemoCard>
    </DemoShell>
  );
}

export default ContextDomainPlayInner;
