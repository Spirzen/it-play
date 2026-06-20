import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectPanel,
  ProjectTimeline,
  ProjectChoiceList,
  ProjectMessage,
  ProjectLog,
  ProjectBtnRow,
} from '@/components/shared/kb/projectPlayKit';

const STEPS = [
  {id: 'alert', label: 'Алерт P1', desc: 'Мониторинг: 5xx &gt; 15%, latency p99 &gt; 3s'},
  {id: 'triage', label: 'Triage', desc: 'On-call подтверждает инцидент, открывает war room'},
  {id: 'mitigate', label: 'Mitigate', desc: 'Снизить влияние на пользователей'},
  {id: 'resolve', label: 'Resolve', desc: 'Устранить корневую причину или откатить'},
  {id: 'postmortem', label: 'Postmortem', desc: 'Blameless разбор, action items'},
];

const CHOICES = {
  alert: [
    {id: 'ack', label: 'Подтвердить алерт, создать тикет INC-001', mttr: 2, ok: true},
    {id: 'ignore', label: 'Подождать — может само пройдёт', mttr: 25, ok: false},
  ],
  triage: [
    {id: 'runbook', label: 'Открыть runbook, назначить IC', mttr: 5, ok: true},
    {id: 'debug', label: 'Сразу дебажить в prod без статуса', mttr: 18, ok: false},
  ],
  mitigate: [
    {id: 'rollback', label: 'Rollback последнего релиза', mttr: 8, ok: true},
    {id: 'scale', label: 'Только scale up, без отката', mttr: 14, ok: false},
  ],
  resolve: [
    {id: 'hotfix', label: 'Hotfix + canary deploy', mttr: 12, ok: true},
    {id: 'wait', label: 'Ждать полного RCA перед действием', mttr: 22, ok: false},
  ],
  postmortem: [
    {id: 'blameless', label: 'Timeline + 3 action items в трекер', mttr: 0, ok: true},
    {id: 'blame', label: 'Найти виноватого в чате', mttr: 0, ok: false},
  ],
};

function IncidentResponseSimulatorPlayInner() {
  const [stepIdx, setStepIdx] = useState(0);
  const [mttr, setMttr] = useState(0);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);

  const step = STEPS[stepIdx];
  const choices = CHOICES[step?.id] || [];

  const pick = (choice) => {
    setMttr((m) => m + choice.mttr);
    setLog((l) => [...l, `${step.label}: ${choice.label} ${choice.ok ? '✓' : '⚠'}`]);
    if (stepIdx >= STEPS.length - 1) {
      setDone(true);
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  const reset = () => {
    setStepIdx(0);
    setMttr(0);
    setLog([]);
    setDone(false);
  };

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Реагирование на P1" subtitle="Severity, MTTR и blameless postmortem">
        <ProjectStack>
          <ProjectPanel title={`MTTR (симуляция): ${mttr} мин`}>
            <p className={s.panelMuted} style={{marginTop: '0.15rem'}}>
              Цель зрелой команды — снижать MTTR через runbook и rollback, а не через «героизм».
            </p>
          </ProjectPanel>

          <ProjectTimeline steps={STEPS} currentIdx={stepIdx} done={done} />

          {!done && choices.length > 0 && (
            <>
              <p className="it-demo__label">Ваше действие на этапе «{step.label}»</p>
              <ProjectChoiceList choices={choices} onPick={pick} />
            </>
          )}

          {done && (
            <ProjectMessage tone={mttr <= 20 ? 'ok' : 'warn'}>
              Инцидент закрыт. Итоговый MTTR: {mttr} мин.{' '}
              {mttr <= 20 ? 'Хороший результат.' : 'Есть резерв для runbook и автоматизации.'}
            </ProjectMessage>
          )}

          <ProjectLog items={log} />

          <ProjectBtnRow>
            <button type="button" className="it-demo__btn" onClick={reset}>
              Начать заново
            </button>
          </ProjectBtnRow>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default IncidentResponseSimulatorPlayInner;
