import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  DNS_STEPS,
  HTTP_STEPS,
  OSI_LAYERS,
  TABS,
  getPathSteps,
  getVariantMeta,
} from '@/components/shared/kb/networkStackExplorerEngine';
import styles from '@/components/demos/NetworkStackExplorerPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const STEP_MS = 1400;

function useStepRunner(length, running) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [length, running]);

  const reset = useCallback(() => setIndex(0), []);

  return {index, reset, setIndex};
}

function PathFlow({steps, activeIndex}) {
  return (
    <div className={styles.flow} role="list">
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          {i > 0 && (
            <span className={styles.arrow} aria-hidden>
              →
            </span>
          )}
          <div
            role="listitem"
            className={clsx(styles.step, i === activeIndex && styles.stepActive)}
          >
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function LayersList({activeIndex}) {
  const layerIdx = 6 - activeIndex;
  return (
    <div className={styles.layers}>
      {OSI_LAYERS.map((layer) => (
        <div
          key={layer.n}
          className={clsx(styles.layer, layer.n === layerIdx + 1 && styles.layerActive)}
        >
          <span className={styles.layerNum}>L{layer.n}</span>
          <div className={styles.layerBody}>
            <p>
              <strong>{layer.name}</strong> — {layer.proto}
            </p>
            <small>{layer.role}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function NetworkStackExplorerPlayInner({variant = 'basics'}) {
  const meta = getVariantMeta(variant);
  const pathSteps = useMemo(() => getPathSteps(variant), [variant]);

  const visibleTabs = useMemo(() => {
    if (variant === 'dns') return TABS.filter((t) => t.id === 'dns' || t.id === 'path');
    if (variant === 'http') return TABS.filter((t) => t.id === 'http' || t.id === 'layers');
    return TABS;
  }, [variant]);

  const [tab, setTab] = useState(meta.defaultTab);
  const [running, setRunning] = useState(true);

  const stepsForTab = useMemo(() => {
    if (tab === 'dns') return DNS_STEPS;
    if (tab === 'http') return HTTP_STEPS;
    if (tab === 'layers') return OSI_LAYERS;
    return pathSteps;
  }, [tab, pathSteps]);

  const {index, reset, setIndex} = useStepRunner(stepsForTab.length, running);

  useEffect(() => {
    setTab(meta.defaultTab);
    reset();
  }, [variant, meta.defaultTab, reset]);

  const detail = stepsForTab[index];

  const subtitles = {
    basics: 'От домашней сети до сервера: адреса, NAT и уровни OSI.',
    global: 'Маршрут через провайдеров, точки обмена трафиком и ЦОД.',
    dns: 'Как имя домена превращается в IP-адрес.',
    http: 'Путь HTTP-запроса по уровням стека.',
  };

  return (
    <DemoShell>
      <DemoCard
        title="Как устроена сеть"
        subtitle={subtitles[variant] ?? subtitles.basics}
      >
        {visibleTabs.length > 1 && (
          <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={clsx(toolStyles.chip, tab === t.id && toolStyles.chipActive)}
                onClick={() => {
                  setTab(t.id);
                  reset();
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? 'Пауза' : 'Анимация'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => {
              reset();
              setRunning(true);
            }}
          >
            Сначала
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => setIndex((i) => (i + 1) % stepsForTab.length)}
          >
            Следующий шаг
          </button>
        </div>

        {tab === 'layers' ? (
          <LayersList activeIndex={index} />
        ) : (
          <PathFlow steps={stepsForTab} activeIndex={index} />
        )}

        {detail && (
          <div className={styles.detail}>
            {tab === 'layers' ? (
              <>
                <strong>
                  L{detail.n} {detail.name}
                </strong>
                — {detail.role}
              </>
            ) : (
              <>
                <strong>{detail.label}</strong> — {detail.detail}
              </>
            )}
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default NetworkStackExplorerPlayInner;
