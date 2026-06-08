import React from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {demoLoadingFallback} from '@/components/shared/demoFallback';
import toolStyles from './toolDemo.module.css';
import styles from './sqlTrainerDemo.module.css';

const ACCENT_CLASS = {
  select: styles.accentSelect,
  insert: styles.accentInsert,
  update: styles.accentUpdate,
  delete: styles.accentDelete,
  join: styles.accentJoin,
};

export function SqlBrowserOnly({children}) {
  return <>{children}</>;
}

export function SqlTrainerCard({
  accent = 'select',
  command,
  title,
  subtitle,
  children,
  stats,
  footer,
}) {
  return (
    <DemoShell className={ACCENT_CLASS[accent]}>
      <DemoCard
        title={
          <>
            {command && <span className={styles.cmdBadge}>{command}</span>}
            {title}
          </>
        }
        subtitle={subtitle}
      >
        {stats}
        {children}
        {footer && <div className={styles.hint}>{footer}</div>}
      </DemoCard>
    </DemoShell>
  );
}

export function SqlStatsBar({items, actions}) {
  return (
    <div className={styles.statsBar}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem'}}>
        {items.map(({label, value, highlight}) => (
          <span key={label} className={styles.statItem}>
            {label}:{' '}
            <span className={highlight ? styles.statHighlight : styles.statValue}>{value}</span>
          </span>
        ))}
      </div>
      {actions}
    </div>
  );
}

export function SqlExampleChips({examples, activeId, onSelect}) {
  return (
    <div className={toolStyles.chips}>
      <span className="it-demo__label" style={{margin: 0, alignSelf: 'center'}}>
        Примеры:
      </span>
      {examples.map((ex) => (
        <button
          key={ex.id}
          type="button"
          className={clsx(toolStyles.chip, activeId === ex.id && toolStyles.chipActive)}
          onClick={() => onSelect(ex)}
        >
          {ex.label}
        </button>
      ))}
    </div>
  );
}

export function SqlQueryEditor({
  id,
  label = 'SQL-запрос',
  value,
  onChange,
  onExecute,
  placeholder,
  rows = 2,
}) {
  return (
    <>
      <label className="it-demo__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={clsx('it-demo__textarea', styles.queryArea)}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            onExecute?.();
          }
        }}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
      />
      <p className={styles.hint} style={{marginTop: '0.35rem', marginBottom: 0}}>
        <kbd className={toolStyles.kbd}>Ctrl</kbd> + <kbd className={toolStyles.kbd}>Enter</kbd> — выполнить
      </p>
    </>
  );
}

export function SqlToolbar({onExecute, executeLabel, onReset, resetLabel = 'Сбросить данные', extra}) {
  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className="it-demo__btn it-demo__btn--primary"
        onClick={() => onExecute?.()}
      >
        {executeLabel}
      </button>
      {onReset && (
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => onReset?.()}>
          {resetLabel}
        </button>
      )}
      {extra}
    </div>
  );
}

function formatCell(col, value) {
  if (value === null || value === undefined) {
    return <span className={styles.nullCell}>NULL</span>;
  }
  if (col === 'salary' && typeof value === 'number') {
    return `${value.toLocaleString('ru-RU')} ₽`;
  }
  return String(value);
}

export function SqlDataTable({
  caption,
  columns,
  rows,
  highlightIds,
  emptyMessage = 'Нет данных для отображения.',
}) {
  return (
    <div className={styles.tableSection}>
      {caption && <p className={styles.tableCaption}>{caption}</p>}
      <div className="it-demo__table-wrap">
        {rows.length > 0 ? (
          <table className="it-demo__table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id ?? index}
                  className={highlightIds?.has(row.id) ? styles.rowHighlight : undefined}
                >
                  {columns.map((col) => (
                    <td key={col}>{formatCell(col, row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="it-demo__alert it-demo__alert--info" style={{margin: 0}}>
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export function SqlResultTable({caption = 'Результат запроса', columns, rows}) {
  if (!columns?.length) {
    return null;
  }

  return (
    <div className={styles.tableSection}>
      <p className={styles.tableCaption}>{caption}</p>
      <div className="it-demo__table-wrap">
        {rows.length > 0 ? (
          <table className="it-demo__table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col}>{formatCell(col, row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="it-demo__alert it-demo__alert--info" style={{margin: 0}}>
            Запрос не вернул ни одной записи.
          </p>
        )}
      </div>
    </div>
  );
}

export function SqlConfirmDialog({query, count, onConfirm, onCancel}) {
  return (
    <div className={styles.confirmPanel} role="alertdialog" aria-labelledby="sql-confirm-title">
      <strong id="sql-confirm-title">Подтвердите удаление</strong>
      <p style={{margin: '0.5rem 0', fontSize: '0.85rem'}}>
        Будет удалено записей: <strong>{count}</strong>
      </p>
      <pre className="it-demo__terminal" style={{textAlign: 'left', margin: '0.5rem 0'}}>
        {query}
      </pre>
      <div className={styles.confirmActions}>
        <button type="button" className="it-demo__btn it-demo__btn--danger" onClick={onConfirm}>
          Удалить
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </div>
  );
}
