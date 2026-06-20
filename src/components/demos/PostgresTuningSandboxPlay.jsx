import React, {useMemo, useState} from 'react';
import {
  Hint,
  MetricGrid,
  Panel,
  PlayRoot,
  SliderRow,
} from '@/components/shared/dataMarkupPlayKit';

export default function PostgresTuningSandboxPlay() {
  const [sharedBuffers, setSharedBuffers] = useState(128);
  const [workMem, setWorkMem] = useState(4);
  const [maxConn, setMaxConn] = useState(100);

  const stats = useMemo(() => {
    const sharedMb = sharedBuffers;
    const workTotal = workMem * maxConn;
    const warning = workTotal > sharedMb * 4 ? 'work_mem × connections может исчерпать RAM' : 'OK';
    return {sharedMb, workTotal, warning, tone: workTotal > sharedMb * 4 ? 'error' : 'success'};
  }, [sharedBuffers, workMem, maxConn]);

  return (
    <PlayRoot title="PostgreSQL — tuning" subtitle="shared_buffers, work_mem, max_connections — оценка памяти">
      <SliderRow label="shared_buffers (MB)" value={sharedBuffers} displayValue={`${sharedBuffers} MB`} min={64} max={8192} step={64} onChange={setSharedBuffers} />
      <SliderRow label="work_mem (MB)" value={workMem} displayValue={`${workMem} MB`} min={1} max={256} step={1} onChange={setWorkMem} />
      <SliderRow label="max_connections" value={maxConn} displayValue={String(maxConn)} min={10} max={500} step={10} onChange={setMaxConn} />
      <MetricGrid
        items={[
          {label: 'shared_buffers', value: `${stats.sharedMb} MB`},
          {label: 'worst-case work_mem', value: `${stats.workTotal} MB`},
          {label: 'Hint', value: stats.warning, tone: stats.tone},
        ]}
      />
      <Panel title="Правило" muted>
        work_mem выделяется на операцию сортировки/хеша — не умножайте на connections наивно для prod.
      </Panel>
      <Hint>Это упрощённая модель для интуиции, не замена pg_tune.</Hint>
    </PlayRoot>
  );
}
