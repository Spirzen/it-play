import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/Timer.module.css';

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function TimerInner({seconds: initialSeconds = 60}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) {
      clearTimer();
      return undefined;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimer();
  }, [running, clearTimer]);

  const reset = () => {
    setRunning(false);
    setSeconds(initialSeconds);
  };

  const done = seconds === 0 && !running;

  return (
    <DemoShell>
      <DemoCard
        title="Таймер для практики"
        subtitle="Компонент из MDX: обратный отсчёт, пауза и сброс">
        <div
          className={clsx(styles.display, done && styles.displayDone)}
          role="timer"
          aria-live="polite"
          aria-label={`Осталось ${seconds} секунд`}>
          {formatTime(seconds)}
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setRunning((r) => !r)}
            disabled={seconds === 0}>
            {running ? 'Пауза' : seconds === 0 ? 'Готово' : 'Старт'}
          </button>
          <button type="button" className={styles.btnSecondary} onClick={reset}>
            Сброс ({initialSeconds} с)
          </button>
        </div>
        {done && (
          <p className={styles.hint}>Время вышло — можно перезапустить таймер.</p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default TimerInner;
