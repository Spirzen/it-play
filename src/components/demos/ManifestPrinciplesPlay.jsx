import React, {useMemo, useState} from 'react';
import Link from '@/components/shared/KbLink';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  AUDIENCE,
  KNOWLEDGE_LAYERS,
  MANIFEST_PRINCIPLES,
} from '@/components/shared/kb/manifestPrinciplesEngine';
import styles from '@/components/demos/ManifestPrinciplesPlay.module.css';

function ManifestPrinciplesPlayInner() {
  const [activeId, setActiveId] = useState('system');
  const [tourStep, setTourStep] = useState(null);

  const principle =
    MANIFEST_PRINCIPLES.find((p) => p.id === activeId) ?? MANIFEST_PRINCIPLES[0];

  const activeLayers = useMemo(
    () => KNOWLEDGE_LAYERS.filter((l) => principle.layers.includes(l.id)),
    [principle],
  );

  const runTour = () => {
    setTourStep(0);
    setActiveId(MANIFEST_PRINCIPLES[0].id);
  };

  const nextTour = () => {
    if (tourStep == null) return;
    const next = tourStep + 1;
    if (next >= MANIFEST_PRINCIPLES.length) {
      setTourStep(null);
      return;
    }
    setTourStep(next);
    setActiveId(MANIFEST_PRINCIPLES[next].id);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Интерактивный манифест"
        subtitle="Семь принципов и слои базы знаний — выберите принцип или пройдите тур по порядку"
      >
        <div className={styles.toolbar}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={runTour}
          >
            Тур по принципам
          </button>
          {tourStep != null && (
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={nextTour}>
              {tourStep + 1 >= MANIFEST_PRINCIPLES.length ? 'Завершить тур' : `Шаг ${tourStep + 2} / 7`}
            </button>
          )}
        </div>

        <div className={styles.layout}>
          <nav className={styles.principles} aria-label="Принципы манифеста">
            {MANIFEST_PRINCIPLES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={clsx(
                  styles.principleBtn,
                  activeId === p.id && styles.principleBtnActive,
                  tourStep != null &&
                    MANIFEST_PRINCIPLES[tourStep]?.id === p.id &&
                    styles.principleBtnTour,
                )}
                onClick={() => {
                  setActiveId(p.id);
                  setTourStep(null);
                }}
              >
                <span className={styles.principleNum}>{p.num}</span>
                <span className={styles.principleEmoji} aria-hidden="true">
                  {p.emoji}
                </span>
                <span className={styles.principleTitle}>{p.title}</span>
              </button>
            ))}
          </nav>

          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <span className={styles.badge}>
                Принцип {principle.num} · {principle.emoji}
              </span>
              <h4 className={styles.detailTitle}>{principle.title}</h4>
              <p className={styles.tagline}>{principle.tagline}</p>
            </div>
            <p className={styles.detailText}>{principle.detail}</p>

            <p className="it-demo__label">Затрагивает слои</p>
            <div className={styles.layerGrid}>
              {KNOWLEDGE_LAYERS.map((layer) => {
                const on = principle.layers.includes(layer.id);
                return (
                  <div
                    key={layer.id}
                    className={clsx(styles.layerCard, on && styles.layerCardOn)}
                    style={on ? {'--layer-color': layer.color} : undefined}
                  >
                    <span className={styles.layerLabel}>{layer.label}</span>
                    <ul className={styles.layerNodes}>
                      {layer.nodes.map((n) => (
                        <li key={n.id} className={on ? styles.nodeOn : styles.nodeOff}>
                          {n.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className={styles.audience}>
              <span className="it-demo__label">Для кого</span>
              <div className={styles.audienceChips}>
                {AUDIENCE.map((a) => (
                  <span key={a} className={styles.audienceChip}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.flow}>
          <span className={styles.flowLabel}>Маршрут читателя</span>
          <div className={styles.flowTrack}>
            {activeLayers.map((l, i) => (
              <React.Fragment key={l.id}>
                {i > 0 && <span className={styles.flowArrow} aria-hidden="true">→</span>}
                <span className={styles.flowStep} style={{'--layer-color': l.color}}>
                  {l.label}
                </span>
              </React.Fragment>
            ))}
            <span className={styles.flowArrow} aria-hidden="true">→</span>
            <span className={styles.flowEnd}>ваше понимание</span>
          </div>
        </div>

        <p className="it-demo__hint">
          Подробнее о разделах:{' '}
          <Link to="/about/project">О проекте</Link>, карта на{' '}
          <Link to="/">главной</Link>.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ManifestPrinciplesPlayInner;
