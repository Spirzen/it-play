import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectPanel,
  ProjectCodeBlock,
  ProjectToggleGroup,
  ProjectBtnRow,
  ProjectMessage,
} from '@/components/shared/kb/projectPlayKit';

const SNIPPETS = [
  {
    id: 's1',
    title: 'OrderService',
    code: `class OrderService {
  createOrder() { /* ... */ }
  sendEmail() { /* SMTP */ }
  generatePdf() { /* report */ }
}`,
    cohesion: 'low',
    coupling: 'low',
    explain: 'Разные причины изменения в одном классе — низкая связность. Сцепление с окружением пока низкое.',
  },
  {
    id: 's2',
    title: 'PaymentValidator',
    code: `class PaymentValidator {
  validate(card) {
    return Db.users.find(u => u.card === card)
      && Http.post('/fraud', card);
  }
}`,
    cohesion: 'high',
    coupling: 'high',
    explain: 'Одна задача (валидация), но жёсткие зависимости от БД и HTTP — высокое сцепление.',
  },
  {
    id: 's3',
    title: 'PriceCalculator',
    code: `class PriceCalculator {
  total(items, discountRules) {
    return items.reduce(...);
  }
}`,
    cohesion: 'high',
    coupling: 'low',
    explain: 'Идеал: одна ответственность, чистая функция без скрытых зависимостей.',
  },
];

const COH_OPTIONS = [
  {id: 'high', label: 'Высокая'},
  {id: 'low', label: 'Низкая'},
];
const COUP_OPTIONS = [
  {id: 'high', label: 'Высокое'},
  {id: 'low', label: 'Низкое'},
];

function CohesionCouplingLabPlayInner() {
  const [idx, setIdx] = useState(0);
  const [coh, setCoh] = useState(null);
  const [coup, setCoup] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const snip = SNIPPETS[idx];
  const correct = checked && coh === snip.cohesion && coup === snip.coupling;

  const check = () => {
    if (!coh || !coup) return;
    setChecked(true);
    if (coh === snip.cohesion && coup === snip.coupling) setScore((v) => v + 1);
  };

  const next = () => {
    setIdx((i) => (i + 1) % SNIPPETS.length);
    setCoh(null);
    setCoup(null);
    setChecked(false);
  };

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Связность и сцепление" subtitle="Оцените модуль по коду">
        <ProjectStack>
          <div className={s.statusRow}>
            <strong>{snip.title}</strong>
            <span className={s.scoreBadge}>
              Счёт: {score}/{SNIPPETS.length}
            </span>
          </div>

          <ProjectCodeBlock>{snip.code}</ProjectCodeBlock>

          <ProjectToggleGroup
            label="Связность (cohesion)"
            options={COH_OPTIONS}
            value={coh}
            onChange={setCoh}
            disabled={checked}
          />

          <ProjectToggleGroup
            label="Сцепление (coupling)"
            options={COUP_OPTIONS}
            value={coup}
            onChange={setCoup}
            disabled={checked}
          />

          {!checked && (
            <ProjectBtnRow>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={check} disabled={!coh || !coup}>
                Проверить
              </button>
            </ProjectBtnRow>
          )}

          {checked && (
            <ProjectPanel>
              <ProjectMessage tone={correct ? 'ok' : 'err'}>{correct ? 'Верно!' : 'Не совпало — см. разбор:'}</ProjectMessage>
              <p className={s.panelMuted} style={{marginTop: '0.35rem'}}>
                {snip.explain}
              </p>
              <p className={s.panelMuted} style={{marginTop: '0.35rem'}}>
                Эталон: связность {snip.cohesion === 'high' ? 'высокая' : 'низкая'}, сцепление{' '}
                {snip.coupling === 'high' ? 'высокое' : 'низкое'}.
              </p>
              <ProjectBtnRow>
                <button type="button" className="it-demo__btn" onClick={next}>
                  Следующий фрагмент
                </button>
              </ProjectBtnRow>
            </ProjectPanel>
          )}
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default CohesionCouplingLabPlayInner;
