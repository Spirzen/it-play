import React, {useState, useEffect, useCallback} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from './DemoShell';
import toolStyles from './toolDemo.module.css';
import styles from './dataStructureDemo.module.css';

export const LANG_TABS = [
  {id: 'js', label: 'JavaScript'},
  {id: 'py', label: 'Python'},
  {id: 'java', label: 'Java'},
  {id: 'cs', label: 'C#'},
  {id: 'dart', label: 'Dart'},
  {id: 'r', label: 'R'},
  {id: 'lua', label: 'Lua'},
  {id: 'groovy', label: 'Groovy'},
  {id: 'fortran', label: 'Fortran'},
  {id: 'bsl', label: '1С'},
];

/** Выбирает вкладку языка: defaultLang из MDX или js, если примеров нет. */
export function resolveDataLang(requested, codeByLang, hasLang = (id) => Boolean(codeByLang[id])) {
  if (requested && hasLang(requested)) return requested;
  if (hasLang('js')) return 'js';
  const first = LANG_TABS.find(({id}) => hasLang(id));
  return first?.id ?? 'js';
}

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);
  return isMobile;
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  }, []);
  return {copied, copy};
}

export function DataStructureLayout({title, subtitle, children, className}) {
  return (
    <DemoShell className={clsx(styles.shell, className)}>
      <DemoCard title={title} subtitle={subtitle}>
        <div className={styles.cardBody}>{children}</div>
      </DemoCard>
    </DemoShell>
  );
}

export function LangTabs({active, onChange, tabs = LANG_TABS}) {
  return (
    <div
      className="it-demo__tabs"
      style={{padding: '0 var(--demo-pad)', marginBottom: 0, borderBottom: '1px solid var(--demo-border)'}}
    >
      {tabs.map(({id, label}) => (
        <button
          key={id}
          type="button"
          className={clsx('it-demo__tab', active === id && 'it-demo__tab--active')}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function TypeChips({options, value, onChange}) {
  return (
    <div className={styles.chipRow}>
      <div className={toolStyles.chips}>
        {options.map(({id, label}) => (
          <button
            key={id}
            type="button"
            className={clsx(toolStyles.chip, value === id && toolStyles.chipActive)}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CodeBlock({code, copied, onCopy}) {
  return (
    <div className={styles.section}>
      <div className={styles.codeWrap}>
        <button
          type="button"
          className={clsx('it-demo__btn', 'it-demo__btn--secondary', 'it-demo__btn--sm', styles.copyBtn)}
          onClick={() => onCopy(code)}
        >
          {copied ? '✓ Скопировано' : '📋 Копировать'}
        </button>
        <pre className="it-demo__terminal">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function VizSection({label, children}) {
  return (
    <div className={styles.section}>
      {label && <p className={styles.vizLabel}>{label}</p>}
      <div className={clsx('it-demo__viz', styles.viz)}>{children}</div>
    </div>
  );
}

export function InfoNote({title, children, variant = 'success'}) {
  return (
    <div className={styles.section}>
      <div className={clsx('it-demo__alert', `it-demo__alert--${variant}`)}>
        {title && <strong>{title} </strong>}
        {children}
      </div>
    </div>
  );
}

export function ControlRow({children}) {
  return (
    <div className="it-demo__row" style={{width: '100%', maxWidth: 520, margin: '0 auto'}}>
      {children}
    </div>
  );
}
