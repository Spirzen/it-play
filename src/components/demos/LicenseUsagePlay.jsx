import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CITATION_TEMPLATE,
  LICENSE_BADGES,
  LICENSE_SCENARIOS,
} from '@/components/shared/kb/licenseUsageEngine';
import styles from '@/components/demos/LicenseUsagePlay.module.css';

const VERDICT_META = {
  allow: {label: 'Разрешено', className: styles.verdictAllow},
  contact: {label: 'Нужно согласование', className: styles.verdictContact},
  deny: {label: 'Не допускается', className: styles.verdictDeny},
};

function LicenseUsagePlayInner() {
  const [scenarioId, setScenarioId] = useState('read');
  const [copied, setCopied] = useState(false);

  const scenario =
    LICENSE_SCENARIOS.find((s) => s.id === scenarioId) ?? LICENSE_SCENARIOS[0];
  const verdict = VERDICT_META[scenario.verdict] ?? VERDICT_META.allow;

  const activeBadges = useMemo(
    () => scenario.requirements.map((id) => LICENSE_BADGES[id]).filter(Boolean),
    [scenario],
  );

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(CITATION_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Проверка сценария лицензии"
        subtitle="CC BY-NC-SA 4.0 — выберите, как вы хотите использовать материалы"
      >
        <div className={styles.licenseBanner}>
          <span className={styles.ccLogo} aria-hidden="true">
            CC
          </span>
          <div>
            <strong>Creative Commons BY-NC-SA 4.0</strong>
            <p className={styles.ccSub}>
              Указание автора · некоммерческое · те же условия для производных
            </p>
          </div>
          <div className={styles.ccBadges} aria-label="Условия лицензии">
            {Object.values(LICENSE_BADGES).map((b) => (
              <span key={b.short} className={styles.ccBadge} title={b.label}>
                {b.short}
              </span>
            ))}
          </div>
        </div>

        <p className="it-demo__label">Ваш сценарий</p>
        <div className={styles.scenarios}>
          {LICENSE_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(
                styles.scenarioBtn,
                scenarioId === s.id && styles.scenarioBtnActive,
              )}
              onClick={() => setScenarioId(s.id)}
            >
              <span className={styles.scenarioIcon} aria-hidden="true">
                {s.icon}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.verdictPanel}>
          <span className={clsx(styles.verdictBadge, verdict.className)}>
            {verdict.label}
          </span>
          <p className={styles.verdictText}>{scenario.summary}</p>
          {activeBadges.length > 0 && (
            <ul className={styles.reqList}>
              {activeBadges.map((b) => (
                <li key={b.short}>
                  <strong>{b.short}</strong> — {b.label}
                </li>
              ))}
            </ul>
          )}
          {scenario.verdict === 'contact' && (
            <p className={styles.contactHint}>
              Напишите автору:{' '}
              <a href="mailto:tim.tagirov@mail.ru">tim.tagirov@mail.ru</a>
            </p>
          )}
        </div>

        <div className={styles.matrix}>
          <div className={styles.matrixCol}>
            <h5 className={styles.matrixTitle}>Можно</h5>
            <ul>
              <li>Читать и изучать</li>
              <li>Цитировать с источником</li>
              <li>Учебное некоммерческое использование</li>
              <li>Производные работы (с SA)</li>
            </ul>
          </div>
          <div className={styles.matrixCol}>
            <h5 className={styles.matrixTitle}>Нельзя без разрешения</h5>
            <ul>
              <li>Коммерция и перепродажа</li>
              <li>Удаление указания автора</li>
              <li>Смена лицензии у производных</li>
            </ul>
          </div>
        </div>

        <div className={styles.citation}>
          <p className="it-demo__label">Шаблон цитирования</p>
          <pre className={styles.citationPre}>{CITATION_TEMPLATE}</pre>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={copyCitation}
          >
            {copied ? 'Скопировано ✓' : 'Копировать цитату'}
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LicenseUsagePlayInner;
