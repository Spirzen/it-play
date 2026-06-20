import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpActionBar,
  LpArrow,
  LpChip,
  LpChipRow,
  LpCode,
  LpLog,
  LpPanel,
  LpSection,
  LpStack,
  LpStep,
  LpTimeline,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const DATA = [1, 2, 3, 4, 5, 6, 7, 8];
const STAGES = ['filter', 'map', 'sorted'];
const STAGE_LABELS = {filter: 'filter ×2', map: 'map +10', sorted: 'sorted'};

function runPipeline(data, upto) {
  let cur = [...data];
  for (let i = 0; i < upto; i++) {
    const key = STAGES[i];
    if (key === 'filter') cur = cur.filter((x) => x % 2 === 0);
    else if (key === 'map') cur = cur.map((x) => x + 10);
    else if (key === 'sorted') cur = [...cur].sort((a, b) => a - b);
  }
  return cur;
}

function StreamPipelinePlayInner() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('java');

  const result = useMemo(() => runPipeline(DATA, step), [step]);
  const visible = step === 0 ? DATA : result;

  const code =
    lang === 'java'
      ? `List<Integer> out = List.of(1,2,3,4,5,6,7,8).stream()
    .filter(x -> x % 2 == 0)
    .map(x -> x + 10)
    .sorted()
    .toList();`
      : `val out = listOf(1,2,3,4,5,6,7,8).asSequence()
    .filter { it % 2 == 0 }
    .map { it + 10 }
    .sorted()
    .toList()`;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Stream pipeline"
        subtitle="Ленивые промежуточные операции — collect материализует результат"
      >
        <LpStack>
          <LpChipRow>
            <LpChip active={lang === 'java'} onClick={() => setLang('java')}>
              Java
            </LpChip>
            <LpChip active={lang === 'kotlin'} onClick={() => setLang('kotlin')}>
              Kotlin
            </LpChip>
          </LpChipRow>

          <LpCode>{code}</LpCode>

          <LpTimeline>
            <LpStep done={step > 0} active={step === 0}>
              source
            </LpStep>
            {STAGES.map((s, i) => (
              <React.Fragment key={s}>
                <LpArrow />
                <LpStep done={step > i + 1} active={step === i + 1}>
                  {STAGE_LABELS[s]}
                </LpStep>
              </React.Fragment>
            ))}
            <LpArrow />
            <LpStep active={step === STAGES.length}>collect</LpStep>
          </LpTimeline>

          <LpSection label={`Элементы (шаг ${step})`}>
            <div className={styles.chipsRow}>
              {visible.map((n, idx) => (
                <span key={`${step}-${idx}-${n}`} className={clsx(styles.dataChip, step > 0 && styles.dataChipMapped)}>
                  {n}
                </span>
              ))}
            </div>
          </LpSection>

          <LpActionBar>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
              disabled={step >= STAGES.length}
              onClick={() => setStep((s) => Math.min(s + 1, STAGES.length))}
            >
              Шаг pipeline
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={() => setStep(0)}>
              Сброс
            </button>
          </LpActionBar>

          <LpPanel title="Массив результата">[{visible.join(', ')}]</LpPanel>

          <LpLog variant={step === STAGES.length ? 'success' : 'info'}>
            {step === 0
              ? 'Промежуточные ops ещё не выполнялись (lazy).'
              : step === STAGES.length
                ? 'collect/toList — pipeline выполнен полностью.'
                : `Применён ${STAGES[step - 1]} — следующие ops ещё lazy.`}
          </LpLog>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default StreamPipelinePlayInner;
