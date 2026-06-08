import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './programPlays.module.css';

const SYSCALL_STEPS = [
  {id: 'app', label: 'Приложение', detail: 'Вызов fopen() / File.ReadAllText() — из кода'},
  {id: 'libc', label: 'Библиотека (CRT/glibc)', detail: 'Высокоуровневый API готовит системный вызов'},
  {id: 'kernel', label: 'Ядро ОС', detail: 'Проверка прав, работа с VFS и драйвером диска'},
  {id: 'hw', label: 'Диск', detail: 'Физическое чтение блоков; ответ возвращается по цепочке'},
];

const MEMORY_SEGS = [
  {id: 'text', label: '.text', desc: 'Машинный код (RX)'},
  {id: 'data', label: '.data', desc: 'Глобальные переменные (RW)'},
  {id: 'bss', label: '.bss', desc: 'Нулевые статические данные'},
  {id: 'stack', label: 'Стек', desc: 'Локальные переменные, return'},
  {id: 'heap', label: 'Куча', desc: 'malloc / new во время работы'},
];

const PROC_STATES = [
  {id: 'new', label: 'Создание', detail: 'Загрузчик читает PE/ELF, выделяет память'},
  {id: 'ready', label: 'Готов', detail: 'Процесс в очереди планировщика'},
  {id: 'run', label: 'Выполнение', detail: 'CPU исполняет инструкции'},
  {id: 'wait', label: 'Ожидание', detail: 'Ждёт диск, сеть или ввод пользователя'},
  {id: 'done', label: 'Завершён', detail: 'Ресурсы освобождены, код возврата сохранён'},
];

function ProgramOsInteractionPlayInner() {
  const [flowStep, setFlowStep] = useState(0);
  const [memId, setMemId] = useState('text');
  const [stateId, setStateId] = useState('run');

  const advanceFlow = () => setFlowStep((s) => (s + 1) % SYSCALL_STEPS.length);
  const mem = MEMORY_SEGS.find((m) => m.id === memId) ?? MEMORY_SEGS[0];
  const state = PROC_STATES.find((s) => s.id === stateId) ?? PROC_STATES[2];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Программа и операционная система"
        subtitle="Системный вызов, память процесса и жизненный цикл — как приложение получает доступ к ресурсам."
      >
        <p className="it-demo__label" style={{marginTop: 0}}>
          Цепочка системного вызова (чтение файла)
        </p>
        <div className={styles.flowRow}>
          {SYSCALL_STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              {i > 0 && <span className={styles.flowArrow} aria-hidden>→</span>}
              <button
                type="button"
                className={clsx(styles.flowBox, flowStep === i && styles.flowBoxActive)}
                onClick={() => setFlowStep(i)}
              >
                {step.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <p style={{fontSize: '0.82rem', margin: '0 0 0.75rem'}}>{SYSCALL_STEPS[flowStep].detail}</p>
        <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={advanceFlow}>
          Следующий шаг
        </button>

        <p className="it-demo__label" style={{marginTop: '1rem'}}>
          Адресное пространство процесса
        </p>
        <div className={styles.memGrid}>
          {MEMORY_SEGS.map((seg) => (
            <button
              key={seg.id}
              type="button"
              className={clsx(styles.memSeg, memId === seg.id && styles.memSegActive)}
              onClick={() => setMemId(seg.id)}
            >
              <strong>{seg.label}</strong>
              <br />
              {seg.desc}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{mem.desc}. Процессы изолированы — один не читает память другого.</p>

        <p className="it-demo__label" style={{marginTop: '0.85rem'}}>
          Состояния процесса
        </p>
        <div className={styles.stateTrack}>
          {PROC_STATES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.stateChip, stateId === s.id && styles.stateChipActive)}
              onClick={() => setStateId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p style={{fontSize: '0.82rem', margin: 0}}>{state.detail}</p>
        <p className={styles.hint} style={{marginTop: '0.65rem', marginBottom: 0}}>
          JVM, CLR и Node.js — среды выполнения поверх ОС: они сами вызывают системные API, а код приложения работает
          внутри виртуальной машины.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ProgramOsInteractionPlayInner;
