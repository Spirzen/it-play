import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {UX_PAIRS} from '@/components/shared/kb/uiInterfaceDemoEngine';
import ui from '@/components/shared/kb/uiInterfaceDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function UiUxPrinciplesDemoInner() {
  const [principleId, setPrincipleId] = useState(UX_PAIRS[0].id);
  const [clicked, setClicked] = useState(false);
  const pair = UX_PAIRS.find((p) => p.id === principleId) ?? UX_PAIRS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Принципы UX и UI"
        subtitle="Сравните слабый и сильный вариант по ключевым принципам проектирования интерфейса."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {UX_PAIRS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(toolStyles.chip, principleId === p.id && toolStyles.chipActive)}
              onClick={() => {
                setPrincipleId(p.id);
                setClicked(false);
              }}
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className={ui.uxGrid}>
          <div>
            <div className={ui.uxLabel}>Слабый вариант</div>
            <div className={ui.uxBad}>{pair.bad}</div>
          </div>
          <div>
            <div className={ui.uxLabel}>Сильный вариант</div>
            <div className={ui.uxGood}>{pair.good}</div>
          </div>
        </div>

        {principleId === 'feedback' && (
          <div style={{marginTop: '1rem'}}>
            <p className="it-demo__label">Проверка обратной связи</p>
            <button
              type="button"
              className={ui.uiBtn}
              onClick={() => setClicked(true)}
              disabled={clicked}
            >
              {clicked ? '✓ Сохранено' : 'Сохранить черновик'}
            </button>
            {clicked && (
              <p className="it-demo__alert it-demo__alert--success" style={{marginTop: '0.5rem', marginBottom: 0}}>
                Пользователь сразу видит результат действия.
              </p>
            )}
          </div>
        )}

      </DemoCard>
    </DemoShell>
  );
}

export default UiUxPrinciplesDemoInner;
