import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from './osPlays.module.css';

const ARCH_TYPES = [
  {
    id: 'monolithic',
    label: 'Монолитное',
    perf: 95,
    stability: 55,
    examples: 'Linux, Windows NT, FreeBSD',
    userModules: ['Приложения', 'Системные библиотеки'],
    kernelModules: ['Планировщик', 'Память', 'VFS', 'Сеть', 'Драйверы'],
    ipc: 'Прямой вызов функции в адресном пространстве ядра — минимум накладных расходов.',
    tradeoff: 'Высокая скорость; сбой драйвера может уронить всё ядро.',
  },
  {
    id: 'micro',
    label: 'Микроядро',
    perf: 45,
    stability: 92,
    examples: 'QNX, Minix, KasperskyOS',
    userModules: ['Файловая система', 'Драйверы', 'Сеть', 'Приложения'],
    kernelModules: ['IPC', 'Планировщик', 'Базовая память'],
    ipc: 'Почти всё — отдельные сервисы в user space; общение через сообщения.',
    tradeoff: 'Надёжность и изоляция; больше переключений контекста → ниже производительность.',
  },
  {
    id: 'hybrid',
    label: 'Гибридное',
    perf: 78,
    stability: 75,
    examples: 'macOS (XNU), Windows NT (частично)',
    userModules: ['Приложения', 'Часть подсистем'],
    kernelModules: ['Mach IPC', 'BSD-слой', 'I/O Kit', 'Драйверы в ядре'],
    ipc: 'Критичные пути в ядре, модульность через user-mode сервисы.',
    tradeoff: 'Баланс скорости и возможности обновлять компоненты.',
  },
];

function KernelArchitecturePlayInner() {
  const [archId, setArchId] = useState('monolithic');
  const arch = ARCH_TYPES.find((a) => a.id === archId) ?? ARCH_TYPES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архитектура ядра"
        subtitle="Где живут драйверы и ФС — определяет скорость системных вызовов и устойчивость к сбоям."
      >
        <div className={styles.tabs}>
          {ARCH_TYPES.map((a) => (
            <button
              key={a.id}
              type="button"
              className={clsx(styles.tab, archId === a.id && styles.tabActive)}
              onClick={() => setArchId(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className={styles.kernelDiagram}>
          <div className={clsx(styles.kernelBox, styles.kernelUser)}>
            <div style={{fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.35rem'}}>User mode</div>
            {arch.userModules.map((m) => (
              <span key={m} className={styles.kernelModule}>
                {m}
              </span>
            ))}
          </div>
          <div className={clsx(styles.kernelBox, styles.kernelCore)}>
            <div style={{fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.35rem'}}>Kernel mode</div>
            {arch.kernelModules.map((m) => (
              <span key={m} className={styles.kernelModule}>
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.kernelArrow}>syscall ↕ IPC</div>
        <p className={styles.hint}>{arch.ipc}</p>
        <p className={styles.mono}>Примеры: {arch.examples}</p>
        <p className={styles.hint}>{arch.tradeoff}</p>

        <div className={styles.kernelLatency}>
          <span style={{fontSize: '0.72rem', minWidth: '5.5rem'}}>Производительность</span>
          <div className={styles.latencyBar}>
            <div className={styles.latencyFill} style={{width: `${arch.perf}%`, background: '#1565c0'}} />
          </div>
        </div>
        <div className={styles.kernelLatency}>
          <span style={{fontSize: '0.72rem', minWidth: '5.5rem'}}>Изоляция / стабильность</span>
          <div className={styles.latencyBar}>
            <div className={styles.latencyFill} style={{width: `${arch.stability}%`, background: '#2e7d32'}} />
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default KernelArchitecturePlayInner;
