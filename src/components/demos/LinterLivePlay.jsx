import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {LINTER_LANGS, LINTER_SAMPLES, LINTERS} from '@/components/shared/kb/toolsTestingData';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './linterLivePlay.module.css';

function LinterLivePlayInner() {
  const [lang, setLang] = useState('js');
  const [fixed, setFixed] = useState(false);
  const sample = LINTER_SAMPLES[lang];

  const code = fixed ? sample.good : sample.bad;
  const issues = fixed
    ? []
    : sample.rules.map((r, i) => ({id: r, line: i + 1, msg: `Правило ${r}: нарушение стиля`}));

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Линтер в действии"
        subtitle="Переключите язык, посмотрите замечания и примените автоисправление"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {LINTER_LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(toolStyles.chip, lang === l.id && toolStyles.chipActive)}
              onClick={() => {
                setLang(l.id);
                setFixed(false);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className={styles.editorWrap}>
          <pre className={styles.code} aria-label="Пример кода">
            {code.split('\n').map((line, i) => (
              <div key={i} className={clsx(styles.line, issues.some((x) => x.line === i + 1) && styles.lineBad)}>
                <span className={styles.ln}>{i + 1}</span>
                <code>{line || ' '}</code>
              </div>
            ))}
          </pre>
          <aside className={styles.issues} aria-label="Замечания линтера">
            <strong>Issues ({issues.length})</strong>
            {issues.length === 0 ? (
              <p className={styles.ok}>✓ Линтер доволен</p>
            ) : (
              <ul>
                {issues.map((iss) => (
                  <li key={iss.id}>{iss.msg}</li>
                ))}
              </ul>
            )}
            <p className={styles.tools}>
              Инструменты: {sample.tools.join(', ')}
            </p>
          </aside>
        </div>

        <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => setFixed(true)}
            disabled={fixed}
          >
            Автоисправить (как Prettier / Ruff)
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => setFixed(false)}
          >
            Вернуть "плохой" код
          </button>
        </div>

        <div className={styles.linterGrid}>
          {LINTERS.map((l) => (
            <span key={l.id} className={styles.badge} title={l.note}>
              {l.name}
            </span>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LinterLivePlayInner;
