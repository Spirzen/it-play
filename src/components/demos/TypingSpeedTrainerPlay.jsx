import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  TYPING_CATALOGS,
  TYPING_DURATIONS,
  analyzeTyping,
  calcTypingStats,
  formatDuration,
  getDurationById,
  getPresetById,
  getPresetsForCatalog,
  levelForCpm,
} from '@/components/shared/kb/typingSpeedEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/TypingSpeedTrainerPlay.module.css';

const STORAGE_KEY = 'it-typing-speed-best-v1';

function loadBest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBest(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function ChipRow({label, items, value, onChange, disabled}) {
  return (
    <>
      <p className={styles.sectionLabel}>{label}</p>
      <div className={styles.toolbar}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
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

function TypingSpeedTrainerPlayInner() {
  const [catalogId, setCatalogId] = useState('basic');
  const presets = useMemo(() => getPresetsForCatalog(catalogId), [catalogId]);
  const [presetId, setPresetId] = useState(() => getPresetsForCatalog('basic')[0].id);
  const [durationId, setDurationId] = useState('60');
  const [phase, setPhase] = useState('idle');
  const [typed, setTyped] = useState('');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingSec, setRemainingSec] = useState(null);
  const [finalStats, setFinalStats] = useState(null);
  const [best, setBest] = useState(loadBest);

  const inputRef = useRef(null);
  const startedAtRef = useRef(null);
  const tickRef = useRef(null);

  const preset = useMemo(
    () => getPresetById(presetId, catalogId),
    [presetId, catalogId],
  );

  const onCatalogChange = useCallback(
    (nextCatalogId) => {
      setCatalogId(nextCatalogId);
      setPresetId(getPresetsForCatalog(nextCatalogId)[0].id);
    },
    [],
  );
  const duration = useMemo(() => getDurationById(durationId), [durationId]);
  const target = preset.text;

  const analysis = useMemo(
    () => analyzeTyping(target, typed),
    [target, typed],
  );

  const liveStats = useMemo(() => {
    if (!startedAtRef.current && phase !== 'finished') {
      return null;
    }
    const ms = phase === 'finished' ? elapsedMs : Date.now() - startedAtRef.current;
    return calcTypingStats({
      elapsedMs: ms,
      correct: analysis.correct,
      errors: analysis.errors,
      targetLength: target.length,
    });
  }, [analysis.correct, analysis.errors, elapsedMs, phase, target.length]);

  const clearTimers = useCallback(() => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const finishTest = useCallback(() => {
    clearTimers();
    const ms = startedAtRef.current
      ? Date.now() - startedAtRef.current
      : Math.max(elapsedMs, 1);
    setElapsedMs(ms);
    const stats = calcTypingStats({
      elapsedMs: ms,
      correct: analysis.correct,
      errors: analysis.errors,
      targetLength: target.length,
    });
    const level = levelForCpm(stats.cpm);
    setFinalStats({...stats, level});
    setPhase('finished');
    setRemainingSec(0);

    const key = `${catalogId}-${presetId}-${durationId}`;
    setBest((prev) => {
      const record = prev[key];
      if (record && stats.cpm <= record.cpm) {
        return prev;
      }
      const next = {
        ...prev,
        [key]: {cpm: stats.cpm, wpm: stats.wpm, at: Date.now()},
      };
      saveBest(next);
      return next;
    });
  }, [
    analysis.correct,
    analysis.errors,
    clearTimers,
    durationId,
    elapsedMs,
    catalogId,
    presetId,
    target.length,
  ]);

  const startTest = useCallback(() => {
    clearTimers();
    setTyped('');
    setElapsedMs(0);
    setFinalStats(null);
    setPhase('running');
    startedAtRef.current = null;
    if (duration.seconds != null) {
      setRemainingSec(duration.seconds);
    } else {
      setRemainingSec(null);
    }
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [clearTimers, duration.seconds]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (phase !== 'running' || duration.seconds == null) return undefined;

    tickRef.current = window.setInterval(() => {
      if (!startedAtRef.current) return;
      const left = duration.seconds - (Date.now() - startedAtRef.current) / 1000;
      setRemainingSec(Math.max(0, left));
      if (left <= 0) {
        finishTest();
      }
    }, 200);

    return () => {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [duration.seconds, finishTest, phase]);

  useEffect(() => {
    if (phase === 'running' && duration.seconds == null && analysis.completed) {
      finishTest();
    }
  }, [analysis.completed, duration.seconds, finishTest, phase]);

  const onInput = (e) => {
    const value = e.target.value;
    if (phase === 'finished') return;

    if (phase === 'idle') {
      if (!value) return;
      setPhase('running');
      setFinalStats(null);
      startedAtRef.current = Date.now();
      if (duration.seconds != null) {
        setRemainingSec(duration.seconds);
      }
    }

    if (!startedAtRef.current) {
      startedAtRef.current = Date.now();
    }

    setTyped(value);
  };

  const renderReference = () => {
    const cursor = typed.length;
    return target.split('').map((ch, i) => {
      const mark = analysis.marks[i];
      let className = styles.charPending;
      if (mark?.state === 'ok') className = styles.charOk;
      else if (mark?.state === 'err') className = styles.charErr;
      else if (i === cursor && phase === 'running') className = styles.charCurrent;

      return (
        <span key={`${i}-${ch}`} className={className}>
          {ch}
        </span>
      );
    });
  };

  const bestKey = `${catalogId}-${presetId}-${durationId}`;
  const personalBest = best[bestKey];
  const displayStats = phase === 'finished' ? finalStats : liveStats;
  const level =
    phase === 'finished' && finalStats
      ? finalStats.level
      : displayStats
        ? levelForCpm(displayStats.cpm)
        : null;

  const configLocked = phase === 'running';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Тренажёр скорости печати"
        subtitle="Наберите текст ниже — демо посчитает знаков в минуту (зн/мин) и слов в минуту (слов/мин, по стандарту 5 символов на слово)."
      >
        <ChipRow
          label="Каталог"
          items={TYPING_CATALOGS}
          value={catalogId}
          onChange={onCatalogChange}
          disabled={configLocked}
        />
        <ChipRow
          label="Текст"
          items={presets}
          value={presetId}
          onChange={setPresetId}
          disabled={configLocked}
        />
        <p className={styles.hint}>{preset.hint}</p>

        <ChipRow
          label="Режим"
          items={TYPING_DURATIONS}
          value={durationId}
          onChange={setDurationId}
          disabled={configLocked}
        />

        <div className={styles.reference} aria-hidden="true">
          {renderReference()}
        </div>

        <textarea
          id="typing-speed-input"
          ref={inputRef}
          className={styles.input}
          value={typed}
          onChange={onInput}
          disabled={phase === 'finished'}
          aria-label="Поле для набора текста"
          placeholder={
            phase === 'idle'
              ? 'Нажмите "Начать" или начните печатать…'
              : 'Печатайте текст выше посимвольно…'
          }
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-describedby="typing-speed-legend"
        />

        {phase === 'running' && (
          <div className={styles.statsRow}>
            {duration.seconds != null && remainingSec != null && (
              <span
                className={clsx(
                  styles.timer,
                  remainingSec <= 10 && styles.timerUrgent,
                )}
              >
                Осталось: {formatDuration(remainingSec)}
              </span>
            )}
            {displayStats && (
              <>
                <span className={styles.stat}>
                  Сейчас: <strong>{displayStats.cpm}</strong> зн/мин
                </span>
                <span className={styles.stat}>
                  <strong>{displayStats.wpm}</strong> слов/мин
                </span>
                <span className={styles.stat}>
                  Точность: <strong>{displayStats.accuracy}%</strong>
                </span>
              </>
            )}
          </div>
        )}

        <div className={styles.actions}>
          {phase === 'idle' && (
            <button type="button" className={styles.btnPrimary} onClick={startTest}>
              Начать
            </button>
          )}
          {phase === 'running' && (
            <button type="button" className={styles.btn} onClick={finishTest}>
              Завершить
            </button>
          )}
          {(phase === 'running' || phase === 'finished') && (
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                clearTimers();
                setPhase('idle');
                setTyped('');
                setFinalStats(null);
                setRemainingSec(null);
                startedAtRef.current = null;
              }}
            >
              Сброс
            </button>
          )}
        </div>

        {phase === 'finished' && finalStats && (
          <div className={styles.results} role="status">
            <h5 className={styles.resultsTitle}>Результат</h5>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{finalStats.cpm}</span>
                <span className={styles.metricLabel}>зн/мин</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{finalStats.wpm}</span>
                <span className={styles.metricLabel}>слов/мин</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{finalStats.accuracy}%</span>
                <span className={styles.metricLabel}>точность</span>
              </div>
            </div>
            <p>
              Уровень: <span className={styles.levelBadge}>{finalStats.level.label}</span>
              {level && (
                <span>
                  {' '}
                  — ориентир для самопроверки; регулярная практика важнее одного замера.
                </span>
              )}
            </p>
            {personalBest && (
              <p className={styles.bestNote}>
                Личный рекорд в этом режиме: {personalBest.cpm} зн/мин (
                {personalBest.wpm} слов/мин)
              </p>
            )}
          </div>
        )}

        <p id="typing-speed-legend" className={styles.legend}>
          Зн/мин — верно набранные символы за минуту. Слов/мин: каждые 5 символов = 1 слово
          (международный стандарт typing test). Ошибки снижают точность, но не останавливают
          тест — как в обычных онлайн-тренажёрах.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TypingSpeedTrainerPlayInner;
