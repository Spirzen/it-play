import React from 'react';
import clsx from 'clsx';
import styles from './languageAdvancedPlays.module.css';

export function LpStack({children, className}) {
  return <div className={clsx(styles.stack, className)}>{children}</div>;
}

export function LpSection({label, children, className}) {
  return (
    <div className={clsx(styles.section, className)}>
      {label ? <p className={styles.sectionLabel}>{label}</p> : null}
      {children}
    </div>
  );
}

export function LpChipRow({children, className}) {
  return <div className={clsx(styles.row, className)}>{children}</div>;
}

export function LpChip({active, children, className, ...props}) {
  return (
    <button type="button" className={clsx(styles.chip, active && styles.chipActive, className)} {...props}>
      {children}
    </button>
  );
}

export function LpCode({children, placeholder, className}) {
  return (
    <pre className={clsx(styles.code, placeholder && styles.codePlaceholder, className)}>{children}</pre>
  );
}

export function LpLog({children, variant = 'default', className}) {
  return (
    <p
      className={clsx(
        styles.log,
        variant === 'success' && styles.logSuccess,
        variant === 'error' && styles.logError,
        variant === 'info' && styles.logInfo,
        className,
      )}
    >
      {children}
    </p>
  );
}

export function LpBadge({variant = 'default', children, className}) {
  return (
    <span
      className={clsx(
        styles.badge,
        variant === 'ok' && styles.badgeOk,
        variant === 'err' && styles.badgeErr,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LpProgress({current, total, label}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className={styles.section}>
      <div className={styles.progressMeta}>
        <span>{label}</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div className={styles.progress} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
        <div className={styles.progressFill} style={{width: `${pct}%`}} />
      </div>
    </div>
  );
}

export function LpTimeline({children, className}) {
  return <div className={clsx(styles.timeline, className)}>{children}</div>;
}

export function LpStep({active, done, error, children}) {
  return (
    <span
      className={clsx(
        styles.step,
        active && styles.stepActive,
        done && !active && styles.stepDone,
        error && styles.stepError,
      )}
    >
      {children}
    </span>
  );
}

export function LpArrow() {
  return <span className={styles.arrow} aria-hidden="true">→</span>;
}

export function LpPanel({title, children, className}) {
  return (
    <div className={clsx(styles.panel, className)}>
      {title ? <p className={styles.panelTitle}>{title}</p> : null}
      <div className={styles.panelBody}>{children}</div>
    </div>
  );
}

export function LpToggleRow({children, className}) {
  return <label className={clsx(styles.toggleRow, className)}>{children}</label>;
}

export function LpSelect(props) {
  return <select className={styles.select} {...props} />;
}

export function LpActionBar({children, className}) {
  return <div className={clsx(styles.actionBar, className)}>{children}</div>;
}

export function LpTableWrap({children}) {
  return <div className={styles.tableWrap}>{children}</div>;
}
