import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/StyleInjectionPlay.module.css';

const SAFE_CSS = 'p { color: #1565c0; font-weight: 600; }';
const MALICIOUS = '<img src=x onerror="alert(\'XSS\')"> <style>body{background:red}</style>';

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function StyleInjectionPlayInner() {
  const [mode, setMode] = useState('safe');
  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Инъекция стилей и XSS"
        subtitle="WebView: только whitelist CSS. Пользовательский HTML — экранировать, не innerHTML"
      >
        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(styles.tab, mode === 'safe' && styles.tabActive)}
            onClick={() => setMode('safe')}
          >
            Безопасный CSS
          </button>
          <button
            type="button"
            className={clsx(styles.tab, mode === 'unsafe' && styles.tabActive)}
            onClick={() => setMode('unsafe')}
          >
            Вредоносный контент
          </button>
        </div>
        {mode === 'safe' ? (
          <>
            <pre className={styles.snippet}>{SAFE_CSS}</pre>
            <div className={styles.frame}>
              <style>{`.${styles.frame} .inj { color: #1565c0; font-weight: 600; }`}</style>
              <p className="inj">Текст из WebView (безопасный CSS)</p>
            </div>
            <p className={styles.ok}>✓ Стили из доверенного источника, без произвольного HTML.</p>
          </>
        ) : (
          <>
            <pre className={styles.snippet}>{MALICIOUS}</pre>
            <div className={styles.frame}>
              <p className={styles.blocked}>Показ как текст (экранировано):</p>
              <code className={styles.escaped}>{escapeHtml(MALICIOUS)}</code>
            </div>
            <p className={styles.warn}>
              ✕ Если вставить в innerHTML без санитизации — возможен XSS и подмена UI.
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default StyleInjectionPlayInner;
