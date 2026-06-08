import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/NetiquettePlay.module.css';

const SCENARIOS = [
  {
    id: 'caps',
    prompt: 'Тема на форуме: "ПОМОГИТЕ СРОЧНО!!!" без деталей',
    choices: [
      {id: 'a', text: 'Ответить тем же: "ТЫ ТУПОЙ???"', ok: false, why: 'Капс и агрессия повышают шум, не помогают решить задачу.'},
      {id: 'b', text: 'Попросить модель, ОС, текст ошибки, шаги воспроизведения', ok: true, why: 'Снижает когнитивную нагрузку — классический нетикет Usenet.'},
      {id: 'c', text: 'Проигнорировать и писать "читай FAQ" без ссылки', ok: false, why: 'Пассивная агрессия отталкивает новичков.'},
    ],
  },
  {
    id: 'cross',
    prompt: 'В чужой ветке обсуждения Linux кто-то спрашивает про Excel',
    choices: [
      {id: 'a', text: 'Вставить оффтоп про Excel в ту же ветку', ok: false, why: 'Нарушает тематическую целостность — флуд.'},
      {id: 'b', text: 'Создать новую тему или дать ссылку на релевантный раздел', ok: true, why: 'Уважение к архиву и времени участников.'},
      {id: 'c', text: 'Ответить сарказмом "иди в гугл"', ok: false, why: 'Токсичность без конструктива.'},
    ],
  },
  {
    id: 'quote',
    prompt: 'Длинная переписка в почте — нужно ответить на один пункт',
    choices: [
      {id: 'a', text: 'Ответить без цитирования, как будто все помнят контекст', ok: false, why: 'Увеличивает путаницу в асинхронной переписке.'},
      {id: 'b', text: 'Процитировать только нужный фрагмент и ответить по пунктам', ok: true, why: 'Точечное цитирование — база нетикета.'},
      {id: 'c', text: 'Переслать всю цепочку из 40 писем', ok: false, why: 'Засоряет канал, раздражает получателя.'},
    ],
  },
];

function NetiquettePlayInner() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const scenario = SCENARIOS[idx];
  const done = idx >= SCENARIOS.length;

  const choose = (choice) => {
    if (picked) return;
    setPicked(choice.id);
    if (choice.ok) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIdx((i) => i + 1);
  };

  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
  };

  if (done) {
    return (
      <DemoShell className={styles.root}>
        <DemoCard title="Нетикет — итог" subtitle={`Верных ответов: ${score} из ${SCENARIOS.length}`}>
          <p className={styles.result}>
            {score === SCENARIOS.length
              ? 'Отлично: вы снижаете шум и уважаете время собеседников.'
              : 'Пересмотрите сценарии — нетикет разный в каждом сообществе, но принцип "меньше нагрузки на читателя" общий.'}
          </p>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={reset}>
            Пройти снова
          </button>
        </DemoCard>
      </DemoShell>
    );
  }

  const feedback = picked && scenario.choices.find((c) => c.id === picked);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Тренажёр нетикета"
        subtitle={`Ситуация ${idx + 1} из ${SCENARIOS.length}`}
      >
        <p className={styles.prompt}>{scenario.prompt}</p>
        <div className={styles.choices}>
          {scenario.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(
                styles.choice,
                picked === c.id && (c.ok ? styles.ok : styles.bad),
                picked && picked !== c.id && styles.dim,
              )}
              onClick={() => choose(c)}
              disabled={!!picked}
            >
              {c.text}
            </button>
          ))}
        </div>
        {feedback && (
          <p className={clsx(styles.feedback, feedback.ok ? styles.ok : styles.bad)}>
            {feedback.why}
          </p>
        )}
        {picked && (
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={next}>
            Далее
          </button>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default NetiquettePlayInner;
