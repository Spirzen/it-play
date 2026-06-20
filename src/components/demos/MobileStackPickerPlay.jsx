import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdHint, CdMetric, CdMetricGrid, CdStack, CdVerdict} from '@/components/shared/kb/codeDevPlayKit';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const QUESTIONS = [
  {
    id: 'platforms',
    q: 'Сколько платформ нужно поддерживать?',
    options: [
      {v: 'one', label: 'Только iOS или Android', scores: {native: 3, cross: 1, pwa: 0}},
      {v: 'both', label: 'iOS + Android обязательно', scores: {native: 1, cross: 3, pwa: 1}},
      {v: 'web', label: 'Веб достаточно', scores: {native: 0, cross: 1, pwa: 3}},
    ],
  },
  {
    id: 'perf',
    q: 'Нужна ли максимальная производительность / нативный UX?',
    options: [
      {v: 'yes', label: 'Да — AR, игры, тяжёлая графика', scores: {native: 3, cross: 0, pwa: 0}},
      {v: 'mid', label: 'Средне — типичное бизнес-приложение', scores: {native: 2, cross: 2, pwa: 1}},
      {v: 'no', label: 'Нет — MVP / внутренний инструмент', scores: {native: 0, cross: 2, pwa: 2}},
    ],
  },
  {
    id: 'team',
    q: 'Какой стек у команды?',
    options: [
      {v: 'mobile', label: 'Swift/Kotlin разработчики', scores: {native: 3, cross: 0, pwa: 0}},
      {v: 'web', label: 'React / TypeScript', scores: {native: 0, cross: 3, pwa: 2}},
      {v: 'mixed', label: 'Смешанная команда', scores: {native: 1, cross: 2, pwa: 1}},
    ],
  },
];

const STACKS = {
  native: {title: 'Native (Swift + Kotlin)', desc: 'Два кодовых базиса, лучший UX и доступ к API платформы.'},
  cross: {title: 'Cross-platform (React Native / Flutter)', desc: 'Один UI-слой, нативные модули при необходимости.'},
  pwa: {title: 'PWA / Capacitor', desc: 'Веб-стек + установка на домашний экран, ограничения store/API.'},
};

function MobileStackPickerPlayInner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const scores = useMemo(() => {
    const s = {native: 0, cross: 0, pwa: 0};
    Object.values(answers).forEach((opt) => {
      Object.entries(opt.scores).forEach(([k, v]) => {
        s[k] += v;
      });
    });
    return s;
  }, [answers]);

  const winner = useMemo(() => Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'cross', [scores]);

  const q = QUESTIONS[step];

  const pick = (opt) => {
    setAnswers((prev) => ({...prev, [q.id]: opt}));
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  return (
    <DemoShell>
      <DemoCard title="Выбор мобильного стека" subtitle="Decision tree: native vs cross vs PWA">
        <CdStack>
          {!done ? (
            <>
              <p className={styles.sectionLabel}>
                Вопрос {step + 1} / {QUESTIONS.length}
              </p>
              <p className={styles.questionText}>{q.q}</p>
              <div className={styles.stackOptions}>
                {q.options.map((opt) => (
                  <button key={opt.v} type="button" className={styles.stackOption} onClick={() => pick(opt)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <CdMetricGrid>
                {Object.entries(scores).map(([k, v]) => (
                  <CdMetric key={k} label={STACKS[k].title.split(' ')[0]} value={v} tone={k === winner ? 'success' : 'default'} />
                ))}
              </CdMetricGrid>
              <CdVerdict tone="success">{STACKS[winner].title}</CdVerdict>
              <CdHint>{STACKS[winner].desc}</CdHint>
              <button type="button" className={styles.stackOption} onClick={reset}>
                Пройти заново
              </button>
            </>
          )}
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default MobileStackPickerPlayInner;
