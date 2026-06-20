import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpActionBar,
  LpChip,
  LpChipRow,
  LpCode,
  LpLog,
  LpPanel,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const ACTIONS = [
  {
    id: 'move',
    label: 'move',
    short: 'let s2 = s1',
    log: 's1 перемещён в s2 — s1 больше недействителен.',
    state: {s1: 'moved', s2: 'owns "hello"', borrows: []},
    error: null,
  },
  {
    id: 'borrow',
    label: '&T',
    short: 'let r = &s2',
    log: 'Неизменяемая ссылка r читает s2 — владелец остаётся s2.',
    state: {s1: '—', s2: 'owns "hello"', borrows: ['&r → s2 (shared read)']},
    error: null,
  },
  {
    id: 'mut_borrow',
    label: '&mut T',
    short: 'let m = &mut s2',
    log: 'Единственная &mut — эксклюзивный доступ к s2.',
    state: {s1: '—', s2: 'owns "hello"', borrows: ['&mut m → s2 (exclusive)']},
    error: null,
  },
  {
    id: 'conflict',
    label: 'конфликт',
    short: '& + &mut',
    log: '',
    state: null,
    error: 'error[E0502]: cannot borrow `s2` as mutable because it is also borrowed as immutable',
  },
];

function BorrowCheckerPlayInner() {
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const current = ACTIONS[step] ?? ACTIONS[ACTIONS.length - 1];
  const display = current.state ?? history[history.length - 1]?.state ?? {s1: '—', s2: '—', borrows: []};

  const apply = (idx) => {
    const act = ACTIONS[idx];
    setStep(idx);
    if (act.state) setHistory((h) => [...h, act]);
  };

  const reset = () => {
    setStep(0);
    setHistory([]);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Borrow checker"
        subtitle="Владение, move, &T и &mut T — правила Rust на одном String"
      >
        <LpStack>
          <LpCode>{`let s1 = String::from("hello");
let s2 = s1;           // move
let r = &s2;           // shared borrow
let m = &mut s2;       // exclusive — конфликт с r`}</LpCode>

          <LpSection label="Операция">
            <LpChipRow>
              {ACTIONS.map((a, i) => (
                <LpChip key={a.id} active={step === i} onClick={() => apply(i)} title={a.short}>
                  {a.label}
                </LpChip>
              ))}
            </LpChipRow>
          </LpSection>

          <div className={styles.split}>
            <LpSection label="Владельцы">
              <div className={styles.ownerGrid}>
                <div className={clsx(styles.ownerBox, display.s1 === 'moved' && styles.ownerBoxInvalid)}>
                  <div className={styles.ownerLabel}>s1</div>
                  {display.s1}
                </div>
                <div className={styles.ownerBox}>
                  <div className={styles.ownerLabel}>s2</div>
                  {display.s2}
                </div>
              </div>
            </LpSection>
            <LpSection label="Ссылки">
              <LpPanel>
                {display.borrows.length === 0 ? (
                  <p className={styles.typeMuted}>Нет заимствований</p>
                ) : (
                  <ul className={styles.borrowList}>
                    {display.borrows.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </LpPanel>
            </LpSection>
          </div>

          <LpLog variant={current.error ? 'error' : 'info'}>{current.error ?? current.log}</LpLog>

          <LpActionBar>
            <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          </LpActionBar>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default BorrowCheckerPlayInner;
