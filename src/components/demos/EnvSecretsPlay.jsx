import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {MODES, SECRET_KEYS, scanText} from '@/components/shared/kb/envSecretsEngine';
import styles from '@/components/demos/EnvSecretsPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const SAMPLE_ENV = `DB_HOST=db.internal
DB_PASSWORD=Sup3rS3cret
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG
JWT_SECRET=my-super-secret-jwt-key-2024`;

function EnvSecretsPlayInner() {
  const [modeId, setModeId] = useState('unsafe');
  const [text, setText] = useState(SAMPLE_ENV);
  const mode = MODES[modeId];
  const hits = useMemo(() => scanText(text), [text]);

  return (
    <DemoShell>
      <DemoCard
        title="Секреты: .env vs безопасная поставка"
        subtitle="Проверьте, что попадёт в git push и что увидит сканер"
      >
        <div className={toolStyles.chips}>
          {Object.values(MODES).map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(toolStyles.chip, modeId === m.id && toolStyles.chipActive)}
              onClick={() => setModeId(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className={styles.status}>
          <span>
            .gitignore для .env:{' '}
            <strong>{mode.gitignore ? 'да ✓' : 'нет ✗'}</strong>
          </span>
          <span>
            CI: <strong>{mode.ci}</strong>
          </span>
          <span className={clsx(styles.risk, styles[`risk_${mode.risk}`])}>
            Риск утечки: {mode.risk === 'critical' ? 'критический' : 'низкий'}
          </span>
        </div>

        <label className="it-demo__label">Содержимое .env (учебный пример)</label>
        <textarea
          className={clsx('it-demo__textarea', styles.textarea)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          spellCheck={false}
        />

        {hits.length > 0 ? (
          <div className={styles.alert} role="alert">
            Сканер нашёл: {hits.join(', ')}. {modeId === 'unsafe' && 'Файл уйдёт в репозиторий!'}
            {modeId === 'safe' && 'В проде используйте секреты CI, а в репо — только .env.example без значений.'}
          </div>
        ) : (
          <p className="it-demo__hint" style={{margin: 0}}>
            Явных маркеров секретов не найдено. Для шаблона оставьте ключи без реальных значений.
          </p>
        )}

        <details className={styles.leaks}>
          <summary>Что нельзя коммитить (примеры)</summary>
          <ul>
            {SECRET_KEYS.map((s) => (
              <li key={s.key}>
                <code>{s.key}</code> → утечка в логах/истории git
              </li>
            ))}
          </ul>
        </details>
      </DemoCard>
    </DemoShell>
  );
}

export default EnvSecretsPlayInner;
