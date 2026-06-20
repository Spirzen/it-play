import React from 'react';
import clsx from 'clsx';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

export const SN_COLORS = {
  success: 'var(--sn-success)',
  warning: 'var(--sn-warning)',
  danger: 'var(--sn-danger)',
  info: 'var(--sn-info)',
  accent: 'var(--sn-accent)',
};

export function PlayStack({children, className}) {
  return <div className={clsx(styles.stack, className)}>{children}</div>;
}

export function PlaySection({label, children}) {
  return (
    <div className={styles.section}>
      {label && <p className={styles.sectionLabel}>{label}</p>}
      {children}
    </div>
  );
}

export function PlayTabs({tabs, active, onChange, disabled = false}) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          disabled={disabled}
          className={clsx(styles.tab, active === tab.id && styles.tabActive)}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function PlayStatusBadge({tone = 'info', children}) {
  return (
    <span
      className={clsx(
        styles.statusBadge,
        tone === 'ok' && styles.statusOk,
        tone === 'warn' && styles.statusWarn,
        tone === 'bad' && styles.statusBad,
        tone === 'info' && styles.statusInfo,
      )}
    >
      {children}
    </span>
  );
}

export function PlayFeedback({tone = 'info', children}) {
  return (
    <p
      className={clsx(
        styles.feedback,
        tone === 'success' && styles.feedbackSuccess,
        tone === 'warn' && styles.feedbackWarn,
        tone === 'danger' && styles.feedbackDanger,
      )}
    >
      {children}
    </p>
  );
}

export function PlayMetrics({items, grid = false}) {
  const wrapClass = grid ? styles.metricGrid : styles.metrics;
  return (
    <div className={wrapClass}>
      {items.map((item) => {
        const pct = item.max ? Math.min(100, Math.round((item.value / item.max) * 100)) : item.value;
        return (
          <div key={item.label} className={styles.metric}>
            <div className={styles.metricHead}>
              <span>{item.label}</span>
              <strong>{item.display ?? `${item.value}${item.unit ?? ''}`}</strong>
            </div>
            {item.max != null && (
              <div className={styles.metricTrack}>
                <div
                  className={styles.metricFill}
                  style={{
                    width: `${pct}%`,
                    background: item.color ?? SN_COLORS.accent,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function logLineClass(line) {
  if (/^✓|^✅/.test(line)) return styles.logLineOk;
  if (/^⚠|^👁/.test(line)) return styles.logLineWarn;
  if (/^❌|^💥|^🚨|^✗/.test(line)) return styles.logLineBad;
  return undefined;
}

export function PlayLog({lines}) {
  if (!lines?.length) {
    return <pre className={styles.log} aria-live="polite">—</pre>;
  }
  return (
    <pre className={styles.log} aria-live="polite">
      {lines.map((line, i) => (
        <React.Fragment key={`${i}-${line.slice(0, 12)}`}>
          {i > 0 && '\n'}
          <span className={logLineClass(line)}>{line}</span>
        </React.Fragment>
      ))}
    </pre>
  );
}

export function PlayControls({
  step = 0,
  total = 1,
  onNext,
  onPrev,
  onReset,
  nextLabel = 'Далее',
  prevLabel = 'Назад',
  resetLabel = 'Сначала',
  disableNext = false,
}) {
  return (
    <div className={styles.controls}>
      {onReset && (
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={onReset}>
          {resetLabel}
        </button>
      )}
      {onPrev && step > 0 && (
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={onPrev}>
          {prevLabel}
        </button>
      )}
      {onNext && (
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={onNext}
          disabled={disableNext || step >= total - 1}
        >
          {step >= total - 1 ? 'Готово' : nextLabel}
        </button>
      )}
      <span className={styles.stepBadge}>
        {step + 1} / {total}
      </span>
    </div>
  );
}

export function PlayActionBar({children}) {
  return <div className={styles.actionBar}>{children}</div>;
}

export function PlayPanel({badge, title, subtitle, children}) {
  return (
    <div className={styles.panel}>
      {badge && <span className="it-demo__badge">{badge}</span>}
      {title && <h4 className={styles.panelTitle}>{title}</h4>}
      {subtitle && <p className={styles.panelSub}>{subtitle}</p>}
      {children}
    </div>
  );
}

export function PlayCode({children}) {
  return <code className={styles.codeBlock}>{children}</code>;
}

export function PlayPipeline({parts, operators = []}) {
  return (
    <div className={styles.pipeline} aria-label="Конвейер команд">
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          {index > 0 && (
            <span className={styles.pipeOp} aria-hidden>
              {operators[index - 1] ?? '|'}
            </span>
          )}
          <span className={styles.pipeBlock}>{part}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

export function PlayNodeRow({nodes, activeKey, vertical}) {
  const {isMobile} = useBreakpoint();
  const isVertical = vertical ?? isMobile;

  return (
    <div className={clsx(styles.nodeRow, isVertical && styles.nodeRowVertical)}>
      {nodes.map((node, index) => (
        <React.Fragment key={node.key}>
          {index > 0 && <span className={styles.nodeArrow} aria-hidden>→</span>}
          <div
            className={clsx(
              styles.node,
              node.key === activeKey && styles.nodeActive,
              node.done && styles.nodeDone,
              node.warn && styles.nodeWarn,
            )}
          >
            <span className={styles.nodeIcon}>{node.icon}</span>
            <span className={styles.nodeLabel}>{node.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export function PlaySlider({label, value, min, max, step = 1, disabled, onChange, formatValue}) {
  const shown = formatValue ? formatValue(value) : value;
  return (
    <label className={styles.fieldRow}>
      <span className={styles.fieldLabel}>
        <span>{label}</span>
        <strong>{shown}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function PlayToggle({label, hint, checked, onChange, disabled}) {
  return (
    <label
      className={clsx(styles.toggleRow, checked && styles.toggleRowActive)}
      aria-disabled={disabled}
    >
      <span className={styles.toggleText}>
        {label}
        {hint && <span className={styles.toggleHint}>{hint}</span>}
      </span>
      <span className={clsx(styles.toggleSwitch, checked && styles.toggleSwitchOn)} aria-hidden>
        <span className={styles.toggleKnob} />
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{position: 'absolute', opacity: 0, width: 0, height: 0}}
      />
    </label>
  );
}

export function PlayField({label, children}) {
  return (
    <label className={styles.fieldRow}>
      <span className={styles.fieldLabel}>
        <span>{label}</span>
      </span>
      {children}
    </label>
  );
}

export function simpleHash(str, salt = '') {
  let h = 2166136261;
  const s = `${salt}:${str}`;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function estimateCrackSeconds(length, charsetSize = 26) {
  const combos = Math.pow(charsetSize, Math.max(1, length));
  return combos / 1e9;
}
