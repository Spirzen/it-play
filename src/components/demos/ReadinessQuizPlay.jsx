import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  flattenQuestions,
  getReadinessQuiz,
} from '@/components/shared/kb/readinessQuizData';
import styles from '@/components/demos/ReadinessQuizPlay.module.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function computeBlockScores(quiz, answers) {
  const byBlock = {};
  for (const block of quiz.blocks) {
    byBlock[block.id] = {correct: 0, total: block.questions.length};
  }
  for (const block of quiz.blocks) {
    for (const q of block.questions) {
      const picked = answers[q.id];
      if (!picked) continue;
      const opt = q.options.find((o) => o.id === picked);
      if (opt?.correct) {
        byBlock[block.id].correct += 1;
      }
    }
  }
  return byBlock;
}

function getVerdict(pct, passScore) {
  if (pct >= 85) {
    return {
      title: 'Отличный результат',
      sub: 'База уверенная — можно углубляться в профильные разделы дорожной карты.',
      tone: 'excellent',
    };
  }
  if (pct >= passScore) {
    return {
      title: 'Хорошая готовность',
      sub: 'Есть пробелы — пройдите рекомендованные главы и повторите слабые блоки.',
      tone: 'good',
    };
  }
  if (pct >= 45) {
    return {
      title: 'Стоит подтянуть базу',
      sub: 'Не спешите вглубь — закрепите фундамент, затем пройдите тест снова.',
      tone: 'fair',
    };
  }
  return {
    title: 'Начните с основ',
    sub: 'Это нормально для старта — вернитесь к разделам «Основы» и пройдите тест позже.',
    tone: 'weak',
  };
}

function ReadinessQuizInner({quizId = 'programming'}) {
  const quiz = useMemo(() => getReadinessQuiz(quizId), [quizId]);
  const flat = useMemo(() => (quiz ? flattenQuestions(quiz) : []), [quiz]);
  const total = flat.length;

  const [phase, setPhase] = useState('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [picked, setPicked] = useState(null);

  const current = flat[idx];
  const answeredCount = Object.keys(answers).length;
  const progressPct = total ? Math.round((answeredCount / total) * 100) : 0;

  const restart = useCallback(() => {
    setPhase('intro');
    setIdx(0);
    setAnswers({});
    setPicked(null);
  }, []);

  const start = useCallback(() => {
    setPhase('quiz');
    setIdx(0);
    setAnswers({});
    setPicked(null);
  }, []);

  const choose = useCallback(
    (optionId) => {
      if (picked || !current) return;
      setPicked(optionId);
      setAnswers((prev) => ({...prev, [current.id]: optionId}));
    },
    [current, picked],
  );

  const next = useCallback(() => {
    if (idx + 1 >= total) {
      setPhase('results');
      setPicked(null);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  }, [idx, total]);

  const results = useMemo(() => {
    if (!quiz) return null;
    let correct = 0;
    for (const q of flat) {
      const pickedId = answers[q.id];
      const opt = q.options.find((o) => o.id === pickedId);
      if (opt?.correct) correct += 1;
    }
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const blockScores = computeBlockScores(quiz, answers);
    const weakBlocks = quiz.blocks.filter((b) => {
      const s = blockScores[b.id];
      const bp = s.total ? Math.round((s.correct / s.total) * 100) : 0;
      return bp < 67;
    });
    return {correct, pct, blockScores, weakBlocks, verdict: getVerdict(pct, quiz.passScore)};
  }, [answers, flat, quiz, total]);

  if (!quiz) {
    return (
      <DemoShell>
        <DemoCard title="Тест не найден">
          <p>Неизвестный идентификатор: <code>{quizId}</code></p>
        </DemoCard>
      </DemoShell>
    );
  }

  const rootStyle = {'--rq-accent': quiz.accent};

  if (phase === 'intro') {
    return (
      <DemoShell className={styles.root} style={rootStyle}>
        <DemoCard title={quiz.title} subtitle={quiz.subtitle}>
          <div className={styles.hero}>
            <div className={styles.heroEmoji} aria-hidden>
              {quiz.emoji}
            </div>
            <h3 className={styles.heroTitle}>{quiz.title}</h3>
            <p className={styles.heroSubtitle}>{quiz.subtitle}</p>
            <div className={styles.blockGrid}>
              {quiz.blocks.map((b) => (
                <div key={b.id} className={styles.blockChip}>
                  <span aria-hidden>{b.emoji}</span>
                  <span>{b.title}</span>
                </div>
              ))}
            </div>
            <div className={styles.actions}>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={start}>
                Начать — {total} вопросов
              </button>
            </div>
          </div>
          <p className={styles.heroSubtitle} style={{marginTop: '0.75rem', marginBottom: 0}}>
            После каждого ответа — краткое объяснение. В конце — результат по блокам и ссылки на материалы.
          </p>
        </DemoCard>
      </DemoShell>
    );
  }

  if (phase === 'results' && results) {
    const {correct, pct, blockScores, weakBlocks, verdict} = results;
    return (
      <DemoShell className={styles.root} style={rootStyle}>
        <DemoCard title="Ваш результат" subtitle={quiz.title}>
          <div className={styles.resultsHero}>
            <div className={styles.scoreRing} style={{'--score-pct': pct}}>
              <div className={styles.scoreInner}>
                <span className={styles.scoreValue}>{pct}%</span>
                <span className={styles.scoreLabel}>готовность</span>
              </div>
            </div>
            <div className={styles.statRow}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{correct}</span>
                <span className={styles.statCap}>верно</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{total - correct}</span>
                <span className={styles.statCap}>ошибок</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{total}</span>
                <span className={styles.statCap}>вопросов</span>
              </div>
            </div>
            <p className={styles.verdict}>{verdict.title}</p>
            <p className={styles.verdictSub}>{verdict.sub}</p>
          </div>

          <div className={styles.blockResults}>
            {quiz.blocks.map((block) => {
              const s = blockScores[block.id];
              const bp = s.total ? Math.round((s.correct / s.total) * 100) : 0;
              const weak = bp < 67;
              return (
                <div key={block.id} className={styles.blockRow}>
                  <span className={styles.blockRowLabel}>
                    <span aria-hidden>{block.emoji}</span>
                    {block.title}
                  </span>
                  <span className={styles.blockRowPct}>
                    {s.correct}/{s.total}
                  </span>
                  <div className={styles.blockRowBar}>
                    <div
                      className={clsx(styles.blockRowFill, weak && styles.blockRowFillWeak)}
                      style={{width: `${bp}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {(weakBlocks.length > 0 || quiz.navigatorUrl) && (
            <div className={styles.recoSection}>
              <p className={styles.recoTitle}>Что изучить дальше</p>
              <ul className={styles.recoList}>
                {weakBlocks.map((b) => {
                  const link = quiz.blockLinks?.[b.id];
                  return (
                    <li key={b.id}>
                      {link ? (
                        <>
                          <strong>{b.title}</strong> —{' '}
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.label}
                          </a>
                        </>
                      ) : (
                        <strong>{b.title}</strong>
                      )}
                    </li>
                  );
                })}
                {quiz.navigatorUrl && (
                  <li>
                    Зафиксируйте интерес в{' '}
                    <a href={quiz.navigatorUrl} target="_blank" rel="noopener noreferrer">
                      Навигаторе новичка и профилей
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={restart}>
              Пройти снова
            </button>
          </div>
        </DemoCard>
      </DemoShell>
    );
  }

  if (!current) return null;

  const selectedOpt = picked ? current.options.find((o) => o.id === picked) : null;
  const isCorrect = selectedOpt?.correct ?? false;

  return (
    <DemoShell className={styles.root} style={rootStyle}>
      <DemoCard title={quiz.title} subtitle={`Вопрос ${idx + 1} из ${total}`}>
        <div className={styles.progressHeader}>
          <span>
            Прогресс: <strong>{answeredCount}</strong> / {total}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{width: `${progressPct}%`}} />
        </div>

        <div className={styles.blockBadge}>
          <span aria-hidden>{current.blockEmoji}</span>
          {current.blockTitle}
        </div>

        <p className={styles.questionText}>{current.text}</p>

        <div className={styles.options} role="listbox" aria-label="Варианты ответа">
          {current.options.map((opt, i) => {
            const isPicked = picked === opt.id;
            const showOk = picked && opt.correct;
            const showBad = picked && isPicked && !opt.correct;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={isPicked}
                className={clsx(
                  styles.option,
                  showOk && styles.optionOk,
                  showBad && styles.optionBad,
                  picked && !isPicked && !opt.correct && styles.optionDim,
                )}
                onClick={() => choose(opt.id)}
                disabled={!!picked}
              >
                <span className={styles.optionLetter}>{LETTERS[i] ?? i + 1}</span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {picked && (
          <>
            <p className={isCorrect ? styles.feedbackOk : styles.feedbackBad}>
              {isCorrect ? '✓ Верно. ' : '✗ Неверно. '}
              {current.explanation}
            </p>
            <div className={styles.actions}>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={next}>
                {idx + 1 >= total ? 'Показать результат' : 'Далее'}
              </button>
            </div>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default function ReadinessQuizPlay({quizId = 'programming'}) {
  return <ReadinessQuizInner quizId={quizId} />;
}
