import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LANG_OPTIONS,
  NAMING_STYLES,
  buildIdentifier,
} from '@/components/shared/kb/namingConventionEngine';
import styles from '@/components/demos/NamingConventionPlay.module.css';

function NamingConventionPlayInner() {
  const [styleId, setStyleId] = useState('camel');
  const [lang, setLang] = useState('csharp');
  const [wordsInput, setWordsInput] = useState('user account total');

  const built = useMemo(() => buildIdentifier(styleId, wordsInput), [styleId, wordsInput]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Стили именования в действии"
        subtitle="Введите слова сущности — увидите идентификатор и типичное применение в коде"
      >
        <label className="it-demo__label">Слова (через пробел)</label>
        <input
          className={clsx('it-demo__input', styles.wordsInput)}
          value={wordsInput}
          onChange={(e) => setWordsInput(e.target.value)}
          placeholder="user account total"
        />

        <div className="it-demo__tabs" role="tablist" style={{marginTop: '0.75rem'}}>
          {NAMING_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              className={clsx('it-demo__tab', styleId === s.id && 'it-demo__tab--active')}
              onClick={() => setStyleId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="it-demo__hint">{built.style.hint}</p>

        <div className={styles.resultBox}>
          <span className={styles.resultLabel}>Идентификатор</span>
          <code className={styles.resultCode}>{built.identifier}</code>
        </div>

        <div className={styles.chips}>
          {LANG_OPTIONS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.chip, lang === l.id && styles.chipActive)}
              onClick={() => setLang(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <pre className={styles.pre}>{built.style.examples[lang]}</pre>
      </DemoCard>
    </DemoShell>
  );
}

export default NamingConventionPlayInner;
