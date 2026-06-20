import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdBtn, CdHint, CdMono, CdStack, CdToolbar, CdVerdict} from '@/components/shared/kb/codeDevPlayKit';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

function SharedVsDistributedMemoryPlayInner() {
  const [mode, setMode] = useState('shared');
  const [log, setLog] = useState([]);

  const readX = () => {
    setLog(
      mode === 'shared'
        ? ['CPU0: read X → 42 (общая RAM)', 'CPU1: read X → 42 (тот же адрес)']
        : ['CPU0: read local X → 42', 'CPU1: recv copy → 42 (отдельная RAM)'],
    );
  };

  const writeX = () => {
    setLog(
      mode === 'shared'
        ? ['CPU0: X = 99', 'CPU1: read X → 99 (когерентность кэша)']
        : ['CPU0: local X = 99', 'CPU1: X всё ещё 42 — нужен MPI_Send'],
    );
  };

  return (
    <DemoShell>
      <DemoCard title="Shared vs Distributed memory" subtitle="OpenMP/потоки vs MPI/процессы">
        <CdStack>
          <div className={toolStyles.chips}>
            <button type="button" className={clsx(toolStyles.chip, mode === 'shared' && toolStyles.chipActive)} onClick={() => setMode('shared')}>
              Shared (OpenMP)
            </button>
            <button type="button" className={clsx(toolStyles.chip, mode === 'distributed' && toolStyles.chipActive)} onClick={() => setMode('distributed')}>
              Distributed (MPI)
            </button>
          </div>

          <pre className={styles.memoryDiagram}>
            {mode === 'shared'
              ? `┌ CPU0 ┐   ┌ CPU1 ┐\n   └──┬──┘\n      ▼\n [ RAM: X=42 ]`
              : `┌ CPU0 ┐     ┌ CPU1 ┐\n[RAM0] ←→ [RAM1]\n X=42       X=?`}
          </pre>

          <CdToolbar>
            <CdBtn onClick={readX}>Прочитать X</CdBtn>
            <CdBtn variant="primary" onClick={writeX}>
              CPU0 пишет X=99
            </CdBtn>
          </CdToolbar>

          {log.length ? (
            <>
              <CdMono>{log.join('\n')}</CdMono>
              <CdVerdict tone="info">
                {mode === 'shared'
                  ? 'Все ядра видят одну переменную — удобно, но нужна синхронизация.'
                  : 'Явная передача сообщений — дороже, но масштабируется на кластер.'}
              </CdVerdict>
            </>
          ) : (
            <CdHint>Выберите модель памяти и выполните операцию чтения или записи.</CdHint>
          )}
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default SharedVsDistributedMemoryPlayInner;
