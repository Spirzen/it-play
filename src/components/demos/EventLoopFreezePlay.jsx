import React, {useCallback, useRef, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdBtn, CdFreezeDemo, CdHint, CdStack, CdToolbar} from '@/components/shared/kb/codeDevPlayKit';

function EventLoopFreezePlayInner() {
  const [busy, setBusy] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [log, setLog] = useState([]);
  const timerRef = useRef(null);

  const append = useCallback((msg) => {
    setLog((l) => [...l.slice(-4), msg]);
  }, []);

  const blockMain = () => {
    setBusy(true);
    append('sync task ~2s');
    const start = performance.now();
    while (performance.now() - start < 2000) {
      /* intentional block */
    }
    append('sync done');
    setBusy(false);
  };

  const scheduleMicro = () => {
    append('Promise scheduled');
    Promise.resolve().then(() => append('microtask'));
  };

  const scheduleMacro = () => {
    append('setTimeout(0)');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => append('macrotask'), 0);
  };

  return (
    <DemoShell>
      <DemoCard title="Event Loop & UI freeze" subtitle="Синхронный код блокирует отрисовку и клики">
        <CdStack>
          <CdFreezeDemo
            frozen={busy}
            busy={busy}
            clicks={clicks}
            onClick={() => {
              setClicks((c) => c + 1);
              append('click');
            }}
            onHeavy={blockMain}
          />

          <CdToolbar>
            <CdBtn onClick={scheduleMicro} disabled={busy}>
              Microtask
            </CdBtn>
            <CdBtn onClick={scheduleMacro} disabled={busy}>
              Macrotask
            </CdBtn>
          </CdToolbar>

          {log.length > 0 && <CdHint>{log.join(' → ')}</CdHint>}

          <CdHint>
            Нажмите «Тяжёлый расчёт», затем быстро кликайте — UI не ответит, пока sync-цикл не завершится.
          </CdHint>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default EventLoopFreezePlayInner;
