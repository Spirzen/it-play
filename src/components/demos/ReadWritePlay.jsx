import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './dataBasicsPlay.module.css';

const FILE_CHARS = ['H', 'e', 'l', 'l', 'o'];

function ReadWritePlayInner() {
  const [pointer, setPointer] = useState(0);
  const [readMask, setReadMask] = useState([]);
  const [log, setLog] = useState([]);
  const [osCacheHit, setOsCacheHit] = useState(false);

  const pushLog = useCallback((msg) => {
    setLog((prev) => [...prev.slice(-5), msg]);
  }, []);

  const readBytes = (n) => {
    const end = Math.min(pointer + n, FILE_CHARS.length);
    const slice = [];
    for (let i = pointer; i < end; i++) {
      slice.push(i);
    }
    setReadMask((prev) => [...new Set([...prev, ...slice])]);
    const chars = slice.map((i) => FILE_CHARS[i]).join('');
    if (osCacheHit) {
      pushLog(`read(${n}): "${chars}" — из page cache (быстро)`);
    } else {
      pushLog(`read(${n}): "${chars}" — промах кэша ОС → диск`);
      setOsCacheHit(true);
    }
    setPointer(end);
  };

  const writeChar = (ch) => {
    pushLog(`write('${ch}'): указатель на ${pointer} → буфер ОС (отложенная запись)`);
    setPointer((p) => Math.min(p + 1, FILE_CHARS.length));
  };

  const seek = (pos) => {
    setPointer(pos);
    pushLog(`seek(${pos}): следующая операция с байта ${pos}`);
  };

  const reset = () => {
    setPointer(0);
    setReadMask([]);
    setOsCacheHit(false);
    setLog([]);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Чтение, запись и указатель файла"
        subtitle="Файл &quot;Hello&quot; — линейная лента байтов. Указатель сдвигается после каждой операции."
      >
        <div className={styles.fileTape}>
          {FILE_CHARS.map((ch, i) => (
            <div
              key={i}
              className={clsx(
                styles.fileCell,
                readMask.includes(i) && styles.fileCellRead,
                pointer === i && styles.fileCellPtr,
              )}
              title={`offset ${i}`}
            >
              {ch}
            </div>
          ))}
        </div>
        <span className={styles.pointerBadge}>file pointer = {pointer}</span>

        <div className={styles.toolbar} style={{display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.65rem'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => readBytes(2)}>
            read(2)
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => writeChar('!')}>
            write('!')
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => seek(0)}>
            seek(0)
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => readBytes(5)}>
            read до конца
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
            Сброс
          </button>
        </div>

        <div className={styles.log}>
          {log.length === 0 ? (
            <p className={styles.logLine}>Выполните read — увидите путь приложение → ОС → {osCacheHit ? 'кэш' : 'диск'}.</p>
          ) : (
            log.map((line, i) => (
              <p key={i} className={styles.logLine}>
                {line}
              </p>
            ))
          )}
        </div>
      </DemoCard>

      <DemoCard title="Два уровня буферизации" subtitle="Повторное чтение того же участка берёт данные из page cache.">
        <div className={styles.flowRow}>
          <span className={styles.flowNode}>Приложение</span>
          <span className={styles.flowArrow}>↔</span>
          <span className={clsx(styles.flowNode, osCacheHit && styles.flowNodeActive)}>Page cache (ОС)</span>
          <span className={styles.flowArrow}>↔</span>
          <span className={styles.flowNode}>Диск</span>
        </div>
        <p className={styles.hint}>
          Прикладной буфер (BufferedInputStream и аналоги) снижает число системных вызовов; системный буфер ускоряет
          повторные обращения к одному файлу.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ReadWritePlayInner;
