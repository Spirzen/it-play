import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';

const QUESTIONS = [
  {q: 'ChatGPT обладает сознанием и понимает мир как человек.', a: 'myth', e: 'LLM — статистическая модель текста, без субъективного опыта.'},
  {q: 'Нейросеть может классифицировать спам в почте.', a: 'reality', e: 'Узкий ИИ на ML — реальная продакшен-задача.'},
  {q: 'AGI можно купить в облаке у OpenAI.', a: 'myth', e: 'AGI — исследовательская цель; в продаже только узкие модели.'},
  {q: 'LLM иногда выдаёт уверенные, но ложные факты (галлюцинации).', a: 'reality', e: 'Галлюцинации — известное ограничение; нужны проверка и RAG.'},
  {q: 'Любая кнопка «AI» в приложении использует нейросеть.', a: 'myth', e: 'Часто внутри обычные if-else или простые правила.'},
  {q: 'Fine-tuning адаптирует модель под конкретную задачу.', a: 'reality', e: 'Донастройка весов — стандартная инженерная практика.'},
  {q: 'ИИ заменит все профессии в ближайшие 2 года.', a: 'myth', e: 'Меняются задачи и инструменты; полная замена — маркетинговый перегиб.'},
  {q: 'Токен — единица, с которой работает LLM, не обязательно целое слово.', a: 'reality', e: 'Subword-токенизация дробит редкие слова на части.'},
  {q: 'Модель «думает» перед ответом, как человек.', a: 'myth', e: 'Инференс — последовательная генерация токенов без явного планирования.'},
  {q: 'RAG подмешивает факты из ваших документов в промпт.', a: 'reality', e: 'Retrieval-Augmented Generation — рабочий паттерн для корпоративных знаний.'},
];

function MythOrRealityQuizInner() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const progress = ((idx + (picked ? 1 : 0)) / total) * 100;

  const answer = (choice) => {
    if (picked) return;
    if (choice === q.a) setScore((s) => s + 1);
    setPicked(choice);
  };

  const next = () => {
    if (idx + 1 >= total) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  };

  const feedback = useMemo(() => {
    if (!picked) return null;
    const ok = picked === q.a;
    return ok ? `Верно! ${q.e}` : `Нет: это ${q.a === 'myth' ? 'миф' : 'реальность'}. ${q.e}`;
  }, [picked, q]);

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <DemoShell className={shared.root}>
        <DemoCard title="Миф или реальность?" subtitle="Итог викторины">
          <div className={shared.statGrid}>
            <div className={shared.statBox}>
              <span className={shared.statValue}>{score}</span>
              <span className={shared.statLabel}>из {total} верно</span>
            </div>
            <div className={shared.statBox}>
              <span className={shared.statValue}>{pct}%</span>
              <span className={shared.statLabel}>результат</span>
            </div>
          </div>
          <p className={shared.hint}>
            {score >= 8 ? 'Отлично — вы отделяете маркетинг от инженерии.' : score >= 5 ? 'Неплохо — перечитайте главу про мифы.' : 'Вернитесь к базовым определениям ML и LLM.'}
          </p>
          <div className={shared.controls}>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={restart}>
              Пройти снова
            </button>
          </div>
        </DemoCard>
      </DemoShell>
    );
  }

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Миф или реальность?" subtitle={`Вопрос ${idx + 1} из ${total}`}>
        <div className={shared.progressTrack}>
          <div className={shared.progressFill} style={{width: `${progress}%`}} />
        </div>
        <p className={shared.questionCard}>{q.q}</p>
        <div className={shared.controls}>
          <button
            type="button"
            className={clsx('it-demo__btn', shared.choiceBtn, picked === 'myth' && (q.a === 'myth' ? shared.choiceOk : shared.choiceBad))}
            onClick={() => answer('myth')}
            disabled={!!picked}
          >
            Миф
          </button>
          <button
            type="button"
            className={clsx('it-demo__btn', shared.choiceBtn, picked === 'reality' && (q.a === 'reality' ? shared.choiceOk : shared.choiceBad))}
            onClick={() => answer('reality')}
            disabled={!!picked}
          >
            Реальность
          </button>
        </div>
        {feedback && <p className={clsx(picked === q.a ? shared.feedbackOk : shared.feedbackBad)}>{feedback}</p>}
        {picked && (
          <div className={shared.controls}>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={next}>
              {idx + 1 >= total ? 'Итог' : 'Далее'}
            </button>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default MythOrRealityQuizInner;
