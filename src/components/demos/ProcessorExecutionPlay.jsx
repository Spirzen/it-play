import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/ProcessorExecutionPlay.module.css';

const TABS = [
  {id: 'hierarchy', label: 'Иерархия памяти'},
  {id: 'stack', label: 'Стек и фрейм'},
  {id: 'call', label: 'Вызов метода'},
];

const LEVELS = [
  {id: 'reg', label: 'Регистры', ticks: 1, note: 'Самый быстрый уровень'},
  {id: 'l1', label: 'L1', ticks: 4, note: '~3–4 такта'},
  {id: 'l2', label: 'L2', ticks: 12, note: '~10 тактов'},
  {id: 'l3', label: 'L3', ticks: 40, note: '~40 тактов'},
  {id: 'ram', label: 'RAM', ticks: 200, note: '100–300+ тактов'},
  {id: 'disk', label: 'SSD/HDD', ticks: 800, note: 'миллионы тактов'},
];

const CALL_STEPS = [
  {id: 'src', label: 'obj.method()', active: ['code']},
  {id: 'compile', label: 'Компилятор → CALL + VTable', active: ['code', 'cpu']},
  {id: 'push', label: 'PUSH адрес возврата → стек', active: ['stack']},
  {id: 'frame', label: 'Фрейм: this, локальные', active: ['stack', 'heap']},
  {id: 'mmu', label: 'MMU: вирт. → физ.', active: ['mmu']},
  {id: 'cache', label: 'L1/L2/L3 или RAM', active: ['cache']},
  {id: 'ret', label: 'RET → восстановление RIP', active: ['stack', 'cpu']},
];

function ProcessorExecutionPlayInner() {
  const [tab, setTab] = useState('hierarchy');
  const [levelId, setLevelId] = useState('l1');
  const [callStep, setCallStep] = useState(0);
  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[1];
  const call = CALL_STEPS[callStep];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как процессор выполняет код"
        subtitle="Память, стек вызовов и путь от obj.method() до RET"
      >
        <div className="it-demo__tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'hierarchy' && (
          <>
            <div className={styles.hierarchy}>
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={clsx(styles.hRow, levelId === l.id && styles.hRowActive)}
                  onClick={() => setLevelId(l.id)}
                >
                  <span>{l.label}</span>
                  <span className={styles.ticks}>~{l.ticks} такт.</span>
                </button>
              ))}
            </div>
            <p className={styles.hint}>{level.note}</p>
          </>
        )}

        {tab === 'stack' && (
          <div className={styles.stackViz}>
            <div className={styles.stackGrow}>↑ растёт вниз</div>
            {[ 'RET → main+42', 'saved RBP', 'локальная x', 'локальная y', 'аргумент z' ].map(
              (row, i) => (
                <div
                  key={row}
                  className={clsx(styles.frameCell, i === 2 && styles.frameHighlight)}
                >
                  {row}
                </div>
              ),
            )}
            <p className={styles.hint}>
              Фрейм стека — блок на один вызов функции: параметры, локальные переменные, адрес
              возврата. При выходе указатель стека (RSP) сдвигается — память освобождается
              автоматически.
            </p>
          </div>
        )}

        {tab === 'call' && (
          <>
            <div className={styles.pipeline}>
              {['code', 'cpu', 'stack', 'heap', 'mmu', 'cache'].map((zone) => (
                <div
                  key={zone}
                  className={clsx(
                    styles.zone,
                    call.active.includes(zone) && styles.zoneActive,
                  )}
                >
                  {zone === 'code' && 'Код'}
                  {zone === 'cpu' && 'CPU / RIP'}
                  {zone === 'stack' && 'Стек'}
                  {zone === 'heap' && 'Куча'}
                  {zone === 'mmu' && 'MMU + TLB'}
                  {zone === 'cache' && 'Кэш L1–L3'}
                </div>
              ))}
            </div>
            <p className={styles.callLabel}>{call.label}</p>
            <div className="it-demo__toolbar">
              <button
                type="button"
                className="it-demo__btn it-demo__btn--sm"
                onClick={() => setCallStep((s) => Math.max(0, s - 1))}
              >
                ←
              </button>
              <span className={styles.stepCounter}>
                {callStep + 1} / {CALL_STEPS.length}
              </span>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--sm"
                onClick={() => setCallStep((s) => Math.min(CALL_STEPS.length - 1, s + 1))}
              >
                →
              </button>
            </div>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ProcessorExecutionPlayInner;
