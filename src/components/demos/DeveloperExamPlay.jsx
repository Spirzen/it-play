import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {demoSkeletonFallback} from '@/components/shared/demoFallback';
import styles from '@/components/demos/DeveloperExamPlay.module.css';

const LEVELS = {
  junior: {
    title: 'Junior-разработчик',
    badge: 'JUN',
    accent: '#22c55e',
    examMinutes: 120,
    passScore: 70,
    sprintCount: 25,
  },
  middle: {
    title: 'Middle-разработчик',
    badge: 'MID',
    accent: '#3b82f6',
    examMinutes: 90,
    passScore: 75,
    sprintCount: 20,
  },
  senior: {
    title: 'Senior-разработчик',
    badge: 'SR',
    accent: '#a855f7',
    examMinutes: 60,
    passScore: 80,
    sprintCount: 15,
  },
};

const RATINGS = [
  {id: 'know', label: 'Знаю', icon: '✓', classKey: 'Know'},
  {id: 'partial', label: 'Частично', icon: '~', classKey: 'Partial'},
  {id: 'unknown', label: 'Не знаю', icon: '✗', classKey: 'Unknown'},
  {id: 'skip', label: 'Пропуск', icon: '⏭', classKey: 'Skip'},
];

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function computeScore(answers, questionIds) {
  let points = 0;
  let max = 0;
  questionIds.forEach((id) => {
    const r = answers[id];
    if (!r || r === 'skip') {
      return;
    }
    max += 2;
    if (r === 'know') {
      points += 2;
    } else if (r === 'partial') {
      points += 1;
    }
  });
  if (max === 0) {
    return 0;
  }
  return Math.round((points / max) * 100);
}

function countByRating(answers) {
  const counts = {know: 0, partial: 0, unknown: 0, skip: 0};
  Object.values(answers).forEach((r) => {
    if (r && counts[r] !== undefined) {
      counts[r] += 1;
    }
  });
  return counts;
}

export default function DeveloperExamPlay({
  level = 'junior',
  sections: initialSections = [],
  questions: initialQuestions = [],
}) {
  const config = LEVELS[level] ?? LEVELS.junior;
  const storageKey = `it-developer-exam-${level}`;

  const [loadStatus, setLoadStatus] = useState('loading');
  const [sections, setSections] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [screen, setScreen] = useState('hub');
  const [mode, setMode] = useState('practice');
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [fading, setFading] = useState(false);
  const [sectionFilter, setSectionFilter] = useState('all');
  const [showOnly, setShowOnly] = useState('all');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!initialQuestions?.length) {
      const timer = window.setTimeout(() => setLoadStatus('empty'), 1500);
      return () => window.clearTimeout(timer);
    }

    setSections(initialSections ?? []);
    setAllQuestions(initialQuestions);
    setLoadStatus('ready');

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.answers && typeof saved.answers === 'object') {
          setAnswers(saved.answers);
        }
        if (saved.bookmarks && typeof saved.bookmarks === 'object') {
          setBookmarks(saved.bookmarks);
        }
      }
    } catch {
      /* ignore */
    }

    return undefined;
  }, [initialSections, initialQuestions, storageKey]);

  useEffect(() => {
    if (loadStatus !== 'ready') {
      return;
    }
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({answers, bookmarks, updatedAt: Date.now()}),
      );
    } catch {
      /* ignore */
    }
  }, [answers, bookmarks, loadStatus, storageKey]);

  const filteredPool = useMemo(() => {
    let pool = allQuestions;
    if (sectionFilter !== 'all') {
      pool = pool.filter((q) => q.sectionId === sectionFilter);
    }
    if (showOnly === 'unanswered') {
      pool = pool.filter((q) => !answers[q.id]);
    } else if (showOnly === 'bookmarks') {
      pool = pool.filter((q) => bookmarks[q.id]);
    } else if (showOnly === 'weak') {
      pool = pool.filter((q) => answers[q.id] === 'unknown' || answers[q.id] === 'partial');
    }
    return pool;
  }, [allQuestions, sectionFilter, showOnly, answers, bookmarks]);

  const startSession = useCallback(
    (nextMode) => {
      let pool = filteredPool.length ? filteredPool : allQuestions;
      if (nextMode === 'sprint') {
        pool = shuffleArray(allQuestions).slice(0, Math.min(config.sprintCount, allQuestions.length));
      } else if (nextMode === 'exam') {
        pool = [...allQuestions];
      } else {
        pool = [...pool];
      }
      if (nextMode !== 'exam') {
        pool = shuffleArray(pool);
      }
      setMode(nextMode);
      setQueue(pool);
      setIndex(0);
      setScreen('active');
      if (nextMode === 'exam') {
        setSecondsLeft(config.examMinutes * 60);
      }
    },
    [allQuestions, filteredPool, config.examMinutes, config.sprintCount],
  );

  useEffect(() => {
    if (screen !== 'active' || mode !== 'exam' || secondsLeft <= 0) {
      return undefined;
    }
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(timerRef.current);
          setScreen('results');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerRef.current);
  }, [screen, mode, secondsLeft]);

  const current = queue[index];
  const answeredCount = Object.keys(answers).filter((id) => answers[id] && answers[id] !== 'skip').length;
  const progressPct = allQuestions.length
    ? Math.round((answeredCount / allQuestions.length) * 100)
    : 0;
  const sessionPct = queue.length ? Math.round(((index + 1) / queue.length) * 100) : 0;

  const goTo = useCallback(
    (nextIndex) => {
      if (nextIndex < 0 || nextIndex >= queue.length) {
        return;
      }
      setFading(true);
      window.setTimeout(() => {
        setIndex(nextIndex);
        setFading(false);
      }, 160);
    },
    [queue.length],
  );

  const setRating = useCallback(
    (rating) => {
      if (!current) {
        return;
      }
      setAnswers((prev) => ({...prev, [current.id]: rating}));
      if (index < queue.length - 1) {
        goTo(index + 1);
      } else {
        setScreen('results');
      }
    },
    [current, index, queue.length, goTo],
  );

  const toggleBookmark = useCallback(() => {
    if (!current) {
      return;
    }
    setBookmarks((prev) => ({...prev, [current.id]: !prev[current.id]}));
  }, [current]);

  const resetAll = useCallback(() => {
    setAnswers({});
    setBookmarks({});
    setScreen('hub');
    setQueue([]);
    setIndex(0);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    if (screen !== 'active') {
      return undefined;
    }
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        return;
      }
      if (e.key === '1') {
        setRating('know');
      } else if (e.key === '2') {
        setRating('partial');
      } else if (e.key === '3') {
        setRating('unknown');
      } else if (e.key === '4' || e.key === 's') {
        setRating('skip');
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === 'ArrowLeft') {
        goTo(index - 1);
      } else if (e.key === 'b') {
        toggleBookmark();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, setRating, goTo, index, toggleBookmark]);

  const finalScore = useMemo(
    () => computeScore(answers, allQuestions.map((q) => q.id)),
    [answers, allQuestions],
  );

  const counts = useMemo(() => countByRating(answers), [answers]);

  if (loadStatus === 'loading') {
    return demoSkeletonFallback();
  }

  if (loadStatus === 'empty') {
    return (
      <DemoShell className={styles.root} data-exam-play>
        <DemoCard title="Интерактивный экзамен">
          <div className="it-demo__alert it-demo__alert--error">
            Не удалось найти нумерованные вопросы на странице. Убедитесь, что списки оформлены как
            1., 2., 3. под заголовками разделов.
          </div>
        </DemoCard>
      </DemoShell>
    );
  }

  if (screen === 'hub') {
    return (
      <DemoShell
        className={styles.root}
        data-exam-play
        style={{'--exam-accent': config.accent}}
      >
        <DemoCard
          title={`Экзамен · ${config.title}`}
          subtitle={`${allQuestions.length} вопросов · ${sections.length} разделов · самопроверка с прогрессом`}
        >
          <div className={styles.hero}>
            <span className={styles.levelBadge}>{config.badge}</span>
            <span className={styles.poolBadge}>
              Отвечено: {answeredCount} / {allQuestions.length} ({progressPct}%)
            </span>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressMeta}>
              <span>Общий прогресс</span>
              <span>
                ✓ {counts.know} · ~ {counts.partial} · ✗ {counts.unknown}
              </span>
            </div>
            <div className={styles.progressBar} aria-hidden>
              <div className={styles.progressFill} style={{width: `${progressPct}%`}} />
            </div>
          </div>

          <div className={styles.filterRow}>
            <span style={{fontSize: '0.78rem', color: 'var(--demo-muted)'}}>Раздел:</span>
            <button
              type="button"
              className={clsx(styles.filterChip, sectionFilter === 'all' && styles.filterChipActive)}
              onClick={() => setSectionFilter('all')}
            >
              Все
            </button>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                className={clsx(
                  styles.filterChip,
                  sectionFilter === s.id && styles.filterChipActive,
                )}
                onClick={() => setSectionFilter(s.id)}
              >
                {s.title.replace(/^Раздел\s+\d+\.\s*/i, '').slice(0, 28)}
                {s.title.length > 28 ? '…' : ''}
              </button>
            ))}
          </div>

          <div className={styles.filterRow}>
            <span style={{fontSize: '0.78rem', color: 'var(--demo-muted)'}}>Показать:</span>
            {[
              ['all', 'Все'],
              ['unanswered', 'Без ответа'],
              ['weak', 'Слабые'],
              ['bookmarks', 'Закладки'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={clsx(styles.filterChip, showOnly === id && styles.filterChipActive)}
                onClick={() => setShowOnly(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.hubModes}>
            <button type="button" className={styles.hubModeCard} onClick={() => startSession('practice')}>
              <p className={styles.hubModeTitle}>Тренировка</p>
              <p className={styles.hubModeDesc}>
                Свободная навигация, перемешивание, закладки. Идеально для ежедневной подготовки.
              </p>
            </button>
            <button type="button" className={styles.hubModeCard} onClick={() => startSession('exam')}>
              <p className={styles.hubModeTitle}>Экзамен</p>
              <p className={styles.hubModeDesc}>
                {config.examMinutes} мин на все {allQuestions.length} вопросов по порядку. Порог:{' '}
                {config.passScore}%.
              </p>
            </button>
            <button type="button" className={styles.hubModeCard} onClick={() => startSession('sprint')}>
              <p className={styles.hubModeTitle}>Спринт</p>
              <p className={styles.hubModeDesc}>
                {Math.min(config.sprintCount, allQuestions.length)} случайных вопросов — быстрая
                проверка перед собеседованием.
              </p>
            </button>
          </div>

          {answeredCount > 0 && (
            <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary"
                onClick={() => {
                  setScreen('results');
                  setQueue(allQuestions);
                }}
              >
                Итоги ({finalScore}%)
              </button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={resetAll}>
                Сбросить прогресс
              </button>
            </div>
          )}

          <p className={styles.footnote} style={{marginTop: '0.75rem'}}>
            Оценивайте себя честно: "Знаю" — готовы объяснить на собеседовании; "Частично" — нужно
            повторить; "Не знаю" — в план обучения.
          </p>
        </DemoCard>
      </DemoShell>
    );
  }

  if (screen === 'results') {
    const passed = finalScore >= config.passScore;
    return (
      <DemoShell
        className={styles.root}
        data-exam-play
        style={{'--exam-accent': config.accent}}
      >
        <DemoCard title="Результаты экзамена" subtitle={config.title}>
          <div
            className={clsx(
              styles.resultsRing,
              passed ? styles.resultsPass : styles.resultsFail,
            )}
          >
            <span className={styles.resultsScore}>{finalScore}%</span>
            <span className={styles.resultsLabel}>
              {passed ? 'Порог пройден' : `Нужно ${config.passScore}%`}
            </span>
          </div>

          <div className={styles.statsGrid}>
            <div className={clsx(styles.statBox, styles.statKnow)}>
              <strong>{counts.know}</strong>
              Знаю
            </div>
            <div className={clsx(styles.statBox, styles.statPartial)}>
              <strong>{counts.partial}</strong>
              Частично
            </div>
            <div className={clsx(styles.statBox, styles.statUnknown)}>
              <strong>{counts.unknown}</strong>
              Не знаю
            </div>
            <div className={styles.statBox}>
              <strong>{allQuestions.length - answeredCount}</strong>
              Без оценки
            </div>
          </div>

          {sections.length > 0 && (
            <div style={{fontSize: '0.85rem', marginBottom: '1rem'}}>
              <strong style={{display: 'block', marginBottom: '0.5rem'}}>По разделам</strong>
              {sections.map((sec) => {
                const secQs = allQuestions.filter((q) => q.sectionId === sec.id);
                const secScore = computeScore(
                  answers,
                  secQs.map((q) => q.id),
                );
                return (
                  <div
                    key={sec.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.35rem 0',
                      borderBottom: '1px solid var(--demo-border)',
                    }}
                  >
                    <span style={{flex: 1, paddingRight: '0.5rem'}}>
                      {sec.title.replace(/^Раздел\s+\d+\.\s*/i, '')}
                    </span>
                    <strong>{secScore}%</strong>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center'}}>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={() => startSession('practice')}
            >
              Продолжить тренировку
            </button>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => setScreen('hub')}
            >
              В меню
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={resetAll}>
              Сбросить всё
            </button>
          </div>
        </DemoCard>
      </DemoShell>
    );
  }

  const currentRating = current ? answers[current.id] : null;

  return (
    <DemoShell
      className={styles.root}
      data-exam-play
      style={{'--exam-accent': config.accent}}
    >
      <DemoCard
        title={`${config.badge} · ${mode === 'exam' ? 'Экзамен' : mode === 'sprint' ? 'Спринт' : 'Тренировка'}`}
        subtitle={mode === 'exam' ? 'Вопросы по порядку · оцените себя после размышления' : undefined}
      >
        <div className={styles.hero}>
          <span className={styles.levelBadge}>{config.badge}</span>
          {mode === 'exam' && (
            <span
              className={clsx(styles.timer, secondsLeft < 300 && styles.timerUrgent)}
              aria-live="polite"
            >
              {formatTime(secondsLeft)}
            </span>
          )}
        </div>

        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span>
              Вопрос {index + 1} / {queue.length}
            </span>
            <span>{sessionPct}% сессии</span>
          </div>
          <div className={styles.progressBar} aria-hidden>
            <div className={styles.progressFill} style={{width: `${sessionPct}%`}} />
          </div>
        </div>

        {current && (
          <>
            <p className={styles.sectionLabel}>
              {current.sectionTitle.replace(/^Раздел\s+\d+\.\s*/i, '')}
            </p>
            <div className={clsx(styles.questionCard, fading && styles.questionCardFading)}>
              <span className={styles.questionNum}>№ {current.number}</span>
              <p className={styles.questionText}>{current.text}</p>
            </div>

            <div className={styles.ratingRow}>
              {RATINGS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={clsx(
                    styles.ratingBtn,
                    styles[`ratingBtn${r.classKey}`],
                    currentRating === r.id && styles[`ratingBtn${r.classKey}Active`],
                    r.id === 'skip' && currentRating === 'skip' && styles.ratingBtnSkipActive,
                  )}
                  onClick={() => setRating(r.id)}
                >
                  <span className={styles.ratingIcon} aria-hidden>
                    {r.icon}
                  </span>
                  {r.label}
                </button>
              ))}
            </div>

            <div className={styles.navRow}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary"
                disabled={index === 0}
                onClick={() => goTo(index - 1)}
              >
                ← Назад
              </button>
              <button
                type="button"
                className={clsx(
                  'it-demo__btn it-demo__btn--secondary',
                  bookmarks[current.id] && styles.bookmarkActive,
                )}
                onClick={toggleBookmark}
              >
                {bookmarks[current.id] ? '★ В закладках' : '☆ Закладка'}
              </button>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary"
                disabled={index >= queue.length - 1}
                onClick={() => goTo(index + 1)}
              >
                Далее →
              </button>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={() => setScreen('results')}
              >
                Завершить
              </button>
            </div>
          </>
        )}

        <p className={styles.footnote}>
          Клавиши: 1 — знаю, 2 — частично, 3 — не знаю, 4/S — пропуск, B — закладка, ←/→ —
          навигация
        </p>

        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          style={{marginTop: '0.5rem'}}
          onClick={() => setScreen('hub')}
        >
          В меню режимов
        </button>
      </DemoCard>
    </DemoShell>
  );
}
