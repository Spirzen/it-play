import React from 'react';
import clsx from 'clsx';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

export function CdStack({children, className}) {
  return <div className={clsx(styles.stack, className)}>{children}</div>;
}

export function CdSection({label, children, className}) {
  return (
    <section className={clsx(styles.section, className)}>
      {label ? <p className={styles.sectionLabel}>{label}</p> : null}
      {children}
    </section>
  );
}

export function CdPanel({children, className, highlight}) {
  return (
    <div className={clsx(styles.panel, highlight && styles.panelHighlight, className)}>{children}</div>
  );
}

export function CdBtn({children, className, variant = 'default', ...props}) {
  return (
    <button
      type="button"
      className={clsx(styles.btn, variant === 'primary' && styles.btnPrimary, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function CdToolbar({children, className}) {
  return <div className={clsx(styles.toolbar, className)}>{children}</div>;
}

export function CdRange({label, value, displayValue, min, max, step = 1, onChange, className}) {
  return (
    <label className={clsx(styles.range, className)}>
      <span className={styles.rangeLabel}>
        <span>{label}</span>
        {displayValue != null ? <strong className={styles.rangeValue}>{displayValue}</strong> : null}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={styles.rangeInput}
      />
    </label>
  );
}

export function CdMetricGrid({children, className}) {
  return <div className={clsx(styles.metricGrid, className)}>{children}</div>;
}

export function CdMetric({label, value, hint, tone = 'accent', className}) {
  return (
    <div className={clsx(styles.metricCard, className)}>
      <div className={clsx(styles.metricValue, styles[`tone_${tone}`])}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
      {hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  );
}

export function CdVerdict({children, tone = 'info', compact, className}) {
  return (
    <div
      className={clsx(styles.verdict, styles[`verdict_${tone}`], compact && styles.verdictCompact, className)}
    >
      {children}
    </div>
  );
}

export function CdHint({children, className}) {
  return <p className={clsx(styles.hint, className)}>{children}</p>;
}

export function CdMono({children, className, as: Tag = 'pre'}) {
  return <Tag className={clsx(styles.mono, className)}>{children}</Tag>;
}

export function CdInput({className, ...props}) {
  return <input className={clsx(styles.input, className)} {...props} />;
}

export function CdTextarea({className, ...props}) {
  return <textarea className={clsx(styles.textarea, className)} {...props} />;
}

export function CdStatus({children, ok, className}) {
  return (
    <div className={clsx(styles.status, ok ? styles.statusOk : styles.statusBad, className)}>{children}</div>
  );
}

export function CdMethodBadge({method}) {
  const m = (method || 'GET').toUpperCase();
  const key = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(m) ? m : 'DEFAULT';
  return <span className={clsx(styles.methodBadge, styles[`method_${key}`])}>{m}</span>;
}

export function CdGraphWrap({children, className, viewBox, label}) {
  return (
    <div className={clsx(styles.graphWrap, className)}>
      <svg viewBox={viewBox} className={styles.graphSvg} role="img" aria-label={label}>
        {children}
      </svg>
    </div>
  );
}

export function CdGrid2({children, className}) {
  return <div className={clsx(styles.grid2, className)}>{children}</div>;
}

export function CdFlynnGrid({cells, active, onSelect}) {
  return (
    <div className={styles.flynnGrid}>
      {cells.map((c) => (
        <button
          key={c.id}
          type="button"
          className={clsx(styles.flynnCell, active === c.id && styles.flynnActive)}
          onClick={() => onSelect(c.id)}
        >
          <strong>{c.title}</strong>
          <span className={styles.hint}>{c.sub}</span>
        </button>
      ))}
    </div>
  );
}

/** Linear project pipeline (stages with title + artifact). */
export function CdPipeline({stages, current, done = [], onSelect, onAdvance, label = 'Этапы проекта'}) {
  return (
    <CdSection label={label}>
      <div className={styles.pipelineTrack}>
        {stages.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={clsx(
              styles.pipelineStage,
              current === s.id && styles.pipelineStageActive,
              done.includes(s.id) && styles.pipelineStageDone,
            )}
            onClick={() => onSelect?.(s.id)}
          >
            <span className={styles.pipelineNum}>{i + 1}</span>
            <span className={styles.pipelineTitle}>{s.title ?? s.label}</span>
            {s.artifact || s.detail ? (
              <span className={styles.pipelineArtifact}>{s.artifact ?? s.detail}</span>
            ) : null}
            {done.includes(s.id) ? (
              <span className={styles.pipelineCheck} aria-hidden>
                ✓
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {onAdvance ? (
        <CdToolbar>
          <CdBtn variant="primary" onClick={onAdvance}>
            Завершить этап «{stages.find((s) => s.id === current)?.title ?? stages.find((s) => s.id === current)?.label}»
          </CdBtn>
          <CdHint>
            Пройдено: {done.length}/{stages.length}
          </CdHint>
        </CdToolbar>
      ) : null}
    </CdSection>
  );
}

/** State-machine lifecycle strip (only allowed transitions are clickable). */
export function CdLifecycleTrack({states, active, allowed = [], onSelect}) {
  return (
    <div className={styles.lifecycleGrid}>
      {states.map((s) => {
        const isActive = active === s.id;
        const canGo = allowed.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            className={clsx(
              styles.lifecycleChip,
              isActive && styles.lifecycleChipActive,
              canGo && !isActive && styles.lifecycleChipNext,
            )}
            disabled={!isActive && !canGo}
            onClick={() => canGo && onSelect?.(s.id)}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export function CdStepControls({step, total, onPrev, onNext, onReset, hint, onComplete, completeLabel = 'Готово → далее', canPrev, canNext}) {
  const prevDisabled = canPrev != null ? !canPrev : step <= 0;
  const nextDisabled = canNext != null ? !canNext : step >= total - 1;

  return (
    <CdToolbar>
      {onReset ? (
        <CdBtn onClick={onReset}>Сброс</CdBtn>
      ) : null}
      {onPrev ? (
        <CdBtn onClick={onPrev} disabled={prevDisabled}>
          Назад
        </CdBtn>
      ) : null}
      {onComplete ? (
        <CdBtn variant="primary" onClick={onComplete} disabled={nextDisabled && step >= total - 1}>
          {completeLabel}
        </CdBtn>
      ) : onNext ? (
        <CdBtn variant="primary" onClick={onNext} disabled={nextDisabled}>
          Далее
        </CdBtn>
      ) : null}
      {total != null ? (
        <CdHint>
          Шаг {step + 1}/{total}
          {hint ? ` · ${hint}` : ''}
        </CdHint>
      ) : hint ? (
        <CdHint>{hint}</CdHint>
      ) : null}
    </CdToolbar>
  );
}

export function CdFreezeDemo({frozen, clicks, onClick, onHeavy, busy}) {
  return (
    <CdStack>
      <div className={clsx(styles.freezeBox, frozen && styles.freezeBoxFrozen)}>
        <p className={styles.freezeText}>
          {frozen ? 'UI-поток занят — кнопка не откликается ~2 с' : 'Интерфейс отзывчив'}
        </p>
        <CdBtn variant="primary" onClick={onClick} disabled={busy}>
          +1 ({clicks})
        </CdBtn>
      </div>
      <CdBtn onClick={onHeavy} disabled={busy}>
        Тяжёлый расчёт на main thread
      </CdBtn>
    </CdStack>
  );
}

export function graphEdgePath(fromId, toId, nodes) {
  const a = nodes.find((n) => n.id === fromId);
  const b = nodes.find((n) => n.id === toId);
  if (!a || !b) return '';
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}
