import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {demoSkeletonFallback} from '@/components/shared/demoFallback';
import {extractTableVocabulary} from '@/components/shared/kb/articleExtract';
import {
  getCategoryLabel,
  matchTranslation,
  mergeVocabulary,
  pickQuizOptions,
  shuffleArray,
} from '@/components/shared/kb/englishVocabulary';
import widgetStyles from '@/components/shared/kb/articleWidgets.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/EnglishVocabularyTrainer.module.css';

const STORAGE_KEY = 'it-english-vocab-trainer-v1';
const MODES = [
  {id: 'cards', label: 'Карточки'},
  {id: 'quiz', label: 'Викторина'},
  {id: 'type', label: 'Ввод'},
];
const DIRECTIONS = [
  {id: 'en-ru', label: 'EN → RU'},
  {id: 'ru-en', label: 'RU → EN'},
];
const SOURCES = [
  {id: 'all', label: 'Все слова'},
  {id: 'plan', label: 'Из плана'},
  {id: 'hard', label: 'Сложные'},
];
const SESSION_SIZES = [10, 20, 30];

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {known: {}, hard: {}, streak: 0, bestStreak: 0};
    }
    const data = JSON.parse(raw);
    return {
      known: data.known || {},
      hard: data.hard || {},
      streak: data.streak || 0,
      bestStreak: data.bestStreak || 0,
    };
  } catch {
    return {known: {}, hard: {}, streak: 0, bestStreak: 0};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function ModeToolbar({label, items, value, onChange}) {
  return (
    <>
      <p className={styles.sectionLabel}>{label}</p>
      <div className={styles.toolbar}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={clsx(toolStyles.chip, value === item.id && toolStyles.chipActive)}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

function EnglishVocabularyTrainerInner() {
  const [ready, setReady] = useState(false);
  const [pool, setPool] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mode, setMode] = useState('cards');
  const [direction, setDirection] = useState('en-ru');
  const [source, setSource] = useState('all');
  const [category, setCategory] = useState('all');
  const [sessionSize, setSessionSize] = useState(20);
  const [screen, setScreen] = useState('setup');
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [typeFeedback, setTypeFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [progress, setProgress] = useState(loadProgress);
  const inputRef = useRef(null);
  const liveRef = useRef(null);

  const forgotTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (forgotTimerRef.current) {
        window.clearTimeout(forgotTimerRef.current);
      }
    },
    [],
  );

  const refreshPool = useCallback(() => {
    const {items: tableItems} = extractTableVocabulary();
    const merged = mergeVocabulary(
      tableItems.map((i) => ({term: i.term, definition: i.definition})),
    );
    setPool(merged);
    const cats = [
      'all',
      ...new Set(merged.map((w) => w.category).filter(Boolean)),
    ];
    setCategories(cats);
    setReady(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refreshPool, 120);
    return () => window.clearTimeout(timer);
  }, [refreshPool]);

  const filteredPool = useMemo(() => {
    let list = pool;
    if (source === 'plan') {
      list = list.filter((w) => w.source === 'plan' || w.source === 'both');
    } else if (source === 'hard') {
      list = list.filter((w) => (progress.hard[w.term] || 0) >= 1);
    }
    if (category !== 'all') {
      list = list.filter((w) => w.category === category);
    }
    return list;
  }, [pool, source, category, progress.hard]);

  const current = queue[index] || null;
  const progressPct = queue.length
    ? Math.round(((index + 1) / queue.length) * 100)
    : 0;

  const promptSide = useMemo(() => {
    if (!current) {
      return {label: '', text: ''};
    }
    if (direction === 'ru-en') {
      return {label: 'Перевод', text: current.definition};
    }
    return {label: 'Термин', text: current.term};
  }, [current, direction]);

  const answerSide = useMemo(() => {
    if (!current) {
      return '';
    }
    return direction === 'ru-en' ? current.term : current.definition;
  }, [current, direction]);

  const announce = useCallback((message) => {
    if (liveRef.current && message) {
      liveRef.current.textContent = message;
    }
  }, []);

  const recordAnswer = useCallback(
    (ok) => {
      if (!current) {
        return;
      }
      setProgress((prev) => {
        const next = {
          known: {...prev.known},
          hard: {...prev.hard},
          streak: prev.streak,
          bestStreak: prev.bestStreak,
        };
        const key = current.term;
        if (ok) {
          next.known[key] = (next.known[key] || 0) + 1;
          next.streak += 1;
          if (next.streak > next.bestStreak) {
            next.bestStreak = next.streak;
          }
          if (next.hard[key] > 0) {
            next.hard[key] -= 1;
          }
        } else {
          next.hard[key] = (next.hard[key] || 0) + 2;
          next.streak = 0;
          setMistakes((m) => [
            ...m,
            {term: current.term, definition: current.definition},
          ]);
        }
        saveProgress(next);
        return next;
      });
      if (ok) {
        setCorrectCount((c) => c + 1);
        announce('Верно');
      } else {
        announce(`Неверно. Ответ: ${answerSide}`);
      }
    },
    [current, answerSide, announce],
  );

  const startSession = useCallback(() => {
    if (!filteredPool.length) {
      return;
    }
    const size = Math.min(sessionSize, filteredPool.length);
    const nextQueue = shuffleArray(filteredPool).slice(0, size);
    setQueue(nextQueue);
    setIndex(0);
    setFlipped(false);
    setPicked(null);
    setTyped('');
    setTypeFeedback(null);
    setCorrectCount(0);
    setMistakes([]);
    setScreen('play');
  }, [filteredPool, sessionSize]);

  const resetProgress = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Сбросить прогресс "Знаю" и "Сложные"? Серия и рекорд тоже обнулятся.')
    ) {
      return;
    }
    const empty = {known: {}, hard: {}, streak: 0, bestStreak: 0};
    saveProgress(empty);
    setProgress(empty);
  }, []);

  useEffect(() => {
    if (screen !== 'play' || mode !== 'quiz' || !current) {
      return;
    }
    const answerPool =
      direction === 'ru-en'
        ? filteredPool.map((w) => ({...w, quizText: w.term}))
        : filteredPool.map((w) => ({...w, quizText: w.definition}));
    const correct = {
      ...current,
      quizText: direction === 'ru-en' ? current.term : current.definition,
    };
    const options = pickQuizOptions(answerPool, correct, 4).map((o) => ({
      id: o.term,
      text: o.quizText,
      isCorrect: o.term === current.term,
    }));
    setQuizOptions(options);
    setPicked(null);
  }, [screen, mode, current, direction, filteredPool]);

  const goNext = useCallback(() => {
    if (index >= queue.length - 1) {
      setScreen('results');
      return;
    }
    setIndex((i) => i + 1);
    setFlipped(false);
    setPicked(null);
    setTyped('');
    setTypeFeedback(null);
  }, [index, queue.length]);

  const handleQuizPick = useCallback(
    (option) => {
      if (picked) {
        return;
      }
      setPicked(option.id);
      recordAnswer(option.isCorrect);
    },
    [picked, recordAnswer],
  );

  const handleForgot = () => {
    setFlipped(true);
    recordAnswer(false);
    if (forgotTimerRef.current) {
      window.clearTimeout(forgotTimerRef.current);
    }
    forgotTimerRef.current = window.setTimeout(goNext, 900);
  };

  const handleTypeSubmit = (e) => {
    e.preventDefault();
    if (!current || typeFeedback) {
      return;
    }
    const expected = direction === 'ru-en' ? current.term : current.definition;
    const ok = matchTranslation(typed, expected);
    setTypeFeedback(ok ? 'ok' : 'bad');
    recordAnswer(ok);
  };

  useEffect(() => {
    if (screen !== 'play' || mode !== 'type') {
      return undefined;
    }
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Enter' && typeFeedback) {
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, mode, typeFeedback, goNext]);

  useEffect(() => {
    if (screen !== 'play') {
      return undefined;
    }
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        return;
      }
      if (mode === 'cards') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!flipped) {
            setFlipped(true);
          } else {
            recordAnswer(true);
            goNext();
          }
        }
      } else if (mode === 'quiz' && !picked) {
        const num = Number(e.key);
        if (num >= 1 && num <= quizOptions.length) {
          e.preventDefault();
          handleQuizPick(quizOptions[num - 1]);
        }
      } else if (mode === 'quiz' && picked && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, mode, flipped, picked, goNext, quizOptions, handleQuizPick, recordAnswer]);

  if (!ready) {
    return demoSkeletonFallback();
  }

  if (!pool.length) {
    return (
      <DemoShell className={styles.root}>
        <DemoCard title="Англо-русский тренажёр" subtitle="Словарь пока недоступен.">
          <p className={styles.emptyState}>
            Не удалось загрузить слова. Откройте страницу со словарём или попробуйте обновить сайт.
          </p>
        </DemoCard>
      </DemoShell>
    );
  }

  const knownCount = Object.keys(progress.known).length;
  const hardCount = Object.values(progress.hard).filter((n) => n >= 1).length;

  if (screen === 'results') {
    const total = queue.length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    return (
      <DemoShell className={styles.root}>
        <DemoCard title="Сессия завершена" subtitle={`Режим: ${MODES.find((m) => m.id === mode)?.label}`}>
          <div className={styles.resultBox}>
            <p className={styles.resultScore}>{pct}%</p>
            <p className={styles.resultText}>
              Верно {correctCount} из {total}. Серия: {progress.streak} (рекорд {progress.bestStreak})
            </p>
          </div>
          {mistakes.length > 0 && (
            <ul className={styles.mistakeList}>
              {mistakes.slice(0, 8).map((m) => (
                <li key={m.term}>
                  <strong>{m.term}</strong> — {m.definition}
                </li>
              ))}
            </ul>
          )}
          <div className={styles.actions}>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={startSession}>
              Ещё раз
            </button>
            <button type="button" className="it-demo__btn" onClick={() => setScreen('setup')}>
              Настройки
            </button>
          </div>
        </DemoCard>
      </DemoShell>
    );
  }

  if (screen === 'setup') {
    return (
      <DemoShell className={styles.root}>
        <DemoCard
          title="Англо-русский тренажёр"
          subtitle="Карточки, викторина и ввод перевода — слова из таблицы и учебного плана."
        >
          <span className={widgetStyles.poolBadge}>
            В базе: {pool.length} · доступно: {filteredPool.length || '—'}
          </span>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{knownCount}</span>
              <span className={styles.statLabel}>Знаю</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{hardCount}</span>
              <span className={styles.statLabel}>Сложные</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{progress.bestStreak}</span>
              <span className={styles.statLabel}>Рекорд</span>
            </div>
          </div>

          <ModeToolbar label="Режим" items={MODES} value={mode} onChange={setMode} />
          <ModeToolbar label="Направление" items={DIRECTIONS} value={direction} onChange={setDirection} />

          <div className={styles.selectRow}>
            <label>
              Источник
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                {SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Тема
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">Все темы</option>
                {categories
                  .filter((c) => c !== 'all')
                  .map((c) => (
                    <option key={c} value={c}>
                      {getCategoryLabel(c)}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Слов за сессию
              <select
                value={sessionSize}
                onChange={(e) => setSessionSize(Number(e.target.value))}
              >
                {SESSION_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.setupFooter}>
            <button
              type="button"
              className={clsx('it-demo__btn it-demo__btn--primary', styles.btnBlock)}
              disabled={!filteredPool.length}
              onClick={startSession}
            >
              {filteredPool.length
                ? `Начать (${Math.min(sessionSize, filteredPool.length)} слов)`
                : 'Нет слов для выбранных фильтров'}
            </button>
            {(knownCount > 0 || hardCount > 0) && (
              <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={resetProgress}>
                Сбросить прогресс
              </button>
            )}
          </div>
        </DemoCard>
      </DemoShell>
    );
  }

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={MODES.find((m) => m.id === mode)?.label}
        subtitle={`${index + 1} / ${queue.length} · ${DIRECTIONS.find((d) => d.id === direction)?.label}`}
      >
        <div
          ref={liveRef}
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        />
        <div className={styles.playMeta}>
          <span>Верно в сессии: {correctCount}</span>
          {progress.streak > 0 && (
            <span className={styles.streakBadge} title="Текущая серия без ошибок">
              🔥 {progress.streak}
            </span>
          )}
        </div>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.progressFill} style={{width: `${progressPct}%`}} />
        </div>

        {mode === 'cards' && current && (
          <>
            <div className={styles.cardStage}>
              <div
                className={clsx(styles.flipCard, flipped && styles.flipCardFlipped)}
                role="button"
                tabIndex={0}
                aria-label={flipped ? `Ответ: ${answerSide}` : `${promptSide.label}: ${promptSide.text}`}
                onClick={() => setFlipped((f) => !f)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFlipped((f) => !f);
                  }
                }}
              >
                <div className={clsx(styles.flipFace, styles.flipFront)}>
                  <p className={styles.promptLabel}>{promptSide.label}</p>
                  <p className={styles.promptText}>{promptSide.text}</p>
                  <p className={styles.promptSub}>Нажмите, чтобы перевернуть · Пробел</p>
                  {current.category && (
                    <span className={styles.categoryTag}>{getCategoryLabel(current.category)}</span>
                  )}
                </div>
                <div className={clsx(styles.flipFace, styles.flipBack)}>
                  <p className={styles.promptLabel}>Ответ</p>
                  <p className={styles.promptText}>{answerSide}</p>
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <button type="button" className="it-demo__btn" onClick={handleForgot}>
                Не помню
              </button>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={() => {
                  if (!flipped) {
                    setFlipped(true);
                    return;
                  }
                  recordAnswer(true);
                  goNext();
                }}
              >
                {flipped ? 'Знаю →' : 'Показать ответ'}
              </button>
            </div>
          </>
        )}

        {mode === 'quiz' && current && (
          <>
            <div className={styles.promptBlock}>
              <p className={styles.promptLabel}>{promptSide.label}</p>
              <p className={styles.promptText}>{promptSide.text}</p>
            </div>
            {quizOptions.length > 1 && (
              <p className={styles.quizHint}>Клавиши 1–{quizOptions.length} для быстрого выбора</p>
            )}
            <div className={styles.quizGrid}>
              {quizOptions.map((opt, optIndex) => (
                <button
                  key={`${opt.id}-${optIndex}`}
                  type="button"
                  className={clsx(
                    styles.quizOption,
                    picked &&
                      (opt.isCorrect
                        ? styles.quizOptionOk
                        : picked === opt.id
                          ? styles.quizOptionBad
                          : styles.quizOptionDim),
                  )}
                  disabled={!!picked}
                  onClick={() => handleQuizPick(opt)}
                >
                  {quizOptions.length > 1 && (
                    <span className={styles.quizOptionIndex}>{optIndex + 1}.</span>
                  )}
                  {opt.text}
                </button>
              ))}
            </div>
            {picked && (
              <div className={styles.actions}>
                <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={goNext}>
                  Далее
                </button>
              </div>
            )}
          </>
        )}

        {mode === 'type' && current && (
          <>
            <div className={styles.promptBlock}>
              <p className={styles.promptLabel}>{promptSide.label}</p>
              <p className={styles.promptText}>{promptSide.text}</p>
            </div>
            <form onSubmit={handleTypeSubmit}>
              <div className={styles.typeRow}>
                <input
                  ref={inputRef}
                  className={styles.typeInput}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  disabled={!!typeFeedback}
                  placeholder={direction === 'ru-en' ? 'Термин на английском' : 'Перевод на русском'}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={direction === 'ru-en' ? 'Термин на английском' : 'Перевод на русском'}
                />
                <button
                  type="submit"
                  className="it-demo__btn it-demo__btn--primary"
                  disabled={!typed.trim() || !!typeFeedback}
                >
                  Проверить
                </button>
              </div>
            </form>
            <p
              className={clsx(
                styles.feedback,
                typeFeedback === 'ok' && styles.feedbackOk,
                typeFeedback === 'bad' && styles.feedbackBad,
              )}
            >
              {typeFeedback === 'ok' && 'Верно!'}
              {typeFeedback === 'bad' && `Нужно: ${answerSide}`}
            </p>
            {typeFeedback && (
              <div className={styles.actions}>
                <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={goNext}>
                  Далее · Enter
                </button>
              </div>
            )}
          </>
        )}

        <button
          type="button"
          className={clsx('it-demo__btn', styles.btnBlockSpaced)}
          onClick={() => setScreen('setup')}
        >
          ← К настройкам
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default EnglishVocabularyTrainerInner;
