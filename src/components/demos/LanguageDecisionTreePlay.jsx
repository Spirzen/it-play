import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DECISION_STEPS, resolveLanguages} from '@/components/shared/kb/languageDecisionTreeEngine';
import {
  LpActionBar,
  LpProgress,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

function LanguageDecisionTreePlayInner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = stepIndex >= DECISION_STEPS.length;
  const step = DECISION_STEPS[stepIndex];
  const result = done ? resolveLanguages(answers) : null;

  const pick = (optionId) => {
    const next = {...answers, [step.id]: optionId};
    setAnswers(next);
    setStepIndex((i) => i + 1);
  };

  const reset = () => {
    setStepIndex(0);
    setAnswers({});
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Какой язык выбрать?"
        subtitle="Дерево решений по цели и опыту — ссылки на intro разделов"
      >
        <LpStack>
          <LpProgress
            current={done ? DECISION_STEPS.length : stepIndex}
            total={DECISION_STEPS.length}
            label={done ? 'Готово' : `Шаг ${stepIndex + 1}`}
          />

          {!done && step && (
            <LpSection label={step.question}>
              {step.options.map((opt) => (
                <button key={opt.id} type="button" className={styles.treeBtn} onClick={() => pick(opt.id)}>
                  <span>{opt.label}</span>
                  <span className={styles.treeBtnChevron} aria-hidden="true">›</span>
                </button>
              ))}
            </LpSection>
          )}

          {done && result && (
            <div className={styles.resultCard}>
              <h4 className={styles.resultTitle}>Рекомендация</h4>
              <div className={styles.resultBlock}>
                <strong>Основной:</strong>{' '}
                <a className={styles.resultLink} href={result.primary.path}>
                  {result.primary.name}
                </a>
                <p className={styles.typeMuted}>{result.primary.why}</p>
              </div>
              <div className={styles.resultBlock}>
                <strong>Альтернатива:</strong>{' '}
                <a className={styles.resultLink} href={result.secondary.path}>
                  {result.secondary.name}
                </a>
                <p className={styles.typeMuted}>{result.secondary.why}</p>
              </div>
              <LpActionBar>
                <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={reset}>
                  Начать заново
                </button>
              </LpActionBar>
            </div>
          )}
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default LanguageDecisionTreePlayInner;
