import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdHint, CdPipeline, CdStack, CdStepControls, CdVerdict} from '@/components/shared/kb/codeDevPlayKit';

const STAGES = [
  {id: 'idea', title: 'Идея', artifact: 'User story, MVP, метрики'},
  {id: 'design', title: 'Дизайн', artifact: 'Wireframes, UI-kit'},
  {id: 'frontend', title: 'Frontend', artifact: 'React, routing, a11y'},
  {id: 'backend', title: 'Backend', artifact: 'API, auth, БД'},
  {id: 'devops', title: 'CI/CD', artifact: 'Tests, staging, deploy'},
  {id: 'monitor', title: 'Monitor', artifact: 'Logs, metrics, alerts'},
];

function WebProjectPipelinePlayInner() {
  const [current, setCurrent] = useState('idea');
  const [done, setDone] = useState([]);

  const idx = STAGES.findIndex((s) => s.id === current);
  const stage = STAGES[idx];

  const complete = () => {
    if (!done.includes(current)) setDone((d) => [...d, current]);
    if (idx < STAGES.length - 1) setCurrent(STAGES[idx + 1].id);
  };

  const reset = () => {
    setCurrent('idea');
    setDone([]);
  };

  return (
    <DemoShell>
      <DemoCard title="Pipeline веб-проекта" subtitle="От идеи до production — пошаговый чеклист">
        <CdStack>
          <CdPipeline stages={STAGES} current={current} done={done} onSelect={setCurrent} label="Этапы" />

          <CdHint>{stage.artifact}</CdHint>

          <CdStepControls
            step={idx}
            total={STAGES.length}
            canPrev={idx > 0}
            canNext={idx < STAGES.length - 1}
            onPrev={() => setCurrent(STAGES[Math.max(0, idx - 1)].id)}
            onNext={() => setCurrent(STAGES[Math.min(STAGES.length - 1, idx + 1)].id)}
            onComplete={complete}
            onReset={reset}
            completeLabel={idx === STAGES.length - 1 ? 'Завершить проект' : 'Готово → далее'}
          />

          {done.length === STAGES.length && (
            <CdVerdict tone="success">Все этапы пройдены — типичный путь full-stack команды.</CdVerdict>
          )}
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default WebProjectPipelinePlayInner;
