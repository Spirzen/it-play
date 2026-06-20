import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectMetrics,
  ProjectScopeBar,
  ProjectMeter,
  ProjectPanel,
  ProjectBtnRow,
  ProjectLog,
  ProjectMessage,
} from '@/components/shared/kb/projectPlayKit';

const CAPACITY = 20;
const REQUESTS = [
  {id: 'r1', text: '«Добавьте поле ИНН в форму»', points: 2},
  {id: 'r2', text: '«Сделайте экспорт в PDF — срочно к демо»', points: 5},
  {id: 'r3', text: '«Поменяйте цвет кнопки на корпоративный»', points: 1},
  {id: 'r4', text: '«Интеграция с внешним API без ТЗ»', points: 8},
];

function ScopeCreepSimulatorPlayInner() {
  const [scope, setScope] = useState(12);
  const [morale, setMorale] = useState(80);
  const [trust, setTrust] = useState(75);
  const [reqIdx, setReqIdx] = useState(0);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);

  const req = REQUESTS[reqIdx];
  const overCapacity = scope > CAPACITY;

  const respond = (accept) => {
    if (!req || done) return;
    const nextScope = accept ? scope + req.points : scope;
    const nextMorale = accept ? morale - 8 : morale + 2;
    const nextTrust = accept ? trust - 5 : trust + 4;
    setScope(nextScope);
    setMorale(Math.max(0, Math.min(100, nextMorale)));
    setTrust(Math.max(0, Math.min(100, nextTrust)));
    setLog((l) => [...l, `${accept ? 'Принято' : 'CR / отказ'}: ${req.text} (${req.points} SP)`]);
    if (reqIdx >= REQUESTS.length - 1) {
      setDone(true);
    } else {
      setReqIdx((i) => i + 1);
    }
  };

  const reset = () => {
    setScope(12);
    setMorale(80);
    setTrust(75);
    setReqIdx(0);
    setLog([]);
    setDone(false);
  };

  const moraleTone = morale < 50 ? 'error' : morale < 70 ? 'warn' : undefined;
  const trustTone = trust < 50 ? 'error' : trust < 65 ? 'warn' : undefined;

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Scope creep" subtitle="Fixed-price спринт: «это же мелочь»">
        <ProjectStack>
          <ProjectScopeBar scope={scope} capacity={CAPACITY} />

          <ProjectMetrics
            items={[
              {label: 'Scope (SP)', value: `${scope}/${CAPACITY}`, tone: overCapacity ? 'error' : undefined},
              {label: 'Мораль команды', value: morale, tone: moraleTone},
              {label: 'Доверие заказчика', value: trust, tone: trustTone},
            ]}
          />

          <ProjectMeter label="Мораль команды" value={morale} tone={moraleTone} />
          <ProjectMeter label="Доверие заказчика" value={trust} tone={trustTone} />

          {!done && req && (
            <>
              <ProjectPanel title="Запрос заказчика">
                <p className={s.panelMuted} style={{marginTop: '0.15rem'}}>
                  {req.text}
                </p>
                <p className={s.panelMuted} style={{marginTop: '0.25rem'}}>
                  Оценка: +{req.points} SP
                </p>
              </ProjectPanel>
              <ProjectBtnRow>
                <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => respond(false)}>
                  Оформить CR / отказ
                </button>
                <button type="button" className="it-demo__btn" onClick={() => respond(true)}>
                  «Ну ладно, мелочь»
                </button>
              </ProjectBtnRow>
            </>
          )}

          {done && (
            <ProjectMessage tone={overCapacity ? 'err' : morale > 70 ? 'ok' : 'warn'}>
              {overCapacity
                ? 'Scope превысил capacity — срок сорван, команда выгорела.'
                : morale > 70
                  ? 'Границы удержали — scope под контролем.'
                  : 'Формально уложились, но мораль пострадала.'}
            </ProjectMessage>
          )}

          <ProjectLog items={log} />

          <ProjectBtnRow>
            <button type="button" className="it-demo__btn" onClick={reset}>
              Сброс
            </button>
          </ProjectBtnRow>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default ScopeCreepSimulatorPlayInner;
