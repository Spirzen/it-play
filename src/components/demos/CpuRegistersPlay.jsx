import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CpuRegistersPlay.module.css';

const REGS = [
  {id: 'RAX', role: 'Аккумулятор / возврат'},
  {id: 'RBX', role: 'Общего назначения'},
  {id: 'RCX', role: 'Счётчик / аргумент 4'},
  {id: 'RDX', role: 'Данные / аргумент 3'},
  {id: 'RDI', role: '1-й аргумент (this)'},
  {id: 'RSI', role: '2-й аргумент'},
  {id: 'RSP', role: 'Указатель стека'},
  {id: 'RBP', role: 'Указатель фрейма'},
  {id: 'RIP', role: 'Следующая инструкция'},
  {id: 'RFLAGS', role: 'Флаги (ZF, SF, CF…)'},
];

const PROGRAM = [
  {op: 'MOV', args: 'RAX, 5', effect: (s) => ({...s, RAX: '0x05', RFLAGS: '—'})},
  {op: 'MOV', args: 'RBX, 10', effect: (s) => ({...s, RBX: '0x0A'})},
  {op: 'ADD', args: 'RAX, RBX', effect: (s) => ({...s, RAX: '0x0F', RFLAGS: 'ZF=0'})},
  {op: 'CMP', args: 'RAX, 15', effect: (s) => ({...s, RFLAGS: 'ZF=1 (равно)'})},
  {op: 'JE', args: 'equal_label', effect: (s) => ({...s, RIP: 'equal_label'})},
];

const INITIAL = Object.fromEntries(REGS.map((r) => [r.id, '0x00']));

function CpuRegistersPlayInner() {
  const [regs, setRegs] = useState(INITIAL);
  const [pc, setPc] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [log, setLog] = useState('Нажмите "Шаг" — выполнится одна инструкция.');

  const stepInstr = useCallback(() => {
    if (pc >= PROGRAM.length) {
      setLog('Программа завершена. Сбросьте для повтора.');
      return;
    }
    const instr = PROGRAM[pc];
    setRegs((prev) => instr.effect(prev));
    setLog(`${instr.op} ${instr.args}`);
    setPc((p) => p + 1);
  }, [pc]);

  const reset = () => {
    setRegs(INITIAL);
    setPc(0);
    setAutoPlay(false);
    setLog('Сброс регистров и счётчика инструкций.');
  };

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = window.setInterval(() => {
      if (pc >= PROGRAM.length) {
        setAutoPlay(false);
        return;
      }
      stepInstr();
    }, 1200);
    return () => window.clearInterval(id);
  }, [autoPlay, pc, stepInstr]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Регистры x86-64"
        subtitle="MOV, ADD, CMP, JE — как CPU хранит операнды и флаги"
      >
        <div className={styles.layout}>
          <div className={styles.codeCol}>
            <div className={styles.codeHead}>Инструкции</div>
            {PROGRAM.map((ins, i) => (
              <div
                key={`${ins.op}-${i}`}
                className={clsx(styles.instr, pc === i && styles.instrActive)}
              >
                <span className={styles.op}>{ins.op}</span>
                <span>{ins.args}</span>
              </div>
            ))}
          </div>
          <div className={styles.regCol}>
            <div className={styles.codeHead}>Регистровый файл</div>
            {REGS.map((r) => (
              <div key={r.id} className={styles.regRow}>
                <code>{r.id}</code>
                <span className={styles.val}>{regs[r.id]}</span>
                <span className={styles.role}>{r.role}</span>
              </div>
            ))}
          </div>
        </div>

        <p className={styles.log}>{log}</p>

        <div className="it-demo__toolbar">
          <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={stepInstr} disabled={pc >= PROGRAM.length}>
            Шаг
          </button>
          <button
            type="button"
            className={clsx('it-demo__btn it-demo__btn--sm', autoPlay && 'it-demo__btn--secondary')}
            onClick={() => setAutoPlay((a) => !a)}
          >
            {autoPlay ? 'Стоп' : 'Авто'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={reset}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CpuRegistersPlayInner;
