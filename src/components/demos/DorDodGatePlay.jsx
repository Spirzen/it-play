import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectPanel,
  ProjectCheckGrid,
  ProjectMessage,
} from '@/components/shared/kb/projectPlayKit';

const STORY = {
  title: 'SHOP-88: Фильтр заказов по дате и статусу',
  desc: 'Пользователь видит список заказов с фильтрами в личном кабинете.',
};

const DOR_ITEMS = [
  {id: 'dor1', label: 'Описана ценность для пользователя'},
  {id: 'dor2', label: 'Есть acceptance criteria'},
  {id: 'dor3', label: 'Макет / wireframe для UI'},
  {id: 'dor4', label: 'API контракт или sandbox готов'},
  {id: 'dor5', label: 'Зависимости согласованы'},
];

const DOD_ITEMS = [
  {id: 'dod1', label: 'Код в main, PR прошёл review'},
  {id: 'dod2', label: 'Unit-тесты написаны и зелёные'},
  {id: 'dod3', label: 'CI pipeline успешен'},
  {id: 'dod4', label: 'Документация / release note обновлены'},
  {id: 'dod5', label: 'QA проверил AC на staging'},
];

function DorDodGatePlayInner() {
  const [dor, setDor] = useState({});
  const [dod, setDod] = useState({});

  const toggle = (set, id) => set((state) => ({...state, [id]: !state[id]}));

  const dorOk = DOR_ITEMS.every((i) => dor[i.id]);
  const dodOk = DOD_ITEMS.every((i) => dod[i.id]);
  const dorCount = DOR_ITEMS.filter((i) => dor[i.id]).length;
  const dodCount = DOD_ITEMS.filter((i) => dod[i.id]).length;

  const verdict = useMemo(() => {
    if (!dorOk && dodCount === 0) return {text: 'Задача не готова к старту — заполните DoR.', tone: 'warn'};
    if (dorOk && !dodOk) return {text: 'Можно начинать разработку. DoD ещё не выполнен.', tone: 'ok'};
    if (dorOk && dodOk) return {text: 'Готово к релизу по DoD команды.', tone: 'ok'};
    if (!dorOk && dodCount > 0) return {text: 'Вернули в backlog: начали без DoR — типичный источник переделок.', tone: 'err'};
    return {text: 'Отметьте пункты чек-листа.', tone: 'warn'};
  }, [dorOk, dodOk, dodCount]);

  return (
    <DemoShell className={s.root}>
      <DemoCard title="DoR и DoD" subtitle="Definition of Ready / Done для user story">
        <ProjectStack>
          <ProjectPanel title={STORY.title}>
            <p className={s.panelMuted} style={{marginTop: '0.15rem'}}>
              {STORY.desc}
            </p>
          </ProjectPanel>

          <ProjectCheckGrid
            columns={[
              {
                title: 'DoR',
                checked: dorCount,
                total: DOR_ITEMS.length,
                items: DOR_ITEMS.map((i) => ({
                  id: i.id,
                  label: i.label,
                  checked: !!dor[i.id],
                  onChange: () => toggle(setDor, i.id),
                })),
              },
              {
                title: 'DoD',
                checked: dodCount,
                total: DOD_ITEMS.length,
                items: DOD_ITEMS.map((i) => ({
                  id: i.id,
                  label: i.label,
                  checked: !!dod[i.id],
                  onChange: () => toggle(setDod, i.id),
                })),
              },
            ]}
          />

          <ProjectMessage tone={verdict.tone}>{verdict.text}</ProjectMessage>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default DorDodGatePlayInner;
