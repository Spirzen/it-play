import React, {useState} from 'react';
import {
  ActionBar,
  BarMeter,
  Hint,
  MetricGrid,
  Panel,
  PlayRoot,
} from '@/components/shared/dataMarkupPlayKit';

export default function VacuumBloatPlay() {
  const [dead, setDead] = useState(30);
  const live = 100 - dead;
  const bloat = ((dead / (dead + live)) * 100).toFixed(1);

  return (
    <PlayRoot title="VACUUM и bloat" subtitle="Dead tuples занимают место до VACUUM">
      <BarMeter live={live} dead={dead} liveLabel="Live tuples" deadLabel="Dead tuples" />
      <ActionBar stretch>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => setDead(0)}>
          VACUUM
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setDead((d) => Math.min(90, d + 10))}>
          UPDATE (+dead)
        </button>
      </ActionBar>
      <MetricGrid items={[{label: 'Bloat', value: `${bloat}%`, tone: Number(bloat) > 20 ? 'error' : 'success'}]} />
      <Panel title="AUTOVACUUM" muted>
        autovacuum запускает VACUUM при превышении порога dead tuples на таблице.
      </Panel>
      <Hint>После массовых UPDATE/DELETE без VACUUM таблица «раздувается» — место не возвращается ОС сразу.</Hint>
    </PlayRoot>
  );
}
