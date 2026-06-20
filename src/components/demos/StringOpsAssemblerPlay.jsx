import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpActionBar,
  LpChip,
  LpChipRow,
  LpLog,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const MEM_INIT = ['H', 'e', 'l', 'l', 'o', '!', ' ', ' ', ' ', ' '];
const DEST_START = 5;

function StringOpsAssemblerPlayInner() {
  const [rsi, setRsi] = useState(0);
  const [rdi, setRdi] = useState(DEST_START);
  const [rcx, setRcx] = useState(6);
  const [df, setDf] = useState(0);
  const [mem, setMem] = useState(MEM_INIT);
  const [log, setLog] = useState('REP MOVSB — копирование 6 байт вперёд (CLD).');

  const reset = () => {
    setRsi(0);
    setRdi(DEST_START);
    setRcx(6);
    setDf(0);
    setMem([...MEM_INIT]);
    setLog('Сброс. RSI=источник, RDI=приёмник, RCX=счётчик.');
  };

  const step = useCallback(() => {
    if (rcx <= 0) {
      setLog('RCX = 0 — строковая операция завершена.');
      return;
    }
    const byte = mem[rsi];
    setMem((prev) => {
      const next = [...prev];
      next[rdi] = prev[rsi];
      return next;
    });
    const delta = df === 0 ? 1 : -1;
    setRsi((v) => v + delta);
    setRdi((v) => v + delta);
    setRcx((v) => v - 1);
    setLog(`MOVSB: '${byte}' → [${rdi}]; RSI/RDI ${df === 0 ? '+' : '-'}=1; RCX=${rcx - 1}`);
  }, [rcx, df, mem, rdi, rsi]);

  const runRep = () => {
    let r = rsi;
    let d = rdi;
    let c = rcx;
    const m = [...mem];
    const count = rcx;
    while (c > 0) {
      m[d] = m[r];
      r += df === 0 ? 1 : -1;
      d += df === 0 ? 1 : -1;
      c -= 1;
    }
    setMem(m);
    setRsi(r);
    setRdi(d);
    setRcx(0);
    setLog(`REP MOVSB × ${count} — блок скопирован.`);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Строковые инструкции x86"
        subtitle="MOVS / REP — RSI, RDI, RCX и флаг направления DF"
      >
        <LpStack>
          <LpChipRow>
            <LpChip active={df === 0} onClick={() => setDf(0)}>
              CLD — вперёд
            </LpChip>
            <LpChip active={df === 1} onClick={() => setDf(1)}>
              STD — назад
            </LpChip>
          </LpChipRow>

          <div className={styles.regBar}>
            <div className={styles.reg}>
              <span className={styles.regName}>RSI</span>
              <span className={styles.regVal}>{rsi}</span>
            </div>
            <div className={styles.reg}>
              <span className={styles.regName}>RDI</span>
              <span className={styles.regVal}>{rdi}</span>
            </div>
            <div className={styles.reg}>
              <span className={styles.regName}>RCX</span>
              <span className={styles.regVal}>{rcx}</span>
            </div>
            <div className={styles.reg}>
              <span className={styles.regName}>DF</span>
              <span className={styles.regVal}>{df === 0 ? '0' : '1'}</span>
            </div>
          </div>

          <LpSection label="Память">
            <div className={styles.memGrid}>
              {mem.map((ch, i) => (
                <div
                  key={i}
                  className={clsx(
                    styles.memCell,
                    i === rsi && styles.memCellSrc,
                    i === rdi && i !== rsi && styles.memCellDst,
                    i >= DEST_START && i < DEST_START + (6 - rcx) && rsi !== i && styles.memCellCopied,
                  )}
                >
                  <div>{i}</div>
                  <strong>{ch === ' ' ? '·' : ch}</strong>
                </div>
              ))}
            </div>
          </LpSection>

          <LpLog variant="info">{log}</LpLog>

          <LpActionBar>
            <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={step} disabled={rcx <= 0}>
              MOVSB
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={runRep} disabled={rcx <= 0}>
              REP MOVSB
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          </LpActionBar>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default StringOpsAssemblerPlayInner;
