import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './executionPerfPlay.module.css';

const TABS = [
  {id: 'latency', label: 'Отклик (UX)'},
  {id: 'chain', label: 'Цепочка операций'},
  {id: 'memory', label: 'Стек и куча'},
];

function latencyLabel(ms) {
  if (ms <= 100) return {text: 'Ощущается мгновенно', cls: styles.perceptionOk};
  if (ms <= 1000) return {text: 'Заметная пауза', cls: styles.perceptionWarn};
  if (ms <= 3000) return {text: 'Раздражает пользователя', cls: styles.perceptionBad};
  return {text: 'Критично для UX', cls: styles.perceptionBad};
}

function LatencyTab() {
  const [ms, setMs] = useState(120);
  const perc = latencyLabel(ms);
  const pct = Math.min(100, (ms / 3000) * 100);

  return (
    <>
      <label className="it-demo__label" htmlFor="latency-ms">
        Задержка от клика до ответа: {ms} мс
      </label>
      <input
        id="latency-ms"
        type="range"
        min={0}
        max={5000}
        step={10}
        value={ms}
        onChange={(e) => setMs(Number(e.target.value))}
        className="it-demo__range"
        style={{width: '100%'}}
      />
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{
            width: `${pct}%`,
            background:
              ms <= 100 ? '#2e7d32' : ms <= 1000 ? '#ed6c02' : '#c62828',
          }}
        />
      </div>
      <p className={clsx(styles.perception, perc.cls)}>{perc.text}</p>
      <p className="it-demo__hint" style={{margin: 0}}>
        До 100 мс — "мгновенно", до 1 с — пауза, больше 3 с — портит опыт. Фоновая задача на 10 с
        может быть нормой, если пользователь об этом знает.
      </p>
    </>
  );
}

function ChainTab() {
  const [runs, setRuns] = useState(1000);
  const memMs = useMemo(() => Math.round(runs * 0.002 + 2), [runs]);
  const dbMs = useMemo(() => Math.round(runs * 4.5 + 50), [runs]);

  return (
    <>
      <label className="it-demo__label" htmlFor="chain-runs">
        Повторить операцию: {runs} раз
      </label>
      <input
        id="chain-runs"
        type="range"
        min={10}
        max={5000}
        step={10}
        value={runs}
        onChange={(e) => setRuns(Number(e.target.value))}
        className="it-demo__range"
        style={{width: '100%', marginBottom: '0.75rem'}}
      />
      <div className={styles.chainGrid}>
        <div className={styles.chainCard}>
          <h4>Чтение переменной из ОЗУ</h4>
          <div className={styles.chainTime} style={{color: '#1565c0'}}>
            ~{memMs} мс
          </div>
          <p className="it-demo__hint" style={{margin: 0}}>
            Много быстрых обращений к памяти — дешёво.
          </p>
        </div>
        <div className={styles.chainCard}>
          <h4>Функция с запросом в БД</h4>
          <div className={styles.chainTime} style={{color: '#c62828'}}>
            ~{dbMs} мс
          </div>
          <p className="it-demo__hint" style={{margin: 0}}>
            Каждый вызов — диск/сеть: цепочка "убивает" отклик.
          </p>
        </div>
      </div>
    </>
  );
}

function MemoryTab() {
  const [pushFrame, setPushFrame] = useState(true);
  const [allocObj, setAllocObj] = useState(false);

  return (
    <>
      <div className="it-demo__controls" style={{marginBottom: '0.75rem'}}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => setPushFrame((v) => !v)}
        >
          {pushFrame ? 'Снять фрейм стека' : 'Вызов функции (стек)'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => setAllocObj((v) => !v)}
        >
          {allocObj ? 'Освободить объект' : 'new Order() (куча)'}
        </button>
      </div>
      <div className={styles.memGrid}>
        <div className={styles.stackZone}>
          <strong>Стек</strong> — локальные переменные, адрес возврата
          {pushFrame ? (
            <>
              <div className={styles.frame}>main()</div>
              <div className={styles.frame}>ProcessOrder()</div>
              <div className={styles.frame}>order: ref → heap</div>
            </>
          ) : (
            <div className={styles.frame}>main()</div>
          )}
        </div>
        <div className={styles.heapZone}>
          <strong>Куча</strong> — объекты, массивы, долгоживущие данные
          {allocObj ? (
            <div className={styles.heapObj}>
              Order @ 0x1A40
              <div>items[], total, customerId</div>
            </div>
          ) : (
            <span style={{color: 'var(--demo-muted)', fontSize: '0.75rem'}}>Пусто</span>
          )}
        </div>
      </div>
      <p className="it-demo__hint" style={{marginTop: '0.65rem', marginBottom: 0}}>
        Стек ограничен и быстр; куча гибкая, но дороже в выделении и сборке мусора.
      </p>
    </>
  );
}

function ExecutionPerformancePlayInner() {
  const [tab, setTab] = useState('latency');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Производительность выполнения"
        subtitle="Отклик для пользователя, цепочки операций и модель памяти"
      >
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'latency' && <LatencyTab />}
        {tab === 'chain' && <ChainTab />}
        {tab === 'memory' && <MemoryTab />}
      </DemoCard>
    </DemoShell>
  );
}

export default ExecutionPerformancePlayInner;
